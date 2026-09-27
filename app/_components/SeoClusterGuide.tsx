import type { Metadata } from "next";
import Link from "next/link";
import GuideNextSteps from "./GuideNextSteps";
import { guideRecommendations } from "./guideRecommendations";
import { getArticleImageMetadata, getArticleImageSchema } from "../_seo/articleImages";

export type ClusterSection = { heading: string; paragraphs: string[]; bullets?: string[]; links?: Array<Pick<ClusterLink, "href" | "label">> };
export type ClusterLink = { href: string; label: string; description: string };
export type ClusterFaq = { question: string; answer: string };
export type ClusterGuideData = {
  slug: string;
  eyebrow: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: ClusterSection[];
  related: ClusterLink[];
  cta?: { title: string; text: string; href: string; label: string };
  faq?: ClusterFaq[];
  parent?: { href: string; label: string };
  relatedTitle?: string;
};

const host = "https://www.relationsvarning.se";
const textLink = "font-medium underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700";

export function clusterMetadata(data: ClusterGuideData): Metadata {
  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: `${host}/${data.slug}` },
    ...getArticleImageMetadata(`/${data.slug}`),
  };
}

export default function SeoClusterGuide({ data }: { data: ClusterGuideData }) {
  const url = `${host}/${data.slug}`;
  const articleImage = getArticleImageSchema(`/${data.slug}`);
  const highlighted = new Set(guideRecommendations[`/${data.slug}`]?.related.map((item) => item.href));
  const additionalLinks = data.related.filter((item) => !highlighted.has(item.href));
  const schema = [
    { "@context": "https://schema.org", "@type": "Article", headline: data.h1, description: data.description, url, mainEntityOfPage: { "@type": "WebPage", "@id": url }, publisher: { "@type": "Organization", name: "Relationsvarning", url: host }, ...(articleImage ? { image: articleImage } : {}) },
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "Relationsvarning", item: `${host}/` },
      ...(data.parent ? [{ "@type": "ListItem", position: 2, name: data.parent.label, item: `${host}${data.parent.href}` }, { "@type": "ListItem", position: 3, name: data.h1, item: url }] : [{ "@type": "ListItem", position: 2, name: data.h1, item: url }]),
    ] },
    ...(data.faq?.length ? [{ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: data.faq.map((item) => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) }] : []),
  ];

  return <main className="bg-white text-neutral-900">
    <article data-rv="container" className="mx-auto max-w-3xl px-5 py-10 sm:px-6 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }} />
      <nav aria-label="Brödsmulor" className="mb-7 text-sm text-neutral-500">
        <Link href="/" className={textLink}>Start</Link><span aria-hidden="true"> / </span>
        {data.parent && <><Link href={data.parent.href} className={textLink}>{data.parent.label}</Link><span aria-hidden="true"> / </span></>}
        <span aria-current="page">{data.h1}</span>
      </nav>
      <header className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-500">{data.eyebrow}</p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-neutral-950 sm:text-4xl">{data.h1}</h1>
        <p className="text-lg leading-8 text-neutral-700">{data.intro}</p>
      </header>

      <div className="mt-11 space-y-11">
        {data.sections.map((section) => <section key={section.heading} className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight text-neutral-950">{section.heading}</h2>
          {section.paragraphs.map((paragraph) => <p key={paragraph} className="leading-7 text-neutral-700">{paragraph}</p>)}
          {section.bullets && <ul className="list-disc space-y-3 pl-6 leading-7 text-neutral-700">{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}
          {section.links?.length ? <p className="text-sm leading-7 text-neutral-600">Läs vidare: {section.links.map((item, index) => <span key={item.href}>{index > 0 ? ", " : ""}<Link href={item.href} className={textLink}>{item.label}</Link></span>)}.</p> : null}
        </section>)}
      </div>

      {additionalLinks.length > 0 && (data.relatedTitle ? <section className="mt-12 border-t border-neutral-200 pt-9"><h2 className="text-2xl font-semibold tracking-tight">{data.relatedTitle}</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{additionalLinks.map((item) => <Link key={item.href} href={item.href} className="block rounded-2xl border border-neutral-200 bg-neutral-50 p-4 hover:border-neutral-300 hover:bg-white"><span className="font-semibold text-neutral-950">{item.label} <span aria-hidden="true">→</span></span><span className="mt-1 block text-sm leading-6 text-neutral-600">{item.description}</span></Link>)}</div></section> : <p className="mt-9 text-sm leading-7 text-neutral-600">Fler fördjupningar: {additionalLinks.map((item, index) => <span key={item.href}>{index > 0 ? ", " : ""}<Link href={item.href} className={textLink}>{item.label}</Link></span>)}.</p>)}

      {data.cta ? <section data-rv="panel" className="mt-12 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-7"><h2 className="text-2xl font-semibold tracking-tight">{data.cta.title}</h2><p className="mt-3 leading-7 text-neutral-700">{data.cta.text}</p><Link data-rv="button" href={data.cta.href} className="mt-5 inline-flex min-h-12 items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-center font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900">{data.cta.label}</Link></section> : null}

      {data.faq?.length ? <section className="mt-12 space-y-6 border-t border-neutral-200 pt-9">
        <h2 className="text-2xl font-semibold tracking-tight">Vanliga frågor</h2>
        {data.faq.map((item) => <div key={item.question}><h3 className="font-semibold text-neutral-950">{item.question}</h3><p className="mt-2 leading-7 text-neutral-700">{item.answer}</p></div>)}
      </section> : null}
      <GuideNextSteps sourcePage={`/${data.slug}`} />
    </article>
  </main>;
}
