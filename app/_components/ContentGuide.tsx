import Link from "next/link";
import type { ReactNode } from "react";
import { sources, type ContentLink } from "../../content/behaviors";

export const textLink = "underline underline-offset-4 decoration-neutral-300 hover:decoration-neutral-700";

export function ContentGuide({ title, intro, breadcrumbs = [], children }: {
  title: string;
  intro: string;
  breadcrumbs?: ContentLink[];
  children: ReactNode;
}) {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-neutral-900 [overflow-wrap:anywhere] sm:px-6 sm:py-14">
      <nav aria-label="Brödsmulor" className="text-sm text-neutral-600">
        <ol className="flex flex-wrap items-center gap-x-2">
          <li><Link href="/" className={`inline-flex min-h-11 items-center ${textLink}`}>Startsida</Link></li>
          {breadcrumbs.map((link) => <li key={link.href} className="flex items-center gap-2"><span aria-hidden="true">/</span><Link href={link.href} className={`inline-flex min-h-11 items-center ${textLink}`}>{link.label}</Link></li>)}
          <li className="flex items-center gap-2"><span aria-hidden="true">/</span><span aria-current="page">{title}</span></li>
        </ol>
      </nav>
      <article>
        <header className="mt-5">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h1>
          <p className="mt-5 text-lg leading-8 text-neutral-700">{intro}</p>
        </header>
        {children}
      </article>
    </main>
  );
}

export function GuideSection({ title, children }: { title: string; children: ReactNode }) {
  return <section className="mt-10 space-y-4 leading-7 text-neutral-700"><h2 className="text-2xl font-semibold tracking-tight text-neutral-900">{title}</h2>{children}</section>;
}

export function GuideLinks({ links }: { links: ContentLink[] }) {
  return <ul className="grid gap-3 sm:grid-cols-2">{links.map((link) => <li key={link.href} className="min-w-0"><Link href={link.href} className="flex min-h-12 h-full items-center rounded-2xl border border-neutral-200 bg-neutral-50 p-4 font-medium leading-6 text-neutral-900 hover:bg-neutral-100">{link.label}</Link></li>)}</ul>;
}

export function SupportNotice() {
  return <aside aria-label="Hjälp och säkerhet" className="mt-8 space-y-3 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 leading-7">
    <p>Om du känner rädsla eller utsätts för hot kan du söka stöd utan att först göra ett test, köpa en analys eller veta hur beteendet ska benämnas. <strong>Vid akut fara, ring 112.</strong></p>
    <Link href="/psykiskt-vald/hjalp" className={`inline-flex min-h-11 items-center ${textLink}`}>Vägar till stöd och hjälp</Link>
  </aside>;
}

export function SourceList({ ids }: { ids: string[] }) {
  return <GuideSection title="Källor och läsanvisning"><p className="text-sm">Källorna ger bakgrund om våld, säkerhet och stöd. Vardagsexemplen illustrerar situationer och är inte diagnostiska kriterier eller en juridisk bedömning.</p><ul className="space-y-2 text-sm">{ids.map((id) => <li key={id}><a href={sources[id].href} className={`inline-flex min-h-11 items-center ${textLink}`}>{sources[id].label}</a></li>)}</ul></GuideSection>;
}
