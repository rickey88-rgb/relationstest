import type { Metadata } from "next";
import Link from "next/link";
import guides from "../../content/adhd-guides.json";
import { ContentGuide, GuideSection, textLink } from "./ContentGuide";

const sources = {
  "1177": { href: "https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/adhd/", label: "1177 – ADHD och vägar till stöd" },
  nimh: { href: "https://www.nimh.nih.gov/health/publications/adhd-what-you-need-to-know", label: "NIMH – ADHD hos vuxna" },
  nhs: { href: "https://www.nhs.uk/conditions/adhd-adults/", label: "NHS – symtom och bedömning hos vuxna" },
};

function getGuide(slug: string) {
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) throw new Error(`Unknown ADHD guide: ${slug}`);
  return guide;
}

export function adhdMetadata(slug: string): Metadata {
  const guide = getGuide(slug);
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `https://www.relationsvarning.se/${guide.slug}` },
  };
}

export default function ADHDGuide({ slug }: { slug: string }) {
  const guide = getGuide(slug);
  return <ContentGuide title={guide.h1} intro={guide.intro}>
    {guide.sections.map((section, index) => <GuideSection key={section.heading} title={section.heading}>
      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.link && <p>{section.link.before}{" "}<Link href={section.link.href} className={textLink}>{section.link.label}</Link>{" "}{section.link.after}</p>}
      {index === 1 && <p>{guide.context}{" "}<Link href="/adhd-test" className={textLink}>{guide.anchor}</Link>.</p>}
    </GuideSection>)}
    <GuideSection title="Källor och vidare läsning">
      <p className="text-sm">Vårdkällorna beskriver ADHD och bedömning. Vardagsexemplen i guiden är illustrationer, inte diagnostiska kriterier.</p>
      <ul className="space-y-2 text-sm">{guide.sources.map((id) => {
        const source = sources[id as keyof typeof sources];
        return <li key={id}><a href={source.href} className={`inline-flex min-h-11 items-center ${textLink}`}>{source.label}</a></li>;
      })}</ul>
    </GuideSection>
    <section aria-label={guide.ctaTitle} className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
      <h2 className="text-2xl font-semibold tracking-tight">{guide.ctaTitle}</h2>
      <p className="mt-4 leading-7 text-neutral-700">{guide.ctaText}</p>
      <Link href="/adhd-test" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-center font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:w-auto">Gör ADHD-testet för vuxna</Link>
    </section>
  </ContentGuide>;
}
