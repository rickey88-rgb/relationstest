import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Medberoendetest – testa mönster i din relation",
  description:
    "Gör ett medberoendetest med 30 frågor om självuppoffring, överansvar, gränser, känslor och fokus på partnern. Få en tydlig analys av dina relationsmönster.",
  alternates: {
    canonical: "https://relationsvarning.se/medberoendetest",
  },
};

export default function Page() {
  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "24px 16px 64px",
        color: "#111",
      }}
    >
      <Link
        href="/"
        style={{
          color: "#555",
          fontSize: 14,
          textDecoration: "underline",
          textUnderlineOffset: 3,
        }}
      >
        ← Till Relationsvarning
      </Link>

      <h1
        style={{
          margin: "20px 0 12px",
          fontSize: "clamp(32px, 8vw, 46px)",
          lineHeight: 1.08,
          letterSpacing: "-0.025em",
        }}
      >
        Medberoendetest
      </h1>

      <p
        style={{
          fontSize: 19,
          lineHeight: 1.7,
          color: "#333",
        }}
      >
        Tar du ofta ansvar för din partners problem, sätter dina egna behov
        åt sidan eller har svårt att hålla fast vid gränser? Medberoende
        används för att beskriva relationsmönster där fokus på den andra
        personen kan bli så starkt att det egna välbefinnandet och den egna
        självständigheten får mindre utrymme.
      </p>

      <Link
        href="/medberoendetest/test"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          minHeight: 54,
          marginTop: 14,
          padding: "13px 18px",
          borderRadius: 13,
          background: "#111",
          color: "#fff",
          textDecoration: "none",
          fontSize: 17,
          fontWeight: 800,
          boxSizing: "border-box",
        }}
      >
        Starta medberoendetestet – 30 frågor
      </Link>

      <section style={{ marginTop: 38 }}>
        <h2>Vad är medberoende?</h2>

        <p style={paragraphStyle}>
          Medberoende är inte en klinisk diagnos och det finns ingen enda
          universellt accepterad definition. Begreppet används däremot för
          att beskriva återkommande relationsmönster där en person exempelvis
          tar ett stort ansvar för den andras mående och problem, prioriterar
          bort egna behov eller får svårt att upprätthålla personliga gränser.
        </p>

        <p style={paragraphStyle}>
          Det viktiga är därför inte att försöka sätta en etikett på dig
          själv. Det mer användbara är att undersöka vilka konkreta mönster
          som finns i relationen och hur mycket de påverkar dig.
        </p>
      </section>

      <section style={{ marginTop: 34 }}>
        <h2>Vad undersöker testet?</h2>

        <p style={paragraphStyle}>
          Testet innehåller 30 frågor och undersöker sex olika områden:
        </p>

        <ul style={listStyle}>
          <li>
            <b>Självuppoffring</b> – om dina egna behov ofta får stå tillbaka.
          </li>
          <li>
            <b>Överansvar och räddande</b> – om du tar ansvar för problem
            eller konsekvenser som egentligen tillhör din partner.
          </li>
          <li>
            <b>Kontroll och problemlösning</b> – om du känner att du måste
            förebygga, styra eller hålla ihop situationer.
          </li>
          <li>
            <b>Gränser och självhävdelse</b> – hur lätt det är att säga nej
            och stå fast vid egna behov.
          </li>
          <li>
            <b>Känslomässig självundertryckning</b> – om du håller tillbaka
            känslor för att skydda partnern eller relationen.
          </li>
          <li>
            <b>Yttre fokus och relationsberoende självvärde</b> – hur starkt
            partnerns humör, behov och respons påverkar dig.
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 34 }}>
        <h2>Att bry sig om sin partner är inte medberoende</h2>

        <p style={paragraphStyle}>
          Att hjälpa, kompromissa och stötta sin partner är normala delar av
          en nära relation. Det blir mer problematiskt när omsorgen
          återkommande innebär att du tar över den andras ansvar, överger
          dina egna gränser eller känner att relationen bara fungerar om du
          håller ihop allting.
        </p>

        <p style={paragraphStyle}>
          Testet försöker därför skilja mellan vanlig omtanke och mönster där
          anpassningen börjar ske på bekostnad av ditt eget välbefinnande.
        </p>
      </section>

      <section style={{ marginTop: 34 }}>
        <h2>Medberoende kan se olika ut</h2>

        <p style={paragraphStyle}>
          Två personer kan få liknande totalresultat av helt olika skäl. En
          person kanske framför allt har svårt att sätta gränser, medan en
          annan känner ett starkt ansvar för att lösa partnerns problem.
          Därför visar testet både ett övergripande mönsterindex och resultat
          för de sex olika områdena.
        </p>
      </section>

      <section style={{ marginTop: 34 }}>
        <h2>Relationen omkring dig spelar också roll</h2>

        <p style={paragraphStyle}>
          Självuppoffring, vaksamhet och överansvar behöver inte enbart
          förstås som egenskaper hos personen som gör testet. En
          oförutsägbar, manipulativ eller destruktiv relation kan göra att
          någon gradvis börjar anpassa allt mer av sitt beteende efter
          partnern.
        </p>
        <p style={paragraphStyle}>
          Om du också vill förstå hur du reagerar på närhet och osäkerhet kan du läsa vår <Link href="/anknytning" className="underline underline-offset-4">guide om anknytning i vuxna relationer</Link>. Anknytningsmönster och medberoende beskriver olika frågor; oro för kontakten är inte samma sak som att ta över partnerns ansvar.
        </p>

        <p style={paragraphStyle}>
          Om du känner igen sådana mönster kan det därför vara relevant att
          också undersöka andra delar av relationen.
        </p>

        <div
          style={{
            display: "grid",
            gap: 10,
            marginTop: 16,
          }}
        >
          <Link href="/anknytningstest/test" style={cardStyle}>
            Gör anknytningstestet →
          </Link>

          <Link href="/narcissist-i-en-relation/test" style={cardStyle}>
            Testa narcissistiska relationsmönster →
          </Link>

          <Link href="/psykisk-misshandel-relation/test" style={cardStyle}>
            Test om psykisk misshandel och psykiskt våld →
          </Link>

          <Link href="/gaslighting-relation" style={cardStyle}>
            Läs om gaslighting →
          </Link>

          <Link href="/traumabindning-i-relation" style={cardStyle}>
            Läs om traumabindning →
          </Link>
        </div>
      </section>

      <section
        style={{
          marginTop: 40,
          padding: "22px 18px",
          borderRadius: 16,
          background: "#f6f6f6",
          border: "1px solid #e5e5e5",
        }}
      >
        <h2 style={{ marginTop: 0 }}>Gör medberoendetestet</h2>

        <p style={paragraphStyle}>
          Testet består av 30 frågor och tar bara några minuter. Du får först
          en kostnadsfri överblick över vilka mönster som framträder
          tydligast i dina svar.
        </p>

        <Link
          href="/medberoendetest/test"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            minHeight: 52,
            marginTop: 8,
            padding: "12px 16px",
            borderRadius: 12,
            background: "#111",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 800,
            boxSizing: "border-box",
          }}
        >
          Starta testet
        </Link>
      </section>

      <p
        style={{
          marginTop: 30,
          fontSize: 13,
          lineHeight: 1.65,
          color: "#666",
        }}
      >
        Testet är ett orienteringsverktyg och ställer ingen klinisk diagnos.
        Resultatet beskriver relationsmönster utifrån dina egna svar och bör
        förstås tillsammans med din faktiska situation.
      </p>
    </main>
  );
}

const paragraphStyle = {
  lineHeight: 1.75,
  color: "#444",
};

const listStyle = {
  paddingLeft: 22,
  lineHeight: 1.8,
  color: "#333",
};

const cardStyle = {
  display: "block",
  padding: "13px 14px",
  borderRadius: 12,
  border: "1px solid #e2e2e2",
  background: "#fafafa",
  color: "#111",
  textDecoration: "none",
  lineHeight: 1.5,
  fontWeight: 650,
};