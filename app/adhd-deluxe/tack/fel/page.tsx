import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../../../_components/EditorialSurface";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function AdhdDeluxeThankYouErrorPage() {
  return <EditorialSurface>
    <main className="mx-auto max-w-2xl px-4 py-10 text-[#202124] sm:px-6 sm:py-14">
      <section className="rounded-[28px] border border-[#DDE8E3] bg-[#EFF5F2] px-5 py-8 shadow-sm sm:px-9 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Köpet behöver kontrolleras</p>
        <h1 className="mt-3">Vi kunde inte bekräfta bokåtkomsten</h1>
        <p className="mt-4 leading-7 text-neutral-700">Om betalningen precis genomfördes kan du öppna länken från Stripe igen. Kontakta annars supporten med din betalningsbekräftelse så hjälper vi dig.</p>
        <Link href="/adhd-deluxe" className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl border border-neutral-300 bg-white px-5 py-3 text-center font-semibold text-[#202124] transition hover:bg-neutral-100">Tillbaka till ADHD Deluxe</Link>
      </section>
    </main>
  </EditorialSurface>;
}
