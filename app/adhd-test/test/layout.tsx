import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "ADHD-självtest – 30 frågor om vuxnas vardag | Relationsvarning",
  description: "Gör ett ADHD-självtest för vuxna med 30 frågor om uppmärksamhet, organisation, impulsivitet, rastlöshet, igångsättning och vardagspåverkan.",
  alternates: { canonical: "https://www.relationsvarning.se/adhd-test" },
  robots: { index: false, follow: true },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="mx-auto max-w-3xl px-4 py-8 text-neutral-900 [overflow-wrap:anywhere] sm:px-6 sm:py-12 [&:has([data-adhd-result])_[data-test-intro]]:hidden">
    <header><nav aria-label="Testnavigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600"><Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">Till Relationsvarning</Link><Link href="/adhd-test" className="inline-flex min-h-11 items-center underline underline-offset-4">Om ADHD-testet</Link></nav>
      <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">ADHD-test för vuxna</h1>
      <div data-test-intro><p className="mt-5 leading-7 text-neutral-700">Svara utifrån hur du vanligtvis har fungerat under de senaste sex månaderna, inte bara hur du känner dig just idag.</p><p className="mt-4 text-sm leading-6 text-neutral-600">30 frågor · Sex områden · För vuxna. Välj ett svar för att gå vidare. Du kan ändra tidigare svar med Tillbaka. Sista frågan ber dig också blicka tillbaka på tidigare delar av livet.</p></div>
    </header>{children}
    <p className="mt-8 text-sm leading-6 text-neutral-600">Relationsvarnings egen självskattningsmodell är inte ett kliniskt validerat instrument. Den ställer inte diagnos och kan inte bekräfta eller utesluta ADHD.</p>
  </main>;
}
