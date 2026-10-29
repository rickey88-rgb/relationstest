import type { Metadata } from "next";
import Link from "next/link";
import { requestMagicLink } from "./actions";
import { notFound } from "next/navigation";
import { accountPortalEnabled } from "../_lib/accountLaunch.server";

export const metadata: Metadata = {
  title: "Logga in – Relationsvarning",
  robots: { index: false, follow: false },
};

type LoginPageProps = { searchParams: Promise<{ status?: string }> };

function statusMessage(status: string | undefined) {
  if (status === "sent") return "Om adressen kan ta emot inloggningslänkar har vi skickat ett mejl. Kontrollera inkorgen och skräpposten. Länken gäller i en timme och fungerar även om du öppnar mejlet på en annan enhet.";
  if (status === "invalid-link") return "Länken är ogiltig, förbrukad eller har gått ut. Begär en ny länk nedan.";
  if (status === "unavailable") return "Inloggningen är tillfälligt otillgänglig. Försök igen om en stund.";
  return null;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (!accountPortalEnabled()) notFound();
  const { status } = await searchParams;
  const message = statusMessage(status);
  return (
    <main className="mx-auto min-h-screen max-w-xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Relationsvarning.se</p>
      <h1 className="mt-3 text-3xl font-semibold">Logga in till Mina sidor</h1>
      <p className="mt-4 leading-7 text-neutral-700">Inloggning är frivillig. Du behöver inte skapa konto för att göra ett test eller genomföra ett köp.</p>
      {status === "sent" && message ? (
        <section role="status" aria-labelledby="link-sent-title" className="mt-6 rounded-2xl border border-[#cbd9d1] bg-[#edf3ef] p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span aria-hidden="true" className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-lg font-semibold text-[#27666A]">✓</span>
            <div>
              <h2 id="link-sent-title" className="text-lg font-semibold">Kolla din mejl</h2>
              <p className="mt-1 leading-7 text-neutral-700">{message}</p>
            </div>
          </div>
          <ol className="mt-4 space-y-2 border-t border-[#cbd9d1] pt-4 pl-5 text-sm leading-6 text-neutral-700 marker:font-semibold">
            <li>Öppna mejlet från Relationsvarning och tryck på inloggningslänken.</li>
            <li>Om mejlet dröjer, kontrollera skräpposten och att adressen blev rättstavad.</li>
            <li>Om länken har gått ut kan du skicka en ny från formuläret nedan.</li>
          </ol>
        </section>
      ) : message ? (
        <p role="alert" className="mt-6 rounded-xl border border-neutral-300 bg-neutral-50 p-4 leading-7">{message}</p>
      ) : null}
      <form action={requestMagicLink} className="mt-8 space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <label className="block font-medium" htmlFor="email">Mejladress</label>
        <input className="w-full rounded-lg border border-neutral-400 px-3 py-3" id="email" name="email" type="email" autoComplete="email" inputMode="email" required maxLength={254} />
        <button className="rounded-xl bg-[#27666A] px-5 py-3 font-semibold text-white" type="submit">Skicka inloggningslänk</button>
      </form>
      <p className="mt-6 text-sm leading-6 text-neutral-600">Länken är personlig och kan användas en gång. Om den inte öppnar Mina sidor kan du begära en ny här.</p>
      <Link className="mt-6 inline-block text-sm underline underline-offset-4" href="/">Till startsidan</Link>
    </main>
  );
}
