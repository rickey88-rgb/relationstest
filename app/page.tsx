"use client";

import { useEffect, useMemo, useState } from "react";

type Cluster =
  | "manipulation"
  | "empathy"
  | "control"
  | "anger"
  | "devalue"
  | "deceit";

type Question = {
  id: number;
  cluster: Cluster;
  text: string;
};

const weights: Record<Cluster, number> = {
  manipulation: 1.2,
  empathy: 1.2,
  control: 1.1,
  anger: 1.3,
  devalue: 1.0,
  deceit: 1.2,
};

const clusterLabels: Record<Cluster, string> = {
  manipulation: "Manipulation & skuldvändning",
  empathy: "Empatibrist & känslokyla",
  control: "Kontroll & isolering",
  anger: "Ilska & hotfull dynamik",
  devalue: "Idealiserar → nedvärderar",
  deceit: "Dubbelspel & oärlighet",
};

const clusterShort: Record<Cluster, string> = {
  manipulation: "manipulation/skuldvändning",
  empathy: "känslokyla/empati",
  control: "kontroll/isolering",
  anger: "ilska/eskalation",
  devalue: "idealiserar→nedvärderar",
  deceit: "oärlighet/dubbelspel",
};

const answerLabels = ["Aldrig", "Sällan", "Ibland", "Ofta", "Mycket ofta"];

// 30 frågor (6 kluster × 5)
const questions: Question[] = [
  // Manipulation & skuldvändning
  { id: 1, cluster: "manipulation", text: "Får dig att känna att problem alltid är ditt fel." },
  { id: 2, cluster: "manipulation", text: "Vrider samtal tills du börjar tvivla på ditt minne." },
  { id: 3, cluster: "manipulation", text: "Ber om ursäkt men ändrar inte beteende." },
  { id: 4, cluster: "manipulation", text: "Använder din empati mot dig." },
  { id: 5, cluster: "manipulation", text: "Säger att du är “för känslig” när du reagerar." },

  // Empatibrist & känslokyla
  { id: 6, cluster: "empathy", text: "Verkar oberörd när du mår dåligt." },
  { id: 7, cluster: "empathy", text: "Blir irriterad när du behöver stöd." },
  { id: 8, cluster: "empathy", text: "Visar värme offentligt men inte privat." },
  { id: 9, cluster: "empathy", text: "Förstår inte varför vissa saker sårar dig." },
  { id: 10, cluster: "empathy", text: "Blir kall efter konflikter." },

  // Kontroll & isolering
  { id: 11, cluster: "control", text: "Vill veta var du är och med vem." },
  { id: 12, cluster: "control", text: "Ogillar att du träffar vissa personer." },
  { id: 13, cluster: "control", text: "Blir missnöjd när du prioriterar annat än relationen." },
  { id: 14, cluster: "control", text: "Kommenterar hur du klär dig eller beter dig." },
  { id: 15, cluster: "control", text: "Får dig att anpassa dig för att undvika konflikt." },

  // Ilska & hotfull dynamik
  { id: 16, cluster: "anger", text: "Har plötsliga vredesutbrott." },
  { id: 17, cluster: "anger", text: "Du går på äggskal runt personen." },
  { id: 18, cluster: "anger", text: "Konflikter eskalerar snabbt." },
  { id: 19, cluster: "anger", text: "Straffar dig med tystnad eller kyla." },
  { id: 20, cluster: "anger", text: "Du är rädd för hur personen ska reagera." },

  // Idealiserar → nedvärderar
  { id: 21, cluster: "devalue", text: "Var extremt charmig i början." },
  { id: 22, cluster: "devalue", text: "Idealiserade dig tidigt." },
  { id: 23, cluster: "devalue", text: "Har senare blivit kritisk eller nedvärderande." },
  { id: 24, cluster: "devalue", text: "Säger att du förändrats (negativt)." },
  { id: 25, cluster: "devalue", text: "Relationens värme går i vågor." },

  // Dubbelspel & oärlighet
  { id: 26, cluster: "deceit", text: "Motsäger sig själv." },
  { id: 27, cluster: "deceit", text: "Undanhåller information." },
  { id: 28, cluster: "deceit", text: "Har hemligheter kring pengar/telefon/socialt." },
  { id: 29, cluster: "deceit", text: "Känns som två olika personer." },
  { id: 30, cluster: "deceit", text: "Din magkänsla säger att något inte stämmer." },
];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function formatScore(n: number) {
  return Math.round(n);
}

function riskLevel(total: number) {
  if (total >= 100)
    return {
      level: "Mycket hög risk",
      desc: "Flera starka riskindikatorer samverkar. Ta detta på allvar och prioritera din trygghet.",
    };
  if (total >= 70)
    return {
      level: "Hög risk",
      desc: "Mönstret tyder på tydliga riskindikatorer. Sätt tydliga gränser och ta stöd om du behöver.",
    };
  if (total >= 40)
    return {
      level: "Förhöjd risk",
      desc: "Det finns återkommande signaler som kan vara värda att ta på allvar och följa upp.",
    };
  return {
    level: "Låg risk",
    desc: "Få tecken på ett tydligt riskmönster i dina svar, men lita alltid på din magkänsla i verkliga situationer.",
  };
}

function teaserText(level: string, top1: Cluster, top2: Cluster) {
  const a = clusterShort[top1];
  const b = clusterShort[top2];

  if (level === "Mycket hög risk") {
    return `Dina svar visar ett tydligt och samverkande mönster, särskilt inom ${a} och ${b}. När flera områden är starka samtidigt ökar risken för att relationen blir emotionellt dränerande och svår att navigera.`;
  }
  if (level === "Hög risk") {
    return `Dina svar visar tydliga återkommande signaler, framför allt inom ${a} och ${b}. Det här mönstret hänger ofta ihop med att gränssättning blir svårare och att konflikter kan eskalera snabbare än man tror.`;
  }
  if (level === "Förhöjd risk") {
    return `Dina svar pekar på flera återkommande signaler, främst inom ${a} och ${b}. Det kan vara värt att ta på allvar, särskilt om du märker att du anpassar dig för att undvika reaktioner.`;
  }
  return `Dina svar visar få tydliga signaler totalt, men ${a} och ${b} sticker ut mer än övriga områden. Om magkänslan ändå finns där kan det vara värt att följa mönstret över tid.`;
}

function formatTopAreas(top1: Cluster, top2: Cluster) {
  return `${clusterLabels[top1]} och ${clusterLabels[top2]}`;
}

const LS_KEY = "relationstest_state_v1";

export default function Page() {
  const totalQuestions = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(totalQuestions).fill(-1)
  );
  const [unlocked, setUnlocked] = useState(false);

  // ✅ NYTT: återställ test-state efter refresh (t.ex. efter Stripe redirect)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { index?: number; answers?: number[] };
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
      // ignore
    }
  }, [totalQuestions]);

  // ✅ NYTT: auto-unlock om man kommer tillbaka från Stripe med ?paid=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "true") {
      setUnlocked(true);
      window.history.replaceState({}, "", window.location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  // ✅ NYTT: spara state löpande så att redirect inte nollställer testet
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ index, answers }));
    } catch {
      // ignore
    }
  }, [index, answers]);

  const current = questions[index];

  const progress = useMemo(() => {
    const answeredCount = answers.filter((a) => a >= 0).length;
    return clamp(Math.round((answeredCount / totalQuestions) * 100), 0, 100);
  }, [answers, totalQuestions]);

  const isFinished = useMemo(() => answers.every((a) => a >= 0), [answers]);

  const { totalWeighted, perClusterRaw } = useMemo(() => {
    const raw: Record<Cluster, number> = {
      manipulation: 0,
      empathy: 0,
      control: 0,
      anger: 0,
      devalue: 0,
      deceit: 0,
    };

    questions.forEach((q, i) => {
      const a = answers[i];
      if (a >= 0) raw[q.cluster] += a;
    });

    let weighted = 0;
    (Object.keys(raw) as Cluster[]).forEach((c) => {
      weighted += raw[c] * weights[c];
    });

    return { totalWeighted: weighted, perClusterRaw: raw };
  }, [answers]);

  const level = useMemo(() => riskLevel(totalWeighted), [totalWeighted]);

  const topClusters = useMemo(() => {
    const entries = (Object.keys(perClusterRaw) as Cluster[]).map((c) => ({
      cluster: c,
      score: perClusterRaw[c],
    }));
    entries.sort((a, b) => b.score - a.score);
    return entries;
  }, [perClusterRaw]);

  const top1 = topClusters[0]?.cluster ?? "manipulation";
  const top2 = topClusters[1]?.cluster ?? "anger";
  const preview = useMemo(
    () => teaserText(level.level, top1, top2),
    [level.level, top1, top2]
  );

  const fullSummary = useMemo(() => {
    const topAreas = formatTopAreas(top1, top2);
    const score = formatScore(totalWeighted);

    const practical =
      level.level === "Mycket hög risk"
        ? "När flera områden är starka samtidigt ökar risken för att relationen blir mentalt dränerande och svår att navigera."
        : level.level === "Hög risk"
        ? "När flera områden sticker ut samtidigt blir gränssättning ofta svårare och konflikter kan eskalera snabbare än man tror."
        : level.level === "Förhöjd risk"
        ? "Återkommande signaler kan över tid skapa osäkerhet, anpassning och ett mönster där du tar mer ansvar än du borde."
        : "Få signaler totalt, men vissa områden sticker ut och kan vara värda att följa över tid.";

    return { topAreas, score, practical };
  }, [top1, top2, totalWeighted, level.level]);

  function pickAnswer(value: number) {
    const next = answers.slice();
    next[index] = value;
    setAnswers(next);

    if (index < totalQuestions - 1) {
      setTimeout(() => setIndex(index + 1), 250);
    }
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function restart() {
    setIndex(0);
    setAnswers(Array(totalQuestions).fill(-1));
    setUnlocked(false);
    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
      }}
    >
      <header style={{ marginBottom: 16, textAlign: "center" }}>
        <h1 style={{ margin: 0, fontSize: 40, fontWeight: 900 }}>
          Lever du med en psykopat? Gör testet
        </h1>

        <p style={{ marginTop: 10, opacity: 0.8, lineHeight: 1.4 }}>
          Detta test ställer ingen diagnos. Det sammanställer{" "}
          <b>riskindikatorer</b> baserat på upplevda beteenden i din relation.
        </p>

        <div style={{ marginTop: 16, textAlign: "left" }}>
          <div style={{ height: 10, background: "#eee", borderRadius: 999 }}>
            <div
              style={{
                height: 10,
                width: `${progress}%`,
                background: "#111",
                borderRadius: 999,
                transition: "width 200ms ease",
              }}
            />
          </div>
          <div
            style={{
              marginTop: 8,
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              opacity: 0.75,
            }}
          >
            <span>{progress}% klart</span>
            <span>
              Fråga {index + 1} av {totalQuestions}
            </span>
          </div>
        </div>
      </header>

      {!isFinished && (
        <section
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 14,
            padding: 18,
          }}
        >
          <h2
            style={{
              marginTop: 0,
              fontSize: 16,
              opacity: 0.75,
              textAlign: "center",
            }}
          >
            Hur ofta stämmer detta?
          </h2>

          <p
            style={{
              fontSize: 22,
              lineHeight: 1.35,
              marginTop: 10,
              textAlign: "center",
              fontWeight: 700,
            }}
          >
            {current.text}
          </p>

          <div style={{ display: "grid", gap: 10, marginTop: 16 }}>
            {[0, 1, 2, 3, 4].map((v) => (
              <button
                key={v}
                onClick={() => pickAnswer(v)}
                style={{
                  textAlign: "left",
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "1px solid #ddd",
                  background: answers[index] === v ? "#111" : "#fff",
                  color: answers[index] === v ? "#fff" : "#111",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                {answerLabels[v]}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
            <button
              onClick={goPrev}
              disabled={index === 0}
              style={{
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: index === 0 ? "#f6f6f6" : "#fff",
                cursor: index === 0 ? "not-allowed" : "pointer",
              }}
            >
              Tillbaka
            </button>
          </div>

          <p
            style={{
              marginTop: 14,
              fontSize: 12,
              opacity: 0.7,
              textAlign: "center",
            }}
          >
            Tips: svara utifrån hur personen brukar bete sig över tid — inte
            enstaka dagar.
          </p>
        </section>
      )}

      {isFinished && !unlocked && (
        <section
          style={{
            background: "#0b0b0b",
            color: "white",
            borderRadius: 16,
            padding: 22,
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: 22 }}>Ditt resultat är redo</h2>

          <div
            style={{
              marginTop: 12,
              padding: 14,
              borderRadius: 14,
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                flexWrap: "wrap",
              }}
            >
              <div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>
                  Totalpoäng (viktad)
                </div>
                <div style={{ fontSize: 28, fontWeight: 900 }}>
                  {formatScore(totalWeighted)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 12, opacity: 0.75 }}>Risknivå</div>
                <div style={{ fontSize: 18, fontWeight: 800 }}>
                  {level.level}
                </div>
              </div>
            </div>

            <p style={{ marginTop: 10, opacity: 0.92, lineHeight: 1.55 }}>
              {preview}
            </p>

            <p style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
              Toppområden just nu: <b>{clusterLabels[top1]}</b> och{" "}
              <b>{clusterLabels[top2]}</b>.
            </p>
          </div>

          <p style={{ marginTop: 14, opacity: 0.9, lineHeight: 1.5 }}>
            <i>
              “Ibland är det inte svar man söker, utan en förklaring till en
              känsla som funnits där länge.”
            </i>
          </p>

          <p style={{ opacity: 0.9, lineHeight: 1.5 }}>
            Lås upp din fullständiga riskanalys och vägledning: hur personer med
            dessa mönster ofta reagerar vid gränser, konfrontation och om man
            försöker lämna.
          </p>

          <div style={{ display: "flex", gap: 12, marginTop: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => {
                window.location.href =
                  "https://buy.stripe.com/3cI6oG0ut6EhfkXdfa0gw00";
              }}
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #333",
                background: "white",
                color: "#111",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Lås upp analys – 79 kr
            </button>

            <button
              onClick={restart}
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #333",
                background: "transparent",
                color: "white",
                cursor: "pointer",
              }}
            >
              Gör om testet
            </button>
          </div>

          <p style={{ marginTop: 14, fontSize: 12, opacity: 0.75 }}>
            (MVP) Detta är en temporär låsning lokalt i din webbläsare. Nästa
            steg är riktig betalning.
          </p>
        </section>
      )}

      {isFinished && unlocked && (
        <section
          style={{
            background: "#fff",
            border: "1px solid #eee",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <h2 style={{ marginTop: 0, fontSize: 22 }}>Din fullständiga riskanalys</h2>

          <div
            style={{
              padding: 14,
              borderRadius: 14,
              border: "1px solid #eee",
              background: "#fafafa",
            }}
          >
            <p style={{ margin: 0, opacity: 0.8 }}>Total Risk Score (viktad)</p>
            <p style={{ margin: "6px 0 0", fontSize: 36, fontWeight: 900 }}>
              {fullSummary.score}
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 18, fontWeight: 800 }}>
              {level.level}
            </p>

            <p style={{ margin: "10px 0 0", opacity: 0.9, lineHeight: 1.55 }}>
              Dina svar visar ett mönster av <b>återkommande riskindikatorer</b> i
              relationen. Det betyder inte att något enskilt beteende är avgörande – utan att{" "}
              <b>kombinationen</b> av beteenden över tid kan skapa en relation som blir mentalt
              påfrestande och svår att navigera.
            </p>

            <p style={{ margin: "10px 0 0", opacity: 0.9, lineHeight: 1.55 }}>
              Det som särskilt sticker ut i ditt resultat är: <b>{fullSummary.topAreas}</b>.
              {` `}{fullSummary.practical}
            </p>

            <p style={{ margin: "10px 0 0", fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>
              Viktigt: detta är ingen diagnos av en person. Det är en <b>riskprofil baserad på beteendemönster</b>.
            </p>
          </div>

          {/* RESTEN AV DIN ANALYS ÄR OFÖRÄNDRAD */}
          {/* ... (allt under är identiskt med din nuvarande fil) ... */}

          {/* 2) Toppområden - konkret */}
          <h3 style={{ marginTop: 18 }}>Dina starkaste riskområden</h3>

          <div style={{ display: "grid", gap: 12 }}>
            {/* Område 1 */}
            <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
              <h4 style={{ margin: 0 }}>{clusterLabels[top1]}</h4>
              <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
                <b>Hur detta ofta visar sig i vardagen:</b>
              </p>
              <ul style={{ lineHeight: 1.7, opacity: 0.92 }}>
                <li>Reaktioner kan komma snabbt och oproportionerligt – eller kännas svåra att förutse.</li>
                <li>Konflikter eskalerar fort eller blir laddade, även vid små ämnen.</li>
                <li>Du märker att du väljer ord, timing eller tystnad för att “inte trigga”.</li>
              </ul>

              <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
                <b>Vanlig effekt på dig:</b>
              </p>
              <ul style={{ lineHeight: 1.7, opacity: 0.92 }}>
                <li>Du går på äggskal och börjar backa från det du egentligen vill säga.</li>
                <li>Du tar ansvar för stämningen, även när den inte är ditt ansvar.</li>
                <li>Du känner att konflikter aldrig riktigt blir lösta – bara “överlevda”.</li>
              </ul>

              <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
                <b>Vanlig fälla:</b> du försöker förklara mer, vara tydligare och lugnare – men det leder inte till lugnare samtal.
              </p>

              <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
                <b>Vad som brukar fungera bättre:</b>
              </p>
              <ul style={{ lineHeight: 1.7, opacity: 0.92 }}>
                <li>Korta, tydliga gränser utan argumentation.</li>
                <li>Avsluta samtal som eskalerar istället för att försöka “vinna dem”.</li>
                <li>Upprepa samma gräns lugnt, utan nya förklaringar.</li>
              </ul>
            </div>

            {/* Område 2 */}
            <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
              <h4 style={{ margin: 0 }}>{clusterLabels[top2]}</h4>
              <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
                <b>Hur detta ofta visar sig:</b>
              </p>
              <ul style={{ lineHeight: 1.7, opacity: 0.92 }}>
                <li>Samtal vrids så att fokus hamnar på dina brister eller din ton.</li>
                <li>Din upplevelse ifrågasätts, och du börjar tvivla på vad som “egentligen” hände.</li>
                <li>Ursäkter ges, men beteendet förändras inte långsiktigt.</li>
              </ul>

              <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
                <b>Vanlig effekt på dig:</b>
              </p>
              <ul style={{ lineHeight: 1.7, opacity: 0.92 }}>
                <li>Självtvivel: “överreagerar jag?”</li>
                <li>Förvirring och mental trötthet efter diskussioner.</li>
                <li>En känsla av att aldrig bli riktigt förstådd – bara hanterad.</li>
              </ul>

              <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
                <b>Vanlig fälla:</b> du försöker bevisa din poäng med fler exempel, men samtalet blir cirkulärt och dränerande.
              </p>

              <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
                <b>Vad som brukar fungera bättre:</b>
              </p>
              <ul style={{ lineHeight: 1.7, opacity: 0.92 }}>
                <li>Håll dig till din upplevelse – du behöver inte “vinna” en tolkning.</li>
                <li>Acceptera att ni inte måste vara överens för att din gräns ska gälla.</li>
                <li>Avsluta diskussioner som går i cirklar.</li>
              </ul>
            </div>
          </div>

          {/* resten av din analys fortsätter oförändrat */}
          <div style={{ display: "flex", gap: 12, marginTop: 14, flexWrap: "wrap" }}>
            <button
              onClick={restart}
              style={{
                padding: "12px 14px",
                borderRadius: 12,
                border: "1px solid #ddd",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Gör om testet
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
