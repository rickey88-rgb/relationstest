import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { ContentGuide, GuideLinks, GuideSection, textLink } from "../_components/ContentGuide";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";

const title = "PTSD och relationer – trygghet, närhet och stressreaktioner | Relationsvarning";
const description = "Läs om hur PTSD-relaterade reaktioner kan påverka närhet, trygghet, kommunikation och stress i nära relationer utan att avgöra en diagnos.";
export const metadata: Metadata = { title, description, robots: { index: true, follow: true }, ...getEditorialMetadata({ route: "/ptsd-relationer", title, description, datePublished: "2026-09-29T12:00:00+02:00", dateModified: "2026-09-29T12:00:00+02:00" }) };
const article = getEditorialArticleSchema({ route: "/ptsd-relationer", title, description, datePublished: "2026-09-29T12:00:00+02:00", dateModified: "2026-09-29T12:00:00+02:00" });

export default function PtsdRelationshipsPage() {
  return <EditorialSurface><ContentGuide title="PTSD och relationer" intro="Traumarelaterade reaktioner kan påverka hur trygghet, närhet och stress upplevs i nära relationer. Det betyder inte att en relation är dömd att fungera på ett visst sätt eller att en reaktion i sig visar att någon har PTSD."><EditorialArticleJsonLd data={article} />
    <GuideSection title="Vaksamhet och trygghet"><p>Den som ofta är på sin vakt kan ha svårt att slappna av, även i situationer som andra upplever som lugna. I en relation kan det märkas som behov av kontroll, mycket återförsäkran eller att små förändringar i tonfall och beteende får stor betydelse.</p></GuideSection>
    <GuideSection title="Undvikande och känslomässig distans"><p>Undvikande kan göra det svårt att prata om vissa erfarenheter eller att delta i situationer som väcker obehag. Känslomässig distans kan också misstolkas som ointresse, trots att den kan vara ett sätt att hantera överväldigande känslor.</p><p><Link href="/ptsd-symtom" className={textLink}>Läs om PTSD-symtom</Link> för mer om olika reaktioner.</p></GuideSection>
    <GuideSection title="Konflikter och stressreaktioner"><p>När kroppen snabbt går in i beredskap kan konflikter, plötsliga ljud eller pressade situationer kännas mer intensiva. Tydlig kommunikation, pauser och överenskommelser om vad som skapar trygghet kan vara hjälpsamt. Om det finns rädsla, hot eller kontroll i relationen behöver säkerhet och stöd alltid komma först.</p><p>Om hot eller kontroll förekommer kan du läsa om <Link href="/psykiskt-vald/hjalp" className={textLink}>stöd vid psykiskt våld</Link>.</p></GuideSection>
    <GuideSection title="Reflektera över mönster"><p>Ett självtest kan hjälpa dig att sortera vilka traumarelaterade reaktioner som framträder i dina svar, men det kan inte bedöma en relation eller ställa diagnos.</p><Link data-rv="button" href="/ptsd-test" className="inline-flex min-h-12 items-center rounded-xl bg-[#2f6b4f] px-5 py-3 font-semibold text-white hover:bg-[#285c44]">Gör PTSD-testet</Link></GuideSection>
    <GuideSection title="Läs vidare"><GuideLinks links={[{ href: "/ptsd", label: "Vad är PTSD?" }, { href: "/ptsd-symtom", label: "PTSD-symtom" }, { href: "/ptsd-test", label: "PTSD-testet" }, { href: "/traumabindning-i-relation", label: "Läs om traumabindning i relationer" }]} /></GuideSection>
  </ContentGuide></EditorialSurface>;
}
