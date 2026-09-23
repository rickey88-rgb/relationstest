import TestShell from "../../_components/TestShell";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Ångesttest – 30 frågor för vuxna | Relationsvarning", description: "Besvara 30 frågor om oro, anspänning, sömn och vardagspåverkan i Relationsvarnings självskattning.", alternates: { canonical: "https://www.relationsvarning.se/angest-test" }, robots: { index: false, follow: true } };

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <TestShell><main className="mx-auto max-w-3xl px-4 py-8 text-neutral-900 [overflow-wrap:anywhere] sm:px-6 sm:py-12 [&:has([data-angest-result])_[data-test-intro]]:hidden">
    <header><nav aria-label="Testnavigation" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-neutral-600"><Link href="/" className="inline-flex min-h-11 items-center underline underline-offset-4">Till Relationsvarning</Link><Link href="/angest-test" className="inline-flex min-h-11 items-center underline underline-offset-4">Om ångesttestet</Link></nav>
      <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Ångesttest för vuxna</h1>
      <div data-test-intro><p className="mt-5 leading-7 text-neutral-700">Svara utifrån hur du vanligtvis har haft det under en längre period, snarare än en enskild stressig dag.</p><p className="mt-4 text-sm leading-6 text-neutral-600">30 frågor · Sex områden · Fem frågor per område. Välj ett svar för att gå vidare, eller Tillbaka för att ändra.</p></div>
    </header>{children}<p className="mt-8 text-sm leading-6 text-neutral-600">Relationsvarnings egen självskattning är inte ett kliniskt validerat instrument. Den ställer inte diagnos och kan inte bekräfta eller utesluta GAD.</p>
  </main></TestShell>;
}
