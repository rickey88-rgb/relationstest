import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Narcissism självtest – 30 frågor om dina egna drag | Relationsvarning",
  description: "Besvara 30 frågor om dina egna narcissistiska drag. Få en övergripande nivå och utforska din profil inom självbild, bekräftelse, empati och relationer.",
  alternates: { canonical: "https://www.relationsvarning.se/narcissism-sjalvtest/test" },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="mx-auto max-w-3xl px-4 py-8 text-neutral-900 [overflow-wrap:anywhere] sm:px-6 sm:py-12 [&:has([data-selftest-result])_[data-test-intro]]:hidden">
    <header>
      <nav aria-label="Testnavigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600"><Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">Till Relationsvarning</Link><Link href="/narcissism-sjalvtest" className="inline-flex min-h-11 items-center underline underline-offset-4">Om narcissism självtest</Link></nav>
      <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Narcissism – självtest</h1>
      <div data-test-intro><p className="mt-5 leading-7 text-neutral-700">Utforska dina egna narcissistiska drag med 30 frågor om självbild, bekräftelsebehov, empati, kritik och relationsmönster.</p><p className="mt-4 text-sm leading-6 text-neutral-600">Svara utifrån hur du vanligtvis tänker, känner och agerar. Testet handlar om dig själv, inte om en partner. Välj ett svar för att gå vidare. Du kan ändra tidigare svar med Tillbaka.</p></div>
    </header>
    {children}
    <p className="mt-8 text-sm leading-6 text-neutral-600">Självtestet beskriver narcissistiska drag och mönster och ställer inte psykiatriska diagnoser.</p>
  </main>;
}
