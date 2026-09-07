import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { behaviors, canonicalHost, findBehavior, guideLabels } from "../../../content/behaviors";
import { ContentGuide, GuideLinks, GuideSection, SourceList, SupportNotice, textLink } from "../../_components/ContentGuide";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return behaviors.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = findBehavior((await params).slug);
  if (!page) notFound();
  return { title: page.seoTitle, description: page.metaDescription, alternates: { canonical: `${canonicalHost}/beteenden/${page.slug}` } };
}

export default async function BehaviorPage({ params }: Props) {
  const page = findBehavior((await params).slug);
  if (!page) notFound();
  return <ContentGuide title={page.h1} intro={page.intro} breadcrumbs={[{ href: "/beteenden", label: "Beteenden" }]}>
    {page.urgent && <aside aria-labelledby="urgent-heading" className="mt-6 space-y-3 rounded-2xl border border-rose-200 bg-rose-50 p-5 leading-7"><h2 id="urgent-heading" className="text-xl font-semibold">{page.urgent.heading}</h2><p>{page.urgent.text}</p></aside>}
    <p className="mt-6 rounded-2xl border border-neutral-200 bg-neutral-50 p-5 leading-7">{page.directAnswer}</p>
    {page.sections?.map((section) => <GuideSection key={section.heading} title={section.heading}>{section.paragraphs.map((text) => <p key={text}>{text}</p>)}</GuideSection>)}
    {page.examples?.length ? <GuideSection title="Så kan det se ut i vardagen"><ul className="list-disc space-y-3 pl-5">{page.examples.map((text) => <li key={text}>{text}</li>)}</ul></GuideSection> : null}
    {page.warningSigns?.length ? <GuideSection title="Mönster att vara uppmärksam på"><ul className="list-disc space-y-3 pl-5">{page.warningSigns.map((text) => <li key={text}>{text}</li>)}</ul></GuideSection> : null}
    {page.normalVsProblematic && <GuideSection title="Överenskommelse eller begränsning?"><div className="grid gap-4 sm:grid-cols-2"><div className="rounded-2xl border border-neutral-200 p-5"><h3 className="font-semibold text-neutral-900">När det finns respekt och utrymme</h3><p className="mt-2">{page.normalVsProblematic.normal}</p></div><div className="rounded-2xl border border-neutral-200 p-5"><h3 className="font-semibold text-neutral-900">När det blir problematiskt</h3><p className="mt-2">{page.normalVsProblematic.problematic}</p></div></div></GuideSection>}
    {page.whyItMatters && <GuideSection title="Hur det kan påverka dig"><p>{page.whyItMatters}</p></GuideSection>}
    <GuideSection title="Vad du kan göra"><ul className="list-disc space-y-3 pl-5">{page.whatYouCanDo.map((text) => <li key={text}>{text}</li>)}</ul>{page.importantContext && <p>{page.importantContext}</p>}</GuideSection>
    <SupportNotice />
    <GuideSection title="Läs sammanhanget i våra guider"><GuideLinks links={page.relatedGuides.map((href) => ({ href, label: guideLabels[href] }))} /></GuideSection>
    {page.relatedBehaviors.length > 0 && <GuideSection title="Närliggande beteenden"><GuideLinks links={page.relatedBehaviors.map((slug) => ({ href: `/beteenden/${slug}`, label: findBehavior(slug)!.h1 }))} /></GuideSection>}
    {page.primaryTest && <GuideSection title="En frivillig väg till reflektion"><p>Testet hjälper dig att sortera egna upplevelser. Det fastställer inte partnerns avsikt, en diagnos eller om ett brott har begåtts.</p><Link href={page.primaryTest.href} className={`inline-flex min-h-11 items-center ${textLink}`}>{page.primaryTest.label}</Link></GuideSection>}
    <SourceList ids={page.sources} />
  </ContentGuide>;
}
