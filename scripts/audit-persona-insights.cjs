/* eslint-disable @typescript-eslint/no-require-imports -- offline synthetic analysis report */
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const output = process.argv[2] ? path.resolve(process.argv[2]) : path.join(root, ".artifacts/persona-insights");
const load = require("../app/autism-test/test/test-loader.cjs")();
const { analyzeInsights, CATALOG, CATALOG_VERSION, FAMILIES } = load(path.join(root, "app/persona/_domain/insights-v1/index.ts"));
const profiles = require("../tests/persona/insights-v1-expanded-fixtures.cjs");
const entries = profiles.map(profile => ({ ...profile, result: analyzeInsights(profile.answers) }));
const counts = entries.map(entry => entry.result.insights.length);
const decisions = {};
for (const entry of entries) for (const item of entry.result.evaluations) decisions[item.decision] = (decisions[item.decision] ?? 0) + 1;

function requiredDirections(entry) {
  return entry.result.insights.flatMap(insight => CATALOG.find(candidate => candidate.id === insight.id).required);
}
const conflicts = entries.flatMap(entry => {
  const required = requiredDirections(entry);
  return required.flatMap(item => required.some(other => other.questionId === item.questionId && other.direction !== item.direction)
    ? [{ profile: entry.name, questionId: item.questionId }] : []);
});
const pairOverlap = entries.flatMap(entry => entry.result.insights.flatMap((first, index) =>
  entry.result.insights.slice(index + 1).map(second => {
    const a = new Set(first.evidence.map(item => item.questionId));
    const b = new Set(second.evidence.map(item => item.questionId));
    return {
      profile: entry.name, first: first.id, second: second.id,
      shared: Array.from(a).filter(id => b.has(id)),
      unionSize: new Set([...Array.from(a), ...Array.from(b)]).size,
    };
  })));
const summary = {
  catalogVersion: CATALOG_VERSION, rules: CATALOG.length,
  profileCount: entries.length, totalInsights: counts.reduce((sum, count) => sum + count, 0),
  averageInsights: counts.reduce((sum, count) => sum + count, 0) / entries.length,
  originalSixAverage: counts.slice(0, 6).reduce((sum, count) => sum + count, 0) / 6,
  abstentions: entries.filter(entry => !entry.result.insights.length).map(entry => entry.name),
  decisions, conflictingRequiredPremises: conflicts, selectedPairOverlap: pairOverlap,
};
const lines = [
  "# PERSONA – utökat insiktsbibliotek",
  "",
  "Syntetiska testprofiler. Namnen används som testetiketter och är aldrig indata till motorn.",
  "",
  "## Sammanställning",
  "",
  `Biblioteket har ${CATALOG.length} regler. ${entries.length} profiler ger totalt ${summary.totalInsights} insikter och lika många råd. Genomsnittet är ${summary.averageInsights.toFixed(3)} insikter per profil.`,
  "",
  "Genomsnittet beskriver de konstruerade testfallen. Det uppskattar ingen täckning i en användarpopulation.",
  "",
  "| Profil | Antal insikter | Valda fynd |",
  "|---|---:|---|",
  ...entries.map(entry => `| ${entry.name} | ${entry.result.insights.length} | ${entry.result.insights.map(item => item.title).join(" / ") || "Avstår"} |`),
  "",
  "## Överlapp och motriktade slutsatser",
  "",
  `Antal motriktade nödvändiga villkor bland valda insikter i dessa profiler är ${conflicts.length}.`,
  "",
  "Följande bortval gäller annars kvalificerade kandidater. Ett avstående kan också bero på saknade eller neutrala nödvändiga svar.",
  "",
  "| Profil | Bortvald kandidat | Beslut | Skäl |",
  "|---|---|---|---|",
  ...entries.flatMap(entry => entry.result.evaluations.filter(item => item.qualified && item.decision !== "selected").map(item =>
    `| ${entry.name} | ${item.candidateId} | ${item.decision} | ${item.reason} |`)),
  "",
  "Valda par kan dela enstaka frågor. Det är tillåtet när budskapen skiljer sig och överlappet understiger hälften av frågornas union. Full jämförelse finns i JSON-underlaget.",
  "",
  "## Dokumenterade regler",
  "",
];
const conditions = items => items.map(item => `${item.questionId} ${item.direction} (${item.purpose})`).join(" / ") || "Inga";
for (const candidate of CATALOG) {
  lines.push(
    `### ${candidate.title}`, "",
    `ID \`${candidate.id}\`. Familj ${FAMILIES[candidate.family]}.`, "",
    `Nödvändiga svar — ${conditions(candidate.required)}`, "",
    `Ytterligare stöd — ${conditions(candidate.supporting)}`, "",
    `Explicit motbelägg — ${conditions(candidate.contradictory)}`, "",
    `Nyanser utan poängavdrag — ${conditions(candidate.nuances)}`, "",
    `Minst ${candidate.minimumSupport} olika stödjande frågor krävs. Alla nödvändiga villkor måste uppfyllas. Motsatt svar på ett nödvändigt villkor stoppar kandidaten och visas i spårningen.`, "",
    "**Observation**", "", candidate.observation, "",
    "**Möjlig tolkning**", "", candidate.explanation, "",
    "**Praktiskt försök**", "", candidate.advice, "",
    "**Begränsningar**", "", ...candidate.limitations.map(text => "- " + text), "",
  );
}
lines.push("## Resultat per profil", "");
const evidence = items => items.map(item => `${item.questionId}=${item.answer}`).join(", ") || "Inga";
for (const entry of entries) {
  lines.push(`### ${entry.name}`, "");
  if (!entry.result.insights.length) lines.push("Motorn avstår från slutsatser och råd.", "");
  for (const insight of entry.result.insights) {
    const advice = entry.result.advice.find(item => item.insightId === insight.id);
    lines.push(
      `**${insight.title}**`, "", insight.observation, "", insight.possibleExplanation, "",
      `Utvecklingsråd — ${advice.text}`, "",
      `Stöd — ${evidence(insight.evidence)}`, "",
      `Motbelägg — ${evidence(insight.counterEvidence)}`, "",
      `Nyanser — ${evidence(insight.nuanceEvidence)}`, "",
      `Underlagsstyrka ${insight.strength}. Försiktighet ${insight.caution}.`, "", insight.caveat, "",
    );
  }
}
fs.mkdirSync(output, { recursive: true });
fs.writeFileSync(path.join(output, "PERSONA-insikter-utokning-resultat.md"), lines.join("\n"));
fs.writeFileSync(path.join(output, "PERSONA-insikter-utokning-underlag.json"), JSON.stringify({ summary, catalog: CATALOG, entries }, null, 2) + "\n");
console.log(JSON.stringify(summary, null, 2));
