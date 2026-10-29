import TestRestartLink from "../../_components/TestRestartLink";
import { LS_KEY, areaInfo, areaLevel, type Result } from "./model";

export default function ReportView({result,onRestart}:{result:Result;onRestart?:()=>void}) {const {areaScores, overallScore, overall, sortedAreas, topAreas, legalOverlap, guidance}=result;return (<><section>
          <div data-flow="dark"
            style={{
              padding: 22,
              background: "#111",
              color: "#fff",
              borderRadius: 18,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                opacity: 0.65,
                textTransform:
                  "uppercase",
                fontWeight: 800,
              }}
            >
              Fullständig analys
            </p>

            <h2
              style={{
                margin:
                  "7px 0 0",
                fontSize: 28,
              }}
            >
              Din analys av psykisk
              utsatthet
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 18,
                flexWrap: "wrap",
                marginTop: 18,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.65,
                  }}
                >
                  Mönsterindex
                </div>

                <div
                  style={{
                    fontSize: 38,
                    fontWeight: 900,
                  }}
                >
                  {overallScore}/100
                </div>
              </div>

              <div>
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.65,
                  }}
                >
                  Övergripande nivå
                </div>

                <div
                  style={{
                    marginTop: 5,
                    fontSize: 20,
                    fontWeight: 850,
                  }}
                >
                  {overall.label}
                </div>
              </div>
            </div>

            <p
              style={{
                lineHeight: 1.7,
                marginBottom: 0,
              }}
            >
              {overall.intro}{" "}
              {legalOverlap}
            </p>
          </div>

          <div
            style={{
              marginTop: 24,
            }}
          >
            <h2>
              Dina 8 analysområden
            </h2>

            <p
              style={{
                lineHeight: 1.65,
                opacity: 0.8,
              }}
            >
              Procentsiffrorna beskriver hur
              ofta dina svar gav utslag inom
              respektive område. De är inte
              juridiska sannolikheter.
            </p>

            <div
              style={{
                display: "grid",
                gap: 13,
                marginTop: 16,
              }}
            >
              {sortedAreas.map(
                ({ area, score }) => (
                  <div data-flow="inset"
                    key={area}
                    style={{
                      border:
                        "1px solid #e5e5e5",
                      borderRadius: 15,
                      padding: 16,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: 12,
                        alignItems:
                          "baseline",
                        flexWrap: "wrap",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          fontSize: 18,
                        }}
                      >
                        {
                          areaInfo[area]
                            .label
                        }
                      </h3>

                      <b>
                        {score}% –{" "}
                        {areaLevel(
                          score
                        )}
                      </b>
                    </div>

                    <div data-flow="track"
                      style={{
                        height: 8,
                        background:
                          "#ededed",
                        borderRadius:
                          999,
                        overflow:
                          "hidden",
                        marginTop: 12,
                      }}
                    >
                      <div data-flow="fill"
                        style={{
                          height:
                            "100%",
                          width: `${score}%`,
                          background:
                            "#111",
                        }}
                      />
                    </div>

                    <p
                      style={{
                        lineHeight: 1.65,
                        opacity: 0.82,
                        marginBottom: 0,
                      }}
                    >
                      {
                        areaInfo[area]
                          .explanation
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          <div data-flow="inset"
            style={{
              marginTop: 30,
              padding: 20,
              borderRadius: 16,
              background: "#f5f5f5",
              border:
                "1px solid #e5e5e5",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                fontWeight: 800,
                textTransform:
                  "uppercase",
                opacity: 0.55,
              }}
            >
              Juridisk orientering
            </p>

            <h2
              style={{
                margin:
                  "7px 0 12px",
              }}
            >
              Hur dina svar förhåller sig
              till lagen om psykiskt våld
            </h2>

            <p
              style={{
                lineHeight: 1.7,
              }}
            >
              Sedan den 1 juli 2026 finns
              ett särskilt brott som heter{" "}
              <b>psykiskt våld</b>. I
              bestämmelsen anges upprepade
              kränkningar i form av
              beskyllning, nedsättande
              uttalande, förödmjukande
              beteende, otillbörligt hot,
              otillbörligt tvång eller
              otillbörlig övervakning.
            </p>

            <p
              style={{
                lineHeight: 1.7,
              }}
            >
              Kränkningarna ska
              sammantaget ha varit ägnade
              att allvarligt skada
              personens självkänsla.
              Varaktig otillbörlig
              övervakning omfattas också
              genom en särskild del av
              bestämmelsen.
            </p>

            <p
              style={{
                lineHeight: 1.7,
                fontWeight: 700,
              }}
            >
              {legalOverlap}
            </p>

            <p
              style={{
                lineHeight: 1.7,
                opacity: 0.78,
              }}
            >
              Testet kan däremot inte
              avgöra om rekvisiten för ett
              brott är uppfyllda i ett
              enskilt fall. En sådan
              bedömning kräver en juridisk
              prövning av konkreta
              omständigheter och bevisning.
            </p>
          </div>

          <div
            style={{
              marginTop: 28,
            }}
          >
            <h2>
              Upprepning och varaktighet
            </h2>

            <p
              style={{
                lineHeight: 1.7,
              }}
            >
              Ditt resultat inom detta
              område är{" "}
              <b>
                {areaScores.pattern}% –{" "}
                {areaLevel(
                  areaScores.pattern
                )}
              </b>
              .
            </p>

            <p
              style={{
                lineHeight: 1.7,
                opacity: 0.86,
              }}
            >
              Det här området är viktigt
              eftersom psykiskt våld enligt
              bestämmelsen inte bara handlar
              om att något obehagligt har
              sagts eller gjorts en gång.
              När samma beteenden återkommer
              eller flera olika kränkningar
              tillsammans skapar ett
              långvarigt klimat blir
              mönstret mer betydelsefullt.
            </p>
          </div>

          <div
            style={{
              marginTop: 28,
            }}
          >
            <h2>
              Påverkan på dig
            </h2>

            <p
              style={{
                lineHeight: 1.7,
              }}
            >
              Ditt resultat inom påverkan
              på självkänsla och frihet är{" "}
              <b>
                {areaScores.impact}% –{" "}
                {areaLevel(
                  areaScores.impact
                )}
              </b>
              .
            </p>

            <p
              style={{
                lineHeight: 1.7,
                opacity: 0.86,
              }}
            >
              Lägg särskilt märke till om
              du har börjat tvivla på dig
              själv, undvika att uttrycka
              behov, väga varje ord eller
              förändra normala val för att
              slippa en reaktion. Sådana
              förändringar kan göra ett
              destruktivt mönster tydligare
              än enstaka konflikter gör.
            </p>
          </div>

          <div data-flow="inset"
            style={{
              marginTop: 28,
              padding: 20,
              border:
                "1px solid #e5e5e5",
              borderRadius: 16,
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              {guidance.heading}
            </h2>

            <p
              style={{
                lineHeight: 1.7,
              }}
            >
              {guidance.text}
            </p>
          </div>

          <div
            style={{
              marginTop: 30,
            }}
          >
            <h2>
              Konkreta nästa steg
            </h2>

            <ol
              style={{
                lineHeight: 1.85,
                paddingLeft: 23,
              }}
            >
              <li>
                <b>
                  Skriv ner konkreta
                  händelser.
                </b>{" "}
                Notera datum, vad som
                hände, vad som sades och
                eventuella personer som
                såg eller hörde det.
              </li>

              <li>
                <b>
                  Spara relevant digital
                  information.
                </b>{" "}
                Behåll meddelanden,
                e-post, bilder eller
                annan information som kan
                hjälpa dig att minnas
                händelser korrekt.
              </li>

              <li>
                <b>
                  Dokumentera mönstret,
                  inte bara de värsta
                  händelserna.
                </b>{" "}
                Upprepning kan vara
                betydelsefull när man
                försöker förstå en
                långvarig situation.
              </li>

              <li>
                <b>
                  Berätta för någon du
                  litar på.
                </b>{" "}
                En utomstående kan hjälpa
                dig att få perspektiv och
                minskar risken att du
                behöver bära situationen
                ensam.
              </li>

              <li>
                <b>
                  Sök professionell hjälp
                  vid behov.
                </b>{" "}
                Juridisk rådgivning,
                socialtjänst,
                stödverksamheter eller
                polis kan hjälpa beroende
                på situationens
                allvarlighetsgrad.
              </li>
            </ol>
          </div>

          <div
            style={{
              marginTop: 30,
            }}
          >
            <h2>
              Om mobil eller digital
              övervakning förekommer
            </h2>

            <p
              style={{
                lineHeight: 1.7,
              }}
            >
              Digital kontroll kan handla
              om krav på lösenord,
              platsdelning, tillgång till
              konton, kontroll av
              meddelanden eller annan
              övervakning. Om du misstänker
              att någon faktiskt har
              tillgång till dina konton
              eller din enhet bör du tänka
              på din säkerhet innan du
              ändrar inställningar på ett
              sätt som personen direkt kan
              upptäcka.
            </p>
          </div>

          <div data-flow="dark"
            style={{
              marginTop: 30,
              padding: 20,
              borderRadius: 16,
              background: "#111",
              color: "#fff",
            }}
          >
            <h2
              style={{
                marginTop: 0,
              }}
            >
              Om du känner dig rädd eller
              hotad
            </h2>

            <p
              style={{
                lineHeight: 1.7,
                opacity: 0.92,
              }}
            >
              Om du känner rädsla för vad
              personen kan göra är
              säkerheten viktigare än att
              konfrontera personen eller
              försöka bevisa ett mönster.
              Vid akut fara ska du ringa
              112.
            </p>
          </div>

          <div
            style={{
              marginTop: 30,
              paddingTop: 22,
              borderTop:
                "1px solid #e5e5e5",
            }}
          >
            <h2>
              Sammanfattning av ditt resultat
            </h2>

            <p
              style={{
                lineHeight: 1.7,
              }}
            >
              Din övergripande profil är{" "}
              <b>{overall.label}</b> med
              ett mönsterindex på{" "}
              <b>{overallScore}/100</b>.
              De mest framträdande
              områdena är{" "}
              <b>
                {
                  areaInfo[
                    topAreas[0].area
                  ].label
                }
              </b>
              ,{" "}
              <b>
                {
                  areaInfo[
                    topAreas[1].area
                  ].label
                }
              </b>{" "}
              och{" "}
              <b>
                {
                  areaInfo[
                    topAreas[2].area
                  ].label
                }
              </b>
              .
            </p>

            <p
              style={{
                lineHeight: 1.7,
              }}
            >
              Det viktigaste är att se
              helheten: vilka beteenden
              som återkommer, hur länge
              det har pågått och vad
              relationen över tid gör med
              din trygghet, självkänsla
              och möjlighet att fatta
              egna beslut.
            </p>
          </div>

          <div
            style={{
              marginTop: 28,
            }}
          >
            {onRestart ? <button
              onClick={onRestart}
              style={{
                padding:
                  "12px 15px",
                borderRadius: 12,
                border:
                  "1px solid #ddd",
                background: "#fff",
                color: "#111",
                cursor: "pointer",
                fontWeight: 750,
              }}
            >
              Gör om testet
            </button> : <TestRestartLink storageKey={LS_KEY} href="/psykisk-misshandel-relation/test" style={{
                padding:
                  "12px 15px",
                borderRadius: 12,
                border:
                  "1px solid #ddd",
                background: "#fff",
                color: "#111",
                cursor: "pointer",
                fontWeight: 750,
              }}>
              Gör om testet
            </TestRestartLink>}
          </div>

          <div
            style={{
              marginTop: 32,
              fontSize: 12,
              lineHeight: 1.65,
              opacity: 0.62,
            }}
          >
            <p>
              Testet är ett
              informations- och
              orienteringsverktyg. Det
              ställer ingen diagnos och
              avgör inte om ett brott har
              begåtts.
            </p>

            <p>
              Juridisk grund: 4 kap.
              brottsbalken och
              proposition 2025/26:138 om
              en särskild
              straffbestämmelse för
              psykiskt våld.
            </p>
          </div>
        </section>{!onRestart && (<nav aria-label="Fördjupning om psykiskt våld" style={{ marginTop: 28, fontSize: 13, lineHeight: 1.7 }}>
        Läs vidare om{" "}
        <a href="/psykiskt-vald" style={{ textDecoration: "underline" }}>
          psykiskt våld
        </a>{" "}
        och{" "}
        <a href="/psykiskt-vald/bevis" style={{ textDecoration: "underline" }}>
          bevis och dokumentation
        </a>
        .
      </nav>)}</>);}
