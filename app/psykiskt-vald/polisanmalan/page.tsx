import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Polisanmäla psykiskt våld – så går en anmälan till",
  description:
    "Hur polisanmäler man psykiskt våld? Läs hur du kan göra en polisanmälan, vilken information som kan vara relevant och vad som händer efteråt.",
  alternates: {
    canonical: "/psykiskt-vald/polisanmalan",
  },
};

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 820,
        margin: "0 auto",
        padding: "32px 20px 60px",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Arial, sans-serif",
        color: "#111",
      }}
    >
      <header>
        <p
          style={{
            fontSize: 14,
            fontWeight: 700,
            opacity: 0.65,
            marginBottom: 10,
          }}
        >
          PSYKISKT VÅLD · POLISANMÄLAN
        </p>

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 52px)",
            lineHeight: 1.08,
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Hur polisanmäler man psykiskt våld?
        </h1>

        <p
          style={{
            marginTop: 20,
            fontSize: 19,
            lineHeight: 1.7,
            opacity: 0.86,
          }}
        >
          Sedan den 1 juli 2026 finns ett särskilt brott som heter{" "}
          <strong>psykiskt våld</strong> i Sverige. Om du tror att du utsätts
          behöver du inte själv kunna avgöra exakt vilket brott som kan ha
          begåtts innan du kontaktar polisen.
        </p>
      </header>

      <section
        style={{
          marginTop: 30,
          padding: 24,
          borderRadius: 18,
          background: "#111",
          color: "#fff",
        }}
      >
        <h2 style={{ marginTop: 0, fontSize: 30 }}>
          Vid akut fara – ring 112
        </h2>

        <p style={{ lineHeight: 1.7, marginBottom: 0 }}>
          Om situationen är akut, om ett brott pågår eller om du är rädd att
          du eller någon annan kommer att skadas ska du ringa{" "}
          <strong>112</strong>. För situationer som inte är akuta kan du
          kontakta polisen på <strong>114 14</strong> eller besöka en
          polisstation.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Måste jag veta om det juridiskt är psykiskt våld?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Nej. Du behöver inte själv göra den juridiska bedömningen innan du
          berättar för polisen vad som har hänt.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det viktiga är att beskriva händelserna så konkret som möjligt:
          vad personen har gjort eller sagt, hur ofta det har hänt och under
          vilken tidsperiod.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Polis och åklagare får sedan bedöma vilka brott som kan vara
          aktuella och om det finns förutsättningar att utreda dem.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Så kan du förbereda dig</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om situationen tillåter kan det vara bra att samla den information
          du redan har innan du gör anmälan.
        </p>

        <ul
          style={{
            fontSize: 17,
            lineHeight: 1.9,
            paddingLeft: 22,
          }}
        >
          <li>skriv ner konkreta händelser</li>
          <li>notera datum eller ungefärliga tidsperioder</li>
          <li>spara relevanta sms och chattar</li>
          <li>spara mejl och röstmeddelanden</li>
          <li>notera personer som kan ha sett eller hört något</li>
          <li>beskriv om beteendena återkommit över tid</li>
        </ul>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Du behöver däremot inte ha samlat ihop ett komplett bevispaket för
          att kunna kontakta polisen.
        </p>

        <Link
          href="/psykiskt-vald/bevis"
          style={{ color: "#111", fontWeight: 800 }}
        >
          Läs mer om bevis och dokumentation →
        </Link>
      </section>

      <section
        style={{
          marginTop: 42,
          padding: 24,
          border: "1px solid #ddd",
          borderRadius: 18,
          background: "#fafafa",
        }}
      >
        <h2 style={{ fontSize: 28, marginTop: 0 }}>
          Försök beskriva konkreta beteenden
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det kan vara svårt att sammanfatta flera månaders eller års
          händelser. Försök därför att ge konkreta exempel istället för att
          enbart beskriva relationen med övergripande ord.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Berätta exempelvis om återkommande:
        </p>

        <ul
          style={{
            fontSize: 17,
            lineHeight: 1.9,
            paddingLeft: 22,
            marginBottom: 0,
          }}
        >
          <li>beskyllningar</li>
          <li>nedsättande uttalanden</li>
          <li>förödmjukande beteenden</li>
          <li>hot</li>
          <li>tvång</li>
          <li>övervakning eller digital kontroll</li>
        </ul>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Berätta att beteendet har upprepats
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Upprepning är central i bestämmelsen om psykiskt våld. Om liknande
          händelser har inträffat många gånger är det därför viktigt att
          beskriva även detta.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          En tidslinje kan hjälpa dig att visa hur situationen har utvecklats
          och vilka typer av beteenden som återkommit.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Berätta hur situationen har påverkat dig
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Bestämmelsen om psykiskt våld innehåller ett krav på att
          kränkningarna sammantagna ska ha varit ägnade att allvarligt skada
          personens självkänsla.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Därför kan det vara relevant att beskriva hur situationen har
          påverkat exempelvis din trygghet, självkänsla, frihet och hur du
          beter dig i vardagen.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Du kanske har börjat gå på äggskal, undvika vissa personer,
          begränsa vad du säger eller anpassa dina beslut för att undvika
          personens reaktioner.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Ta med det material du har</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om du har sparat sms, skärmbilder, mejl, röstmeddelanden eller annan
          relevant information kan du berätta det för polisen.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Försök om möjligt att behålla originalmaterialet och information om
          när kommunikationen ägt rum.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Vad händer efter polisanmälan?</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Efter en polisanmälan bedömer polis eller åklagare om det finns
          anledning att inleda eller fortsätta en förundersökning.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Under en utredning kan förhör hållas och relevant material samlas
          in. Vilka utredningsåtgärder som blir aktuella beror på
          omständigheterna i det enskilda fallet.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          En polisanmälan innebär inte automatiskt att någon kommer att åtalas
          eller dömas. Bevisningen behöver bedömas i varje enskilt fall.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Om psykiskt våld har pågått sedan före den 1 juli 2026
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Den särskilda bestämmelsen om psykiskt våld trädde i kraft den 1
          juli 2026 och kan inte tillämpas retroaktivt på handlingar som
          begicks innan dess.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om ett återkommande beteende har fortsatt efter den 1 juli 2026 kan
          handlingar efter ikraftträdandet däremot vara relevanta för
          bedömningen enligt den nya bestämmelsen.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Äldre händelser kan också röra andra brott. Du behöver därför inte
          själv försöka avgöra exakt vilken lagbestämmelse varje händelse
          tillhör.
        </p>

        <Link
          href="/psykiskt-vald/ny-lag-2026"
          style={{ color: "#111", fontWeight: 800 }}
        >
          Läs mer om den nya lagen →
        </Link>
      </section>

      <section
        style={{
          marginTop: 42,
          padding: 24,
          borderRadius: 18,
          background: "#111",
          color: "#fff",
        }}
      >
        <h2 style={{ fontSize: 28, marginTop: 0 }}>
          Försöker du förstå om det finns ett återkommande mönster?
        </h2>

        <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
          Relationsvarnings anonyma test går igenom 30 frågor inom åtta
          områden, bland annat beskyllningar, förnedring, hot, tvång,
          övervakning, upprepning och påverkan på självkänsla och frihet.
        </p>

        <Link
          href="/psykisk-misshandel-relation/test"
          style={{
            display: "inline-block",
            marginTop: 6,
            padding: "13px 18px",
            borderRadius: 12,
            background: "#fff",
            color: "#111",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          Gör testet om psykiskt våld
        </Link>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: 12,
            lineHeight: 1.6,
            opacity: 0.65,
          }}
        >
          Testet är inte en juridisk bedömning och kan inte fastställa om ett
          brott har begåtts.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Om personen kontrollerar din mobil
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om du misstänker att personen övervakar din telefon, dina konton
          eller din internetanvändning bör du tänka på säkerheten när du söker
          information eller sparar dokumentation.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Använd om möjligt en enhet eller ett konto som personen inte har
          tillgång till. Undvik åtgärder som kan öka risken för dig om
          personen upptäcker dem.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Kan jag få stöd även om jag är osäker?</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Ja. Du behöver inte vara säker på att ett brott har begåtts för att
          prata med någon om din situation.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om du känner dig rädd, kontrollerad eller nedbruten kan du söka stöd
          även om du ännu inte har bestämt dig för om du vill göra en
          polisanmälan.
        </p>
      </section>

      <section style={{ marginTop: 44 }}>
        <h2 style={{ fontSize: 30 }}>Läs vidare</h2>

        <div style={{ display: "grid", gap: 12 }}>
          <Link
            href="/psykiskt-vald"
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 14,
              color: "#111",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Psykiskt våld – komplett guide →
          </Link>

          <Link
            href="/psykiskt-vald/bevis"
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 14,
              color: "#111",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Bevis och dokumentation →
          </Link>

          <Link
            href="/psykiskt-vald/vad-raknas-som"
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 14,
              color: "#111",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Vad räknas som psykiskt våld? →
          </Link>

          <Link
            href="/psykiskt-vald/exempel"
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 14,
              color: "#111",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Exempel på psykiskt våld →
          </Link>

          <Link
            href="/psykiskt-vald/straff"
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 14,
              color: "#111",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Straff för psykiskt våld →
          </Link>
        </div>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 30 }}>Vanliga frågor</h2>

        <div style={{ display: "grid", gap: 22 }}>
          <div>
            <h3>Kan man polisanmäla psykisk misshandel?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Du kan kontakta polisen och berätta om de handlingar du utsatts
              för. Sedan den 1 juli 2026 finns dessutom ett särskilt brott som
              heter psykiskt våld. Andra brott kan också vara aktuella
              beroende på vad som har hänt.
            </p>
          </div>

          <div>
            <h3>Måste jag ha bevis innan jag polisanmäler?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Du behöver inte själv ha färdigställt en komplett bevisning
              innan du kontaktar polisen. Berätta vad som har hänt och vilket
              material som finns.
            </p>
          </div>

          <div>
            <h3>Kan jag anmäla om det aldrig varit fysiskt våld?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Ja. Psykiskt våld förutsätter inte i sig att personen också har
              utsatts för fysiskt våld.
            </p>
          </div>

          <div>
            <h3>Kan jag anmäla en tidigare partner?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Att relationen har tagit slut hindrar inte i sig att du
              kontaktar polisen om handlingar som inträffat. Vilka
              bestämmelser som kan tillämpas beror bland annat på vad som
              hänt och när.
            </p>
          </div>
        </div>
      </section>

      <footer
        style={{
          marginTop: 54,
          paddingTop: 18,
          borderTop: "1px solid #e5e5e5",
          fontSize: 13,
          opacity: 0.72,
          lineHeight: 1.7,
          textAlign: "center",
        }}
      >
        <div>
          Kontakt:{" "}
          <a href="mailto:support@relationsvarning.se">
            support@relationsvarning.se
          </a>
        </div>

        <div style={{ marginTop: 6 }}>
          <Link href="/villkor">Villkor</Link> ·{" "}
          <Link href="/integritet">Integritet</Link>
        </div>
      </footer>
    </main>
  );
}