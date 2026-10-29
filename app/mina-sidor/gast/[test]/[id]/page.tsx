import Link from "next/link";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { adapterForSlug, consentVersion, flags } from "../../../../_lib/testAccounts/adapter";
import { guestForProduct } from "../../../../_lib/testAccounts/service.server";
import { browserCookie } from "../../../../_lib/testAccounts/http.server";
import { accountIdentity } from "../../../../_lib/accountHttp.server";
import ReportView from "../../../tester/ReportView";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function GuestTest({ params }: { params: Promise<{ test: string; id: string }> }) {
  const { test, id } = await params;
  let model;
  try { model = adapterForSlug(test); } catch { notFound(); }
  let checked;
  try { checked = await guestForProduct(id, (await cookies()).get(browserCookie)?.value ?? "", model.product); }
  catch { return <main className="mx-auto max-w-3xl space-y-4 px-5 py-12"><h1 className="text-2xl font-semibold">Analysen kan inte öppnas just nu</h1><p>Öppna i webbläsaren där köpet gjordes. Betalningen kan fortfarande behandlas; försök ladda om om en stund. Gästanalysen sparas i sju dagar. Du behöver inte köpa igen.</p><Link href="/mina-sidor/tester">Till Mina sidor</Link></main>; }
  const identity = await accountIdentity();
  return <main data-nosnippet className="mx-auto max-w-3xl space-y-5 px-5 py-12">
    <h1 className="text-3xl font-semibold">Din köpta {model.title}-analys</h1>
    <p>Köpet är verifierat. Du kan läsa analysen utan konto i den här webbläsaren till {checked.row.expires_at.toLocaleDateString("sv-SE")}.</p>
    {flags(model.product).save && <section className="space-y-4 rounded-2xl border p-5"><h2 className="text-xl font-semibold">Vill du spara analysen på ditt konto?</h2>
      {identity.kind === "authenticated" ? <form action={`/api/test-accounts/${model.slug}/save`} method="post" className="space-y-4">
        <p>Sparas för {identity.email}. Krypterade svar används för att återskapa analysen i högst tolv månader. Du kan radera analysen tidigare. Köphistoriken sparas separat.</p>
        <input type="hidden" name="id" value={id} />
        <label className="flex items-start gap-3"><input type="checkbox" required name="consent" value={consentVersion} />Jag väljer frivilligt och samtycker uttryckligen till att mina svar och min {model.title}-analys, som kan innehålla uppgifter om hälsa, sparas på mitt konto. Jag kan återkalla samtycket genom att radera analysen.</label>
        <p><Link className="underline" href="/mina-sidor/tester/integritet">Läs om lagring, radering och dina rättigheter</Link></p>
        <button className="rounded-xl bg-[#27666A] px-5 py-3 font-semibold text-white">Spara analysen på mitt konto</button>
      </form> : <p><Link className="underline" href="/logga-in">Logga in</Link> och återvänd till denna sida i samma webbläsare, eller välj ditt köp under Mina sidor → Mina tester. Att läsa analysen här kräver inget konto.</p>}
    </section>}
    <ReportView product={model.product} result={checked.result} />
  </main>;
}
