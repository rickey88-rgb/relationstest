export const dimensions = ["grandiosity", "validation", "entitlement", "empathy", "criticism", "influence"] as const;
export type Dimension = typeof dimensions[number];
export type Question = { id: number; text: string; dimension: Dimension; reverse: boolean };
export const questions: Question[] = [
  {
    "id": 1,
    "text": "Jag känner ofta att jag har egenskaper eller förmågor som skiljer mig tydligt från de flesta andra.",
    "dimension": "grandiosity",
    "reverse": false
  },
  {
    "id": 2,
    "text": "Jag märker snabbt om jag inte får den uppskattning eller uppmärksamhet jag hade väntat mig.",
    "dimension": "validation",
    "reverse": false
  },
  {
    "id": 3,
    "text": "Kritik kan påverka mig betydligt mer än jag visar utåt.",
    "dimension": "criticism",
    "reverse": false
  },
  {
    "id": 4,
    "text": "Jag blir frustrerad när andra inte tar lika stor hänsyn till mina behov som jag tycker att de borde.",
    "dimension": "entitlement",
    "reverse": false
  },
  {
    "id": 5,
    "text": "När jag är upprörd har jag ibland svårt att samtidigt ta in den andra personens perspektiv.",
    "dimension": "empathy",
    "reverse": false
  },
  {
    "id": 6,
    "text": "Jag är ganska bra på att anpassa mitt sätt att prata för att öka chansen att få det resultat jag vill ha.",
    "dimension": "influence",
    "reverse": false
  },
  {
    "id": 7,
    "text": "Jag föreställer mig ibland att jag kommer få mer framgång, status eller erkännande än de flesta andra.",
    "dimension": "grandiosity",
    "reverse": false
  },
  {
    "id": 8,
    "text": "Mitt humör kan påverkas tydligt om jag känner mig förbisedd eller oviktig.",
    "dimension": "validation",
    "reverse": false
  },
  {
    "id": 9,
    "text": "När någon ifrågasätter mig kan det kännas mer personligt än jag egentligen skulle vilja.",
    "dimension": "criticism",
    "reverse": false
  },
  {
    "id": 10,
    "text": "Jag tycker ibland att särskilda omständigheter gör att regler eller förväntningar borde vara mer flexibla för mig.",
    "dimension": "entitlement",
    "reverse": false
  },
  {
    "id": 11,
    "text": "Jag kan förstå varför någon blev sårad av mitt beteende även när jag själv tycker att jag hade goda skäl.",
    "dimension": "empathy",
    "reverse": true
  },
  {
    "id": 12,
    "text": "Jag har ibland låtit någon känna skuld för att få personen att ändra sitt beteende.",
    "dimension": "influence",
    "reverse": false
  },
  {
    "id": 13,
    "text": "Jag känner ganska ofta att jag ser sådant som andra människor inte riktigt förstår.",
    "dimension": "grandiosity",
    "reverse": false
  },
  {
    "id": 14,
    "text": "Det betyder mycket för mig att människor ser mig som kompetent, attraktiv, framgångsrik eller speciell.",
    "dimension": "validation",
    "reverse": false
  },
  {
    "id": 15,
    "text": "Jag kan återkomma mentalt till kritik eller avvisanden långt efter att situationen är över.",
    "dimension": "criticism",
    "reverse": false
  },
  {
    "id": 16,
    "text": "Jag kan bli irriterad när andra prioriterar något annat framför sådant som är viktigt för mig.",
    "dimension": "entitlement",
    "reverse": false
  },
  {
    "id": 17,
    "text": "När jag hamnar i konflikt försöker jag även förstå vilken del av problemet jag själv bidrog till.",
    "dimension": "empathy",
    "reverse": true
  },
  {
    "id": 18,
    "text": "Jag väljer ibland vad jag berättar eller inte berättar beroende på vilken reaktion jag vill få.",
    "dimension": "influence",
    "reverse": false
  },
  {
    "id": 19,
    "text": "Jag tycker ibland att mina prestationer eller kvaliteter får mindre erkännande än de förtjänar.",
    "dimension": "grandiosity",
    "reverse": false
  },
  {
    "id": 20,
    "text": "Jag jämför mig ofta med hur mycket uppmärksamhet, status eller uppskattning andra får.",
    "dimension": "validation",
    "reverse": false
  },
  {
    "id": 21,
    "text": "Att känna mig förödmjukad eller nedvärderad kan väcka stark ilska eller skam hos mig.",
    "dimension": "criticism",
    "reverse": false
  },
  {
    "id": 22,
    "text": "När jag har lagt mycket energi på någon kan jag förvänta mig att personen ska prioritera mig tillbaka.",
    "dimension": "entitlement",
    "reverse": false
  },
  {
    "id": 23,
    "text": "Jag kan vara genuint glad för någon annans framgång även när personen får något jag själv hade velat ha.",
    "dimension": "empathy",
    "reverse": true
  },
  {
    "id": 24,
    "text": "Jag kan ibland uttrycka saker på ett sätt som får en annan person att börja tvivla på sin egen tolkning av situationen.",
    "dimension": "influence",
    "reverse": false
  },
  {
    "id": 25,
    "text": "Jag upplever ganska ofta att jag är mer kompetent eller insiktsfull än människorna omkring mig.",
    "dimension": "grandiosity",
    "reverse": false
  },
  {
    "id": 26,
    "text": "Jag känner mig mer trygg i mig själv när andra tydligt visar att de uppskattar eller beundrar mig.",
    "dimension": "validation",
    "reverse": false
  },
  {
    "id": 27,
    "text": "Det kan vara svårt för mig att släppa känslan av att någon behandlat mig respektlöst.",
    "dimension": "criticism",
    "reverse": false
  },
  {
    "id": 28,
    "text": "Jag kan känna att jag förtjänar mer hänsyn än andra eftersom jag har gjort, presterat eller gått igenom mer.",
    "dimension": "entitlement",
    "reverse": false
  },
  {
    "id": 29,
    "text": "Jag kan lägga mina egna behov åt sidan när någon nära mig verkligen behöver stöd, även när jag inte får något tillbaka.",
    "dimension": "empathy",
    "reverse": true
  },
  {
    "id": 30,
    "text": "Jag har ibland använt charm, närhet eller uppskattning mer strategiskt än spontant.",
    "dimension": "influence",
    "reverse": false
  }
];

export const dimensionNames: Record<Dimension, string> = {
  grandiosity: "Grandiositet & självbild", validation: "Bekräftelsebehov", entitlement: "Berättigande & kontroll",
  empathy: "Empati & ömsesidighet", criticism: "Kritikkänslighet & skam", influence: "Strategiskt inflytande",
};
export const answerLabels = ["Stämmer inte alls", "Stämmer lite", "Stämmer delvis", "Stämmer ganska bra", "Stämmer mycket väl"];
export const PRICE_SEK = 79;
export const STORAGE_KEY = "relationsvarning_narcissism_self_v1";
export const STATE_VERSION = 1;
export const emptyAnswers = () => Array<number>(questions.length).fill(-1);
export function scoreAnswer(question: Question, answer: number) {
  if (!Number.isInteger(answer) || answer < 0 || answer > 4) throw new Error("Invalid answer");
  return question.reverse ? 4 - answer : answer;
}
export function totalLevel(percent: number) {
  if (percent >= 65) return "Mycket tydliga narcissistiska drag";
  if (percent >= 45) return "Tydliga narcissistiska drag";
  if (percent >= 25) return "Vissa narcissistiska drag";
  return "Få narcissistiska drag";
}
export function dimensionLevel(percent: number) {
  return percent >= 65 ? "Mycket framträdande" : percent >= 45 ? "Framträdande" : percent >= 25 ? "Vissa drag" : "Få drag";
}
export function calculate(answers: number[]) {
  if (answers.length !== questions.length) throw new Error("Expected 30 answers");
  const raw = Object.fromEntries(dimensions.map(d => [d, 0])) as Record<Dimension, number>;
  questions.forEach((q,i) => { raw[q.dimension] += scoreAnswer(q, answers[i]); });
  const scores = Object.fromEntries(dimensions.map(d => [d, raw[d] / 20 * 100])) as Record<Dimension, number>;
  const totalScore = dimensions.reduce((sum,d) => sum + raw[d],0);
  const percent = totalScore / 120 * 100;
  // Heuristic descriptive indices, not diagnostic cutoffs. Higher empathy score = more difficulties.
  // G = 30% grandiosity + 30% entitlement + 30% influence + 10% validation.
  // V = 40% criticism + 40% validation + 10% empathy difficulties + 10% entitlement.
  // Both below 25 => no clear profile. Gap <15 points => mixed; otherwise the higher index dominates.
  // Comparisons use unrounded values; percentages are rounded only for display.
  const grandiose = (3 * scores.grandiosity + 3 * scores.entitlement + 3 * scores.influence + scores.validation) / 10;
  const vulnerable = (4 * scores.criticism + 4 * scores.validation + scores.empathy + scores.entitlement) / 10;
  const profileType = Math.max(grandiose, vulnerable) < 25 ? "Ingen tydlig profiltyp"
    : Math.abs(grandiose - vulnerable) < 15 ? "Blandad profil"
    : grandiose > vulnerable ? "Främst grandios profil" : "Främst sårbar profil";
  const ranked = [...dimensions].sort((a,b) => scores[b]-scores[a]);
  return { raw, scores, totalScore, percent, level: totalLevel(percent), grandiose, vulnerable, profileType, ranked };
}
export type Result = ReturnType<typeof calculate>;
export const formatPercent = (value: number) => new Intl.NumberFormat("sv-SE", { maximumFractionDigits: 1 }).format(value);
export type SavedState = { version: number; index: number; answers: number[]; unlocked: boolean };
export function parseState(raw: string | null): SavedState | null {
  try {
    const data = JSON.parse(raw ?? "null");
    if (!data || data.version !== STATE_VERSION || !Array.isArray(data.answers) || data.answers.length !== 30
      || !data.answers.every((a: unknown) => typeof a === "number" && Number.isInteger(a) && a >= -1 && a <= 4)) return null;
    return { version: STATE_VERSION, index: Number.isInteger(data.index) ? Math.max(0, Math.min(29,data.index)) : 0, answers: data.answers, unlocked: data.unlocked === true };
  } catch { return null; }
}
