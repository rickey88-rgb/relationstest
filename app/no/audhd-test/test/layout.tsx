import type { Metadata } from "next";
import Link from "next/link";
import TestShell from "../../../_components/TestShell";
import { norwegian } from "../../../_content/market";

export const metadata: Metadata = {
  title: "AuDHD-test for voksne | Relationsvarning",
  alternates: { canonical: norwegian.test },
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <TestShell><main className="mx-auto max-w-3xl px-4 py-7 text-neutral-900 sm:px-6 sm:py-10">
    <Link href={norwegian.test} className="inline-flex min-h-11 items-center underline underline-offset-4">Om testen</Link>
    <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">AuDHD-test for voksne</h1>
    <p className="mt-4 max-w-2xl leading-7 text-neutral-700">Tenk på hvordan du vanligvis fungerer over tid. Velg svaret som passer best med det du oftest opplever.</p>
    {children}
    <p className="mt-9 text-sm leading-6 text-neutral-600">Dette er en egenvurdering for voksne. Hvis vanskene påvirker hverdagen din, kan du snakke med fastlegen om en faglig vurdering.</p>
  </main></TestShell>;
}
