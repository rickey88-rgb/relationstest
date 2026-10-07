import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { AUTISM_BOOK_ACCESS_COOKIE, verifyBookAccessToken } from "../../../_lib/bookAccess.server";
import { AUTISM_BOOK } from "../../../_lib/bookProducts.server";
import EditorialSurface from "../../../_components/EditorialSurface";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AutismBookThankYouPage() {
  const cookieStore = await cookies();
  const hasAccess = Boolean(verifyBookAccessToken(cookieStore.get(AUTISM_BOOK_ACCESS_COOKIE)?.value ?? null, AUTISM_BOOK.id));

  return (
    <EditorialSurface>
      <main data-rv="container" className="mx-auto max-w-2xl px-4 py-10 text-neutral-900 sm:px-6 sm:py-14">
        <section className="rounded-[28px] border border-[#DDE8E3] bg-[#EFF5F2] px-5 py-8 shadow-sm sm:px-9 sm:py-12">
          {hasAccess ? <>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Köpet är klart</p>
            <h1 className="mt-3">Tack för ditt köp</h1>
            <p className="mt-4 text-lg leading-8 text-neutral-700">Din åtkomst till {AUTISM_BOOK.name} är klar i den här webbläsaren.</p>
            <a href="/api/books/autism-bok/download" className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#27666A] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#1F5357] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#27666A] sm:w-auto">Ladda ner boken</a>
            <p className="mt-4 text-sm leading-6 text-neutral-700">På mobilen: När boken öppnas, tryck på Dela och välj Spara i Filer eller Böcker för att behålla den på telefonen.</p>
            <p className="mt-2 text-xs leading-5 text-neutral-600">Tips: Spara boken på din enhet när den öppnas så har du den kvar och kan läsa den när du vill.</p>
            <p className="mt-4 text-sm leading-6 text-neutral-600">Om du byter webbläsare eller rensar cookies kan support hjälpa dig att återställa åtkomsten manuellt.</p>
          </> : <>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Åtkomst saknas</p>
            <h1 className="mt-3">Vi kunde inte bekräfta bokåtkomsten</h1>
            <p className="mt-4 leading-7 text-neutral-700">Öppna länken från Stripe igen eller kontakta supporten med din betalningsbekräftelse så hjälper vi dig.</p>
            <Link href="/autism-bok" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-center font-semibold text-neutral-900 transition hover:bg-neutral-100">Tillbaka till boken</Link>
          </>}
        </section>
      </main>
    </EditorialSurface>
  );
}
