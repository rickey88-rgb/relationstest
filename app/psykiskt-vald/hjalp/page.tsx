import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hjälp vid psykiskt våld – stöd, säkerhet & nästa steg",
  description:
    "Behöver du hjälp vid psykiskt våld i en relation? Läs om stöd, säkerhet, socialtjänst, polis, dokumentation och praktiska nästa steg.",
  alternates: {
    canonical: "/psykiskt-vald/hjalp",
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
          PSYKISKT VÅLD · HJÄLP & STÖD
        </p>

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 52px)",
            lineHeight: 1.08,
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Hjälp vid psykiskt våld – vad kan du göra?
        </h1>

        <p
          style={{
            marginTop: 20,
            fontSize: 19,
            lineHeight: 1.7,
            opacity: 0.86,
          }}
        >
          Om du lever med hot, kontroll, förnedring, övervakning eller andra
          återkommande kränkningar behöver du inte först bevisa exakt vad som
          händer för att söka hjälp.
        </p>

        <p
          style={{
            fontSize: 17,
            lineHeight: 1.75,
          }}
        >
          Det finns flera möjliga nästa steg. Vad som är rätt beror på din
          situation, hur trygg du känner dig och om det finns risk att
          beteendet eskalerar.
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
          Om du är i akut fara
        </h2>

        <p style={{ lineHeight: 1.7 }}>
          Ring <strong>112</strong> om ett brott pågår, om du är i omedelbar
          fara eller om polis eller annan akut hjälp behövs snabbt.
        </p>

        <p style={{ lineHeight: 1.7, marginBottom: 0 }}>
          Om situationen inte är akut men du vill kontakta polisen kan du
          ringa <strong>114 14</strong> eller besöka en polisstation.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Du behöver inte veta exakt vad du ska kalla det
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Många som utsätts för psykiskt våld beskriver först en känsla av att
          något är fel utan att kunna sätta ett tydligt ord på det.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det kan handla om att du blivit mer försiktig, börjat väga varje ord,
          undviker vissa personer, känner dig kontrollerad eller allt oftare
          tvivlar på ditt eget omdöme.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Du behöver inte själv avgöra om beteendet juridiskt uppfyller
          kriterierna för psykiskt våld innan du söker stöd.
        </p>
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
          Börja med att bedöma din säkerhet
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om personen är hotfull, mycket kontrollerande eller reagerar starkt
          när du försöker sätta gränser kan det vara klokt att tänka på
          säkerheten innan du konfronterar personen eller berättar att du
          tänker lämna relationen.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Försök om möjligt att ha kontakt med någon du litar på och fundera
          över var du kan ta vägen om du snabbt behöver lämna situationen.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
          Om du bedömer att ett visst steg kan öka risken för dig är det
          viktigare att prioritera säkerheten än att försöka följa någon
          generell checklista.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Prata med någon utanför relationen
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Psykiskt våld kan göra det svårt att lita på sin egen bedömning.
          Därför kan det vara värdefullt att berätta konkret för någon du
          litar på vad som faktiskt händer.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Försök beskriva enskilda situationer snarare än att bara säga att
          relationen är dålig. Det kan göra det lättare både för dig och den
          andra personen att se om det finns ett återkommande mönster.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Kontakta socialtjänsten i din kommun
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Socialtjänsten har ansvar för att ge stöd och hjälp till personer som
          utsätts för våld i nära relationer.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Stödet kan se olika ut beroende på situation och kommun. Det kan
          exempelvis handla om samtalsstöd, rådgivning, hjälp att planera för
          säkerhet eller andra insatser utifrån dina behov.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Du kan kontakta socialtjänsten även om du ännu inte har gjort en
          polisanmälan.
        </p>
      </section>

      <section
        style={{
          marginTop: 42,
          padding: 24,
          borderRadius: 18,
          border: "1px solid #ddd",
        }}
      >
        <h2 style={{ fontSize: 28, marginTop: 0 }}>
          Kvinnofridslinjen
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Kvinnofridslinjen är en nationell stödlinje för kvinnor som utsatts
          för hot, våld eller sexuella övergrepp.
        </p>

        <p style={{ fontSize: 20, fontWeight: 800 }}>
          116 016
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
          Linjen är öppen dygnet runt och du kan vara anonym.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Dokumentera det som händer
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om det går att göra utan att utsätta dig för ytterligare risk kan
          dokumentation hjälpa dig att få en tydligare bild av mönstret.
        </p>

        <ul
          style={{
            fontSize: 17,
            lineHeight: 1.9,
            paddingLeft: 22,
          }}
        >
          <li>skriv ner konkreta händelser</li>
          <li>notera datum eller ungefärlig tidsperiod</li>
          <li>spara relevanta sms och chattar</li>
          <li>spara mejl och röstmeddelanden</li>
          <li>notera eventuella vittnen</li>
          <li>beskriv hur beteendet påverkar din vardag</li>
        </ul>

        <Link
          href="/psykiskt-vald/bevis"
          style={{ color: "#111", fontWeight: 800 }}
        >
          Läs mer om bevis och dokumentation →
        </Link>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Om personen kontrollerar din telefon eller dina konton
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om personen kontrollerar din mobil, kan dina lösenord eller följer
          din plats bör du tänka på hur du söker hjälp och sparar information.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Använd om möjligt en telefon, dator eller ett konto som personen inte
          har tillgång till.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Var försiktig med att plötsligt ändra inställningar eller lösenord om
          du tror att det kan göra personen misstänksam och öka risken för
          hot eller våld.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Du kan söka vård för hur du mår
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Långvarig rädsla, kontroll och kränkningar kan påverka både psykiskt
          och fysiskt välbefinnande.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om du mår dåligt kan du kontakta hälso- och sjukvården och berätta
          om din situation. Vården kan hjälpa till med dina symtom och
          dokumentera sådant som är relevant för din hälsa.
        </p>
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
          Försöker du förstå vad som händer i relationen?
        </h2>

        <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
          Relationsvarnings test om psykiskt våld går igenom 30 frågor inom
          bland annat beskyllningar, förnedring, hot, tvång, övervakning,
          upprepning och påverkan på självkänsla och frihet.
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
          Testet kan hjälpa dig identifiera mönster men kan inte fastställa om
          ett brott har begåtts.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Om du funderar på att polisanmäla
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Sedan den 1 juli 2026 finns ett särskilt brott som heter psykiskt
          våld. Bestämmelsen tar bland annat sikte på upprepade kränkningar
          genom exempelvis hot, tvång, förnedring och övervakning.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Du behöver inte själv avgöra om det du utsatts för juridiskt når upp
          till brottsrekvisiten innan du kontaktar polisen.
        </p>

        <Link
          href="/psykiskt-vald/polisanmalan"
          style={{ color: "#111", fontWeight: 800 }}
        >
          Så går en polisanmälan till →
        </Link>
      </section>

      <section style={{ marginTop: 44 }}>
        <h2 style={{ fontSize: 30 }}>
          Ett möjligt nästa steg
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om du känner dig överväldigad behöver du inte lösa hela situationen
          på en gång. Ett första steg kan vara att göra en enda konkret sak:
          skriva ner vad som hänt, prata med någon du litar på eller kontakta
          en stödinstans.
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
            href="/psykiskt-vald/polisanmalan"
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 14,
              color: "#111",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Polisanmäla psykiskt våld →
          </Link>
        </div>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 30 }}>Vanliga frågor</h2>

        <div style={{ display: "grid", gap: 22 }}>
          <div>
            <h3>Var kan jag få hjälp vid psykiskt våld?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Du kan bland annat kontakta socialtjänsten i din kommun,
              hälso- och sjukvården, en stödjour eller polisen beroende på vad
              du behöver hjälp med och hur akut situationen är.
            </p>
          </div>

          <div>
            <h3>Måste jag lämna relationen direkt?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Det är du som fattar beslut om relationen. Om det finns hot,
              våld eller stark kontroll kan det däremot vara klokt att tänka
              igenom säkerheten och få stöd innan du gör förändringar som kan
              påverka situationen.
            </p>
          </div>

          <div>
            <h3>Måste jag polisanmäla för att få hjälp?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Nej. Du kan söka stöd även om du inte har gjort en
              polisanmälan eller ännu inte vet om du vill göra en.
            </p>
          </div>

          <div>
            <h3>Kan psykiskt våld vara allvarligt även utan slag?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Ja. Psykiskt våld kan bestå av återkommande hot, kontroll,
              tvång, förnedring och övervakning utan att fysiskt våld
              förekommer.
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