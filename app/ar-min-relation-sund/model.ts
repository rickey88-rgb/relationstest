export const dimensions = ["safety", "respect", "communication", "autonomy", "reciprocity", "stability"] as const;
export type Dimension = (typeof dimensions)[number];

export const dimensionLabels: Record<Dimension, string> = {
  safety: "Trygghet",
  respect: "Respekt",
  communication: "Kommunikation",
  autonomy: "Frihet och autonomi",
  reciprocity: "Ömsesidighet",
  stability: "Stabilitet",
};

export const dimensionDescriptions: Record<Dimension, string> = {
  safety: "Handlar om att kunna uttrycka sig och vara oense utan rädsla för reaktionen.",
  respect: "Handlar om att gränser respekteras och att du får vara den du är.",
  communication: "Handlar om att kunna prata om problem, ta ansvar och reparera efter konflikter.",
  autonomy: "Handlar om utrymme för egna relationer, beslut och ett självständigt liv.",
  reciprocity: "Handlar om att bådas behov och ansträngningar får ungefär lika stor plats.",
  stability: "Handlar om ett relativt förutsägbart bemötande och en grundkänsla av lugn.",
};

export const questions = [
  { dimension: "safety", text: "Jag kan säga vad jag tycker utan att vara rädd för min partners reaktion." },
  { dimension: "safety", text: "Jag känner mig trygg även när vi inte håller med varandra." },
  { dimension: "respect", text: "Mina gränser respekteras när jag uttrycker dem." },
  { dimension: "respect", text: "Jag känner mig accepterad som den jag är." },
  { dimension: "communication", text: "Vi kan prata om problem utan att förlöjliga eller nedvärdera varandra." },
  { dimension: "communication", text: "Båda kan ta ansvar och be om ursäkt när vi gjort fel." },
  { dimension: "autonomy", text: "Jag kan träffa vänner och familj utan skuld, press eller konflikter." },
  { dimension: "autonomy", text: "Jag kan fatta egna beslut utan att behöva oroa mig för min partners reaktion." },
  { dimension: "reciprocity", text: "Mina behov väger ungefär lika tungt som min partners." },
  { dimension: "reciprocity", text: "Jag upplever att båda anstränger sig för relationen." },
  { dimension: "stability", text: "Relationens närhet och bemötande känns relativt stabilt över tid." },
  { dimension: "stability", text: "Jag känner mig oftast lugn och trygg i relationen snarare än osäker." },
] as const satisfies readonly { dimension: Dimension; text: string }[];

export const answerLabels = ["Stämmer inte alls", "Stämmer lite", "Stämmer ganska bra", "Stämmer mycket bra"] as const;
export const STORAGE_KEY = "relationsvarning_healthy_relationship_v1";
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
const recommendationMap: Record<Dimension, readonly Recommendation[]> = {
  safety: [
    { href: "/test", title: "Det breda relationstestet", description: "Undersök fler återkommande mönster i relationen.", target: "relationstest" },
    { href: "/destruktivt-forhallande", title: "Guide om destruktiva relationer", description: "Läs om skillnaden mellan konflikt och ett återkommande skadligt mönster.", target: "destruktivt_forhallande" },
    { href: "/psykisk-misshandel-relation", title: "Psykisk misshandel i relationer", description: "Läs om trygghet, rädsla, kontroll och förskjuten maktbalans.", target: "psykisk_misshandel_guide" },
  ],
  respect: [
    { href: "/psykisk-misshandel-relation", title: "Psykisk misshandel i relationer", description: "Fördjupa återkommande nedvärdering och gränser som inte respekteras.", target: "psykisk_misshandel_guide" },
    { href: "/destruktivt-forhallande", title: "Guide om destruktiva relationer", description: "Se hur respekt och ansvar skiljer vanliga problem från destruktiva mönster.", target: "destruktivt_forhallande" },
  ],
  communication: [
    { href: "/test", title: "Det breda relationstestet", description: "Få en bredare bild utan att dra en tung slutsats av kommunikationen ensam.", target: "relationstest" },
  ],
  autonomy: [
    { href: "/kontrollerande-relation", title: "Kontrollerande relation", description: "Läs om skillnaden mellan omtanke, gemensamma beslut och kontroll.", target: "kontrollerande_relation" },
    { href: "/psykisk-misshandel-relation", title: "Psykisk misshandel i relationer", description: "Läs om begränsningar, isolering och minskat handlingsutrymme.", target: "psykisk_misshandel_guide" },
  ],
  reciprocity: [
    { href: "/test", title: "Det breda relationstestet", description: "Undersök hur flera relationsområden samspelar.", target: "relationstest" },
    { href: "/destruktivt-forhallande", title: "Guide om destruktiva relationer", description: "Läs om ansvar, anpassning och obalans över tid.", target: "destruktivt_forhallande" },
  ],
  stability: [
    { href: "/traumabindning-i-relation", title: "Traumabindning i relationer", description: "Läs om växlingar mellan konflikt, försoning, lättnad och ny oro.", target: "traumabindning_guide" },
    { href: "/love-bombing-relation", title: "Love bombing", description: "Läs om intensiv närhet som senare kan följas av distans eller kontroll.", target: "love_bombing_guide" },
    { href: "/test", title: "Det breda relationstestet", description: "Undersök fler återkommande relationsmönster.", target: "relationstest" },
  ],
};

const neutralRecommendation: Recommendation = {
  href: "/sund-relation",
  title: "Läs om vad som kännetecknar en sund relation",
  description: "Fördjupa trygghet, respekt, frihet och förmågan att reparera efter konflikter.",
  target: "sund_relation_guide",
};

export function calculate(answers: number[]) {
  if (answers.length !== questions.length || !answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 3)) throw new Error("Expected 12 answers, each 0–3");
  const scores = Object.fromEntries(dimensions.map((dimension) => [dimension, 0])) as Record<Dimension, number>;
  questions.forEach((question, index) => { scores[question.dimension] += answers[index]; });
  const strongestRanked = [...dimensions].sort((a, b) => scores[b] - scores[a] || dimensions.indexOf(a) - dimensions.indexOf(b));
  const weakestRanked = [...dimensions].sort((a, b) => scores[a] - scores[b] || dimensions.indexOf(a) - dimensions.indexOf(b));
  const allStrengths = strongestRanked.filter((dimension) => scores[dimension] >= 5);
  const allWeaker = weakestRanked.filter((dimension) => scores[dimension] <= 2);
  const strengths = allStrengths.slice(0, 3);
  const weaker = allWeaker.slice(0, 3);
  const middle = dimensions.filter((dimension) => scores[dimension] >= 3 && scores[dimension] <= 4);
  const category = allWeaker.length >= 3 ? "attention" : allWeaker.length > 0 ? "mixed" : allStrengths.length === dimensions.length ? "strong" : allStrengths.length >= 3 ? "mostly-strong" : "balanced";
  const title = category === "strong"
    ? "Din relation visar flera tydliga styrkor"
    : category === "mostly-strong"
      ? "Din relation visar flera styrkor"
      : category === "mixed"
        ? "Relationen har flera styrkor, men några områden är mer blandade"
        : category === "attention"
          ? "Flera viktiga områden förtjänar mer uppmärksamhet"
          : "Dina svar visar en blandad bild av relationen";
  const recommendations: (Recommendation & { dimension?: Dimension })[] = [];
  if (!weaker.length) recommendations.push(neutralRecommendation);
  else {
    for (const dimension of weaker) {
      for (const recommendation of recommendationMap[dimension]) {
        if (!recommendations.some((item) => item.href === recommendation.href)) recommendations.push({ ...recommendation, dimension });
        if (recommendations.length === 3) break;
      }
      if (recommendations.length === 3) break;
    }
  }
  return { scores, strongestRanked, weakestRanked, strengths, weaker, middle, category, title, recommendations };
}

export type HealthyResult = ReturnType<typeof calculate>;
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
