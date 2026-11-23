import Link from "next/link";
import { GuideSection, textLink } from "../_components/ContentGuide";
import { ThinkingBook, ThinkingExercise, ThinkingGuide, thinkingGuideMetadata } from "../_components/ThinkingGuide";

const guide = {
  route: "/sluta-alta",
  title: "Sluta älta gamla händelser och misstag – en praktisk guide",
  description: "Spelar du upp gamla samtal eller misstag? Prova en skrivövning som hjälper dig att avgöra om du kan reparera något, dra en lärdom eller gå vidare.",
} as const;

export const metadata = thinkingGuideMetadata(guide);

const sources = [
  { href: "https://www.1177.se/Kalmar-lan/liv--halsa/psykisk-halsa/att-ma-daligt/", label: "1177 – När oro eller grubbel tar mycket kraft" },
  { href: "https://pubmed.ncbi.nlm.nih.gov/22695223/", label: "Studie om återkommande tankar före och efter en situation där andra bedömer en" },
  { href: "https://kbtiprimarvarden.se/behandling/kbt-manualer/primarvardsanpassad-kbt-vid-depression/modul-hantera-oro-och-grubbel/", label: "KBT i Primärvården – Hantera oro och grubbel" },
];

export default function RuminationGuide() {
  return (
    <ThinkingGuide guide={guide} heading="När du fastnar i att älta det som redan hänt"
      intro="Mötet tog slut klockan tre. Ändå sitter du kvar i det på bussen hem, just vid meningen där du avbröt en kollega. Du kan ha något konkret att ställa till rätta. Men efter fem genomgångar av kollegans min är det värt att fråga vad du fortfarande försöker få reda på."
      sources={sources}>
      <GuideSection title="Vad gör skillnaden mellan att reflektera och älta?">
        <p>Reflektion kan hjälpa när du vill förstå ett misstag, ta ansvar eller fatta ett nytt beslut. När du ältar återkommer ofta samma frågor trots att du saknar nya svar. Du kan glida från ”Vad hände där?” till ”Hur kunde jag vara så dum?” Den första frågan går ibland att besvara. Den andra drar lätt in allt annat du någonsin tyckt att du gjort fel.</p>
        <p>1177 beskriver hur återkommande negativa tankar och mycket grubbel kan påverka måendet. Forskare har också studerat hur människor tänker tillbaka efter situationer där de kan ha blivit bedömda av andra. En genomgång kan kännas som arbete även när du ännu inte fått fram något du kan använda.</p>
      </GuideSection>
      <GuideSection title="Skrivövning för ett gammalt misstag">
        <ThinkingExercise>
          <h3>Vad är fortfarande möjligt att göra?</h3>
          <p>Välj en enskild händelse som känns hanterbar att skriva om. Börja med vad någon utomstående hade kunnat se eller höra. I mötet ovan räcker ”Jag började prata innan min kollega hade talat klart”. Du behöver inte bedöma vad alla i rummet tyckte.</p>
          <ol className="list-decimal space-y-3 pl-6">
            <li><strong>Reparera det som går.</strong> Om du tog ordet från kollegan kan du följa upp en gång. ”Jag avbröt dig i mötet. Förlåt. Vad var det du ville få sagt?” Ge personen utrymme att svara.</li>
            <li><strong>Spara en lärdom för nästa gång.</strong> Om det du kan påverka ligger framåt kan lärdomen vara ”Jag väntar tills den andra har avslutat sin mening”. Skriv den som ett beteende du kan prova.</li>
            <li><strong>Avsluta genomgången för stunden.</strong> Om det saknas en rimlig åtgärd eller ny information, skriv det. Bestäm sedan en konkret sak du gör härnäst. Du kan återgå till den även om tanken kommer tillbaka.</li>
          </ol>
          <p>Du behöver inte använda alla tre steg varje gång. Om ditt ansvar är oklart kan du börja med att fråga någon som känner till situationen. Om du redan har bett om ursäkt och blivit lyssnad på kan lärdomen vara det enda som återstår.</p>
        </ThinkingExercise>
      </GuideSection>
      <ThinkingBook source={guide.route}>I boken finns verktyget ”Problemet eller grubblandet?” för den här sortens avvägning. Skrivbladen ger plats att öva på fler tillfällen utan att börja från ett tomt papper.</ThinkingBook>
      <GuideSection title="Om det finns en större förlust eller en olöst konflikt">
        <p>Sorg, en svår upplevelse eller en konflikt som pågår kan behöva tid, stöd eller praktiska åtgärder. En skrivövning är ett sätt att sortera vad som ligger framför dig just nu. Du kan välja att avbryta om det blir för svårt, prata med någon du litar på eller söka stöd hos vården om grubblandet påverkar vardagen mycket.</p>
        <p>Byter tankarna riktning från ”vad sa jag?” till ”vad kan gå fel nästa gång?” kan du gå vidare till <Link className={textLink} href="/overtankande">huvudguiden om övertänkande</Link>. Om det du försöker förstå gäller en pågående kontakt hittar du ett konkret sätt att ställa en fråga i <Link className={textLink} href="/overtankande-i-relationer">guiden om övertänkande i relationer</Link>.</p>
      </GuideSection>
    </ThinkingGuide>
  );
}
