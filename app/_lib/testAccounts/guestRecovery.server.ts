import { createHmac, randomBytes } from "node:crypto";
import { db, attempt, type Attempt } from "./store.server";
import { secretHash } from "./crypto.server";
import { stripeClient, verifyPayment } from "./payment.server";
import { active, notErased } from "./service.server";

export const guestRecoveryEnabled = () => process.env.TEST_GUEST_RECOVERY_ENABLED === "true";
export function normalizedPurchaseEmail(value: unknown) {
  if(typeof value!=="string")return null;
  const email=value.trim().toLowerCase();
  return email.length<=254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)?email:null;
}
export function recoveryEmailHash(email: string) {
  const key=process.env.TEST_ACCOUNTS_ENCRYPTION_KEY ?? "";
  if(!/^[A-Za-z0-9_-]{43}$/.test(key))throw Error("Recovery unavailable");
  return createHmac("sha256",Buffer.from(key,"base64url")).update("guest-recovery-email-v1\0"+email).digest("hex");
}
export function assertRecoverable(row: Attempt | null) {
  if(!row || new Date(row.expires_at).getTime()<=Date.now())throw Error("Recovery unavailable");
  return row;
}
function enabled(){if(!guestRecoveryEnabled())throw Error("Recovery unavailable");active();}

/** Metadata only. Can also seed retained NEW-flow payments before enabling recovery.
 * No answers are imported, decrypted, copied or linked to an account. */
export async function indexGuestRecovery(sessionId: string) {
  enabled();
  const stripe=stripeClient(),session=await stripe.checkout.sessions.retrieve(sessionId);
  if(session.metadata?.rv_flow!=="direct_customer_v1"||!session.client_reference_id?.startsWith("ta:"))throw Error("Recovery unavailable");
  const row=assertRecoverable(await attempt(session.client_reference_id.slice(3)));
  if(row.session_id!==session.id)throw Error("Recovery unavailable");
  await notErased(row.analysis_id,row.journal_identity);await verifyPayment(row,stripe);
  const email=normalizedPurchaseEmail(session.customer_details?.email);
  if(!email)throw Error("Recovery unavailable");
  const digest=recoveryEmailHash(email);
  await db()`insert into public.test_guest_recovery(attempt_id,email_hash,expires_at)
    select id,${digest},expires_at from public.test_account_attempts a where id=${row.id} and expires_at>now()
      and not exists(select 1 from public.test_account_purchases p where p.id=a.id)
      and not exists(select 1 from public.test_account_erasure_receipts e where e.generation_id=a.analysis_id)
    on conflict(attempt_id) do nothing`;
}

type Grant={attempt_id:string;email_hash:string;token_expires_at:Date;browser_hash_at_issue:string};
/** Only the verified Stripe address receives a bearer link; the request returns no IDs or tokens. */
export async function requestGuestRecovery(value: unknown) {
  enabled();const email=normalizedPurchaseEmail(value);if(!email)return;
  const digest=recoveryEmailHash(email),key=process.env.RESEND_API_KEY?.trim(),from=process.env.AUDHD_RECOVERY_EMAIL_FROM?.trim();
  if(!key||!from)throw Error("Recovery mail unavailable");
  const rows=await db()<Array<{attempt_id:string}>>`select r.attempt_id from public.test_guest_recovery r
    join public.test_account_attempts a on a.id=r.attempt_id
    where r.email_hash=${digest} and r.expires_at>now() and a.expires_at>now()
      and (r.send_count<3 or r.window_started_at<now()-interval '1 hour')
      and (r.token_expires_at is null or r.token_expires_at<=now())
      and (r.last_sent_at is null or r.last_sent_at<now()-interval '1 minute')
      and not exists(select 1 from public.test_account_purchases p where p.id=a.id)
    order by a.created_at desc limit 5`;
  for(const item of rows){
    try {
    const row=assertRecoverable(await attempt(item.attempt_id));
    await notErased(row.analysis_id,row.journal_identity);await verifyPayment(row);
    const session=await stripeClient().checkout.sessions.retrieve(row.session_id);
    const destination=normalizedPurchaseEmail(session.customer_details?.email);
    if(!destination||recoveryEmailHash(destination)!==digest)continue;
    const token=randomBytes(32).toString("base64url"),hash=secretHash(token);
    const grant=await db().begin(async tx=>{
      const locked=await tx<Attempt[]>`select * from public.test_account_attempts where id=${row.id} and expires_at>now() for update`;
      if(locked[0]?.browser_hash!==row.browser_hash||locked[0]?.session_id!==row.session_id)return null;
      return (await tx<Grant[]>`update public.test_guest_recovery r set token_hash=${hash},
        token_expires_at=least(r.expires_at,now()+interval '15 minutes'),browser_hash_at_issue=${row.browser_hash},last_sent_at=now(),
        send_count=case when window_started_at<now()-interval '1 hour' then 1 else send_count+1 end,
        window_started_at=case when window_started_at<now()-interval '1 hour' then now() else window_started_at end
        where attempt_id=${row.id} and email_hash=${digest} and r.expires_at>now()
          and (send_count<3 or window_started_at<now()-interval '1 hour')
          and (token_expires_at is null or token_expires_at<=now())
          and (last_sent_at is null or last_sent_at<now()-interval '1 minute')
          and not exists(select 1 from public.test_account_purchases p where p.id=r.attempt_id)
          and not exists(select 1 from public.test_account_erasure_receipts e where e.generation_id=${row.analysis_id})
        returning attempt_id,email_hash,token_expires_at,browser_hash_at_issue`)[0]??null;
    });
    if(!grant)continue;
    // Fragment is stripped by the browser before any navigation. No test/product name or answers in mail.
    const link="https://www.relationsvarning.se/mina-sidor#recover?token="+token;
    const response=await fetch("https://api.resend.com/emails",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json","Idempotency-Key":"guest-recovery/"+hash},
      body:JSON.stringify({from,to:[destination],subject:"Återöppna din köpta analys",text:"Du har begärt att återöppna din köpta analys på Relationsvarning.se.\n\n"+link+"\n\nLänken kan användas en gång och gäller i högst 15 minuter, dock aldrig längre än analysens ursprungliga giltighetstid. Tryck på Öppna min analys på sidan. Konto krävs inte.\n\nOm du inte begärde detta kan du bortse från mejlet. Dela inte länken.\n\nsupport@relationsvarning.se"}),signal:AbortSignal.timeout(8000)});
    if(!response.ok){
      await db()`update public.test_guest_recovery set token_hash=null,token_expires_at=null,browser_hash_at_issue=null
        where attempt_id=${row.id} and token_hash=${hash}`;
      throw Error("Recovery mail unavailable");
    }
    } catch { console.error(JSON.stringify({event:"guest_recovery_delivery_failed"})); }
  }
}

/** Explicit POST only. Mail scanners cannot consume a fragment or GET. */
export async function redeemGuestRecovery(token: unknown) {
  enabled();if(typeof token!=="string"||!/^[A-Za-z0-9_-]{43}$/.test(token))throw Error("Recovery unavailable");
  const hash=secretHash(token);
  const grants=await db()<Grant[]>`select attempt_id,email_hash,token_expires_at,browser_hash_at_issue from public.test_guest_recovery
    where token_hash=${hash} and token_expires_at>now() and expires_at>now()`;
  const grant=grants[0];if(!grant)throw Error("Recovery unavailable");
  const row=assertRecoverable(await attempt(grant.attempt_id));
  if(row.browser_hash!==grant.browser_hash_at_issue)throw Error("Recovery unavailable");
  await notErased(row.analysis_id,row.journal_identity);await verifyPayment(row);
  const session=await stripeClient().checkout.sessions.retrieve(row.session_id);
  const email=normalizedPurchaseEmail(session.customer_details?.email);
  if(!email||recoveryEmailHash(email)!==grant.email_hash)throw Error("Recovery unavailable");
  const secret=randomBytes(32).toString("base64url");
  await db().begin(async tx=>{
    const locked=await tx<Attempt[]>`select * from public.test_account_attempts where id=${row.id} and expires_at>now() for update`;
    if(locked[0]?.browser_hash!==row.browser_hash||locked[0]?.session_id!==row.session_id)throw Error("Recovery unavailable");
    const consumed=await tx`update public.test_guest_recovery r set token_hash=null,token_expires_at=null,browser_hash_at_issue=null
      where attempt_id=${row.id} and token_hash=${hash} and token_expires_at>now() and expires_at>now()
        and browser_hash_at_issue=${row.browser_hash} and email_hash=${grant.email_hash}
        and not exists(select 1 from public.test_account_purchases p where p.id=r.attempt_id)
        and not exists(select 1 from public.test_account_erasure_receipts e where e.generation_id=${row.analysis_id}) returning attempt_id`;
    if(consumed.length!==1)throw Error("Recovery unavailable");
    await tx`update public.test_account_attempts set browser_hash=${secretHash(secret)} where id=${row.id}`;
  });
  await notErased(row.analysis_id,row.journal_identity);
  return {id:row.id,product:row.product,secret};
}
