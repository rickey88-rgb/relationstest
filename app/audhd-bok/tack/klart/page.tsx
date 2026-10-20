import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import { BOOK_ACCESS_COOKIE, verifyBookAccessToken } from "../../../_lib/bookAccess.server";
import { AUDHD_BOOK } from "../../../_lib/bookProducts.server";
import EditorialSurface from "../../../_components/EditorialSurface";
import PostPurchaseRecommendation from "../../../_components/PostPurchaseRecommendation";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default async function AudhdBookThankYouPage() {
  const cookieStore = await cookies();
  const hasAccess = Boolean(verifyBookAccessToken(cookieStore.get(BOOK_ACCESS_COOKIE)?.value ?? null, AUDHD_BOOK.id));

  return (
    <EditorialSurface>
      <main data-rv="container" className="mx-auto max-w-2xl px-4 py-10 text-neutral-900 sm:px-6 sm:py-14">
        <section className="rounded-[28px] border border-[#DDE8E3] bg-[#EFF5F2] px-5 py-8 shadow-sm sm:px-9 sm:py-12">
          {hasAccess ? <>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Köpet är klart</p>
            <h1 className="mt-3">Tack för ditt köp</h1>
            <p className="mt-4 text-lg leading-8 text-neutral-700">Din åtkomst till {AUDHD_BOOK.name} är klar i den här webbläsaren.</p>
            <a href="/api/books/audhd-bok/download" className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#27666A] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#1F5357] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#27666A] sm:w-auto">Ladda ner boken</a>
            <div className="mt-5 space-y-3 text-sm leading-6 text-neutral-700">
              <p>Boken är en PDF. När du trycker på knappen kan den öppnas direkt eller sparas på telefonen.</p>
              <p><strong>iPhone:</strong> Om boken öppnas, tryck på Dela och välj ”Spara i Filer” eller ”Böcker”. Om den hämtas, leta under Hämtade filer i Safari eller appen Filer.</p>
              <p><strong>Android:</strong> Om boken öppnas, använd nedladdnings- eller delningsknappen för att spara den. Om den hämtas, leta under Hämtade filer i webbläsaren eller telefonens filapp.</p>
              <p>Hittar du inte boken? Gå tillbaka till den här sidan och tryck på ”Ladda ner boken” igen. Du behöver inte betala igen. Kontakta <a href="mailto:support@relationsvarning.se" className="underline underline-offset-4">support@relationsvarning.se</a> om du behöver hjälp.</p>
              <p>Om du byter webbläsare eller rensar cookies kan support hjälpa dig att återställa åtkomsten manuellt.</p>
            </div>
            <PostPurchaseRecommendation sourceProduct="audhd_book" />
          </> : <>
            <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Åtkomst saknas</p>
            <h1 className="mt-3">Vi kunde inte bekräfta bokåtkomsten</h1>
            <p className="mt-4 leading-7 text-neutral-700">Öppna länken från Stripe igen eller kontakta supporten med din betalningsbekräftelse så hjälper vi dig.</p>
            <Link href="/audhd-bok" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-center font-semibold text-neutral-900 transition hover:bg-neutral-100">Tillbaka till boken</Link>
          </>}
        </section>
      </main>
    </EditorialSurface>
  );
}
