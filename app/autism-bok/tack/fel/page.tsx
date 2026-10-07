import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../../../_components/EditorialSurface";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AutismBookPaymentVerificationErrorPage() {
  return (
    <EditorialSurface>
      <main data-rv="container" className="mx-auto max-w-2xl px-4 py-10 text-neutral-900 sm:px-6 sm:py-14">
        <section className="rounded-[28px] border border-[#DDE8E3] bg-[#EFF5F2] px-5 py-8 shadow-sm sm:px-9 sm:py-12">
          <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Köpet kunde inte verifieras</p>
          <h1 className="mt-3">Vi kan inte öppna boken ännu</h1>
          <p className="mt-4 leading-7 text-neutral-700">Betalningen kan vara pågående, avbruten eller sakna en giltig köpreferens. Om du har betalat, öppna bekräftelselänken från Stripe igen eller kontakta supporten med din betalningsbekräftelse.</p>
          <Link href="/autism-bok" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-center font-semibold text-neutral-900 transition hover:bg-neutral-100">Tillbaka till boken</Link>
        </section>
      </main>
    </EditorialSurface>
  );
}
