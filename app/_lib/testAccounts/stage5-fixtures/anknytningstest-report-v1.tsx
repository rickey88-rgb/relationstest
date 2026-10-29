// Frozen original premium section, including restart button and navigation.
import Link from "next/link";
import { subscaleLabels, subscaleDescriptions, clamp, scoreLevel, profileDeep, subscaleGuidance, type Result } from "./anknytningstest-model-v1";
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
export default function Original({ result }: { result: Result }) { const { scores, sortedSubscales, anxiety, avoidance, profile } = result; function restart() {} return (
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
            Din fullständiga anknytningsanalys
          </p>

          <h2
            style={{
              margin: "8px 0 0",
              fontSize: "clamp(25px, 7vw, 34px)",
              lineHeight: 1.15,
            }}
          >
            {profile}
          </h2>

          <p
            style={{
              marginTop: 14,
              lineHeight: 1.7,
              color: "#444",
            }}
          >
            {profileDeep(anxiety, avoidance)}
          </p>

          <div data-flow="grid"
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 12,
              marginTop: 20,
            }}
          >
            <div data-flow="inset"
              style={{
                padding: 16,
                borderRadius: 15,
                background: "#f7f7f7",
                border: "1px solid #e5e5e5",
              }}
            >
              <div style={{ fontSize: 13, color: "#666" }}>
                Anknytningsångest
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: 36,
                  fontWeight: 900,
                }}
              >
                {anxiety}/100
              </div>

              <div
                style={{
                  marginTop: 3,
                  fontWeight: 750,
                }}
              >
                {scoreLevel(anxiety)}
              </div>
            </div>

            <div data-flow="inset"
              style={{
                padding: 16,
                borderRadius: 15,
                background: "#f7f7f7",
                border: "1px solid #e5e5e5",
              }}
            >
              <div style={{ fontSize: 13, color: "#666" }}>
                Anknytningsundvikande
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: 36,
                  fontWeight: 900,
                }}
              >
                {avoidance}/100
              </div>

              <div
                style={{
                  marginTop: 3,
                  fontWeight: 750,
                }}
              >
                {scoreLevel(avoidance)}
              </div>
            </div>
          </div>

          <div data-flow="inset"
            style={{
              marginTop: 16,
              padding: 14,
              borderRadius: 13,
              background: "#fafafa",
              border: "1px solid #e8e8e8",
              fontSize: 13,
              lineHeight: 1.6,
              color: "#666",
            }}
          >
            Resultatet beskriver två kontinuerliga dimensioner. En person
            behöver alltså inte passa perfekt i en enda anknytningskategori,
            och mönstret kan dessutom variera mellan olika relationer och
            situationer.
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
              lineHeight: 1.6,
            }}
          >
            Delområdena visar vad som ligger bakom dina två övergripande
            anknytningsdimensioner.
          </p>

          <div
            style={{
              display: "grid",
              gap: 12,
              marginTop: 16,
            }}
          >
            {sortedSubscales.map(({ subscale, score }) => (
              <div data-flow="inset"
                key={subscale}
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
                    {subscaleLabels[subscale]}
                  </h4>

                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 800,
                    }}
                  >
                    {score}/100 · {scoreLevel(score)}
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
                  {subscaleDescriptions[subscale]}
                </p>

                <p
                  style={{
                    margin: "9px 0 0",
                    lineHeight: 1.6,
                  }}
                >
                  {subscaleGuidance(subscale, score)}
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
            Relationsmiljön spelar också roll
          </h3>

          <p
            style={{
              lineHeight: 1.75,
              color: "#444",
            }}
          >
            En hög nivå av anknytningsångest betyder inte automatiskt att
            all oro kommer från dig. En partner som växlar kraftigt mellan
            närhet och distans, hotar med separation, är otrogen,
            manipulerar eller regelbundet gör relationen osäker kan skapa
            stark oro även hos någon som annars fungerar betydligt tryggare.
          </p>

          <p
            style={{
              lineHeight: 1.75,
              color: "#444",
            }}
          >
            På samma sätt behöver ett starkt behov av avstånd inte alltid
            bero på ett stabilt undvikande anknytningsmönster. I en relation
            som känns kontrollerande, intensiv eller otrygg kan avstånd vara
            en reaktion på själva relationsmiljön.
          </p>

          <h3
            style={{
              marginTop: 26,
              fontSize: 23,
            }}
          >
            Vad kan hjälpa dig utveckla tryggare relationsmönster?
          </h3>

          <ol
            style={{
              paddingLeft: 22,
              lineHeight: 1.8,
              color: "#333",
            }}
          >
            <li>
              <b>Identifiera vad som aktiverar dig.</b> Lägg märke till vilka
              situationer som får dig att jaga närhet eller skapa avstånd.
            </li>
            <li>
              <b>Skilj känsla från fakta.</b> En stark känsla av avvisande
              betyder inte alltid att du faktiskt blir avvisad.
            </li>
            <li>
              <b>Kommunicera behov direkt.</b> Att uttrycka vad du behöver är
              ofta mer effektivt än protest, testande, tystnad eller
              tillbakadragande.
            </li>
            <li>
              <b>Öva på ömsesidighet.</b> Trygg anknytning innebär både att
              kunna luta sig mot en partner och att kunna stå på egna ben.
            </li>
            <li>
              <b>Bedöm relationen, inte bara dig själv.</b> Om din partner
              konsekvent skapar otrygghet behöver problemet inte ligga i din
              anknytning.
            </li>
          </ol>

          <h3
            style={{
              marginTop: 26,
              fontSize: 23,
            }}
          >
            När andra relationsmönster kan vara viktiga
          </h3>

          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 14,
            }}
          >
            <Link data-flow="inset" href="/narcissist-i-en-relation/test" style={linkCardStyle}>
              Lever du med narcissistiska relationsmönster? →
            </Link>

            <Link data-flow="inset"
              href="/psykisk-misshandel-relation/test"
              style={linkCardStyle}
            >
              Test om psykisk misshandel och psykiskt våld →
            </Link>

            <Link data-flow="inset" href="/gaslighting-relation" style={linkCardStyle}>
              Gaslighting – när du börjar tvivla på din egen
              verklighetsbild →
            </Link>

            <Link data-flow="inset" href="/traumabindning-i-relation" style={linkCardStyle}>
              Traumabindning – när stark närhet och smärta binds samman →
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
            <b>Kom ihåg</b>

            <p
              style={{
                margin: "8px 0 0",
                lineHeight: 1.65,
                color: "#444",
              }}
            >
              Anknytningsmönster är inte ett mått på ditt värde och behöver
              inte vara permanenta. De kan förändras genom nya erfarenheter,
              tryggare relationer, ökad självförståelse och i vissa fall
              professionellt stöd.
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
