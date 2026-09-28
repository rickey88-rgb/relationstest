export const dimensions = ["overstimulation", "sensory", "emotional", "processing", "social", "positive"] as const;
export type Dimension = typeof dimensions[number];

export const dimensionNames: Record<Dimension, string> = {
  overstimulation: "Överstimulering",
  sensory: "Sensorisk känslighet",
  emotional: "Emotionell reaktivitet",
  processing: "Djup bearbetning",
  social: "Social och emotionell känslighet",
  positive: "Positiv känslighet och subtila detaljer",
};

export const questions = [
  "Jag blir snabbt trött när många saker händer omkring mig samtidigt.",
  "Jag behöver ofta återhämtning efter intensiva eller socialt krävande dagar.",
  "När jag har för många saker att hantera samtidigt känns det lätt som att hjärnan slår i taket.",
  "Stökiga eller hektiska miljöer kan göra det svårt för mig att tänka klart.",
  "Jag märker tydligt när jag fått för många intryck och behöver dra mig undan.",
  "Höga eller plötsliga ljud påverkar mig mer än de verkar påverka andra.",
  "Starkt ljus eller visuellt stökiga miljöer kan bli jobbiga för mig.",
  "Jag lägger snabbt märke till obekväma kläder, temperaturer, lukter eller andra kroppsliga intryck.",
  "Små sensoriska störningar kan göra det svårt för mig att koncentrera mig.",
  "Jag föredrar ofta lugna miljöer eftersom starka sinnesintryck tar mycket energi.",
  "Mina känslor kan bli väldigt starka även av sådant andra verkar skaka av sig snabbt.",
  "Kritik eller negativa kommentarer kan stanna kvar länge i huvudet på mig.",
  "Jag behöver ibland lång tid för att komma tillbaka efter en känslomässigt intensiv situation.",
  "När något berör mig känslomässigt känner jag det ofta väldigt tydligt i kroppen.",
  "Händelser som andra snabbt går vidare från kan fortsätta påverka mig långt efteråt.",
  "Jag funderar ofta länge över saker som har hänt och vad de egentligen betydde.",
  "Innan jag fattar viktiga beslut vill jag gärna tänka igenom många möjliga konsekvenser.",
  "Jag upptäcker ofta flera lager eller betydelser i situationer som andra verkar ta mer direkt.",
  "Jag kan fortsätta analysera en situation långt efter att den är över.",
  "Jag har lätt för att fastna i djupa resonemang kring människor, händelser eller idéer.",
  "Jag märker snabbt när stämningen i ett rum förändras.",
  "Jag uppfattar ofta små förändringar i människors tonfall, ansiktsuttryck eller beteende.",
  "Andra människors känslor kan påverka mitt eget humör starkt.",
  "Jag märker ofta att något är fel med någon innan personen själv säger det.",
  "Spänningar eller konflikter mellan andra kan påverka mig även när jag själv inte är inblandad.",
  "Musik, natur, konst eller andra starka upplevelser kan påverka mig väldigt djupt.",
  "Jag lägger ofta märke till små detaljer som andra verkar missa.",
  "Små positiva saker kan påverka mitt humör mer än man kanske skulle tro.",
  "Jag kan bli starkt berörd av vackra eller betydelsefulla ögonblick.",
  "Jag uppskattar ofta subtila nyanser i exempelvis musik, miljöer, mat eller människors uttryck.",
] as const;

export const answerLabels = ["Stämmer inte alls", "Stämmer ganska dåligt", "Stämmer delvis", "Stämmer ganska bra", "Stämmer mycket bra"] as const;
export const PRICE_SEK = 49;
export const STATE_VERSION = 1;
export const STORAGE_KEY = "relationsvarning_hsp_state_v1";
export const emptyAnswers = () => Array<number>(questions.length).fill(-1);

export function level(raw: number) {
  if (raw <= 10) return "Låg tendens";
  if (raw <= 15) return "Relativt låg";
  if (raw <= 19) return "Måttlig";
  if (raw <= 22) return "Tydlig";
  return "Mycket tydlig";
}

export function calculate(answers: number[]) {
  if (answers.length !== questions.length || !answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 4)) throw new Error("Expected 30 answers, each 0–4");
  const raw = Object.fromEntries(dimensions.map((dimension, index) => [dimension, answers.slice(index * 5, index * 5 + 5).reduce((sum, answer) => sum + answer + 1, 0)])) as Record<Dimension, number>;
  const normalized = Object.fromEntries(dimensions.map((dimension) => [dimension, ((raw[dimension] - 5) / 20) * 100])) as Record<Dimension, number>;
  const ranked = [...dimensions].sort((a, b) => raw[b] - raw[a]);
  const average = dimensions.reduce((sum, dimension) => sum + raw[dimension], 0) / dimensions.length;
  const highest = ranked[0]; const lowest = ranked[ranked.length - 1];
  const highGap = raw[highest] - average; const spread = raw[highest] - raw[lowest];
  const second = ranked[1];
  const twoDominant = raw[highest] >= average + 3 && raw[second] >= average + 3 && Math.abs(raw[highest] - raw[second]) <= 2;
  const even = spread <= 3;
  const pattern = even ? "even" : twoDominant ? "pair" : spread >= 8 ? "contrast" : highGap >= 4 ? "dominant" : "mixed";
  return { raw, normalized, ranked, average, highest, lowest, highGap, spread, second, twoDominant, even, pattern };
}

export type Result = ReturnType<typeof calculate>;

export function parseState(raw: string | null): { version: number; answers: number[]; index: number; unlocked: boolean } | null {
  try {
    const saved: unknown = JSON.parse(raw ?? "null");
    if (!saved || typeof saved !== "object") return null;
    const state = saved as Record<string, unknown>; const index = state.index;
    if (state.version !== STATE_VERSION || !Array.isArray(state.answers) || state.answers.length !== questions.length || !state.answers.every((answer) => typeof answer === "number" && Number.isInteger(answer) && answer >= -1 && answer <= 4) || typeof index !== "number" || !Number.isInteger(index)) return null;
    return { version: STATE_VERSION, answers: state.answers, index: Math.max(0, Math.min(questions.length - 1, index)), unlocked: state.unlocked === true };
  } catch { return null; }
}
