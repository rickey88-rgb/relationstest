import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { ContentGuide, GuideLinks, GuideSection, textLink } from "../_components/ContentGuide";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";

const title = "Komplex PTSD – symtom, relationer och självbild | Relationsvarning";
const description = "Läs om komplex PTSD, skillnader mot PTSD och hur känsloreglering, självbild och relationer kan påverkas efter långvarig belastning.";
export const metadata: Metadata = { title, description, robots: { index: true, follow: true }, ...getEditorialMetadata({ route: "/komplex-ptsd", title, description, datePublished: "2026-09-29T12:00:00+02:00", dateModified: "2026-09-29T12:00:00+02:00" }) };
const article = getEditorialArticleSchema({ route: "/komplex-ptsd", title, description, datePublished: "2026-09-29T12:00:00+02:00", dateModified: "2026-09-29T12:00:00+02:00" });

export default function ComplexPtsdPage() {
  return <EditorialSurface><ContentGuide title="Komplex PTSD – när långvarig belastning påverkar fler delar av livet" intro="Komplex PTSD används för att beskriva PTSD-symtom tillsammans med mer långvariga svårigheter, exempelvis med känsloreglering, självbild och relationer. Begreppet är inte bara ett annat ord för “svårare PTSD”, och en sida som denna kan inte avgöra vilken beskrivning som passar en enskild person."><EditorialArticleJsonLd data={article} />
    <GuideSection title="Skillnaden mellan PTSD och komplex PTSD"><p>PTSD beskrivs ofta genom återupplevande, undvikande, förändringar i tankar och känslor samt vaksamhet och stressreaktioner. Vid komplex PTSD kan sådana reaktioner förekomma tillsammans med bredare och mer långvariga svårigheter i hur känslor, självkänsla och relationer fungerar.</p><p>Det är viktigt att inte använda begreppet som en enkel rangordning av hur “svårt” något är. Professionell bedömning väger in hela situationen och andra möjliga förklaringar.</p></GuideSection>
    <GuideSection title="Känsloreglering"><p>En del upplever att känslor blir svåra att hantera, att de växlar snabbt eller att de känns avstängda. Det kan vara hjälpsamt att se reaktionerna som något som förtjänar stöd, snarare än som ett personligt misslyckande.</p><p>Upplevelser av avstängdhet eller frånkoppling kan också beskrivas som <Link href="/dissociation" className={textLink}>dissociation</Link>, men behöver alltid förstås i sitt sammanhang.</p></GuideSection>
    <GuideSection title="Självbild och relationer"><p>Negativa tankar om det egna värdet, skuld och svårigheter att känna sig trygg med andra kan förekomma. I nära relationer kan det märkas som behov av avstånd, vaksamhet, oro för konflikter eller svårighet att be om det man behöver.</p><p><Link href="/ptsd-relationer" className={textLink}>Läs om PTSD och nära relationer</Link>.</p></GuideSection>
    <GuideSection title="När kan det vara relevant att söka hjälp?"><p>Om traumarelaterade reaktioner eller långvariga svårigheter påverkar trygghet, vardag eller relationer kan vårdcentral eller annan professionell kontakt hjälpa till att sortera vad som händer och vilket stöd som kan passa.</p><p>Relationsvarnings test är ett självtest om PTSD-relaterade symtom och kan inte bedöma komplex PTSD eller ge en diagnos.</p><Link data-rv="button" href="/ptsd-test" className="inline-flex min-h-12 items-center rounded-xl bg-[#27666A] px-5 py-3 font-semibold text-white hover:bg-[#1F5357]">Gör PTSD-testet</Link></GuideSection>
    <GuideSection title="Läs vidare"><GuideLinks links={[{ href: "/ptsd", label: "Vad är PTSD?" }, { href: "/ptsd-symtom", label: "PTSD-symtom" }, { href: "/ptsd-relationer", label: "PTSD och relationer" }, { href: "/ptsd-test", label: "PTSD-testet" }]} /></GuideSection>
  </ContentGuide></EditorialSurface>;
}
