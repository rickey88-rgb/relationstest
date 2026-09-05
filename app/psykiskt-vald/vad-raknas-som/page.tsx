import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Vad räknas som psykiskt våld? Tecken & exempel",
  description:
    "Vad räknas som psykiskt våld i en relation? Läs om beskyllningar, förnedring, hot, tvång, kontroll, övervakning och återkommande nedbrytande mönster.",
  alternates: {
    canonical: "/psykiskt-vald/vad-raknas-som",
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
          PSYKISKT VÅLD · TECKEN & BETEENDEN
        </p>

        <h1
          style={{
            fontSize: "clamp(34px, 6vw, 52px)",
            lineHeight: 1.08,
            margin: 0,
            letterSpacing: "-0.03em",
          }}
        >
          Vad räknas som psykiskt våld?
        </h1>

        <p
          style={{
            marginTop: 20,
            fontSize: 19,
            lineHeight: 1.7,
            opacity: 0.86,
          }}
        >
          Psykiskt våld kan handla om återkommande beteenden som bryter ner,
          skrämmer, kontrollerar eller begränsar en annan person. Det är ofta
          <strong> mönstret över tid</strong> som gör situationen allvarlig,
          inte en enda isolerad konflikt.
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
          Psykiskt våld är mer än att någon är elak ibland
        </h2>

        <p style={{ lineHeight: 1.7, marginBottom: 0 }}>
          Det kan exempelvis handla om återkommande beskyllningar,
          nedvärdering, förödmjukelser, hot, tvång, övervakning eller andra
          kontrollerande beteenden som successivt påverkar din självkänsla,
          trygghet och frihet.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>1. Återkommande beskyllningar</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Ett vanligt mönster kan vara att du återkommande får skulden för
          sådant som händer i relationen. Du kanske anklagas för att vara
          orsaken till konflikter, för att ha dåliga avsikter eller för saker
          du själv inte upplever att du har gjort.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Med tiden kan detta göra att du börjar försvara dig konstant eller
          ifrågasätta ditt eget omdöme.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>2. Nedsättande kommentarer</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Nedvärderande kommentarer kan handla om din intelligens, ditt
          utseende, din personlighet, din förmåga eller ditt värde som person.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Exempel kan vara att återkommande bli kallad värdelös, dum, galen,
          överkänslig eller få höra att ingen annan skulle vilja vara med dig.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>3. Förödmjukande beteende</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Förödmjukelse kan ske både privat och inför andra. Det kan handla om
          att bli hånad, utskrattad, medvetet generad eller få sådant du är
          sårbar för använt emot dig.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Ett återkommande förödmjukande mönster kan gradvis påverka hur du
          ser på dig själv och hur trygg du känner dig i relationen.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>4. Hot och skrämsel</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Hot behöver inte alltid vara ett direkt hot om fysiskt våld. Det
          kan också handla om hot om konsekvenser om du inte gör som personen
          vill.
        </p>

        <ul
          style={{
            fontSize: 17,
            lineHeight: 1.9,
            paddingLeft: 22,
          }}
        >
          <li>hot om att lämna eller överge för att få sin vilja igenom</li>
          <li>hot om att avslöja privata uppgifter</li>
          <li>hot om att skada ditt rykte</li>
          <li>hot mot dig, sig själv eller någon du bryr dig om</li>
          <li>aggressiva reaktioner som gör att du börjar anpassa dig av rädsla</li>
        </ul>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>5. Tvång och kontroll</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Psykiskt våld kan också handla om att din frihet gradvis begränsas.
          Personen kanske försöker styra vilka du träffar, vad du gör, hur du
          klär dig, hur du använder pengar eller vilka beslut du får fatta.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Ett viktigt tecken är om ett nej från dig leder till så mycket
          press, skuld, ilska eller konflikt att du till slut ger efter trots
          att du egentligen inte vill.
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
          6. Övervakning och digital kontroll
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Kontroll kan idag ske genom mobilen och andra digitala verktyg. Det
          kan exempelvis handla om att en partner kräver att få kontrollera
          meddelanden, sociala medier, platsinformation eller lösenord.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det kan också handla om att appar, konton, enheter eller andra
          människor används för att hålla koll på var du befinner dig eller
          vad du gör.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75, marginBottom: 0 }}>
          Sedan 1 juli 2026 nämns <strong>otillbörlig övervakning</strong>
          uttryckligen i bestämmelsen om psykiskt våld.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>7. Isolering från andra</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          En kontrollerande relation kan göra att kontakten med vänner,
          familj eller andra personer gradvis minskar.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det behöver inte alltid ske genom ett direkt förbud. Personen kan
          skapa konflikter varje gång du träffar andra, skuldbelägga dig,
          misstänkliggöra dina relationer eller göra det så jobbigt att du
          till slut börjar undvika dem själv.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>8. Ekonomisk kontroll</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Kontroll av pengar kan också vara en del av ett destruktivt
          relationsmönster. Det kan exempelvis handla om att någon försöker
          styra dina utgifter, hindra dig från att arbeta eller begränsa din
          tillgång till egna pengar.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Ekonomisk kontroll är inte automatiskt samma sak som brottet
          psykiskt våld, men beteendet kan vara relevant när man bedömer ett
          större mönster av tvång, kontroll eller nedbrytning.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          9. Du börjar gå på äggskal
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Ett tydligt varningstecken kan vara att du börjar planera ditt eget
          beteende utifrån hur personen kan reagera.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Du kanske funderar över exakt hur du ska formulera dig, undviker
          vissa ämnen eller gör saker du egentligen inte vill för att hålla
          situationen lugn.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          10. Du börjar tvivla på dig själv
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Psykiskt våld kan påverka självkänslan långsamt. Du kanske blir
          osäkrare på dina egna beslut, minnen, känslor eller bedömningar.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Om du ofta får höra att du minns fel, överdriver eller reagerar
          irrationellt kan det också finnas inslag av{" "}
          <Link
            href="/gaslighting-relation"
            style={{ color: "#111", fontWeight: 800 }}
          >
            gaslighting
          </Link>
          .
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
          Känner du igen flera av de här beteendena?
        </h2>

        <p style={{ lineHeight: 1.7, opacity: 0.9 }}>
          Vårt anonyma test innehåller 30 frågor och analyserar åtta olika
          områden, bland annat hot, kontroll, övervakning, förödmjukelser,
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
          Testet är inte en juridisk bedömning och kan inte fastställa om ett
          brott har begåtts.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          När blir ett mönster juridiskt relevant?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Den svenska bestämmelsen om psykiskt våld tar bland annat sikte på
          upprepade beskyllningar, nedsättande uttalanden, förödmjukande
          beteenden, otillbörliga hot, otillbörligt tvång och otillbörlig
          övervakning.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          För straffansvar krävs mer än att ett beteende bara förekommit.
          Handlingarna måste bedömas tillsammans och uppfylla lagens krav,
          bland annat att de varit ägnade att allvarligt skada den utsatta
          personens självkänsla.
        </p>

        <Link
          href="/psykiskt-vald/ny-lag-2026"
          style={{
            fontWeight: 800,
            color: "#111",
          }}
        >
          Läs hur den nya lagen om psykiskt våld fungerar →
        </Link>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>
          Konflikt eller psykiskt våld – vad är skillnaden?
        </h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Alla relationer innehåller konflikter. Två personer kan bli arga,
          säga dumma saker eller ha perioder där kommunikationen fungerar
          dåligt.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det som gör psykiskt våld annorlunda är ofta{" "}
          <strong>mönstret, maktobalansen och konsekvenserna</strong>. Om
          beteendena återkommer och leder till att den ena personen blir mer
          rädd, mindre självständig eller får allt sämre självkänsla finns
          större anledning att reagera.
        </p>
      </section>

      <section style={{ marginTop: 42 }}>
        <h2 style={{ fontSize: 30 }}>Om du känner igen dig</h2>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Det kan vara svårt att se ett mönster när varje enskild händelse
          känns liten. Ett sätt att få bättre överblick är att skriva ner
          konkreta situationer med datum, vad som hände och hur du reagerade.
        </p>

        <p style={{ fontSize: 17, lineHeight: 1.75 }}>
          Spara också relevanta sms, chattar eller andra digitala spår om det
          går att göra på ett säkert sätt.
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
        <h2 style={{ fontSize: 30 }}>Vanliga frågor</h2>

        <div style={{ display: "grid", gap: 22 }}>
          <div>
            <h3>Vad är exempel på psykiskt våld?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Exempel kan vara återkommande nedvärdering, förödmjukelser,
              hot, tvång, kontroll och övervakning som tillsammans skapar ett
              nedbrytande eller kontrollerande mönster.
            </p>
          </div>

          <div>
            <h3>Är kontroll psykiskt våld?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Kontroll kan vara en del av psykiskt våld, särskilt om den
              återkommer och begränsar personens frihet. Den juridiska
              bedömningen beror på beteendets karaktär och sammanhang.
            </p>
          </div>

          <div>
            <h3>Är svartsjuka psykiskt våld?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Svartsjuka i sig är inte samma sak som psykiskt våld. Den kan
              däremot bli en del av ett destruktivt mönster om den leder till
              exempelvis hot, övervakning, isolering eller omfattande
              kontroll.
            </p>
          </div>

          <div>
            <h3>Kan psykiskt våld förekomma utan hot?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Ja. Psykiskt våld kan bestå av flera andra typer av beteenden,
              exempelvis upprepade förödmjukelser, nedvärdering, tvång eller
              övervakning.
            </p>
          </div>

          <div>
            <h3>Hur vet jag om jag utsätts?</h3>
            <p style={{ lineHeight: 1.7 }}>
              Ett viktigt tecken är om flera beteenden återkommer och du
              successivt känner dig mer rädd, osäker, kontrollerad eller
              mindre fri att vara dig själv.
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