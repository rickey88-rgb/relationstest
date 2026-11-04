import type { Metadata } from "next";
import Link from "next/link";
import { getLegalIdentity } from "../_content/legalIdentity";

export const metadata: Metadata = {
  title: "Juridisk information | Relationsvarning.se",
  description: "Ansvar för Relationsvarning.se och kontakt i juridiska frågor och integritetsfrågor.",
  alternates: { canonical: "https://www.relationsvarning.se/juridisk-information" },
  robots: {
    index: false,
    follow: true,
    googleBot: { index: false, follow: true },
  },
};

export default function LegalInformationPage() {
  const legalIdentity = getLegalIdentity();
  return (
    <main className="mx-auto max-w-3xl px-5 py-12 text-neutral-900 sm:px-6 sm:py-16">
      <header className="mb-8 space-y-4">
        <p className="text-sm font-medium text-neutral-500">Relationsvarning.se</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Juridisk information</h1>
        <p className="max-w-2xl leading-7 text-neutral-600">
          Här hittar du uppgifter om vem som ansvarar för Relationsvarning.se och hur du kontaktar oss.
        </p>
      </header>

      <div className="space-y-8 rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">
        <section aria-labelledby="legal-responsibility" className="space-y-3">
          <h2 id="legal-responsibility" className="text-lg font-semibold">Verksamhetsansvarig och personuppgiftsansvarig</h2>
          <p data-nosnippet className="leading-7">{legalIdentity.name}</p>
          {legalIdentity.organizationNumber && <p className="leading-7">Organisationsnummer: {legalIdentity.organizationNumber}</p>}
          {legalIdentity.postalAddress && <p data-nosnippet className="whitespace-pre-line leading-7">{legalIdentity.postalAddress}</p>}
          <p className="text-sm leading-6 text-neutral-600">Relationsvarning.se är webbplatsens varumärke.</p>
        </section>

        <section aria-labelledby="legal-contact" className="space-y-3 border-t border-neutral-100 pt-6">
          <h2 id="legal-contact" className="text-lg font-semibold">Kontakt</h2>
          <p className="leading-7 text-neutral-600">För frågor om webbplatsen, dina köp eller behandling av personuppgifter:</p>
          <a href={`mailto:${legalIdentity.email}`} className="inline-flex min-h-11 items-center break-all rounded-sm text-neutral-900 underline decoration-neutral-400 underline-offset-4 hover:decoration-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">
            {legalIdentity.email}
          </a>
        </section>
      </div>

      <nav aria-label="Relaterad information" className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-neutral-600">
        <Link href="/integritet" className="inline-flex min-h-11 items-center rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">Integritetspolicy</Link>
        <Link href="/villkor" className="inline-flex min-h-11 items-center rounded-sm underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">Villkor</Link>
      </nav>
    </main>
  );
}
