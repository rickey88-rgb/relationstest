"use client";

import { useTestAnalytics } from "../../_analytics/useTestAnalytics";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Dimension = "anxiety" | "avoidance";

type Subscale =
  | "rejection"
  | "reassurance"
  | "hypervigilance"
  | "vulnerability"
  | "selfReliance"
  | "withdrawal";

type Question = {
  text: string;
  dimension: Dimension;
  subscale: Subscale;
  reverse?: boolean;
};

const questions: Question[] = [
  // ANKNYTNINGSÅNGEST – RÄDSLA FÖR AVVISANDE
  {
    dimension: "anxiety",
    subscale: "rejection",
    text:
      "Jag blir lätt orolig för att min partner ska tappa känslorna för mig.",
  },
  {
    dimension: "anxiety",
    subscale: "rejection",
    text:
      "Små förändringar i min partners ton eller beteende kan få mig att undra om något är fel mellan oss.",
  },
  {
    dimension: "anxiety",
    subscale: "rejection",
    text:
      "Jag är ofta rädd för att bli lämnad, även när det inte finns något tydligt tecken på att relationen är på väg att ta slut.",
  },
  {
    dimension: "anxiety",
    subscale: "rejection",
    text:
      "När min partner behöver mer eget utrymme kan jag tolka det som att hen håller på att dra sig undan från mig.",
  },
  {
    dimension: "anxiety",
    subscale: "rejection",
    text:
      "Jag har lätt att känna mig ersättningsbar eller mindre viktig för min partner än jag önskar.",
  },

  // ANKNYTNINGSÅNGEST – BEHOV AV FÖRSÄKRAN
  {
    dimension: "anxiety",
    subscale: "reassurance",
    text:
      "Jag behöver ofta tydliga tecken på att min partner fortfarande älskar eller vill vara med mig.",
  },
  {
    dimension: "anxiety",
    subscale: "reassurance",
    text:
      "Om min partner inte svarar eller hör av sig som vanligt blir jag snabbt orolig.",
  },
  {
    dimension: "anxiety",
    subscale: "reassurance",
    text:
      "Jag söker ofta bekräftelse på att relationen är trygg.",
  },
  {
    dimension: "anxiety",
    subscale: "reassurance",
    text:
      "När jag känner mig osäker i relationen har jag svårt att lugna mig utan respons från min partner.",
  },
  {
    dimension: "anxiety",
    subscale: "reassurance",
    text:
      "Jag kan känna ett starkt behov av närhet efter konflikt, även om min partner behöver mer tid.",
  },

  // ANKNYTNINGSÅNGEST – HYPERVAKSAMHET & RELATIONSORO
  {
    dimension: "anxiety",
    subscale: "hypervigilance",
    text:
      "Jag analyserar ofta meddelanden, tonfall eller små detaljer för att förstå hur min partner känner för mig.",
  },
  {
    dimension: "anxiety",
    subscale: "hypervigilance",
    text:
      "Det är svårt för mig att släppa relationsproblem innan jag känner att allt är helt utrett.",
  },
  {
    dimension: "anxiety",
    subscale: "hypervigilance",
    text:
      "Jag märker snabbt om min partner känns mindre varm, mindre närvarande eller mer distanserad än vanligt.",
  },
  {
    dimension: "anxiety",
    subscale: "hypervigilance",
    text:
      "När relationen känns osäker tar den lätt mycket plats i mina tankar.",
  },
  {
    dimension: "anxiety",
    subscale: "hypervigilance",
    text:
      "Jag kan ha svårt att koncentrera mig på annat när jag upplever känslomässigt avstånd mellan mig och min partner.",
  },

  // UNDVIKANDE – OBEHAG INFÖR SÅRBARHET
  {
    dimension: "avoidance",
    subscale: "vulnerability",
    text:
      "Jag tycker det är svårt att visa min partner hur sårbar jag egentligen känner mig.",
  },
  {
    dimension: "avoidance",
    subscale: "vulnerability",
    text:
      "Jag håller gärna vissa känslor för mig själv även när min partner försöker komma nära.",
  },
  {
    dimension: "avoidance",
    subscale: "vulnerability",
    text:
      "Jag kan känna mig obekväm när någon vill komma väldigt nära mig känslomässigt.",
  },
  {
    dimension: "avoidance",
    subscale: "vulnerability",
    text:
      "Det känns ibland tryggare att inte visa hur mycket jag behöver eller bryr mig om någon.",
  },
  {
    dimension: "avoidance",
    subscale: "vulnerability",
    text:
      "När samtal blir mycket känslomässiga vill jag ofta avsluta dem eller byta ämne.",
  },

  // UNDVIKANDE – SJÄLVTILLRÄCKLIGHET & BEROENDE
  {
    dimension: "avoidance",
    subscale: "selfReliance",
    text:
      "Jag föredrar ofta att lösa problem själv istället för att luta mig mot min partner.",
  },
  {
    dimension: "avoidance",
    subscale: "selfReliance",
    text:
      "Jag tycker det är obekvämt att känna att jag är beroende av någon annan.",
  },
  {
    dimension: "avoidance",
    subscale: "selfReliance",
    text:
      "Jag känner ett starkt behov av att behålla mycket självständighet även i en nära relation.",
  },
  {
    dimension: "avoidance",
    subscale: "selfReliance",
    text:
      "Jag har svårt att helt lita på att någon annan kommer finnas där när jag verkligen behöver stöd.",
  },
  {
    dimension: "avoidance",
    subscale: "selfReliance",
    text:
      "Jag känner mig ofta tryggare när jag inte behöver förlita mig för mycket på min partner.",
  },

  // UNDVIKANDE – TILLBAKADRAGANDE
  {
    dimension: "avoidance",
    subscale: "withdrawal",
    text:
      "När en konflikt blir intensiv behöver jag ofta skapa avstånd från min partner.",
  },
  {
    dimension: "avoidance",
    subscale: "withdrawal",
    text:
      "Om min partner vill prata om relationen när jag känner mig pressad kan jag vilja dra mig undan.",
  },
  {
    dimension: "avoidance",
    subscale: "withdrawal",
    text:
      "Jag kan bli mindre känslomässigt tillgänglig när min partner vill ha mycket närhet.",
  },
  {
    dimension: "avoidance",
    subscale: "withdrawal",
    text:
      "När jag känner mig överväldigad i relationen stänger jag ofta av mina känslor eller håller personen på avstånd.",
  },
  {
    dimension: "avoidance",
    subscale: "withdrawal",
    text:
      "Efter konflikt vill jag ofta få mycket mer distans än min partner verkar vilja ha.",
  },
];

const answerLabels = [
  "Stämmer inte alls",
  "Stämmer lite",
  "Stämmer delvis",
  "Stämmer ganska mycket",
  "Stämmer helt",
];

const subscaleLabels: Record<Subscale, string> = {
  rejection: "Rädsla för avvisande",
  reassurance: "Behov av försäkran",
  hypervigilance: "Relationsoro & vaksamhet",
  vulnerability: "Obehag inför sårbarhet",
  selfReliance: "Självtillräcklighet & beroende",
  withdrawal: "Tillbakadragande vid närhet eller konflikt",
};

const subscaleDescriptions: Record<Subscale, string> = {
  rejection:
    "Beskriver hur känslig du är för tecken på att en partner kan tappa intresse, skapa avstånd eller lämna relationen.",
  reassurance:
    "Beskriver hur mycket trygghet du behöver få genom partnerns respons, bekräftelse och försäkringar.",
  hypervigilance:
    "Beskriver hur mycket uppmärksamhet och mental energi som går åt till att tolka relationens signaler och förändringar.",
  vulnerability:
    "Beskriver hur bekväm du är med att visa behov, känslor och sårbarhet i nära relationer.",
  selfReliance:
    "Beskriver tendensen att lita främst på dig själv och undvika känslomässigt beroende av en partner.",
  withdrawal:
    "Beskriver hur lätt du skapar känslomässigt eller praktiskt avstånd när relationen känns intensiv eller konfliktfylld.",
};

const LS_KEY = "anknytningstest_state_v1";

// Egen Stripe-länk skapas efter att testet verifierats.
const CHECKOUT_URL = "https://buy.stripe.com/4gMaEWcdbd2F8Wzfni0gw08";

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

function scoreLevel(score: number) {
  if (score >= 75) return "Hög";
  if (score >= 50) return "Förhöjd";
  if (score >= 25) return "Måttlig";
  return "Låg";
}

function profileName(anxiety: number, avoidance: number) {
  const highAnxiety = anxiety >= 50;
  const highAvoidance = avoidance >= 50;

  if (!highAnxiety && !highAvoidance) {
    return "Övervägande trygg anknytningsprofil";
  }

  if (highAnxiety && !highAvoidance) {
    return "Övervägande ängslig / ambivalent anknytningsprofil";
  }

  if (!highAnxiety && highAvoidance) {
    return "Övervägande undvikande anknytningsprofil";
  }

  return "Blandad otrygg / rädd-undvikande anknytningsprofil";
}

function profileShort(anxiety: number, avoidance: number) {
  const highAnxiety = anxiety >= 50;
  const highAvoidance = avoidance >= 50;

  if (!highAnxiety && !highAvoidance) {
    return (
      "Dina svar visar relativt låg anknytningsångest och relativt låg tendens " +
      "till känslomässigt undvikande. Det talar för att du oftast kan söka närhet " +
      "utan stark rädsla för att bli övergiven och samtidigt behålla självständighet " +
      "utan att behöva skapa stort känslomässigt avstånd."
    );
  }

  if (highAnxiety && !highAvoidance) {
    return (
      "Dina svar visar framför allt en stark känslighet för avstånd, osäkerhet och " +
      "risken att förlora närhet. Du verkar samtidigt relativt bekväm med känslomässig " +
      "närhet och vill ofta reparera avstånd snabbt när relationen känns osäker."
    );
  }

  if (!highAnxiety && highAvoidance) {
    return (
      "Dina svar visar framför allt en tendens att skydda självständighet och skapa " +
      "känslomässigt avstånd när närheten blir intensiv. Oro för att bli övergiven " +
      "framträder mindre tydligt än behovet av att inte känna dig alltför beroende."
    );
  }

  return (
    "Dina svar visar både tydlig anknytningsångest och tydlig tendens till undvikande. " +
    "Det kan skapa en inre konflikt där du längtar efter närhet men samtidigt blir " +
    "obekväm, försiktig eller tillbakadragen när relationen känns alltför intensiv."
  );
}

function profileDeep(anxiety: number, avoidance: number) {
  const highAnxiety = anxiety >= 50;
  const highAvoidance = avoidance >= 50;

  if (!highAnxiety && !highAvoidance) {
    return (
      "Din profil ligger närmast det som brukar beskrivas som trygg anknytning. " +
      "Det betyder inte att du aldrig blir osäker eller drar dig undan, utan att varken " +
      "stark övergivenhetsoro eller starkt känslomässigt undvikande verkar dominera dina " +
      "relationer. Du har sannolikt lättare än många att både söka stöd och ge partnern utrymme."
    );
  }

  if (highAnxiety && !highAvoidance) {
    return (
      "Din profil ligger närmast ett ängsligt eller ambivalent anknytningsmönster. " +
      "När relationen känns trygg kan närhet kännas mycket positiv, men osäkerhet eller " +
      "avstånd kan snabbt aktivera oro. Det kan leda till starkt behov av kontakt, " +
      "försäkran eller snabb lösning efter konflikt."
    );
  }

  if (!highAnxiety && highAvoidance) {
    return (
      "Din profil ligger närmast ett undvikande anknytningsmönster. När relationen blir " +
      "känslomässigt intensiv kan självständighet och distans kännas tryggare än att luta " +
      "sig mot partnern. Du kan därför ha lättare att hantera oro genom att dra dig undan " +
      "än genom att söka mer närhet."
    );
  }

  return (
    "Din profil visar både hög anknytningsångest och högt undvikande. Det brukar beskrivas " +
    "som en mer blandad eller rädd-undvikande anknytningsprofil. Närhet kan vara starkt " +
    "efterlängtad samtidigt som den också kan kännas riskfylld. Det kan skapa växlingar " +
    "mellan att söka kontakt och att senare dra sig undan."
  );
}

function subscaleGuidance(subscale: Subscale, score: number) {
  const high = score >= 50;

  const text: Record<Subscale, string> = {
    rejection: high
      ? "Du verkar vara känslig för signaler om avstånd eller minskat intresse. Försök skilja mellan faktiska förändringar i partnerns beteende och den oro som uppstår innan du har tillräckligt med information."
      : "Rädsla för avvisande framträder inte som ett starkt återkommande mönster i dina svar.",
    reassurance: high
      ? "Trygghet verkar ofta behöva bekräftas utifrån. Det kan hjälpa att observera om behovet av försäkran faktiskt lugnar dig på längre sikt eller bara ger kortvarig lättnad."
      : "Du verkar relativt sällan behöva upprepad försäkran från en partner för att känna att relationen är stabil.",
    hypervigilance: high
      ? "Du verkar lägga stor mental energi på att läsa av relationen. När detta blir starkt kan neutrala förändringar i ton, svarstid eller humör få större betydelse än de egentligen har."
      : "Du verkar relativt sällan fastna i intensiv analys av relationens små signaler.",
    vulnerability: high
      ? "Sårbarhet verkar vara något du ofta skyddar. Att gradvis uttrycka behov utan att först behöva vara helt säker på partnerns reaktion kan vara ett viktigt område att utveckla."
      : "Du verkar relativt bekväm med att visa känslor och behov när relationen känns trygg.",
    selfReliance: high
  ? "Du verkar sätta stort värde på att klara dig själv. Självständighet är inte ett problem i sig, men det kan bli begränsande om det gör det svårt att ta emot stöd eller bygga ömsesidigt beroende."
  : "Du verkar kunna behålla självständighet samtidigt som du i relativt hög grad kan förlita dig på en partner.",
withdrawal: high
  ? "Du verkar ofta reglera starka känslor genom att skapa avstånd. Kort paus kan vara konstruktivt, men långvarigt tillbakadragande kan göra att partnern upplever osäkerhet och söker ännu mer kontakt."
  : "Du verkar relativt sällan lösa relationsstress genom att stänga av eller skapa stort känslomässigt avstånd.",
  };

  return text[subscale];
}

export default function Page() {
  const totalQuestions = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(totalQuestions).fill(-1)
  );
  const [unlocked, setUnlocked] = useState(false);
  const tracking = useTestAnalytics("attachment_test", questions.length);
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
      // Testet fungerar även utan sparad lokal data.
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
    const dimensionRaw: Record<Dimension, number> = {
      anxiety: 0,
      avoidance: 0,
    };

    const dimensionMax: Record<Dimension, number> = {
      anxiety: 0,
      avoidance: 0,
    };

    const subscaleRaw = {} as Record<Subscale, number>;
    const subscaleMax = {} as Record<Subscale, number>;

    (Object.keys(subscaleLabels) as Subscale[]).forEach((subscale) => {
      subscaleRaw[subscale] = 0;
      subscaleMax[subscale] = 0;
    });

    questions.forEach((question, i) => {
      const answer = answers[i];

      dimensionMax[question.dimension] += 4;
      subscaleMax[question.subscale] += 4;

      if (answer >= 0) {
        const scoredValue = question.reverse ? 4 - answer : answer;

        dimensionRaw[question.dimension] += scoredValue;
        subscaleRaw[question.subscale] += scoredValue;
      }
    });

    const dimensions: Record<Dimension, number> = {
      anxiety:
        dimensionMax.anxiety > 0
          ? Math.round(
              (dimensionRaw.anxiety / dimensionMax.anxiety) * 100
            )
          : 0,

      avoidance:
        dimensionMax.avoidance > 0
          ? Math.round(
              (dimensionRaw.avoidance / dimensionMax.avoidance) * 100
            )
          : 0,
    };

    const subscales = {} as Record<Subscale, number>;

    (Object.keys(subscaleRaw) as Subscale[]).forEach((subscale) => {
      subscales[subscale] =
        subscaleMax[subscale] > 0
          ? Math.round(
              (subscaleRaw[subscale] / subscaleMax[subscale]) * 100
            )
          : 0;
    });

    return {
      dimensions,
      subscales,
    };
  }, [answers]);

  const sortedSubscales = useMemo(() => {
    return (Object.keys(scores.subscales) as Subscale[])
      .map((subscale) => ({
        subscale,
        score: scores.subscales[subscale],
      }))
      .sort((a, b) => b.score - a.score);
  }, [scores.subscales]);

  const strongestSubscales = sortedSubscales.slice(0, 3);

  function pickAnswer(value: number) {
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

  function goPrev() {
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
      // ignore
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goToCheckout() {
    if (!CHECKOUT_URL) {
      alert(
        "Betalningslänken för anknytningstestet kopplas in efter att testet verifierats."
      );
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

  const anxiety = scores.dimensions.anxiety;
  const avoidance = scores.dimensions.avoidance;
  const profile = profileName(anxiety, avoidance);

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
                  className={`answer-button ${
                    selected ? "selected" : ""
                  }`}
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
            Din anknytningsprofil
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 12,
              marginTop: 20,
            }}
          >
            <div
              style={{
                padding: 16,
                borderRadius: 15,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div style={{ fontSize: 13, color: "#bbb" }}>
                Anknytningsångest
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: 34,
                  fontWeight: 900,
                }}
              >
                {anxiety}/100
              </div>

              <div style={{ marginTop: 4, color: "#ddd" }}>
                {scoreLevel(anxiety)}
              </div>
            </div>

            <div
              style={{
                padding: 16,
                borderRadius: 15,
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <div style={{ fontSize: 13, color: "#bbb" }}>
                Anknytningsundvikande
              </div>

              <div
                style={{
                  marginTop: 4,
                  fontSize: 34,
                  fontWeight: 900,
                }}
              >
                {avoidance}/100
              </div>

              <div style={{ marginTop: 4, color: "#ddd" }}>
                {scoreLevel(avoidance)}
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
            {profileShort(anxiety, avoidance)}
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
              Delområden som sticker ut mest:
            </p>

            {strongestSubscales.map(({ subscale, score }) => (
              <div
                key={subscale}
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
                  <b>{subscaleLabels[subscale]}</b>
                  <span style={{ color: "#ccc" }}>
                    {scoreLevel(score)}
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
              Förstå vad din anknytningsprofil betyder i praktiken
            </h3>

            <p
              style={{
                margin: "10px 0 0",
                lineHeight: 1.65,
                color: "#ddd",
              }}
            >
              Den fullständiga analysen bryter ner alla sex delområden,
              typiska triggers, konfliktmönster och vad som kan hjälpa dig
              utveckla tryggare relationsbeteenden.
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

            <p
              style={{
                margin: "9px 0 0",
                fontSize: 12,
                color: "#999",
                textAlign: "center",
              }}
            >
              Betalningslänken kopplas in efter att testet verifierats.
            </p>
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

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 12,
              marginTop: 20,
            }}
          >
            <div
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

            <div
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

          <div
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
              <div
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
            <Link href="/narcissist-i-en-relation/test" style={linkCardStyle}>
              Lever du med narcissistiska relationsmönster? →
            </Link>

            <Link
              href="/psykisk-misshandel-relation/test"
              style={linkCardStyle}
            >
              Test om psykisk misshandel och psykiskt våld →
            </Link>

            <Link href="/gaslighting-relation" style={linkCardStyle}>
              Gaslighting – när du börjar tvivla på din egen
              verklighetsbild →
            </Link>

            <Link href="/traumabindning-i-relation" style={linkCardStyle}>
              Traumabindning – när stark närhet och smärta binds samman →
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