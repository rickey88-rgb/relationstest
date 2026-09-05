import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ny lag om psykiskt våld 2026 – så fungerar lagen",
  description:
    "Den 1 juli 2026 infördes brottet psykiskt våld i Sverige. Läs vad den nya lagen innebär, vilka beteenden som omfattas och vilket straff som gäller.",
  alternates: {
    canonical: "/psykiskt-vald/ny-lag-2026",
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
          NY LAG 2026 · PSYKISKT VÅLD
        </p>

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 52px)",
            lineHeight: 1.08,
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Ny lag om psykiskt våld 2026 – vad innebär den?
        </h1>

        <p
          style={{
            marginTop: 20,
            fontSize: 19,
            lineHeight: 1.7,
            opacity: 0.86,
          }}
        >
          Den <strong>1 juli 2026</strong> infördes ett särskilt brott i
          brottsbalken som heter <strong>psykiskt våld</strong>. Syftet är
          bland annat att kunna träffa upprepade psykiska kränkningar som
          tillsammans bildar ett allvarligt och nedbrytande mönster.
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
            opacity: 0.7,
          }}
        >
          DET VIKTIGASTE
        </p>

        <h2 style={{ margin: "10px 0 12px", fontSize: 30 }}>
          Psykiskt våld är nu ett eget brott
        </h2>

        <p style={{ lineHeight: 1.7 }}>
          Bestämmelsen finns i <strong>4 kap. 7 b § brottsbalken</strong> och
          omfattar under vissa förutsättningar upprepade beskyllningar,
          nedsättande uttalanden, förödmjukande beteende, otillbörliga hot,
          otillbörligt tvång och otillbörlig övervakning.
        </p>

        <p style={{ lineHeight: 1.7, marginBottom: 0 }}>
          Handlingarna ska sammantaget ha varit ägnade att{" "}
          <strong>allvarligt skada den utsatta personens självkänsla</strong>.
          Straffet är fängelse i högst fyra år.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Varför infördes den nya lagen?</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Psykiskt våld kan bestå av många handlingar som var för sig inte
          alltid fångar hur allvarlig den samlade situationen är. En person
          kan exempelvis utsättas för återkommande förnedring, kontroll,
          beskyllningar och hot som tillsammans gradvis bryter ner
          självkänslan och begränsar personens handlingsutrymme.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Den nya bestämmelsen är därför utformad för att kunna bedöma ett{" "}
          <strong>mönster av upprepade kränkningar</strong>, snarare än att
          varje händelse alltid måste betraktas isolerat.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Vad säger den nya lagen?</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          För den del av bestämmelsen som gäller upprepade kränkningar pekar
          lagtexten ut sex typer av beteenden:
        </p>

        <div style={{ display: "grid", gap: 12, marginTop: 20 }}>
          {[
            [
              "Beskyllning",
              "Återkommande anklagelser eller skuldbeläggning kan ingå i det mönster som bedöms.",
            ],
            [
              "Nedsättande uttalande",
              "Återkommande uttalanden som förminskar, förolämpar eller bryter ner personen.",
            ],
            [
              "Förödmjukande beteende",
              "Beteenden som förnedrar eller utsätter personen för skam och förödmjukelse.",
            ],
            [
              "Otillbörligt hot",
              "Hot som på ett otillbörligt sätt används för att skrämma eller påverka personen.",
            ],
            [
              "Otillbörligt tvång",
              "Tvång som på ett otillbörligt sätt begränsar personens möjlighet att bestämma över sitt eget liv.",
            ],
            [
              "Otillbörlig övervakning",
              "Övervakning eller kontroll som är otillbörlig och som kan användas för att begränsa eller kontrollera personen.",
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
        <h2 style={{ fontSize: 28, marginTop: 0 }}>
          Upprepning är central
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          För den första delen av brottet krävs att personen{" "}
          <strong>upprepat</strong> utsatts för sådana kränkningar. Det är
          alltså inte bara frågan om hur allvarlig en enskild kommentar eller
          konflikt varit.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
          Flera handlingar kan tillsammans bilda det mönster som lagen tar
          sikte på. Det gör relationens utveckling över tid och sammanhanget
          kring beteendena viktiga i den juridiska bedömningen.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Varaktig övervakning har en särskild ställning
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Lagen innehåller också en särskild regel om{" "}
          <strong>varaktig otillbörlig övervakning</strong>. Sådan övervakning
          kan omfattas när den är ägnad att allvarligt skada personens
          självkänsla.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          I dagens relationer kan kontroll dessutom ha en digital dimension.
          Det kan exempelvis handla om platsinformation, konton, telefoner
          eller andra tekniska sätt att hålla uppsikt över en partner.
          Exakt när ett beteende når den straffbara nivån måste dock bedömas
          utifrån omständigheterna i det enskilda fallet.
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
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            opacity: 0.7,
          }}
        >
          ANONYMT TEST
        </p>

        <h2 style={{ fontSize: 28, margin: "8px 0 12px" }}>
          Känner du igen beteendena i din egen relation?
        </h2>

        <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
          Vårt test om psykisk misshandel och psykiskt våld innehåller 30
          frågor. Svaren analyseras inom bland annat de beteendekategorier
          som den nya lagen tar sikte på, tillsammans med upprepning,
          varaktighet och påverkan på självkänsla och frihet.
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
          Testet kan hjälpa dig identifiera relevanta beteendemönster men kan
          inte avgöra om ett brott har begåtts.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Betyder lagen att all psykisk misshandel nu är brottslig?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Nej, inte automatiskt. <strong>Psykisk misshandel</strong> är ett
          bredare vardagligt begrepp, medan straffansvar kräver att
          förutsättningarna i en straffbestämmelse är uppfyllda.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Samtidigt kunde flera handlingar som förekommer inom psykiskt våld
          vara brottsliga redan före den nya bestämmelsen, exempelvis genom
          andra regler i brottsbalken. Den stora förändringen är att det nu
          finns ett särskilt brott som kan fånga det psykiska våldet som ett
          återkommande mönster.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Vad händer med beteenden före den 1 juli 2026?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Den nya straffbestämmelsen började gälla den 1 juli 2026. Den kan
          därför inte användas för att retroaktivt straffa någon enligt den
          nya bestämmelsen för sådant som enbart skedde innan lagen trädde i
          kraft.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om ett mönster fortsätter efter ikraftträdandet kan däremot
          handlingarna efter den 1 juli bli relevanta för bedömningen enligt
          den nya bestämmelsen. Äldre handlingar kan dessutom ha omfattats av
          andra straffbestämmelser.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Vad är straffet?</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Straffskalan för psykiskt våld är{" "}
          <strong>fängelse i högst fyra år</strong>.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Vi har en separat genomgång av straffbestämmelsen, vad som krävs
          för ansvar och hur upprepade beteenden bedöms.
        </p>

        <Link
          href="/psykiskt-vald/straff"
          style={{
            fontWeight: 800,
            color: "#111",
          }}
        >
          Läs mer om straffet för psykiskt våld →
        </Link>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Om du tror att du utsätts för psykiskt våld
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om beteendet återkommer kan det vara värdefullt att dokumentera
          konkreta händelser och sammanhang. Spara relevanta meddelanden och
          andra digitala spår om du kan göra det på ett säkert sätt.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Du kan också söka stöd och vid behov kontakta polis eller juridisk
          rådgivare för att få hjälp att bedöma din situation.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Vid akut fara ska du ringa <strong>112</strong>.
        </p>
      </section>

      <section style={{ marginTop: 44 }}>
        <h2 style={{ fontSize: 30 }}>Läs vidare om psykiskt våld</h2>

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
            href="/psykisk-misshandel-relation"
            style={{
              padding: 16,
              border: "1px solid #ddd",
              borderRadius: 14,
              color: "#111",
              textDecoration: "none",
              fontWeight: 800,
            }}
          >
            Psykisk misshandel i relation →
          </Link>
        </div>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 30 }}>Vanliga frågor om den nya lagen</h2>

        <div style={{ display: "grid", gap: 22 }}>
          <div>
            <h3>När började lagen om psykiskt våld gälla?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Den nya bestämmelsen trädde i kraft den 1 juli 2026.
            </p>
          </div>

          <div>
            <h3>Är psykiskt våld ett eget brott?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Ja. Psykiskt våld regleras i 4 kap. 7 b § brottsbalken.
            </p>
          </div>

          <div>
            <h3>Vilka beteenden nämns i lagen?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Lagen nämner beskyllning, nedsättande uttalande,
              förödmjukande beteende, otillbörligt hot, otillbörligt tvång
              och otillbörlig övervakning.
            </p>
          </div>

          <div>
            <h3>Hur långt fängelsestraff kan psykiskt våld ge?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Straffet är fängelse i högst fyra år.
            </p>
          </div>

          <div>
            <h3>Kan ett test visa om någon har begått psykiskt våld?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Nej. Ett test kan hjälpa till att synliggöra beteendemönster,
              men frågan om brott är en juridisk bedömning av det konkreta
              fallet.
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