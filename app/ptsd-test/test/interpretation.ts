import { dimensionNames, dimensionExplanations, type Result } from "./model";

export function topAreaSummary(result: Result) {
  const name = dimensionNames[result.highest];
  return `I dina svar är ${name.toLowerCase()} det tydligaste området. ${dimensionExplanations[result.highest]}`;
}

export function interplay(result: Result) {
  const first = dimensionNames[result.highest].toLowerCase();
  const second = dimensionNames[result.second].toLowerCase();
  if (result.highest === "hyperarousal" && result.second === "avoidance") return "I dina svar syns både stark beredskap och ett mönster av att hålla sådant som väcker obehag på avstånd. Tillsammans kan de reaktionerna göra återhämtning eller vardagliga val mer krävande.";
  if (result.highest === "reexperiencing" && result.second === "avoidance") return "I dina svar syns både påminnelser som väcker reaktioner och försök att undvika sådant som känns svårt. Det mönstret kan innebära att vissa situationer får extra stor plats i vardagen.";
  return `${first[0].toUpperCase() + first.slice(1)} och ${second} ligger högst i dina svar. När två områden framträder samtidigt kan de förstärka hur belastande reaktionerna upplevs, men testet kan inte avgöra varför de ser ut så.`;
}

export function impactCopy(result: Result) {
  const items = result.drivers.dailyImpact.filter((item) => item.answer >= 2);
  if (!items.length) return "I frågorna om vardagen framträder ingen enskild del som särskilt stark. Det betyder inte att andra reaktioner saknar betydelse, utan att den här delen av självtestet är mindre framträdande i dina svar.";
  const labels: Record<number, string> = {
    25: "påverkan på nära relationer",
    26: "svårigheter med arbete, studier eller vardagliga uppgifter",
    27: "begränsningar i platser, aktiviteter eller sociala situationer",
    28: "energi som går åt till att hantera eller undvika reaktioner",
    29: "påverkan på livskvaliteten",
  };
  return `I vardagsdelen framträder särskilt ${items.slice(0, 2).map((item) => labels[item.index]).join(" och ")}.`;
}

export function nextStep(result: Result) {
  if (result.overallPercent >= 45 && result.scores.dailyImpact >= 45) return "Eftersom flera reaktioner och en påverkan på vardagen framträder i dina svar kan det vara hjälpsamt att överväga kontakt med vårdcentral eller annan professionell vårdkontakt för en bedömning. Du behöver inte ha en färdig förklaring för att be om stöd.";
  if (result.scores.dailyImpact >= 45) return "När reaktioner påverkar vardag, relationer eller återhämtning kan det vara värdefullt att prata med vårdcentral eller annan professionell kontakt om vad som skulle kunna hjälpa dig.";
  return "Du kan använda resultatet för att lägga märke till vilka situationer, påminnelser eller reaktioner som återkommer. Om besvären ökar eller börjar begränsa din vardag kan du söka professionellt stöd.";
}

