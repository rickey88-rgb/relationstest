import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
  title: "Integritetspolicy | Relationsvarning",
  description: "Läs hur Relationsvarning hanterar uppgifter, testsvar och lokal lagring samt hur du kontaktar oss i integritetsfrågor.",
  alternates: {
    canonical: "https://www.relationsvarning.se/integritet",
  },
};

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

      <h2 style={{ marginTop: 22, fontSize: 18 }}>2. Lagring av testsvar</h2>
      <p style={{ opacity: 0.9 }}>
        I nuvarande version sparas dina testsvar främst <b>lokalt i din webbläsare</b>{" "}
        för funktionalitet (t.ex. om sidan laddas om). AuDHD använder också krypterad
        serverlagring med sju dagars giltighet för det ursprungliga köp- och återställningsflödet.
      </p>
      <h3 style={{ marginTop: 18, fontSize: 16 }}>Sparad AuDHD-analys på Mina sidor</h3>
      <p style={{ opacity: 0.9 }}>Om du aktivt väljer att spara analysen på ditt konto lagras en separat, krypterad kopia av dess underlag i Supabase. Underlaget kan innehålla känsliga uppgifter om din hälsa. Vi använder det för att du ska kunna öppna din betalda analys igen, även från en annan enhet. Du behöver inte spara analysen på ett konto för att köpa eller använda resultatet.</p>
      <p style={{ opacity: 0.9 }}>Den exakta sista tillgänglighetsdagen visas på Mina sidor. Åtkomsten upphör senast tio dagar före tolv månader från sparningen. Kontokopian rensas därefter ur den aktiva databasen. Marginalen är avsedd för daglig rensning, hantering av driftfel och sju dagars säkerhetskopiering.</p>
      <p style={{ opacity: 0.9 }}>Du kan radera kontots sparade analys tidigare från Mina sidor. Köpposten finns då kvar utan testsvar, poäng eller profil. Kontots kopia, den ursprungliga gästlagringen och webbläsarens lokala data har separata giltighets- och raderingsflöden. Kontakta oss om du vill få hjälp att radera alla återstående kopior eller ditt konto.</p>
      <p style={{ opacity: 0.9 }}>Radering från den aktiva databasen innebär inte att tidigare säkerhetskopior omedelbart skrivs om. Kopior kan finnas kvar tills säkerhetskopiornas lagringstid löper ut. Innan en återställd säkerhetskopia används i tjänsten behöver tidigare raderingsbegäranden och utgångna lagringstider tillämpas igen. Kontakta oss för information om den aktuella backuphanteringen.</p>
      <p style={{ opacity: 0.9 }}>För att en raderad analys inte ska visas efter återställning sparas ett separat raderingskvitto utan testsvar eller mejladress. Kvittot innehåller en skyddad identifierare och tidpunkt. Det hanteras separat från analysens underlag.</p>
      <p style={{ opacity: 0.9 }}>Testsvar och sparade analyser används inte för reklam eller statistik. Mina sidor och inloggningsflödet är undantagna från vår Google Analytics-mätning.</p>

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

      <h2 style={{ marginTop: 22, fontSize: 18 }}>5. Kontakt</h2>
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
        Senast uppdaterad: {new Date().toISOString().slice(0, 10)}
      </p>
    </main>
  );
}
