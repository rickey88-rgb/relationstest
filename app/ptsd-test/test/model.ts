export const dimensions = ["reexperiencing", "avoidance", "thoughtsFeelings", "hyperarousal", "dailyImpact"] as const;
export type Dimension = typeof dimensions[number];

export const dimensionNames: Record<Dimension, string> = {
  reexperiencing: "Återupplevande",
  avoidance: "Undvikande",
  thoughtsFeelings: "Tankar & känslor",
  hyperarousal: "Vaksamhet & stressreaktioner",
  dailyImpact: "Påverkan på vardagen",
};

export const dimensionExplanations: Record<Dimension, string> = {
  reexperiencing: "Påträngande minnen, drömmar och starka reaktioner på sådant som påminner om en svår upplevelse.",
  avoidance: "Försök att hålla tankar, känslor, platser eller situationer på avstånd när de väcker obehag.",
  thoughtsFeelings: "Förändringar i känslor, självbild, minne och kontakt med sådant som tidigare känts viktigt.",
  hyperarousal: "Att vara på sin vakt, lättskrämd, spänd eller stressad och ha svårt att slappna av eller sova.",
  dailyImpact: "Hur reaktionerna enligt dina svar påverkar relationer, vardag, aktiviteter, energi och livskvalitet.",
};

export const questions: { dimension: Dimension; text: string }[] = [
  { dimension: "reexperiencing", text: "Oönskade minnen av en svår upplevelse dyker upp fast du inte vill tänka på den." },
  { dimension: "reexperiencing", text: "Du får starka känslomässiga reaktioner när något påminner dig om det som hänt." },
  { dimension: "reexperiencing", text: "Kroppen reagerar kraftigt på påminnelser, till exempel med hjärtklappning, spänning eller svettningar." },
  { dimension: "reexperiencing", text: "Du har drömmar eller mardrömmar som känns kopplade till det du varit med om." },
  { dimension: "reexperiencing", text: "Ibland känns det som om delar av det som hänt händer igen eller blir väldigt verkliga." },
  { dimension: "reexperiencing", text: "Små saker som ljud, lukter, platser eller situationer kan plötsligt väcka starka reaktioner." },
  { dimension: "avoidance", text: "Du försöker undvika tankar eller känslor som påminner dig om det som hänt." },
  { dimension: "avoidance", text: "Du undviker vissa platser, personer eller situationer eftersom de väcker obehagliga minnen eller känslor." },
  { dimension: "avoidance", text: "Du försöker hålla dig sysselsatt för att slippa tänka på det svåra." },
  { dimension: "avoidance", text: "Du har förändrat saker i ditt liv för att minska risken att bli påmind om det som hänt." },
  { dimension: "avoidance", text: "Det finns saker kring upplevelsen som du helst inte vill prata om, ens med personer du litar på." },
  { dimension: "thoughtsFeelings", text: "Du har svårt att känna positiva känslor lika starkt som tidigare." },
  { dimension: "thoughtsFeelings", text: "Du känner dig distanserad eller avskärmad från andra människor." },
  { dimension: "thoughtsFeelings", text: "Du har tappat intresset för aktiviteter som tidigare betydde något för dig." },
  { dimension: "thoughtsFeelings", text: "Du har negativa tankar om dig själv, andra människor eller världen som blivit starkare efter det du varit med om." },
  { dimension: "thoughtsFeelings", text: "Du bär på skuld eller klandrar dig själv för sådant som hände eller för hur du reagerade." },
  { dimension: "thoughtsFeelings", text: "Du har svårt att minnas viktiga delar av det som hände." },
  { dimension: "thoughtsFeelings", text: "Känslor som rädsla, skam, ilska eller skuld tar stor plats i vardagen." },
  { dimension: "hyperarousal", text: "Du känner dig ofta på din vakt även när det egentligen verkar vara tryggt." },
  { dimension: "hyperarousal", text: "Du blir lättskrämd av plötsliga ljud, rörelser eller andra oväntade saker." },
  { dimension: "hyperarousal", text: "Du har svårt att slappna av eftersom kroppen känns beredd på att något ska hända." },
  { dimension: "hyperarousal", text: "Du blir lättare irriterad eller arg än du skulle vilja." },
  { dimension: "hyperarousal", text: "Du har svårt att koncentrera dig eftersom du känner dig stressad eller vaksam." },
  { dimension: "hyperarousal", text: "Du har problem med att somna, sova sammanhängande eller känna dig utvilad." },
  { dimension: "hyperarousal", text: "Du märker ibland att du reagerar snabbt eller impulsivt när du känner dig pressad eller hotad." },
  { dimension: "dailyImpact", text: "De här reaktionerna påverkar dina nära relationer." },
  { dimension: "dailyImpact", text: "De gör arbete, studier eller vardagliga uppgifter svårare." },
  { dimension: "dailyImpact", text: "De begränsar vilka platser, aktiviteter eller sociala situationer du känner att du kan delta i." },
  { dimension: "dailyImpact", text: "Du lägger mycket energi på att hantera, kontrollera eller undvika dina reaktioner." },
  { dimension: "dailyImpact", text: "Sammantaget upplever du att de här problemen påverkar din livskvalitet." },
];

export const answerLabels = ["Aldrig", "Sällan", "Ibland", "Ofta", "Nästan alltid"] as const;
export const PRICE_SEK = 39;
export const STATE_VERSION = 1;
export const STORAGE_KEY = "relationsvarning_ptsd_state_v1";
export const emptyAnswers = () => Array<number>(questions.length).fill(-1);

export function symptomLevel(percent: number) {
  if (percent < 20) return "Få PTSD-relaterade symtom framträder i svaren";
  if (percent < 45) return "Vissa PTSD-relaterade symtom framträder i svaren";
  if (percent < 70) return "Tydliga PTSD-relaterade symtom framträder i svaren";
  return "Många PTSD-relaterade symtom framträder i svaren";
}

export function areaLevel(percent: number) {
  if (percent < 20) return "mindre framträdande";
  if (percent < 45) return "vissa reaktioner";
  if (percent < 70) return "tydliga reaktioner";
  return "mycket framträdande reaktioner";
}

export function calculate(answers: number[]) {
  if (answers.length !== questions.length || !answers.every((answer) => Number.isInteger(answer) && answer >= 0 && answer <= 4)) {
    throw new Error("Expected 30 answers, each 0–4");
  }
  const raw = Object.fromEntries(dimensions.map((dimension) => [dimension, 0])) as Record<Dimension, number>;
  const maximum = Object.fromEntries(dimensions.map((dimension) => [dimension, 0])) as Record<Dimension, number>;
  questions.forEach((question, index) => { raw[question.dimension] += answers[index]; maximum[question.dimension] += 4; });
  const scores = Object.fromEntries(dimensions.map((dimension) => [dimension, Math.round((raw[dimension] / maximum[dimension]) * 100)])) as Record<Dimension, number>;
  const ranked = [...dimensions].sort((a, b) => scores[b] - scores[a]);
  const totalRaw = answers.reduce((sum, answer) => sum + answer, 0);
  const overallPercent = Math.round((totalRaw / (questions.length * 4)) * 100);
  const drivers = Object.fromEntries(dimensions.map((dimension) => [dimension, questions.map((question, index) => ({ text: question.text, answer: answers[index], index })).filter((item) => questions[item.index].dimension === dimension).sort((a, b) => b.answer - a.answer).slice(0, 3)])) as Record<Dimension, { text: string; answer: number; index: number }[]>;
  return { raw, maximum, scores, ranked, totalRaw, overallPercent, drivers, highest: ranked[0], second: ranked[1], lowest: ranked[ranked.length - 1] };
}

export type Result = ReturnType<typeof calculate>;

export function parseState(raw: string | null): { version: number; answers: number[]; index: number; unlocked: boolean } | null {
  try {
    const saved: unknown = JSON.parse(raw ?? "null");
    if (!saved || typeof saved !== "object") return null;
    const state = saved as Record<string, unknown>;
    const index = state.index;
    if (state.version !== STATE_VERSION || !Array.isArray(state.answers) || state.answers.length !== questions.length || !state.answers.every((answer) => typeof answer === "number" && Number.isInteger(answer) && answer >= -1 && answer <= 4) || typeof index !== "number" || !Number.isInteger(index)) return null;
    return { version: STATE_VERSION, answers: state.answers, index: Math.max(0, Math.min(questions.length - 1, index)), unlocked: state.unlocked === true };
  } catch { return null; }
}
