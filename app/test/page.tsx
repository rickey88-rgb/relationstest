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



// ✅ NYTT (endast för efter-betalning): djupare, mer relevanta analysblock per kluster
const clusterDeep: Record<
  Cluster,
  {
    everyday: string[];
    impact: string[];
    trap: string;
    better: string[];
    watch: string[];
    boundary: string[];
  }
> = {
  manipulation: {
    everyday: [
      "Samtal glider från sakfråga till att handla om din ton, din reaktion eller din personlighet.",
      "Du märker att du börjar argumentera för att få din upplevelse erkänd (”men jag menade…”, ”så här hände det…”).",
      "Det kommer ursäkter som låter rimliga i stunden, men samma mönster återkommer efter några dagar/veckor.",
    ],
    impact: [
      "Självtvivel: du börjar ifrågasätta om du överreagerar eller minns fel.",
      "Mental trötthet efter diskussioner – du känner dig förvirrad snarare än lättad.",
      "Du tar ett oproportionerligt ansvar för att ”hålla fred” eller undvika reaktioner.",
    ],
    trap:
      "Du tror att om du bara förklarar bättre, lugnare och mer logiskt så kommer det landa – men dynamiken är ofta byggd för att bli cirkulär.",
    better: [
      "Håll dig till en mening om din gräns: ”Jag accepterar inte att bli kallad X.”",
      "Byt från bevisning till konsekvens: ”Om det fortsätter går jag härifrån/avslutar samtalet.”",
      "Undvik att försvara din känsla – du behöver inte vinna en debatt för att en gräns ska gälla.",
    ],
    watch: [
      "”Du är för känslig” eller ”du missförstår alltid” (flyttar fokus från beteende till din person).",
      "”Jag skojade bara” efter att du blivit sårad (minimering).",
      "Plötslig värme efter att du varit på väg att sätta gräns (återfångande).",
    ],
    boundary: [
      "”Jag kan prata när vi båda kan hålla en respektfull ton.”",
      "”Jag går inte in i en diskussion om huruvida min känsla är ’rätt’. Den är min.”",
      "”Vi tar det här senare. Jag avslutar samtalet nu.”",
    ],
  },

  empathy: {
    everyday: [
      "När du berättar att du mår dåligt blir responsen kort, irriterad eller praktisk på ett sätt som känns tomt.",
      "Värme finns i början/utåt – men hemma blir det distans, kyla eller ointresse.",
      "Efter konflikt blir det tystnad eller emotionell avstängning istället för reparation.",
    ],
    impact: [
      "Du börjar sänka dina behov för att inte vara ”jobbig”.",
      "Du känner dig ensam även när ni är tillsammans.",
      "Du blir extra mottaglig för små doser värme (för att du svultit efter det).",
    ],
    trap:
      "Du försöker få empati genom att formulera om, vara mer pedagogisk eller ”inte ställa krav” – men bristen på respons är ofta ett mönster, inte ett missförstånd.",
    better: [
      "Mät beteende, inte löften: ”När jag är ledsen behöver jag X. Om det inte finns, måste jag skydda mig själv.”",
      "Skapa alternativt stöd utanför relationen (vän/familj/professionellt).",
      "Sätt en standard: konsekvent kyla är i sig information, även utan bråk.",
    ],
    watch: [
      "Ditt mående gör personen irriterad (inte bekymrad).",
      "Du får tröst först när du ”slutar vara ledsen”.",
      "Emotionell närhet används som belöning – dras tillbaka som straff.",
    ],
    boundary: [
      "”Jag behöver stöd, inte kritik, när jag mår så här.”",
      "”Om du inte kan möta mig i det här får jag ta det med någon annan.”",
      "”Jag accepterar inte tystnad som straff.”",
    ],
  },

  control: {
    everyday: [
      "Det börjar smått: frågor, kommentarer, ”oro” – som gradvis blir ett krav på insyn.",
      "Din sociala frihet krymper: vissa personer/aktiviteter skapar konflikt så du undviker dem.",
      "Du anpassar kläder, tider, berättelser och val för att slippa reaktioner.",
    ],
    impact: [
      "Du tappar spontanitet och börjar planera livet runt personens humör.",
      "Du isolerar dig stegvis (för det blir enklare så).",
      "Du får skuld för normala behov: egen tid, vänner, integritet.",
    ],
    trap:
      "Kontroll kan maskeras som kärlek: ”jag bryr mig”, ”jag blir bara orolig” – men effekten blir minskad frihet och ökad anpassning.",
    better: [
      "Sätt integritetsgränser: du behöver inte redovisa allt för att vara lojal.",
      "Skilj på respekt och kontroll: respekt är frivillighet – kontroll kräver eftergift.",
      "Återta små friheter först (en vän, en aktivitet) och observera reaktionen.",
    ],
    watch: [
      "Frågor som känns som förhör (varför, exakt vem, exakt när, bevis).",
      "Missnöje när du prioriterar något utanför relationen.",
      "Nedvärdering av dina vänner/familj eller subtilt misstänkliggörande.",
    ],
    boundary: [
      "”Jag berättar gärna – men jag redovisar inte som en skyldighet.”",
      "”Jag träffar mina vänner. Det är inte förhandlingsbart.”",
      "”Om vi inte kan lita på varandra utan kontroll behöver vi prata om det på riktigt.”",
    ],
  },

  anger: {
    everyday: [
      "Konflikter får snabbt hög laddning: röstläge, anklagelser, hot om att lämna eller plötslig kyla.",
      "Du går på äggskal: väljer ord, timing och tystnad för att inte trigga.",
      "Efter bråk blir det inte reparation – bara ett ”vi släpper det” och sen upprepas mönstret.",
    ],
    impact: [
      "Du blir hypervaksam och tappar kontakt med din egen vilja.",
      "Du tar ansvar för stämningen och offrar det du egentligen behöver säga.",
      "Du upplever rädsla/tryck – även om ingen fysisk gräns passerats.",
    ],
    trap:
      "Du tror att om du håller dig lugn nog och säger rätt saker så lugnar det – men i hotfull dynamik är lugn ofta inte ”lösningen”, utan en överlevnadsstrategi.",
    better: [
      "Prioritera säkerhet i stunden: avbryt och lämna eskalerande samtal.",
      "Sätt en regel: ingen diskussion vid höjt tonläge/hot/kränkningar.",
      "Bygg en plan i förväg: vart du går, vem du ringer, hur du pausar utan att förhandla.",
    ],
    watch: [
      "Hot, intimidation eller att du känner dig rädd för reaktionen.",
      "Straff via kyla/tystnad efter att du sagt ifrån.",
      "”Du får mig att göra så här” (ansvarsförskjutning).",
    ],
    boundary: [
      "”Jag pratar inte när det blir hotfullt. Jag går nu.”",
      "”Vi tar det här senare. Jag pausar.”",
      "”Om du höjer rösten/kränker mig avslutar jag samtalet.”",
    ],
  },

  devalue: {
    everyday: [
      "Det var intensivt i början: stark närhet, stora ord, snabb framtidsplanering.",
      "Sen skiftar värmen: kritik, små pikar, jämförelser – samtidigt som du minns hur bra det var förut.",
      "Du jobbar för att ”få tillbaka” den tidiga versionen av relationen.",
    ],
    impact: [
      "Du blir beroende av toppar och krascher (växlande belöning).",
      "Din självkänsla påverkas: du börjar tro att du är problemet som måste fixa allt.",
      "Du tappar kompass: du mäter ditt värde i personens godkännande.",
    ],
    trap:
      "Du jagar idealiseringen: eftersom det en gång fanns värme tänker du att det går att återställa – men mönstret kan vara själva motorn i relationen.",
    better: [
      "Skilj på känsla och fakta: mät nu-läget, inte minnena från början.",
      "Notera vad som händer när du sätter gränser: kommer respekt eller mer kritik?",
      "Återanknyt till dina standarder: hur ska kärlek kännas i vardagen?",
    ],
    watch: [
      "Kritik maskerad som ”ärlighet” eller ”skämt”.",
      "Du får känna att du måste förtjäna värme.",
      "Du blir jämförd eller får höra att du förändrats negativt.",
    ],
    boundary: [
      "”Jag accepterar inte nedvärderande kommentarer.”",
      "”Om du vill ta upp något, gör det respektfullt och konkret.”",
      "”Min standard är respekt även i konflikt.”",
    ],
  },

  deceit: {
    everyday: [
      "Saker stämmer inte ihop: berättelser ändras, detaljer glider, du får en diffus känsla av att något saknas.",
      "Transparens blir selektiv: du får delar, men inte helheten.",
      "Du upplever två versioner av personen – charmig utåt, annan privat.",
    ],
    impact: [
      "Du börjar göra ”detektivarbete” i huvudet, vilket dränerar dig.",
      "Du tvivlar på din egen intuition (fast den ofta är korrekt om mönstret är stabilt).",
      "Trygghet minskar: osäkerhet blir ett normaltillstånd.",
    ],
    trap:
      "Du tänker att mer bevis kommer lösa det – men ibland är själva bristen på trygghet och konsekvens den viktigaste informationen.",
    better: [
      "Sätt tydliga krav på transparens i det som påverkar dig (ekonomi, relationer, respekt).",
      "Undvik att jaga detaljer i affekt – skriv ner och ta upp vid lugn tidpunkt.",
      "Om du konsekvent saknar trygghet: ta stöd utanför relationen och bedöm om den är hållbar.",
    ],
    watch: [
      "Motsägelser + irritationsreaktion när du frågar.",
      "”Du är paranoid” istället för att svara sakligt.",
      "Hemlighetsmakeri som påverkar din trygghet.",
    ],
    boundary: [
      "”Jag behöver konsekvens och tydlighet för att känna trygghet.”",
      "”Om du inte vill vara transparent kan jag inte bygga det här vidare.”",
      "”Jag accepterar inte att bli kallad paranoid för att jag ställer rimliga frågor.”",
    ],
  },
};

function levelGuidance(level: string) {
  if (level === "Mycket hög risk") {
    return {
      title: "Tolkning av resultatet (mycket hög risk)",
      bullets: [
        "Det här är ett läge där du inte ska ”vänta och se” i månader – utan prioritera trygghet och tydliga åtgärder.",
        "När flera riskområden är starka samtidigt tenderar det att bli både mer dränerande och mer svårnavigerat att sätta gränser.",
        "Fokusera på vad som händer när du säger nej, tar plats eller försöker lämna en konflikt – reaktionen är ofta mer avslöjande än orden.",
      ],
    };
  }
  if (level === "Hög risk") {
    return {
      title: "Tolkning av resultatet (hög risk)",
      bullets: [
        "Mönstret är tydligt nog för att du ska ta det på allvar, även om allt inte är ”katastrof” varje dag.",
        "Det viktiga är inte enskilda händelser, utan att du återkommande behöver anpassa dig för att hålla frid.",
        "Sätt gränser och observera: blir det respekt – eller blir det mer tryck, kyla eller manipulation?",
      ],
    };
  }
  if (level === "Förhöjd risk") {
    return {
      title: "Tolkning av resultatet (förhöjd risk)",
      bullets: [
        "Här är risken ofta att man normaliserar små saker som över tid blir stora (anpassning, självtvivel, minskad frihet).",
        "Du tjänar mest på att börja mäta mönster: vad triggar, hur ofta, och vad blir effekten på dig?",
        "Sätt små gränser först och se om relationen klarar respektfull friktion.",
      ],
    };
  }
  return {
    title: "Tolkning av resultatet (låg risk)",
    bullets: [
      "Låg risk betyder inte ”allt är perfekt” – det betyder att dina svar inte visar ett tydligt stabilt riskmönster över många områden.",
      "Om du ändå känner obehag: följ det över tid. Intuition + upprepning slår en enstaka testpoäng.",
      "Det viktigaste är hur du mår i relationen och om du känner dig fri att vara dig själv utan rädsla för reaktioner.",
    ],
  };
}

function safetySignals(level: string) {
  const common = [
    "Du känner rädsla för reaktionen (inte bara obehag).",
    "Hot, intimidation, att blockera utgång/telefon, eller att hindra dig från att lämna en konflikt.",
    "Upprepade kränkningar, kontroll eller isolering som ökar när du sätter gränser.",
    "”Straff” efter att du sagt ifrån: kyla, tystnad, skuld, eller att personen vänder andra emot dig.",
  ];

  if (level === "Mycket hög risk" || level === "Hög risk") {
    return [
      ...common,
      "Plötsliga humörsvängningar där du känner att du måste anpassa dig för att inte trigga.",
      "Du börjar planera ditt liv runt personens humör (tid, ordval, vilka du träffar).",
    ];
  }

  return common;
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

  const lvlGuide = useMemo(() => levelGuidance(level.level), [level.level]);

  function AreaCard({ c }: { c: Cluster }) {
    const d = clusterDeep[c];
    return (
      <div style={{ border: "1px solid #eee", borderRadius: 14, padding: 14 }}>
        <h4 style={{ margin: 0 }}>{clusterLabels[c]}</h4>

        <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
          <b>Hur detta ofta visar sig i vardagen:</b>
        </p>
        <ul style={{ lineHeight: 1.7, opacity: 0.92 }}>
          {d.everyday.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>

        <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
          <b>Vanlig effekt på dig:</b>
        </p>
        <ul style={{ lineHeight: 1.7, opacity: 0.92 }}>
          {d.impact.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>

        <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
          <b>Vanlig fälla:</b> {d.trap}
        </p>

        <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
          <b>Vad som brukar fungera bättre:</b>
        </p>
        <ul style={{ lineHeight: 1.7, opacity: 0.92 }}>
          {d.better.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>

        <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
          <b>Var extra uppmärksam på:</b>
        </p>
        <ul style={{ lineHeight: 1.7, opacity: 0.92 }}>
          {d.watch.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>

        <p style={{ marginTop: 10, lineHeight: 1.6, opacity: 0.92 }}>
          <b>Exempel på gränssättningsfraser (kort & tydligt):</b>
        </p>
        <ul style={{ lineHeight: 1.7, opacity: 0.92 }}>
          {d.boundary.map((x, i) => (
            <li key={i}>{x}</li>
          ))}
        </ul>
      </div>
    );
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
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>
          Besvara frågorna nedan så ärligt du kan
        </h1>

        <p style={{ marginTop: 10, opacity: 0.8, lineHeight: 1.4 }}>
          Tips: svara utifrån hur personen brukar bete sig över tid — inte enstaka dagar.
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
          className="question-box"
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
             Detta test ställer ingen diagnos. Det sammanställer{" "}
          <b>riskindikatorer</b> baserat på upplevda beteenden i din relation.
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

          {/* ✅ BORTTAGEN: MVP-texten under betalrutan */}
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
              Det här testet ställer ingen diagnos. Det sammanställer{" "}
              <b>riskindikatorer baserat på beteendemönster</b> och hur de påverkar dig över tid.
              Poängen är inte att ”sätta en etikett” – utan att hjälpa dig se{" "}
              <b>mönster, konsekvenser och nästa steg</b> med ett klarare perspektiv.
            </p>

            <p style={{ margin: "10px 0 0", opacity: 0.9, lineHeight: 1.55 }}>
              Det som särskilt sticker ut i ditt resultat är: <b>{fullSummary.topAreas}</b>.
              {` `}{fullSummary.practical}
            </p>

            <p style={{ margin: "10px 0 0", opacity: 0.9, lineHeight: 1.55 }}>
              En sak som ofta lurar människor i destruktiva relationer är att man letar efter ett
              enskilt ”bevis”. I verkligheten är det{" "}
              <b>kombinationen</b> av små saker som blir ett klimat: du anpassar dig, tappar mark,
              och börjar tvivla på dig själv. Den här analysen fokuserar därför på{" "}
              <b>hur mönster fungerar</b> – och vad du kan göra konkret.
            </p>

            <p style={{ margin: "10px 0 0", fontSize: 12, opacity: 0.7, lineHeight: 1.5 }}>
              Viktigt: detta är ingen diagnos av en person. Det är en{" "}
              <b>riskprofil baserad på mönster</b>. Om du känner dig rädd eller otrygg i relationen
              ska du prioritera säkerhet och söka stöd.
            </p>
          </div>

          {/* 1) Tolkning (nivåspecifik men enkel) */}
          <h3 style={{ marginTop: 18 }}>{lvlGuide.title}</h3>
          <ul style={{ lineHeight: 1.8, opacity: 0.92 }}>
            {lvlGuide.bullets.map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>

          {/* 2) Varför det kan kännas "bra ibland" men ändå vara farligt */}
          <h3 style={{ marginTop: 18 }}>Varför du kan känna dig förvirrad (även när allt inte är dåligt)</h3>
          <p style={{ lineHeight: 1.7, opacity: 0.92 }}>
            Många som hamnar i en svår relation beskriver samma sak:{" "}
            <b>det finns perioder som känns fina</b>, och det gör det svårare att lita på sin egen bedömning.
            Förvirringen ökar särskilt när värme blandas med kyla, eller när konflikt följs av en kort fas av
            närhet. Det är inte ett tecken på att du är svag – det är ofta{" "}
            <b>en helt normal effekt</b> av en relation där reparation saknas och mönster upprepas.
          </p>
          <p style={{ lineHeight: 1.7, opacity: 0.92 }}>
            Ett bra ankare är detta:{" "}
            <b>Vad händer med dig över tid?</b> Blir du friare, tryggare och mer dig själv – eller mer
            försiktig, trött och självtvivlande?
          </p>

          {/* 3) Toppområden - nu relevanta per kluster */}
          <h3 style={{ marginTop: 18 }}>Dina starkaste riskområden</h3>
          <div style={{ display: "grid", gap: 12 }}>
            <AreaCard c={top1} />
            <AreaCard c={top2} />
          </div>

          {/* 4) Konkreta steg (oavsett nivå) */}
          <h3 style={{ marginTop: 18 }}>Konkreta steg (som ger klarhet snabbt)</h3>
          <p style={{ lineHeight: 1.7, opacity: 0.92 }}>
            Om du vill veta om detta är ett stabilt mönster eller ”bara en tuff period” så är målet att
            samla <b>tydlig signal</b> utan att hamna i ändlösa diskussioner. Här är en enkel metod som
            många upplever ger klarhet:
          </p>
          <ol style={{ lineHeight: 1.8, opacity: 0.92 }}>
            <li>
              <b>Logga 7 dagar:</b> skriv ner 3 saker: (1) vad som hände, (2) hur personen reagerade,
              (3) hur du kände dig efteråt. Kort, faktabaserat.
            </li>
            <li>
              <b>Sätt en liten gräns:</b> något rimligt men tydligt (t.ex. integritet, tonläge, social frihet).
              Observera inte orden – observera reaktionen.
            </li>
            <li>
              <b>Notera reparation:</b> blir det ansvar, förändring och respekt över tid – eller ursäkt + samma mönster?
            </li>
            <li>
              <b>Ta in en extern spegel:</b> prata med någon du litar på och återge 2–3 konkreta händelser.
              Om du skäms för att berätta, är det ofta information i sig.
            </li>
          </ol>

          {/* 5) Hur man pratar utan att fastna i fällan */}
          <h3 style={{ marginTop: 18 }}>Hur du tar upp saker utan att fastna i en fälla</h3>
          <p style={{ lineHeight: 1.7, opacity: 0.92 }}>
            I destruktiva dynamiker är det vanligt att samtalet förflyttas från{" "}
            <b>beteende</b> → <b>din reaktion</b> → <b>din person</b>. Om du märker det mönstret,
            är en bra strategi att hålla dig till:
          </p>
          <ul style={{ lineHeight: 1.8, opacity: 0.92 }}>
            <li><b>En sak i taget:</b> välj ett beteende, inte hela relationen.</li>
            <li><b>En konsekvens:</b> vad du gör om det upprepas (pausar, lämnar rummet, avslutar samtalet).</li>
            <li><b>Ingen bevisning:</b> du behöver inte övertyga någon för att en gräns ska gälla.</li>
          </ul>
          <p style={{ lineHeight: 1.7, opacity: 0.92 }}>
            Ett konkret format kan vara:{" "}
            <b>”När X händer, påverkar det mig Y. Jag behöver Z. Om det fortsätter gör jag A.”</b>
            (Kort. Sakligt. Utan nya förklaringar.)
          </p>

          {/* 6) Om du överväger att lämna */}
          <h3 style={{ marginTop: 18 }}>Om du överväger att lämna (förberedelse, inte drama)</h3>
          <p style={{ lineHeight: 1.7, opacity: 0.92 }}>
            Den här delen handlar inte om att skrämmas – utan om att hjälpa dig planera smart om du redan
            lutar åt att relationen inte är bra för dig. I vissa mönster blir det mer tryck just när du
            återtar kontroll: du sätter gränser, söker stöd, eller signalerar att du är på väg bort.
          </p>
          <ul style={{ lineHeight: 1.8, opacity: 0.92 }}>
            <li>
              <b>Planera stöd i förväg:</b> välj 1–2 personer som vet läget och kan vara ”ankare”.
            </li>
            <li>
              <b>Separera viktiga saker:</b> dokument, nycklar, ekonomi, lösenord – så du slipper panik i stunden.
            </li>
            <li>
              <b>Undvik att förhandla i affekt:</b> många destruktiva dynamiker blir värre av långa ”avsluts-samtal”.
            </li>
            <li>
              <b>Välj timing:</b> om du misstänker eskalationsrisk, prioritera säkerhet framför idealbilden av ett lugnt uppbrott.
            </li>
          </ul>

          {/* 7) Varningssignaler (alltid relevant, men extra för hög nivå) */}
          <h3 style={{ marginTop: 18 }}>Varningssignaler att ta på särskilt stort allvar</h3>
          <p style={{ lineHeight: 1.7, opacity: 0.92 }}>
            Om något av detta stämmer återkommande är det rimligt att du prioriterar trygghet och söker stöd.
          </p>
          <ul style={{ lineHeight: 1.8, opacity: 0.92 }}>
            {safetySignals(level.level).map((x, i) => (
              <li key={i}>{x}</li>
            ))}
          </ul>

          {/* 8) Sammanfattning (kännas som premium) */}
          <h3 style={{ marginTop: 18 }}>Sammanfattning du kan ta med dig</h3>
          <p style={{ lineHeight: 1.7, opacity: 0.92 }}>
            Det avgörande är inte om relationen kan vara bra ibland – utan om du{" "}
            <b>över tid</b> känner dig trygg, fri och respekterad. Din toppprofil här pekar på{" "}
            <b>{clusterLabels[top1]}</b> och <b>{clusterLabels[top2]}</b>. Om du vill få klarhet snabbt:
            sätt en liten gräns, mät reaktionen och notera om det sker{" "}
            <b>reparation</b> (ansvar + förändring) eller om mönstret återkommer.
          </p>
          <p style={{ lineHeight: 1.7, opacity: 0.92 }}>
            Och viktigast: om du känner rädsla eller att du måste ”krympa” för att relationen ska fungera,
            är det alltid värt att ta på allvar.
          </p>

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
      <footer
  style={{
    marginTop: 40,
    paddingTop: 16,
    borderTop: "1px solid #eee",
    fontSize: 13,
    opacity: 0.8,
    textAlign: "center",
    lineHeight: 1.6,
  }}
>
  <div>
    Kontakt:{" "}
    <a href="mailto:support@relationsvarning.se">support@relationsvarning.se</a>
  </div>

  <div style={{ marginTop: 6 }}>
    <a href="/villkor">Villkor</a> · <a href="/integritet">Integritet</a>
  </div>

  <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
    Testet ställer ingen diagnos. Resultatet är en informationsbaserad riskprofil
    baserad på dina svar.
  </div>
</footer>

    </main>
  );
}
