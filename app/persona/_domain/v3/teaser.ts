import type { Dimension, Evidence } from "../types";
import { coreQuestions, questions } from "./questions";
import { scoreDimensions } from "./score";

type Condition = readonly [question: number, agreement?: "low"];
type Pattern = { when: readonly Condition[]; headline: string; text: string };

const patterns: readonly Pattern[] = [
  { when: [[1], [2], [34]], headline: "Lätt att ta kontakt, varsam med tillit",
    text: "Du brukar vara den som börjar prata. Att lita på någon eller dela något personligt får däremot ta sin tid. Dina svar skiljer på att öppna ett samtal och att öppna sig." },
  { when: [[7], [17], [36]], headline: "Omsorg och egna önskemål",
    text: "Du känner med andra och brukar ge dem av din tid. Ibland säger du också ja när du helst skulle säga nej. Att vilja finnas där och att vilja tacka nej får båda plats i dina svar." },
  { when: [[3], [15], [31]], headline: "En plan kan ge idéerna utrymme",
    text: "Du tycker om att höra nya idéer och brukar hålla dig till en plan. Samtidigt motiverar det dig att själv få välja hur du gör. För dig kan en plan vara en ram för egna val." },
  { when: [[21], [27]], headline: "Ta ledningen utan att göra det till en tävling",
    text: "Du brukar ta ledningen när ni ska göra något tillsammans och föredrar samarbete framför tävling. I dina svar går initiativ och samarbete hand i hand." },
  { when: [[11], [26], [38]], headline: "Sällskap, utrymme och återhämtning",
    text: "Du känner dig bekväm med andra, undviker helst att dra uppmärksamhet till dig och varvar ner för dig själv. Dina svar skiljer på att trivas i ett sällskap, att stå i centrum och att återhämta sig." },
  { when: [[9], [14]], headline: "Oro och lugn kan finnas sida vid sida",
    text: "Du beskriver att du ofta oroar dig och att du brukar behålla lugnet under press. Hur ofta du oroar dig och hur du reagerar när det är pressat ger två olika bilder." },
  { when: [[2], [7]], headline: "Medkänsla i din egen takt",
    text: "Du känner med andra när de har det svårt och är samtidigt försiktig med tillit. Dina svar skiljer på att beröras av någon och att själv lita på personen." },
  { when: [[3], [18], [32]], headline: "Starten och resten av vägen",
    text: "Du brukar hålla dig till en plan, även om det ofta är svårt att komma igång. Tydliga delmål hjälper dig att hålla igång. Dina svar beskriver olika villkor för att börja och för att fortsätta." },
  { when: [[15], [20]], headline: "Nya idéer med fäste i vardagen",
    text: "Du tycker om att höra nya idéer. Samtidigt väcker idéer utan tydlig koppling till vardagen sällan ditt intresse. Nyfikenhet och ett praktiskt filter kan finnas sida vid sida." },
  { when: [[6], [11]], headline: "Tyst och bekväm",
    text: "Du är ofta tyst bland människor du inte känner och känner dig ändå ofta bekväm tillsammans med andra. Hur mycket du säger och hur du trivs berättar olika saker i dina svar." },
  { when: [[21], [26]], headline: "Leda utan att stå i centrum",
    text: "Du brukar ta ledningen när ni gör något tillsammans och undviker helst att dra uppmärksamhet till dig. För dig tycks ledning och synlighet vara två olika saker." },
  { when: [[17], [16], [38]], headline: "Tid för andra, tid för dig själv",
    text: "Du brukar ta dig tid för andra och föredrar ofta att vara för dig själv. Eftersom ensamtid också hjälper dig att varva ner tycks den fylla en annan funktion än tiden du ger andra." },
  { when: [[5], [13]], headline: "Blicken för det möjliga och det konkreta",
    text: "Du beskriver en livlig fantasi och uppmärksamhet på detaljer i det du gör. I dina svar får det som går att föreställa sig plats bredvid det som faktiskt behöver märkas." },
  { when: [[3], [28, "low"], [15]], headline: "Nyfikenhet med eftertanke",
    text: "Du gillar att höra nya idéer och brukar hålla dig till en plan. Du känner också liten igenkänning i att agera innan du tänkt efter. Idéerna och sättet att gå vidare kan få olika tempo." },
  { when: [[31], [32]], headline: "Fri väg, tydliga hållpunkter",
    text: "Att välja hur du gör ger dig motivation, och tydliga delmål hjälper dig att hålla igång. I dina svar hör frihet och struktur ihop när de fyller varsin uppgift." },
  { when: [[35], [36]], headline: "Att säga vad du tycker och att säga nej",
    text: "Du brukar säga vad du tycker även när någon nära tycker annorlunda. Ändå händer det att du säger ja när du helst vill säga nej. Åsikter och besked tycks få olika utrymme." },
];

const descriptions: Record<Dimension, readonly [lower: string, higher: string]> = {
  E: ["ett mer tillbakadraget socialt sätt", "ett mer utåtriktat socialt sätt"],
  A: ["en mer återhållsam hållning i samspelet", "hänsyn och samspel"],
  C: ["ett mindre planbundet sätt att göra saker", "struktur och genomförande"],
  N: ["lugnare känslomässiga reaktioner", "starkare känslomässiga reaktioner"],
  O: ["en större dragning till det bekanta", "nyfikenhet på idéer och upplevelser"],
};

export function selectTeaser(answers: readonly number[]) {
  const dimensions = scoreDimensions(answers);
  const eligible = dimensions.every(dimension => dimension.value !== null);
  const evidenceFor = (number: number): Evidence => ({ questionId: questions[number - 1].id, answer: answers[number - 1] });
  const matches = patterns.flatMap(pattern => {
    if (!pattern.when.every(([number, direction]) => {
      const value = answers[number - 1];
      return direction === "low" ? value === 1 || value === 2 : value >= 4;
    })) return [];
    const breadth = new Set(pattern.when.flatMap(([number]) => {
      const item = coreQuestions[number - 1];
      return item ? [item.dimension] : [];
    })).size;
    const intensity = pattern.when.reduce((sum, [number, direction]) =>
      sum + (direction === "low" ? 3 - answers[number - 1] : answers[number - 1] - 3), 0);
    return [{ pattern, rank: breadth * 4 + pattern.when.length * 2 + intensity }];
  });
  const best = matches.sort((a, b) => b.rank - a.rank)[0]?.pattern;
  if (best) return { eligible, headline: best.headline, text: best.text, evidence: best.when.map(([number]) => evidenceFor(number)) };

  // A broad fallback names two well supported tendencies without claiming one causes the other.
  const tendencies = dimensions.flatMap(dimension => {
    if (dimension.value === null) return [];
    const direction = dimension.value > 3 ? 1 : -1;
    const coded = (item: Evidence) => coreQuestions[Number(item.questionId.slice(1)) - 1].reverse ? 6 - item.answer : item.answer;
    const aligned = dimension.evidence.filter(item => (coded(item) - 3) * direction >= 1);
    const against = dimension.evidence.length - aligned.length - dimension.evidence.filter(item => coded(item) === 3).length;
    if (aligned.length < 3 || aligned.length - against < 2) return [];
    return [{ label: descriptions[dimension.dimension][direction > 0 ? 1 : 0], evidence: aligned, rank: aligned.length - against }];
  }).sort((a, b) => b.rank - a.rank);
  const [first, second] = tendencies;
  if (first && second) return {
    eligible, headline: "Två sidor som får plats samtidigt",
    text: `Flera av dina svar pekar mot ${first.label}. Andra pekar mot ${second.label}. Båda tendenserna syns i dina svar, även om de säger något om olika delar av vardagen.`,
    evidence: [...first.evidence.slice(0, 3), ...second.evidence.slice(0, 3)],
  };

  return {
    eligible, headline: "Dina svar lämnar flera möjligheter öppna",
    text: eligible
      ? "Dina svar ger underlag för de fem dimensionerna, men inget tydligt samspel att lyfta i en enda insikt. Rapporten visar vad varje dimension bygger på."
      : "Fler besvarade grundfrågor kan göra det lättare att se hur flera sidor av dig hänger ihop.",
    evidence: [],
  };
}
