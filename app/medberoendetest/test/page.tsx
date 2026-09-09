"use client";

import { useTestAnalytics } from "../../_analytics/useTestAnalytics";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Area =
  | "selfSacrifice"
  | "rescuing"
  | "control"
  | "boundaries"
  | "suppression"
  | "externalFocus";

type Question = {
  text: string;
  area: Area;
};

const questions: Question[] = [
  // SJÄLVUPPOFFRING
  {
    area: "selfSacrifice",
    text: "Jag sätter ofta min partners behov före mina egna, även när det går ut över mitt eget mående.",
  },
  {
    area: "selfSacrifice",
    text: "Jag avstår ofta från sådant som är viktigt för mig för att undvika att göra min partner missnöjd.",
  },
  {
    area: "selfSacrifice",
    text: "Jag anpassar ofta mina planer, önskemål eller behov efter min partner utan att förvänta mig samma hänsyn tillbaka.",
  },
  {
    area: "selfSacrifice",
    text: "Jag kan känna mig självisk när jag prioriterar något jag själv behöver framför min partners behov.",
  },
  {
    area: "selfSacrifice",
    text: "Jag fortsätter ofta ge stöd och energi till min partner även när jag själv känner mig helt dränerad.",
  },

  // ÖVERANSVAR & RÄDDANDE
  {
    area: "rescuing",
    text: "Jag känner ofta att det är mitt ansvar att lösa problem som egentligen är min partners.",
  },
  {
    area: "rescuing",
    text: "Jag försöker ofta skydda min partner från konsekvenserna av hens egna beslut eller beteenden.",
  },
  {
    area: "rescuing",
    text: "När min partner mår dåligt känner jag starkt att jag måste få hen att må bättre.",
  },
  {
    area: "rescuing",
    text: "Jag tar ofta över ansvar när min partner inte klarar eller vill hantera något själv.",
  },
  {
    area: "rescuing",
    text: "Jag har svårt att låta min partner hantera sina egna problem när jag tror att jag kan hjälpa eller lösa dem.",
  },

  // KONTROLL & PROBLEMLÖSNING
  {
    area: "control",
    text: "Jag försöker ofta förutse vad som kan gå fel för min partner så att jag kan förhindra det.",
  },
  {
    area: "control",
    text: "Jag känner mig lugnare när jag vet vad min partner gör och hur situationen utvecklas.",
  },
  {
    area: "control",
    text: "Jag lägger mycket energi på att försöka få min partner att fatta bättre beslut.",
  },
  {
    area: "control",
    text: "När min partner gör något jag tror kommer skapa problem har jag svårt att låta bli att ingripa.",
  },
  {
    area: "control",
    text: "Jag känner ofta att relationen eller vardagen skulle falla isär om jag slutade hålla ihop saker.",
  },

  // GRÄNSER & SJÄLVHÄVDELSE
  {
    area: "boundaries",
    text: "Jag har svårt att säga nej till min partner även när jag egentligen inte vill göra det hen ber om.",
  },
  {
    area: "boundaries",
    text: "Jag går ibland med på sådant jag inte är bekväm med för att undvika konflikt eller besvikelse.",
  },
  {
    area: "boundaries",
    text: "Jag har svårt att stå fast vid en gräns när min partner reagerar negativt på den.",
  },
  {
    area: "boundaries",
    text: "Jag håller ibland tillbaka mina egna önskemål eftersom jag är rädd att de ska skapa problem i relationen.",
  },
  {
    area: "boundaries",
    text: "Jag känner ofta ansvar för min partners reaktion när jag uttrycker ett behov eller sätter en gräns.",
  },

  // KÄNSLOMÄSSIG SJÄLVUNDERTRYCKNING
  {
    area: "suppression",
    text: "Jag döljer ofta hur jag egentligen mår för att inte belasta eller störa min partner.",
  },
  {
    area: "suppression",
    text: "Jag tonar ofta ner min egen besvikelse, ilska eller sorg för att hålla relationen lugn.",
  },
  {
    area: "suppression",
    text: "Jag har lättare att fokusera på min partners känslor än att uttrycka mina egna.",
  },
  {
    area: "suppression",
    text: "Jag låtsas ibland att något är okej fast det egentligen gör mig ledsen eller frustrerad.",
  },
  {
    area: "suppression",
    text: "Jag har svårt att visa vissa känslor om jag tror att min partner kommer reagera negativt på dem.",
  },

  // YTTRE FOKUS & RELATIONSBEROENDE SJÄLVVÄRDE
  {
    area: "externalFocus",
    text: "Min partners humör påverkar ofta mitt eget mående väldigt starkt.",
  },
  {
    area: "externalFocus",
    text: "Jag lägger mycket tid på att tänka på vad min partner behöver, känner eller gör.",
  },
  {
    area: "externalFocus",
    text: "Hur min partner reagerar på mig påverkar starkt hur jag känner inför mig själv.",
  },
  {
    area: "externalFocus",
    text: "När min partner är missnöjd med mig har jag svårt att känna mig trygg eller okej i mig själv.",
  },
  {
    area: "externalFocus",
    text: "Jag kan bli så upptagen av relationen och min partners situation att mina egna behov hamnar i bakgrunden.",
  },
];

const answerLabels = [
  "Stämmer inte alls",
  "Stämmer lite",
  "Stämmer delvis",
  "Stämmer ganska mycket",
  "Stämmer helt",
];

const areaLabels: Record<Area, string> = {
  selfSacrifice: "Självuppoffring",
  rescuing: "Överansvar & räddande",
  control: "Kontroll & problemlösning",
  boundaries: "Gränser & självhävdelse",
  suppression: "Känslomässig självundertryckning",
  externalFocus: "Yttre fokus & relationsberoende självvärde",
};

const areaDescriptions: Record<Area, string> = {
  selfSacrifice:
    "Visar i vilken grad dina egna behov, önskemål och din återhämtning får stå tillbaka för partnerns.",
  rescuing:
    "Visar i vilken grad du känner ansvar för att lösa partnerns problem, reglera partnerns mående eller skydda hen från konsekvenser.",
  control:
    "Visar hur mycket energi du lägger på att förebygga, styra eller hantera partnerns beteende och situation.",
  boundaries:
    "Visar hur lätt eller svårt det är för dig att säga nej, uttrycka egna behov och stå fast vid personliga gränser.",
  suppression:
    "Visar i vilken grad du döljer, tonar ner eller håller tillbaka dina egna känslor för relationens eller partnerns skull.",
  externalFocus:
    "Visar hur starkt ditt fokus och självvärde påverkas av partnerns behov, humör, respons och situation.",
};

const LS_KEY = "medberoendetest_state_v1";

/*
  STRIPE:
  När Payment Link är skapad, ersätt ENDAST texten
  REPLACE_WITH_STRIPE_LINK
  mellan citationstecknen nedan.
*/
const CHECKOUT_URL = "https://buy.stripe.com/cNi8wO5ON3s50q34IE0gw09";

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function level(score: number) {
  if (score >= 75) return "Omfattande";
  if (score >= 50) return "Tydligt";
  if (score >= 25) return "Vissa tecken";
  return "Få tecken";
}

function overallTitle(score: number) {
  if (score >= 75) {
    return "Omfattande medberoenderelaterade relationsmönster";
  }

  if (score >= 50) {
    return "Tydliga medberoenderelaterade relationsmönster";
  }

  if (score >= 25) {
    return "Vissa medberoenderelaterade relationsmönster";
  }

  return "Få medberoenderelaterade relationsmönster";
}

function overallDescription(score: number) {
  if (score >= 75) {
    return "Dina svar visar att flera mönster kring självuppoffring, ansvar, gränser eller starkt fokus på partnern återkommer i hög grad. Det kan innebära att relationens behov regelbundet får större utrymme än ditt eget välbefinnande och din självständighet.";
  }

  if (score >= 50) {
    return "Dina svar visar flera tydliga mönster som ofta förknippas med medberoende relationer. Det handlar inte om att du bryr dig för mycket, utan om att ansvar, gränser eller partnerns mående verkar få stor påverkan på hur du själv fungerar i relationen.";
  }

  if (score >= 25) {
    return "Dina svar visar vissa mönster som kan vara värda att uppmärksamma. En del av dem kan förekomma även i fungerande relationer, men blir mer problematiska om de återkommer ofta och gör att dina egna behov eller gränser får stå tillbaka.";
  }

  return "Dina svar visar relativt få av de relationsmönster som testet undersöker. Att hjälpa, kompromissa och bry sig om en partner är normalt och behöver inte innebära medberoende.";
}

function areaGuidance(area: Area, score: number) {
  const elevated = score >= 50;

  const guidance: Record<Area, string> = {
    selfSacrifice: elevated
      ? "Du verkar ofta ge partnerns behov företräde framför dina egna. Fundera särskilt på om kompromisserna är ömsesidiga eller om du regelbundet är den som får avstå, anpassa dig eller fortsätta ge trots att du själv är dränerad."
      : "Dina svar tyder inte på att självuppoffring dominerar relationen. Du verkar i relativt hög grad kunna ta hänsyn till partnern utan att konsekvent prioritera bort dig själv.",

    rescuing: elevated
      ? "Du verkar ofta ta ansvar för sådant som egentligen tillhör din partner. Att stötta någon är något annat än att bära deras ansvar eller skydda dem från konsekvenserna av deras egna val."
      : "Du verkar relativt väl kunna skilja mellan att stötta din partner och att ta över ansvaret för partnerns problem.",

    control: elevated
      ? "Du verkar lägga mycket energi på att hålla ihop, förebygga eller lösa situationer kring partnern. Kontroll kan ibland kännas som omsorg eller problemlösning, särskilt när alternativet upplevs som att allt riskerar att falla samman."
      : "Dina svar visar relativt liten tendens att försöka styra eller förebygga partnerns problem för att själv kunna känna trygghet.",

    boundaries: elevated
      ? "Det verkar ibland vara svårt att uttrycka behov eller hålla fast vid ett nej när partnern blir besviken, arg eller missnöjd. Ett viktigt område kan vara att skilja på ansvar för din egen gräns och ansvar för partnerns reaktion på den."
      : "Du verkar i relativt hög grad kunna uttrycka behov och upprätthålla personliga gränser även när det innebär att partnern inte alltid blir nöjd.",

    suppression: elevated
      ? "Du verkar ofta hålla tillbaka dina egna känslor för att skydda partnern eller relationen. På kort sikt kan det minska konflikt, men på längre sikt kan det göra dina behov svårare att se både för dig själv och för partnern."
      : "Du verkar relativt bekväm med att låta dina egna känslor få plats i relationen istället för att konsekvent undertrycka dem.",

    externalFocus: elevated
      ? "Din partners mående och respons verkar ha stor betydelse för hur du själv känner och fungerar. Lägg märke till om ditt fokus på relationen gör det svårt att behålla kontakt med dina egna behov, intressen och din egen känsla av värde."
      : "Dina svar tyder på att partnerns humör och respons inte helt styr ditt eget självvärde eller fokus.",
  };

  return guidance[area];
}

export default function Page() {
  const totalQuestions = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(totalQuestions).fill(-1)
  );
  const [unlocked, setUnlocked] = useState(false);
  const tracking = useTestAnalytics("codependency_test", questions.length);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);

      if (raw) {
        const parsed = JSON.parse(raw) as {
          index?: number;
          answers?: number[];
        };

        if (
          Array.isArray(parsed.answers) &&
          parsed.answers.length === totalQuestions
        ) {
          setAnswers(parsed.answers);
        }

        if (typeof parsed.index === "number") {
          setIndex(clamp(parsed.index, 0, totalQuestions - 1));
        }
      }
    } catch {
      // Testet fungerar även om lokal lagring inte är tillgänglig.
    }

    setHydrated(true);
  }, [totalQuestions]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          index,
          answers,
        })
      );
    } catch {
      // Ignorera om localStorage är blockerat.
    }
  }, [index, answers, hydrated]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("paid") === "true") {
      tracking.purchase();
      setUnlocked(true);
      window.history.replaceState({}, "", window.location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const answeredCount = useMemo(
    () => answers.filter((answer) => answer >= 0).length,
    [answers]
  );

  const progress = clamp(
    Math.round((answeredCount / totalQuestions) * 100),
    0,
    100
  );

  const isFinished = answers.every((answer) => answer >= 0);

  const scores = useMemo(() => {
    const raw = {} as Record<Area, number>;
    const maximum = {} as Record<Area, number>;

    (Object.keys(areaLabels) as Area[]).forEach((area) => {
      raw[area] = 0;
      maximum[area] = 0;
    });

    questions.forEach((question, questionIndex) => {
      maximum[question.area] += 4;

      const answer = answers[questionIndex];

      if (answer >= 0) {
        raw[question.area] += answer;
      }
    });

    const areas = {} as Record<Area, number>;

    (Object.keys(areaLabels) as Area[]).forEach((area) => {
      areas[area] =
        maximum[area] > 0
          ? Math.round((raw[area] / maximum[area]) * 100)
          : 0;
    });

    const overall =
      Math.round(
        (Object.values(areas).reduce((sum, score) => sum + score, 0) /
          Object.values(areas).length) *
          10
      ) / 10;

    return {
      areas,
      overall,
    };
  }, [answers]);

  const sortedAreas = useMemo(() => {
    return (Object.keys(scores.areas) as Area[])
      .map((area) => ({
        area,
        score: scores.areas[area],
      }))
      .sort((a, b) => b.score - a.score);
  }, [scores.areas]);

  const strongestAreas = sortedAreas.slice(0, 3);

  const currentQuestion = questions[index];

  function selectAnswer(value: number) {
    tracking.answer(answers.filter(answer => answer >= 0).length + (answers[index] < 0 ? 1 : 0), index + 1);
    setAnswers((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });

    if (index < totalQuestions - 1) {
      setIndex((currentIndex) => currentIndex + 1);
    }
  }

  function goBack() {
    setIndex((currentIndex) => Math.max(0, currentIndex - 1));
  }

  function restart() {
    tracking.restart();
    setAnswers(Array(totalQuestions).fill(-1));
    setIndex(0);
    setUnlocked(false);

    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // Ignorera.
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

 function goToCheckout() {
  tracking.checkout();
  window.location.href = CHECKOUT_URL;
}

  if (!hydrated) {
    return (
      <>
        <p>Laddar testet...</p>
      </>
    );
  }

  return (
    <>
      <div style={{ marginBottom: 20 }}>
        {!isFinished && (
          <div style={{ marginTop: 20 }}>
            <div
              style={{
                height: 9,
                background: "#ededed",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#111",
                  transition: "width 180ms ease",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                fontSize: 13,
                color: "#666",
              }}
            >
              <span>{progress}% klart</span>
              <span>
                Fråga {index + 1} av {totalQuestions}
              </span>
            </div>
          </div>
        )}
      </div>

      {!isFinished && (
        <section
          style={{
            background: "#fff",
            border: "1px solid #e6e6e6",
            borderRadius: 18,
            padding: "20px 16px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.035)",
          }}
        >
          <p
            style={{
              margin: 0,
              textAlign: "center",
              color: "#777",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Hur väl stämmer detta in på dig?
          </p>

          <p
            style={{
              margin: "14px auto 20px",
              maxWidth: 620,
              fontSize: "clamp(20px, 5vw, 25px)",
              lineHeight: 1.4,
              textAlign: "center",
              fontWeight: 750,
            }}
          >
            {currentQuestion.text}
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {[0, 1, 2, 3, 4].map((value) => {
              const selected = answers[index] === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => selectAnswer(value)}
                  className={`answer-button ${
                    selected ? "selected" : ""
                  }`}
                >
                  {answerLabels[value]}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={goBack}
              disabled={index === 0}
              style={{
                minHeight: 44,
                padding: "10px 14px",
                borderRadius: 11,
                border: "1px solid #ddd",
                background: index === 0 ? "#f5f5f5" : "#fff",
                color: index === 0 ? "#aaa" : "#222",
                cursor: index === 0 ? "not-allowed" : "pointer",
              }}
            >
              ← Tillbaka
            </button>
          </div>
        </section>
      )}

      {isFinished && !unlocked && (
        <section ref={tracking.paywallRef}
          style={{
            background: "#0d0d0d",
            color: "#fff",
            borderRadius: 20,
            padding: "24px 18px",
          }}
        >
          <p
            style={{
              margin: 0,
              color: "#bbb",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Ditt resultat
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
              color: "#aaa",
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
              color: "#eee",
            }}
          >
            {overallDescription(scores.overall)}
          </p>

          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: 13,
                color: "#aaa",
              }}
            >
              De tre områden som framträder tydligast:
            </p>

            <div style={{ display: "grid", gap: 10 }}>
              {strongestAreas.map(({ area, score }) => (
                <div
                  key={area}
                  style={{
                    padding: 13,
                    borderRadius: 13,
                    background: "rgba(255,255,255,0.06)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 12,
                      alignItems: "baseline",
                    }}
                  >
                    <b>{areaLabels[area]}</b>
                    <span style={{ color: "#ccc", whiteSpace: "nowrap" }}>
                      {score}/100
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 21 }}>
              Se vad som ligger bakom ditt resultat
            </h3>

            <p
              style={{
                margin: "10px 0 0",
                lineHeight: 1.65,
                color: "#ddd",
              }}
            >
              Den fullständiga analysen visar samtliga sex områden och
              hjälper dig skilja mellan stöd och överansvar, kompromiss och
              självuppoffring samt omtanke och att förlora kontakten med
              dina egna behov.
            </p>

            <button
              type="button"
              onClick={goToCheckout}
              style={{
                marginTop: 16,
                width: "100%",
                minHeight: 52,
                padding: "13px 16px",
                borderRadius: 13,
                border: "1px solid #fff",
                background: "#fff",
                color: "#111",
                cursor: "pointer",
                fontSize: 16,
                fontWeight: 800,
              }}
            >
              Lås upp fullständig analys – 79 kr
            </button>
          </div>

          <button
            type="button"
            onClick={restart}
            style={{
              marginTop: 18,
              minHeight: 44,
              padding: "10px 13px",
              borderRadius: 11,
              border: "1px solid #555",
              background: "transparent",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Gör om testet
          </button>
        </section>
      )}

      {isFinished && unlocked && (
        <section
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

          <div
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
              <div
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

                <div
                  style={{
                    marginTop: 10,
                    height: 8,
                    borderRadius: 999,
                    background: "#e7e7e7",
                    overflow: "hidden",
                  }}
                >
                  <div
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
            <Link href="/anknytningstest/test" style={linkCardStyle}>
              Undersök din anknytningsprofil →
            </Link>

            <Link
              href="/narcissist-i-en-relation/test"
              style={linkCardStyle}
            >
              Testa narcissistiska relationsmönster →
            </Link>

            <Link
              href="/psykisk-misshandel-relation/test"
              style={linkCardStyle}
            >
              Test om psykisk misshandel och psykiskt våld →
            </Link>

            <Link href="/gaslighting-relation" style={linkCardStyle}>
              Läs om gaslighting →
            </Link>

            <Link
              href="/traumabindning-i-relation"
              style={linkCardStyle}
            >
              Läs om traumabindning →
            </Link>
          </div>

          <div
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
      )}

      <style jsx>{`
        .answer-button {
          min-height: 50px;
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #dcdcdc;
          background: #fff;
          color: #111;
          cursor: pointer;
          text-align: left;
          font-size: 16px;
          font-weight: 500;
          transition:
            background 0.15s ease,
            border-color 0.15s ease;
        }

        .answer-button:hover {
          background: #f1f1f1;
          border-color: #c7c7c7;
        }

        .answer-button.selected {
          background: #ececec;
          border: 2px solid #111;
          font-weight: 700;
        }
      `}</style>
    </>
  );
}

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