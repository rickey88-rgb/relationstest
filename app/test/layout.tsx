import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Relationstest – upptäck varningssignaler i din relation | Relationsvarning",
  description:
    "Gör ett anonymt relationstest och identifiera återkommande mönster som kontroll, manipulation, gaslighting och psykisk misshandel.",
  alternates: {
    canonical: "https://www.relationsvarning.se/test",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="mx-auto max-w-3xl px-4 py-8 text-neutral-900 [overflow-wrap:anywhere] sm:px-6 sm:py-12 [&:has([data-screening-result])_[data-test-intro]]:hidden">
    <header>
      <Link href="/" className="inline-flex min-h-11 items-center text-sm text-neutral-600 underline underline-offset-4">Till Relationsvarning</Link>
      <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Screeningtest för relationen</h1>
      <div data-test-intro>
      <p className="mt-5 leading-7 text-neutral-700">Det här anonyma screeningtestet hjälper dig identifiera återkommande varningssignaler i en nära relation. Testet bedömer beteendemönster som kontroll, manipulation, gaslighting och psykisk misshandel och ger vägledning om vilka områden som kan vara värda att undersöka vidare.</p>
      <p className="mt-4 text-sm leading-6">Svara främst utifrån de senaste sex månaderna, eller relationen som helhet om den är nyare. Välj det svar som ligger närmast din erfarenhet. Det är 42 frågor. När du väljer ett svar går du automatiskt vidare.</p>
      </div>
    </header>
    {children}
  </main>;
}
