import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Psykiskt våld – bevis, dokumentation & vad som kan hjälpa",
  description:
    "Hur bevisar man psykiskt våld? Läs om dokumentation, sms, chattar, vittnen, tidslinjer och annan information som kan hjälpa att visa ett återkommande mönster.",
  alternates: {
    canonical: "/psykiskt-vald/bevis",
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
          PSYKISKT VÅLD · BEVIS & DOKUMENTATION
        </p>

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 52px)",
            lineHeight: 1.08,
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Hur bevisar man psykiskt våld?
        </h1>

        <p
          style={{
            marginTop: 20,
            fontSize: 19,
            lineHeight: 1.7,
            opacity: 0.86,
          }}
        >
          Psykiskt våld lämnar inte alltid synliga spår. Därför kan det vara
          viktigt att dokumentera <strong>mönster över tid</strong> och spara
          information som visar vad som faktiskt har hänt.
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
          Det finns sällan ett enda avgörande bevis
        </h2>

        <p style={{ lineHeight: 1.7, marginBottom: 0 }}>
          Vid psykiskt våld kan helheten vara viktig. Sms, chattar,
          röstmeddelanden, vittnesuppgifter och egna anteckningar kan
          tillsammans bidra till att visa ett återkommande beteendemönster.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>1. Skriv ner konkreta händelser</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Försök att dokumentera vad som faktiskt hände istället för att bara
          skriva att relationen känns dålig eller kontrollerande.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Anteckna exempelvis:
        </p>

        <ul
          style={{
            fontSize: 17,
            lineHeight: 1.9,
            paddingLeft: 22,
          }}
        >
          <li>datum och ungefärlig tid</li>
          <li>vad personen sa eller gjorde</li>
          <li>var händelsen inträffade</li>
          <li>om någon annan var närvarande</li>
          <li>om det finns sms, chattar eller andra digitala spår</li>
          <li>hur situationen påverkade dig</li>
        </ul>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          En löpande tidslinje kan göra det lättare att se sådant som annars
          framstår som separata händelser.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>2. Spara sms och chattar</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Meddelanden kan vara viktiga eftersom de kan visa exakt vad som
          sagts och när.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det kan exempelvis handla om:
        </p>

        <ul
          style={{
            fontSize: 17,
            lineHeight: 1.9,
            paddingLeft: 22,
          }}
        >
          <li>hot eller skrämsel</li>
          <li>återkommande anklagelser</li>
          <li>krav på att få veta var du befinner dig</li>
          <li>krav på lösenord eller tillgång till konton</li>
          <li>nedvärderande eller förödmjukande kommentarer</li>
          <li>press att göra något du inte vill</li>
        </ul>
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
          Spara material på ett säkert sätt
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om personen kontrollerar din mobil eller dina konton kan det vara
          riskabelt att ha all dokumentation på en enhet som personen har
          tillgång till.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
          Prioritera alltid din säkerhet. Om det går kan kopior förvaras på
          ett separat konto, hos någon du litar på eller på annan plats som
          personen inte kommer åt.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>3. Spara röstmeddelanden och mejl</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Mejlkontakt och röstmeddelanden kan också dokumentera hot,
          kränkningar eller kontrollerande krav.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Försök att behålla originalmaterialet när det är möjligt, även om du
          också tar skärmbilder eller gör kopior.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>4. Skärmbilder kan hjälpa</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Skärmbilder kan vara användbara för att snabbt bevara sådant som kan
          raderas eller ändras.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Försök om möjligt att få med sammanhang, datum, avsändare och
          tillräckligt av konversationen för att det ska gå att förstå vad
          meddelandet syftar på.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>5. Vittnen kan vara viktiga</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Andra personer behöver inte ha sett allt som hänt för att deras
          uppgifter ska kunna vara relevanta.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          En vän, familjemedlem, kollega eller granne kan exempelvis ha:
        </p>

        <ul
          style={{
            fontSize: 17,
            lineHeight: 1.9,
            paddingLeft: 22,
          }}
        >
          <li>hört hot eller kränkningar</li>
          <li>sett kontrollerande beteenden</li>
          <li>varit närvarande efter en konflikt</li>
          <li>sett hur din situation förändrats över tid</li>
          <li>fått meddelanden från dig nära inpå en händelse</li>
        </ul>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>6. Digital övervakning kan lämna spår</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om någon använder teknik för att övervaka dig kan det ibland finnas
          digital information som visar vad som hänt.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det kan exempelvis handla om platsdelning, inloggningshistorik,
          säkerhetsvarningar, okända enheter eller appar och meddelanden där
          personen avslöjar att hen känner till information som du inte själv
          har delat.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          <Link
            href="/psykiskt-vald/vad-raknas-som"
            style={{ color: "#111", fontWeight: 800 }}
          >
            Läs mer om övervakning och andra beteenden som kan ingå i
            psykiskt våld →
          </Link>
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          7. Kontakter med vård eller stödverksamheter
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om du har berättat om situationen för vården, socialtjänsten,
          kvinnojour, mansjour eller någon annan stödverksamhet kan sådana
          kontakter också bidra till en bild av vad som pågått och när.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det betyder inte att du måste ha sökt hjälp tidigare för att bli
          tagen på allvar.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          8. Dokumentera mönstret, inte bara de värsta händelserna
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Eftersom psykiskt våld ofta handlar om upprepning kan även händelser
          som var för sig verkar mindre allvarliga bli betydelsefulla när de
          ses tillsammans.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Försök därför att dokumentera både tydliga incidenter och sådant som
          återkommer i vardagen.
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
          Svårt att avgöra om det finns ett tydligt mönster?
        </h2>

        <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
          Relationsvarnings anonyma test innehåller 30 frågor om bland annat
          beskyllningar, förnedring, hot, tvång, övervakning, upprepning och
          påverkan på självkänsla och frihet.
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
          Testet kan hjälpa dig att identifiera mönster men kan inte avgöra
          om ett brott har begåtts.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Vad krävs juridiskt?</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Brottet psykiskt våld infördes den 1 juli 2026. Bestämmelsen omfattar
          bland annat upprepade beskyllningar, nedsättande uttalanden,
          förödmjukande beteenden, otillbörliga hot, otillbörligt tvång och
          otillbörlig övervakning.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Kränkningarna ska sammantagna ha varit ägnade att allvarligt skada
          den utsatta personens självkänsla. Det innebär att en juridisk
          bedömning behöver göras utifrån hela situationen.
        </p>

        <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
          <Link
            href="/psykiskt-vald/ny-lag-2026"
            style={{ color: "#111", fontWeight: 800 }}
          >
            Läs om den nya lagen →
          </Link>

          <Link
            href="/psykiskt-vald/straff"
            style={{ color: "#111", fontWeight: 800 }}
          >
            Läs om straffet för psykiskt våld →
          </Link>
        </div>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Måste man ha perfekta bevis innan man söker hjälp?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Nej. Du behöver inte själv göra en färdig juridisk utredning innan
          du kontaktar polis eller annan stödverksamhet.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om du vill gå vidare kan du läsa om{" "}
          <Link href="/psykiskt-vald/polisanmalan" className="underline underline-offset-4">hur en polisanmälan om psykiskt våld går till</Link>
          {" "}eller{" "}
          <Link href="/psykiskt-vald/hjalp" className="underline underline-offset-4">var du kan få stöd</Link>
          .
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om du vill göra en polisanmälan kan du berätta vad som hänt och
          lämna det material du har. Polis och åklagare ansvarar sedan för
          brottsutredningen.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Om du är rädd för att bli upptäckt</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Dokumentation är aldrig viktigare än din säkerhet. Om personen
          övervakar din mobil, dator eller internetanvändning behöver du vara
          försiktig med var du sparar information och vilka konton du använder.
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
            <h3>Kan sms användas som bevis?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Sms och chattar kan vara relevanta eftersom de kan dokumentera
              exempelvis hot, kränkningar, kontroll eller övervakning och visa
              när kommunikationen ägt rum.
            </p>
          </div>

          <div>
            <h3>Räcker mina egna anteckningar?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Egna anteckningar är inte automatiskt avgörande bevis, men en
              detaljerad tidslinje kan hjälpa till att beskriva ett mönster
              och koppla samman olika händelser och annat material.
            </p>
          </div>

          <div>
            <h3>Måste det finnas vittnen?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Nej. Avsaknad av vittnen betyder inte att en händelse inte kan
              utredas. Vilken bevisning som finns och hur den värderas beror
              på det enskilda fallet.
            </p>
          </div>

          <div>
            <h3>Kan man bevisa psykiskt våld utan fysisk skada?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Ja. Brottet psykiskt våld förutsätter inte i sig någon fysisk
              skada. Relevant bevisning kan istället handla om beteenden,
              kommunikation, upprepning och omständigheterna runt relationen.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}