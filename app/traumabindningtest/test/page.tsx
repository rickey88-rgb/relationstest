"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Area =
  | "intermittent"
  | "attachment"
  | "hope"
  | "rationalization"
  | "separation"
  | "selfLoss";

type Question = {
  text: string;
  area: Area;
};

const questions: Question[] = [
  // VÄXLING MELLAN NÄRHET OCH SMÄRTA
  {
    area: "intermittent",
    text: "Relationen växlar mellan mycket nära eller kärleksfulla perioder och perioder då jag blir sårad, avvisad eller illa behandlad.",
  },
  {
    area: "intermittent",
    text: "De bra perioderna känns extra starka eftersom de ofta kommer efter konflikter, kyla eller obehag.",
  },
  {
    area: "intermittent",
    text: "När min partner åter blir varm eller kärleksfull efter en svår period känner jag en stark lättnad.",
  },
  {
    area: "intermittent",
    text: "Jag upplever att relationens starka toppar och dalar gör bindningen mer intensiv.",
  },
  {
    area: "intermittent",
    text: "Efter att jag blivit sårad kan en kort period av närhet få mig att snabbt känna hopp igen.",
  },

  // STARK BINDNING TROTS SKADA
  {
    area: "attachment",
    text: "Jag känner mig starkt bunden till min partner trots att relationen återkommande får mig att må dåligt.",
  },
  {
    area: "attachment",
    text: "Det känns svårt att föreställa mig ett liv utan min partner även när jag vet att relationen skadar mig.",
  },
  {
    area: "attachment",
    text: "Jag längtar efter min partner även efter situationer där jag blivit illa behandlad.",
  },
  {
    area: "attachment",
    text: "Jag kan känna stark kärlek eller saknad samtidigt som jag vet att relationen inte känns trygg.",
  },
  {
    area: "attachment",
    text: "Min känslomässiga bindning till relationen känns ibland starkare än min bedömning av hur jag faktiskt blir behandlad.",
  },

  // HOPP OM FÖRÄNDRING
  {
    area: "hope",
    text: "Jag håller ofta fast vid minnet av hur bra relationen kan vara och hoppas att den versionen ska komma tillbaka.",
  },
  {
    area: "hope",
    text: "När min partner visar värme eller ånger tänker jag ofta att problemen kanske äntligen kommer att försvinna.",
  },
  {
    area: "hope",
    text: "Jag stannar kvar delvis för att jag tror att relationen kan bli som den var under de bästa perioderna.",
  },
  {
    area: "hope",
    text: "Små positiva förändringar får mig ofta att återfå mycket hopp trots tidigare återkommande problem.",
  },
  {
    area: "hope",
    text: "Jag fokuserar ofta på partnerns potential snarare än på hur relationen faktiskt fungerar över tid.",
  },

  // FÖRSVAR & RATIONALISERING
  {
    area: "rationalization",
    text: "Jag hittar ofta förklaringar till min partners sårande beteende som gör det lättare att acceptera.",
  },
  {
    area: "rationalization",
    text: "Jag försvarar ibland min partner inför andra trots att jag själv varit väldigt sårad av beteendet.",
  },
  {
    area: "rationalization",
    text: "Jag tänker ofta att partnerns beteende beror på stress, tidigare erfarenheter eller andra problem snarare än på hur jag faktiskt blir behandlad.",
  },
  {
    area: "rationalization",
    text: "Jag tonar ibland ned sådant som hänt för att relationen ska kännas mindre problematisk.",
  },
  {
    area: "rationalization",
    text: "Jag märker att jag ofta letar efter skäl till varför jag ändå borde förstå eller förlåta beteenden som sårar mig.",
  },

  // SEPARATION & ÅTERDRAGNING
  {
    area: "separation",
    text: "När jag försöker skapa avstånd från relationen får jag en stark längtan att återvända.",
  },
  {
    area: "separation",
    text: "Tanken på att relationen verkligen skulle ta slut väcker stark oro även när jag själv funderat på att lämna.",
  },
  {
    area: "separation",
    text: "Efter ett uppbrott, avstånd eller en paus känner jag ofta ett starkt behov av kontakt med min partner.",
  },
  {
    area: "separation",
    text: "Jag har återvänt till relationen trots att samma problem tidigare fått mig att vilja lämna.",
  },
  {
    area: "separation",
    text: "När min partner söker kontakt efter en svår period har jag svårt att hålla fast vid beslutet att skapa avstånd.",
  },

  // FÖRLUST AV EGEN KOMPASS
  {
    area: "selfLoss",
    text: "Jag har gradvis anpassat mina behov eller gränser för att hålla relationen kvar.",
  },
  {
    area: "selfLoss",
    text: "Det har blivit svårare för mig att avgöra vad jag själv egentligen vill i relationen.",
  },
  {
    area: "selfLoss",
    text: "Jag prioriterar ofta relationens fortsättning framför mitt eget välmående.",
  },
  {
    area: "selfLoss",
    text: "Jag har accepterat sådant i relationen som jag tidigare inte trodde att jag skulle acceptera.",
  },
  {
    area: "selfLoss",
    text: "Jag känner ibland att relationen har förändrat min uppfattning om vilka gränser jag har rätt att sätta.",
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
  intermittent: "Växling mellan närhet och smärta",
  attachment: "Stark bindning trots skada",
  hope: "Hopp om förändring",
  rationalization: "Försvar & rationalisering",
  separation: "Separation & återdragning",
  selfLoss: "Förlust av egen kompass",
};

const areaDescriptions: Record<Area, string> = {
  intermittent:
    "Visar hur starkt relationen präglas av växling mellan positiva perioder och perioder av obehag, avvisande eller skada.",
  attachment:
    "Visar hur stark den känslomässiga bindningen är trots att relationen samtidigt upplevs som skadlig eller otrygg.",
  hope:
    "Visar hur mycket hoppet om att de goda perioderna ska återkomma påverkar viljan att stanna kvar.",
  rationalization:
    "Visar i vilken grad sårande beteenden förklaras, försvaras eller tonas ned för att relationen ska kännas mer begriplig eller möjlig att fortsätta.",
  separation:
    "Visar hur stark dragningen tillbaka till relationen blir när avstånd, paus eller uppbrott uppstår.",
  selfLoss:
    "Visar hur mycket egna behov, gränser och bedömningar kan ha försvagats eller anpassats för relationens skull.",
};

const LS_KEY = "traumabindningtest_state_v1";

const CHECKOUT_URL: string = "https://buy.stripe.com/aFa00ib97d2F2ybdfa0gw0b";

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
    return "Omfattande traumabindningsrelaterade mönster";
  }

  if (score >= 50) {
    return "Tydliga traumabindningsrelaterade mönster";
  }

  if (score >= 25) {
    return "Vissa traumabindningsrelaterade mönster";
  }

  return "Få tecken på traumabindningsrelaterade mönster";
}

function overallDescription(score: number) {
  if (score >= 75) {
    return "Dina svar visar ett omfattande mönster där stark känslomässig bindning verkar finnas sida vid sida med återkommande smärta, instabilitet eller beteenden som påverkar ditt välmående och dina gränser.";
  }

  if (score >= 50) {
    return "Dina svar visar flera tydliga mönster som ofta förknippas med traumabindning: stark anknytning trots skada, återkommande hopp efter svåra perioder och svårigheter att skapa eller behålla avstånd.";
  }

  if (score >= 25) {
    return "Dina svar visar vissa mönster som kan förekomma vid traumabindning. Det betyder inte i sig att relationen är traumabindande, men det kan vara värdefullt att undersöka hur bindningen påverkas av återkommande smärta, lättnad och hopp.";
  }

  return "Dina svar visar relativt få av de mönster som testet undersöker. Stark kärlek, saknad eller svårigheter vid ett uppbrott är i sig inte samma sak som traumabindning.";
}

function areaGuidance(area: Area, score: number) {
  const elevated = score >= 50;

  const guidance: Record<Area, string> = {
    intermittent: elevated
      ? "Dina svar tyder på en tydlig växling mellan svåra perioder och stark närhet eller lättnad. Lägg märke till om de positiva perioderna främst känns starka därför att de följer efter stress, rädsla, kyla eller konflikt."
      : "Dina svar visar relativt lite av den starka växling mellan smärta och återförening som ofta diskuteras vid traumabindning.",

    attachment: elevated
      ? "Du verkar känna en stark emotionell bindning även när relationen samtidigt orsakar betydande smärta eller otrygghet. Det kan vara viktigt att skilja känslans styrka från frågan om relationen faktiskt är trygg och hållbar."
      : "Din emotionella anknytning verkar i mindre grad hålla dig kvar trots tydlig skada eller otrygghet.",

    hope: elevated
      ? "Hoppet om förändring verkar spela en stor roll. Observera om du framför allt bedömer relationen utifrån dess bästa perioder och partnerns potential, snarare än utifrån det återkommande mönstret över tid."
      : "Dina svar tyder på att hopp om framtida förändring i mindre grad håller dig kvar trots återkommande problem.",

    rationalization: elevated
      ? "Du verkar ofta hitta förklaringar som gör partnerns beteende lättare att acceptera. Förklaringar kan vara sanna och samtidigt inte förändra effekten beteendet har på dig."
      : "Dina svar visar relativt lite av ett mönster där sårande beteenden återkommande försvaras, förklaras bort eller tonas ned.",

    separation: elevated
      ? "Avstånd verkar utlösa en stark dragning tillbaka till relationen. Lägg märke till om lättnaden efter återkontakt gör att orsakerna till att du ville skapa avstånd snabbt hamnar i bakgrunden."
      : "Dina svar visar relativt få tecken på en stark återdragningsprocess när du skapar avstånd från relationen.",

    selfLoss: elevated
      ? "Relationen verkar ha påverkat dina egna behov, gränser eller bedömningar. Det kan vara värdefullt att återigen formulera vad du själv behöver och vilka beteenden du inte vill acceptera, oberoende av relationens framtid."
      : "Dina svar tyder på att du i relativt hög grad behåller kontakten med dina egna behov, gränser och bedömningar.",
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
      // Testet fungerar även utan localStorage.
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
      alert("Stripe-länken för traumabindningstestet är inte inkopplad ännu.");
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
          padding: "24px 16px 64px",
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
          href="/"
          style={{
            color: "#555",
            fontSize: 14,
            textDecoration: "underline",
            textUnderlineOffset: 3,
          }}
        >
          ← Till Relationsvarning
        </Link>

        <h1
          style={{
            margin: "18px 0 8px",
            fontSize: "clamp(30px, 8vw, 44px)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
          }}
        >
          Traumabindningstest – varför är det så svårt att släppa relationen?
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
          Svara på 30 frågor om stark bindning, växlingen mellan smärta och
          närhet, hopp om förändring, återdragning och hur relationen påverkar
          dina egna gränser.
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
          <b>Viktigt:</b> Stark kärlek, saknad eller svårigheter att lämna en
          relation är inte automatiskt traumabindning. Testet undersöker ett
          återkommande mönster där stark anknytning förekommer tillsammans med
          smärta, instabilitet eller beteenden som påverkar ditt välmående.
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
              Förstå varför bindningen känns så stark
            </h3>

            <p
              style={{
                margin: "10px 0 0",
                lineHeight: 1.65,
                color: "#ddd",
              }}
            >
              Den fullständiga analysen visar samtliga sex områden och hjälper
              dig förstå vad som verkar hålla bindningen kvar, hur relationens
              växlingar påverkar dig och vilka mönster som är viktigast att
              observera.
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
            <Link
              href="/psykisk-misshandel-relation/test"
              style={linkCardStyle}
            >
              Gör testet om psykisk misshandel och psykiskt våld →
            </Link>

            <Link href="/gaslightingtest/test" style={linkCardStyle}>
              Gör gaslightingtestet →
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

            <Link href="/anknytningstest/test" style={linkCardStyle}>
              Gör anknytningstestet →
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