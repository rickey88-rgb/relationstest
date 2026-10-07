import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { ContentGuide, GuideLinks, GuideSection, textLink } from "../_components/ContentGuide";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";

const title = "PTSD-symtom – vanliga tecken och traumarelaterade reaktioner | Relationsvarning";
const description = "Läs om vanliga PTSD-symtom: återupplevande, undvikande, förändringar i tankar och känslor, vaksamhet och påverkan på vardagen.";
export const metadata: Metadata = { title, description, robots: { index: true, follow: true }, ...getEditorialMetadata({ route: "/ptsd-symtom", title, description, datePublished: "2026-09-29T12:00:00+02:00", dateModified: "2026-09-29T12:00:00+02:00" }) };
const article = getEditorialArticleSchema({ route: "/ptsd-symtom", title, description, datePublished: "2026-09-29T12:00:00+02:00", dateModified: "2026-09-29T12:00:00+02:00" });

export default function PtsdSymptomsPage() {
  return <EditorialSurface><ContentGuide title="PTSD-symtom – vanliga reaktioner efter trauma" intro="PTSD-symtom kan omfatta minnen, undvikande, känslor och stressreaktioner. Alla reagerar inte på samma sätt, och liknande symtom kan ha flera orsaker. Den här sidan kan ge ett språk för upplevelser men kan inte ställa diagnos."><EditorialArticleJsonLd data={article} />
    <GuideSection title="Återupplevande"><p>Oönskade minnen, drömmar eller starka reaktioner på ljud, lukter, platser och situationer kan förekomma. För vissa känns påminnelser tydligt kroppsligt, till exempel genom spänning, hjärtklappning eller stark oro.</p><p><Link href="/ptsd-triggers" className={textLink}>Läs om triggers och påminnelser</Link>.</p></GuideSection>
    <GuideSection title="Undvikande"><p>Undvikande kan handla om att hålla tankar och känslor på avstånd, men också om att ändra rutiner eller undvika platser, samtal eller personer. Det kan vara ett sätt att försöka hantera obehag, utan att det säger något säkert om diagnos.</p></GuideSection>
    <GuideSection title="Tankar och känslor"><p>Vissa beskriver att de känner sig avstängda, mer distanserade från andra eller mindre intresserade av sådant som tidigare betydde något. Skuld, skam, ilska eller negativa tankar kan också ta stor plats. Sådana reaktioner behöver alltid ses i sitt sammanhang.</p><p><Link href="/komplex-ptsd" className={textLink}>Komplex PTSD</Link> kan vara relevant att läsa om när långvariga svårigheter med självbild, känslor eller relationer står i fokus.</p></GuideSection>
    <GuideSection title="Vaksamhet och stressreaktioner"><p>Att vara på sin vakt, lättskrämd, irriterad eller ha svårt att sova och koncentrera sig kan vara belastande. Ibland beskriver människor också att kroppen har svårt att växla ner trots att situationen är tryggare än tidigare.</p></GuideSection>
    <GuideSection title="När vardagen påverkas"><p>Reaktioner kan märkas i relationer, arbete eller studier, sociala aktiviteter och återhämtning. Om de begränsar din vardag eller om du behöver stöd för att hantera dem kan vårdcentral eller annan professionell kontakt vara en väg vidare.</p><Link data-rv="button" href="/ptsd-test" className="inline-flex min-h-12 items-center rounded-xl bg-[#27666A] px-5 py-3 font-semibold text-white hover:bg-[#1F5357]">Gör PTSD-testet</Link></GuideSection>
    <GuideSection title="Fördjupa dig"><GuideLinks links={[{ href: "/ptsd", label: "Vad är PTSD?" }, { href: "/ptsd-triggers", label: "Triggers vid PTSD" }, { href: "/komplex-ptsd", label: "Komplex PTSD" }, { href: "/ptsd-test", label: "PTSD-testet" }]} /></GuideSection>
  </ContentGuide></EditorialSurface>;
}
