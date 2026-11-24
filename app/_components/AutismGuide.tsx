import type { Metadata } from "next";
import Link from "next/link";
import guides from "../../content/autism-guides.json";
import { ContentGuide, GuideLinks, GuideSection, textLink } from "./ContentGuide";
import GuideNextSteps from "./GuideNextSteps";
import LiteAutismRecommendation from "./LiteAutismRecommendation";

const moreReading: Record<string, { href: string; label: string }[]> = {
  "autism-vuxna": [
    { href: "/autism-och-relationer", label: "Kärlek, närhet och relationer" },
    { href: "/autism-och-vanskap", label: "Hitta vänner och håll kontakten" },
    { href: "/autism-och-rutiner", label: "Rutiner, specialintressen och ändrade planer" },
    { href: "/autism-och-sensorisk-kanslighet", label: "Sensorisk känslighet och överstimulering" },
    { href: "/meltdown-och-shutdown-vid-autism", label: "Meltdown och shutdown hos vuxna" },
    { href: "/autistisk-utmattning", label: "Autistisk utmattning och långvarig belastning" },
    { href: "/autism-och-social-trotthet", label: "Trötthet och återhämtning efter umgänge" },
    { href: "/autism-bok", label: "AUTISM ALL INCLUSIVE – kunskapsbok med arbetsblad" },
  ],
  "autism-kvinnor": [
    { href: "/sen-autismdiagnos-hos-kvinnor", label: "Sen autismdiagnos hos kvinnor" },
    { href: "/maskering-autism", label: "Hur maskering kan märkas i vardagen" },
  ],
  "autism-kvinnor-symtom": [
    { href: "/sen-autismdiagnos-hos-kvinnor", label: "Vad vården tittar på vid en utredning som vuxen" },
    { href: "/autism-och-social-trotthet", label: "Trötthet efter sociala situationer" },
  ],
  "autism-symtom-vuxna": [
    { href: "/autism-och-sensorisk-kanslighet", label: "Ljud, ljus, beröring och andra sinnesintryck" },
    { href: "/autism-och-rutiner", label: "Rutiner och specialintressen i vardagen" },
  ],
  "maskering-autism": [
    { href: "/autism-och-social-trotthet", label: "Social trötthet och vad som kan underlätta" },
    { href: "/autistisk-utmattning", label: "När tröttheten blir långvarig" },
    { href: "/sen-autismdiagnos-hos-kvinnor", label: "Maskering inför en sen autismutredning" },
  ],
  "har-jag-autism": [
    { href: "/sen-autismdiagnos-hos-kvinnor", label: "Förbered dig inför en fråga om utredning" },
    { href: "/autism-vuxna", label: "Översikt över autism hos vuxna" },
  ],
};

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
  const audhdRelevant = ["adhd-autism", "autism-vuxna", "autism-symtom-vuxna", "maskering-autism", "autism-kvinnor"].includes(slug);
  return <ContentGuide title={guide.h1} intro={guide.intro}>
    {guide.sections.map((section, index) => <GuideSection key={section.heading} title={section.heading}>
      {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      {section.link && <p>{section.link.before}{" "}<Link href={section.link.href} className={textLink}>{section.link.label}</Link>{" "}{section.link.after}</p>}
      {index === 1 && <p>{guide.context}{" "}<Link href="/autism-test" className={textLink}>{guide.anchor}</Link>.</p>}
      {index === 1 && audhdRelevant && <p>När autismrelaterade drag också finns tillsammans med fokus-, igångsättnings- eller rastlöshetssvårigheter kan du läsa om <Link href={slug === "adhd-autism" ? "/adhd-och-autism-samtidigt" : "/audhd"} className={textLink}>ADHD och autism samtidigt</Link>.</p>}
    </GuideSection>)}
    {moreReading[slug] && <GuideSection title="Fördjupa dig"><GuideLinks links={moreReading[slug]} /></GuideSection>}
    <GuideSection title="Källor och vidare läsning">
      <p className="text-sm">Vårdkällorna beskriver autism och bedömning. Vardagsexemplen i guiden är illustrationer, inte diagnostiska kriterier.</p>
      <ul className="space-y-2 text-sm">{guide.sources.map((id) => {
        const source = sources[id as keyof typeof sources];
        return <li key={id}><a href={source.href} className={`inline-flex min-h-11 items-center ${textLink}`}>{source.label}</a></li>;
      })}</ul>
    </GuideSection>
    <LiteAutismRecommendation sourcePage={`/${slug}`} />
    <GuideNextSteps sourcePage={`/${slug}`} />
  </ContentGuide>;
}
