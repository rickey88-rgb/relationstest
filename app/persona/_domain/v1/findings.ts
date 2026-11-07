import type { Condition, DimensionScore, Evidence, Finding, SectionId } from "../types";
import { immutable } from "../immutable";
import { UNKNOWN } from "./manifest";
import { answerMap, evidenceFor } from "./answers";
import { fixedQuestions, getQuestion } from "./questions";
import { observations } from "./copy";

export const c = (questionId: string, answers: readonly number[]): Condition => ({ questionId, answers });
type Rule = Readonly<{ id: string; title: string; text: string; conditions: readonly Condition[]; minimum?: number; counters?: readonly Condition[]; supports: readonly SectionId[] }>;
const portrait: readonly SectionId[] = ["portrait", "signature", "drivers", "relationships", "strengths"];
const tension: readonly SectionId[] = [...portrait, "tensions"];
export const narrativeRules: readonly Rule[] = immutable([
  { id: "recognition-precision", title: "Att bli sedd i det du försöker göra", conditions: [c("P10", [0, 2]), c("P33", [0, 3])], supports: tension,
    text: "Din egen bedömning och andras förståelse får plats på olika sätt i svaren. Du vill synliggöra den del av arbetet som betyder något för dig, samtidigt som du väljer kvalitet eller egen förankring framför en omedelbar publikreaktion. Frågan blir vilken sorts återkoppling som tillför något i varje läge." },
  { id: "success-and-relationship", title: "En egen väg med relationell precision", conditions: [c("P04", [0]), c("P11", [0])], supports: portrait,
    text: "Du väljer att kliva fram när en möjlighet betyder något för dig. När en vän söker samma uppdrag vill du prata om konkurrensen; när en grupp berörs av din nästa möjlighet vill du ordna överlämningen. I de två situationerna väljer du egen rörelse och ett konkret ansvar för hur övergången blir för andra." },
  { id: "visible-responsibility", title: "Att stå för sin del", conditions: [c("P02", [0]), c("P14", [0]), c("P20", [0])], minimum: 3, supports: portrait,
    text: "I flera av scenarierna gör du ansvar synligt: du klargör ditt bidrag, använder ditt mandat och berättar när du själv missat något. Det ger ett återkommande mönster i just de situationerna. Att få erkännande och att stå för ett misstag får båda ett uttalat språk." },
  { id: "trust-with-boundaries", title: "Närhet på förändrade villkor", conditions: [c("P18", [1, 2]), c("P28", [1, 3])], supports: tension,
    text: "Efter ett förtroendebrott väljer du att förändra insynen eller avståndet mellan er. Du lovar i de här situationerna ingen omedelbar återgång till samma närhet. Det ger stöd för en särskild nyans: att fortfarande förhålla sig till en relation behöver inte betyda att dess tidigare villkor ska återställas." },
  { id: "support-by-agreement", title: "Vilken hjälp är välkommen?", conditions: [c("P22", [1]), c("P26", [0, 2])], supports: portrait,
    text: "Du ger samtalets form betydelse när någon behöver stöd. Du frågar vilken hjälp som är välkommen och skiljer känslomässigt stöd från en bedömning av sakfrågan. I de två situationerna försöker du hitta en ingång som passar mottagaren." },
  { id: "selected-audience", title: "Respons från rätt krets", conditions: [c("P33", [2]), c("A02", [3])], supports: portrait,
    text: "Du väljer en mindre publik vars omdöme betyder något, och söker samma slags relevans när uppskattningen missar det du försökte åstadkomma. I dessa val handlar publikens värde om vilka som kan möta arbetet, inte bara om hur många de är." },
  { id: "decision-context", title: "Ansvar med synliga förutsättningar", conditions: [c("P14", [0]), c("A08", [1])], supports: portrait,
    text: "Du väljer att använda ditt mandat, och vill efter ett sämre utfall börja med vad som var känt vid beslutet. I den kombinationen får både ditt ansvar och förutsättningarna för bedömningen plats. Hur du skiljer mellan förklaring och ansvar blir en möjlig fråga att följa vidare." },
  { id: "private-support", title: "Avgränsat ansvar och personlig insyn", conditions: [c("P24", [1, 2]), c("P18", [1]), c("P28", [1])], minimum: 3, supports: portrait,
    text: "I flera situationer väljer du att avgränsa vad du lämnar över: hur hjälpen ska se ut eller vad någon får veta. Svaren skiljer mellan att ha en relation och att ge samma person tillgång till alla delar av det personliga. De beskriver en vald gräns, inte orsaken till att du behöver den." },
  { id: "flexible-with-frames", title: "En föränderlig väg inom tydliga ramar", conditions: [c("P08", [1, 3]), c("P32", [3, 4])], supports: tension,
    text: "Du beskriver ett följsamt arbetssätt och vill samtidigt klargöra ansvar eller ramar när någon uppfattar dig som styrande. De svaren gäller olika delar av arbetet. Du kan vilja ändra vägen och ändå ha en överenskommelse om vilka delar du håller i; underlaget avgör inte exakt var gränsen går för dig." },
  { id: "own-view-and-support", title: "Egen bedömning och önskat stöd", conditions: [c("P33", [0, 3]), c("P34", [0, 1])], supports: tension,
    text: "I den skapande situationen ger du din egen bedömning stor plats. Inför ett viktigt beslut vill du samtidigt få stöd eller kritisk prövning från någon du respekterar. Det är två olika uppgifter som andras respons kan ha. Svaren ger ingen anledning att kalla den ena sidan mer äkta än den andra." },
  { id: "delegation-and-limits", title: "Lämna över och förtydliga", conditions: [c("P08", [2]), c("P14", [3]), c("A09", [2])], minimum: 3, supports: tension,
    text: "Du väljer att låta andra leda och att ge sakkunskap inflytande. När andra ändrat arbetssättet utan dig vill du också prata om vem som ska äga vilka beslut. I den kombinationen betyder överlämning inte att ansvarsfördelningen behöver vara outtalad." },
  { id: "sharing-and-trust", title: "Öppenhet med villkor för närhet", conditions: [c("P16", [3]), c("P24", [0]), c("P18", [1, 2]), c("P28", [1, 3])], minimum: 4, supports: tension,
    text: "Du kan vilja dela en blandad känsla och be om lyssnande medan tanken tar form. Efter ett förtroendebrott väljer du däremot mindre insyn eller mer avstånd. Svaren ger ett nyanserat porträtt av delning: personlig öppenhet i en situation bestämmer inte vilka villkor du behöver i en annan." },
  { id: "negotiated-relationships", title: "Att göra villkoren till ett samtal", minimum: 3,
    conditions: [c("P04", [0]), c("P11", [3]), c("P22", [1]), c("P26", [2]), c("P30", [2])],
    counters: [c("P04", [2]), c("P22", [0]), c("P26", [1]), c("P30", [3])], supports: portrait,
    text: "I flera av scenarierna väljer du ett samtal om hur relationen eller hjälpen ska fungera. Du ger den andras perspektiv en uttalad plats innan formen är bestämd. Det är ett återkommande val i dessa situationer, inte ett påstående om hur alla dina relationer fungerar." },
]);

export function deriveFindings(answers: readonly number[], adaptiveIds: readonly string[], dimensions: readonly DimensionScore[]): readonly Finding[] {
  const values = answerMap(answers, adaptiveIds);
  const findings: Finding[] = [];
  for (const q of [...fixedQuestions, ...adaptiveIds.map(getQuestion)]) {
    const answer = values.get(q.id)!;
    if (answer === UNKNOWN || q.kind !== "scenario") continue;
    const text = observations[q.id]?.[answer]
      ?? `I följdfrågan ”${q.title}” väljer du: ”${q.options[answer]}” Det är ett situationsbundet val som fördjupar underlaget; det fastställer ingen bakomliggande orsak.`;
    findings.push({ id: `obs:${q.id}:${answer}`, ruleId: `observation:${q.id}`, title: q.title, text,
      kind: "observation", evidence: [evidenceFor(q.id, answer)], counterEvidence: [], supports: q.supports, strength: "situational" });
  }
  for (const rule of narrativeRules) {
    const evidence = rule.conditions.filter(item => item.answers.includes(values.get(item.questionId)!))
      .map(item => evidenceFor(item.questionId, values.get(item.questionId)!));
    if (evidence.length < (rule.minimum ?? rule.conditions.length)) continue;
    const counterEvidence = (rule.counters ?? []).filter(item => item.answers.includes(values.get(item.questionId)!))
      .map(item => evidenceFor(item.questionId, values.get(item.questionId)!));
    findings.push({ id: `finding:${rule.id}`, ruleId: rule.id, title: rule.title,
      text: rule.text + (counterEvidence.length ? " I andra scenarier väljer du en annan väg. De nyanserande svaren behöver läsas tillsammans med mönstret." : ""),
      kind: evidence.length >= 3 ? "pattern" : "combination", evidence, counterEvidence,
      supports: rule.supports, strength: evidence.length >= 3 ? "recurrent" : "specific" });
  }
  for (const score of dimensions) {
    if (score.valid === 0) continue;
    const direction = score.level === "lower" ? "Svaren lutar mot dimensionens lägre riktning."
      : score.level === "higher" ? "Svaren lutar mot dimensionens högre riktning."
      : score.level === "middle" ? "Svaren ligger i ett mellanläge."
      : "Det finns för få bedömbara svar för en samlad riktning enligt modellens regler.";
    findings.push({ id: `dimension:${score.dimension}`, ruleId: `dimension-v1:${score.dimension}`, title: score.name,
      text: `${score.name}: ${direction} ${score.valid} av 3 frågor är bedömbara.`
        + (score.varied ? " De kodade svaren skiljer sig minst tre steg. Läs därför de enskilda frågorna innan du gör en sammanfattning." : "")
        + " Detta är en begränsad självskattning med nyskrivna indikatorer, utan normjämförelse.",
      kind: "dimension", evidence: score.evidence, counterEvidence: [], supports: ["dimensions"], strength: "limited" });
  }
  return immutable(findings);
}

export function rankNarrative(findings: readonly Finding[]): Finding[] {
  // Equal support is ordered by the versioned editorial catalogue, not by incidental rule names.
  const priority = new Map(narrativeRules.map((rule, index) => [rule.id, index]));
  return findings.filter(f => f.kind === "pattern" || f.kind === "combination")
    .sort((a, b) => b.evidence.length - a.evidence.length || priority.get(a.ruleId)! - priority.get(b.ruleId)!);
}

export function matchingEvidence(values: ReadonlyMap<string, number>, conditions: readonly Condition[]): Evidence[] {
  return conditions.filter(item => item.answers.includes(values.get(item.questionId)!))
    .map(item => evidenceFor(item.questionId, values.get(item.questionId)!));
}
