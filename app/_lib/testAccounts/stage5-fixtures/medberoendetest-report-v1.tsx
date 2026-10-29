// Frozen original premium section, including restart button and navigation.
import Link from "next/link";
import { areaLabels, areaDescriptions, clamp, level, overallTitle, overallDescription, areaGuidance, type Result } from "./medberoendetest-model-v1";
const linkCardStyle = {
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
export default function Original({ result }: { result: Result }) { const { scores, sortedAreas } = result; function restart() {} return (
<section data-flow="card"
          style={{
            background: "#fff",
            border: "1px solid #e6e6e6",
            borderRadius: 20,
            padding: "24px 18px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              color: "#777",
              fontWeight: 600,
            }}
          >
            Din fullständiga analys
          </p>

          <div
            style={{
              marginTop: 8,
              fontSize: "clamp(42px, 12vw, 64px)",
              lineHeight: 1,
              fontWeight: 900,
            }}
          >
            {Math.round(scores.overall)}/100
          </div>

          <div
            style={{
              marginTop: 5,
              fontSize: 13,
              color: "#777",
            }}
          >
            Mönsterindex
          </div>

          <h2
            style={{
              margin: "18px 0 0",
              fontSize: "clamp(24px, 7vw, 32px)",
              lineHeight: 1.2,
            }}
          >
            {overallTitle(scores.overall)}
          </h2>

          <p
            style={{
              marginTop: 14,
              lineHeight: 1.7,
              color: "#444",
            }}
          >
            {overallDescription(scores.overall)}
          </p>

          <div data-flow="inset"
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 13,
              background: "#f7f7f7",
              border: "1px solid #e6e6e6",
              lineHeight: 1.65,
              color: "#555",
              fontSize: 14,
            }}
          >
            Ett högt resultat betyder inte att omtanke eller hjälpsamhet är
            något negativt. Det viktiga är om relationen återkommande kräver
            att du tar över ansvar, överger dina gränser eller tappar
            kontakten med dina egna behov.
          </div>

          <h3
            style={{
              marginTop: 30,
              marginBottom: 6,
              fontSize: 23,
            }}
          >
            Dina sex delområden
          </h3>

          <p
            style={{
              marginTop: 0,
              color: "#555",
              lineHeight: 1.65,
            }}
          >
            Här ser du vilka relationsmönster som bidrar mest till ditt
            resultat.
          </p>

          <div
            style={{
              display: "grid",
              gap: 12,
              marginTop: 16,
            }}
          >
            {sortedAreas.map(({ area, score }) => (
              <div data-flow="inset"
                key={area}
                style={{
                  padding: 16,
                  borderRadius: 15,
                  border: "1px solid #e5e5e5",
                  background: "#fafafa",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 12,
                    alignItems: "baseline",
                    flexWrap: "wrap",
                  }}
                >
                  <h4 style={{ margin: 0, fontSize: 17 }}>
                    {areaLabels[area]}
                  </h4>

                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    {score}/100 · {level(score)}
                  </div>
                </div>

                <div data-flow="track"
                  style={{
                    marginTop: 10,
                    height: 8,
                    borderRadius: 999,
                    background: "#e7e7e7",
                    overflow: "hidden",
                  }}
                >
                  <div data-flow="fill"
                    style={{
                      width: `${score}%`,
                      height: "100%",
                      background: "#111",
                    }}
                  />
                </div>

                <p
                  style={{
                    margin: "12px 0 0",
                    lineHeight: 1.65,
                    color: "#555",
                  }}
                >
                  {areaDescriptions[area]}
                </p>

                <p
                  style={{
                    margin: "9px 0 0",
                    lineHeight: 1.65,
                    color: "#222",
                  }}
                >
                  {areaGuidance(area, score)}
                </p>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: 30, fontSize: 23 }}>
            Stöd eller överansvar?
          </h3>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            I en fungerande relation hjälper människor varandra. Skillnaden
            ligger bland annat i om hjälpen är frivillig och ömsesidig, om
            du kan säga nej utan stark skuld och om partnern fortfarande
            förväntas ta ansvar för sina egna val och konsekvenser.
          </p>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            Om du däremot upplever att du måste hålla partnern stabil,
            förebygga problem, täcka upp för hens beteende eller ständigt
            anpassa dig för att relationen ska fungera kan balansen mellan
            stöd och ansvar ha förskjutits.
          </p>

          <h3 style={{ marginTop: 26, fontSize: 23 }}>
            Fem saker att börja observera
          </h3>

          <ol
            style={{
              paddingLeft: 22,
              lineHeight: 1.8,
              color: "#333",
            }}
          >
            <li>
              <b>Vems ansvar är problemet?</b> Försök skilja på att hjälpa
              någon och att ta över konsekvenserna av deras beslut.
            </li>
            <li>
              <b>Vad händer när du säger nej?</b> Lägg märke till både din
              egen skuld och partnerns reaktion.
            </li>
            <li>
              <b>Vad behöver du själv?</b> Notera om den frågan är svårare
              att svara på än vad partnern behöver.
            </li>
            <li>
              <b>Är omsorgen ömsesidig?</b> Fundera på vem som vanligtvis
              anpassar sig, reparerar och håller ihop relationen.
            </li>
            <li>
              <b>Vad skulle hända om du slutade rädda?</b> Svaret kan säga
              mycket om vilket ansvar du har tagit över.
            </li>
          </ol>

          <h3 style={{ marginTop: 26, fontSize: 23 }}>
            Relationsmiljön spelar roll
          </h3>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            Mönster av självuppoffring och överansvar uppstår inte alltid i
            ett vakuum. En relation med manipulation, återkommande kriser,
            stark oförutsägbarhet, missbruk, hot eller psykisk nedbrytning
            kan göra att en person gradvis börjar anpassa hela sitt
            beteende efter partnern.
          </p>

          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 16,
            }}
          >
            <Link data-flow="inset" href="/anknytningstest/test" style={linkCardStyle}>
              Undersök din anknytningsprofil →
            </Link>

            <Link data-flow="inset"
              href="/narcissist-i-en-relation/test"
              style={linkCardStyle}
            >
              Testa narcissistiska relationsmönster →
            </Link>

            <Link data-flow="inset"
              href="/psykisk-misshandel-relation/test"
              style={linkCardStyle}
            >
              Test om psykisk misshandel och psykiskt våld →
            </Link>

            <Link data-flow="inset" href="/gaslighting-relation" style={linkCardStyle}>
              Läs om gaslighting →
            </Link>

            <Link data-flow="inset"
              href="/traumabindning-i-relation"
              style={linkCardStyle}
            >
              Läs om traumabindning →
            </Link>
          </div>

          <div data-flow="inset"
            style={{
              marginTop: 26,
              padding: 16,
              borderRadius: 14,
              background: "#f7f7f7",
              border: "1px solid #e5e5e5",
            }}
          >
            <b>Om testresultatet</b>

            <p
              style={{
                margin: "8px 0 0",
                lineHeight: 1.65,
                color: "#444",
              }}
            >
              Testet är ett orienteringsverktyg och inte en klinisk
              diagnos. Ett resultat ska förstås tillsammans med din
              faktiska relationssituation, hur länge mönstren har funnits
              och hur mycket de påverkar ditt välbefinnande och din
              handlingsfrihet.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 24,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={restart}
              style={{
                minHeight: 46,
                padding: "11px 14px",
                borderRadius: 11,
                border: "1px solid #ccc",
                background: "#fff",
                color: "#111",
                cursor: "pointer",
                fontWeight: 650,
              }}
            >
              Gör om testet
            </button>

            <Link
              href="/"
              style={{
                minHeight: 46,
                display: "inline-flex",
                alignItems: "center",
                padding: "11px 14px",
                borderRadius: 11,
                border: "1px solid #ccc",
                color: "#111",
                textDecoration: "none",
                fontWeight: 650,
              }}
            >
              Till startsidan
            </Link>
          </div>
        </section>
); }
