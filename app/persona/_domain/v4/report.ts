import type { Finding, PersonaReport, ReportSection } from "../types";
import { immutable } from "../immutable";
import { analyze, type Candidate } from "./analysis";
import { SECTION_TITLES, VERSIONS } from "./manifest";
import { parseSubmission } from "./submission";

const fallback = {
  signature: "En öppen profilbild. Underlaget skiljer inte ut någon tillräckligt tydlig kombination för ett profilnamn.",
  portrait: "Enstaka starka svar kan säga något om en situation, men de räcker inte för ett samlat personlighetsmönster. Dimensionsöversikten visar vilket underlag som finns.",
  drivers: "Vi ser inget tillräckligt tydligt samspel som kan förklara vad som gör ett mål lättare att hålla fast vid.",
  tensions: "Ingen specifik inre spänning har tillräckligt stöd. Olika svar är inte i sig ett tecken på konflikt.",
  relationships: "Underlaget räcker inte för att dra ett bredare mönster om dina relationer.",
  strengths: "En kombination av styrkor går inte att urskilja med tillräckligt stöd här.",
  blindSpots: "Vi pekar inte ut en risk utan stöd i ett återkommande mönster.",
  compass: "Ett sätt att få mer vägledning är att jämföra två verkliga situationer där samma val kändes olika. Skriv ned vad som skilde dem åt innan du letar efter ett återkommande mönster.",
  practice: "Välj ett beslut som går att ändra. Pröva en väg i liten skala och notera vad som faktiskt gjorde valet lättare.",
  summary: "Öppen profilbild. Underlaget räcker för reflektion men ger ännu ingen tydlig huvudkombination att sammanfatta.",
} as const;

const share: Record<string, string> = {
  "explore-then-build": "Jag kan ge nya möjligheter en form som går att pröva.",
  "wide-then-light": "Jag hittar gärna en ny väg när den första inte längre fungerar.",
  "bring-people-along": "Jag kan få ett samtal i rörelse och göra det lättare för fler att delta.",
  "clear-course": "Jag kan föreslå en riktning som gör det lättare att se vad som ännu är öppet.",
  "careful-bridge": "Jag kan hålla kvar en viktig fråga även när samtalet redan har gått vidare.",
  "private-track": "Jag hittar ofta en egen infallsvinkel om en tanke får växa i fred.",
  "steady-execution": "Jag kan hålla isär vad som är bråttom och vad som behöver göras.",
  "prepare-under-pressure": "Jag kan göra något handlingsbart av en stark signal.",
  "respond-fast": "Jag kan ändra kurs tidigt och vinner på att skilja små försök från stora besked.",
  "warm-stakes": "Jag kan göra de mänskliga följderna synliga innan ett beslut blir svårt att ändra.",
  "calm-boundary": "Jag kan hålla en gräns med lugn och ge andra sammanhanget bakom den.",
  "reliable-care": "Jag kan göra hjälp lättare att ta emot genom att göra den tydlig och möjlig att följa upp.",
  "measured-focus": "Jag kan göra stora val lättare genom att jämföra konsekvenserna i vardagen.",
  "social-motion": "Jag kan använda ett samtal för att hitta ett alternativ som ingen hade från början.",
  "quiet-consistency": "Jag kan ge ett gemensamt arbete stadga och visa vad som återstår.",
  "different-speed": "Jag kan märka att något kostar energi och ändå agera lugnt när det behövs.",
  "start-versus-course": "Jag kan hålla riktning när jag är igång och göra starten till en mindre uppgift.",
  "opinion-versus-request": "Jag kan vara tydlig med min åsikt och ge själva beslutet mer tid.",
};

const note = "Läs det här som en möjlig tolkning. Underlaget rymmer en blandad eller begränsad signal.";
const find = (candidates: Candidate[], field: "driver" | "relationship" | "tension") => candidates.find(({ pattern }) => pattern[field]);
const ids = Object.keys(SECTION_TITLES) as (keyof typeof SECTION_TITLES)[];

export function buildReport(input: unknown): PersonaReport {
  const { answers } = parseSubmission(input);
  const { dimensions, candidates, eligible } = analyze(answers);
  const [lead] = candidates;
  const second = lead && candidates.slice(1).find(candidate => candidate.pattern.keys.some(key => !lead.pattern.keys.includes(key)));
  const assignments: Partial<Record<keyof typeof SECTION_TITLES, [Candidate, string]>> = {};
  if (lead) {
    assignments.signature = [lead, lead.pattern.name];
    assignments.portrait = [lead, lead.pattern.core];
    assignments.strengths = [lead, lead.pattern.strength];
    assignments.blindSpots = [lead, lead.pattern.risk];
    assignments.summary = [lead, `${lead.pattern.name}. ${share[lead.pattern.id]}`];
  }
  if (lead) {
    assignments.compass = [lead, lead.pattern.experiment];
    assignments.practice = [lead, lead.pattern.scene];
  }
  const driver = find(candidates, "driver");
  const relationship = find(candidates, "relationship");
  const tension = find(candidates.filter(candidate => candidate.pattern.keys.length === 0 || !candidate.qualified), "tension");
  if (driver?.pattern.driver) assignments.drivers = [driver, driver.pattern.driver];
  if (relationship?.pattern.relationship) assignments.relationships = [relationship, relationship.pattern.relationship];
  if (tension?.pattern.tension) assignments.tensions = [tension, tension.pattern.tension];

  const findings: Finding[] = [];
  const sections: ReportSection[] = ids.map(id => {
    const selected = assignments[id];
    if (!selected) return { id, title: SECTION_TITLES[id], paragraphs: [{ id: `${id}-method`, text: fallback[id], findingIds: [], scope: "method" }] };
    const [candidate, text] = selected;
    const findingId = `${candidate.pattern.id}-${id}`;
    findings.push({
      id: findingId, ruleId: candidate.pattern.id, title: candidate.pattern.name, text, kind: "pattern",
      evidence: candidate.evidence, counterEvidence: candidate.counterEvidence, dimensions: candidate.dimensions, context: candidate.context,
      supports: [id], strength: candidate.qualified ? "limited" : "recurrent",
    });
    const paragraphs: ReportSection["paragraphs"][number][] = [{ id: findingId, text, findingIds: [findingId], scope: id === "compass" ? "experiment" : "personal" }];
    if (id === "compass" && candidate.context.some(item => item.questionId === "Q40")) {
      const timing = candidate.context.filter(item => item.questionId === "Q40");
      const trialId = "response-timing-compass";
      const trial = "Gör försöket vid ett tillfälle när ett svar går att skjuta upp. Bestäm när du återkommer och lägg märke till om det finns fler rimliga alternativ när du väl svarar.";
      findings.push({ id: trialId, ruleId: candidate.pattern.id, title: "Tid att välja", text: trial, kind: "pattern",
        evidence: [...candidate.evidence, ...timing], counterEvidence: candidate.counterEvidence,
        dimensions: candidate.dimensions, supports: ["compass"], strength: "situational" });
      paragraphs.push({ id: trialId, text: trial, findingIds: [trialId], scope: "experiment" });
    }
    if (id === "portrait") {
      if (candidate.qualified) paragraphs.push({ id: "portrait-quality", text: note, findingIds: [], scope: "method" });
      if (second) {
        const otherId = `${second.pattern.id}-portrait-secondary`;
        findings.push({
          id: otherId, ruleId: second.pattern.id, title: second.pattern.name, text: second.pattern.core, kind: "pattern",
          evidence: second.evidence, counterEvidence: second.counterEvidence, dimensions: second.dimensions, context: second.context,
          supports: ["portrait"], strength: second.qualified ? "limited" : "recurrent",
        });
        paragraphs.push({ id: otherId, text: second.pattern.core, findingIds: [otherId], scope: "personal" });
      }
    }
    return { id, title: SECTION_TITLES[id], paragraphs };
  });
  return immutable({
    product: "persona_test", questionVersion: VERSIONS.question, reportVersion: VERSIONS.report, analysisVersion: VERSIONS.analysis,
    dimensions, findings, sections,
    preview: { text: "Gratisinsikten beräknas separat från rapporten.", findingIds: [] },
    quality: { eligible, dimensionsWithEnoughAnswers: dimensions.filter(item => item.value !== null).length,
      validReflections: answers.slice(30).filter(Boolean).length, unknownCount: answers.filter(value => value === 0).length,
      warnings: [
        ...(!eligible ? ["Någon dimension saknar tillräckligt många svar för ett värde."] : []),
        ...(!lead ? ["Underlaget ger ingen tydlig huvudkombination."] : []),
      ] },
  });
}

export function buildTeaser(input: unknown) {
  const { answers } = parseSubmission(input);
  const { candidates, eligible } = analyze(answers);
  const lead = candidates[0];
  if (!lead) return {
    eligible, headline: "Ingen tydlig huvudkombination ännu",
    text: "Dina svar ger ingen kombination som vi kan beskriva med tillräckligt stöd.",
    why: "En slutsats om ett mönster behöver mer än ett enstaka svar.",
    deeper: eligible ? "Rapporten visar de fem dimensionerna och vilket underlag som finns." : undefined,
    evidence: [], counterEvidence: [], qualified: false,
  };
  const [headline, text, why, deeper] = lead.pattern.free;
  return { eligible, headline, text, why, deeper, evidence: lead.evidence, counterEvidence: lead.counterEvidence, qualified: lead.qualified };
}
