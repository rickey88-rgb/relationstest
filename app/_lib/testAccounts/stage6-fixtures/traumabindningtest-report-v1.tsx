// Frozen original report and footer.
import Link from "next/link";
import { areaLabels, areaDescriptions, clamp, level, overallTitle, overallDescription, areaGuidance, type Result } from "./traumabindningtest-model-v1";
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
export default function Original({result,footer=false}:{result:Result;footer?:boolean}) {const {scores, sortedAreas}=result;function restart() {} return (<><section data-flow="card"
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
            Traumabindningsindex
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
            Testet mäter inte hur mycket du älskar någon. Det undersöker hur
            stark bindning kan samspela med återkommande smärta, lättnad, hopp,
            rationalisering och svårigheter att skapa avstånd.
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
            Områdena hjälper dig se vilka delar av bindningen som verkar
            starkast och hur de kan påverka dina beslut i relationen.
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
            Varför kan det vara så svårt att lämna?
          </h3>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            Det kan vara förvirrande att känna stark saknad eller längtan efter
            någon som samtidigt har orsakat mycket smärta. Känslomässig
            anknytning försvinner inte automatiskt bara för att en relation är
            destruktiv.
          </p>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            Om relationen dessutom växlar mellan svåra perioder och stark
            närhet kan återföreningen upplevas som en kraftig lättnad. Den
            lättnaden kan göra det svårare att hålla fast vid hur situationen
            kändes under de dåliga perioderna.
          </p>

          <h3 style={{ marginTop: 26, fontSize: 23 }}>
            När lättnad känns som kärlek
          </h3>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            Efter en period av konflikt, kyla eller rädsla kan värme från
            partnern kännas ovanligt intensiv. Det betyder inte att känslorna
            är falska. Men kontrasten mellan obehag och lättnad kan göra de
            positiva stunderna mycket betydelsefulla och förstärka hoppet om
            relationen.
          </p>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            Därför är det ofta mer informativt att bedöma relationens
            återkommande mönster över månader än att bedöma den utifrån de
            senaste bra dagarna.
          </p>

          <h3 style={{ marginTop: 26, fontSize: 23 }}>
            Traumabindning eller vanlig stark anknytning?
          </h3>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            En stark relation kan innebära intensiv kärlek, rädsla för förlust
            och sorg vid separation utan att vara destruktiv. Det som gör
            traumabindningsmönster mer bekymmersamma är när den starka
            anknytningen samexisterar med återkommande kränkningar, rädsla,
            kontroll, förnedring eller annan skada.
          </p>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            Frågan är därför inte bara hur starkt du känner, utan vad relationen
            faktiskt gör med din trygghet, dina gränser och ditt välmående över
            tid.
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
              <b>Bedöm hela mönstret.</b> Jämför hur relationen fungerar över
              längre tid istället för att låta en mycket bra eller mycket
              dålig vecka avgöra bilden.
            </li>
            <li>
              <b>Skriv ned varför du vill skapa avstånd.</b> Läs det igen om
              stark saknad eller återkontakt gör att problemen plötsligt känns
              mindre viktiga.
            </li>
            <li>
              <b>Skilj förklaring från acceptans.</b> Du kan förstå varför en
              partner beter sig på ett visst sätt utan att behöva acceptera
              beteendet.
            </li>
            <li>
              <b>Återupptäck dina egna gränser.</b> Fråga dig vilka beteenden
              du hade betraktat som oacceptabla innan relationen började.
            </li>
            <li>
              <b>Behåll perspektiv utanför relationen.</b> Kontakt med
              människor du litar på kan göra det lättare att se förändringar i
              dina egna gränser och ditt mående över tid.
            </li>
          </ol>

          <h3 style={{ marginTop: 26, fontSize: 23 }}>
            Undersök relationen från fler håll
          </h3>

          <p style={{ lineHeight: 1.75, color: "#444" }}>
            Traumabindningsrelaterade mönster kan förekomma tillsammans med
            psykiskt våld, gaslighting, starkt överansvar eller andra
            destruktiva relationsmönster. Resultatet här säger inte automatiskt
            att något av detta förekommer, men andra tester kan hjälpa dig
            skilja olika delar av relationen åt.
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

            <Link data-flow="inset" href="/gaslightingtest/test" style={linkCardStyle}>
              Gör gaslightingtestet →
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

            <Link data-flow="inset" href="/anknytningstest/test" style={linkCardStyle}>
              Gör anknytningstestet →
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
              Testet är ett orienteringsverktyg och inte en klinisk diagnos.
              Traumabindning saknar universellt accepterade diagnostiska
              gränsvärden. Resultatet beskriver endast hur starkt vissa
              relationsmönster framträder utifrån dina egna svar.
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
        </section></>);}
