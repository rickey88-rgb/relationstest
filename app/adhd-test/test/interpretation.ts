import { areaNames, areas, type Result, type Area } from "./model";
import { areaTexts } from "./copy";
const middle = [
  "Du beskriver vissa svårigheter med fokus och distraktioner, men inte genomgående på en hög nivå.",
  "Planering och struktur fungerar olika bra i olika situationer enligt dina svar.",
  "Du känner ibland igen snabba reaktioner eller impulser, utan att de framträder genomgående starkt.",
  "Viss inre rastlöshet och behov av stimulans finns i svaren, men bilden är inte genomgående stark.",
  "Igångsättning och tidsuppfattning kan vara svåra i vissa situationer, men inte lika tydligt över hela området.",
  "Du beskriver viss påverkan i vardagen. Det kan vara hjälpsamt att skilja mellan vilka situationer som fungerar och vilka som blir svåra.",
];
export function describeArea(area: Area, score: number) {
  const i = areas.indexOf(area);
  return score < 25 ? areaTexts[i].low : score >= 65 ? areaTexts[i].high : middle[i];
}
export function impactText(result: Result) {
  if (result.impactModifier === "limited") return { title: "Tydliga drag, men begränsad påverkan i vardagen", text: "Du känner igen flera ADHD-relaterade mönster, men dina svar tyder på att de i nuläget påverkar vardagen relativt lite. Det gör helhetsbilden mindre entydig." };
  if (result.impactModifier === "marked") return { title: "Tydligt mönster med märkbar vardagspåverkan", text: "Svårigheterna verkar inte bara finnas som enskilda drag utan påverkar också flera delar av vardagen. Det stärker betydelsen av helhetsmönstret." };
  return { title: "Så påverkas din vardag", text: describeArea("impact", result.scores.impact) + " Vardagspåverkan hålls separat från symptomindex och kan inte i sig fastställa orsaken till svårigheterna." };
}
export function standoutText(result: Result) {
  if (result.symptomIndex === 0) return "Du har svarat Aldrig på samtliga frågor i de fem symptomområdena. Inget av dessa områden sticker ut framför de andra.";
  const top = result.ranked.filter(a => result.scores[a] === result.scores[result.ranked[0]]);
  if (top.length > 1) return `${top.length === 2 ? "Två områden" : "Flera områden"} framträder lika tydligt: ${top.map(a => areaNames[a].toLowerCase()).join(", ")}. Helheten behöver läsas tillsammans med vardagspåverkan.`;
  if (result.leadingGap >= 15) return `${areaNames[result.ranked[0]]} ligger tydligare över de andra symptomområdena. ${describeArea(result.ranked[0], result.scores[result.ranked[0]])}`;
  const close = result.ranked.filter(a => result.scores[result.ranked[0]] - result.scores[a] < 15);
  return `${close.map(a => areaNames[a]).join(" och ")} ligger nära varandra. Det är kombinationen av dessa svar, tillsammans med vardagspåverkan, som behöver tolkas.`;
}
