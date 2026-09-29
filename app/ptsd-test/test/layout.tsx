import type { Metadata } from "next";
import Link from "next/link";
import TestShell from "../../_components/TestShell";

export const metadata: Metadata = {
  title: "PTSD-test – självskattning av traumarelaterade reaktioner",
  description: "Besvara 30 frågor om traumarelaterade reaktioner och få ett personligt självskattningsresultat.",
  alternates: { canonical: "https://www.relationsvarning.se/ptsd-test/test" },
  robots: { index: false, follow: true, googleBot: { index: false, follow: true } },
};

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <TestShell><main className="mx-auto max-w-3xl px-4 py-8 text-neutral-900 sm:px-6 sm:py-12"><header><nav aria-label="Testnavigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600"><Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">Till Relationsvarning</Link><Link href="/ptsd-test" className="inline-flex min-h-11 items-center underline underline-offset-4">Om PTSD-testet</Link></nav><h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">PTSD-test</h1></header>{children}<p className="mt-8 text-sm leading-6 text-neutral-600">Det här är ett självtest. Resultatet innebär inte att du har PTSD och ersätter inte en professionell bedömning.</p></main></TestShell>;
}
