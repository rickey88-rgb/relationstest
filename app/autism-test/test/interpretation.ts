import { areaNames, areas, type Result, type Area } from "./model";
import { areaTexts } from "./copy";
export function describeArea(area: Area, score: number) {
  const text = areaTexts[areas.indexOf(area)];
  return score < 25 ? text.low : score >= 65 ? text.high : text.middle;
}
export function impactText(result: Result) {
  const detail = ` I den direkta frågan om vardagspåverkan svarade du ${["Aldrig", "Sällan", "Ibland", "Ofta", "Mycket ofta"][result.impactAnswer].toLowerCase()}, och i frågan om mönster under en stor del av livet ${["Aldrig", "Sällan", "Ibland", "Ofta", "Mycket ofta"][result.historyAnswer].toLowerCase()}. Återblicken fastställer inte när mönstren började.`;
  if (result.impactModifier === "limited") return { title: "Tydliga autismrelaterade drag i svaren, men mer begränsad uppgiven vardagspåverkan eller långvarighet", text: "Skillnaden mellan de fem mönsterområdena och denna dimension gör helheten mindre entydig. Den behöver inte betyda att dina erfarenheter är oviktiga." + detail };
  if (result.impactModifier === "marked") return { title: "Tydligt autismrelaterat svarsmönster med märkbar vardagspåverkan och/eller långvarighet", text: "Både mönsterindex och den modifierande dimensionen ligger högt. Skilj ändå mellan påverkan i dag, återhämtning, anpassning och erfarenheter tidigare i livet." + detail };
  if (result.impactModifier === "impactWithoutPattern") return { title: "Uppgiven belastning utan ett tydligt samlat autismmönster", text: "Du beskriver reell vardagspåverkan, behov av återhämtning och/eller långvariga erfarenheter, men de övriga svaren bildar inte ett särskilt tydligt autismrelaterat mönster. Andra förklaringar bör också övervägas. Det förminskar inte det du upplever." + detail };
  return { title: "Påverkan och historia behöver läsas var för sig", text: describeArea("impactHistory", result.scores.impactHistory) + " Dimensionen ingår inte i symptomindex och kan inte fastställa orsaken." + detail };
}
export function standoutText(result: Result) {
  if (result.symptomIndex === 0) return "Du har svarat Aldrig i alla fem mönsterområden. Inget av dem sticker ut; det finns ingen förhöjd kombination i dessa svar.";
  const top = result.ranked.filter(area => result.scores[area] === result.scores[result.ranked[0]]);
  if (top.length > 1) return `${top.length === 2 ? "Två områden" : "Flera områden"} ligger lika högt: ${top.map(area => areaNames[area].toLowerCase()).join(", ")}. Lika högt betyder inte automatiskt en hög nivå; läs också delresultaten.`;
  if (result.leadingGap >= 15) return `${areaNames[result.ranked[0]]} ligger tydligt över de andra mönsterområdena. ${describeArea(result.ranked[0], result.scores[result.ranked[0]])}`;
  const close = result.ranked.filter(area => result.scores[result.ranked[0]] - result.scores[area] < 15);
  return `${close.length === 2 ? "Två områden är ungefär lika framträdande" : "Flera områden ligger nära varandra"}: ${close.map(area => areaNames[area].toLowerCase()).join(", ")}. Kombinationen är mer relevant än att utse en ensam domän.`;
}
