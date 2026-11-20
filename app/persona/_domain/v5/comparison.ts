import type { Dimension, DimensionScore } from "../types";

type Lens = {
  keys: readonly [Dimension, Dimension];
  title: string;
  distinction: string;
  strength: string;
  risk: string;
  decision: string;
  experiment: string;
};

const lenses: readonly Lens[] = [
  {
    keys: ["E", "A"], title: "Vem börjar och vem får plats?",
    distinction: "Att få igång ett samtal och att ge andra inflytande är olika uppgifter.",
    strength: "En grupp kan vinna på ett tidigt förslag som gör det lätt för andra att lägga till något.",
    risk: "En snabb överenskommelse kan dölja att deltagarna aldrig hann säga vad som var viktigt för dem.",
    decision: "Om ni behöver välja snabbt, fråga vems vardag beslutet påverkar mest. Ge den personen utrymme även om någon annan förde fram förslaget.",
    experiment: "Prova att byta de två rollerna vid nästa gemensamma beslut. Jämför vilka alternativ som kommer fram.",
  },
  {
    keys: ["O", "C"], title: "En ny idé och ett beslut som håller",
    distinction: "Att hitta fler alternativ och att göra ett av dem genomförbart kräver olika saker.",
    strength: "Ett litet försök kan förena en öppen idéfas med en tydlig plan för vad ni vill få reda på.",
    risk: "En plan kan få en oprövad idé att se färdig ut. Fler idéer kan också skjuta upp ett val som redan går att testa.",
    decision: "När ni planerar något tillsammans, avgör först om ni saknar ett alternativ eller ett sätt att jämföra alternativen.",
    experiment: "Välj ett verkligt beslut. Ge dig fem minuter för nya alternativ och fem för att formulera ett enkelt prov. Notera vilken del som gjorde beslutet lättare.",
  },
  {
    keys: ["N", "C"], title: "När något känns viktigt och när det kräver handling",
    distinction: "En känslomässig signal och behovet av en konkret åtgärd kan uppstå vid olika tidpunkter.",
    strength: "En tidig reaktion kan bli användbar när den omsätts i en tydlig fråga eller reservväg.",
    risk: "Att en risk känns påtaglig säger inte att ännu en kontroll skulle ändra beslutet.",
    decision: "När planer spricker kan ni först avgöra vad som måste lösas nu och sedan ge plats åt hur förändringen landade.",
    experiment: "Skriv ned en sak du kan göra nu och en ny uppgift som faktiskt skulle få dig att ändra planen. Vänta med fler kontroller tills den uppgiften finns.",
  },
  {
    keys: ["E", "O"], title: "Var får en ny tanke bäst arbetsro?",
    distinction: "Att bli nyfiken på en idé och att vilja utforska den i ett samtal är två olika frågor.",
    strength: "Om du växlar mellan en egen skiss och andras frågor kan olika sorters alternativ få plats.",
    risk: "Den första idén kan få försprång bara för att den kom först, både i ett rum och i egna anteckningar.",
    decision: "Inför ett gemensamt val kan alla skissa en idé var innan ni bygger vidare tillsammans.",
    experiment: "Ta två små beslut. Börja det ena med en egen skiss och det andra med ett samtal. Lägg märke till var du fick nya alternativ och var det blev lättast att välja.",
  },
  {
    keys: ["A", "N"], title: "Omtanke när något skaver",
    distinction: "Att ta hänsyn och att reagera starkt säger olika saker om vad som kan hända i ett svårt samtal.",
    strength: "En fråga om vad den andra faktiskt behöver kan göra en uppmärksammad risk till något ni kan prata om.",
    risk: "Om du gissar vad någon behöver kan du börja lösa en annan fråga än den de själva skulle ha valt.",
    decision: "I ett svårt samtal kan ni börja med vad var och en märkt och avgöra senare om ni behöver förstå mer eller fatta ett beslut.",
    experiment: "Prova frågan ’Vill du att jag lyssnar eller vill du tänka på nästa steg tillsammans?’ Lägg märke till om det ändrar hur du hjälper.",
  },
  {
    keys: ["E", "C"], title: "Från ett första förslag till nästa steg",
    distinction: "Att öppna en diskussion och att säkra det som händer efter den är skilda bidrag.",
    strength: "Ett tydligt nästa steg kan ge ett bra samtal en följd också för den som inte tog ordet.",
    risk: "En diskussion kan kännas klar fast deltagarna har helt olika bilder av vem som gör vad.",
    decision: "Avsluta en gemensam planering med vad ni faktiskt valt, vem som börjar och när ni stämmer av.",
    experiment: "Prova att sammanfatta ett gemensamt beslut i två meningar. Fråga en annan person vad de trodde skulle hända härnäst.",
  },
  {
    keys: ["E", "N"], title: "Att delta och att hinna landa",
    distinction: "Hur lätt du tar plats och hur mycket en situation påverkar dig behöver inte följa samma kurva.",
    strength: "En kort paus mellan det du hört och det du säger kan ge ett viktigt inlägg bättre tajming.",
    risk: "Andra kan tolka tempot i ditt svar som hur starkt du reagerade, trots att de två kan skilja sig åt.",
    decision: "Vid ett oväntat besked kan du visa att du hört det och samtidigt säga när du vill ge ett besked.",
    experiment: "Efter två olika samtal, notera när du tog ordet och när din reaktion blev tydlig för dig. Se om de sammanföll.",
  },
  {
    keys: ["A", "C"], title: "Hjälp som får en tydlig form",
    distinction: "Att ta hänsyn till någon och att ha kapacitet att följa upp är olika delar av samma erbjudande.",
    strength: "En konkret och avgränsad hjälp kan vara lättare att ta emot än ett öppet löfte.",
    risk: "Ett välmenat ja kan få flera att förlita sig på arbete som aldrig fått en tydlig plats.",
    decision: "När någon ber om hjälp kan ni komma överens om vad du bidrar med och vad som ligger kvar hos den som frågat.",
    experiment: "Gör nästa erbjudande mätbart i tid eller omfattning. Fråga sedan om just den hjälpen möter behovet.",
  },
  {
    keys: ["A", "O"], title: "Nya förslag som andra kan ta ställning till",
    distinction: "Att se ett nytt alternativ och att få syn på hur det skulle påverka andra är olika steg.",
    strength: "Att ta reda på vad andra vill bevara kan ge en idé bättre villkor för ett första försök.",
    risk: "Ett oprövat förslag kan avfärdas när det enda någon fått höra är vad de förväntas ändra.",
    decision: "När du föreslår en förändring, fråga vad ni vill behålla även om upplägget förändras.",
    experiment: "Testa att börja nästa förslag med vad som ska fungera som förut. Be sedan någon säga vilken följd de ser som du kan ha missat.",
  },
  {
    keys: ["N", "O"], title: "Flera förklaringar när det händer något oväntat",
    distinction: "Hur starkt du reagerar på en händelse och hur många tolkningar du ser är två olika delar av beslutet.",
    strength: "Ett andra rimligt sätt att läsa läget kan ge dig en fråga som går att undersöka.",
    risk: "Både det första intrycket och en lång lista med tänkbara förklaringar kan stå i vägen för att fråga vad som faktiskt hände.",
    decision: "Om tonen i ett meddelande överraskar, välj en fråga vars svar kan skilja två möjliga tolkningar åt.",
    experiment: "Skriv två förklaringar till ett mindre missförstånd och en sak som skulle skilja dem åt. Sök den uppgiften före nästa slutsats.",
  },
];

const labels: Record<Dimension, string> = {
  E: "socialt sätt", A: "hänsyn och samspel", C: "struktur och genomförande",
  N: "känslomässig reaktivitet", O: "öppenhet för idéer och upplevelser",
};

type Rated = DimensionScore & { value: number };
const rated = (dimension: DimensionScore | undefined): dimension is Rated => dimension?.value != null;
const format = (dimension: Rated) => `${labels[dimension.dimension]} ${dimension.value.toLocaleString("sv-SE")} av 5`;

export function selectComparison(dimensions: readonly DimensionScore[]) {
  const supported = lenses.flatMap(lens => {
    const [first, second] = lens.keys.map(key => dimensions.find(dimension => dimension.dimension === key));
    if (!rated(first) || !rated(second)) return [];
    return [{ lens, first, second, gap: Math.abs(first.value - second.value) }];
  });
  const selected = supported.sort((a, b) => b.gap - a.gap
    || Number(b.first.varied) + Number(b.second.varied) - Number(a.first.varied) - Number(a.second.varied)
    || b.first.valid + b.second.valid - a.first.valid - a.second.valid)[0];
  if (!selected) return null;
  const { lens, first, second, gap } = selected;
  const scores = `${format(first)} och ${format(second)}`;
  const reading = gap < 0.5
    ? `De två värdena ligger nära varandra: ${scores}. ${first.varied || second.varied ? "Minst ett av värdena samlar svar som går åt olika håll, så likheten säger lite om en enskild situation." : "De beskriver olika frågor, även när snitten ligger nära."}`
    : `Två värden skiljer sig i din karta: ${scores}. Skillnaden gäller ditt eget svarsunderlag och är ingen rangordning av dina förmågor.`;
  return {
    lens, reading, scores, evidence: [...first.evidence, ...second.evidence],
    qualified: first.valid < 6 || second.valid < 6 || first.varied || second.varied,
  };
}
