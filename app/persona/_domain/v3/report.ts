import type { Evidence, Finding, Paragraph, PersonaReport, SectionId } from "../types";
import { immutable } from "../immutable";
import { CORE_COUNT, SKIPPED, VERSIONS } from "./manifest";
import { coreQuestions, questions } from "./questions";
import { scoreDimensions } from "./score";
import { parseSubmission } from "./submission";

const sections = [
  ["portrait", "Personlighetsporträtt", "Här behövs tydligare svar som går att läsa tillsammans för att beskriva ett mönster."],
  ["signature", "Personlig signatur", "Dina svar ger inget tydligt par att sammanfatta i en personlig signatur."],
  ["dimensions", "Fem personlighetsdimensioner", "Värdena beskriver hur du svarade på de 30 grundfrågorna."],
  ["drivers", "Drivkrafter", "Svaren om valfrihet och delmål ger ingen tydlig bild av vad som motiverar dig."],
  ["relationships", "Relationella mönster", "Dina svar ger begränsad ledning om vad du föredrar i nära samtal."],
  ["tensions", "Inre motsägelser", "Svaren ger inget tydligt exempel på två tendenser som kan behöva olika utrymme."],
  ["strengths", "Styrkor och blinda fläckar", "Underlaget räcker inte för ett mer specifikt förslag om vad som fungerar för dig eller kan skava."],
  ["compass", "Personlig kompass", "Välj gärna ett påstående som väckte en tanke och lägg märke till när det stämmer i vardagen."],
] as const;

type Rule = {
  id: string; answers: readonly number[]; text: string; supports: readonly SectionId[];
  experiment?: boolean;
  signature?: string;
};

const rules: readonly Rule[] = [
  { id: "own-steps", answers: [31, 32], supports: ["portrait", "signature", "drivers"], signature: "Din egen väg, med tydliga delmål.",
    text: "Du vill gärna välja hur du gör. När vägen väl är din kan tydliga delmål hjälpa dig att hålla igång." },
  { id: "company-and-quiet", answers: [11, 38], supports: ["portrait", "signature", "tensions"], signature: "Bekväm i sällskap, med plats att varva ner själv.",
    text: "Du beskriver att du trivs i sällskap och att du varvar ner när du får en stund för dig själv. Sällskap och ensamhet fyller olika funktioner i dina svar." },
  { id: "ideas-and-familiar", answers: [10, 15], supports: ["portrait", "signature", "tensions"], signature: "Nyfiken på idéer, med fäste i det välbekanta.",
    text: "Du tycker om att höra nya idéer och föredrar ändå ofta det välbekanta. Dina svar skiljer på vad du gärna tänker på och vad du gärna håller dig till." },
  { id: "time-and-care", answers: [7, 34], supports: ["portrait", "signature", "relationships"], signature: "Medkänsla för andra, i din egen takt när du öppnar dig.",
    text: "Du känner med andra när de har det svårt, samtidigt som du gärna tar tid på dig innan du delar något personligt." },
  { id: "opinion-and-no", answers: [35, 36], supports: ["portrait", "signature", "tensions", "strengths"], signature: "Rakt om åsikter, ibland ett ja när du vill säga nej.",
    text: "Du brukar säga vad du tycker när någon nära tycker annorlunda, och ibland säger du ja fast du helst vill säga nej. Att uttrycka en åsikt och att ge ett besked kan fungera olika för dig." },
  { id: "plan-and-start", answers: [3, 18], supports: ["portrait", "signature", "tensions"], signature: "Trogen planen, när du väl har kommit igång.",
    text: "Du beskriver att du brukar hålla dig till en plan och att det ofta är svårt att komma igång. Starten och arbetet efteråt verkar vara två olika saker för dig." },
  { id: "autonomy", answers: [31], supports: ["drivers"],
    text: "Du uppger att motivationen ökar när du själv får välja hur du gör." },
  { id: "milestones", answers: [32], supports: ["drivers"],
    text: "Tydliga delmål hjälper dig enligt dina svar att hålla igång." },
  { id: "listen", answers: [33], supports: ["relationships"],
    text: "När du berättar om något svårt vill du helst att den andra börjar med att lyssna." },
  { id: "open-slowly", answers: [34], supports: ["relationships"],
    text: "Du brukar vilja ha lite tid innan du berättar något personligt för någon ny." },
  { id: "disagree", answers: [35], supports: ["relationships"],
    text: "Du uppger att du brukar säga vad du tycker även när någon du bryr dig om tycker annorlunda." },
  { id: "yes", answers: [36], supports: ["strengths"],
    text: "Du uppger att du ibland säger ja när du helst skulle säga nej. Det kan vara värt att lägga märke till när de två svaren skiljer sig." },
  { id: "pause", answers: [37], supports: ["strengths"],
    text: "Du uppger att du brukar märka tidigt när du behöver en paus. Det ger dig en signal att använda när det finns utrymme att stanna upp." },
  { id: "quiet", answers: [38], supports: ["compass"],
    text: "Eftersom du uppger att en stund för dig själv hjälper dig att varva ner, prova att planera in en kort sådan stund när du har möjlighet.", experiment: true },
  { id: "different-contexts", answers: [39], supports: ["portrait"],
    text: "Du beskriver att olika sidor av dig kommer fram beroende på vem du är med. Det är värt att ha med sig när du läser de breda dimensionsvärdena." },
  { id: "reply-later", answers: [36, 40], supports: ["compass"],
    text: "Nästa gång du får en fråga som kan vänta, prova att säga: ”Jag återkommer när jag har tänkt på det.” Det ger dig tid att märka vilket svar du vill ge.", experiment: true },
  { id: "time-to-think", answers: [40], supports: ["compass"],
    text: "Du vill ge dig själv mer tid att tänka innan du svarar. Prova det först i ett enkelt samtal där ett svar inte behöver komma direkt.", experiment: true },
  { id: "small-step", answers: [32], supports: ["compass"],
    text: "När något känns stort, välj en liten del som går att avsluta idag. Det bygger på ditt svar om att tydliga delmål hjälper dig.", experiment: true },
];

const evidenceFor = (index: number, answers: readonly number[]): Evidence => ({
  questionId: questions[index].id, answer: answers[index],
});

export function buildReport(input: unknown): PersonaReport {
  const { answers } = parseSubmission(input);
  const dimensions = scoreDimensions(answers);
  const enough = dimensions.filter(dimension => dimension.value !== null).length;
  const warnings = enough < 5 ? ["Någon dimension har färre än fyra svar. Du kan fylla i fler svar för att få hela porträttet."]
    : dimensions.some(dimension => dimension.valid < 6) ? ["Några grundfrågor hoppades över. Se antalet svar vid varje dimension."] : [];
  const matched = rules.filter(rule => rule.answers.every(number => answers[number - 1] >= 4))
    .filter(rule => !(rule.id === "time-to-think" && answers[35] >= 4));
  const findings: Finding[] = matched.map(rule => ({
    id: rule.id, ruleId: rule.id, kind: rule.answers.length > 1 ? "combination" : "observation",
    title: "", text: rule.text, supports: rule.supports, strength: "specific",
    evidence: rule.answers.map(number => evidenceFor(number - 1, answers)), counterEvidence: [],
  }));
  const dimensionFindings: Finding[] = dimensions.flatMap(dimension => {
    if (dimension.value === null) return [];
    const coded = (item: Evidence) => coreQuestions.find(question => question.id === item.questionId)?.reverse ? 6 - item.answer : item.answer;
    const low = dimension.evidence.find(item => coded(item) <= 2);
    const high = dimension.evidence.find(item => coded(item) >= 4);
    const example = (item: Evidence) => {
      const prompt = questions.find(question => question.id === item.questionId)?.prompt;
      return `”${prompt}” (${item.answer} av 5)`;
    };
    const neutral = dimension.evidence.every(item => item.answer === 3);
    const text = low && high
      ? `Inom ${dimension.name.toLowerCase()} går svaren åt olika håll när frågornas riktning har räknats in. Två svar i underlaget är ${example(low)} och ${example(high)}. Se vilket sammanhang varje fråga beskriver.`
      : neutral ? `På alla ${dimension.valid} besvarade påståenden om ${dimension.name.toLowerCase()} valde du mittenalternativet.`
      : `Ditt värde för ${dimension.name.toLowerCase()} sammanfattar ${dimension.valid} svar på skalan från 1 till 5.`;
    return [{
      id: `dimension-${dimension.dimension}`, ruleId: "dimension-summary", kind: "dimension", title: dimension.name,
      text, supports: ["dimensions"], strength: dimension.valid < 6 ? "limited" : "specific",
      evidence: dimension.evidence, counterEvidence: [],
    }];
  });
  findings.push(...dimensionFindings);
  const firstClear = answers.findIndex((answer, index) => index < CORE_COUNT && answer !== SKIPPED && answer !== 3);
  if (firstClear >= 0) {
    const answer = answers[firstClear];
    findings.push({
      id: "grounded-answer", ruleId: "direct-answer", kind: "observation", title: "",
      text: `Påståendet ”${questions[firstClear].prompt}” ${answer >= 4 ? "stämmer enligt ditt svar väl in på dig" : "stämmer enligt ditt svar dåligt in på dig"}. Fundera gärna på i vilka sammanhang svaret stämmer bäst.`,
      evidence: [evidenceFor(firstClear, answers)], counterEvidence: [], supports: ["portrait"], strength: "specific",
    });
  }
  // A fully neutral dimension is still real evidence, but only supports a descriptive finding.
  const observations = findings.filter(finding => matched.some(rule => rule.id === finding.id && !rule.experiment));
  const preview = observations.find(finding => finding.kind === "combination")
    ?? observations[0]
    ?? findings.find(finding => finding.id === "grounded-answer") ?? dimensionFindings[0];

  return immutable({
    product: "persona_test", questionVersion: VERSIONS.question, reportVersion: VERSIONS.report,
    analysisVersion: VERSIONS.analysis, dimensions, findings,
    sections: sections.map(([id, title, fallback]) => {
      const relevant = findings.filter(finding => finding.supports.includes(id));
      const selected = id === "signature" ? relevant.slice(0, 1)
        : id === "portrait" ? (relevant.some(item => item.id !== "grounded-answer")
          ? relevant.filter(item => item.id !== "grounded-answer").slice(0, 3) : relevant)
        : id === "drivers" && relevant.some(item => item.id === "own-steps") ? relevant.slice(0, 1) : relevant;
      const paragraphs: Paragraph[] = selected.map(finding => ({
        id: `${id}-${finding.id}`, text: id === "signature" ? matched.find(rule => rule.id === finding.id)?.signature ?? finding.text : finding.text, findingIds: [finding.id],
        scope: matched.find(rule => rule.id === finding.id)?.experiment ? "experiment" : "personal",
      }));
      if (!paragraphs.length) paragraphs.push({ id: `${id}-method`, text: fallback, findingIds: [], scope: "method" });
      return { id, title, paragraphs };
    }),
    preview: preview ? { text: preview.text, findingIds: [preview.id] }
      : { text: "Det behövs fler besvarade grundfrågor för en personlig insikt.", findingIds: [] },
    quality: { eligible: enough === 5, dimensionsWithEnoughAnswers: enough,
      validReflections: answers.slice(CORE_COUNT).filter(answer => answer !== SKIPPED).length,
      unknownCount: answers.filter(answer => answer === SKIPPED).length, warnings },
  });
}
