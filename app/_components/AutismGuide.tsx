import type { Metadata } from "next";
import Link from "next/link";
import guides from "../../content/autism-guides.json";
import { ContentGuide, GuideSection, textLink } from "./ContentGuide";

const sources = {
  masking: { href: "https://www.autismcentral.nhs.uk/guidance/masking-and-identity", label: "NHS Autism Central – maskering och identitet" },
  adhd: { href: "https://www.nimh.nih.gov/health/publications/adhd-what-you-need-to-know", label: "NIMH – ADHD hos vuxna" },
  "1177": { href: "https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/autism/", label: "1177 – autism och vägar till stöd" },
  nimh: { href: "https://www.nimh.nih.gov/health/publications/autism-spectrum-disorder", label: "NIMH – autism hos vuxna" },
  nhs: { href: "https://www.nhs.uk/conditions/autism/signs-in-adults/", label: "NHS – symtom och bedömning hos vuxna" },
};

function getGuide(slug: string) {
  const guide = guides.find((item) => item.slug === slug);
  if (!guide) throw new Error(`Unknown autism guide: ${slug}`);
  return guide;
}

export function autismMetadata(slug: string): Metadata {
  const guide = getGuide(slug);
  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `https://www.relationsvarning.se/${guide.slug}` },
  };
}

export default function AutismGuide({ slug }: { slug: string }) {
  const guide = getGuide(slug);
  return <ContentGuide title={guide.h1} intro={guide.intro}>
    {guide.sections.map((section, index) => <GuideSection key={section.heading} title={section.heading}>
      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.link && <p>{section.link.before}{" "}<Link href={section.link.href} className={textLink}>{section.link.label}</Link>{" "}{section.link.after}</p>}
      {index === 1 && <p>{guide.context}{" "}<Link href="/autism-test" className={textLink}>{guide.anchor}</Link>.</p>}
    </GuideSection>)}
    <GuideSection title="Källor och vidare läsning">
      <p className="text-sm">Vårdkällorna beskriver autism och bedömning. Vardagsexemplen i guiden är illustrationer, inte diagnostiska kriterier.</p>
      <ul className="space-y-2 text-sm">{guide.sources.map((id) => {
        const source = sources[id as keyof typeof sources];
        return <li key={id}><a href={source.href} className={`inline-flex min-h-11 items-center ${textLink}`}>{source.label}</a></li>;
      })}</ul>
    </GuideSection>
    <section aria-label={guide.ctaTitle} className="mt-10 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 sm:p-6">
      <h2 className="text-2xl font-semibold tracking-tight">{guide.ctaTitle}</h2>
      <p className="mt-4 leading-7 text-neutral-700">{guide.ctaText}</p>
      <Link href="/autism-test" className="mt-5 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-neutral-900 px-5 py-3 text-center font-semibold text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900 sm:w-auto">Gör autismtestet för vuxna</Link>
    </section>
  </ContentGuide>;
}
