import { marketText, type Market } from "../../_content/market";
import { contextQuestions, questions, type Dimension } from "./questions";
export { contextQuestions, questions } from "./questions";

export const dimensions = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;
export type DimensionKey = typeof dimensions[number];
export const dimensionNames: Record<DimensionKey, string> = {
  A: "Uppmärksamhet & exekutiv funktion", B: "Impulsivitet & rastlöshet", C: "Social kommunikation", D: "Rutiner & flexibilitet", E: "Sensorisk känslighet", F: "Masking & kompensation", G: "AuDHD-friktion", H: "Vardagspåverkan",
};
const dimensionNamesNb: Record<DimensionKey, string> = {
  A: "Oppmerksomhet og eksekutive funksjoner", B: "Impulsivitet og uro", C: "Sosial kommunikasjon", D: "Rutiner og fleksibilitet", E: "Sansefølsomhet", F: "Maskering og kompensering", G: "AuDHD-friksjon", H: "Påvirkning på hverdagen",
};
export const localizedDimensionNames = (market: Market) => marketText(market, dimensionNames, dimensionNamesNb);
export const answerLabels = ["Aldrig", "Sällan", "Ibland", "Ofta", "Nästan alltid"];
export const PRICE_SEK = 79;
export const REPORT_VERSION = "audhd-v1";
export const STORAGE_KEY = "relationsvarning_audhd_state_v1";
export const emptyAnswers = () => Array<number>(questions.length).fill(-1);
export const emptyContextAnswers = () => Array<number>(contextQuestions.length).fill(-1);
export const formatPercent = (value: number, market: Market = "sv") => new Intl.NumberFormat(marketText(market, "sv-SE", "nb-NO"), { maximumFractionDigits: 0 }).format(value);

export function descriptiveLevel(score: number, market: Market = "sv") { return score < 25 ? marketText(market, "lågt", "lavt") : score < 50 ? marketText(market, "vissa drag", "noen trekk") : score < 75 ? marketText(market, "tydliga drag", "tydelige trekk") : marketText(market, "mycket framträdande", "svært fremtredende"); }

export function calculateDimensions(answers: number[]) {
  if (answers.length !== questions.length || !answers.every(value => Number.isInteger(value) && value >= 0 && value <= 4)) throw new Error("Expected 48 complete answers in range 0–4");
  const raw = Object.fromEntries(dimensions.map(key => [key, 0])) as Record<DimensionKey, number>;
  const max = Object.fromEntries(dimensions.map(key => [key, 0])) as Record<DimensionKey, number>;
  questions.forEach((question, index) => { raw[question.dimension] += answers[index]; max[question.dimension] += 4; });
  return Object.fromEntries(dimensions.map(key => [key, raw[key] / max[key] * 100])) as Record<DimensionKey, number>;
}

export function calculatePrimaryIndices(scores: Record<DimensionKey, number>) {
  return { adhdIndex: scores.A * .6 + scores.B * .4, autismIndex: scores.C * .4 + scores.D * .35 + scores.E * .25, maskingIndex: scores.F, frictionIndex: scores.G, functionalIndex: scores.H };
}

// These are product descriptions, never clinical cutoffs. The ±5 zone deliberately avoids a sharp 49/50 result change.
const inZone = (value: number, boundary: number) => Math.abs(value - boundary) <= 5;
export function determineMainProfile(adhd: number, autism: number, scores: Record<DimensionKey, number>, market: Market = "sv") {
  const highest = Math.max(adhd, autism);
  const gap = Math.abs(adhd - autism);
  if (adhd >= 75 && autism >= 75) return marketText(market, "Mycket framträdande kombinationsmönster", "Svært fremtredende kombinasjon av trekk");
  if (inZone(adhd, 50) || inZone(autism, 50) || inZone(adhd, 75) || inZone(autism, 75) || (highest >= 45 && gap <= 5)) return marketText(market, "Gränsnära/ojämn profil", "Sammensatt profil nær en grense");
  if (adhd < 25 && autism < 25) return marketText(market, "Inget tydligt kombinerat mönster", "Ingen tydelig kombinasjon av trekk");
  if (adhd >= 50 && autism >= 50) return gap <= 12 ? marketText(market, "Kombinerat dragmönster", "Kombinasjon av trekk fra begge områder") : adhd > autism ? marketText(market, "ADHD-dominerat kombinationsmönster", "Kombinert profil med mest ADHD-relaterte trekk") : marketText(market, "Autismdominerat kombinationsmönster", "Kombinert profil med mest autismerelaterte trekk");
  if (adhd >= 50) return marketText(market, "Främst ADHD-liknande profil", "Hovedsakelig ADHD-relatert profil");
  if (autism >= 50) return marketText(market, "Främst autismrelaterad profil", "Hovedsakelig autismerelatert profil");
  if (adhd >= 25 && autism >= 25) return marketText(market, "Vissa drag från båda områdena", "Enkelte trekk fra begge områder");
  // A high stand-alone support domain is uneven, not evidence of a combined profile.
  return scores.G >= 50 || scores.F >= 50 ? marketText(market, "Gränsnära/ojämn profil", "Sammensatt profil nær en grense") : marketText(market, "Inget tydligt kombinerat mönster", "Ingen tydelig kombinasjon av trekk");
}

export type Outlier = { key: Exclude<DimensionKey, "H">; kind: "stark topp" | "tydlig topp" | "tydlig dal"; difference: number };
export function findDimensionOutliers(scores: Record<DimensionKey, number>): Outlier[] {
  const relevant = dimensions.filter(key => key !== "H");
  const mean = relevant.reduce((sum, key) => sum + scores[key], 0) / relevant.length;
  return relevant.reduce<Outlier[]>((found, key) => {
    const difference = scores[key] - mean;
    // A relative high must also be an absolutely meaningful level; 35 can never be "strong".
    if (scores[key] >= 50 && difference >= 15) found.push({ key, kind: "stark topp", difference });
    else if (scores[key] >= 40 && difference >= 10) found.push({ key, kind: "tydlig topp", difference });
    else if (difference <= -10) found.push({ key, kind: "tydlig dal", difference });
    return found;
  }, []);
}

export function analyzeAdhdPattern(scores: Record<DimensionKey, number>, market: Market = "sv") {
  const difference = scores.A - scores.B;
  const label = difference >= 12 ? marketText(market, "Exekutivt/ouppmärksamt dominerad", "Mest fremtredende vansker med oppmerksomhet og eksekutive funksjoner") : difference <= -12 ? marketText(market, "Impulsivitet/rastlöshet dominerar", "Impulsivitet og uro er mest fremtredende") : marketText(market, "Blandad ADHD-relaterad profil", "Blandet ADHD-relatert profil");
  const text = difference >= 12 ? marketText(market, "Uppmärksamhet, igångsättning och vardagsstruktur väger tydligare än impulsivitet och rastlöshet i dina svar.", "I svarene dine er oppmerksomhet, det å komme i gang og struktur i hverdagen mer fremtredende enn impulsivitet og uro.") : difference <= -12 ? marketText(market, "Impulsivitet, stimulansbehov och rastlöshet väger tydligare än exekutiva svårigheter i dina svar.", "Impulsivitet, behov for stimulering og uro veier tyngre enn vansker med eksekutive funksjoner i svarene dine.") : marketText(market, "De två ADHD-relaterade områdena ligger nära varandra i dina svar.", "De to ADHD-relaterte områdene ligger nær hverandre i svarene dine.");
  return { label, text, difference };
}

export function analyzeAutismPattern(scores: Record<DimensionKey, number>, market: Market = "sv") {
  const keys = ["C", "D", "E"] as const;
  const ranked = [...keys].sort((a, b) => scores[b] - scores[a]);
  const difference = scores[ranked[0]] - scores[ranked[1]];
  const names = { C: marketText(market, "Social kommunikation dominerar", "Sosial kommunikasjon er mest fremtredende"), D: marketText(market, "Rutiner, flexibilitet och intressen dominerar", "Rutiner, fleksibilitet og interesser er mest fremtredende"), E: marketText(market, "Sensorisk känslighet dominerar", "Sansefølsomhet er mest fremtredende") };
  const label = difference < 10 ? marketText(market, "Jämn autismrelaterad profil", "Jevn autismerelatert profil") : names[ranked[0]];
  return { label, text: difference < 10 ? marketText(market, "Social kommunikation, rutiner/flexibilitet och sensorik är relativt jämnt fördelade i dina svar.", "Sosial kommunikasjon, rutiner og fleksibilitet samt sanseinntrykk er nokså jevnt fordelt i svarene dine.") : marketText(market, `${dimensionNames[ranked[0]]} ligger tydligare högst av de tre autismrelaterade områdena.`, `Av de tre autismerelaterte områdene skårer ${localizedDimensionNames(market)[ranked[0]]} høyest.`), ranked, difference };
}

const frictions = ["Struktur kontra svårighet att följa struktur", "Stimulans kontra överstimulering", "Självvald spontanitet kontra externa planändringar", "Behov av system kontra svårt att upprätthålla system", "Variation kontra förutsägbarhet"];
const frictionsNb = ["Behov for struktur og vansker med å følge den", "Behov for stimulering og risiko for overstimulering", "Selvvalgt spontanitet og planendringer andre tar initiativ til", "Behov for systemer og vansker med å holde dem i gang", "Variasjon og forutsigbarhet"];
export function analyzeFriction(answers: number[], market: Market = "sv") {
  const entries = questions.map((question, index) => ({ question, value: answers[index] })).filter(({ question }) => question.dimension === "G").sort((a, b) => b.value - a.value);
  return { top: entries.slice(0, 2).map(({ question, value }) => ({ label: marketText(market, frictions, frictionsNb)[Number(question.id.slice(1)) - 1], value })), text: marketText(market, "Friktion beskriver upplevda krockar mellan behov. Den används inte som bevis för ADHD, autism eller AuDHD.", "Friksjon beskriver situasjoner der behovene dine trekker i ulike retninger. Det gir rom for å utforske hvilke rammer som kan hjelpe.") };
}

export function analyzeMasking(masking: number, autism: number, market: Market = "sv") {
  if (masking >= 60 && autism >= 50) return { title: marketText(market, "Mycket aktiv anpassning", "Mye aktiv tilpasning"), text: marketText(market, "Dina svar visar både hög aktiv anpassning och tydliga autismrelaterade drag. Anpassning i sig bevisar inte autism, men kan vara viktigt när du funderar på hur mycket energi vardagen tar.", "Svarene dine viser både mye aktiv tilpasning og tydelige autismerelaterte trekk. Det kan være verdt å se på hvor mye energi tilpasningen krever i hverdagen.") };
  if (masking >= 60) return { title: marketText(market, "Mycket aktiv anpassning", "Mye aktiv tilpasning"), text: marketText(market, "Dina svar visar hög aktiv anpassning, medan de autismrelaterade områdena är måttliga eller lägre. Masking kan förekomma av många skäl och ska inte tolkas som direkt bevis.", "Svarene dine viser mye aktiv tilpasning, mens de autismerelaterte områdene ligger på et moderat eller lavere nivå. Maskering kan ha flere årsaker.") };
  if (masking < 25 && autism >= 50) return { title: marketText(market, "Begränsad rapporterad masking", "Lite rapportert maskering"), text: marketText(market, "Dina autismrelaterade svar är tydliga, medan aktiv anpassning rapporteras i mindre grad. Det säger inte hur synligt eller osynligt mönstret är för andra.", "Du rapporterer tydelige autismerelaterte trekk og mindre aktiv tilpasning. Svarene sier lite om hva andre legger merke til.") };
  return { title: marketText(market, "Masking och kompensation", "Maskering og kompensering"), text: marketText(market, "Dina svar om förberedelse, strategier och återhämtning efter anpassning ger en separat bild av hur mycket aktivt arbete vardagen kan kräva.", "Svarene om forberedelser, strategier og tid til å hente deg inn gir et eget bilde av hvor mye tilpasning hverdagen kan kreve.") };
}

export function analyzeFunctionalImpact(scores: Record<DimensionKey, number>, context: number[], market: Market = "sv") {
  const [,, work = 0, relations = 0, energy = 0] = context;
  const combined = (scores.H + work * 25 + relations * 25 + energy * 25) / 4;
  const title = combined >= 65 ? marketText(market, "Stor påverkan", "Stor påvirkning") : combined >= 35 ? marketText(market, "Tydlig påverkan", "Tydelig påvirkning") : marketText(market, "Begränsad påverkan", "Begrenset påvirkning");
  const highestContext = Math.max(work, relations, energy);
  const contextAreas = [
    { value: work, label: marketText(market, "arbete, studier eller andra krav", "jobb, studier eller andre krav") },
    { value: relations, label: marketText(market, "relationer eller socialt liv", "relasjoner eller det sosiale livet") },
    { value: energy, label: marketText(market, "energin det tar att hantera svårigheterna", "energien det krever å håndtere vanskene") },
  ];
  const largest = combined >= 35 && highestContext >= 2
    ? new Intl.ListFormat(marketText(market, "sv-SE", "nb-NO")).format(contextAreas.filter(area => area.value === highestContext).map(area => area.label))
    : null;
  const summary = marketText(market, `${title} framträder sammantaget i dina svar.`, `Samlet viser svarene dine ${title.toLowerCase()}.`);
  return { title, combined, largest, text: largest ? summary + marketText(market, ` Bland följdfrågorna skattar du högst när det gäller ${largest}.`, ` Blant oppfølgingsspørsmålene skårer du høyest når det gjelder ${largest}.`) : summary };
}

export function analyzeDevelopmentContext(context: number[], core: number, market: Market = "sv") {
  const [childhood, settings,,,, recent] = context;
  // Preserve the stored option indexes. K1/K2 index 4 and K6 index 3 mean uncertainty.
  if (core >= 50 && childhood === 3 && (settings === 2 || settings === 3) && (recent === 0 || recent === 1)) return { title: marketText(market, "Profilen är konsekvent", "Et gjennomgående mønster"), text: marketText(market, "Dina svar är förenliga med ett mer långvarigt mönster i flera miljöer. Det fastställer inte en utvecklingshistoria.", "Svarene tyder på et mer langvarig mønster i flere miljøer. De kan være et utgangspunkt for å utforske historien din nærmere.") };
  if (core >= 50 && childhood <= 1 && recent === 2) return { title: marketText(market, "Profilen är svår att tolka", "Et mønster som er vanskelig å tolke"), text: marketText(market, "Höga aktuella svar kombineras med begränsad barndomshistorik och ett i huvudsak nyare mönster. Därför behöver helhetsbilden tolkas mycket försiktigt.", "Du rapporterer tydelige trekk nå og kjenner dem i liten grad igjen fra barndommen. Et relativt nytt mønster bør tolkes varsomt.") };
  if (childhood === 4 || settings === 4 || recent >= 3) return { title: marketText(market, "Uppgifter om utvecklingsmönstret är osäkra", "Opplysninger om utviklingsmønsteret er usikre"), text: marketText(market, "Minst en uppgift om barndom, miljöer eller när svårigheterna blev tydliga är osäker. Där räcker svaren inte till för en slutsats.", "Minst én opplysning om barndom, situasjoner eller når vanskene ble tydelige, er usikker. På det punktet gir svarene ikke grunnlag for en konklusjon.") };
  return { title: marketText(market, "Profilen behöver tolkas försiktigt", "Mønsteret bør tolkes varsomt"), text: marketText(market, "Svaren om tid, miljöer eller när mönstret blev tydligt ger inte en helt entydig utvecklingsbild.", "Svarene om tid, miljøer og når trekkene ble tydelige, gir et sammensatt bilde.") };
}

export function findContradictingEvidence(scores: Record<DimensionKey, number>, indices: ReturnType<typeof calculatePrimaryIndices>, context: number[], impact: ReturnType<typeof analyzeFunctionalImpact>, market: Market = "sv") {
  const evidence: string[] = [];
  if (indices.adhdIndex >= 50 && scores.B < 25) evidence.push(marketText(market, "ADHD-relaterade drag är tydliga, men impulsivitet och rastlöshet är låga.", "Du rapporterer tydelige ADHD-relaterte trekk og lite impulsivitet og uro."));
  if ((scores.D >= 50 || scores.E >= 50) && scores.C < 25) evidence.push(marketText(market, "Rutiner/flexibilitet eller sensorik framträder mer än social kommunikation.", "Rutiner, fleksibilitet eller sanseinntrykk er mer fremtredende enn sosial kommunikasjon."));
  if (Math.max(indices.adhdIndex, indices.autismIndex) >= 50 && context[0] <= 1) evidence.push(marketText(market, "Aktuella drag är tydliga, men barndomshistoriken är mindre tydlig.", "Trekkene er tydelige nå og mindre tydelige i det du husker fra barndommen."));
  if (scores.H < 25 && impact.combined >= 35) evidence.push(marketText(market, "Huvudfrågorna om vardagspåverkan ligger lågt. I följdfrågorna anger du mer påverkan eller att det tar energi att hantera svårigheterna.", "Hovedspørsmålene om hverdagspåvirkning gir en lav skår. I oppfølgingsspørsmålene oppgir du større påvirkning eller at det krever energi å håndtere vanskene."));
  if (Math.max(indices.adhdIndex, indices.autismIndex) >= 65 && scores.H < 25 && impact.combined < 35) evidence.push(marketText(market, "Flera drag är högt skattade och svaren om vardagspåverkan visar sammantaget begränsad påverkan.", "Flere trekk er fremtredende, og svarene om hverdagspåvirkning viser samlet sett begrenset påvirkning."));
  return evidence;
}

export function generateKeyInsights(scores: Record<DimensionKey, number>, indices: ReturnType<typeof calculatePrimaryIndices>, friction: ReturnType<typeof analyzeFriction>, outliers: ReturnType<typeof findDimensionOutliers>, impact: ReturnType<typeof analyzeFunctionalImpact>, market: Market = "sv") {
  const candidates: string[] = [];
  if (indices.frictionIndex >= 50 && friction.top[0]?.value >= 2) candidates.push(marketText(market, `Starkast friktion: ${friction.top[0].label.toLowerCase()}.`, `Her merker du mest friksjon: ${friction.top[0].label.toLowerCase()}.`));
  const peak = outliers.find(item => item.kind !== "tydlig dal");
  if (peak) candidates.push(marketText(market, `${dimensionNames[peak.key]} är en ${peak.kind} jämfört med resten av din profil.`, `${localizedDimensionNames(market)[peak.key]} er en ${peak.kind === "stark topp" ? "markant topp" : "tydelig topp"} sammenlignet med resten av profilen din.`));
  if (indices.maskingIndex >= 60) candidates.push(marketText(market, "Dina svar visar att aktiv anpassning kan ta mycket energi.", "Svarene dine tyder på at aktiv tilpasning kan kreve mye energi."));
  if (impact.largest) candidates.push(marketText(market, `I följdfrågorna skattar du högst när det gäller ${impact.largest}.`, `I oppfølgingsspørsmålene skårer du høyest når det gjelder ${impact.largest}.`));
  else if (impact.combined >= 35) candidates.push(impact.text);
  if (Math.abs(indices.adhdIndex - indices.autismIndex) >= 15) candidates.push(marketText(market, "De ADHD- och autismrelaterade indexen är tydligt olika höga i din profil.", "Du skårer tydelig forskjellig på den ADHD-relaterte og den autismerelaterte indeksen."));
  return candidates.slice(0, 3).concat(candidates.length < 3 ? [marketText(market, "Profilen behöver läsas som flera områden tillsammans, inte som en enda etikett.", "Du får det beste bildet ved å se flere områder av profilen i sammenheng.")] : []).slice(0, 3);
}

export function generateTeaser(scores: Record<DimensionKey, number>, indices: ReturnType<typeof calculatePrimaryIndices>, outliers: ReturnType<typeof findDimensionOutliers>, context: number[], market: Market = "sv") {
  if (indices.frictionIndex >= 50) return { type: "friction", title: marketText(market, "Två av dina starkaste behov verkar motarbeta varandra.", "To av behovene du merker sterkest, ser ut til å trekke i ulike retninger."), body: marketText(market, "Din rapport visar vilka friktioner du skattade högst och hur de passar in i din helhet.", "Rapporten viser hvor du opplever mest friksjon, og hvordan den henger sammen med resten av profilen din.") };
  const peak = outliers.find(item => item.kind === "stark topp");
  if (peak) return { type: "dimension_gap", title: marketText(market, "Ett område ligger betydligt högre än resten av din profil.", "Ett område ligger betydelig høyere enn resten av profilen din."), body: marketText(market, "Den fullständiga rapporten visar vad som särskilt sticker ut och vad som nyanserar bilden.", "Rapporten viser hva som skiller seg ut og hva som nyanserer bildet.") };
  if (indices.maskingIndex >= 60) return { type: "masking", title: marketText(market, "Dina svar visar mycket aktiv anpassning.", "Svarene dine viser mye aktiv tilpasning."), body: marketText(market, "Rapporten sätter masking och återhämtning i ett sammanhang, utan att göra det till ett bevis för något.", "Rapporten setter maskering og behov for restitusjon i sammenheng med resten av svarene dine.") };
  if (scores.E >= 60 && scores.E >= Math.max(scores.C, scores.D) + 10) return { type: "sensory_peak", title: marketText(market, "Sensoriska intryck framträder tydligare i din profil.", "Sanseinntrykk er særlig fremtredende i profilen din."), body: marketText(market, "Se hur sensorik samspelar med de övriga områdena.", "Se hvordan sanseinntrykk henger sammen med de andre områdene.") };
  if (Math.abs(indices.adhdIndex - indices.autismIndex) >= 15) return { type: "adhd_asymmetry", title: marketText(market, "De två huvudområdena är olika högt skattade.", "Du skårer ulikt på de to hovedområdene."), body: marketText(market, "Rapporten visar hur den skillnaden påverkar din kombinationsprofil.", "Rapporten viser hvordan forskjellen preger helhetsbildet.") };
  if (context[0] <= 1 && Math.max(indices.adhdIndex, indices.autismIndex) >= 50) return { type: "context_conflict", title: marketText(market, "En av dina sista svar gör helhetsbilden mindre självklar.", "Et av de siste svarene gjør helhetsbildet mindre entydig."), body: marketText(market, "Den fullständiga analysen förklarar varför utvecklingskontexten är viktig.", "Rapporten forklarer hva tid og situasjon kan bety for tolkningen.") };
  return { type: "generic", title: marketText(market, "Din profil är klar", "Profilen din er klar"), body: marketText(market, "Din fullständiga rapport visar åtta områden och hur de kan samspela hos dig.", "Rapporten viser åtte områder og hvordan de kan henge sammen hos deg.") };
}

export function calculateReport(answers: number[], contextAnswers: number[], market: Market = "sv") {
  if (contextAnswers.length !== contextQuestions.length || !contextAnswers.every(value => Number.isInteger(value) && value >= 0 && value <= 4)) throw new Error("Expected 6 complete context answers");
  const scores = calculateDimensions(answers); const indices = calculatePrimaryIndices(scores); const core = (indices.adhdIndex + indices.autismIndex) / 2;
  const outliers = findDimensionOutliers(scores); const friction = analyzeFriction(answers, market); const impact = analyzeFunctionalImpact(scores, contextAnswers, market); const development = analyzeDevelopmentContext(contextAnswers, core, market);
  return { reportVersion: REPORT_VERSION, scores, indices, profileType: determineMainProfile(indices.adhdIndex, indices.autismIndex, scores, market), outliers, adhd: analyzeAdhdPattern(scores, market), autism: analyzeAutismPattern(scores, market), friction, masking: analyzeMasking(indices.maskingIndex, indices.autismIndex, market), impact, development, contradicting: findContradictingEvidence(scores, indices, contextAnswers, impact, market), keyFindings: generateKeyInsights(scores, indices, friction, outliers, impact, market), teaser: generateTeaser(scores, indices, outliers, contextAnswers, market) };
}
export type Report = ReturnType<typeof calculateReport>;

export type SavedState = { reportVersion: string; answers: number[]; contextAnswers: number[]; questionIndex: number; contextIndex: number; unlocked: boolean; report?: Report };
export function parseState(raw: string | null): SavedState | null { try { const state: any = JSON.parse(raw ?? "null"); if (state?.reportVersion !== REPORT_VERSION || !Array.isArray(state.answers) || state.answers.length !== 48 || !Array.isArray(state.contextAnswers) || state.contextAnswers.length !== 6 || !state.answers.every((v: unknown) => typeof v === "number" && Number.isInteger(v) && v >= -1 && v <= 4) || !state.contextAnswers.every((v: unknown) => typeof v === "number" && Number.isInteger(v) && v >= -1 && v <= 4)) return null; return { reportVersion: REPORT_VERSION, answers: state.answers, contextAnswers: state.contextAnswers, questionIndex: Math.max(0, Math.min(47, state.questionIndex || 0)), contextIndex: Math.max(0, Math.min(5, state.contextIndex || 0)), unlocked: state.unlocked === true, report: state.report }; } catch { return null; } }
