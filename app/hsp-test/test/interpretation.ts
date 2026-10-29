import { dimensionNames, level, type Dimension, type Result } from "./model";

export function dimensionText(dimension: Dimension, raw: number) {
  const high = raw >= 20;
  const copy: Record<Dimension, { everyday: string; strength: string; strategy: string }> = {
    overstimulation: { everyday: "Många samtidiga krav, sociala intryck eller hektiska miljöer kan ta mycket energi.", strength: "Du kan ha en god förmåga att märka när tempot eller mängden intryck blir för hög.", strategy: "Planera in återhämtning och försök minska antalet samtidiga krav när det går." },
    sensory: { everyday: "Ljud, ljus, dofter eller kroppsliga intryck kan lättare konkurrera om din uppmärksamhet.", strength: "Du kan registrera detaljer i miljön som andra inte alltid lägger märke till.", strategy: "Anpassa miljön med lugnare ljud, ljus eller pauser från intensiva intryck när du behöver det." },
    emotional: { everyday: "Känslomässigt intensiva situationer eller kritik kan fortsätta påverka dig efteråt.", strength: "Du kan ha nära kontakt med vad som berör dig och vad som känns betydelsefullt.", strategy: "Ge återhämtning efter starka situationer och skilj på det du behöver lösa nu och det som kan få vila." },
    processing: { everyday: "Beslut, samtal och händelser kan få flera lager som du fortsätter att fundera över.", strength: "Djup reflektion kan hjälpa dig se nyanser och konsekvenser.", strategy: "Sätt en rimlig tidsgräns för större beslut så att reflektion får plats utan att ta över." },
    social: { everyday: "Tonfall, stämningar och andras känslor kan påverka din egen energi och ditt humör.", strength: "Du kan ha en fin känslighet för sociala signaler och vad som pågår mellan människor.", strategy: "Ta korta pauser från spända miljöer och påminn dig om vad som är ditt ansvar respektive någon annans." },
    positive: { everyday: "Musik, natur, estetiska upplevelser och små detaljer kan få stor betydelse i din vardag.", strength: "Mottaglighet för positiva upplevelser och subtila nyanser kan vara en värdefull resurs.", strategy: "Skapa medvetet utrymme för miljöer och upplevelser som ger energi och återhämtning." },
  };
  return { ...copy[dimension], opening: high ? `Det här området är ${level(raw).toLowerCase()} i dina svar.` : `Det här området är ${level(raw).toLowerCase()} i dina svar och får en mindre framträdande roll i profilen.` };
}

export function overview(result: Result) {
  const highest = dimensionNames[result.highest]; const second = dimensionNames[result.second];
  if (result.pattern === "even") return `Din profil är tydligt jämn: flera former av känslighet ligger på liknande nivå. ${highest} är högst, men ingen enskild del tar över helheten.`;
  if (result.pattern === "pair") return `Din profil leds av ${highest} och ${second}, två områden som ligger nära varandra och tydligt över din övriga nivå. Kombinationen mellan dem är central för helheten.`;
  if (result.pattern === "contrast") return `${highest} är tydligast i din profil, samtidigt som skillnaden till ${dimensionNames[result.lowest]} är stor. Det ger en profil med en tydlig kontrast mellan olika typer av känslighet.`;
  if (result.pattern === "dominant") return `${highest} ligger tydligt över din genomsnittliga nivå. Det är den del som framför allt formar hur din samlade profil ser ut.`;
  return `${highest} är mest framträdande, men din profil består av flera delar som behöver ses tillsammans snarare än som en enda etikett.`;
}

