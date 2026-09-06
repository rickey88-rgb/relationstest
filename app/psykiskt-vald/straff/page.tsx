import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Psykiskt våld – straff enligt den nya lagen 2026",
  description:
    "Vad är straffet för psykiskt våld? Läs om den nya lagen från 1 juli 2026, när beteenden kan vara straffbara och vad som krävs för ansvar.",
  alternates: {
    canonical: "/psykiskt-vald/straff",
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
          PSYKISKT VÅLD · STRAFF
        </p>

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 52px)",
            lineHeight: 1.08,
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Psykiskt våld – vilket straff kan man få?
        </h1>

        <p
          style={{
            marginTop: 20,
            fontSize: 19,
            lineHeight: 1.7,
            opacity: 0.86,
          }}
        >
          Sedan den <strong>1 juli 2026</strong> finns ett särskilt brott i
          svensk lag som heter <strong>psykiskt våld</strong>. Den som
          uppfyller lagens krav kan dömas till{" "}
          <strong>fängelse i högst fyra år</strong>.
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
          KORT SVAR
        </p>

        <h2 style={{ margin: "10px 0 12px", fontSize: 30 }}>
          Straffet är fängelse i högst fyra år
        </h2>

        <p style={{ lineHeight: 1.7, marginBottom: 0 }}>
          Straffbestämmelsen finns i <strong>4 kap. 7 b § brottsbalken</strong>.
          Det räcker däremot inte att en relation innehåller vanliga
          konflikter eller en enstaka kränkning. Lagen ställer särskilda krav
          på beteendet, upprepningen och dess karaktär.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Vad krävs för att någon ska kunna dömas?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Bestämmelsen tar sikte på den som <strong>upprepat</strong> utsätter
          en annan person för vissa typer av kränkningar. Kränkningarna ska
          sammantaget ha varit ägnade att{" "}
          <strong>allvarligt skada personens självkänsla</strong>.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Lagen räknar uttryckligen upp följande former av beteenden:
        </p>

        <ul
          style={{
            fontSize: 17,
            lineHeight: 1.9,
            paddingLeft: 22,
          }}
        >
          <li>beskyllningar</li>
          <li>nedsättande uttalanden</li>
          <li>förödmjukande beteende</li>
          <li>otillbörliga hot</li>
          <li>otillbörligt tvång</li>
          <li>otillbörlig övervakning</li>
        </ul>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Även <strong>varaktig otillbörlig övervakning</strong> kan i sig
          omfattas om den varit ägnad att allvarligt skada personens
          självkänsla.
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
          En enstaka förolämpning är inte automatiskt psykiskt våld
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det nya brottet är konstruerat för att kunna fånga{" "}
          <strong>upprepade och nedbrytande mönster</strong>. Det innebär att
          man normalt måste se flera handlingar tillsammans och bedöma hela
          sammanhanget.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
          En viss handling kan samtidigt omfattas av andra straffbestämmelser,
          exempelvis om den också utgör hot, tvång eller något annat brott.
          Den juridiska bedömningen beror alltid på vad som faktiskt har hänt.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Måste personen faktiskt få förstörd självkänsla?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Lagtexten är formulerad så att handlingarna ska ha varit{" "}
          <strong>ägnade att allvarligt skada självkänslan</strong>. Det är
          alltså beteendets karaktär och den samlade situationen som står i
          centrum för den juridiska prövningen.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det är därför inte samma sak som att ett test eller en viss
          subjektiv känsla automatiskt kan avgöra om brottet är uppfyllt.
          Bevisning och omständigheterna i det konkreta fallet måste bedömas.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Exempel på beteenden som kan bli relevanta</h2>

        <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
          {[
            [
              "Återkommande förnedring",
              "Personen blir upprepade gånger hånad, förminskad eller behandlad på ett sätt som bryter ner självkänslan.",
            ],
            [
              "Hot som används för kontroll",
              "Hot används återkommande för att påverka personens beslut eller beteende.",
            ],
            [
              "Tvång och begränsningar",
              "Personen pressas eller tvingas att anpassa sitt umgänge, sina val eller sitt vardagsliv.",
            ],
            [
              "Digital övervakning",
              "Mobil, platsinformation, appar, konton eller annan teknik används för att övervaka personen på ett otillbörligt sätt.",
            ],
          ].map(([title, text]) => (
            <div
              key={title}
              style={{
                padding: 18,
                border: "1px solid #e7e7e7",
                borderRadius: 14,
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

        <p
          style={{
            marginTop: 18,
            fontSize: 14,
            lineHeight: 1.7,
            opacity: 0.68,
          }}
        >
          Exemplen ovan innebär inte att varje sådan situation automatiskt
          uppfyller brottsrekvisiten. Upprepning, sammanhang och övriga
          omständigheter måste bedömas.
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
          Misstänker du ett sådant mönster i din relation?
        </h2>

        <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
          Vårt anonyma test innehåller 30 frågor och analyserar bland annat
          kränkningar, hot, tvång, övervakning, upprepning och påverkan på
          självkänsla och handlingsfrihet.
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
          Testet kan identifiera relevanta beteendemönster men kan inte
          fastställa om ett brott har begåtts.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Gäller lagen även sådant som hände före 1 juli 2026?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Den nya straffbestämmelsen trädde i kraft den 1 juli 2026. Om ett
          återkommande beteende har pågått både före och efter
          ikraftträdandet kan den del av agerandet som skett efter
          ikraftträdandet läggas till grund för ansvar enligt den nya
          bestämmelsen.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Läs mer om bakgrunden och ikraftträdandet i genomgången av{" "}
          <Link href="/psykiskt-vald/ny-lag-2026" className="underline underline-offset-4">den nya lagen om psykiskt våld 2026</Link>
          .
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det betyder inte att handlingar före den 1 juli automatiskt varit
          tillåtna. Vissa beteenden kan ha varit straffbara enligt andra
          bestämmelser redan tidigare.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Vad gör man om man tror att man är utsatt?</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om beteendet återkommer kan det vara klokt att dokumentera konkreta
          händelser. Skriv ner datum, vad som hände och sammanhanget. Spara
          relevanta sms, meddelanden eller andra digitala spår om du kan göra
          det på ett säkert sätt.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Du kan också söka stöd och rådgivning och vid behov kontakta polis
          eller juridisk rådgivare för en bedömning av just din situation.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Läs vidare om{" "}
          <Link href="/psykiskt-vald/polisanmalan" className="underline underline-offset-4">att polisanmäla psykiskt våld</Link>
          {" "}eller om{" "}
          <Link href="/psykiskt-vald/hjalp" className="underline underline-offset-4">hjälp och stöd när du är osäker på nästa steg</Link>
          .
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Vid akut fara ska du ringa <strong>112</strong>.
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
        <h2 style={{ fontSize: 30 }}>Vanliga frågor om straffet</h2>

        <div style={{ display: "grid", gap: 22 }}>
          <div>
            <h3>Vad är maxstraffet för psykiskt våld?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Straffet för psykiskt våld är fängelse i högst fyra år.
            </p>
          </div>

          <div>
            <h3>Kan man dömas för en enda kränkning?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Huvudregeln i bestämmelsen gäller upprepade kränkningar.
              Varaktig otillbörlig övervakning omfattas också särskilt av
              lagen.
            </p>
          </div>

          <div>
            <h3>När började den nya lagen gälla?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Bestämmelsen om psykiskt våld trädde i kraft den 1 juli 2026.
            </p>
          </div>

          <div>
            <h3>Kan psykisk misshandel ge fängelse?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Beteenden som i vardagligt språk kallas psykisk misshandel kan
              i vissa fall omfattas av brottet psykiskt våld eller andra
              straffbestämmelser. Det avgörs genom en juridisk bedömning av
              omständigheterna.
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