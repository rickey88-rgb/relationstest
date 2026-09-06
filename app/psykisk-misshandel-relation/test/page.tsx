"use client";

import { useEffect, useMemo, useState } from "react";

type Area =
  | "accusations"
  | "degrading"
  | "humiliation"
  | "threats"
  | "coercion"
  | "surveillance"
  | "pattern"
  | "impact";

type Question = {
  id: number;
  area: Area;
  text: string;
};

type AreaInfo = {
  label: string;
  short: string;
  legal: boolean;
  explanation: string;
};

const LS_KEY = "psykiskt_vald_test_state_v1";

/*
  BYT DENNA SENARE till Payment Link för 79 kr.

  I Stripe ska success redirect så småningom peka på:
  https://relationsvarning.se/psykisk-misshandel-relation/test?paid=true
*/
const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/00w9ASa53bYB8Wz0so0gw06";

const answerLabels = [
  "Aldrig",
  "Sällan",
  "Ibland",
  "Ofta",
  "Mycket ofta",
];

const areaInfo: Record<Area, AreaInfo> = {
  accusations: {
    label: "Beskyllningar & skuldbeläggning",
    short: "beskyllningar",
    legal: true,
    explanation:
      "Återkommande beskyllningar kan användas för att sätta dig i försvarsställning och förskjuta ansvar. Beskyllning är uttryckligen en av de former av kränkningar som nämns i bestämmelsen om psykiskt våld.",
  },

  degrading: {
    label: "Nedsättande uttalanden",
    short: "nedvärdering",
    legal: true,
    explanation:
      "Nedsättande uttalanden kan gradvis påverka självbild och självkänsla. Det kan handla om återkommande kommentarer om exempelvis intelligens, värde, utseende, kompetens eller personlighet.",
  },

  humiliation: {
    label: "Förödmjukande beteende",
    short: "förödmjukelse",
    legal: true,
    explanation:
      "Förödmjukande beteende kan ske både privat och inför andra. Det viktiga är inte bara en enstaka händelse utan om beteendet bildar ett återkommande mönster som bryter ner eller förminskar.",
  },

  threats: {
    label: "Hot & skrämsel",
    short: "hot och skrämsel",
    legal: true,
    explanation:
      "Otillbörliga hot är en av de beteendeformer som anges i lagen. Hot behöver inte alltid uttryckas som ett direkt hot om fysiskt våld för att påverka hur någon vågar agera.",
  },

  coercion: {
    label: "Tvång & kontroll",
    short: "tvång och kontroll",
    legal: true,
    explanation:
      "Otillbörligt tvång handlar om att pressa någon att göra, tåla eller avstå från något på ett sätt som begränsar personens faktiska handlingsutrymme.",
  },

  surveillance: {
    label: "Övervakning & digital kontroll",
    short: "övervakning",
    legal: true,
    explanation:
      "Otillbörlig övervakning omfattas uttryckligen av bestämmelsen. Lagen innehåller dessutom en särskild reglering om varaktig otillbörlig övervakning.",
  },

  pattern: {
    label: "Upprepning & varaktighet",
    short: "upprepning",
    legal: false,
    explanation:
      "Lagens konstruktion är inriktad på upprepade kränkningar. Därför är frekvens, varaktighet och om olika beteenden bildar ett sammanhängande mönster centrala delar av orienteringen.",
  },

  impact: {
    label: "Påverkan på självkänsla & frihet",
    short: "påverkan på dig",
    legal: false,
    explanation:
      "Bestämmelsen kräver att kränkningarna sammantaget varit ägnade att allvarligt skada personens självkänsla. Din faktiska upplevelse avgör inte ensam den juridiska frågan, men påverkan är viktig för att förstå relationens konsekvenser.",
  },
};

const weights: Record<Area, number> = {
  accusations: 1.0,
  degrading: 1.0,
  humiliation: 1.05,
  threats: 1.15,
  coercion: 1.1,
  surveillance: 1.1,
  pattern: 1.2,
  impact: 1.15,
};

/*
  30 frågor.

  1–3   Beskyllningar
  4–7   Nedsättande uttalanden
  8–10  Förödmjukande beteende
  11–14 Hot
  15–18 Tvång
  19–22 Övervakning
  23–25 Upprepning/varaktighet
  26–30 Påverkan på självkänsla/frihet
*/
const questions: Question[] = [
  // Beskyllningar
  {
    id: 1,
    area: "accusations",
    text: "Blir du återkommande beskylld för saker du inte tycker att du har gjort?",
  },
  {
    id: 2,
    area: "accusations",
    text: "Får du ofta skulden för konflikter eller problem, även när ansvaret egentligen är gemensamt?",
  },
  {
    id: 3,
    area: "accusations",
    text: "Behöver du ofta försvara dig mot misstankar, anklagelser eller påståenden om dina avsikter?",
  },

  // Nedsättande uttalanden
  {
    id: 4,
    area: "degrading",
    text: "Blir du kallad dum, värdelös, känslig, galen eller andra saker som förminskar dig?",
  },
  {
    id: 5,
    area: "degrading",
    text: "Kommenterar personen återkommande ditt utseende, din intelligens eller din förmåga på ett nedvärderande sätt?",
  },
  {
    id: 6,
    area: "degrading",
    text: "Får du höra att ingen annan skulle stå ut med dig eller vilja vara med dig?",
  },
  {
    id: 7,
    area: "degrading",
    text: "Avfärdas dina känslor genom kommentarer som att du överdriver, är för känslig eller inte klarar någonting?",
  },

  // Förödmjukande beteende
  {
    id: 8,
    area: "humiliation",
    text: "Har personen gjort sig lustig över dig eller förödmjukat dig inför andra?",
  },
  {
    id: 9,
    area: "humiliation",
    text: "Används sådant som personen vet att du skäms över eller är sårbar för för att trycka ner dig?",
  },
  {
    id: 10,
    area: "humiliation",
    text: "Har personen medvetet fått dig att känna dig liten, löjlig eller ovärdig under konflikter?",
  },

  // Hot
  {
    id: 11,
    area: "threats",
    text: "Har personen hotat med konsekvenser om du inte gör som hen vill?",
  },
  {
    id: 12,
    area: "threats",
    text: "Har personen hotat att skada dig, sig själv, någon annan eller något du bryr dig om för att påverka dig?",
  },
  {
    id: 13,
    area: "threats",
    text: "Har personen hotat att förstöra ditt rykte, avslöja privata saker eller skapa problem för dig?",
  },
  {
    id: 14,
    area: "threats",
    text: "Anpassar du ibland vad du säger eller gör eftersom du är rädd för personens reaktion?",
  },

  // Tvång
  {
    id: 15,
    area: "coercion",
    text: "Pressas du att göra saker du egentligen inte vill göra för att undvika konflikt eller konsekvenser?",
  },
  {
    id: 16,
    area: "coercion",
    text: "Försöker personen bestämma vilka du får träffa, prata med eller ha kontakt med?",
  },
  {
    id: 17,
    area: "coercion",
    text: "Försöker personen styra dina pengar, ditt arbete, dina studier, kläder eller andra personliga val?",
  },
  {
    id: 18,
    area: "coercion",
    text: "Känner du att ett nej från dig ofta leder till så mycket press, skuld eller konflikt att du till slut ger efter?",
  },

  // Övervakning
  {
    id: 19,
    area: "surveillance",
    text: "Kontrollerar personen din mobil, dina meddelanden eller dina sociala medier utan att du egentligen vill det?",
  },
  {
    id: 20,
    area: "surveillance",
    text: "Kräver personen att få veta exakt var du är, vem du är med eller vad du gör?",
  },
  {
    id: 21,
    area: "surveillance",
    text: "Känner du dig tvungen att dela lösenord, platsinformation eller annan privat information för att undvika misstankar eller konflikt?",
  },
  {
    id: 22,
    area: "surveillance",
    text: "Har personen använt teknik, appar, konton eller andra människor för att hålla koll på dig?",
  },

  // Upprepning
  {
    id: 23,
    area: "pattern",
    text: "Har flera av de här beteendena återkommit under en längre period snarare än bara vid en enstaka konflikt?",
  },
  {
    id: 24,
    area: "pattern",
    text: "Kommer samma typer av kränkningar eller kontrollerande beteenden tillbaka även efter ursäkter eller löften om förändring?",
  },
  {
    id: 25,
    area: "pattern",
    text: "Upplever du att olika beteenden tillsammans bildar ett återkommande mönster där personen får mer kontroll och du får mindre utrymme?",
  },

  // Påverkan
  {
    id: 26,
    area: "impact",
    text: "Har du börjat tvivla mer på ditt eget omdöme eller din egen verklighetsuppfattning?",
  },
  {
    id: 27,
    area: "impact",
    text: "Har din självkänsla blivit sämre under relationen?",
  },
  {
    id: 28,
    area: "impact",
    text: "Känner du att du måste väga dina ord eller gå på äggskal för att hålla situationen lugn?",
  },
  {
    id: 29,
    area: "impact",
    text: "Har du blivit mindre fri att uttrycka behov, åsikter eller fatta egna beslut?",
  },
  {
    id: 30,
    area: "impact",
    text: "Känner du dig mindre som dig själv än du gjorde tidigare i relationen?",
  },
];

const areaOrder: Area[] = [
  "accusations",
  "degrading",
  "humiliation",
  "threats",
  "coercion",
  "surveillance",
  "pattern",
  "impact",
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function percentFromArea(
  area: Area,
  answers: number[]
) {
  const indexes = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => q.area === area)
    .map(({ i }) => i);

  if (indexes.length === 0) return 0;

  const sum = indexes.reduce((acc, i) => {
    const answer = answers[i];
    return acc + (answer >= 0 ? answer : 0);
  }, 0);

  return Math.round((sum / (indexes.length * 4)) * 100);
}

function areaLevel(percent: number) {
  if (percent >= 75) return "Mycket tydligt";
  if (percent >= 50) return "Tydligt";
  if (percent >= 25) return "Vissa tecken";
  return "Få tecken";
}

function overallLevel(score: number) {
  if (score >= 75) {
    return {
      label: "Omfattande mönster",
      intro:
        "Dina svar visar ett omfattande återkommande mönster av psykiskt destruktiva beteenden.",
    };
  }

  if (score >= 55) {
    return {
      label: "Många tydliga mönster",
      intro:
        "Dina svar visar flera tydliga och återkommande mönster som bör tas på allvar.",
    };
  }

  if (score >= 30) {
    return {
      label: "Vissa tydliga mönster",
      intro:
        "Dina svar visar flera beteenden som kan vara viktiga att titta närmare på.",
    };
  }

  return {
    label: "Få tydliga mönster",
    intro:
      "Dina svar visar relativt få tydliga mönster totalt, även om enskilda områden fortfarande kan vara viktiga.",
  };
}

function legalOverlapText(
  legalAreasHigh: number,
  patternPercent: number,
  impactPercent: number
) {
  if (
    legalAreasHigh >= 4 &&
    patternPercent >= 50 &&
    impactPercent >= 50
  ) {
    return "Dina svar visar flera återkommande beteendetyper som överlappar med de kategorier som anges i bestämmelsen om psykiskt våld. Upprepningen och påverkan på dig framträder också tydligt.";
  }

  if (legalAreasHigh >= 2 && patternPercent >= 40) {
    return "Dina svar visar flera beteenden som överlappar med kategorier som nämns i bestämmelsen om psykiskt våld, och det finns tecken på ett återkommande mönster.";
  }

  if (legalAreasHigh >= 1) {
    return "Några av dina svar berör beteenden som också förekommer i lagens beskrivning av psykiskt våld. Det räcker inte i sig för att avgöra om den juridiska bestämmelsen är uppfylld.";
  }

  return "Dina svar visar få tydliga träffar inom de beteendekategorier som den nya bestämmelsen särskilt tar sikte på.";
}

function practicalGuidance(
  overallScore: number,
  threatPercent: number,
  coercionPercent: number,
  surveillancePercent: number
) {
  const urgent =
    threatPercent >= 75 ||
    coercionPercent >= 75 ||
    surveillancePercent >= 75;

  if (urgent) {
    return {
      heading: "Det finns områden som bör tas särskilt på allvar",
      text:
        "Dina svar visar en hög nivå inom minst ett område som rör hot, tvång eller övervakning. Prioritera din trygghet och undvik att utsätta dig för onödig risk för att testa eller konfrontera personen.",
    };
  }

  if (overallScore >= 55) {
    return {
      heading: "Mönstret är tydligt nog att följa upp",
      text:
        "När flera beteenden återkommer samtidigt är det ofta mer informativt att titta på helheten än att försöka avgöra om varje enskild händelse var tillräckligt allvarlig.",
    };
  }

  return {
    heading: "Följ mönstret över tid",
    text:
      "Även när totalnivån inte är hög kan ett specifikt område vara viktigt. Lägg särskilt märke till om beteenden upprepas, eskalerar eller gör att du begränsar dig själv.",
  };
}

export default function Page() {
  const totalQuestions = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(totalQuestions).fill(-1)
  );
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);

      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        index?: number;
        answers?: number[];
        unlocked?: boolean;
      };

      if (
        Array.isArray(parsed.answers) &&
        parsed.answers.length === totalQuestions
      ) {
        setAnswers(parsed.answers);
      }

      if (typeof parsed.index === "number") {
        setIndex(
          clamp(parsed.index, 0, totalQuestions - 1)
        );
      }

      if (parsed.unlocked === true) {
        setUnlocked(true);
      }
    } catch {
      // ignore
    }
  }, [totalQuestions]);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    if (params.get("paid") === "true") {
      setUnlocked(true);

      try {
        const raw = localStorage.getItem(LS_KEY);
        const existing = raw ? JSON.parse(raw) : {};

        localStorage.setItem(
          LS_KEY,
          JSON.stringify({
            ...existing,
            unlocked: true,
          })
        );
      } catch {
        // ignore
      }

      window.history.replaceState(
        {},
        "",
        window.location.pathname
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          index,
          answers,
          unlocked,
        })
      );
    } catch {
      // ignore
    }
  }, [index, answers, unlocked]);

  const current = questions[index];

  const answeredCount = useMemo(
    () => answers.filter((a) => a >= 0).length,
    [answers]
  );

  const progress = Math.round(
    (answeredCount / totalQuestions) * 100
  );

  const isFinished = useMemo(
    () => answers.every((a) => a >= 0),
    [answers]
  );

  const areaScores = useMemo(() => {
    const result = {} as Record<Area, number>;

    areaOrder.forEach((area) => {
      result[area] = percentFromArea(
        area,
        answers
      );
    });

    return result;
  }, [answers]);

  const overallScore = useMemo(() => {
    let weightedTotal = 0;
    let totalWeight = 0;

    areaOrder.forEach((area) => {
      weightedTotal +=
        areaScores[area] * weights[area];

      totalWeight += weights[area];
    });

    return Math.round(
      weightedTotal / totalWeight
    );
  }, [areaScores]);

  const overall = useMemo(
    () => overallLevel(overallScore),
    [overallScore]
  );

  const sortedAreas = useMemo(() => {
    return areaOrder
      .map((area) => ({
        area,
        score: areaScores[area],
      }))
      .sort((a, b) => b.score - a.score);
  }, [areaScores]);

  const topAreas = sortedAreas.slice(0, 3);

  const legalAreasHigh = useMemo(() => {
    return areaOrder.filter(
      (area) =>
        areaInfo[area].legal &&
        areaScores[area] >= 50
    ).length;
  }, [areaScores]);

  const legalOverlap = useMemo(
    () =>
      legalOverlapText(
        legalAreasHigh,
        areaScores.pattern,
        areaScores.impact
      ),
    [
      legalAreasHigh,
      areaScores.pattern,
      areaScores.impact,
    ]
  );

  const guidance = useMemo(
    () =>
      practicalGuidance(
        overallScore,
        areaScores.threats,
        areaScores.coercion,
        areaScores.surveillance
      ),
    [
      overallScore,
      areaScores.threats,
      areaScores.coercion,
      areaScores.surveillance,
    ]
  );

  function pickAnswer(value: number) {
    const next = [...answers];

    next[index] = value;

    setAnswers(next);

    if (index < totalQuestions - 1) {
      setTimeout(() => {
        setIndex((currentIndex) =>
          Math.min(
            currentIndex + 1,
            totalQuestions - 1
          )
        );
      }, 220);
    }
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function restart() {
    setIndex(0);

    setAnswers(
      Array(totalQuestions).fill(-1)
    );

    setUnlocked(false);

    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function startPayment() {
    if (
      STRIPE_PAYMENT_LINK.includes(
        "REPLACE_ME"
      )
    ) {
      alert(
        "Stripe-länken för det nya testet är inte inkopplad ännu."
      );
      return;
    }

    window.location.href =
      STRIPE_PAYMENT_LINK;
  }

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: 24,
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Arial",
        color: "#111",
      }}
    >
      <nav aria-label="Vidare läsning och stöd" style={{ marginBottom: 20, fontSize: 13, lineHeight: 1.7 }}>
        <a href="/psykisk-misshandel-relation" style={{ textDecoration: "underline" }}>
          Till guiden om psykisk misshandel i relation
        </a>
        <p style={{ margin: "6px 0 0" }}>
          Behöver du stöd?{" "}
          <a href="/psykiskt-vald/hjalp" style={{ textDecoration: "underline" }}>
            Hjälp vid psykiskt våld
          </a>
        </p>
      </nav>

      <header
        style={{
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            opacity: 0.55,
          }}
        >
          Psykisk misshandel & psykiskt våld
        </p>

        <h1
          style={{
            margin: "8px 0 0",
            fontSize: 30,
            lineHeight: 1.15,
            fontWeight: 900,
          }}
        >
          Besvara 30 frågor om din relation
        </h1>

        <p
          style={{
            marginTop: 12,
            opacity: 0.78,
            lineHeight: 1.55,
          }}
        >
          Svara utifrån hur personen brukar
          bete sig över tid – inte bara utifrån
          er senaste konflikt.
        </p>

        {!isFinished && (
          <div
            style={{
              marginTop: 20,
              textAlign: "left",
            }}
          >
            <div
              style={{
                height: 10,
                background: "#eee",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "#111",
                  borderRadius: 999,
                  transition:
                    "width 200ms ease",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent:
                  "space-between",
                fontSize: 13,
                opacity: 0.7,
              }}
            >
              <span>{progress}% klart</span>

              <span>
                Fråga {index + 1} av{" "}
                {totalQuestions}
              </span>
            </div>
          </div>
        )}
      </header>

      {!isFinished && (
        <section
          style={{
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: 16,
            padding: 20,
            boxShadow:
              "0 6px 24px rgba(0,0,0,0.035)",
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              opacity: 0.58,
              fontWeight: 700,
              marginTop: 0,
            }}
          >
            Hur ofta stämmer detta?
          </p>

          <p
            style={{
              fontSize: 22,
              lineHeight: 1.4,
              margin:
                "14px auto 22px",
              textAlign: "center",
              fontWeight: 750,
              maxWidth: 620,
            }}
          >
            {current.text}
          </p>

          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            {[0, 1, 2, 3, 4].map(
              (value) => (
                <button
                  key={value}
                  onClick={() =>
                    pickAnswer(value)
                  }
                  style={{
                    textAlign: "left",
                    padding:
                      "13px 15px",
                    borderRadius: 12,
                    border:
                      answers[index] ===
                      value
                        ? "1px solid #999"
                        : "1px solid #ddd",
                    background:
                      answers[index] ===
                      value
                        ? "#ededed"
                        : "#fff",
                    color: "#111",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  {answerLabels[value]}
                </button>
              )
            )}
          </div>

          <div
            style={{
              marginTop: 18,
            }}
          >
            <button
              onClick={goPrev}
              disabled={index === 0}
              style={{
                padding: "10px 13px",
                borderRadius: 12,
                border:
                  "1px solid #ddd",
                background:
                  index === 0
                    ? "#f5f5f5"
                    : "#fff",
                color: "#111",
                cursor:
                  index === 0
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  index === 0 ? 0.5 : 1,
              }}
            >
              Tillbaka
            </button>
          </div>

          <p
            style={{
              margin:
                "18px 0 0",
              fontSize: 12,
              opacity: 0.62,
              textAlign: "center",
              lineHeight: 1.55,
            }}
          >
            Testet ställer ingen diagnos
            och avgör inte om ett brott har
            begåtts. Det hjälper dig att
            identifiera återkommande
            beteendemönster.
          </p>
        </section>
      )}

      {isFinished && !unlocked && (
        <section
          style={{
            background: "#0b0b0b",
            color: "#fff",
            borderRadius: 18,
            padding: 24,
          }}
        >
          <p
            style={{
              margin: 0,
              opacity: 0.65,
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: ".06em",
            }}
          >
            Din första sammanställning
          </p>

          <h2
            style={{
              margin:
                "7px 0 0",
              fontSize: 26,
            }}
          >
            Ditt resultat är klart
          </h2>

          <div
            style={{
              marginTop: 18,
              padding: 17,
              borderRadius: 15,
              background:
                "rgba(255,255,255,.07)",
              border:
                "1px solid rgba(255,255,255,.13)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                gap: 18,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.68,
                  }}
                >
                  Mönsterindex
                </div>

                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 900,
                  }}
                >
                  {overallScore}/100
                </div>
              </div>

              <div
                style={{
                  textAlign: "right",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    opacity: 0.68,
                  }}
                >
                  Övergripande nivå
                </div>

                <div
                  style={{
                    marginTop: 4,
                    fontSize: 19,
                    fontWeight: 850,
                  }}
                >
                  {overall.label}
                </div>
              </div>
            </div>

            <p
              style={{
                lineHeight: 1.65,
                marginBottom: 0,
              }}
            >
              {overall.intro}
            </p>
          </div>

          <div
            style={{
              marginTop: 18,
            }}
          >
            <p
              style={{
                marginBottom: 8,
                fontWeight: 800,
              }}
            >
              De tre områden som sticker ut
              mest:
            </p>

            {topAreas.map(
              ({ area, score }) => (
                <div
                  key={area}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: 14,
                    padding:
                      "10px 0",
                    borderBottom:
                      "1px solid rgba(255,255,255,.1)",
                  }}
                >
                  <span>
                    {
                      areaInfo[area]
                        .label
                    }
                  </span>

                  <b>
                    {areaLevel(score)}
                  </b>
                </div>
              )
            )}
          </div>

          <p
            style={{
              marginTop: 20,
              lineHeight: 1.65,
              opacity: 0.92,
            }}
          >
            {legalOverlap}
          </p>

          <div
            style={{
              marginTop: 22,
              paddingTop: 18,
              borderTop:
                "1px solid rgba(255,255,255,.13)",
            }}
          >
            <h3
              style={{
                margin:
                  "0 0 8px",
              }}
            >
              Din fullständiga analys innehåller
            </h3>

            <ul
              style={{
                lineHeight: 1.85,
                paddingLeft: 22,
                opacity: 0.92,
              }}
            >
              <li>
                Analys av samtliga 8
                områden
              </li>
              <li>
                Vilka mönster som är
                starkast i just dina svar
              </li>
              <li>
                Hur beteendena förhåller
                sig till lagen om psykiskt
                våld
              </li>
              <li>
                Bedömning av upprepning
                och varaktighet
              </li>
              <li>
                Analys av hur relationen
                påverkar din självkänsla
                och frihet
              </li>
              <li>
                Konkreta nästa steg och
                dokumentation
              </li>
            </ul>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 22,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={startPayment}
              style={{
                padding:
                  "13px 17px",
                borderRadius: 12,
                border: 0,
                background: "#fff",
                color: "#111",
                cursor: "pointer",
                fontWeight: 850,
                fontSize: 15,
              }}
            >
              Lås upp hela analysen – 79 kr
            </button>

            <button
              onClick={restart}
              style={{
                padding:
                  "13px 17px",
                borderRadius: 12,
                border:
                  "1px solid #444",
                background:
                  "transparent",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Gör om testet
            </button>
          </div>

          <p
            style={{
              margin:
                "18px 0 0",
              fontSize: 12,
              lineHeight: 1.55,
              opacity: 0.6,
            }}
          >
            Testet är ett orienteringsverktyg
            och utgör inte juridisk rådgivning
            eller ett besked om att ett brott
            har begåtts.
          </p>
        </section>
      )}

      {isFinished && unlocked && (
        <section>
          <div
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
                  <div
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

                    <div
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
                      <div
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

          <div
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

          <div
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

          <div
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
            <button
              onClick={restart}
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
            </button>
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
        </section>
      )}

      <nav aria-label="Fördjupning om psykiskt våld" style={{ marginTop: 28, fontSize: 13, lineHeight: 1.7 }}>
        Läs vidare om{" "}
        <a href="/psykiskt-vald" style={{ textDecoration: "underline" }}>
          psykiskt våld
        </a>{" "}
        och{" "}
        <a href="/psykiskt-vald/bevis" style={{ textDecoration: "underline" }}>
          bevis och dokumentation
        </a>
        .
      </nav>

      <footer
        style={{
          marginTop: 42,
          paddingTop: 18,
          borderTop:
            "1px solid #eee",
          fontSize: 13,
          opacity: 0.75,
          textAlign: "center",
          lineHeight: 1.7,
        }}
      >
        <div>
          Kontakt:{" "}
          <a href="mailto:support@relationsvarning.se">
            support@relationsvarning.se
          </a>
        </div>

        <div
          style={{
            marginTop: 6,
          }}
        >
          <a href="/villkor">
            Villkor
          </a>{" "}
          ·{" "}
          <a href="/integritet">
            Integritet
          </a>
        </div>
      </footer>
    </main>
  );
}