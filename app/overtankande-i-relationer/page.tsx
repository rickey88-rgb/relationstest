import Link from "next/link";
import { GuideSection, textLink } from "../_components/ContentGuide";
import { ThinkingBook, ThinkingExercise, ThinkingGuide, thinkingGuideMetadata } from "../_components/ThinkingGuide";

const guide = {
  route: "/overtankande-i-relationer",
  title: "Övertänkande i relationer – när sms och tystnad tar över",
  description: "Fastnar du i att tolka sms eller ett sent svar? Skilj det du vet från det du befarar och hitta ett sätt att fråga som passar situationen.",
} as const;

export const metadata = thinkingGuideMetadata(guide);

const sources = [
  { href: "https://pubmed.ncbi.nlm.nih.gov/35085449/", label: "Patel m.fl. – studie om romantisk anknytning, meddelanden och relationskvalitet" },
  { href: "https://pubmed.ncbi.nlm.nih.gov/28813288/", label: "Simpson och Rholes – forskningsöversikt om anknytning och stress i nära relationer" },
  { href: "https://www.1177.se/orebrolan/liv--halsa/vald-overgrepp-och-sexuella-trakasserier/att-bli-utsatt-for-vald-i-nara-relationer/", label: "1177 – våld i nära relationer och vägar till stöd" },
];

export default function RelationshipThinkingGuide() {
  return (
    <ThinkingGuide guide={guide} heading="När du övertänker i en relation"
      intro="Ni hade sagt att ni skulle ses i kväll. Du skickade en fråga om tid för tre timmar sedan och nu läser du gårdagens konversation igen. Behöver du veta om middagen blir av, eller försöker du förstå vad tystnaden betyder för hela relationen? Det är två olika frågor, och den första går ofta att ställa rakt."
      sources={sources}>
      <GuideSection title="Ett sent svar kan betyda flera saker">
        <p>Ett uteblivet svar kan väcka oro även när det finns flera rimliga förklaringar. Du vet att det saknas ett svar. Du vet kanske också att ni brukar höras snabbare. Resten behöver bedömas med hjälp av vad som faktiskt händer mellan er över tid.</p>
        <p>En studie av 302 studenter i romantiska relationer fann samband mellan anknytningsrelaterad oro och önskemål om tätare meddelandekontakt. Studien visar ett gruppmönster. Svarstiden kan inte tala om vilken anknytning en enskild person har eller varför de dröjer. <Link className={textLink} href="/anknytning/angslig-anknytning">Guiden om ängslig anknytning</Link> fördjupar hur behovet av bekräftelse kan märkas utan att göra svarstider till ett test.</p>
      </GuideSection>
      <GuideSection title="Övning för ett sms du läst för många gånger">
        <ThinkingExercise>
          <h3>Det jag vet, det jag tolkar och det jag behöver</h3>
          <dl className="space-y-3">
            <div><dt className="font-semibold">Det jag vet</dt><dd>Jag frågade när vi ska ses och har inget svar. Vi har inte bestämt klockslag.</dd></div>
            <div><dt className="font-semibold">Det jag tolkar</dt><dd>Jag befarar att personen har ångrat sig. Det är möjligt. Det finns andra möjliga förklaringar som jag ännu inte vet något om.</dd></div>
            <div><dt className="font-semibold">Det jag behöver</dt><dd>Jag behöver kunna planera kvällen. Jag behöver inte reda ut hela relationen för att göra det.</dd></div>
          </dl>
          <p><strong>Så kan du fråga.</strong> ”Jag behöver planera kvällen. Blir det av att vi ses? Om jag inte hör något före sex gör jag andra planer.” Anpassa tid och ton till vad ni faktiskt kommit överens om.</p>
        </ThinkingExercise>
        <p>Om frågan egentligen är hur mycket kontakt ni vill ha brukar ett samtal i lugnare läge ge mer information än att lösa det i varje sms. Du kan fråga vad som är rimligt för er båda. Om det i stället är ett redan avslutat samtal du fortsätter att spela upp finns en annan övning i <Link className={textLink} href="/sluta-alta">guiden om ältande efter en händelse</Link>.</p>
      </GuideSection>
      <GuideSection title="När oron säger något om relationens villkor">
        <p>Om någon ofta bryter överenskommelser eller straffar dig med tystnad när du säger nej finns det mer att titta på än hur du tolkar ett sms. Lägg märke till vad som händer när du uttrycker ett behov och om ni kan prata om det utan att du blir förlöjligad, pressad eller rädd. Läs mer om <Link className={textLink} href="/sund-relation">respekt och gränser i en sund relation</Link>. Om du känner dig hotad eller kontrollerad finns <Link className={textLink} href="/psykiskt-vald/hjalp">vägar till stöd</Link>.</p>
        <p>Om du märker samma överanalys i flera sammanhang, även när relationen känns trygg, kan du pröva <Link className={textLink} href="/overtankande">övningen i huvudguiden om övertänkande</Link> på ett vardagsbeslut.</p>
      </GuideSection>
      <ThinkingBook source={guide.route}>Om du vill se vad som händer mellan ett sent svar och nästa kontroll kan du använda bokens Tankeloop-karta. Du kan följa en sådan vana över tid med de ifyllningsbara skrivbladen.</ThinkingBook>
    </ThinkingGuide>
  );
}
