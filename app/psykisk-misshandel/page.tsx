import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Psykisk misshandel – tecken, exempel & vad du kan göra",
  description:
    "Vad är psykisk misshandel? Läs om vanliga tecken, exempel, kontroll, hot, förnedring och hur psykisk misshandel förhåller sig till lagen om psykiskt våld.",
  alternates: {
    canonical: "/psykisk-misshandel",
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
          PSYKISK MISSHANDEL · GUIDE
        </p>

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 52px)",
            lineHeight: 1.08,
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Psykisk misshandel – tecken, exempel och hjälp
        </h1>

        <p
          style={{
            marginTop: 20,
            fontSize: 19,
            lineHeight: 1.7,
            opacity: 0.86,
          }}
        >
          Psykisk misshandel är ett vanligt vardagligt begrepp för
          återkommande beteenden som bryter ner, skrämmer, kontrollerar eller
          begränsar en annan person. Det kan förekomma utan att det någonsin
          sker fysiskt våld.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det kan vara svårt att känna igen när man själv befinner sig mitt i
          relationen. En enskild konflikt säger sällan särskilt mycket. Det
          viktiga är ofta <strong>mönstret över tid</strong>.
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
        <h2 style={{ marginTop: 0, fontSize: 28 }}>
          Misstänker du psykisk misshandel?
        </h2>

        <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
          Relationsvarnings anonyma test går igenom 30 frågor om bland annat
          skuldbeläggning, förnedring, hot, kontroll, övervakning, upprepning
          och påverkan på din självkänsla och frihet.
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
          Gör testet om psykisk misshandel
        </Link>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: 12,
            lineHeight: 1.6,
            opacity: 0.65,
          }}
        >
          Testet hjälper dig att identifiera återkommande mönster. Det är inte
          en juridisk bedömning och kan inte fastställa om ett brott har
          begåtts.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Vad är psykisk misshandel?</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Psykisk misshandel kan beskriva ett återkommande sätt att behandla
          någon som gradvis påverkar personens trygghet, självkänsla,
          självständighet eller handlingsutrymme.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det kan vara tydliga handlingar som hot och förnedring, men också
          mer svårupptäckta beteenden som ständig skuldbeläggning, kontroll,
          övervakning eller att personen steg för steg begränsar vem du träffar
          och vad du gör.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Ofta är det just kombinationen och upprepningen som gör situationen
          nedbrytande.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Vanliga tecken på psykisk misshandel</h2>

        <div style={{ display: "grid", gap: 14 }}>
          {[
            [
              "Du får ständigt skulden",
              "Konflikter vänds återkommande till att allt är ditt fel, även när ansvaret egentligen är gemensamt.",
            ],
            [
              "Du blir nedvärderad",
              "Din intelligens, personlighet, kropp, förmåga eller dina känslor används för att få dig att känna dig mindre värd.",
            ],
            [
              "Du blir förödmjukad",
              "Personen gör narr av dig, använder dina sårbarheter mot dig eller förnedrar dig inför andra.",
            ],
            [
              "Du går på äggskal",
              "Du tänker noga på vad du säger eller gör eftersom du försöker undvika personens reaktion.",
            ],
            [
              "Du blir kontrollerad",
              "Personen försöker styra vilka du träffar, vad du gör, hur du klär dig, arbetar eller använder pengar.",
            ],
            [
              "Din mobil kontrolleras",
              "Personen vill läsa meddelanden, kontrollera sociala medier, kräver lösenord eller följer din plats.",
            ],
            [
              "Du utsätts för hot",
              "Hot om konsekvenser, separation, ryktesspridning, skada eller andra repressalier används för att påverka dig.",
            ],
            [
              "Dina gränser respekteras inte",
              "Ett nej leder till press, skuld, konflikt eller andra konsekvenser tills du till slut ger efter.",
            ],
          ].map(([title, text]) => (
            <div
              key={title}
              style={{
                padding: 20,
                border: "1px solid #ddd",
                borderRadius: 16,
              }}
            >
              <h3 style={{ margin: "0 0 8px", fontSize: 20 }}>{title}</h3>
              <p style={{ margin: 0, lineHeight: 1.7 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Psykisk misshandel är ofta ett mönster
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Att någon säger något elakt under ett enstaka gräl innebär inte
          automatiskt att relationen präglas av psykisk misshandel.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          En viktig varningssignal är istället att samma eller liknande
          beteenden <strong>kommer tillbaka gång på gång</strong>. Det kan
          exempelvis vara en kombination av beskyllningar, kontroll,
          förnedring och hot.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Efter en konflikt kan personen be om ursäkt eller lova förändring,
          men efter en tid återkommer samma beteende. Då kan enskilda
          händelser börja bilda ett tydligare mönster.
        </p>
        <Link
  href="/psykisk-misshandel-relation"
  style={{ color: "#111", fontWeight: 800 }}
>
  Läs mer om psykisk misshandel i relationer →
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
          Hur kan psykisk misshandel påverka dig?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          När beteendena pågår länge kan du börja förändra dig själv för att
          hantera relationen.
        </p>

        <ul
          style={{
            fontSize: 17,
            lineHeight: 1.9,
            paddingLeft: 22,
            marginBottom: 0,
          }}
        >
          <li>du tvivlar mer på ditt eget omdöme</li>
          <li>din självkänsla försämras</li>
          <li>du undviker konflikter till nästan varje pris</li>
          <li>du känner dig mindre fri att fatta egna beslut</li>
          <li>du drar dig undan vänner eller familj</li>
          <li>du försöker hela tiden förutse personens humör</li>
          <li>du känner dig mindre som dig själv än tidigare</li>
        </ul>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Psykisk misshandel och gaslighting
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Gaslighting är ett begrepp som används för manipulation där en
          person får någon annan att börja tvivla på sina minnen,
          upplevelser eller sin verklighetsuppfattning.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det kan förekomma som en del av ett större destruktivt mönster, men
          all psykisk misshandel är inte gaslighting.
        </p>

        <Link
          href="/gaslighting-relation"
          style={{ color: "#111", fontWeight: 800 }}
        >
          Läs mer om gaslighting →
        </Link>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Är psykisk misshandel olagligt?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Sedan den <strong>1 juli 2026</strong> finns ett särskilt brott i
          Sverige som heter <strong>psykiskt våld</strong>.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Bestämmelsen omfattar under vissa förutsättningar upprepade
          kränkningar i form av beskyllningar, nedsättande uttalanden,
          förödmjukande beteende, otillbörliga hot, otillbörligt tvång eller
          otillbörlig övervakning.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Kränkningarna ska sammantagna ha varit ägnade att allvarligt skada
          personens självkänsla. Bestämmelsen omfattar också varaktig
          otillbörlig övervakning när lagens övriga krav är uppfyllda.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det betyder inte att allt som i vardagligt språk kallas psykisk
          misshandel automatiskt utgör brottet psykiskt våld. Den juridiska
          bedömningen måste göras utifrån omständigheterna i det enskilda
          fallet.
        </p>

        <Link
          href="/psykiskt-vald/ny-lag-2026"
          style={{ color: "#111", fontWeight: 800 }}
        >
          Läs om den nya lagen om psykiskt våld →
        </Link>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Psykisk misshandel utan fysiskt våld
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          En relation behöver inte innehålla slag eller annat fysiskt våld för
          att vara allvarligt destruktiv.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Hot, tvång, kontroll, övervakning och systematisk förnedring kan
          påverka en persons vardag och handlingsfrihet även när det inte
          finns några synliga fysiska skador.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Dokumentera konkreta händelser
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om du försöker förstå vad som händer kan det hjälpa att skriva ner
          konkreta situationer med datum eller ungefärlig tidsperiod.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om det kan göras säkert kan det också vara relevant att spara
          meddelanden, mejl, röstmeddelanden och annan kommunikation som visar
          vad som har hänt.
        </p>

        <Link
          href="/psykiskt-vald/bevis"
          style={{ color: "#111", fontWeight: 800 }}
        >
          Läs om bevis och dokumentation →
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
          Känner du igen flera av tecknen?
        </h2>

        <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
          Testet hjälper dig att gå igenom situationen systematiskt och se
          vilka typer av återkommande beteenden som är tydligast i din
          relation.
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
          Gör testet
        </Link>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Vad kan du göra om du känner igen dig?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Du behöver inte fatta alla beslut på en gång. Ett första steg kan
          vara att prata med någon du litar på, dokumentera vad som händer
          eller kontakta en stödinstans.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om du tror att personen övervakar din telefon eller dina konton bör
          du tänka på säkerheten när du söker information eller sparar
          dokumentation.
        </p>

        <Link
          href="/psykiskt-vald/hjalp"
          style={{ color: "#111", fontWeight: 800 }}
        >
          Se var du kan få hjälp →
        </Link>
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
          Om du funderar på att polisanmäla
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Du behöver inte själv avgöra vilket brott som kan ha begåtts innan
          du kontaktar polisen. Försök istället beskriva konkreta händelser och
          hur beteendet har sett ut över tid.
        </p>

        <Link
          href="/psykiskt-vald/polisanmalan"
          style={{ color: "#111", fontWeight: 800 }}
        >
          Läs hur en polisanmälan kan gå till →
        </Link>
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
            Konkreta exempel på psykiskt våld →
          </Link>

          <Link
            href="/psykiskt-vald/hjalp"
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 14,
              color: "#111",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Hjälp vid psykiskt våld →
          </Link>
        </div>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 30 }}>Vanliga frågor</h2>

        <div style={{ display: "grid", gap: 22 }}>
          <div>
            <h3>Hur vet man om man blir psykiskt misshandlad?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Titta framför allt efter återkommande mönster. Exempel kan vara
              ständig skuldbeläggning, förnedring, hot, kontroll, övervakning
              och att du successivt får mindre utrymme att vara dig själv.
            </p>
          </div>

          <div>
            <h3>Kan psykisk misshandel ske utan hot?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Ja. Psykisk misshandel är ett brett vardagligt begrepp och kan
              exempelvis bestå av återkommande förnedring, kontroll,
              skuldbeläggning eller andra nedbrytande beteenden.
            </p>
          </div>

          <div>
            <h3>Är psykisk misshandel samma sak som psykiskt våld?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Inte exakt. Psykisk misshandel används brett i vardagligt språk.
              Psykiskt våld är sedan den 1 juli 2026 också namnet på ett
              särskilt brott med bestämda juridiska rekvisit.
            </p>
          </div>

          <div>
            <h3>Kan man göra ett test för psykisk misshandel?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Ett test kan hjälpa dig att systematiskt identifiera beteenden
              och återkommande mönster. Det kan däremot inte avgöra om ett
              brott har begåtts eller ersätta en professionell bedömning.
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