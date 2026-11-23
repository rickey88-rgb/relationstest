import type { ReactNode } from "react";
import Image from "next/image";
import { OVERTHINKING_BOOK as book } from "../_lib/overthinkingBook";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";
import { ContentGuide, GuideSection, textLink } from "./ContentGuide";
import EditorialSurface from "./EditorialSurface";
import TrackedLink from "./TrackedLink";

type Guide = { route: `/${string}`; title: string; description: string };
type GuideSource = { href: string; label: string };
const published = "2026-11-23";

export function thinkingGuideMetadata(guide: Guide) {
  return {
    title: guide.title,
    description: guide.description,
    ...getEditorialMetadata({ ...guide, datePublished: published, dateModified: published }),
  };
}

export function ThinkingGuide({ guide, heading, intro, sources, children }: {
  guide: Guide;
  heading: string;
  intro: string;
  sources: GuideSource[];
  children: ReactNode;
}) {
  const schema = getEditorialArticleSchema({ ...guide, datePublished: published, dateModified: published });
  const breadcrumbs = guide.route === "/overtankande"
    ? []
    : [{ href: "/overtankande", label: "Övertänkande" }];
  return (
    <EditorialSurface>
      <ContentGuide title={heading} intro={intro} breadcrumbs={breadcrumbs} newsletter={false}>
        <EditorialArticleJsonLd data={schema} />
        {children}
        <GuideSection title="Källor och vidare läsning">
          <ul className="space-y-2 text-sm">
            {sources.map(source => <li key={source.href}><a className={textLink} href={source.href}>{source.label}</a></li>)}
          </ul>
        </GuideSection>
      </ContentGuide>
    </EditorialSurface>
  );
}

export function ThinkingExercise({ children }: { children: ReactNode }) {
  return <div data-rv="callout" className="space-y-4 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">{children}</div>;
}

export function ThinkingBook({ source, children }: { source: string; children: ReactNode }) {
  return (
    <aside aria-label="Boktips" data-rv="panel" className="mt-12 flex items-start gap-4 rounded-2xl border border-neutral-200 p-4 sm:gap-6 sm:p-6">
      <Image src={book.cover} alt={`Framsidan till ${book.title}`} width={640} height={960}
        sizes="(min-width: 640px) 112px, 72px" className="h-auto w-[4.5rem] shrink-0 rounded-sm sm:w-28" />
      <div className="min-w-0 space-y-2">
        <p className="font-semibold text-neutral-950"><cite className="not-italic">{book.title}</cite></p>
        <p className="text-sm text-neutral-600">{book.author} · E-bok (PDF)</p>
        <p className="text-sm text-neutral-700">{children}</p>
        <TrackedLink href={book.path} event="related_guide_click"
          params={{ source_page: source, destination_page: book.path, position: 1 }}
          className={`inline-flex min-h-11 items-center text-sm font-semibold ${textLink}`}>
          Se boken · {book.price} kr
        </TrackedLink>
      </div>
    </aside>
  );
}
