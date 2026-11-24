import type Stripe from "stripe";
import { sendTransactionalRecoveryEmail } from "./audhdRecoveryEmail.server";
import { applicationOrigin, validLoginEmail } from "./authConfig.server";
import { LITE_AUTISM_BOOK } from "./liteAutismBook";
import { issueBookEmailLink } from "./liteAutismProof.server";
import { verifiedLiteAutismSession } from "./overthinkingBook.server";

export async function deliverLiteAutismEmail(stripe: Stripe, sessionId: string) {
  if (!sessionId.startsWith("cs_live_")) return;
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (session.metadata?.rv_lite_autism_email === "sent" || !await verifiedLiteAutismSession(stripe, session, true)) return;
  const to = validLoginEmail(session.customer_details?.email ?? null);
  if (!to) throw new Error("Verified ebook checkout is missing an email address");
  const token = issueBookEmailLink(session.id, session.created);
  const url = new URL(LITE_AUTISM_BOOK.api + "/download", applicationOrigin());
  url.searchParams.set("email", token);
  await sendTransactionalRecoveryEmail({
    to,
    idempotencyKey: `lite-autism-book/${session.id}`,
    subject: `Din e-bok: ${LITE_AUTISM_BOOK.title}`,
    text: `Hej!

Tack för ditt köp av ${LITE_AUTISM_BOOK.title} av ${LITE_AUTISM_BOOK.author}.

Hämta din PDF här:
${url.href}

Länken gäller i 30 dagar. Du kan också logga in med samma mejladress som vid köpet och hitta boken under Mitt bibliotek på Mina sidor.

Trevlig läsning!
Relationsvarning`,
  });
  // Resend's stable key covers concurrent retries until Stripe stores this durable marker.
  await stripe.checkout.sessions.update(session.id, { metadata: { rv_lite_autism_email: "sent", rv_book_ga4: "" } });
}
