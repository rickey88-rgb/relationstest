import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { ContentGuide, GuideLinks, GuideSection, textLink } from "../_components/ContentGuide";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";

const title = "PTSD-triggers – varför påminnelser kan väcka starka reaktioner | Relationsvarning";
const description = "Läs om PTSD-triggers, hur ljud, lukter, platser och situationer kan väcka starka kroppsliga eller känslomässiga reaktioner.";
export const metadata: Metadata = { title, description, robots: { index: true, follow: true }, ...getEditorialMetadata({ route: "/ptsd-triggers", title, description, datePublished: "2026-09-29T12:00:00+02:00", dateModified: "2026-09-29T12:00:00+02:00" }) };
const article = getEditorialArticleSchema({ route: "/ptsd-triggers", title, description, datePublished: "2026-09-29T12:00:00+02:00", dateModified: "2026-09-29T12:00:00+02:00" });

export default function PtsdTriggersPage() {
  return <EditorialSurface><ContentGuide title="PTSD-triggers – när påminnelser väcker starka reaktioner" intro="En trigger kan vara något som påminner om en svår upplevelse och väcker en stark reaktion. Det kan handla om ljud, lukt, en plats, en situation eller ett samtal. Att känna igen en trigger är inte detsamma som att få en diagnos."><EditorialArticleJsonLd data={article} />
    <GuideSection title="Vad kan vara en trigger?"><p>Påminnelser kan vara tydliga eller subtila. Ett visst ljud, en doft, en tid på året, ett ord, ett kroppsligt tillstånd eller en social situation kan ibland väcka minnen eller starka känslor. Vad som blir laddat varierar mycket mellan personer.</p></GuideSection>
    <GuideSection title="Kroppsliga och känslomässiga reaktioner"><p>En trigger kan följas av exempelvis spänning, hjärtklappning, oro, ilska, skam eller en känsla av att behöva komma bort. Ibland är reaktionen lätt att koppla till en påminnelse, men ibland märks den först som stress eller trötthet.</p></GuideSection>
    <GuideSection title="Undvikande och mönster"><p>Det är begripligt att vilja undvika sådant som väcker obehag. Samtidigt kan mycket undvikande begränsa vardagen. Att lägga märke till när, var och hur reaktionerna uppstår kan vara ett första sätt att förstå sina mönster, utan att behöva dra diagnostiska slutsatser.</p><p><Link href="/ptsd-symtom" className={textLink}>Läs om PTSD-symtom</Link>.</p></GuideSection>
    <GuideSection title="När stöd kan vara relevant"><p>Om påminnelser eller stressreaktioner blir svåra att hantera, begränsar vardagen eller påverkar återhämtningen kan du prata med vårdcentral eller annan professionell kontakt om vad du upplever.</p><Link data-rv="button" href="/ptsd-test" className="inline-flex min-h-12 items-center rounded-xl bg-[#27666A] px-5 py-3 font-semibold text-white hover:bg-[#1F5357]">Gör PTSD-testet</Link></GuideSection>
    <GuideSection title="Läs vidare"><GuideLinks links={[{ href: "/ptsd", label: "Vad är PTSD?" }, { href: "/ptsd-symtom", label: "PTSD-symtom" }, { href: "/ptsd-test", label: "PTSD-testet" }]} /></GuideSection>
  </ContentGuide></EditorialSurface>;
}
