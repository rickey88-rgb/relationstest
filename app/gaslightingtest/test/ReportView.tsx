import Link from "next/link";
import { areaLabels, areaDescriptions, level, overallTitle, overallDescription, areaGuidance, type Result } from "./model";
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
export default function ReportView({ result, onRestart }: { result: Result; onRestart?: () => void }) {
const { scores, sortedAreas } = result;
return (
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
            {scores.overall}/100
          </div>

          <div
            style={{
              marginTop: 5,
              fontSize: 13,
              color: "#777",
            }}
          >
            Gaslightingindex
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
            Gaslighting handlar inte om att två människor ibland har olika
            minnesbilder. Det centrala är ett återkommande mönster där den
            ena personens version, reaktioner eller bedömningar systematiskt
            undermineras.
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
            Områdena hjälper dig se hur mönstret tar sig uttryck och vilken
            påverkan det verkar ha haft på dig.
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
            Konflikt eller gaslighting?
          </h3>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            I vanliga konflikter kan två personer minnas samma händelse
            olika, bli defensiva eller tycka att den andra överreagerar.
            Skillnaden är att bådas perspektiv fortfarande kan existera och
            diskuteras.
          </p>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            Ett gaslightingmönster blir mer bekymmersamt när samma process
            upprepas: det som hänt förnekas eller omtolkas, din version
            avfärdas, fokus flyttas till att det är något fel på din
            reaktion och du lämnar samtalet mer osäker på vad du själv såg,
            hörde eller upplevde.
          </p>

          <h3 style={{ marginTop: 26, fontSize: 23 }}>
            Vad händer med tilliten till dig själv?
          </h3>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            En viktig effekt av återkommande gaslighting kan vara att
            personen gradvis börjar kontrollera sitt eget minne, söka
            bekräftelse från andra eller tveka inför bedömningar som tidigare
            kändes självklara.
          </p>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            Om du märker att du ofta tänker ”kanske är det jag som minns
            fel” eller ”jag kanske bara är för känslig” efter situationer
            som först kändes tydligt problematiska är det värt att
            uppmärksamma hur det mönstret har utvecklats.
          </p>

          <h3 style={{ marginTop: 26, fontSize: 23 }}>
            Fem saker du kan börja observera
          </h3>

          <ol
            style={{
              paddingLeft: 22,
              lineHeight: 1.8,
              color: "#333",
            }}
          >
            <li>
              <b>Skriv ner händelser nära i tid.</b> Det gör det lättare att
              jämföra vad du upplevde då med hur situationen senare
              beskrivs.
            </li>
            <li>
              <b>Spara relevanta meddelanden.</b> Sms och andra skriftliga
              samtal kan hjälpa dig behålla en tydligare bild av vad som
              faktiskt kommunicerats.
            </li>
            <li>
              <b>Observera mönstret, inte bara grälet.</b> En enda
              minnesskillnad säger väldigt lite. Återkommande samma process
              säger betydligt mer.
            </li>
            <li>
              <b>Lägg märke till hur samtalen slutar.</b> Kommer ni närmare
              en förståelse eller lämnar du ofta samtalet mer förvirrad och
              självkritisk?
            </li>
            <li>
              <b>Behåll kontakt med människor utanför relationen.</b> Ett
              utifrånperspektiv kan hjälpa när tilliten till det egna
              omdömet börjat minska.
            </li>
          </ol>

          <h3 style={{ marginTop: 26, fontSize: 23 }}>
            Gaslighting och psykiskt våld
          </h3>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            Gaslighting kan förekomma tillsammans med andra destruktiva
            mönster som kontroll, förnedring, hot, manipulation och psykisk
            nedbrytning. Ett högt resultat här betyder inte automatiskt att
            alla sådana mönster finns, men det kan vara relevant att
            undersöka relationen bredare.
          </p>

          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 16,
            }}
          >
            <Link data-flow="inset"
              href="/psykisk-misshandel-relation/test"
              style={linkCardStyle}
            >
              Gör testet om psykisk misshandel och psykiskt våld →
            </Link>

            <Link data-flow="inset"
              href="/narcissist-i-en-relation/test"
              style={linkCardStyle}
            >
              Testa narcissistiska relationsmönster →
            </Link>

            <Link data-flow="inset" href="/medberoendetest/test" style={linkCardStyle}>
              Gör medberoendetestet →
            </Link>

            <Link data-flow="inset"
              href="/traumabindning-i-relation"
              style={linkCardStyle}
            >
              Läs om traumabindning →
            </Link>

            <Link data-flow="inset" href="/psykiskt-vald/hjalp" style={linkCardStyle}>
              Se vart du kan vända dig för hjälp →
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
              Testet är ett orienteringsverktyg och kan inte fastställa att
              gaslighting eller psykiskt våld förekommer. Resultatet bygger
              på dina egna svar och beskriver hur ofta vissa återkommande
              relationsmönster verkar förekomma.
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
            {onRestart ? <button
              type="button"
              onClick={onRestart}
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
            </button> : <Link href="/gaslightingtest/test" style={{
                minHeight: 46,
                padding: "11px 14px",
                borderRadius: 11,
                border: "1px solid #ccc",
                background: "#fff",
                color: "#111",
                cursor: "pointer",
                fontWeight: 650,
              }}>
              Gör om testet
            </Link>}

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
