import type { Metadata } from "next";
import Link from "next/link";
import { behaviors, canonicalHost } from "../../content/behaviors";
import { ContentGuide, GuideLinks, GuideSection, SupportNotice, textLink } from "../_components/ContentGuide";

export const metadata: Metadata = {
  title: "Beteenden i relationer – kontroll, manipulation och varningssignaler",
  description: "Hitta konkreta exempel på kontroll, digital övervakning, skuldbeläggning och ekonomisk press i relationer. Läs om gränser, sammanhang och stöd.",
  alternates: { canonical: `${canonicalHost}/beteenden` },
};

const groups = [
  { id: "control", title: "Kontroll och svartsjuka", intro: "Oro kan diskuteras utan att den ena behöver redovisa hela sitt liv. Här handlar det om när frågor och misstankar blir regler för dig." },
  { id: "digital", title: "Digital kontroll", intro: "Mobilen och dina konton kan bli verktyg för insyn och press. Börja med den situation du känner igen, eller läs helheten i guiden om digitalt våld." },
  { id: "gaslighting", title: "Gaslighting och verklighetsförvrängning", intro: "Att minnas olika eller vara oense är inte automatiskt gaslighting. Sidorna hjälper dig skilja sådant från återkommande avfärdanden och ansvarsförskjutning." },
  { id: "pressure", title: "Bestraffning och emotionell press", intro: "Tystnad och hot kan göra det svårt att välja fritt. Vid uttalanden om självskada behöver risken alltid tas på allvar, oavsett sammanhang." },
  { id: "money", title: "Ekonomisk kontroll", intro: "Gemensam ekonomi behöver ge båda insyn och delaktighet. Brist på pengar och att bli hindrad från att använda dem är olika problem." },
  { id: "limits", title: "Isolering och begränsningar", intro: "Egna vänner och vardagsval kan krympa stegvis. Lägg märke till vad du inte längre gör och vilka reaktioner du försöker undvika." },
];

export default function BehaviorsHub() {
  return <ContentGuide title="Beteenden i relationer – kontroll, manipulation och varningssignaler" intro="Utgå från det som händer i din vardag. Här finns 15 konkreta situationer med exempel, skillnader att fundera över och möjliga nästa steg. Du behöver inte först hitta en etikett för partnern eller relationen.">
    <GuideSection title="Hur du kan använda översikten"><p>Välj det beteende som ligger närmast din fråga. Läs sedan om sammanhanget: upprepas det, kan du säga nej och vad händer när du gör det? Enstaka händelser beskriver inte hela en relation, men ett allvarligt hot behöver tas på allvar även första gången.</p><p>Texten kan hjälpa dig att sätta ord på en upplevelse. Den avgör inte någons diagnos, avsikt eller juridiska ansvar. Flera beteenden kan förekomma samtidigt utan att du behöver läsa allt för att söka stöd.</p></GuideSection>
    {groups.map((group) => <GuideSection key={group.id} title={group.title}><p>{group.intro}</p><GuideLinks links={behaviors.filter((page) => page.group === group.id).map((page) => ({ href: `/beteenden/${page.slug}`, label: page.h1 }))} /></GuideSection>)}
    <SupportNotice />
    <GuideSection title="Förstå det större mönstret"><GuideLinks links={[{ href: "/digitalt-vald", label: "Digitalt våld – konton, mobil och övervakning" }, { href: "/ekonomiskt-vald", label: "Ekonomiskt våld – pengar, beroende och hjälp" }, { href: "/kontrollerande-relation", label: "Kontrollerande partner – vanliga tecken" }, { href: "/psykiskt-vald", label: "Psykiskt våld – översikt och stöd" }]} /></GuideSection>
    <GuideSection title="Test som nästa steg, om du vill"><p>För en bredare reflektion finns <Link href="/psykisk-misshandel-relation/test" className={textLink}>testet om psykisk misshandel och psykiskt våld</Link>. Om du särskilt känner igen återkommande förnekanden eller tvivel på din egen upplevelse finns <Link href="/gaslightingtest/test" className={textLink}>gaslightingtestet</Link>.</p><p>Testerna är inte diagnoser eller juridiska bedömningar. Stöd och säkerhetsinformation finns tillgängligt utan test eller köp.</p></GuideSection>
  </ContentGuide>;
}
