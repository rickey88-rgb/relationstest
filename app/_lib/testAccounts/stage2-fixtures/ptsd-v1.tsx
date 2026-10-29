// Frozen paid report extracted from the existing guest page before stage 2. Synthetic regression reference only.
import type { Ref } from "react";
import { areaLevel, dimensionExplanations, dimensionNames, dimensions, symptomLevel, type Result } from "../../../ptsd-test/test/model";
const section = "mt-8 space-y-4 rounded-2xl border border-neutral-200 p-5 leading-7 sm:p-6";
function topAreaSummary(result: Result) {
  const name = dimensionNames[result.highest];
  return `I dina svar är ${name.toLowerCase()} det tydligaste området. ${dimensionExplanations[result.highest]}`;
}

function interplay(result: Result) {
  const first = dimensionNames[result.highest].toLowerCase();
  const second = dimensionNames[result.second].toLowerCase();
  if (result.highest === "hyperarousal" && result.second === "avoidance") return "I dina svar syns både stark beredskap och ett mönster av att hålla sådant som väcker obehag på avstånd. Tillsammans kan de reaktionerna göra återhämtning eller vardagliga val mer krävande.";
  if (result.highest === "reexperiencing" && result.second === "avoidance") return "I dina svar syns både påminnelser som väcker reaktioner och försök att undvika sådant som känns svårt. Det mönstret kan innebära att vissa situationer får extra stor plats i vardagen.";
  return `${first[0].toUpperCase() + first.slice(1)} och ${second} ligger högst i dina svar. När två områden framträder samtidigt kan de förstärka hur belastande reaktionerna upplevs, men testet kan inte avgöra varför de ser ut så.`;
}

function impactCopy(result: Result) {
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

function nextStep(result: Result) {
  if (result.overallPercent >= 45 && result.scores.dailyImpact >= 45) return "Eftersom flera reaktioner och en påverkan på vardagen framträder i dina svar kan det vara hjälpsamt att överväga kontakt med vårdcentral eller annan professionell vårdkontakt för en bedömning. Du behöver inte ha en färdig förklaring för att be om stöd.";
  if (result.scores.dailyImpact >= 45) return "När reaktioner påverkar vardag, relationer eller återhämtning kan det vara värdefullt att prata med vårdcentral eller annan professionell kontakt om vad som skulle kunna hjälpa dig.";
  return "Du kan använda resultatet för att lägga märke till vilka situationer, påminnelser eller reaktioner som återkommer. Om besvären ökar eller börjar begränsa din vardag kan du söka professionellt stöd.";
}


export default function OriginalReport({ result, heading }: { result: Result; heading?: Ref<HTMLHeadingElement> }) { return <>        <section data-flow="card" className={section} aria-labelledby="result-heading"><p className="text-sm font-semibold uppercase tracking-wide text-neutral-600">Fullständig analys</p><h2 ref={heading} tabIndex={-1} id="result-heading" className="text-2xl font-semibold outline-none">Din PTSD-relaterade symtomprofil</h2><p>{symptomLevel(result.overallPercent)}. Procentvärdena beskriver bara hur dina svar fördelas i detta självtest, inte sannolikheten för en diagnos.</p><div className="grid gap-3 sm:grid-cols-2">{dimensions.map((dimension) => <div data-flow="inset" key={dimension} className="min-w-0 rounded-xl bg-neutral-50 p-4"><h3 className="font-semibold">{dimensionNames[dimension]}</h3><p className="mt-1 text-sm text-neutral-700">{areaLevel(result.scores[dimension])}</p><div className="mt-3 h-2 overflow-hidden rounded bg-neutral-200"><div data-flow="fill" className="h-full rounded bg-[#27666A]" style={{ width: `${result.scores[dimension]}%` }} /></div><p className="mt-2 text-sm text-neutral-700">{result.scores[dimension]} av 100</p></div>)}</div></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Övergripande personlig analys</h2><p>{topAreaSummary(result)}</p><p>{dimensionNames[result.second]} är näst mest framträdande. Skillnaden mellan områdena visar att helheten inte bara handlar om en totalpoäng, utan om hur olika reaktioner förhåller sig till varandra i dina svar.</p></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Fördjupning per område</h2><div className="space-y-5">{dimensions.map((dimension) => <div key={dimension} className="border-t border-neutral-200 pt-5 first:border-t-0 first:pt-0"><h3 className="font-semibold text-neutral-950">{dimensionNames[dimension]}</h3><p>{dimensionExplanations[dimension]}</p><p><strong>I dina svar:</strong> {areaLevel(result.scores[dimension])}.</p><p className="font-medium">Reaktioner som ligger högst i det här området:</p><ul className="list-disc space-y-2 pl-5 text-sm">{result.drivers[dimension].filter((item) => item.answer > 0).map((item) => <li key={item.index}>{item.text}</li>)}{!result.drivers[dimension].some((item) => item.answer > 0) && <li>Inga enskilda reaktioner framträder i dina svar inom detta område.</li>}</ul></div>)}</div></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Så hänger dina svar ihop</h2><p>{interplay(result)}</p></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Det som påverkar dig mest</h2><p>{impactCopy(result)}</p><p>{result.scores.dailyImpact >= 45 ? "Påverkan på vardagen är en tydlig del av ditt resultat. Det kan vara värdefullt att ge den delen extra utrymme när du funderar på stöd och återhämtning." : "Vardagspåverkan är mindre framträdande i just dina svar, men behöver alltid förstås utifrån din egen situation."}</p></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Nästa steg</h2><p>{nextStep(result)}</p><p className="text-sm text-neutral-600">Testet undersöker inte suicidtankar och säger därför inget om suicidrisk.</p></section>
</>; }
