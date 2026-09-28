import type { Metadata } from "next";
import Link from "next/link";
import TestShell from "../../_components/TestShell";

export const metadata: Metadata = {
  title: "HSP-test för vuxna | Relationsvarning",
  description: "Besvara 30 frågor om högkänslighet, intryck, känslor och återhämtning.",
  alternates: { canonical: "https://www.relationsvarning.se/hsp-test" },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <TestShell><main className="mx-auto max-w-3xl px-4 py-8 text-neutral-900 sm:px-6 sm:py-12 [&:has([data-hsp-result])_[data-test-intro]]:hidden">
    <header><nav aria-label="Testnavigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600"><Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">Till Relationsvarning</Link><Link href="/hsp-test" className="inline-flex min-h-11 items-center underline underline-offset-4">Om HSP-testet</Link></nav><h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">HSP-test för vuxna</h1><div data-test-intro><p className="mt-5 leading-7 text-neutral-700">Svara utifrån hur du vanligtvis reagerar på intryck, känslor och vardagssituationer. Välj det svar som passar bäst för dig.</p><p className="mt-4 text-sm leading-6 text-neutral-600">30 frågor · sex områden · svaren sparas lokalt i den här webbläsaren.</p></div></header>{children}<p className="mt-8 text-sm leading-6 text-neutral-600">HSP/högkänslighet är inte en medicinsk eller psykiatrisk diagnos. Testet är en självskattning av drag relaterade till hög känslighet.</p>
  </main></TestShell>;
}
