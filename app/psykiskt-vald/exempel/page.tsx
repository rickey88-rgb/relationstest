import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Psykiskt våld – exempel i relationer",
  description:
    "Se konkreta exempel på psykiskt våld i en relation: hot, kontroll, förnedring, skuldbeläggning, övervakning och andra återkommande beteenden.",
  alternates: {
    canonical: "/psykiskt-vald/exempel",
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
          PSYKISKT VÅLD · KONKRETA EXEMPEL
        </p>

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 52px)",
            lineHeight: 1.08,
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Exempel på psykiskt våld i en relation
        </h1>

        <p
          style={{
            marginTop: 20,
            fontSize: 19,
            lineHeight: 1.7,
            opacity: 0.86,
          }}
        >
          Psykiskt våld är ofta svårt att upptäcka eftersom det inte alltid
          ser dramatiskt ut utifrån. Det kan bestå av många små och
          återkommande handlingar som tillsammans gör att du blir mer rädd,
          osäker, kontrollerad eller nedbruten.
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
          Det är mönstret som är viktigt
        </h2>

        <p style={{ lineHeight: 1.7, marginBottom: 0 }}>
          En enstaka hård kommentar eller konflikt behöver inte vara psykiskt
          våld. Det blir mer oroande när samma typer av beteenden återkommer,
          används för kontroll och gradvis påverkar din självkänsla,
          trygghet eller frihet.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Exempel 1: Du får alltid skulden</h2>

        <div
          style={{
            padding: 20,
            border: "1px solid #e4e4e4",
            borderRadius: 16,
            background: "#fafafa",
          }}
        >
          <p style={{ marginTop: 0, fontSize: 17, lineHeight: 1.75 }}>
            Ni hamnar i en konflikt. Oavsett vad som faktiskt hänt slutar
            diskussionen med att allt är ditt fel.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
            När du försöker förklara dig får du höra att du är egoistisk,
            omöjlig eller alltid förstör relationen. Efter ett tag börjar du
            automatiskt fundera på vad du själv gjort fel, även när du från
            början var säker på situationen.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            Läs mer om skuldvändning och andra mönster hos en{" "}
            <Link href="/manipulativ-partner" className="underline underline-offset-4">manipulativ partner</Link>
            .
          </p>
        </div>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Exempel 2: Du blir förminskad som person
        </h2>

        <div
          style={{
            padding: 20,
            border: "1px solid #e4e4e4",
            borderRadius: 16,
          }}
        >
          <p style={{ marginTop: 0, fontSize: 17, lineHeight: 1.75 }}>
            Din partner kommenterar återkommande din intelligens, ditt
            utseende eller din förmåga.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
            Du kanske får höra att du är dum, värdelös, psykiskt instabil
            eller att ingen annan skulle vilja vara tillsammans med dig.
            Kommentarerna kan ibland följas av:{" "}
            <em>"Jag skojade ju bara."</em>
          </p>
        </div>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Exempel 3: Förnedring inför andra
        </h2>

        <div
          style={{
            padding: 20,
            border: "1px solid #e4e4e4",
            borderRadius: 16,
          }}
        >
          <p style={{ marginTop: 0, fontSize: 17, lineHeight: 1.75 }}>
            Din partner berättar privata eller pinsamma saker om dig inför
            andra, skämtar på din bekostnad eller får dig medvetet att känna
            dig dum.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
            När du säger att det känns kränkande får du istället höra att du
            saknar humor eller är överkänslig.
          </p>
        </div>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Exempel 4: Du börjar gå på äggskal
        </h2>

        <div
          style={{
            padding: 20,
            border: "1px solid #e4e4e4",
            borderRadius: 16,
            background: "#fafafa",
          }}
        >
          <p style={{ marginTop: 0, fontSize: 17, lineHeight: 1.75 }}>
            Du märker att du förbereder samtal i huvudet innan du tar upp
            något. Du försöker hitta exakt rätt ord för att undvika ilska,
            anklagelser eller långa konflikter.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
            Till slut börjar du undvika vissa frågor helt eftersom
            konsekvenserna känns för jobbiga.
          </p>
        </div>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Exempel 5: Mobilen blir ett kontrollverktyg</h2>

        <div
          style={{
            padding: 20,
            border: "1px solid #e4e4e4",
            borderRadius: 16,
          }}
        >
          <p style={{ marginTop: 0, fontSize: 17, lineHeight: 1.75 }}>
            Din partner vill återkommande kontrollera vem du skriver med,
            kräver lösenord eller blir arg om du inte visar mobilen.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            Du kanske förväntas ha platsdelning aktiverad och om du stänger av
            den uppstår anklagelser eller konflikt.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75 }}>
            För en bredare bild av hur kontroll kan begränsa vardagen, läs om{" "}
            <Link href="/kontrollerande-relation" className="underline underline-offset-4">tecken på en kontrollerande relation</Link>
            .
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
            Otillbörlig övervakning är en av de beteendetyper som uttryckligen
            nämns i den nya bestämmelsen om psykiskt våld.
          </p>
        </div>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Exempel 6: Du får inte träffa vem du vill
        </h2>

        <div
          style={{
            padding: 20,
            border: "1px solid #e4e4e4",
            borderRadius: 16,
          }}
        >
          <p style={{ marginTop: 0, fontSize: 17, lineHeight: 1.75 }}>
            Personen säger kanske inte direkt att du är förbjuden att träffa
            vänner eller familj.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
            Istället blir det bråk, svartsjuka, skuldbeläggning eller
            misstankar varje gång du gör något utan personen. Till slut blir
            det enklare att stanna hemma.
          </p>
        </div>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Exempel 7: Ett nej respekteras inte
        </h2>

        <div
          style={{
            padding: 20,
            border: "1px solid #e4e4e4",
            borderRadius: 16,
            background: "#fafafa",
          }}
        >
          <p style={{ marginTop: 0, fontSize: 17, lineHeight: 1.75 }}>
            Du säger nej till något, men personen fortsätter pressa dig,
            argumentera, skuldbelägga eller bli aggressiv.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
            Till slut säger du ja för att slippa konsekvenserna. Det kan skapa
            ett mönster där din möjlighet att fatta egna beslut gradvis
            minskar.
          </p>
        </div>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Exempel 8: Hot utan fysiskt våld</h2>

        <div
          style={{
            padding: 20,
            border: "1px solid #e4e4e4",
            borderRadius: 16,
          }}
        >
          <p style={{ marginTop: 0, fontSize: 17, lineHeight: 1.75 }}>
            Hot kan användas för att påverka dig även om personen aldrig
            slår dig.
          </p>

          <ul
            style={{
              fontSize: 17,
              lineHeight: 1.9,
              paddingLeft: 22,
              marginBottom: 0,
            }}
          >
            <li>"Om du lämnar mig kommer du ångra dig."</li>
            <li>"Jag ska se till att alla får veta hur du egentligen är."</li>
            <li>"Om du går ut ikväll är det slut mellan oss."</li>
            <li>"Om du lämnar mig gör jag något mot mig själv."</li>
          </ul>
        </div>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Exempel 9: Pengar används för att kontrollera
        </h2>

        <div
          style={{
            padding: 20,
            border: "1px solid #e4e4e4",
            borderRadius: 16,
          }}
        >
          <p style={{ marginTop: 0, fontSize: 17, lineHeight: 1.75 }}>
            Personen kräver insyn i alla dina köp, begränsar din tillgång till
            pengar eller försöker hindra dig från att arbeta.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
            Ekonomisk kontroll är inte automatiskt brottet psykiskt våld, men
            den kan vara en viktig del av ett större mönster av kontroll,
            tvång och beroende.
          </p>
        </div>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Exempel 10: Din verklighetsuppfattning ifrågasätts
        </h2>

        <div
          style={{
            padding: 20,
            border: "1px solid #e4e4e4",
            borderRadius: 16,
            background: "#fafafa",
          }}
        >
          <p style={{ marginTop: 0, fontSize: 17, lineHeight: 1.75 }}>
            Personen förnekar återkommande sådant som sagts eller hänt och
            säger att du minns fel, hittar på eller är förvirrad.
          </p>

          <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
            Om detta sker systematiskt och får dig att börja tvivla på ditt
            eget minne eller omdöme kan det finnas ett mönster av{" "}
            <Link
              href="/gaslighting-relation"
              style={{
                color: "#111",
                fontWeight: 800,
              }}
            >
              gaslighting
            </Link>
            .
          </p>
        </div>
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
          Hur många av exemplen känner du igen?
        </h2>

        <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
          Ett enskilt exempel säger inte automatiskt vad relationen är. Men om
          flera beteenden återkommer kan det vara värdefullt att se på hela
          mönstret.
        </p>

        <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
          Relationsvarnings test innehåller 30 frågor om bland annat
          beskyllningar, förnedring, hot, tvång, övervakning, upprepning och
          hur relationen påverkar din självkänsla och frihet.
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
          Gör det anonyma testet
        </Link>

        <p
          style={{
            margin: "14px 0 0",
            fontSize: 12,
            lineHeight: 1.6,
            opacity: 0.65,
          }}
        >
          Testet är ett orienteringsverktyg och kan inte avgöra om ett brott
          har begåtts.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          När kan exemplen bli juridiskt relevanta?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Sedan den 1 juli 2026 finns brottet psykiskt våld i brottsbalken.
          Bestämmelsen tar bland annat sikte på upprepade beskyllningar,
          nedsättande uttalanden, förödmjukande beteenden, otillbörliga hot,
          otillbörligt tvång och otillbörlig övervakning.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          För ansvar krävs att lagens samtliga förutsättningar är uppfyllda.
          Det går därför inte att avgöra brottsfrågan enbart genom att känna
          igen ett exempel från den här sidan.
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
          Om du vill förstå vad som händer över tid
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Skriv gärna ner konkreta händelser med datum och sammanhang. Det gör
          det lättare att se om samma typer av beteenden fortsätter att
          återkomma.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          I guiden om{" "}
          <Link href="/psykiskt-vald/bevis" className="underline underline-offset-4">bevis och dokumentation</Link>
          {" "}kan du läsa mer om att spara konkreta händelser.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Behöver du stöd med situationen kan du läsa om{" "}
          <Link href="/psykiskt-vald/hjalp" className="underline underline-offset-4">hjälp vid psykiskt våld</Link>
          .
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om det är säkert kan du också spara relevanta sms, chattar,
          röstmeddelanden eller andra digitala spår.
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
        </div>
      </section>

      <section style={{ marginTop: 48 }}>
        <h2 style={{ fontSize: 30 }}>Vanliga frågor</h2>

        <div style={{ display: "grid", gap: 22 }}>
          <div>
            <h3>Vad är ett tydligt exempel på psykiskt våld?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Ett exempel är ett återkommande mönster där en person
              förnedrar, hotar eller kontrollerar sin partner så att partnern
              gradvis blir mer rädd, osäker eller begränsad.
            </p>
          </div>

          <div>
            <h3>Är förolämpningar psykiskt våld?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Förolämpningar kan vara en del av psykiskt våld när de ingår i
              ett återkommande nedbrytande mönster. En enskild förolämpning
              innebär däremot inte automatiskt att brottet psykiskt våld är
              uppfyllt.
            </p>
          </div>

          <div>
            <h3>Är svartsjuka och kontroll psykiskt våld?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Svartsjuka i sig är inte psykiskt våld, men kontroll som följer
              av svartsjukan kan bli allvarlig om den exempelvis leder till
              övervakning, hot, isolering eller begränsningar.
            </p>
          </div>

          <div>
            <h3>Kan psykiskt våld ske utan att någon skriker?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Ja. Psykiskt våld kan vara lugnt och subtilt och ändå vara
              mycket kontrollerande eller nedbrytande. Det behöver inte
              innehålla skrik eller fysiskt våld.
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