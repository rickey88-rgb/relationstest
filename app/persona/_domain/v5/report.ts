import { immutable } from "../immutable";
import type { Finding, Paragraph, PersonaReport, ReportSection, SectionId } from "../types";
import { analyze, type Candidate } from "../v4/analysis";
import { selectComparison } from "./comparison";
import { SECTION_TITLES, VERSIONS } from "./manifest";
import { parseSubmission } from "./submission";

const contextNote = "Läs mönstret som en möjlig tolkning. Svaren rymmer också variation eller bortfall.";

function profile(input: unknown) {
  const { answers } = parseSubmission(input);
  const analysis = analyze(answers);
  return { answers, ...analysis, comparison: selectComparison(analysis.dimensions) };
}

export function buildReport(input: unknown): PersonaReport {
  const { answers, dimensions, candidates, eligible, comparison } = profile(input);
  const [lead, second] = candidates;
  const sections: ReportSection[] = [];
  const findings: Finding[] = [];

  function add(id: keyof typeof SECTION_TITLES, ...paragraphs: Paragraph[]) {
    if (paragraphs.length || id === "dimensions") sections.push({ id, title: SECTION_TITLES[id], paragraphs });
  }

  function paragraph(id: SectionId, text: string, candidate?: Candidate, scope: Paragraph["scope"] = "personal"): Paragraph {
    const itemId = `${id}-${findings.length + 1}`;
    const source = candidate ?? comparison;
    if (!source) return { id: itemId, text, findingIds: [], scope };
    findings.push({
      id: itemId, ruleId: candidate?.pattern.id ?? `comparison-${comparison?.lens.keys.join("-")}`,
      title: candidate?.pattern.name ?? comparison?.lens.title ?? "", text, kind: candidate ? "pattern" : "dimension",
      evidence: source.evidence, counterEvidence: candidate?.counterEvidence ?? [],
      dimensions: candidate?.dimensions ?? comparison?.lens.keys ?? [], context: candidate?.context ?? [],
      supports: [id], strength: source.qualified || !candidate ? "limited" : "recurrent",
    });
    return { id: itemId, text, findingIds: [itemId], scope };
  }

  if (lead) {
    add("signature",
      paragraph("signature", lead.pattern.name, lead),
      paragraph("signature", lead.pattern.core, lead),
      ...(lead.qualified ? [{ id: "signature-note", text: contextNote, findingIds: [], scope: "method" } as const] : []),
    );
  } else if (comparison) {
    add("signature", paragraph("signature", comparison.lens.title),
      paragraph("signature", comparison.lens.distinction + " Det är ett sätt att undersöka när olika sidor får betydelse i dina egna situationer."));
  }
  add("dimensions", ...(comparison ? [paragraph("dimensions", comparison.reading)] : []));

  if (second) {
    add("portrait", paragraph("portrait", second.pattern.core, second));
  } else if (lead?.pattern.driver) {
    add("portrait", paragraph("portrait", lead.pattern.driver, lead));
  }

  if (lead) {
    add("strengths", paragraph("strengths", lead.pattern.strength, lead), paragraph("strengths", lead.pattern.risk, lead));
    const relational = candidates.find(candidate => candidate.pattern.relationship);
    const newAngle = comparison?.lens.keys.some(key => !lead.dimensions.includes(key));
    if (relational?.pattern.relationship) {
      add("relationships", paragraph("relationships", relational.pattern.relationship, relational));
    } else if (newAngle && lead.dimensions.length >= 2 && comparison) {
      add("relationships", paragraph("relationships", comparison.lens.decision));
    } else {
      add("relationships", paragraph("relationships", lead.pattern.scene, lead));
    }
    add("compass", paragraph("compass", lead.pattern.experiment, lead, "experiment"));
  } else if (comparison) {
    const { lens } = comparison;
    add("strengths", paragraph("strengths", `En möjlighet att prova: ${lens.strength}`),
      paragraph("strengths", `En fallgrop att hålla utkik efter: ${lens.risk}`));
    add("relationships", paragraph("relationships", lens.decision));
    add("compass", paragraph("compass", lens.experiment, undefined, "experiment"));
  }

  return immutable({
    product: "persona_test", questionVersion: VERSIONS.question, reportVersion: VERSIONS.report, analysisVersion: VERSIONS.analysis,
    dimensions, findings, sections, preview: { text: "", findingIds: [] },
    quality: {
      eligible, dimensionsWithEnoughAnswers: dimensions.filter(item => item.value !== null).length,
      validReflections: answers.slice(30).filter(Boolean).length, unknownCount: answers.filter(value => value === 0).length,
      warnings: [],
    },
  });
}

export function buildTeaser(input: unknown) {
  const { candidates, eligible, comparison } = profile(input);
  const lead = candidates.find(candidate => candidate.dimensions.length >= 2);
  if (lead) {
    const [headline, text, why, deeper] = lead.pattern.free;
    return { eligible, headline, text, why, deeper, evidence: lead.evidence, counterEvidence: lead.counterEvidence, qualified: lead.qualified };
  }
  if (comparison) return {
    eligible, headline: comparison.lens.title,
    text: `I din karta: ${comparison.scores}. ${comparison.lens.distinction}`,
    why: "Samma situation kan ställa olika krav på de två sidorna. Se vilken som spelar roll just då.",
    deeper: "I rapporten får du ett vardagsexempel och ett försök för att se när skillnaden spelar roll för dig.",
    evidence: comparison.evidence, counterEvidence: [], qualified: comparison.qualified,
  };
  return {
    eligible, headline: "Fyll i fler grundfrågor",
    text: "Två dimensioner behöver ha ett värde för att vi ska kunna jämföra dem.",
    why: undefined, deeper: undefined, evidence: [], counterEvidence: [], qualified: false,
  };
}
