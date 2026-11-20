import type { DimensionScore, Evidence } from "../types";
import { coreQuestions } from "../v3/questions";
import { scoreDimensions } from "../v3/score";
import { patterns, type Key, type Pattern } from "./patterns";

const keyFor = (item: Evidence) => coreQuestions[Number(item.questionId.slice(1)) - 1];
const coded = (item: Evidence) => keyFor(item).reverse ? 6 - item.answer : item.answer;

function signals(dimensions: readonly DimensionScore[]) {
  return dimensions.flatMap(dimension => {
    if (dimension.valid < 4 || dimension.value === null) return [];
    const mean = dimension.raw / dimension.valid;
    const sign = mean >= 3.5 ? 1 : mean <= 2.5 ? -1 : 0;
    if (!sign) return [];
    const support = dimension.evidence.filter(item => (coded(item) - 3) * sign >= 1);
    const oppose = dimension.evidence.filter(item => (coded(item) - 3) * sign <= -1);
    if (support.length < 3 || support.length - oppose.length < 2) return [];
    return [{
      key: `${dimension.dimension}${sign === 1 ? "+" : "-"}` as Key,
      dimension: dimension.dimension, support, oppose,
      weight: support.length - 2 * oppose.length + Math.abs(mean - 3) - (6 - dimension.valid) * 0.5,
      qualified: oppose.length > 0 || dimension.valid < 6,
    }];
  });
}

const mixedPatterns: readonly (Pattern & { require: readonly number[] })[] = [
  {
    id: "different-speed", keys: [], require: [9, 14, 37], name: "Den uppmärksamma lotsen",
    core: "Tre svar ger en mer nyanserad bild av press än ett genomsnitt kan göra. Du kan vara uppmärksam på att något står på spel och ändå ha ett annat tempo när du väl behöver agera.",
    strength: "Att skilja en tidig varningssignal från själva agerandet kan ge dig tid att förbereda dig utan att situationen tar över.",
    risk: "Att fungera väl i ett pressat ögonblick säger mindre om hur mycket energi som går åt före eller efter det.",
    experiment: "Prova att notera vad som tog energi före, under och efter en pressad situation. Välj när du lägger in återhämtning utifrån just den skillnaden.",
    scene: "Inför ett svårt samtal kan förberedelsen kännas mer krävande än själva samtalet. Testa att reservera tid både före och efter.",
    tension: "En tidig signal om att läget kostar energi och ett lugnt agerande kan båda vara relevanta. Pausen behöver inte vänta tills agerandet blir svårt.",
    free: ["Din reaktion före press kan skilja sig från reaktionen mitt i den", "Svaren om oro, lugn under press och tidiga paussignaler pekar på olika delar av samma förlopp.", "Att skilja dem åt kan göra det lättare att lägga in återhämtning när den faktiskt behövs.", "Porträttet visar ett sätt att upptäcka vilken del som tar mest energi."],
  },
  {
    id: "start-versus-course", keys: [], require: [3, 18, 32], name: "Den tröskelkänsliga planeraren",
    core: "Det kan vara lättare att hålla riktningen när du är igång än att gå från avsikt till första handling. Att göra planen bättre kan därför ha mindre effekt än att göra första steget mindre.",
    strength: "När en uppgift väl har kommit i rörelse kan tydliga etapper ge något att bygga vidare på.",
    risk: "En plan kan ge en känsla av framsteg innan den första handlingen har blivit av.",
    experiment: "Skriv första handlingen så liten att den får plats på två minuter. Utvärdera först efter den om resten av planen behöver ändras.",
    scene: "Inför en uppgift du har skjutit framför dig kan du prova att öppna dokumentet och skriva en ofärdig rad innan du gör en ny lista.",
    driver: "En tydlig första handling kan vara mer hjälpsam än ännu en påminnelse om slutmålet.",
    tension: "Struktur kan hjälpa dig att hålla kursen, medan starten kan behöva mindre struktur och ett mer omedelbart steg.",
    free: ["En bra plan kan lösa fel del av uppgiften", "Ditt underlag skiljer på att hitta riktning och att komma i rörelse.", "Att lägga märke till vilken del som är svår gör det lättare att välja rätt sorts hjälp.", "I porträttet får du ett försök som testar skillnaden i vardagen."],
  },
  {
    id: "opinion-versus-request", keys: [], require: [35, 36, 40], name: "Den eftertänksamma förhandlaren",
    core: "Att säga vad man tycker och att sätta gräns för vad man går med på ställer olika krav. Dina svar gör det rimligt att undersöka om själva beskedet behöver mer tid än åsikten.",
    strength: "En uttryckt åsikt kan göra en förhandling tydlig även om du väntar med själva åtagandet.",
    risk: "Om du behandlar ett snabbt besked som en social artighet kan andra redan börja planera utifrån det.",
    experiment: "Öva på att säga vad du tycker och be om en betänketid i samma samtal. Återkom med beskedet vid den tid ni kom överens om.",
    scene: "Om någon föreslår en plan som tar mer tid än du tänkt kan du säga vad som verkar bra och ändå vänta med att lova att du deltar.",
    relationship: "Att skilja mellan åsikt och besked kan ge utrymme för både tydlighet och omtanke i ett nära samtal.",
    tension: "Tydlighet om vad du tycker behöver inte innebära att det är lika lätt att veta vad du vill förbinda dig till i stunden.",
    free: ["Du kan veta vad du tycker innan du vet vad du vill lova", "I dina svar är en åsikt och ett åtagande två olika saker.", "Det ger ett konkret sätt att förstå varför ett tydligt samtal ändå kan sluta med ett besked du vill tänka om.", "Rapporten visar hur du kan skapa en paus mellan åsikten och beslutet."],
  },
];

export function analyze(answers: readonly number[]) {
  const dimensions = scoreDimensions(answers);
  const supported = signals(dimensions);
  const evidenceAt = (number: number): Evidence => ({ questionId: `Q${String(number).padStart(2, "0")}`, answer: answers[number - 1] });
  const candidates = patterns.flatMap(pattern => {
    const matches = supported.filter(signal => pattern.keys.includes(signal.key));
    if (matches.length !== pattern.keys.length) return [];
    const context = (pattern.context ?? []).filter(number => answers[number - 1] >= 4).map(evidenceAt);
    return [{
      pattern, evidence: matches.flatMap(signal => signal.support), context,
      counterEvidence: matches.flatMap(signal => signal.oppose),
      dimensions: matches.map(signal => signal.dimension),
      qualified: matches.some(signal => signal.qualified),
      rank: matches.reduce((sum, signal) => sum + signal.weight, 0) + context.length * 0.75,
    }];
  });
  for (const pattern of mixedPatterns) {
    if (!pattern.require.every(number => answers[number - 1] >= 4)) continue;
    const evidence = pattern.require.map(evidenceAt);
    const sourceDimensions = evidence.filter(item => Number(item.questionId.slice(1)) <= 30).map(item => keyFor(item).dimension);
    candidates.push({
      pattern, evidence, context: [], counterEvidence: [], dimensions: [...new Set(sourceDimensions)],
      qualified: true, rank: 6 + evidence.filter(item => item.answer === 5).length * 0.5,
    });
  }
  return {
    dimensions,
    candidates: candidates.sort((a, b) => b.rank - a.rank),
    eligible: dimensions.every(dimension => dimension.value !== null),
  };
}

export type Candidate = ReturnType<typeof analyze>["candidates"][number];
