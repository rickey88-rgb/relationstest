import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { BOOK_ACCESS_COOKIE, verifyBookAccessToken } from "../../../_lib/bookAccess.server";
import { AUDHD_BOOK } from "../../../_lib/bookProducts.server";
import EditorialSurface from "../../../_components/EditorialSurface";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AudhdBookThankYouPage() {
  const cookieStore = await cookies();
  const hasAccess = Boolean(verifyBookAccessToken(cookieStore.get(BOOK_ACCESS_COOKIE)?.value ?? null, AUDHD_BOOK.id));

  return (
    <EditorialSurface>
      <main data-rv="container" className="mx-auto max-w-2xl px-4 py-10 text-neutral-900 sm:px-6 sm:py-14">
        <section className="rounded-[28px] border border-[#d7e0d6] bg-[#f7fbf6] px-5 py-8 shadow-sm sm:px-9 sm:py-12">
          {hasAccess ? <>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#576f60]">Köpet är klart</p>
            <h1 className="mt-3">Tack för ditt köp</h1>
            <p className="mt-4 text-lg leading-8 text-neutral-700">Din åtkomst till {AUDHD_BOOK.name} är klar i den här webbläsaren.</p>
            <a href="/api/books/audhd-bok/download" className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#9d5663] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#844451] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#576f60] sm:w-auto">Ladda ner boken</a>
            <p className="mt-4 text-sm leading-6 text-neutral-600">Spara gärna PDF-filen efter nedladdningen. Om du byter webbläsare eller rensar cookies kan support hjälpa dig att återställa åtkomsten manuellt.</p>
          </> : <>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#9d5663]">Åtkomst saknas</p>
            <h1 className="mt-3">Vi kunde inte bekräfta bokåtkomsten</h1>
            <p className="mt-4 leading-7 text-neutral-700">Öppna länken från Stripe igen eller kontakta supporten med din betalningsbekräftelse så hjälper vi dig.</p>
            <Link href="/audhd-bok" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-center font-semibold text-neutral-900 transition hover:bg-neutral-100">Tillbaka till boken</Link>
          </>}
        </section>
      </main>
    </EditorialSurface>
  );
}
