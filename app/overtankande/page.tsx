import Link from "next/link";
import { GuideSection, textLink } from "../_components/ContentGuide";
import { ThinkingBook, ThinkingExercise, ThinkingGuide, thinkingGuideMetadata } from "../_components/ThinkingGuide";

const guide = {
  route: "/overtankande",
  title: "Övertänkande – varför tankarna fastnar och vad du kan göra",
  description: "Varför övertänker man? Lär dig skilja problemlösning från grubbel och prova en konkret övning för att komma vidare när samma fråga går runt.",
} as const;

export const metadata = thinkingGuideMetadata(guide);

const sources = [
  { href: "https://pubmed.ncbi.nlm.nih.gov/16239152/", label: "Watkins, Moulds och Mackintosh – en studie om oro och ältande" },
  { href: "https://www.1177.se/Skane/liv--halsa/psykisk-halsa/att-vara-orolig/", label: "1177 – Att vara orolig" },
  { href: "https://kbtiprimarvarden.se/behandling/kbt-manualer/primarvardsanpassad-kbt-vid-depression/modul-hantera-oro-och-grubbel/", label: "KBT i Primärvården – Hantera oro och grubbel" },
];

export default function OverthinkingGuide() {
  return (
    <ThinkingGuide guide={guide} heading="Övertänkande – när tankarna fastnar"
      intro="Du har läst igenom ditt mejl och det är klart att skicka. Ändå öppnar du det igen. Först vill du rätta en mening. Sedan försöker du förutse hur varje person kommer att tolka den. När du märker att du ställer samma fråga för tredje gången kan det vara dags att byta från tänkande till handling, vila eller en paus."
      sources={sources}>
      <GuideSection title="Vad är övertänkande?">
        <p>Övertänkande är ett vardagsord för att fastna i analys, oro eller grubbel. Det viktiga är vad tänkandet gör i stunden. Efter en hjälpsam genomgång vet du något nytt, ser en fråga du behöver ställa eller har ett steg att prova. När du fastnar kan samma argument komma tillbaka i olika ord utan att alternativen blir tydligare.</p>
        <p>Oro handlar ofta om vad som skulle kunna hända. Ältande handlar ofta om det du redan varit med om. Samma tanke kan röra sig åt båda hållen. Du går igenom gårdagens samtal och börjar samtidigt undra hur du kommer att bli bemött i morgon. Forskning som jämfört oro och ältande beskriver både skillnader och gemensamma drag.</p>
      </GuideSection>
      <GuideSection title="Varför är det så lätt att ta ett varv till?">
        <p>Osäkerhet kan kännas som en signal att du missat något. Och ibland har du det. En ny titt kan avslöja ett stavfel eller ett datum som krockar. Men när frågan har blivit ”Kan jag vara helt säker på att det blir bra?” hittar du sällan ett svar bara genom att gå igenom samma information igen.</p>
        <p>Säg att du har två rimliga tider för att träffa en vän. Du kan kontrollera kalendern och föreslå den som passar bäst. Om du sedan försöker räkna ut vilken tid som gör dig minst besvärlig för vännen har du lämnat kalenderfrågan. Ett enkelt förslag ger vännen chans att svara. Fler minuter över kalendern ger dig bara fler tänkbara svar.</p>
      </GuideSection>
      <GuideSection title="Prova en kontrollfråga när du fastnar">
        <ThinkingExercise>
          <h3>Vad skulle nästa tankevända tillföra?</h3>
          <p>Välj en pågående vardagsfråga där ett litet steg går att ändra efteråt. Skriv svaren kort, gärna en rad per steg.</p>
          <ol className="list-decimal space-y-3 pl-6">
            <li><strong>Skriv vad du försöker avgöra.</strong> ”Ska jag skicka mötesförslaget i dag?” är lättare att jobba med än ”Tänk om det blir fel?”</li>
            <li><strong>Nämn det som faktiskt saknas.</strong> Väntar du på en uppgift som kan ändra beslutet? Om svaret är ja, välj hur och när du får tag i den. Om du redan har det du behöver, skriv det.</li>
            <li><strong>Välj nästa handling och en anledning att ompröva.</strong> ”Jag skickar de två tiderna. Jag tittar på det igen när någon svarar.” När tanken dyker upp innan dess kan du gå tillbaka till det du höll på med.</li>
          </ol>
          <p>Övningen är klar när du har valt nästa steg. Du får känna dig osäker även efteråt. Beslut med verkliga konsekvenser kan behöva mer tid, råd eller en säkerhetskontroll.</p>
        </ThinkingExercise>
      </GuideSection>
      <ThinkingBook source={guide.route}>Vill du pröva samma arbetssätt på fler situationer? Boken innehåller Tankeloop-kartan, åtta ifyllningsbara skrivblad och en fjortondagarsplan där du följer en vana i taget.</ThinkingBook>
      <GuideSection title="Välj det som passar det du fastnat i">
        <p>Om du framför allt spelar upp ett samtal du redan haft kan du läsa om <Link className={textLink} href="/sluta-alta">hur du hanterar ältande efter en händelse</Link>. Om det är en annan persons tystnad eller ton som håller dig kvar är guiden om <Link className={textLink} href="/overtankande-i-relationer">övertänkande i relationer</Link> mer konkret för just den situationen.</p>
        <p>Om oron flyttar mellan olika delar av livet kan <Link className={textLink} href="/standig-oro">guiden om ständig oro</Link> hjälpa dig att känna igen mönstret. När oron återkommande gör det svårt att sova, arbeta eller få vardagen att fungera kan du vända dig till en vårdcentral eller läsa vidare hos 1177.</p>
      </GuideSection>
    </ThinkingGuide>
  );
}
