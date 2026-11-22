import { frozen, REPORT_VERSION as ARCHIVE_VERSION } from "../release-v61/manifest";
import { parseSubmission, object } from "../release-v61/submission";
import { coreQuestions } from "../v3/questions";
import { presentCompletion } from "../../report/v61Presentation";
import type { Dimension } from "../types";

// The frozen analysis and archived purchases are unchanged. This identity binds
// the corrected offer and the additional, explicitly scoped report presentation.
export const PURCHASE_VERSION = "persona-report-v61-release2";
export const DELIVERY_VERSION = "persona-v61-delivery-v2";
export function parsePurchase(input: unknown, allowSkipped = false) {
  const value = object(input);
  if (value.reportVersion !== PURCHASE_VERSION) throw Error("Invalid PERSONA purchase");
  const parsed = parseSubmission({ ...value, reportVersion: ARCHIVE_VERSION });
  if (!allowSkipped && !parsed.answers.every(a => a >= 1 && a <= 5)) throw Error("Complete PERSONA answers required");
  return parsed;
}

const areas: Record<Dimension, { short: string; high: string; low: string; middle: string; experiment: string }> = {
  E: { short: "socialt sätt", high: "Du lutar åt att ta plats och söka kontakt.", low: "Du lutar åt ett mer återhållsamt socialt sätt.",
    middle: "Svaren pekar inte tydligt mot vare sig ett utåtriktat eller ett återhållsamt socialt sätt.",
    experiment: "Efter nästa träff, skriv ner vilken del du ville ha mer av och vilken del du gärna hade kortat. Jämför med en träff i en annan form innan du drar slutsatser om hur mycket kontakt som passar dig." },
  A: { short: "hänsyn och samspel", high: "Hänsyn och samarbete tar tydlig plats i dina svar.", low: "Du beskriver mindre av den kombination av tillit, hänsyn och samarbetsvilja som skalan fångar.",
    middle: "Det finns ingen tydlig gemensam riktning för tillit, hänsyn och samarbete i dina svar.",
    experiment: "Vid nästa gemensamma val, skilj på vad du själv föredrar och vad ni kommer överens om. Skriv ner båda efteråt. Då kan du undersöka hur ditt eget önskemål fick plats utan att betygsätta hur snäll du var." },
  C: { short: "struktur och genomförande", high: "Planering och ordning har en tydlig plats i din beskrivning av dig själv.", low: "Du beskriver mindre av ett genomgående planerat och ordnat sätt att få saker gjorda.",
    middle: "Planering, start och genomförande bildar ingen tydlig gemensam riktning i dina svar.",
    experiment: "Välj en liten vardagssak du ändå tänkt göra. Notera om en bestämd starttid eller ett fritt tidsfönster fungerade bäst. Prova den andra formen nästa gång; välj sedan utifrån vad som faktiskt hjälpte." },
  N: { short: "känslomässiga reaktioner", high: "Du beskriver tydligare känslomässiga reaktioner i flera delar av skalan.", low: "Du beskriver mindre oro och känslomässig reaktivitet i den här självskattningen.",
    middle: "Svaren ger inget tydligt samlat besked om hur starkt eller stabilt du brukar reagera känslomässigt.",
    experiment: "Efter nästa vardagliga motgång, anteckna vad som hände och hur länge reaktionen märktes. Gör samma sak en annan dag. Jämför händelserna utan att förutsätta att du borde reagera mer eller mindre." },
  O: { short: "idéer och upplevelser", high: "Nyfikenhet på idéer och upplevelser har tydligt stöd i flera svar.", low: "Svaren lutar mer åt det bekanta än åt att söka nya idéer och upplevelser.",
    middle: "Fantasi, idéintresse och intresse för upplevelser pekar inte tydligt åt samma håll.",
    experiment: "Välj mellan ett bekant alternativ och en liten ny variant nästa gång du har en ledig stund. Notera vad du valde och vad du uppskattade. Upprepa i ett annat sammanhang; det nya behöver inte vara det bättre valet." },
};
type Display = ReturnType<typeof presentCompletion>;
type DisplayBlock = Display["sections"][number]["blocks"][number];
function block(title: string, interpretation: string, example?: string): DisplayBlock {
  return { title, interpretation, example, observation: undefined, adviceReason: undefined, limitations: [] };
}

/** Uses the same frozen scores and evidence rules. No extra engine insights are activated. */
export function buildPurchaseReport(input: unknown) {
  const submission = parsePurchase(input);
  const completion = frozen.completeReport(submission.answers, submission.supplement?.answers ?? {});
  const original = presentCompletion(completion);
  const readings = completion.baseReport.readings;
  const diagnostics = readings.map(r => {
    const coded = r.score.evidence.map(e => {
      const q = coreQuestions.find(q => q.id === e.questionId)!;
      return q.reverse ? 6 - e.answer : e.answer;
    });
    return { ...r, low: coded.filter(v => v <= 2).length, middle: coded.filter(v => v === 3).length,
      high: coded.filter(v => v >= 4).length };
  });
  const neutral = submission.answers.every(a => a === 3);
  const sameRaw = new Set(submission.answers).size === 1;
  const mixed = diagnostics.filter(r => r.low > 0 && r.high > 0);
  const clear = diagnostics.filter(r => r.direction === "high" || r.direction === "low");
  const evidence = diagnostics.map(r => ({ dimension: r.dimension, direction: r.direction,
    answers: r.score.evidence, low: r.low, middle: r.middle, high: r.high }));
  const summary = (d: typeof diagnostics[number]) => {
    const copy = areas[d.dimension];
    if (d.direction === "high") return copy.high;
    if (d.direction === "low") return copy.low;
    if (d.low && d.high) return `Inom ${copy.short} finns både svar i lägre och högre riktning. Ett mittvärde här sammanfattar skillnader mellan påståenden, inte en jämn egenskap.`;
    return copy.middle;
  };
  const focus = mixed[0] ?? diagnostics.find(r => r.direction === "middle") ?? diagnostics[0];
  const second = diagnostics.find(r => r.dimension !== focus.dimension && r.direction === "middle") ?? diagnostics.find(r => r.dimension !== focus.dimension)!;
  const mapBlocks = diagnostics.map(d => block(d.score.name, `${summary(d)} Medelvärde: ${String(d.score.value).replace(".", ",")} av 5. Av sex kodade svar ligger ${d.low} i lägre riktning, ${d.middle} i mitten och ${d.high} i högre riktning.`));
  const portrait = neutral
    ? "Du har valt mitten genom hela självskattningen. Därför går det inte att skilja ut en dominerande personlighetstendens här. Det är en beskrivning av svarsmönstret, inte ett tecken på att du saknar personlighet eller har lika lätt för allt. Mittsvar kan betyda att ett påstående passar ibland, att sammanhanget spelar roll eller att det är svårt att bedöma. Vilket som gäller för dig behöver du själv pröva. Din karta nedan visar vad resultatet faktiskt säger och hur du kan undersöka det vidare."
    : sameRaw
      ? "Du använder samma svar genom hela testet, även när påståendena pekar åt olika håll. Därför blir flera medelvärden missvisande om de läses som en stabil personlighet. Vi ger dig ingen påhittad arketyp. Kartan skiljer i stället mellan skalans sammanfattning och de motriktade svar som ligger bakom. Fördjupningen hjälper dig att undersöka vad som passar i olika situationer, utan att bestämma varför du svarat som du gjort."
      : `Din profil är mer nyanserad än en enda etikett. ${clear.slice(0, 2).map(summary).join(" ")} ${mixed.length ? `Inom ${mixed.map(d => areas[d.dimension].short).join(", ")} pekar enskilda svar i olika riktningar. Det behöver inte vara en motsägelse i ditt sätt att vara, men testet kan inte avgöra i vilka situationer skillnaderna uppstår.` : "Flera områden saknar en tydlig riktning. Där är det mer användbart att undersöka konkreta situationer än att välja en bestämd personlighetsetikett."}`;
  const fallbacks: Record<string, DisplayBlock[]> = {
    persona: [block("En profil med utrymme för nyanser", portrait)],
    insights: [block(neutral ? "Mittsvar är inte samma sak som balans" : "Ett medelvärde kan dölja skillnader",
      `${summary(focus)} ${summary(second)} ${neutral ? "Eftersom du valde mitten även i fördjupningen finns inget stöd för att kalla detta flexibilitet, trygghet eller obeslutsamhet." : "Områdena ska läsas var för sig; det finns inte tillräckligt stöd för ett nytt orsakssamband mellan dem."} Det användbara nästa steget är att jämföra en situation där en beskrivning passar med en där den inte gör det. Då undersöker du en konkret skillnad utan att behöva välja mer extrema svar.`)],
    strengths: [block("Resurser att upptäcka i det du redan gör",
      `Dina svar om ${areas[focus.dimension].short} ger inte tillräckligt stöd för att utnämna en bestämd styrka. Börja därför med ett tillfälle du själv tycker fungerade bra. Beskriv handlingen, inte ett positivt profilord. Det kan till exempel vara att du ordnade en detalj, tog en kontakt eller gav dig tid att tänka. Vilken handling som faktiskt hjälpte är viktigare än att den passar en arketyp.`,
      "Välj en händelse från den senaste veckan. Skriv: Vad gjorde jag? Vad blev bättre? I vilket annat läge skulle samma handling vara användbar? Exemplet är en undersökningsövning, inte något testet antar att du har gjort.")],
    blindSpots: [block("Undvik att låta genomsnittet bli hela bilden",
      `${neutral ? "Alla dina svar ligger i mitten." : `${mixed.length} av fem dimensioner innehåller svar i både lägre och högre riktning.`} Det ger inte stöd för att tillskriva dig en viss svaghet. En möjlig felläsning av just den här kartan är däremot att göra mittvärdet till en egenskap. Håll isär det du känner igen, det du inte känner igen och det som beror på situationen.`,
      "Om ett omdöme om dig känns för allmänt, be om ett konkret exempel och jämför med ett tillfälle som blev annorlunda. Det gör omdömet möjligt att granska i stället för något du måste acceptera eller avvisa helt.")],
    relationships: [],
    compass: [block(`Undersök ${areas[focus.dimension].short} i två situationer`, areas[focus.dimension].experiment,
      "Det här är ett sätt att skaffa bättre underlag om dig själv, inte en uppmaning att ändra personlighet. Behåll det som fungerar och lämna övningen om den inte tillför något.")],
  };
  const relationScores = ["E", "A"].map(id => diagnostics.find(d => d.dimension === id)!);
  fallbacks.relationships[0] = block("Kontakt och hänsyn behöver läsas var för sig",
    `Ditt sociala medelvärde är ${String(relationScores[0].score.value).replace(".", ",")} och värdet för hänsyn och samspel är ${String(relationScores[1].score.value).replace(".", ",")}. ${neutral ? "Båda bygger enbart på mittsvar." : relationScores.every(d => d.low && d.high) ? "Båda innehåller svar i motsatta riktningar." : "De två skalorna beskriver olika delar av hur du förhåller dig till andra."} Formen för kontakten och utrymmet för din egen åsikt behöver därför undersökas var för sig. En lugn träff kan rymma en tydlig åsikt, och ett livligt samtal kan lämna något viktigt osagt. Kartan avgör inte hur en viss relation fungerar.`,
    "Tänk på en kontakt du själv vill förstå bättre. Vilken form gjorde det lättast att prata, och kom det du ville säga faktiskt fram? Om formen passade men något förblev osagt har du en mer avgränsad sak att utforska än om hela mötet kändes fel.");
  const presentation: Display = {
    ...original,
    title: clear.length ? original.title : neutral ? "Din personlighet bakom mittsvaren" : "En profil med flera riktningar",
    sections: original.sections.map(section => {
      const replacePortrait = section.id === "persona" && (neutral || sameRaw);
      const existing = section.blocks.length > 0 && !replacePortrait;
      const blocks = existing ? section.blocks : fallbacks[section.id];
      const title = !existing && section.id === "strengths" ? "Styrkor att undersöka" :
        !existing && section.id === "blindSpots" ? "Möjliga fallgropar i tolkningen" :
        !existing && section.id === "insights" ? "Perspektiv att utforska" : section.title;
      return { ...section, title, note: existing ? section.note : undefined,
        blocks: section.id === "persona" ? [...blocks, block("Så läser du din personlighetskarta", "Skalan går från 1 till 5. Omvända påståenden har kodats i samma riktning före beräkningen. Medelvärdet sammanfattar dina svar och jämför dig inte med andra människor. Fördelningen bredvid visar om mitten kommer från mittsvar eller från svar som pekar åt olika håll."), ...mapBlocks] : blocks };
    }),
  };
  // Do not extract or expose the paid report in the public response.
  const insight = completion.baseReport.sections.find(s => s.id === "insights")?.blocks.find(b => b.source === "insight");
  const teaser = insight ? { title: insight.title, text: [insight.observation, insight.interpretation].filter(Boolean).join(" ") }
    : neutral ? { title: "Samma mittpunkt – men ingen färdig etikett", text: "Både ditt sociala sätt och din planering hamnar i mitten. Här kommer det från mittsvar, inte från tydliga ytterligheter som tar ut varandra. Vi beskriver dig därför inte som särskilt balanserad eller obeslutsam. Rapporten visar vad kartan faktiskt säger och ger konkreta sätt att utforska det som inte framgår." }
    : { title: mixed.length ? "Ett mittvärde med flera riktningar bakom" : "Fler nyanser än en enda personlighetsetikett",
      text: `${summary(focus)} ${summary(second)} ${sameRaw ? "Samma svar på även motriktade påståenden gör att vi undviker en tvärsäker etikett." : "Det är en skillnad värd att undersöka, utan att anta att det ena orsakar det andra."} I rapporten skiljer vi på de tydliga tendenserna och det som behöver förstås i sitt sammanhang.` };
  return { submission, completion, presentation, teaser, evidence, deliveryVersion: DELIVERY_VERSION };
}
