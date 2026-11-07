import type { Finding, Paragraph, PersonaReport, ReportSection, SectionId } from "../types";
import { immutable } from "../immutable";
import { FIXED_COUNT, UNKNOWN, VERSIONS } from "./manifest";
import { answerMap } from "./answers";
import { selectAdaptive } from "./adaptive";
import { deriveFindings, matchingEvidence, rankNarrative } from "./findings";
import { experiments } from "./experiments";
import { fixedQuestions, getQuestion } from "./questions";
import { scoreDimensions } from "./score";
import { parseSubmission } from "./submission";

export const sectionTitles: Readonly<Record<SectionId, string>> = immutable({
  portrait: "Personlighetsporträtt", signature: "Personlig signatur", dimensions: "Fem personlighetsdimensioner",
  drivers: "Drivkrafter", relationships: "Relationella mönster", tensions: "Inre motsägelser",
  strengths: "Styrkor och blinda fläckar", compass: "Personlig kompass",
});
const personal = (id: string, finding: Finding): Paragraph => ({ id, text: finding.text, findingIds: [finding.id], scope: "personal" });
const method = (id: string, text: string): Paragraph => ({ id, text, findingIds: [], scope: "method" });
const section = (id: SectionId, paragraphs: Paragraph[]): ReportSection => ({ id, title: sectionTitles[id], paragraphs });
const uniqueEvidence = (findings: readonly Finding[]) => new Set(findings.flatMap(f => f.evidence.map(e => e.questionId)));

/** Greedy editorial coverage of evidence; ties retain the versioned catalogue priority. */
function variedFindings(candidates: readonly Finding[], count: number): Finding[] {
  const result: Finding[] = [];
  const remaining = [...candidates];
  while (remaining.length && result.length < count) {
    const seen = uniqueEvidence(result);
    let best = 0;
    let fresh = -1;
    remaining.forEach((f, i) => {
      const added = f.evidence.filter(e => !seen.has(e.questionId)).length;
      if (added > fresh) { best = i; fresh = added; }
    });
    if (fresh === 0) break;
    result.push(remaining.splice(best, 1)[0]);
  }
  return result;
}

/** No network, clocks, random state, environment or client-provided analysis. */
export function buildReport(input: unknown): PersonaReport {
  const submission = parseSubmission(input);
  const fixed = submission.answers.slice(0, FIXED_COUNT);
  const selection = selectAdaptive(fixed);
  const dimensions = scoreDimensions(fixed);
  const findings = deriveFindings(submission.answers, selection.selectedIds, dimensions);
  const values = answerMap(submission.answers, selection.selectedIds);
  const narrative = rankNarrative(findings);
  const observation = (id: string) => findings.find(f => f.id.startsWith(`obs:${id}:`));
  const observationsFor = (ids: readonly string[]) => ids.map(observation).filter((f): f is Finding => Boolean(f));
  const validScenarios = fixedQuestions.filter((q, i) => q.kind === "scenario" && fixed[i] !== UNKNOWN).length;
  const enoughDimensions = dimensions.filter(d => d.valid >= 2).length;
  const unknownCount = submission.answers.filter(value => value === UNKNOWN).length;
  const warnings: string[] = [];
  if (validScenarios < 10) warnings.push("Färre än tio fasta scenarier är bedömbara.");
  if (enoughDimensions < 4) warnings.push("Färre än fyra dimensioner har minst två bedömbara svar.");
  if (dimensions.some(d => d.varied)) warnings.push("Det finns stora skillnader mellan svar inom minst en dimension.");
  if (selection.candidates.some(c => selection.selectedIds.includes(c.id) && c.reason === "fallback")) warnings.push("Minst en följdfråga valdes genom reservordningen utan en matchad ingång.");
  const quality = { eligible: validScenarios >= 10 && enoughDimensions >= 4, validScenarios,
    dimensionsWithEnoughAnswers: enoughDimensions, unknownCount, warnings };

  const lead = variedFindings(narrative, 3);
  const seen = uniqueEvidence(lead);
  const supporting = observationsFor(["P10", "P11", "P18", "P24", "P33", "P34", "P02", "P16"])
    .filter(f => !seen.has(f.evidence[0].questionId)).slice(0, lead.length ? 2 : 4);
  const portrait = [...lead, ...supporting];
  const sections: ReportSection[] = [];
  sections.push(section("portrait", [
    method("portrait-context", "Porträttet beskriver dina val i tänkta situationer och dina egna skattningar. Det är inte en redogörelse för sådant som faktiskt hänt i ditt liv och inte ett diagnostiskt instrument."),
    ...(quality.eligible ? [] : [method("portrait-limited", "Underlaget når inte modellens gräns för en fullständig premiumrapport. Granska svaren före köp eller publicering; enstaka observationer nedan ska inte läsas som ett samlat porträtt.")]),
    ...portrait.map((f, i) => personal(`portrait-${i + 1}`, f)),
    ...(portrait.length ? [] : [method("portrait-empty", "Det finns inget bedömbart scenariounderlag för ett personligt porträtt. Inga egenskaper fylls i åt dig.")]),
  ]));
  const signature = lead[0] ?? portrait[0];
  sections.push(section("signature", signature ? [{ id: "signature-claim", text: signature.title,
    findingIds: [signature.id], scope: "personal" },
    method("signature-context", "Signaturen är en redaktionell rubrik för ett belagt mönster eller ett specifikt val i rapporten. Den är ingen personlighetstyp eller unik psykologisk kod.")]
    : [method("signature-empty", "Ingen personlig signatur sätts när underlaget saknas.")]));
  sections.push(section("dimensions", [
    method("dimensions-context", "Fem etablerade personlighetsbegrepp används som orienteringsram. Varje dimension bygger på tre egna nyskrivna indikatorer. Scenariosvar och adaptiva svar räknas inte in. Skalan är inte normerad, och ett internt värde är varken percentil eller sannolikhet."),
    ...dimensions.map(d => {
      const finding = findings.find(f => f.id === `dimension:${d.dimension}`);
      return finding ? personal(`dimension-${d.dimension}`, finding)
        : method(`dimension-${d.dimension}`, `${d.name}: inget bedömbart underlag. Ett saknat svar ersätts inte med ett mittensvar.`);
    }),
  ]));
  const adaptiveDrivers = selection.selectedIds.filter(id => ["R", "L", "M"].includes(getQuestion(id).theme!) || id === "A18");
  const drivers = [...variedFindings(observationsFor(["P33", "P11", "P16", "P21", "P04"]), 3), ...observationsFor(adaptiveDrivers)];
  sections.push(section("drivers", [method("drivers-context", "Här betyder drivkrafter vad du uttryckligen väljer att ge plats i de här situationerna. Texten fastställer inga hemliga eller omedvetna motiv."),
    ...drivers.map((f, i) => personal(`drivers-${i}`, f)),
    ...(drivers.length ? [] : [method("drivers-empty", "Det saknas bedömbara val för att beskriva personliga prioriteringar.")]),
  ]));
  const adaptiveRelations = selection.selectedIds.filter(id => ["F", "G"].includes(getQuestion(id).theme!) || id === "A17");
  const relations = [...variedFindings(observationsFor(["P24", "P26", "P28", "P30", "P22", "P18"]), 4), ...observationsFor(adaptiveRelations)];
  sections.push(section("relationships", [method("relationships-context", "Relationella val kan skilja sig mellan sammanhang. De används inte för att tilldela en anknytningstyp eller förklara varför du blivit sådan."),
    ...relations.map((f, i) => personal(`relationships-${i}`, f)),
    ...(relations.length ? [] : [method("relationships-empty", "Det saknas bedömbart underlag för relationella observationer.")]),
  ]));
  const tensions = [...variedFindings(narrative.filter(f => f.supports.includes("tensions")), 3), ...observationsFor(selection.selectedIds.filter(id => id === "A16"))];
  sections.push(section("tensions", [method("tensions-context", "Avsnittet handlar om skilda prioriteringar och sammanhang. Skillnader är inte bevis på lögn eller på att en sida är mer äkta."),
    ...tensions.map((f, i) => personal(`tensions-${i}`, f)),
    ...(tensions.length ? [] : [method("tensions-empty", "Inga av modellens specificerade kombinationer för en personlig spänning framträder. Rapporten hittar inte på en motsägelse för att fylla avsnittet.")]),
  ]));
  const selectedExperiments = experiments.map(experiment => ({ experiment, evidence: matchingEvidence(values, experiment.conditions) }))
    .filter(item => item.evidence.length > 0)
    .sort((a, b) => b.evidence.length - a.evidence.length || (a.experiment.id < b.experiment.id ? -1 : 1)).slice(0, 3);
  const experimentRefs = (evidence: readonly { questionId: string; answer: number }[]) => evidence.map(e => `obs:${e.questionId}:${e.answer}`);
  sections.push(section("strengths", [method("strengths-context", "Möjliga tillgångar och kostnader beskrivs villkorligt. Svaren visar val, inte att du redan har en viss förmåga eller ett visst problem."),
    ...selectedExperiments.flatMap(({ experiment, evidence }) => [
      { id: `opportunity-${experiment.id}`, text: experiment.opportunity, findingIds: experimentRefs(evidence), scope: "experiment" as const },
      { id: `tradeoff-${experiment.id}`, text: experiment.tradeoff, findingIds: experimentRefs(evidence), scope: "experiment" as const },
    ]),
    ...(selectedExperiments.length ? [] : [method("strengths-empty", "Underlaget räcker inte för att knyta en personlig tillgång eller kostnad till svaren.")]),
  ]));
  sections.push(section("compass", [method("compass-context", "Välj gärna ett av följande små experiment. De är förslag att pröva, inte behandling eller påståenden om vad du behöver."),
    ...selectedExperiments.map(({ experiment, evidence }) => ({ id: `experiment-${experiment.id}`,
      text: `${experiment.title}. ${experiment.action} Reflektion: ${experiment.reflection}`,
      findingIds: experimentRefs(evidence), scope: "experiment" as const })),
    ...(selectedExperiments.length ? [] : [method("compass-empty", "Börja med att granska frågor du hade svårt att bedöma. Något personligt experiment väljs inte utan ett bedömbart underlag.")]),
  ]));
  const previewFinding = lead[0] ?? portrait[0];
  return immutable({ product: "persona_test", questionVersion: VERSIONS.question, reportVersion: VERSIONS.report,
    analysisVersion: VERSIONS.analysis, adaptiveVersion: VERSIONS.adaptive, selection, dimensions, findings, sections,
    preview: previewFinding ? { text: previewFinding.text, findingIds: [previewFinding.id] }
      : { text: "Det finns för lite bedömbart underlag för en personlig förhandsvisning. Granska dina svar innan du går vidare.", findingIds: [] },
    quality });
}
