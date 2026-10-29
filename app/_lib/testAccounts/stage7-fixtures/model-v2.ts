export const areas = ["matrices", "logic", "numeric", "verbal", "spatial"] as const;
export type Area = typeof areas[number];
export type Difficulty = "easy" | "medium" | "hard";
export type MatrixVisual = { size: 2 | 3; cells: string[]; options: string[] };
export type Question = { id: string; area: Area; difficulty: Difficulty; weight: number; prompt: string; options: string[]; correct: number; visual?: MatrixVisual };

export const areaNames: Record<Area, string> = {
  matrices: "Mönsterigenkänning", logic: "Logiskt resonemang", numeric: "Numeriskt resonemang", verbal: "Verbalt resonemang", spatial: "Spatial förmåga",
};
const weight: Record<Difficulty, number> = { easy: 1, medium: 1.25, hard: 1.5 };
const nonMatrixDifficulty: Record<string, Difficulty> = {
  l1: "easy", l2: "easy", l3: "easy", l4: "medium", l5: "easy", l6: "medium", l7: "hard", l8: "hard",
  n1: "easy", n2: "easy", n3: "medium", n4: "medium", n5: "easy", n6: "medium", n7: "medium", n8: "hard",
  v1: "easy", v2: "easy", v3: "medium", v4: "medium", v5: "hard", v6: "medium", v7: "hard",
  s1: "easy", s2: "easy", s3: "medium", s4: "hard", s5: "hard", s6: "hard", s7: "hard",
};
const matrix = (id: string, difficulty: Difficulty, prompt: string, cells: string[], options: string[], correct: number): Question => ({ id, area: "matrices", difficulty, weight: weight[difficulty], prompt, options, correct, visual: { size: cells.length === 4 ? 2 : 3, cells, options } });
const question = (id: string, area: Exclude<Area, "matrices">, prompt: string, options: string[], correct: number): Question => { const difficulty = nonMatrixDifficulty[id]; return { id, area, difficulty, weight: weight[difficulty], prompt, options, correct }; };

// The categories and difficulty metadata are intentionally separate from the estimate.
export const questions: readonly Question[] = [
  matrix("m1", "easy", "Vilken figur saknas i rutan?", ["●", "●●", "●●", "?"], ["●", "●●", "●●●", "●●●●"], 2),
  question("l1", "logic", "Alla nyror är blisar. Inga blisar är torma. Vad följer säkert?", ["Inga nyror är torma", "Alla torma är nyror", "Vissa nyror är torma", "Alla blisar är nyror"], 0),
  question("n1", "numeric", "Vilket tal kommer härnäst? 3, 6, 9, 12, …", ["14", "15", "16", "18"], 1),
  question("v1", "verbal", "Finger förhåller sig till hand som tå förhåller sig till …", ["fot", "sko", "ben", "strumpa"], 0),
  question("s1", "spatial", "En pil pekar uppåt. Den vrids ett kvarts varv medurs. Vart pekar den?", ["Uppåt", "Höger", "Nedåt", "Vänster"], 1),
  matrix("m2", "medium", "Vilken figur kommer härnäst?", ["▲", "▶", "▶", "?"], ["▲", "▶", "▼", "◀"], 2),
  question("l2", "logic", "Mira kommer före Oskar i kön. Oskar kommer före Pia. Vem kan stå sist?", ["Mira", "Oskar", "Pia", "Det går inte att avgöra"], 2),
  question("n2", "numeric", "Vilket tal kommer härnäst? 2, 5, 10, 17, …", ["24", "25", "26", "27"], 2),
  question("v2", "verbal", "Vilket ord hör minst ihop med de andra?", ["Ek", "Björk", "Tall", "Fågel"], 3),
  question("s2", "spatial", "En figur speglas i en lodrät spegel. Om en markering först sitter till höger, hamnar den då …", ["till vänster", "ovanför", "nedanför", "på samma plats"], 0),
  matrix("m3", "medium", "Vilket tal saknas?", ["1", "2", "3", "2", "3", "4", "3", "4", "?"], ["4", "5", "6", "7"], 1),
  question("l3", "logic", "Om mötet är på måndag, skickas rapporten dagen före. Rapporten skickas inte på söndag. Vad följer?", ["Mötet är inte på måndag", "Rapporten skickas på måndag", "Mötet är på tisdag", "Inget säkert följer"], 0),
  question("n3", "numeric", "En bok kostar 80 kr efter en rabatt på 20 %. Vad kostade den före rabatten?", ["90 kr", "96 kr", "100 kr", "120 kr"], 2),
  question("v3", "verbal", "Nyckel förhåller sig till lås som lösenord förhåller sig till …", ["konto", "tangentbord", "hemlighet", "kod"], 0),
  question("s3", "spatial", "Du viker ett papper på mitten från vänster till höger och stansar ett hål nära den vikta kanten. När pappret öppnas blir hålet …", ["ett hål på vänster sida", "två symmetriska hål", "fyra hål", "ett hål i mitten"], 1),
  matrix("m4", "medium", "Vilken riktning saknas i den tredje raden?", ["↑", "→", "↓", "→", "↓", "←", "↓", "←", "?"], ["↑", "→", "↓", "←"], 0),
  question("l4", "logic", "Fyra personer ska sitta i rad. Kim sitter inte längst ut. Lea sitter direkt till höger om Kim. Vilken placering är möjlig?", ["Kim, Lea, Omar, Sara", "Omar, Kim, Lea, Sara", "Omar, Lea, Kim, Sara", "Kim, Omar, Lea, Sara"], 1),
  question("n4", "numeric", "Vilket tal kommer härnäst? 81, 27, 9, 3, …", ["0", "1", "2", "6"], 1),
  question("v4", "verbal", "Vilket ord är närmast motsatsen till tillfällig?", ["snabb", "varaktig", "osäker", "ovanlig"], 1),
  matrix("m5", "medium", "Vilken figur saknas?", ["●", "▲", "■", "▲", "■", "●", "■", "●", "?"], ["●", "▲", "■", "◆"], 1),
  question("s4", "spatial", "Du står vänd mot norr. Du vrider dig först ett halvt varv, sedan ett kvarts varv åt vänster och till sist ett kvarts varv åt höger. Åt vilket håll är du vänd?", ["Norr", "Söder", "Öster", "Väster"], 1),
  question("l5", "logic", "Endast medlemmar får låna verktyg. Samir lånar ett verktyg. Vad kan du dra för slutsats?", ["Samir är medlem", "Samir arbetar där", "Samir äger verktyget", "Samir är ny"], 0),
  question("n5", "numeric", "En behållare fylls med 3 liter per minut. Hur många minuter tar 27 liter?", ["6", "8", "9", "12"], 2),
  question("v5", "verbal", "Premisser förhåller sig till slutsats som bevis förhåller sig till …", ["påstående", "hypotes", "resonemang", "definition"], 0),
  matrix("m6", "medium", "Vilken figur saknas i matrisen?", ["●", "○○", "▲▲", "?"], ["△△△", "▲▲▲", "△△", "○○○"], 0),
  question("s5", "spatial", "Du går tre kvarter norrut, två kvarter österut och tre kvarter söderut. Var ligger du i förhållande till startpunkten?", ["Två kvarter västerut", "Två kvarter österut", "Tre kvarter norrut", "Tre kvarter söderut"], 1),
  question("l6", "logic", "A är äldre än B. C är yngre än B. D är äldre än A. Vem är yngst?", ["A", "B", "C", "D"], 2),
  question("n6", "numeric", "Vilket tal kommer härnäst? 4, 7, 14, 17, 34, …", ["37", "51", "68", "71"], 0),
  question("v6", "verbal", "Vilket par har samma relation som varm : kall?", ["hög : låg", "snabb : bil", "röd : färg", "lång : väg"], 0),
  matrix("m7", "hard", "Vilken figur saknas i matrisen?", ["▲", "▲▲", "▲▲▲", "▶", "▶▶", "?", "■", "■■", "■■■"], ["▶", "▶▶", "▶▶▶", "■■■"], 2),
  question("s6", "spatial", "En pil pekar nordost. Den speglas i en vågrät linje. Vart pekar den?", ["Nordväst", "Sydost", "Sydväst", "Nordost"], 1),
  question("l7", "logic", "Fyra presentationer K, L, M och N hålls i följd. K hålls före L. M hålls direkt efter N. L hålls inte sist. Vilken ordning är möjlig?", ["K, L, N, M", "N, M, L, K", "K, N, M, L", "M, N, K, L"], 0),
  question("n7", "numeric", "Ett pris höjs med 20 % och sänks sedan med 20 %. Hur förhåller sig slutpriset till ursprungspriset?", ["Det är oförändrat", "Det är 4 % lägre", "Det är 4 % högre", "Det är 8 % lägre"], 1),
  question("v7", "verbal", "Vilket ord ligger närmast betydelsen av tvetydig?", ["Mångtydig", "Tillfällig", "Noggrann", "Enkel"], 0),
  matrix("m8", "hard", "Vilket tal saknas i matrisen?", ["1", "2", "2", "2", "3", "6", "3", "4", "?"], ["7", "10", "12", "14"], 2),
  question("s7", "spatial", "En liten figur roteras 180 grader och speglas sedan lodrätt. En markering som först ligger uppe till vänster hamnar …", ["uppe till vänster", "uppe till höger", "nere till vänster", "nere till höger"], 2),
  question("n8", "numeric", "Vilket tal kommer härnäst? 2, 6, 15, 31, 56, …", ["81", "86", "92", "98"], 2),
  question("l8", "logic", "I ett system gäller: Om X är sant är Y sant. Om Y är sant är Z sant. Z är falskt. Vad måste vara falskt?", ["Endast X", "Endast Y", "X och Y", "Inget kan avgöras"], 2),
  matrix("m9", "medium", "Vilket alternativ kompletterar mönstret?", ["○", "○○", "○○○", "▲", "▲▲", "▲▲▲", "■", "■■", "?"], ["■", "■■", "■■■", "■■■■"], 2),
  matrix("m10", "hard", "Vilken figur saknas i matrisen?", ["○", "▲▲", "■■■", "▲▲", "■■■", "○○○○", "■■■", "○○○○", "?"], ["▲▲▲▲▲", "○○○○○", "■■■■■", "▲▲▲▲"], 0),
] as const;

export const PRICE_SEK = 79;
export const STATE_VERSION = 2;
export const STORAGE_KEY = "relationsvarning_iq_state_v2";
export const emptyAnswers = () => Array<number>(questions.length).fill(-1);
export const emptyResponseTimes = () => Array<number>(questions.length).fill(0);
export const maxWeightedRaw = questions.reduce((sum, item) => sum + item.weight, 0);

export function estimateIq(weightedRaw: number) {
  // This is an intentionally broad product estimate, not a normed IQ conversion.
  // Rounding to fives avoids implying clinical-level precision until norming data exists.
  const scaled = 75 + weightedRaw / maxWeightedRaw * 55;
  return Math.round(scaled / 5) * 5;
}

export function calculate(answers: number[]) {
  if (answers.length !== questions.length || !answers.every(answer => Number.isInteger(answer) && answer >= 0 && answer <= 3)) throw new Error("Expected 40 answers, each 0–3");
  const weightedRaw = questions.reduce((sum, item, index) => sum + (answers[index] === item.correct ? item.weight : 0), 0);
  const totals = Object.fromEntries(areas.map(area => [area, questions.filter(item => item.area === area).reduce((sum, item) => sum + item.weight, 0)])) as Record<Area, number>;
  const raw = Object.fromEntries(areas.map(area => [area, questions.reduce((sum, item, index) => sum + (item.area === area && answers[index] === item.correct ? item.weight : 0), 0)])) as Record<Area, number>;
  const scores = Object.fromEntries(areas.map(area => [area, Math.round(raw[area] / totals[area] * 100)])) as Record<Area, number>;
  const ranked = [...areas].sort((left, right) => scores[right] - scores[left] || areas.indexOf(left) - areas.indexOf(right));
  const highestScore = Math.max(...areas.map(area => scores[area])); const lowestScore = Math.min(...areas.map(area => scores[area]));
  const strongestAreas = areas.filter(area => scores[area] === highestScore); const weakestAreas = areas.filter(area => scores[area] === lowestScore);
  const strongest = strongestAreas.length === 1 ? strongestAreas[0] : null; const weakest = weakestAreas.length === 1 ? weakestAreas[0] : null; const spread = highestScore - lowestScore;
  const correctByDifficulty = Object.fromEntries((["easy", "medium", "hard"] as Difficulty[]).map(difficulty => [difficulty, questions.filter((item, index) => item.difficulty === difficulty && answers[index] === item.correct).length])) as Record<Difficulty, number>;
  return { weightedRaw, iqEstimate: estimateIq(weightedRaw), raw, totals, scores, ranked, strongestAreas, weakestAreas, strongest, weakest, spread, correctByDifficulty };
}
export type Result = ReturnType<typeof calculate>;

export const PROFILE_EVENNESS_THRESHOLDS = {
  even: 14,
  varied: 30,
} as const;

export type ProfileEvenness = "even" | "varied" | "very_varied";
export type RelativePosition = "stronger" | "near_average" | "lower";

export const areaExplanations: Record<Area, string> = {
  matrices: "visuella mönster, förändringar och samband mellan figurer",
  logic: "villkor, ordning och vad som följer av given information",
  numeric: "talserier, beräkningar och numeriska samband",
  verbal: "ordrelationer, betydelser och språkliga samband",
  spatial: "riktning, rotation, spegling och rumsliga relationer",
};

function joinAreaNames(areaList: readonly Area[]) {
  const names = areaList.map(area => areaNames[area]);
  if (names.length <= 1) return names[0] ?? "inga områden";
  if (names.length === 2) return `${names[0]} och ${names[1]}`;
  return `${names.slice(0, -1).join(", ")} och ${names[names.length - 1]}`;
}

function profileEvenness(spread: number): ProfileEvenness {
  // Scores are rounded percentage scores within this test. These broad bands avoid
  // making small one-item differences look like meaningful profile differences.
  if (spread <= PROFILE_EVENNESS_THRESHOLDS.even) return "even";
  if (spread < PROFILE_EVENNESS_THRESHOLDS.varied) return "varied";
  return "very_varied";
}

function evennessCopy(evenness: ProfileEvenness, spread: number) {
  if (evenness === "even") return { label: "Relativt jämn profil", text: "Skillnaden mellan dina områden var relativt liten. Din prestation var ganska jämnt fördelad över testets olika typer av uppgifter." };
  if (evenness === "varied") return { label: "Viss variation", text: `Dina områdesresultat varierade med ${spread} poäng. Det finns skillnader mellan uppgiftstyperna, men ingen enskild del tar över hela bilden.` };
  return { label: "Tydligt varierad profil", text: `Dina områdesresultat varierade med ${spread} poäng. Totalt IQ-estimat sammanfattar därför både tydligare toppar och lägre resultat i det här testet.` };
}

export function buildProfileReport(result: Result) {
  const evenness = profileEvenness(result.spread); const average = Math.round(areas.reduce((sum, area) => sum + result.scores[area], 0) / areas.length);
  const topAreas = result.strongestAreas; const bottomAreas = result.weakestAreas;
  const areaReports = areas.map(area => {
    const position: RelativePosition = evenness === "even" ? "near_average" : topAreas.includes(area) ? "stronger" : bottomAreas.includes(area) ? "lower" : "near_average";
    const interpretation = position === "stronger" ? "Det här var ett av dina starkare områden i testet." : position === "lower" ? "Det här området låg lägre än flera av dina övriga resultat i testet." : "Din prestation här låg nära genomsnittet för dina fem egna områdesresultat.";
    return { area, score: result.scores[area], position, interpretation, explanation: areaExplanations[area] };
  });
  const pairs = areas.flatMap((left, leftIndex) => areas.slice(leftIndex + 1).map(right => ({ left, right, difference: Math.abs(result.scores[left] - result.scores[right]) })));
  const closestPair = pairs.sort((left, right) => left.difference - right.difference || areas.indexOf(left.left) - areas.indexOf(right.left))[0];
  const scoresWithinTen = areas.filter(area => Math.abs(result.scores[area] - average) <= 10);
  const insights: string[] = [evennessCopy(evenness, result.spread).text];
  if (result.spread === 0) {
    insights.push("Samtliga fem områden hamnade på samma normaliserade poäng i det här testet.");
    insights.push("Ingen enskild uppgiftstyp drog upp eller ner din totala profil mer än de andra.");
  } else {
    insights.push(`${joinAreaNames(topAreas)} ${topAreas.length === 1 ? "var" : "var"} högst relativt i din profil, medan ${joinAreaNames(bottomAreas)} ${bottomAreas.length === 1 ? "låg" : "låg"} lägst.`);
    if (closestPair && closestPair.difference <= 10) insights.push(`${areaNames[closestPair.left]} och ${areaNames[closestPair.right]} låg nära varandra, med ${closestPair.difference} poängs skillnad.`);
    if (scoresWithinTen.length >= 3) insights.push(`${scoresWithinTen.length} av dina fem områden låg inom 10 poäng från ditt eget genomsnitt.`);
    if (insights.length < 3) insights.push(`Skillnaden mellan högsta och lägsta områdesresultat var ${result.spread} poäng.`);
  }
  return {
    evenness,
    evennessLabel: evennessCopy(evenness, result.spread).label,
    evennessText: evennessCopy(evenness, result.spread).text,
    average,
    topAreas,
    bottomAreas,
    topAreaNames: joinAreaNames(topAreas),
    bottomAreaNames: joinAreaNames(bottomAreas),
    areaReports,
    insights: insights.slice(0, 5),
    teaser: evenness === "even" ? "Din totalsiffra berättar inte hela historien. Du hade en jämn prestation över flera av testets områden, utan samma tydliga toppar och dalar som en mer varierad resultatprofil." : evenness === "varied" ? "Din totalsiffra berättar inte hela historien. Det finns märkbara skillnader mellan testets fem områden som först blir tydliga när hela profilen öppnas." : "Din totalsiffra berättar inte hela historien. Din prestation varierade tydligt mellan testets fem områden, med både relativt starkare och lägre resultat.",
  };
}

export function parseState(raw: string | null): { version: number; answers: number[]; index: number; unlocked: boolean; responseTimes: number[] } | null {
  try {
    const saved: unknown = JSON.parse(raw ?? "null"); if (!saved || typeof saved !== "object") return null;
    const state = saved as Record<string, unknown>; const index = state.index;
    if (state.version !== STATE_VERSION || !Array.isArray(state.answers) || state.answers.length !== questions.length || !state.answers.every(answer => typeof answer === "number" && Number.isInteger(answer) && answer >= -1 && answer <= 3) || typeof index !== "number" || !Number.isInteger(index)) return null;
    const responseTimes = Array.isArray(state.responseTimes) && state.responseTimes.length === questions.length && state.responseTimes.every(value => typeof value === "number" && Number.isFinite(value) && value >= 0) ? state.responseTimes : emptyResponseTimes();
    return { version: STATE_VERSION, answers: state.answers, index: Math.max(0, Math.min(questions.length - 1, index)), unlocked: state.unlocked === true, responseTimes };
  } catch { return null; }
}
