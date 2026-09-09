"use client";

import { useTestAnalytics } from "../../_analytics/useTestAnalytics";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Area =
  | "denial"
  | "memory"
  | "minimization"
  | "blame"
  | "realityShift"
  | "selfDoubt";

type Question = {
  text: string;
  area: Area;
};

const questions: Question[] = [
  // FÖRNEKANDE AV HÄNDELSER
  {
    area: "denial",
    text: "Min partner förnekar ibland att hen sagt något som jag tydligt minns att hen sagt.",
  },
  {
    area: "denial",
    text: "Min partner hävdar ibland att en händelse aldrig inträffade trots att jag upplevde den tydligt.",
  },
  {
    area: "denial",
    text: "När jag tar upp något som sårat mig får jag ibland höra att det jag beskriver inte hände på det sättet.",
  },
  {
    area: "denial",
    text: "Min partner kan förneka tidigare löften, överenskommelser eller uttalanden när jag senare hänvisar till dem.",
  },
  {
    area: "denial",
    text: "Jag har varit med om att min partner bestämt förnekat något även när jag känt mig mycket säker på vad som faktiskt hände.",
  },

  // IFRÅGASÄTTANDE AV MINNE & PERCEPTION
  {
    area: "memory",
    text: "Min partner säger återkommande att jag minns saker fel när vi inte är överens om vad som hänt.",
  },
  {
    area: "memory",
    text: "Jag får ibland höra att jag har missförstått en situation som jag själv upplevde som tydlig.",
  },
  {
    area: "memory",
    text: "Min partner får mig ibland att känna att mitt minne är mindre pålitligt än hens.",
  },
  {
    area: "memory",
    text: "När våra versioner skiljer sig åt framställs min partners version ofta som självklar och min som felaktig.",
  },
  {
    area: "memory",
    text: "Min partner använder ibland påståenden om att jag är glömsk, förvirrad eller missuppfattar saker för att avfärda min version.",
  },

  // FÖRMINSKNING AV KÄNSLOR & REAKTIONER
  {
    area: "minimization",
    text: "När jag blir ledsen eller upprörd över något min partner gjort får jag ofta höra att jag överdriver.",
  },
  {
    area: "minimization",
    text: "Min partner beskriver ibland mina reaktioner som orimliga istället för att bemöta det jag reagerar på.",
  },
  {
    area: "minimization",
    text: "Jag får ofta höra att jag är för känslig när jag tar upp något som gjort mig illa.",
  },
  {
    area: "minimization",
    text: "När jag försöker prata om ett problem flyttas fokus ofta från partnerns beteende till hur starkt jag reagerar.",
  },
  {
    area: "minimization",
    text: "Min partner får ibland mina känslor att framstå som bevis på att det är jag som är problemet.",
  },

  // SKULDVÄNDNING
  {
    area: "blame",
    text: "När jag tar upp något min partner gjort slutar samtalet ofta med att jag själv får skulden.",
  },
  {
    area: "blame",
    text: "Min partner förklarar ibland sitt eget sårande beteende med att jag provocerade fram det.",
  },
  {
    area: "blame",
    text: "Jag går ibland in i ett samtal för att ta upp något som hänt men lämnar samtalet med känslan att jag måste försvara mig själv.",
  },
  {
    area: "blame",
    text: "Min partner vänder ofta konflikter så att mina misstag blir viktigare än det beteende jag försökte ta upp.",
  },
  {
    area: "blame",
    text: "Jag får ibland höra att partnerns beteende egentligen är en konsekvens av hur jag själv är eller beter mig.",
  },

  // MOTSÄGELSER & VERKLIGHETSFÖRSKJUTNING
  {
    area: "realityShift",
    text: "Min partners förklaring till samma händelse kan förändras när tidigare detaljer inte längre passar.",
  },
  {
    area: "realityShift",
    text: "När jag påpekar en motsägelse får jag ibland en ny förklaring som gör att jag börjar tvivla på om jag förstått situationen rätt.",
  },
  {
    area: "realityShift",
    text: "Min partner kan med stor säkerhet beskriva händelser på ett sätt som skiljer sig mycket från hur jag själv upplevde dem.",
  },
  {
    area: "realityShift",
    text: "Jag upplever ibland att reglerna för vad som anses sant eller rimligt förändras beroende på vad som passar min partner i stunden.",
  },
  {
    area: "realityShift",
    text: "När jag försöker reda ut motsägelser blir situationen ibland mer förvirrande istället för tydligare.",
  },

  // FÖRLUST AV TILLIT TILL EGET OMDÖME
  {
    area: "selfDoubt",
    text: "Jag har börjat tvivla mer på mitt eget minne sedan jag varit i relationen.",
  },
  {
    area: "selfDoubt",
    text: "Jag kontrollerar ibland med andra personer om min tolkning av en situation verkligen är rimlig.",
  },
  {
    area: "selfDoubt",
    text: "Jag känner mig ibland osäker på vad som faktiskt hänt efter en konflikt med min partner.",
  },
  {
    area: "selfDoubt",
    text: "Jag har blivit mindre säker på mitt eget omdöme i frågor som rör relationen.",
  },
  {
    area: "selfDoubt",
    text: "Jag kan ibland tänka att jag kanske överdriver eller hittar på problem trots att något först kändes tydligt fel.",
  },
];

const answerLabels = [
  "Aldrig",
  "Sällan",
  "Ibland",
  "Ofta",
  "Mycket ofta",
];

const areaLabels: Record<Area, string> = {
  denial: "Förnekande av händelser",
  memory: "Ifrågasättande av minne & perception",
  minimization: "Förminskning av känslor & reaktioner",
  blame: "Skuldvändning",
  realityShift: "Motsägelser & verklighetsförskjutning",
  selfDoubt: "Förlust av tillit till eget omdöme",
};

const areaDescriptions: Record<Area, string> = {
  denial:
    "Visar hur ofta sådant du upplevt, hört eller kommit överens om senare förnekas eller avfärdas.",
  memory:
    "Visar i vilken grad din förmåga att minnas och tolka situationer återkommande ifrågasätts.",
  minimization:
    "Visar om fokus ofta flyttas från det som hänt till att dina känslor eller reaktioner framställs som problemet.",
  blame:
    "Visar hur ofta ansvar för partnerns beteende eller konflikter flyttas över på dig.",
  realityShift:
    "Visar om versioner, förklaringar eller regler förändras på sätt som gör situationer svårare att förstå och hålla fast vid.",
  selfDoubt:
    "Visar hur mycket relationen verkar ha påverkat tilliten till ditt eget minne, omdöme och din tolkning av vad som händer.",
};

const LS_KEY = "gaslightingtest_state_v1";

/*
  STRIPE:
  Ersätt endast REPLACE_WITH_STRIPE_LINK nedan
  när Stripe Payment Link är skapad.
*/
const CHECKOUT_URL: string = "https://buy.stripe.com/28E28q7WVaUxc8L2Aw0gw0a";

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
  if (score >= 75) return "Omfattande gaslightingmönster";
  if (score >= 50) return "Många tydliga gaslightingmönster";
  if (score >= 25) return "Vissa gaslightingmönster";
  return "Få tecken på gaslighting";
}

function overallDescription(score: number) {
  if (score >= 75) {
    return "Dina svar visar ett omfattande återkommande mönster där händelser, minnen, känslor eller ansvar ofta verkar omtolkas på ett sätt som kan undergräva tilliten till din egen upplevelse och ditt eget omdöme.";
  }

  if (score >= 50) {
    return "Dina svar visar många tydliga mönster som är förenliga med gaslighting i en nära relation. Det verkar återkommande finnas situationer där din upplevelse, ditt minne eller dina reaktioner ifrågasätts eller omtolkas.";
  }

  if (score >= 25) {
    return "Dina svar visar vissa mönster som kan förekomma vid gaslighting. Enstaka meningsskiljaktigheter eller olika minnesbilder är normala, så det viktiga är om beteendena återkommer och gradvis påverkar tilliten till din egen upplevelse.";
  }

  return "Dina svar visar relativt få av de återkommande mönster som testet undersöker. Att två personer ibland minns eller tolkar en situation olika är i sig inte gaslighting.";
}

function areaGuidance(area: Area, score: number) {
  const elevated = score >= 50;

  const guidance: Record<Area, string> = {
    denial: elevated
      ? "Dina svar tyder på att saker du upplevt eller hört relativt ofta förnekas i efterhand. Lägg särskilt märke till om detta sker som ett återkommande mönster snarare än som enstaka genuina minnesskillnader."
      : "Dina svar visar relativt få återkommande situationer där tydliga händelser eller uttalanden förnekas i efterhand.",

    memory: elevated
      ? "Din förmåga att minnas och tolka situationer verkar ofta ifrågasättas. Det kan bli särskilt problematiskt om partnerns version systematiskt behandlas som mer trovärdig än din utan sakliga skäl."
      : "Dina svar tyder inte på att ditt minne eller din verklighetsuppfattning regelbundet undergrävs i relationen.",

    minimization: elevated
      ? "När du reagerar på något verkar fokus ofta flyttas från det som hände till att din reaktion är för stark, känslig eller orimlig. Det kan göra det svårare att diskutera själva beteendet som utlöste reaktionen."
      : "Dina känslor och reaktioner verkar relativt sällan användas för att avfärda själva problemet du försöker ta upp.",

    blame: elevated
      ? "Konflikter verkar ofta vändas så att du själv hamnar i försvarsposition. Observera om ansvar för partnerns egna val återkommande flyttas över på dig."
      : "Dina svar visar relativt få tecken på ett återkommande mönster där partnerns ansvar flyttas över på dig.",

    realityShift: elevated
      ? "Du verkar ofta möta förändrade versioner, motsägelser eller nya förklaringar som gör det svårt att hålla fast vid vad som ursprungligen hände. Återkommande förvirring efter samtal kan vara viktig att uppmärksamma."
      : "Dina svar visar relativt få återkommande situationer där verklighetsbilden förändras eller blir mer förvirrande under samtal.",

    selfDoubt: elevated
      ? "Relationen verkar ha påverkat tilliten till ditt eget minne eller omdöme. Att börja behöva kontrollera sin verklighetsuppfattning med andra eller systematiskt tvivla på sig själv är en viktig signal att ta på allvar."
      : "Dina svar tyder på att du i relativt hög grad behåller tilliten till ditt eget minne, omdöme och din upplevelse av relationen.",
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
  const tracking = useTestAnalytics("gaslighting_test", questions.length);
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

    const overall = Math.round(
      (answers.reduce(
        (sum, answer) => sum + (answer >= 0 ? answer : 0),
        0
      ) /
        (totalQuestions * 4)) *
        100
    );

    return {
      areas,
      overall,
    };
  }, [answers, totalQuestions]);

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
    if (
      !CHECKOUT_URL ||
      CHECKOUT_URL === "REPLACE_WITH_STRIPE_LINK"
    ) {
      alert("Stripe-länken för gaslightingtestet är inte inkopplad ännu.");
      return;
    }

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
            Hur ofta känner du igen detta?
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
            {scores.overall}/100
          </div>

          <div
            style={{
              marginTop: 5,
              fontSize: 13,
              color: "#aaa",
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
              Förstå vad som ligger bakom resultatet
            </h3>

            <p
              style={{
                margin: "10px 0 0",
                lineHeight: 1.65,
                color: "#ddd",
              }}
            >
              Den fullständiga analysen visar samtliga sex områden och
              hjälper dig förstå skillnaden mellan vanliga konflikter och
              återkommande mönster som kan undergräva tilliten till ditt
              eget minne och omdöme.
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
            <Link
              href="/psykisk-misshandel-relation/test"
              style={linkCardStyle}
            >
              Gör testet om psykisk misshandel och psykiskt våld →
            </Link>

            <Link
              href="/narcissist-i-en-relation/test"
              style={linkCardStyle}
            >
              Testa narcissistiska relationsmönster →
            </Link>

            <Link href="/medberoendetest/test" style={linkCardStyle}>
              Gör medberoendetestet →
            </Link>

            <Link
              href="/traumabindning-i-relation"
              style={linkCardStyle}
            >
              Läs om traumabindning →
            </Link>

            <Link href="/psykiskt-vald/hjalp" style={linkCardStyle}>
              Se vart du kan vända dig för hjälp →
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