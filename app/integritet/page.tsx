import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Integritetspolicy | Relationsvarning",
  description: "Läs hur Relationsvarning hanterar uppgifter, testsvar och lokal lagring samt hur du kontaktar oss i integritetsfrågor.",
  alternates: {
    canonical: "https://www.relationsvarning.se/integritet",
  },
};

const controllerName = "Rickey Hammarstedt";
const controllerAddress = "villavägen 17";

export default function IntegritetPage() {
  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
        lineHeight: 1.7,
      }}
    >
      <h1 style={{ marginTop: 0, fontSize: 28, fontWeight: 900 }}>
        Integritetspolicy
      </h1>

      <p style={{ opacity: 0.85 }}>
        Här beskriver vi hur vi hanterar uppgifter när du använder våra tester och Mina sidor.
      </p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>1. Vilka uppgifter vi hanterar</h2>
      <ul style={{ opacity: 0.9 }}>
        <li>
          <b>Betalningsuppgifter:</b> hanteras av Stripe (vi ser inte dina fullständiga
          kortuppgifter).
        </li>
        <li>
          <b>Testdata lokalt:</b> för att testet ska fungera kan viss data sparas i din
          webbläsare (t.ex. via localStorage) så att du inte tappar dina svar vid refresh.
        </li>
        <li><b>Frivilligt konto:</b> Supabase hanterar din inloggning via mejllänk. Köp som du själv kopplar till kontot sparas separat från analysens underlag.</li>
      </ul>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>2. Testsvar, analyser och Mina sidor</h2>
      <p style={{ opacity: 0.9 }}>För nya köp i Mina sidors testflöde behandlas testsvar och analyser direkt i Supabase. Svaren lagras krypterat med testets och rapportens version så att samma resultat kan återskapas. Uppgifterna kan röra din hälsa. Köp- och betalningsreferenser hanteras separat från testsvar och rapporter. Alla våra 15 betaltester omfattas. Ingen PLUS-prenumeration krävs för att se köpta resultat.</p>
      <p style={{ opacity: 0.9 }}>Du kan genomföra testet och köpa resultatet utan konto. För den tillfälliga gästleveransen ber vi om ditt uttryckliga samtycke till behandlingen. Gäståtkomsten gäller högst sju dagar. Därefter spärras åtkomsten och underlaget gallras dagligen. Säkerhetskopior kan finnas kvar under en begränsad tid efter gallringen.</p>
      <h3 style={{ marginTop: 18, fontSize: 16 }}>Frivillig kontosparning i högst tolv månader</h3>
      <p style={{ opacity: 0.9 }}>Efter köpet kan du separat och frivilligt samtycka till att spara alla dina testsvar och din fullständiga analys på ditt konto. Resultaten finns kvar när du loggar ut. Ett aktivt konto förlänger inte lagringstiden: kontoåtkomsten upphör senast tio dagar före tolv månader från sparningen. Den sista dagen visas på Mina sidor. Marginalen används för daglig gallring och sju dagars säkerhetskopiering.</p>
      <p style={{ opacity: 0.9 }}>Du kan radera en sparad analys och återkalla lagringssamtycket på Mina sidor. Då tas även dess kvarvarande gästkopia bort. Köp- och betalningsuppgifter innehåller inga svar eller rapporter och raderas inte automatiskt tillsammans med analysen. Kontakta support@relationsvarning.se för hjälp med konto, kvarvarande kopior eller andra dataskyddsrättigheter. Återkallandet påverkar inte lagligheten av tidigare behandling.</p>
      <h3 style={{ marginTop: 18, fontSize: 16 }}>Samtyckesbevis, köphistorik och säkerhetskopior</h3>
      <p style={{ opacity: 0.9 }}>Vi dokumenterar samtyckets version och tidpunkt tillsammans med det underlag som samtycket gäller. Uppgifterna sparas bara så länge motsvarande underlag finns kvar: gästunderlag enligt sjudagarsflödet och kontosparat underlag i högst tolv månader. När underlaget raderas tas även dessa samtyckesuppgifter bort. Vi sparar ingen separat långvarig kopia av samtyckesbeviset efter raderingen.</p>
      <p style={{ opacity: 0.9 }}>Köphistorik sparas endast så länge den behövs för kundservice, köpverifiering eller rättsliga skyldigheter. Behovet prövas vid konto- och raderingsärenden samt vid en årlig manuell genomgång. Uppgifter som inte längre behövs tas bort. Eventuellt bokföringsunderlag hålls separat och följer tillämpliga lagkrav. Analysens tidsgräns innebär inte automatisk radering av köphistorik.</p>
      <p style={{ opacity: 0.9 }}>Raderade analyser kan finnas kvar tills skyddade säkerhetskopior löper ut. En separat privat raderingsjournal hindrar att de åter visas efter återställning. Journalen innehåller en skyddad teknisk referens och raderingstid, inga testsvar eller mejladresser. Raderingskvitton skyddas i 400 dagar. Journalen har detta särskilda återställningsändamål och är inte ett samtyckesregister.</p>
      <p style={{ opacity: 0.9 }}>Äldre köp och återställningslänkar behåller sina befintliga flöden och importeras inte till Mina sidor. I äldre tester kan svar finnas lokalt i webbläsaren; äldre AuDHD-flöden använder också krypterad serverlagring med sju dagars giltighet. Kontakta oss om du behöver hjälp med dessa uppgifter.</p>
      <h3 style={{ marginTop: 18, fontSize: 16 }}>Varför uppgifterna behandlas och av vilka</h3>
      <p style={{ opacity: 0.9 }}>Nödvändig köp- och kontoadministration behandlas för att fullgöra avtalet med dig. Behandling av testsvar och analyser bygger på ditt samtycke, och på ditt uttryckliga samtycke när uppgifterna rör hälsa. Gästleverans och frivillig kontosparning är separata val. Eventuella uppgifter som måste bevaras enligt lag behandlas för den rättsliga skyldigheten.</p>
      <p style={{ opacity: 0.9 }}>Supabase hanterar konto, databas och känslig analysbehandling; Stripe betalningar; Resend inloggningsmejl; Cloudflare R2 raderingsjournalen. Vercel levererar webbplatsen och befintliga äldre flöden. Healthchecks får tomma driftpingar. I det nya testflödet skickas testsvar, rapporter och inloggningstoken direkt mellan webbläsaren och Supabase. Leverantörer kan använda underleverantörer och behandling utanför EU/EES kan förekomma. Kontakta oss för information om tillämpliga biträdesavtal och överföringsskydd.</p>
      <p style={{ opacity: 0.9 }}>Testsvar och sparade analyser används inte för reklam eller statistik. Mina sidor och inloggningsflödet är undantagna från vår Google Analytics-mätning.</p>
      <h3 style={{ marginTop: 18, fontSize: 16 }}>Dina rättigheter</h3>
      <p style={{ opacity: 0.9 }}>Du kan begära tillgång till dina uppgifter, rättelse, radering, begränsning och, där det är tillämpligt, dataportabilitet eller invända mot behandling. Du kan återkalla samtycke när som helst. Skriv till support@relationsvarning.se. Vi kan behöva kontrollera din identitet för att skydda dina uppgifter. Du kan också lämna klagomål till Integritetsskyddsmyndigheten, IMY.</p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>3. Cookies och lokal lagring</h2>
      <p style={{ opacity: 0.9 }}>
        Tjänsten kan använda lokal lagring (t.ex. localStorage) för att komma ihåg testets
        status. Du kan rensa detta genom att rensa webbplatsdata i din webbläsare.
      </p>

      <h3 style={{ marginTop: 18, fontSize: 16 }}>Valfri besöksstatistik med Google Analytics</h3>
      <p style={{ opacity: 0.9 }}>
        Om du godkänner statistik använder vi Google Analytics 4 för att förstå sidbesök
        och hur test- och köpflöden används. Det omfattar testets namn, start, framsteg,
        slutförande, tidsåtgång och köpbelopp. För AuDHD kan ett Stripe-verifierat köp
        kopplas till Google Analytics pseudonyma klient- och sessionsidentifierare för att
        mätningen ska räknas en gång och tillskrivas rätt besök. Testsvar, testpoäng och
        profiltyper skickas inte.
        Google Analytics använder cookies efter ditt godkännande. Du kan avvisa statistik
        och ändå använda testerna och köpa resultat. Ändra eller återkalla ditt val via
        Statistikinställningar i sidfoten; då stoppas fortsatt mätning och sajtens
        Google Analytics-cookies tas bort.
      </p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>4. Betalningsleverantör (Stripe)</h2>
      <p style={{ opacity: 0.9 }}>
        Betalning hanteras av Stripe. Stripe behandlar betalningsuppgifter enligt sina
        egna villkor och integritetspolicy.
      </p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>5. Personuppgiftsansvarig och kontakt</h2>
      <p style={{ opacity: 0.9 }}>Personuppgiftsansvarig: {controllerName}. Kontaktadress: {controllerAddress}.</p>
      <p style={{ opacity: 0.9 }}>
        Frågor om integritet:{" "}
        <a href="mailto:support@relationsvarning.se">support@relationsvarning.se</a>
      </p>

      <nav aria-label="Sidnavigation" style={{ marginTop: 24, fontSize: 13 }}>
        <Link href="/" style={{ textDecoration: "underline" }}>Till startsidan</Link>
        {" · "}
        <Link href="/villkor" style={{ textDecoration: "underline" }}>Villkor</Link>
      </nav>

      <p style={{ marginTop: 26, fontSize: 12, opacity: 0.7 }}>
        Senast uppdaterad: 2026-10-30
      </p>
    </main>
  );
}
