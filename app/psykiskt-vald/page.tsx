import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Psykiskt våld – tecken, ny lag 2026, test & hjälp",
  description:
    "Lär dig känna igen psykiskt våld i en relation, vad den nya lagen från 1 juli 2026 innebär och gör ett anonymt test baserat på återkommande beteendemönster.",
  alternates: {
    canonical: "/psykiskt-vald",
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
          PSYKISKT VÅLD I NÄRA RELATION
        </p>

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 52px)",
            lineHeight: 1.08,
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Psykiskt våld – tecken, exempel och den nya lagen
        </h1>

        <p
          style={{
            marginTop: 20,
            fontSize: 19,
            lineHeight: 1.7,
            opacity: 0.86,
          }}
        >
          Psykiskt våld kan bestå av återkommande kränkningar, hot,
          kontroll, tvång, förödmjukelser eller övervakning som gradvis
          påverkar din självkänsla och frihet. Sedan den 1 juli 2026 finns
          dessutom ett särskilt brott i svensk lag som heter{" "}
          <strong>psykiskt våld</strong>.
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
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: "0.05em",
            opacity: 0.72,
          }}
        >
          ANONYMT TEST
        </p>

        <h2 style={{ margin: "10px 0 0", fontSize: 28 }}>
          Misstänker du psykiskt våld i din relation?
        </h2>

        <p
          style={{
            marginTop: 12,
            lineHeight: 1.7,
            opacity: 0.9,
          }}
        >
          Vårt test innehåller 30 frågor om bland annat beskyllningar,
          nedsättande uttalanden, förödmjukelser, hot, tvång, kontroll,
          övervakning, upprepning och hur relationen påverkar din
          självkänsla och handlingsfrihet.
        </p>

        <Link
          href="/psykisk-misshandel-relation/test"
          style={{
            display: "inline-block",
            marginTop: 8,
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
          Testet är ett orienteringsverktyg och kan inte avgöra om ett
          brott har begåtts.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30, marginBottom: 14 }}>
          Vad är psykiskt våld?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Psykiskt våld handlar ofta mindre om en enstaka konflikt och mer
          om ett återkommande mönster. Det kan vara beteenden som får dig
          att tvivla på dig själv, känna rädsla för personens reaktioner,
          anpassa ditt beteende eller gradvis förlora friheten att fatta
          egna beslut.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det kan förekomma utan fysiskt våld och kan vara svårt att
          upptäcka medan man befinner sig mitt i relationen. Många
          beteenden kan dessutom var för sig framstå som relativt små,
          samtidigt som kombinationen och upprepningen skapar ett betydligt
          allvarligare mönster.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30, marginBottom: 18 }}>
          Vad räknas som psykiskt våld enligt lagen?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          I 4 kap. 7 b § brottsbalken anges flera typer av kränkningar som
          kan omfattas när de sker upprepat och sammantaget är ägnade att
          allvarligt skada en persons självkänsla.
        </p>

        <div
          style={{
            display: "grid",
            gap: 12,
            marginTop: 20,
          }}
        >
          {[
            [
              "Beskyllningar",
              "Återkommande anklagelser eller skuldbeläggning som används för att trycka ner eller kontrollera.",
            ],
            [
              "Nedsättande uttalanden",
              "Kommentarer som återkommande förminskar, förolämpar eller bryter ner personen.",
            ],
            [
              "Förödmjukande beteende",
              "Handlingar som får personen att känna sig förnedrad, skamsen eller ovärdig.",
            ],
            [
              "Otillbörliga hot",
              "Hot som används för att skrämma, påverka eller få personen att anpassa sitt beteende.",
            ],
            [
              "Otillbörligt tvång",
              "Press eller tvång som begränsar personens möjlighet att fatta egna beslut.",
            ],
            [
              "Otillbörlig övervakning",
              "Kontroll eller bevakning som exempelvis kan röra mobil, platsinformation, konton eller vardagsliv.",
            ],
          ].map(([title, text]) => (
            <div
              key={title}
              style={{
                padding: 18,
                border: "1px solid #e7e7e7",
                borderRadius: 14,
                background: "#fff",
              }}
            >
              <h3 style={{ margin: 0, fontSize: 19 }}>{title}</h3>
              <p
                style={{
                  margin: "8px 0 0",
                  lineHeight: 1.65,
                  opacity: 0.82,
                }}
              >
                {text}
              </p>
            </div>
          ))}
        </div>
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
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            opacity: 0.6,
          }}
        >
          NY LAG 2026
        </p>

        <h2 style={{ fontSize: 28, margin: "8px 0 12px" }}>
          Psykiskt våld är ett särskilt brott sedan 1 juli 2026
        </h2>

        <p style={{ lineHeight: 1.75, fontSize: 17 }}>
          Den nya bestämmelsen innebär att den som upprepat utsätter en
          annan person för vissa typer av kränkningar kan dömas för
          psykiskt våld om handlingarna sammantaget varit ägnade att
          allvarligt skada personens självkänsla.
        </p>

        <p style={{ lineHeight: 1.75, fontSize: 17 }}>
          Även <strong>varaktig otillbörlig övervakning</strong> kan omfattas
          av bestämmelsen. Straffet för psykiskt våld är fängelse i högst
          fyra år.
        </p>

        <p
          style={{
            marginBottom: 0,
            lineHeight: 1.7,
            fontSize: 14,
            opacity: 0.7,
          }}
        >
          Bedömningen av om ett konkret beteende uppfyller lagens krav
          måste alltid göras utifrån omständigheterna i det enskilda
          fallet.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Vanliga tecken på psykiskt våld</h2>

        <ul
          style={{
            fontSize: 17,
            lineHeight: 1.9,
            paddingLeft: 22,
          }}
        >
          <li>Du går på äggskal för att undvika personens reaktion.</li>
          <li>Du får återkommande skulden för konflikter och problem.</li>
          <li>Du blir förminskad, hånad eller kallad nedvärderande saker.</li>
          <li>Personen försöker styra vilka du träffar eller pratar med.</li>
          <li>Din mobil, plats eller kommunikation kontrolleras.</li>
          <li>Du pressas att göra saker du egentligen inte vill göra.</li>
          <li>Hot eller skrämsel används för att påverka dina beslut.</li>
          <li>Du börjar tvivla på ditt eget omdöme.</li>
          <li>Din självkänsla försämras över tid.</li>
          <li>Du känner dig mindre fri och mindre som dig själv.</li>
        </ul>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Psykiskt våld kan vara digitalt</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Psykiskt våld kan också ha en tydlig digital dimension. Det kan
          exempelvis handla om att en partner kräver ständig
          platsinformation, kontrollerar meddelanden och sociala medier,
          kräver lösenord eller använder appar och konton för att hålla
          uppsikt över personen.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det innebär inte att varje svartsjuk fråga eller varje
          konflikt om mobilen automatiskt är ett brott. Det är bland annat
          beteendets karaktär, upprepning, sammanhang och påverkan som blir
          viktiga i bedömningen.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Skillnaden mellan psykisk misshandel och psykiskt våld
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          <strong>Psykisk misshandel</strong> är ett vanligt uttryck för
          destruktiva och nedbrytande beteenden i en relation.{" "}
          <strong>Psykiskt våld</strong> är numera också namnet på ett
          särskilt brott i svensk lag.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Orden används därför ofta om närliggande fenomen, men den
          juridiska bedömningen har specifika krav. Vill du läsa mer om
          psykisk misshandel i relationer kan du gå vidare till vår
          fördjupade sida.
        </p>

        <Link
          href="/psykisk-misshandel-relation"
          style={{
            fontWeight: 800,
            color: "#111",
          }}
        >
          Läs om psykisk misshandel i relation →
        </Link>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Om du känner igen dig</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om flera av beteendena återkommer kan det vara värdefullt att
          börja dokumentera vad som faktiskt händer. Skriv gärna ner datum,
          händelser och sammanhang och spara relevanta meddelanden eller
          andra digitala spår.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Dokumentation kan både hjälpa dig att själv se ett mönster
          tydligare och vara användbar om du senare söker stöd eller vill
          diskutera situationen med polis eller juridisk rådgivare.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om du befinner dig i akut fara ska du ringa <strong>112</strong>.
        </p>
      </section>

      <section
        style={{
          marginTop: 46,
          padding: 26,
          borderRadius: 18,
          background: "#111",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: 30, marginTop: 0 }}>
          Vill du förstå ditt eget relationsmönster?
        </h2>

        <p
          style={{
            maxWidth: 620,
            margin: "12px auto 20px",
            lineHeight: 1.7,
            opacity: 0.88,
          }}
        >
          Gör vårt anonyma test om psykisk misshandel och psykiskt våld.
          Resultatet analyserar dina svar inom åtta områden och hjälper dig
          se vilka mönster som sticker ut.
        </p>

        <Link
          href="/psykisk-misshandel-relation/test"
          style={{
            display: "inline-block",
            padding: "14px 20px",
            borderRadius: 12,
            background: "#fff",
            color: "#111",
            textDecoration: "none",
            fontWeight: 900,
          }}
        >
          Gör testet
        </Link>
      </section>

      <section style={{ marginTop: 44 }}>
  <h2 style={{ fontSize: 30 }}>Fördjupa dig om psykiskt våld</h2>

  <p style={{ fontSize: 17, lineHeight: 1.75 }}>
    Här kan du läsa vidare om hur lagen fungerar, vilka beteenden som kan
    vara relevanta och hur psykiskt våld kan dokumenteras.
  </p>

  <div
    style={{
      display: "grid",
      gap: 12,
      marginTop: 20,
    }}
  >
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
      href="/psykiskt-vald/ny-lag-2026"
      style={{
        padding: 16,
        border: "1px solid #ddd",
        borderRadius: 14,
        color: "#111",
        textDecoration: "none",
        fontWeight: 800,
      }}
    >
      Nya lagen om psykiskt våld 2026 →
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
      Bevis och dokumentation vid psykiskt våld →
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

<Link
  href="/psykisk-misshandel"
  style={{
    padding: 16,
    border: "1px solid #ddd",
    borderRadius: 14,
    color: "#111",
    textDecoration: "none",
    fontWeight: 800,
  }}
>
  Psykisk misshandel – tecken och guide →
</Link>
  </div>
</section>

      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 30 }}>Vanliga frågor</h2>

        <div style={{ display: "grid", gap: 22 }}>
          <div>
            <h3>Är psykiskt våld olagligt?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Ja. Sedan den 1 juli 2026 finns ett särskilt brott i
              brottsbalken som heter psykiskt våld. För straffansvar måste
              lagens förutsättningar vara uppfyllda.
            </p>
          </div>

          <div>
            <h3>Måste psykiskt våld vara fysiskt?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Nej. Bestämmelsen handlar uttryckligen om psykiska
              kränkningar såsom beskyllningar, nedsättande uttalanden,
              förödmjukande beteende, hot, tvång och övervakning.
            </p>
          </div>

          <div>
            <h3>Kan kontroll av mobilen räknas som psykiskt våld?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Otillbörlig övervakning omfattas av lagen. Om kontroll av
              mobil, konton eller platsinformation når den juridiska
              gränsen beror däremot på omständigheterna i det enskilda
              fallet.
            </p>
          </div>

          <div>
            <h3>Kan testet avgöra om jag utsatts för ett brott?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Nej. Testet kan identifiera beteendemönster som överlappar
              sådant lagen tar sikte på, men det är inte en juridisk
              prövning och kan inte fastställa om ett brott har begåtts.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}