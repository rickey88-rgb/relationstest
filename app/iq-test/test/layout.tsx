import type { Metadata } from "next";
import Link from "next/link";
import TestShell from "../../_components/TestShell";

export const metadata: Metadata = {
  title: "IQ-test – 40 frågor om logik och kognitiv förmåga | Relationsvarning",
  description: "Gör ett IQ-test med 40 frågor om mönster, logik, siffror, språk och spatial förmåga. Få ett IQ-estimat direkt.",
  alternates: { canonical: "https://www.relationsvarning.se/iq-test/test" },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <TestShell><main className="mx-auto max-w-3xl px-4 py-8 text-neutral-900 sm:px-6 sm:py-12"><header><nav aria-label="Testnavigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600"><Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">Till Relationsvarning</Link><Link href="/iq-test" className="inline-flex min-h-11 items-center underline underline-offset-4">Om IQ-testet</Link></nav><h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">IQ-test</h1><div data-test-intro><p className="mt-5 leading-7 text-neutral-700">Svara utan hjälpmedel och välj det alternativ som bäst löser uppgiften. Frågorna går igenom mönster, logik, siffror, språk och rumsuppfattning.</p><p className="mt-4 text-sm leading-6 text-neutral-600">40 frågor · fem områden · svaren sparas lokalt i den här webbläsaren.</p></div></header>{children}<p className="mt-8 text-sm leading-6 text-neutral-600">Det här är Relationsvarnings eget kognitiva test. Resultatet är ett orienterande IQ-estimat, inte ett normerat, officiellt eller kliniskt psykologtest.</p></main></TestShell>;
}
