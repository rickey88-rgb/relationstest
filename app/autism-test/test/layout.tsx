import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Autism-självtest – 30 frågor för vuxna | Relationsvarning",
  description: "Besvara 30 frågor om socialt samspel, kommunikation, förutsägbarhet, sensorik, intressen och vardagspåverkan i Relationsvarnings självskattning.",
  alternates: { canonical: "https://www.relationsvarning.se/autism-test/test" },
};
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <main className="mx-auto max-w-3xl px-4 py-8 text-neutral-900 [overflow-wrap:anywhere] sm:px-6 sm:py-12 [&:has([data-autism-result])_[data-test-intro]]:hidden">
    <header><nav aria-label="Testnavigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600"><Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">Till Relationsvarning</Link><Link href="/autism-test" className="inline-flex min-h-11 items-center underline underline-offset-4">Om autismtestet</Link></nav>
      <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Autismtest för vuxna</h1>
      <div data-test-intro><p className="mt-5 leading-7 text-neutral-700">Besvara frågorna utifrån hur du vanligtvis fungerar och har fungerat över längre tid – inte bara hur du känner dig idag.</p><p className="mt-4 leading-7 text-neutral-700">Försök tänka på återkommande mönster i vuxenlivet och, där det är möjligt, om liknande drag funnits tidigare i livet.</p><p className="mt-4 text-sm leading-6 text-neutral-600">30 frågor · Sex områden · Fem frågor per område. Svara från Aldrig till Mycket ofta. Välj ett svar för att gå vidare, eller Tillbaka för att ändra.</p></div>
    </header>{children}
    <p className="mt-8 text-sm leading-6 text-neutral-600">Relationsvarnings egen självskattningsmodell är inte ett kliniskt validerat instrument. Den ställer inte diagnos och kan inte bekräfta eller utesluta autism.</p>
  </main>;
}
