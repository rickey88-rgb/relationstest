import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { norwegian } from "../../_content/market";
import { guideLabel, norwegianGuides, norwegianSources } from "../../_content/norwegianGuides";
import { norwegianMetadata, site, StructuredData } from "../_components/norwegianSeo";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return Object.keys(norwegianGuides).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = Object.hasOwn(norwegianGuides, slug) ? norwegianGuides[slug] : notFound();
  return norwegianMetadata(`/no/${slug}`, guide.title, guide.description, { article: true });
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const guide = Object.hasOwn(norwegianGuides, slug) ? norwegianGuides[slug] : notFound();
  const url = `${site}/no/${slug}`;
  return <main className="bg-white text-neutral-900">
    <article className="mx-auto max-w-3xl space-y-8 px-5 py-10 sm:py-14">
      <StructuredData data={{ "@context": "https://schema.org", "@type": "Article", headline: guide.h1, description: guide.description, url, mainEntityOfPage: url, inLanguage: "nb-NO", author: { "@type": "Organization", name: "Relationsvarning", url: site } }} />
      <nav aria-label="Brødsmuler" className="text-sm"><Link className="underline" href={norwegian.test}>AuDHD på norsk</Link> / {guide.h1}</nav>
      <header className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight">{guide.h1}</h1>
        <p className="text-lg leading-8 text-neutral-700">{guide.description}</p>
      </header>
      {guide.sections.map(([heading, body]) => <section className="space-y-3" key={heading}><h2 className="text-2xl font-semibold">{heading}</h2><p className="leading-7">{body}</p></section>)}
      <aside className="space-y-3 rounded-2xl bg-[#DDE8E3] p-5">
        <h2 className="text-xl font-semibold">Utforsk dine egne mønstre</h2>
        <Link href={norwegian.test} className="inline-block py-2 font-semibold underline underline-offset-4">Se AuDHD-selvtesten for voksne</Link>
      </aside>
      <section className="space-y-3"><h2 className="text-xl font-semibold">Les videre</h2><ul className="space-y-2">{guide.related.map(href => <li key={href}><Link href={href} className="underline underline-offset-4">{guideLabel(href)}</Link></li>)}</ul></section>
      <section className="space-y-3"><h2 className="text-xl font-semibold">Kilder</h2><ul className="space-y-2">{guide.sources.map(key => {
        const [label, href] = norwegianSources[key];
        return <li key={key}><a href={href} className="underline underline-offset-4">{label}</a></li>;
      })}</ul></section>
    </article>
  </main>;
}
