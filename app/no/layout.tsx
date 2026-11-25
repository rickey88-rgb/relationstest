import Link from "next/link";
import Brand from "../_components/Brand";
import { MarketProvider } from "../_components/MarketProvider";
import { AnalyticsSettings } from "../_analytics/AnalyticsProvider";
import { norwegian } from "../_content/market";
import { NorwegianLanguageLink } from "./_components/NorwegianLanguageLink";

export default function NorwegianLayout({ children }: { children: React.ReactNode }) {
  return <MarketProvider market="no">
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 px-5 py-2">
        <Link href={norwegian.test} className="inline-flex min-h-12 items-center" aria-label="Relationsvarning Norge"><Brand /></Link>
        <nav aria-label="Hovedmeny" className="flex flex-wrap items-center gap-x-4 text-sm font-medium">
          <Link className="py-3" href={norwegian.test}>Selvtest</Link>
          <Link className="py-3" href="/no/audhd">Guider</Link>
          <Link className="py-3" href={norwegian.book}>E-bok</Link>
          <NorwegianLanguageLink />
        </nav>
      </div>
    </header>
    {children}
    <footer className="border-t border-neutral-200 bg-[#f6f7f4] text-sm text-neutral-700">
      <div className="mx-auto max-w-7xl space-y-3 px-5 py-8">
        <p>Relationsvarning drives fra Sverige.</p>
        <nav aria-label="Kontakt og vilkår" className="flex flex-wrap items-center gap-x-5">
          <a className="underline" href="mailto:support@relationsvarning.se">Kontakt kundestøtte</a>
          <Link className="underline" href="/no/personvern">Personvern</Link>
          <Link className="underline" href="/no/kjopsvilkar">Kjøpsvilkår</Link>
          <AnalyticsSettings market="no" />
          <NorwegianLanguageLink placement="footer" />
        </nav>
      </div>
    </footer>
  </MarketProvider>;
}
