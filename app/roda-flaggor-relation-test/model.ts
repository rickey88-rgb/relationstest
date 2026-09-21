export const dimensions = ["control", "gaslighting", "devaluation", "boundaries", "instability", "insecurity"] as const;
export type Dimension = (typeof dimensions)[number];

export const dimensionLabels: Record<Dimension, string> = {
  control: "Kontroll",
  gaslighting: "Gaslighting och verklighetsförvrängning",
  devaluation: "Nedvärdering",
  boundaries: "Isolering och gränser",
  instability: "Intensitet och instabilitet",
  insecurity: "Otrygghet",
};

export const dimensionDescriptions: Record<Dimension, string> = {
  control: "Dina svar berör begränsningar av val, tid eller handlingsutrymme.",
  gaslighting: "Dina svar berör förnekande och tvivel på det egna minnet eller omdömet.",
  devaluation: "Dina svar berör återkommande kritik, förlöjligande eller förskjutet ansvar.",
  boundaries: "Dina svar berör minskad kontakt med andra eller gränser som inte respekteras.",
  instability: "Dina svar berör växlingar mellan stark närhet, konflikt, kyla och försoning.",
  insecurity: "Dina svar berör vaksamhet och en minskad känsla av trygghet eller frihet.",
};

export const questions = [
  { dimension: "control", text: "Försöker personen bestämma vilka du träffar, vad du gör eller hur du använder din tid?" },
  { dimension: "control", text: "Känner du att du behöver anpassa dina val för att undvika personens reaktioner?" },
  { dimension: "gaslighting", text: "Förnekar personen saker som du tydligt minns har hänt eller sagts?" },
  { dimension: "gaslighting", text: "Börjar du ibland tvivla på ditt eget minne eller din uppfattning efter era konflikter?" },
  { dimension: "devaluation", text: "Blir du återkommande kritiserad, förlöjligad eller nedvärderad?" },
  { dimension: "devaluation", text: "Får du ofta skulden för problem även när ansvaret egentligen är gemensamt?" },
  { dimension: "boundaries", text: "Har relationen gjort att du träffar familj, vänner eller andra människor mindre än du egentligen vill?" },
  { dimension: "boundaries", text: "Ignoreras eller pressas dina gränser trots att du uttryckt dem tydligt?" },
  { dimension: "instability", text: "Växlar relationen mellan väldigt intensiv närhet och tydlig kyla eller distans?" },
  { dimension: "instability", text: "Känns försoningar ofta väldigt starka efter perioder av konflikt eller oro?" },
  { dimension: "insecurity", text: "Tänker du ofta igenom vad du ska säga eller göra för att inte orsaka bråk eller negativa reaktioner?" },
  { dimension: "insecurity", text: "Känner du dig mindre trygg, fri eller säker på dig själv i relationen än du gjorde tidigare?" },
] as const satisfies readonly { dimension: Dimension; text: string }[];

export const answerLabels = ["Aldrig", "Sällan", "Ofta", "Mycket ofta"] as const;
export const STORAGE_KEY = "relationsvarning_roda_flaggor_quickcheck_v1";
export const STATE_VERSION = 1;
export const emptyAnswers = () => Array<number>(questions.length).fill(-1);

export function applyAnswer(answers: number[], index: number, value: number) {
  if (answers.length !== questions.length || !answers.every((answer) => Number.isInteger(answer) && answer >= -1 && answer <= 3)) throw new Error("Invalid answer state");
  if (!Number.isInteger(index) || index < 0 || index >= questions.length || !Number.isInteger(value) || value < 0 || value > 3) throw new Error("Invalid answer transition");
  const nextAnswers = answers.map((answer, questionIndex) => questionIndex === index ? value : answer);
  const complete = nextAnswers.every((answer) => answer >= 0);
  const missing = nextAnswers.findIndex((answer) => answer < 0);
  return { answers: nextAnswers, complete, nextIndex: complete ? index : index < questions.length - 1 ? index + 1 : missing };
}

type Recommendation = { href: string; title: string; description: string; target: string };
const recommendations: Record<Dimension, Recommendation> = {
  control: { href: "/psykisk-misshandel-relation/test", title: "Test om psykisk misshandel", description: "Fördjupa återkommande kontroll, begränsningar och förskjuten maktbalans.", target: "psykisk_misshandel_test" },
  gaslighting: { href: "/gaslightingtest/test", title: "Gaslightingtest", description: "Undersök förnekande, skuldvändning, minne och tillit till ditt eget omdöme.", target: "gaslighting_test" },
  devaluation: { href: "/psykisk-misshandel-relation/test", title: "Test om psykisk misshandel", description: "Fördjupa nedvärdering, skuld, hot och andra återkommande beteenden.", target: "psykisk_misshandel_test" },
  boundaries: { href: "/psykisk-misshandel-relation/test", title: "Test om psykisk misshandel", description: "Undersök gränsöverträdelser, isolering och begränsat handlingsutrymme.", target: "psykisk_misshandel_test" },
  instability: { href: "/traumabindningtest/test", title: "Traumabindningstest", description: "Fördjupa växlingen mellan konflikt, stark försoning, lättnad och ny oro.", target: "traumabindning_test" },
  insecurity: { href: "/test", title: "Det breda relationstestet", description: "Få en bredare genomgång av återkommande varningssignaler i relationen.", target: "relationstest" },
};

export function calculate(answers: number[]) {
  if (answers.length !== questions.length || !answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 3)) {
    throw new Error("Expected 12 answers, each 0–3");
  }
  const scores = Object.fromEntries(dimensions.map((dimension) => [dimension, 0])) as Record<Dimension, number>;
  questions.forEach((question, index) => { scores[question.dimension] += answers[index]; });
  const ranked = [...dimensions].sort((a, b) => scores[b] - scores[a] || dimensions.indexOf(a) - dimensions.indexOf(b));
  const total = answers.reduce((sum, answer) => sum + answer, 0);
  const high = ranked.filter((dimension) => scores[dimension] >= 4);
  const topGap = scores[ranked[0]] - scores[ranked[1]];
  const category = scores[ranked[0]] <= 2 ? "low" : high.length === 1 && topGap >= 2 ? "single" : high.length >= 2 ? "multiple" : "mixed";
  const prominent = category === "low" ? [] : (high.length ? high : ranked.filter((dimension) => scores[dimension] >= 3)).slice(0, 3);
  const selected: (Recommendation & { dimension: Dimension })[] = [];
  for (const dimension of prominent.length ? prominent : ["insecurity" as Dimension]) {
    const recommendation = recommendations[dimension];
    if (!selected.some((item) => item.href === recommendation.href)) selected.push({ ...recommendation, dimension });
    if (selected.length === 3) break;
  }
  const title = category === "low"
    ? "Inget tydligt mönster sticker ut"
    : category === "single"
      ? `${dimensionLabels[ranked[0]]} sticker ut i dina svar`
      : category === "multiple"
        ? "Flera återkommande mönster syns i dina svar"
        : "Vissa signaler syns, men bilden är inte entydig";
  return { scores, ranked, total, category, prominent, recommendations: selected, title };
}

export type QuickcheckResult = ReturnType<typeof calculate>;
export type SavedState = { version: number; answers: number[]; index: number; view: "test" | "analysis" | "result" };

export function parseState(raw: string | null): SavedState | null {
  try {
    const saved = JSON.parse(raw ?? "null");
    if (saved?.version !== STATE_VERSION || !Array.isArray(saved.answers) || saved.answers.length !== questions.length || !saved.answers.every((answer: unknown) => typeof answer === "number" && Number.isInteger(answer) && answer >= -1 && answer <= 3)) return null;
    const complete = saved.answers.every((answer: number) => answer >= 0);
    const view = saved.view === "result" && complete ? "result" : saved.view === "analysis" && complete ? "analysis" : "test";
    return { version: STATE_VERSION, answers: saved.answers, index: Number.isInteger(saved.index) ? Math.max(0, Math.min(questions.length - 1, saved.index)) : 0, view };
  } catch { return null; }
}
