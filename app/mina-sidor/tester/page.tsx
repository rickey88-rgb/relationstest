import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { accountIdentity } from "../../_lib/accountHttp.server";
import { adapter, flags, registeredAdapters } from "../../_lib/testAccounts/adapter";
import { active } from "../../_lib/testAccounts/service.server";
import { attempt, list } from "../../_lib/testAccounts/store.server";
import { matchesSecret } from "../../_lib/testAccounts/crypto.server";
import { browserCookie } from "../../_lib/testAccounts/http.server";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function TestLibrary() {
  const identity = await accountIdentity();
  if (identity.kind !== "authenticated") redirect("/logga-in");
  let purchases: Array<Awaited<ReturnType<typeof list>>[number]> = [], unavailable = false;
  const enabledTests = registeredAdapters().filter(model => flags(model.product).read || flags(model.product).save);
  const enabled = enabledTests.length > 0;
  try { if (enabled) { active(); purchases = await list(identity.userId); } } catch { unavailable = true; }
  return <main className="mx-auto max-w-3xl space-y-6 px-5 py-12">
    <Link href="/mina-sidor">← Mina sidor</Link><h1 className="text-3xl font-semibold">Mina tester</h1>
    {unavailable && <p role="status">Testbiblioteket är tillfälligt otillgängligt. Dina tidigare köp påverkas inte.</p>}
    {!enabled && <p>Kontosparning för fler tester kommer senare.</p>}
    {enabled && !unavailable && purchases.length === 0 && <p>{enabledTests.length === 1 && enabledTests[0].product === "adhd_test" ? "Du har ännu inte sparat någon ADHD-analys." : "Du har ännu inte sparat någon analys."} Öppna din verifierade köpta analys för att välja kontosparning.</p>}
    {purchases.map(p => { const model = adapter(p.product); return <section key={p.id} className="space-y-3 rounded-2xl border p-5">
      <h2 className="text-xl font-semibold">{model.title} – personlig analys</h2><p>Köpt {p.purchased_at.toLocaleDateString("sv-SE")}</p>
      {p.expires_at && p.expires_at > new Date() ? <><p>Sparad till {p.expires_at.toLocaleDateString("sv-SE")}</p><Link className="underline" href={`/mina-sidor/tester/${model.slug}/${p.id}`}>Öppna analys</Link>
        <form action={`/api/test-accounts/${model.slug}/delete`} method="post"><input type="hidden" name="id" value={p.id} /><button className="underline">Radera analysen och återkalla lagringssamtycket</button></form></>
        : <p>Ingen tillgänglig sparad analys. Köphistoriken finns kvar.</p>}
    </section>; })}
    <BrowserPurchases />
  </main>;
}
async function BrowserPurchases() {
  if (!registeredAdapters().some(model => flags(model.product).save)) return null;
  const secret = (await cookies()).get(browserCookie)?.value;
  if (!secret) return null;
  try {
    active();
    const { db } = await import("../../_lib/testAccounts/store.server");
    const { secretHash } = await import("../../_lib/testAccounts/crypto.server");
    const ids = await db()<Array<{ id: string }>>`select id from public.test_account_attempts
      where browser_hash = ${secretHash(secret)} and expires_at > now() and session_id is not null order by created_at desc limit 10`;
    const rows = [];
    for (const { id } of ids) { const row = await attempt(id); if (row && flags(row.product).save && matchesSecret(secret, row.browser_hash)) rows.push(row); }
    return rows.length ? <section className="space-y-3 rounded-2xl border p-5"><h2 className="text-xl font-semibold">Nyligen påbörjade köp i den här webbläsaren</h2><p>Öppna för att kontrollera betalningen och välja om analysen ska sparas.</p>{rows.map(row => { const model = adapter(row.product); return <p key={row.id}><Link className="underline" href={`/mina-sidor/gast/${model.slug}/${row.id}`}>Öppna {model.title}-köpet</Link></p>; })}</section> : null;
  } catch { return null; }
}
