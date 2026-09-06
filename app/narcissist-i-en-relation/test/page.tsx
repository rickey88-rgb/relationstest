"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Area =
  | "grandiosity"
  | "admiration"
  | "entitlement"
  | "empathy"
  | "exploitation"
  | "devaluation"
  | "criticism"
  | "impact";

type Question = {
  text: string;
  area: Area;
};

const questions: Question[] = [
  // GRANDIOSITET & ÖVERLÄGSENHET
  {
    area: "grandiosity",
    text:
      "Min partner framställer ofta sig själv som mer kompetent, intelligent eller insiktsfull än andra.",
  },
  {
    area: "grandiosity",
    text:
      "Min partner har svårt att acceptera att någon annan kan veta bättre eller ha mer rätt.",
  },
  {
    area: "grandiosity",
    text:
      "Min partner pratar nedlåtande om människor som hen tycker är mindre framgångsrika, smarta eller betydelsefulla.",
  },
  {
    area: "grandiosity",
    text:
      "Min partner överdriver sina prestationer, sin betydelse eller vad andra tycker om hen.",
  },

  // BEKRÄFTELSE & BEUNDRAN
  {
    area: "admiration",
    text:
      "Min partner verkar behöva mycket uppskattning, bekräftelse eller uppmärksamhet från andra.",
  },
  {
    area: "admiration",
    text:
      "Om min partner inte får den uppskattning hen förväntar sig förändras humöret tydligt.",
  },
  {
    area: "admiration",
    text:
      "Samtal om mina framgångar eller behov styrs ofta tillbaka till min partner.",
  },
  {
    area: "admiration",
    text:
      "Min partner verkar lägga stor vikt vid status, anseende eller hur relationen ser ut inför andra.",
  },

  // BERÄTTIGANDEKÄNSLA
  {
    area: "entitlement",
    text:
      "Min partner förväntar sig ofta att jag ska anpassa mig efter hens önskemål.",
  },
  {
    area: "entitlement",
    text:
      "Det verkar finnas olika regler för vad min partner får göra och vad jag får göra.",
  },
  {
    area: "entitlement",
    text:
      "Min partner reagerar negativt när jag inte prioriterar hens behov eller planer.",
  },
  {
    area: "entitlement",
    text:
      "Min partner beter sig ibland som om särskild hänsyn eller behandling är självklar.",
  },

  // EMPATI & ÖMSESIDIGHET
  {
    area: "empathy",
    text:
      "När jag berättar att jag blivit sårad har min partner svårt att stanna kvar i mitt perspektiv.",
  },
  {
    area: "empathy",
    text:
      "Mina känslor avfärdas, förminskas eller förklaras bort när de är obekväma för min partner.",
  },
  {
    area: "empathy",
    text:
      "Min partner verkar förstå mina känslor bättre när de inte kräver något av hen.",
  },
  {
    area: "empathy",
    text:
      "Jag upplever att relationen ofta saknar verklig ömsesidighet när mina och min partners behov krockar.",
  },

  // EXPLOATERING & MANIPULATION
  {
    area: "exploitation",
    text:
      "Min partner använder skuld för att få mig att göra sådant jag egentligen inte vill.",
  },
  {
    area: "exploitation",
    text:
      "Min partner använder sådant jag berättat i förtroende mot mig under konflikter.",
  },
  {
    area: "exploitation",
    text:
      "Min partner förvränger samtal eller händelser så att jag till slut får bära ansvaret för problemet.",
  },
  {
    area: "exploitation",
    text:
      "Jag känner ibland att min partners värme eller uppskattning beror på vad jag kan ge, göra eller bidra med.",
  },

  // IDEALISERING & NEDVÄRDERING
  {
    area: "devaluation",
    text:
      "Min partner kan växla mellan att lyfta mig väldigt högt och att behandla mig som om jag inte duger.",
  },
  {
    area: "devaluation",
    text:
      "Egenskaper som min partner tidigare uppskattade hos mig används senare som kritik mot mig.",
  },
  {
    area: "devaluation",
    text:
      "Efter konflikter kan min partner bli kall, nedlåtande eller dra tillbaka närhet på ett sätt som känns bestraffande.",
  },
  {
    area: "devaluation",
    text:
      "Jag får återkommande känslan av att jag måste förtjäna tillbaka min partners uppskattning.",
  },

  // KRITIKKÄNSLIGHET & REAKTIONER
  {
    area: "criticism",
    text:
      "När jag kritiserar min partner, även försiktigt, reagerar hen oproportionerligt starkt.",
  },
  {
    area: "criticism",
    text:
      "När jag tar upp något min partner gjort fel går samtalet ofta över till mina brister eller fel.",
  },
  {
    area: "criticism",
    text:
      "Min partner kan reagera med ilska, förakt, kyla eller offerposition när hen känner sig ifrågasatt.",
  },

  // PÅVERKAN PÅ DIG
  {
    area: "impact",
    text:
      "Jag tänker ofta igenom hur jag uttrycker mig för att undvika min partners reaktion.",
  },
  {
    area: "impact",
    text:
      "Jag tvivlar mer på mitt eget omdöme eller min egen betydelse sedan relationen började.",
  },
  {
    area: "impact",
    text:
      "Jag känner att relationen alltmer kretsar kring min partners behov, humör eller självbild.",
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
  grandiosity: "Grandiositet & överlägsenhet",
  admiration: "Behov av bekräftelse",
  entitlement: "Berättigandekänsla",
  empathy: "Empati & ömsesidighet",
  exploitation: "Exploatering & manipulation",
  devaluation: "Idealisering & nedvärdering",
  criticism: "Reaktion på kritik",
  impact: "Påverkan på dig",
};

const areaDescriptions: Record<Area, string> = {
  grandiosity:
    "Handlar om överlägsenhet, behov av att ha rätt och tendensen att värdera människor hierarkiskt.",
  admiration:
    "Handlar om hur mycket självkänslan verkar bero på uppmärksamhet, uppskattning, status och bekräftelse.",
  entitlement:
    "Handlar om förväntningar på särbehandling, eftergifter och olika regler för olika personer.",
  empathy:
    "Handlar om förmågan att ta in dina känslor och behov även när de är obekväma eller konkurrerar med de egna.",
  exploitation:
    "Handlar om skuld, ansvarsförskjutning och om relationen används för att få kontroll, resurser eller bekräftelse.",
  devaluation:
    "Handlar om skiften mellan stark uppskattning och nedvärdering, kyla, kritik eller villkorad närhet.",
  criticism:
    "Handlar om hur personen reagerar när självkänslan utmanas genom kritik, gränser eller ifrågasättande.",
  impact:
    "Handlar om vad relationens mönster gör med din frihet, självkänsla, trygghet och tillit till ditt eget omdöme.",
};

const weights: Record<Area, number> = {
  grandiosity: 0.95,
  admiration: 0.9,
  entitlement: 1.05,
  empathy: 1.1,
  exploitation: 1.15,
  devaluation: 1.05,
  criticism: 1.1,
  impact: 1.2,
};

const LS_KEY = "narcissist_relation_test_state_v1";

// Vi kopplar in en separat Stripe Payment Link i nästa steg.
// Lägg INTE psykiskt-våld-testets betalningslänk här.
const CHECKOUT_URL = "https://buy.stripe.com/dRm6oGfpn7Ila0Dcb60gw07";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function overallLevel(score: number) {
  if (score >= 75) return "Omfattande narcissistiska relationsmönster";
  if (score >= 55) return "Många tydliga narcissistiska relationsmönster";
  if (score >= 30) return "Vissa tydliga narcissistiska relationsmönster";
  return "Få tydliga narcissistiska relationsmönster";
}

function areaLevel(score: number) {
  if (score >= 75) return "Mycket tydligt";
  if (score >= 50) return "Tydligt";
  if (score >= 25) return "Vissa tecken";
  return "Få tecken";
}

function overallExplanation(score: number) {
  if (score >= 75) {
    return (
      "Dina svar visar ett omfattande mönster över flera områden som ofta förknippas " +
      "med narcissistisk problematik i nära relationer. Resultatet säger inte att din " +
      "partner har narcissistiskt personlighetssyndrom, men mönstret är tillräckligt " +
      "tydligt för att relationens påverkan på dig bör tas på allvar."
    );
  }

  if (score >= 55) {
    return (
      "Dina svar visar flera tydliga och återkommande narcissistiska relationsmönster. " +
      "Det viktiga är mindre vilken etikett personen har och mer hur beteendena påverkar " +
      "ömsesidighet, trygghet och din möjlighet att vara dig själv i relationen."
    );
  }

  if (score >= 30) {
    return (
      "Dina svar visar vissa tydliga narcissistiska relationsmönster, men bilden är blandad. " +
      "Det kan vara värdefullt att titta på vilka områden som sticker ut och om beteendena " +
      "är återkommande, ökar över tid eller förändras när du sätter gränser."
    );
  }

  return (
    "Dina svar visar få tydliga narcissistiska relationsmönster sammantaget. " +
    "Det utesluter inte problem i relationen. Ett enskilt beteende kan fortfarande vara " +
    "viktigt, särskilt om du känner dig rädd, kontrollerad, nedvärderad eller otrygg."
  );
}

function guidanceForArea(area: Area, score: number) {
  const strong = score >= 50;

  const guides: Record<Area, string> = {
    grandiosity: strong
      ? "Det finns ett tydligt mönster där din partners självbild och behov av överläge får stort utrymme. Lägg särskilt märke till om oenighet kan existera utan att du förminskas."
      : "Det här området sticker inte ut särskilt starkt i dina svar.",
    admiration: strong
      ? "Din partners behov av uppskattning eller bekräftelse verkar påverka relationen tydligt. Observera vad som händer när uppmärksamheten ligger på dig eller när bekräftelsen uteblir."
      : "Dina svar visar inte något starkt mönster av extremt bekräftelsebehov.",
    entitlement: strong
      ? "Dina svar tyder på en obalans i vilka rättigheter och behov som får väga tyngst. En viktig fråga är om dina gränser respekteras även när din partner inte gillar dem."
      : "Det finns inte någon stark samlad signal om berättigandekänsla i dina svar.",
    empathy: strong
      ? "Ömsesidigheten verkar vara ett tydligt problem. Lägg märke till om dina känslor får vara giltiga utan att du först måste försvara eller bevisa dem."
      : "Dina svar visar inte någon stark generell brist på ömsesidighet eller empatiskt bemötande.",
    exploitation: strong
      ? "Det finns tydliga tecken på att skuld, ansvarsförskjutning eller manipulation används i relationen. Försök hålla fast vid konkreta händelser när samtal börjar flytta fokus från beteendet till dig som person."
      : "Exploatering och manipulation framträder inte som ett starkt samlat område.",
    devaluation: strong
      ? "Skiften mellan uppskattning och nedvärdering verkar vara framträdande. Sådana skiften kan skapa stark osäkerhet eftersom man börjar jaga tillbaka den positiva fasen."
      : "Dina svar visar inte något starkt mönster av idealisering följt av nedvärdering.",
    criticism: strong
      ? "Din partner verkar reagera starkt när självbilden utmanas. Observera särskilt om vanliga samtal om ansvar snabbt leder till motattack, kyla, förakt eller offerposition."
      : "Kritik och ifrågasättande verkar inte regelmässigt utlösa starka reaktioner enligt dina svar.",
    impact: strong
      ? "Relationen verkar påverka din självkänsla eller handlingsfrihet tydligt. Det här området väger tungt eftersom effekten på dig är viktig oavsett vilken diagnos eller etikett som eventuellt passar den andra personen."
      : "Dina svar visar relativt begränsad samlad påverkan på din egen självkänsla och frihet.",
  };

  return guides[area];
}

export default function Page() {
  const totalQuestions = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(totalQuestions).fill(-1)
  );
  const [unlocked, setUnlocked] = useState(false);
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
      // Ignorera trasig localStorage-data.
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
      // Testet ska fungera även om localStorage är blockerat.
    }
  }, [index, answers, hydrated]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("paid") === "true") {
      setUnlocked(true);
      window.history.replaceState({}, "", window.location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const current = questions[index];

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

    questions.forEach((question, i) => {
      const answer = answers[i];

      maximum[question.area] += 4;

      if (answer >= 0) {
        raw[question.area] += answer;
      }
    });

    const percentages = {} as Record<Area, number>;

    (Object.keys(raw) as Area[]).forEach((area) => {
      percentages[area] =
        maximum[area] > 0
          ? Math.round((raw[area] / maximum[area]) * 100)
          : 0;
    });

    let weightedTotal = 0;
    let totalWeight = 0;

    (Object.keys(percentages) as Area[]).forEach((area) => {
      weightedTotal += percentages[area] * weights[area];
      totalWeight += weights[area];
    });

    const overall =
      totalWeight > 0 ? Math.round(weightedTotal / totalWeight) : 0;

    return {
      raw,
      percentages,
      overall,
    };
  }, [answers]);

  const sortedAreas = useMemo(() => {
    return (Object.keys(scores.percentages) as Area[])
      .map((area) => ({
        area,
        score: scores.percentages[area],
      }))
      .sort((a, b) => b.score - a.score);
  }, [scores.percentages]);

  const strongestAreas = sortedAreas.slice(0, 3);

  function pickAnswer(value: number) {
    setAnswers((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });

    if (index < totalQuestions - 1) {
      setIndex((currentIndex) => currentIndex + 1);
    }
  }

  function goPrev() {
    setIndex((currentIndex) => Math.max(0, currentIndex - 1));
  }

  function restart() {
    const reset = Array(totalQuestions).fill(-1);

    setAnswers(reset);
    setIndex(0);
    setUnlocked(false);

    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToCheckout() {
    if (!CHECKOUT_URL) {
      alert(
        "Betalningen för narcissisttestet kopplas in i nästa steg. Testresultatet är färdigt och kan testas lokalt."
      );
      return;
    }

    window.location.href = CHECKOUT_URL;
  }

  if (!hydrated) {
    return (
      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "24px 16px 60px",
        }}
      >
        <p>Laddar testet...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "22px 16px 64px",
        color: "#111",
      }}
    >
      <header style={{ marginBottom: 20 }}>
        <Link
          href="/narcissist-i-en-relation"
          style={{
            color: "#555",
            fontSize: 14,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          ← Läs om narcissistiska mönster i relationer
        </Link>

        <h1
          style={{
            margin: "18px 0 8px",
            fontSize: "clamp(30px, 8vw, 44px)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
          }}
        >
          Lever du med en narcissist?
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: 690,
            fontSize: 17,
            lineHeight: 1.65,
            color: "#444",
          }}
        >
          Testet hjälper dig identifiera återkommande narcissistiska
          relationsmönster – exempelvis starkt bekräftelsebehov,
          berättigandekänsla, bristande ömsesidighet, manipulation,
          nedvärdering och kraftiga reaktioner på kritik.
        </p>

        <div
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 14,
            background: "#f7f7f7",
            border: "1px solid #e7e7e7",
            fontSize: 13,
            lineHeight: 1.55,
            color: "#555",
          }}
        >
          <b>Viktigt:</b> testet diagnostiserar inte narcissistiskt
          personlighetssyndrom. Det analyserar beteenden och relationsmönster
          som du själv upplever.
        </div>

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
      </header>

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
            Hur ofta stämmer detta?
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
            {current.text}
          </p>

          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            {[0, 1, 2, 3, 4].map((value) => {
              const selected = answers[index] === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => pickAnswer(value)}
                  className={selected ? undefined : "hover:bg-neutral-100!"}
                  style={{
                    minHeight: 50,
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: selected
                      ? "2px solid #111"
                      : "1px solid #dcdcdc",
                    background: selected ? "#f0f0f0" : "#fff",
                    color: "#111",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 16,
                    fontWeight: selected ? 700 : 500,
                  }}
                >
                  {answerLabels[value]}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: 16,
            }}
          >
            <button
              type="button"
              onClick={goPrev}
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
        <section
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

          <h2
            style={{
              margin: "8px 0 0",
              fontSize: "clamp(25px, 7vw, 34px)",
              lineHeight: 1.15,
            }}
          >
            {overallLevel(scores.overall)}
          </h2>

          <div
            style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 15,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#bbb",
                  }}
                >
                  Mönsterindex
                </div>

                <div
                  style={{
                    marginTop: 3,
                    fontSize: 38,
                    fontWeight: 900,
                    letterSpacing: "-0.03em",
                  }}
                >
                  {scores.overall}/100
                </div>
              </div>

              <div
                style={{
                  fontSize: 12,
                  color: "#aaa",
                  maxWidth: 280,
                  lineHeight: 1.45,
                }}
              >
                Indexet beskriver hur starkt flera narcissistiska
                relationsmönster framträder tillsammans. Det är inte
                sannolikheten för en diagnos.
              </div>
            </div>
          </div>

          <p
            style={{
              marginTop: 18,
              lineHeight: 1.7,
              color: "#eee",
            }}
          >
            {overallExplanation(scores.overall)}
          </p>

          <div
            style={{
              marginTop: 20,
              display: "grid",
              gap: 10,
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: "#aaa",
              }}
            >
              Områden som sticker ut mest i dina svar:
            </p>

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
                    gap: 10,
                  }}
                >
                  <b>{areaLabels[area]}</b>
                  <span style={{ color: "#ccc" }}>
                    {areaLevel(score)}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: 21,
              }}
            >
              Förstå vad resultatet betyder för just din relation
            </h3>

            <p
              style={{
                margin: "10px 0 0",
                lineHeight: 1.65,
                color: "#ddd",
              }}
            >
              Den fullständiga analysen bryter ner alla åtta områden, visar
              vilka mönster som är starkast och hjälper dig skilja mellan
              enstaka problem och ett mer genomgående relationsmönster.
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

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 18,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={restart}
              style={{
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

            <Link
              href="/narcissist-i-en-relation"
              style={{
                minHeight: 44,
                display: "inline-flex",
                alignItems: "center",
                padding: "10px 13px",
                borderRadius: 11,
                border: "1px solid #555",
                color: "#fff",
                textDecoration: "none",
              }}
            >
              Läs mer om narcissistiska mönster
            </Link>
          </div>
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

          <div
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
            <Link
              href="/gaslighting-relation"
              style={linkCardStyle}
            >
              Gaslighting – när du börjar tvivla på din egen verklighetsbild →
            </Link>

            <Link
              href="/love-bombing-relation"
              style={linkCardStyle}
            >
              Love bombing – intensiv närhet som kan följas av kontroll →
            </Link>

            <Link
              href="/traumabindning-i-relation"
              style={linkCardStyle}
            >
              Traumabindning – varför det kan vara så svårt att lämna →
            </Link>

            <Link
              href="/psykisk-misshandel-relation"
              style={linkCardStyle}
            >
              Psykisk misshandel i en relation – tecken och mönster →
            </Link>

            <Link
              href="/psykiskt-vald/hjalp"
              style={linkCardStyle}
            >
              Hjälp och nästa steg vid psykiskt våld →
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

      <footer
        style={{
          marginTop: 26,
          paddingTop: 18,
          borderTop: "1px solid #eee",
          fontSize: 12,
          lineHeight: 1.6,
          color: "#777",
        }}
      >
        <p style={{ margin: 0 }}>
          Testet är ett orienteringsverktyg och kan inte avgöra om en person
          har narcissistiskt personlighetssyndrom eller annan psykiatrisk
          diagnos.
        </p>

        <div
          style={{
            display: "flex",
            gap: 14,
            flexWrap: "wrap",
            marginTop: 10,
          }}
        >
          <Link href="/integritet" style={{ color: "#666" }}>
            Integritet
          </Link>

          <Link href="/villkor" style={{ color: "#666" }}>
            Villkor
          </Link>
        </div>
      </footer>
    </main>
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