export const dimensions = ["worry", "control", "body", "tension", "focusSleep", "impact"] as const;
export type Dimension = typeof dimensions[number];

export const dimensionNames: Record<Dimension, string> = {
  worry: "Ihållande och överdriven oro",
  control: "Att kontrollera oron",
  body: "Rastlöshet och kroppslig spänning",
  tension: "Mental anspänning och irritabilitet",
  focusSleep: "Koncentration och sömn",
  impact: "Påverkan i vardagen",
};

export const questions = [
  "Jag oroar mig ofta för flera olika saker samtidigt.",
  "Min oro fortsätter även när det inte finns något konkret problem att lösa.",
  "Jag tänker ofta igenom tänkbara negativa utfall i förväg.",
  "Små osäkerheter kan uppta mycket av mina tankar.",
  "Jag har svårt att känna mig riktigt trygg i att saker kommer att ordna sig.",
  "När jag väl börjar oroa mig har jag svårt att släppa tankarna.",
  "Jag försöker lugna mig, men oron kommer snabbt tillbaka.",
  "Jag fastnar lätt i att granska om jag har missat något viktigt.",
  "Jag söker ofta bekräftelse för att kunna släppa en oro.",
  "Det känns svårt att medvetet skjuta upp eller begränsa mitt grubblande.",
  "Jag känner mig ofta rastlös i kroppen även när jag vill vila.",
  "Jag har svårt att slappna av i muskler eller käkar.",
  "Oro märks ibland som spänningar, magbesvär eller hjärtklappning hos mig.",
  "Jag har svårt att sitta still eller vara närvarande när jag är orolig.",
  "Jag behöver ofta göra något för att dämpa en kroppslig känsla av stress.",
  "Jag känner mig ofta mentalt på helspänn.",
  "Jag blir lättare irriterad när jag har mycket oro i mig.",
  "Det tar energi att hela tiden försöka hålla ihop eller förbereda mig.",
  "Jag har svårt att acceptera att allt inte går att kontrollera.",
  "Jag känner ofta ett inre tryck trots att omgivningen kan verka lugn.",
  "Oro gör det svårt för mig att koncentrera mig på en uppgift i taget.",
  "Tankar som snurrar gör det svårare att somna eller somna om.",
  "Jag blir trött av att ha varit spänd eller orolig länge.",
  "Jag tappar lätt tråden när jag försöker arbeta, läsa eller lyssna.",
  "Jag vaknar eller sover ytligt när jag har mycket på gång i huvudet.",
  "Min oro påverkar hur jag fungerar på arbete, i studier eller hemma.",
  "Jag undviker ibland situationer eller beslut för att minska oro.",
  "Oro tar tid eller energi från relationer, återhämtning eller sådant jag vill göra.",
  "Jag har haft återkommande perioder av den här sortens oro under en längre tid.",
  "Jag upplever att oron ofta handlar om flera områden i livet, inte bara en sak.",
] as const;

export const answerLabels = ["Aldrig", "Sällan", "Ibland", "Ofta", "Mycket ofta"];
export const PRICE_SEK = 39;
export const STATE_VERSION = 1;
export const STORAGE_KEY = "relationsvarning_angest_state_v1";
export const emptyAnswers = () => Array<number>(questions.length).fill(-1);
export const formatPercent = (value: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 0 }).format(value);

export function calculate(answers: number[]) {
  if (answers.length !== 30 || !answers.every(answer => Number.isInteger(answer) && answer >= 0 && answer <= 4)) throw new Error("Expected 30 answers, each 0–4");
  const scores = Object.fromEntries(dimensions.map((dimension, index) => [dimension, answers.slice(index * 5, index * 5 + 5).reduce((sum, answer) => sum + answer, 0) * 5])) as Record<Dimension, number>;
  const core = dimensions.slice(0, 5);
  const profileScore = dimensions.reduce((sum, dimension) => sum + scores[dimension], 0) / dimensions.length;
  const ranked = [...dimensions].sort((a, b) => scores[b] - scores[a]);
  const elevated = core.filter(dimension => scores[dimension] >= 65);
  const supporting: string[] = [];
  const lessClear: string[] = [];
  if (elevated.length >= 3) supporting.push("Flera områden som rör oro och anspänning ligger förhöjda i din självskattning.");
  if (scores.worry >= 65 && scores.control >= 65) supporting.push("Ihållande oro och svårigheten att släppa den framträder samtidigt.");
  if (scores.impact >= 65) supporting.push("Du beskriver att oron också påverkar hur vardagen fungerar.");
  if (answers[28] >= 3 && answers[29] >= 3) supporting.push("Du beskriver ett återkommande mönster över tid och inom flera livsområden.");
  if (elevated.length <= 1) lessClear.push("Förhöjningen är begränsad till ett eller få områden, vilket ger en mindre samlad bild.");
  if (scores.impact < 40) lessClear.push("Du beskriver relativt begränsad påverkan på vardagen i dina svar.");
  if (answers[28] <= 1) lessClear.push("Ditt svar ger begränsat stöd för att mönstret har varit återkommande under längre tid.");
  if (answers[29] <= 1) lessClear.push("Oron verkar i dina svar vara mer avgränsad till ett område än spridd över flera delar av livet.");
  const level = profileScore >= 70 ? "Ett tydligt och brett orosmönster" : profileScore >= 50 ? "Ett måttligt orosmönster" : profileScore >= 30 ? "Vissa återkommande tecken på oro" : "Ett svagt eller avgränsat orosmönster";
  return { scores, profileScore, ranked, elevated, level, supporting, lessClear };
}

export function parseState(raw: string | null): { version: number; answers: number[]; index: number; unlocked: boolean } | null {
  try {
    const saved = JSON.parse(raw ?? "null");
    if (saved?.version !== STATE_VERSION || !Array.isArray(saved.answers) || saved.answers.length !== 30 || !saved.answers.every((answer: unknown) => typeof answer === "number" && Number.isInteger(answer) && answer >= -1 && answer <= 4)) return null;
    return { version: STATE_VERSION, answers: saved.answers, index: Number.isInteger(saved.index) ? Math.max(0, Math.min(29, saved.index)) : 0, unlocked: saved.unlocked === true };
  } catch { return null; }
}
