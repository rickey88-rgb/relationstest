import type { Metadata } from "next";
import Link from "next/link";
import EditorialSurface from "../_components/EditorialSurface";
import { GuideSection, textLink } from "../_components/ContentGuide";
import { EditorialArticleJsonLd, getEditorialArticleSchema, getEditorialMetadata } from "../_seo/editorialSeo";

const title = "PTSD-test – 30 frågor om posttraumatisk stress | Relationsvarning";
const description = "Gör ett PTSD-test med 30 frågor om återupplevande, undvikande, vaksamhet och andra traumarelaterade reaktioner. Få ett personligt resultat direkt.";
export const metadata: Metadata = { title, description, robots: { index: true, follow: true }, ...getEditorialMetadata({ route: "/ptsd-test", title, description, datePublished: "2026-09-29T12:00:00+02:00", dateModified: "2026-09-29T12:00:00+02:00" }) };
const article = getEditorialArticleSchema({ route: "/ptsd-test", title, description, datePublished: "2026-09-29T12:00:00+02:00", dateModified: "2026-09-29T12:00:00+02:00" });
const cta = "inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#2f6b4f] px-5 py-3 text-center font-semibold text-white transition hover:bg-[#285c44] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2f6b4f] sm:w-auto";
const areas = [
  ["Återupplevande", "Påträngande minnen, mardrömmar och starka reaktioner på sådant som påminner om det som hänt."],
  ["Undvikande", "Att försöka undvika tankar, känslor, personer, platser eller situationer som väcker obehag."],
  ["Tankar & känslor", "Exempelvis känslomässig avstängdhet, skuld, negativa tankar och minskat intresse."],
  ["Vaksamhet & stressreaktioner", "Att vara på sin vakt, lättskrämdhet, irritation, sömnproblem och svårigheter att slappna av."],
  ["Påverkan på vardagen", "Hur reaktionerna påverkar relationer, arbete eller studier, socialt liv och livskvalitet."],
] as const;
const faqs = [
  ["Kan ett PTSD-test visa om jag har PTSD?", "Nej. Ett självtest kan identifiera symtom och mönster som kan förekomma vid PTSD, men diagnos kräver professionell bedömning."],
  ["Hur många frågor innehåller testet?", "Testet innehåller 30 frågor och tar normalt ungefär 5–7 minuter."],
  ["Kan man ha PTSD utan flashbacks?", "Ja. PTSD omfattar flera typer av symtom och alla upplever inte samma kombination eller intensitet."],
  ["Vad är skillnaden mellan PTSD och komplex PTSD?", "Komplex PTSD används för att beskriva PTSD-symtom tillsammans med mer långvariga svårigheter, exempelvis med känsloreglering, självbild eller relationer. Läs mer om komplex PTSD."],
  ["Kan PTSD påverka relationer?", "Traumarelaterade reaktioner kan påverka trygghet, kommunikation, närhet och stress i relationer, men hur det ser ut varierar mellan personer. Läs mer om PTSD och relationer."],
  ["Är testet anonymt?", "Du behöver inte skapa ett konto. Svaren sparas lokalt i den här webbläsaren så att du kan återvända till ditt resultat."],
] as const;
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([question, answer]) => ({ "@type": "Question", name: question, acceptedAnswer: { "@type": "Answer", text: answer } })) };

export default function PtsdLandingPage() {
  return <EditorialSurface><main data-rv="container" className="mx-auto max-w-4xl px-4 py-8 text-neutral-900 sm:px-6 sm:py-14"><EditorialArticleJsonLd data={article} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
    <nav aria-label="Brödsmulor" className="text-sm text-neutral-600"><Link href="/" className={textLink}>Relationsvarning</Link> / <span aria-current="page">PTSD-test</span></nav>
    <article><header className="mt-6 rounded-[28px] border border-[#d5e3d8] bg-[#f5faf6] px-5 py-8 shadow-sm sm:px-9 sm:py-12"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#2f6b4f]">PTSD-test för vuxna</p><h1 className="mt-3 max-w-3xl">PTSD-test – 30 frågor om posttraumatisk stress</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-neutral-700">Har du varit med om något svårt som fortfarande påverkar dig? Det här självtestet undersöker vanliga PTSD-relaterade reaktioner som återupplevande, undvikande, stark vaksamhet och förändringar i tankar och känslor.</p><div className="mt-7"><Link data-rv="button" href="/ptsd-test/test" className={cta}>Starta PTSD-testet</Link></div><p className="mt-3 text-sm font-semibold text-neutral-700">30 frågor · ca 5–7 min · anonymt · direkt resultat</p><p className="mt-4 max-w-2xl text-sm leading-6 text-neutral-600">Självtestet kan ge vägledning men kan inte fastställa en PTSD-diagnos.</p></header>

      <GuideSection title="Vad mäter PTSD-testet?"><p>PTSD kan visa sig på fler sätt än genom flashbacks. Testet tittar därför på flera olika typer av reaktioner och på hur mycket de påverkar din vardag.</p><div className="grid gap-3 sm:grid-cols-2">{areas.map(([heading, copy]) => <div data-rv="card" key={heading} className="min-w-0 rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><h3 className="font-semibold text-neutral-950">{heading}</h3><p className="mt-2 text-sm leading-6">{copy}</p></div>)}</div><Link data-rv="button" href="/ptsd-test/test" className={cta}>Gör PTSD-testet</Link></GuideSection>

      <GuideSection title="Vad får du efter testet?"><p>Efter 30 frågor analyseras dina svar och du får en personlig sammanställning av ditt mönster. Testet tittar inte bara på en totalpoäng utan jämför olika områden för att identifiera vilka reaktioner som framträder tydligast hos just dig.</p><div className="grid gap-3 sm:grid-cols-3">{[["Ditt övergripande resultat", "Se hur mycket PTSD-relaterade symtom som framträder i dina svar."], ["Ditt tydligaste område", "Se vilket symtomområde som sticker ut mest."], ["Personlig analys", "Dina svar används för att identifiera individuella mönster och skillnader mellan områdena."]].map(([heading, copy]) => <div data-rv="card" key={heading} className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5"><h3 className="font-semibold text-neutral-950">{heading}</h3><p className="mt-2 text-sm leading-6">{copy}</p></div>)}</div></GuideSection>

      <GuideSection title="Vad bygger testet på?"><div className="max-w-3xl space-y-4"><p>Testets struktur utgår från etablerade symtomområden som används för att beskriva PTSD. Frågorna är utformade för att undersöka återupplevande, undvikande, förändringar i tankar och känslor samt vaksamhet och stressreaktioner. Testet undersöker också hur reaktionerna påverkar vardagen.</p><p>Det är ett självskattningstest för vägledning och självreflektion – inte ett diagnostiskt instrument eller en ersättning för professionell bedömning.</p></div></GuideSection>

      <GuideSection title="PTSD är inte bara flashbacks"><div className="max-w-3xl space-y-4"><p>Många förknippar PTSD framför allt med flashbacks och mardrömmar. Men posttraumatisk stress kan också innebära att du ständigt är på din vakt, undviker vissa situationer, reagerar starkt på ljud eller andra påminnelser, känner dig avstängd eller har svårt att känna dig trygg trots att faran är över.</p><p>Därför undersöker testet flera olika typer av reaktioner.</p></div><Link data-rv="button" href="/ptsd-test/test" className={cta}>Starta testet</Link></GuideSection>

      <GuideSection title="Läs mer om PTSD"><div className="grid gap-3 sm:grid-cols-2"><Link data-rv="card" href="/ptsd" className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 font-medium hover:bg-neutral-100">Vad är PTSD? Vanliga symtom och stöd</Link><Link data-rv="card" href="/ptsd-symtom" className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 font-medium hover:bg-neutral-100">PTSD-symtom och vanliga reaktioner</Link><Link data-rv="card" href="/komplex-ptsd" className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 font-medium hover:bg-neutral-100">Komplex PTSD – skillnader och mönster</Link><Link data-rv="card" href="/ptsd-relationer" className="rounded-2xl border border-neutral-200 bg-neutral-50 p-5 font-medium hover:bg-neutral-100">PTSD och nära relationer</Link></div></GuideSection>

      <GuideSection title="Vanliga frågor om PTSD-testet"><div className="divide-y divide-neutral-200 border-y border-neutral-200">{faqs.map(([question, answer]) => <div key={question} className="py-5"><h3 className="font-semibold text-neutral-950">{question}</h3><p className="mt-2 max-w-3xl text-sm leading-6">{answer}{question.includes("komplex PTSD") && <> <Link href="/komplex-ptsd" className={textLink}>Läs om komplex PTSD.</Link></>}{question.includes("påverka relationer") && <> <Link href="/ptsd-relationer" className={textLink}>Läs om PTSD och relationer.</Link></>}</p></div>)}</div></GuideSection>

      <section data-rv="panel" className="mt-12 rounded-[28px] border border-[#d5e3d8] bg-[#f5faf6] px-5 py-8 text-center sm:px-9 sm:py-10"><h2 className="text-3xl font-semibold tracking-tight text-neutral-950">Känner du igen dig?</h2><p className="mx-auto mt-3 max-w-xl leading-7 text-neutral-700">30 frågor kan hjälpa dig att få en tydligare bild av vilka traumarelaterade reaktioner som framträder i dina svar.</p><div className="mt-6"><Link data-rv="button" href="/ptsd-test/test" className={cta}>Starta PTSD-testet</Link></div></section>
    </article>
  </main></EditorialSurface>;
}
