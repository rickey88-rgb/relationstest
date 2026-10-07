import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "./EditorialSurface";
import { textLink } from "./ContentGuide";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";

const host = "https://www.relationsvarning.se";

type LinkItem = { href: string; label: string; description?: string };
type Section = { title: string; paragraphs: string[]; bullets?: string[]; links?: LinkItem[] };
type Faq = { question: string; answer: string };

export type InformationGuideData = {
  slug: string;
  title: string;
  description: string;
  h1: string;
  eyebrow: string;
  intro: string;
  datePublished: string;
  dateModified: string;
  sections: Section[];
  cta?: { title: string; text: string; href: string; label: string };
  related: LinkItem[];
  sources: LinkItem[];
  faqs: Faq[];
  careNote?: string;
};

export function informationGuideMetadata(data: InformationGuideData): Metadata {
  return {
    title: data.title,
    description: data.description,
    robots: { index: true, follow: true },
    ...getEditorialMetadata({ route: `/${data.slug}`, title: data.title, description: data.description, datePublished: data.datePublished, dateModified: data.dateModified }),
  };
}

export default function InformationGuide({ data }: { data: InformationGuideData }) {
  const route = `/${data.slug}` as `/${string}`;
  const url = `${host}${route}`;
  const article = getEditorialArticleSchema({ route, title: data.title, description: data.description, datePublished: data.datePublished, dateModified: data.dateModified });
  const supplementalSchema = [
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Relationsvarning", item: `${host}/` },
      { "@type": "ListItem", position: 2, name: data.h1, item: url },
    ] },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: data.faqs.map((faq) => ({ "@type": "Question", name: faq.question, acceptedAnswer: { "@type": "Answer", text: faq.answer } })) },
  ];

  return <EditorialSurface><main data-rv="container" className="mx-auto max-w-3xl px-5 py-10 text-neutral-900 [overflow-wrap:anywhere] sm:px-6 sm:py-14">
    <EditorialArticleJsonLd data={article} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(supplementalSchema).replace(/</g, "\\u003c") }} />
    <nav aria-label="Brödsmulor" className="text-sm text-neutral-600"><Link href="/" className={`inline-flex min-h-11 items-center ${textLink}`}>Start</Link><span aria-hidden="true"> / </span><span aria-current="page">{data.h1}</span></nav>
    <article>
      <header className="mt-5 space-y-5"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{data.eyebrow}</p><h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl">{data.h1}</h1><p className="text-lg leading-8 text-neutral-700">{data.intro}</p></header>
      <div className="mt-11 space-y-11">{data.sections.map((section) => <section key={section.title} className="space-y-4"><h2 className="text-2xl font-semibold tracking-tight text-neutral-950">{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-7 text-neutral-700">{paragraph}</p>)}{section.bullets ? <ul className="list-disc space-y-3 pl-6 leading-7 text-neutral-700">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul> : null}{section.links?.length ? <p className="text-sm leading-7 text-neutral-600">Läs vidare: {section.links.map((link, index) => <span key={link.href}>{index ? ", " : ""}<Link href={link.href} className={textLink}>{link.label}</Link></span>)}.</p> : null}</section>)}</div>
      {data.cta ? <section data-rv="panel" className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-7"><h2 className="text-2xl font-semibold tracking-tight">{data.cta.title}</h2><p className="mt-3 leading-7 text-neutral-700">{data.cta.text}</p><Link data-rv="button" href={data.cta.href} className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-center font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:w-auto">{data.cta.label}</Link></section> : null}
      <section className="mt-12 border-t border-neutral-200 pt-9"><h2 className="text-2xl font-semibold tracking-tight">Relaterade guider</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{data.related.map((link) => <Link data-rv="card" key={link.href} href={link.href} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 hover:border-neutral-300 hover:bg-white"><span className="font-semibold text-neutral-950">{link.label} <span aria-hidden="true">→</span></span>{link.description ? <span className="mt-1 block text-sm leading-6 text-neutral-600">{link.description}</span> : null}</Link>)}</div></section>
      <section className="mt-12 space-y-6 border-t border-neutral-200 pt-9"><h2 className="text-2xl font-semibold tracking-tight">Vanliga frågor</h2>{data.faqs.map((faq) => <div key={faq.question}><h3 className="font-semibold text-neutral-950">{faq.question}</h3><p className="mt-2 leading-7 text-neutral-700">{faq.answer}</p></div>)}</section>
      <section className="mt-12 border-t border-neutral-200 pt-9"><h2 className="text-xl font-semibold tracking-tight">Källor och läsanvisning</h2><p className="mt-3 text-sm leading-6 text-neutral-600">Sidorna nedan används som bakgrund för den allmänna informationen. Texten kan inte avgöra vad som ligger bakom en enskild persons upplevelser.</p><ul className="mt-3 space-y-2 text-sm">{data.sources.map((source) => <li key={source.href}><a href={source.href} className={`inline-flex min-h-11 items-center ${textLink}`}>{source.label}</a></li>)}</ul>{data.careNote ? <p className="mt-5 text-sm leading-6 text-neutral-600">{data.careNote}</p> : null}</section>
    </article>
  </main></EditorialSurface>;
}
