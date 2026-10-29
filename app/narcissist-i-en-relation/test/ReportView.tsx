import TestRestartLink from "../../_components/TestRestartLink";
import Link from "next/link";
import { LS_KEY, areaLabels, areaDescriptions, overallLevel, areaLevel, overallExplanation, guidanceForArea, type Result } from "./model";
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
export default function ReportView({result,onRestart}:{result:Result;onRestart?:()=>void}) {const {scores, sortedAreas}=result;return (<><section data-flow="card"
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

          <h2
            style={{
              margin: "8px 0 0",
              fontSize: "clamp(25px, 7vw, 34px)",
              lineHeight: 1.15,
            }}
          >
            {overallLevel(scores.overall)}
          </h2>

          <p
            style={{
              marginTop: 14,
              lineHeight: 1.7,
              color: "#444",
            }}
          >
            {overallExplanation(scores.overall)}
          </p>

          <div data-flow="inset"
            style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 15,
              background: "#f7f7f7",
              border: "1px solid #e5e5e5",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#666",
              }}
            >
              Ditt sammanvägda mönsterindex
            </p>

            <p
              style={{
                margin: "5px 0 0",
                fontSize: 40,
                fontWeight: 900,
                letterSpacing: "-0.03em",
              }}
            >
              {scores.overall}/100
            </p>

            <p
              style={{
                margin: "8px 0 0",
                fontSize: 13,
                lineHeight: 1.55,
                color: "#666",
              }}
            >
              Detta är ett orienterande mönsterindex – inte en klinisk
              sannolikhet och inte en diagnos av din partner.
            </p>
          </div>

          <h3
            style={{
              marginTop: 28,
              marginBottom: 6,
              fontSize: 23,
            }}
          >
            Dina åtta områden
          </h3>

          <p
            style={{
              marginTop: 0,
              color: "#555",
              lineHeight: 1.6,
            }}
          >
            Det är ofta kombinationen av flera återkommande beteenden som
            säger mest om relationens dynamik.
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
                  <h4
                    style={{
                      margin: 0,
                      fontSize: 17,
                    }}
                  >
                    {areaLabels[area]}
                  </h4>

                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    {score}/100 · {areaLevel(score)}
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
                    lineHeight: 1.6,
                    color: "#555",
                  }}
                >
                  {areaDescriptions[area]}
                </p>

                <p
                  style={{
                    margin: "9px 0 0",
                    lineHeight: 1.6,
                  }}
                >
                  {guidanceForArea(area, score)}
                </p>
              </div>
            ))}
          </div>

          <h3
            style={{
              marginTop: 30,
              fontSize: 23,
            }}
          >
            Det viktigaste är inte etiketten
          </h3>

          <p
            style={{
              lineHeight: 1.75,
              color: "#444",
            }}
          >
            En person kan ha flera narcissistiska drag utan att uppfylla
            kriterierna för narcissistiskt personlighetssyndrom. För dig som
            lever i relationen är den praktiska frågan ofta viktigare:
            fungerar relationen ömsesidigt, kan du sätta gränser och blir dina
            känslor och behov behandlade med respekt?
          </p>

          <h3
            style={{
              marginTop: 26,
              fontSize: 23,
            }}
          >
            Vad du kan observera framåt
          </h3>

          <ol
            style={{
              paddingLeft: 22,
              lineHeight: 1.8,
              color: "#333",
            }}
          >
            <li>
              <b>Ansvar:</b> Kan din partner erkänna ett konkret fel utan att
              samtalet snabbt flyttas till dina brister?
            </li>
            <li>
              <b>Gränser:</b> Respekteras ett rimligt nej även när partnern
              blir besviken?
            </li>
            <li>
              <b>Ömsesidighet:</b> Finns det plats för dina behov när de
              konkurrerar med partnerns?
            </li>
            <li>
              <b>Reparation:</b> Leder ursäkter till faktisk förändring över
              tid, eller upprepas samma mönster?
            </li>
            <li>
              <b>Din utveckling:</b> Blir du tryggare och friare i
              relationen – eller mer försiktig och självtvivlande?
            </li>
          </ol>

          <h3
            style={{
              marginTop: 26,
              fontSize: 23,
            }}
          >
            Läs vidare utifrån ditt resultat
          </h3>

          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 14,
            }}
          >
            <Link data-flow="inset"
              href="/gaslighting-relation"
              style={linkCardStyle}
            >
              Gaslighting – när du börjar tvivla på din egen verklighetsbild →
            </Link>

            <Link data-flow="inset"
              href="/love-bombing-relation"
              style={linkCardStyle}
            >
              Love bombing – intensiv närhet som kan följas av kontroll →
            </Link>

            <Link data-flow="inset"
              href="/traumabindning-i-relation"
              style={linkCardStyle}
            >
              Traumabindning – varför det kan vara så svårt att lämna →
            </Link>

            <Link data-flow="inset"
              href="/psykisk-misshandel-relation"
              style={linkCardStyle}
            >
              Psykisk misshandel i en relation – tecken och mönster →
            </Link>

            <Link data-flow="inset"
              href="/psykiskt-vald/hjalp"
              style={linkCardStyle}
            >
              Hjälp och nästa steg vid psykiskt våld →
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
            <b>Om du känner dig rädd eller kontrollerad</b>

            <p
              style={{
                margin: "8px 0 0",
                lineHeight: 1.65,
                color: "#444",
              }}
            >
              Då är säkerheten viktigare än om beteendet bäst beskrivs som
              narcissism. Hot, tvång, övervakning och andra återkommande
              kränkningar kan behöva bedömas utifrån helt andra frågor än en
              personlighetsetikett.
            </p>

            <Link
              href="/psykiskt-vald/hjalp"
              style={{
                display: "inline-block",
                marginTop: 10,
                color: "#111",
                fontWeight: 750,
                textUnderlineOffset: 3,
              }}
            >
              Läs om stöd och praktiska nästa steg →
            </Link>
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
            </button> : <TestRestartLink storageKey={LS_KEY} href="/narcissist-i-en-relation/test" style={{
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
            </TestRestartLink>}

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
        </section>{!onRestart && (<p style={{ marginTop: 26, fontSize: 12, lineHeight: 1.6, color: "#777" }}>
        Testet är ett orienteringsverktyg och kan inte avgöra om en person
        har narcissistiskt personlighetssyndrom eller annan psykiatrisk
        diagnos.
      </p>)}</>);}
