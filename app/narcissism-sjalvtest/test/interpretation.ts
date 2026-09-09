import { dimensionNames, type Dimension, type Result } from "./model";

type DimensionText = { low: string; middle: string; high: string; everyday: string; relationship: string; reflection: string };
const copy: Record<Dimension, DimensionText> = {
  grandiosity: {
    low: "Du beskriver få mönster där du ser dig som särskild eller mer insiktsfull än andra.",
    middle: "Du känner delvis igen tankar om särskild förmåga eller om att förtjäna mer erkännande. Hur du använder den självbilden kan variera mellan situationer.",
    high: "En stark upplevelse av egen särskildhet eller kompetens framträder i dina svar. Du kan lägga stor vikt vid att andra också ser dessa kvaliteter.",
    everyday: "I vardagen kan detta märkas i hur du jämför prestationer, tar plats i samtal eller reagerar när din insats inte uppmärksammas.",
    relationship: "I nära relationer kan olika bilder av din förmåga skapa friktion, särskilt om ett annat perspektiv känns som att du blir nedvärderad.",
    reflection: "När hjälper din tilltro till dig själv dig, och när blir det svårt att vara nyfiken på vad någon annan kan bidra med?",
  },
  validation: {
    low: "Dina svar visar relativt litet beroende av andras uppmärksamhet eller uppskattning för att känna dig trygg i dig själv.",
    middle: "Andras uppskattning har viss betydelse för hur du mår. Det kan vara särskilt märkbart i situationer där du inte vet hur du uppfattas.",
    high: "Bekräftelse från andra verkar ha stor betydelse för din trygghet och ditt humör. Att känna sig förbisedd kan därför ta mycket plats.",
    everyday: "Det kan märkas som jämförelser, vaksamhet på respons eller ett behov av att få veta att din insats räknas.",
    relationship: "I relationer kan uppskattning bli något du söker ofta, samtidigt som partnerns tillfälliga frånvaro får större betydelse än avsett.",
    reflection: "Vilken sorts uppskattning längtar du efter, och kan du sätta ord på behovet utan att göra det till ett krav?",
  },
  entitlement: {
    low: "Du beskriver få förväntningar på särskild behandling eller att andra ska prioritera dina behov framför sina egna.",
    middle: "Du känner delvis igen förväntningar på hänsyn och anpassning. Det kan vara hjälpsamt att skilja rimliga önskemål från sådant andra inte har lovat.",
    high: "Förväntningar på hänsyn, prioritering eller särskilda undantag framträder. Besvikelse kan uppstå när andra inte delar bilden av vad du bör få tillbaka.",
    everyday: "Det kan märkas när planer ändras, regler gäller även dig eller andra väljer något som inte passar dina prioriteringar.",
    relationship: "I nära relationer kan outtalade förväntningar på motprestation skapa konflikter om vem som ger och vem som bestämmer.",
    reflection: "Tänk på en förväntning du haft på någon nära. Var den uttalad och överenskommen, eller antog du att personen borde förstå?",
  },
  empathy: {
    low: "Svaren pekar mot relativt få svårigheter att väga in andras perspektiv, ta eget ansvar och ge stöd utan direkt motprestation.",
    middle: "Det finns viss variation i hur lätt du tar in andras behov och din egen del i en konflikt. Starka känslor kan göra ömsesidighet svårare i vissa lägen.",
    high: "Svårigheter med perspektivtagande och ömsesidighet framträder. Det kan vara svårt att ge andras upplevelse plats när dina egna behov tar mycket uppmärksamhet.",
    everyday: "Området kan märkas när någon annan lyckas, behöver stöd eller beskriver att du har sårat dem.",
    relationship: "Ömsesidighet påverkar om båda får utrymme att bli förstådda. Att först återge den andras upplevelse kan göra det lättare att sedan diskutera olika tolkningar.",
    reflection: "Kan du beskriva den andras perspektiv så att personen känner igen sig, innan du förklarar din egen avsikt?",
  },
  criticism: {
    low: "Du beskriver relativt få starka eller långvariga reaktioner på kritik, avvisande och upplevd respektlöshet.",
    middle: "Kritik eller avvisande kan stanna kvar hos dig i vissa situationer. Betydelsen kan bero på vem som säger något och hur sårbar du känner dig då.",
    high: "Kritik, avvisande eller upplevelsen av att bli förminskad verkar kunna väcka starka känslor och långvarigt grubblande.",
    everyday: "Det kan märkas som att du återspelar ett samtal, vill försvara dig snabbt eller har svårt att lämna en kommentar bakom dig.",
    relationship: "I nära relationer kan återkoppling om ett beteende kännas som ett avvisande av hela dig. Att skilja dessa två kan ge mer utrymme för samtal.",
    reflection: "Vad hörde du konkret, och vilken betydelse lade du till? Finns det en skillnad mellan kritiken av handlingen och ditt värde som person?",
  },
  influence: {
    low: "Du beskriver få mönster där du medvetet använder skuld, information, charm eller närhet för att styra andras reaktioner.",
    middle: "Du känner delvis igen att anpassa information eller bemötande efter vilken reaktion du vill få. Avsikten och utrymmet för den andra personens val är viktiga att undersöka.",
    high: "Strategiska sätt att påverka andra framträder. Det kan handla om vad du berättar, hur du uttrycker dig och när du visar uppskattning.",
    everyday: "Området kan märkas när du vill få igenom något och väljer ett indirekt sätt i stället för att uttrycka önskemålet öppet.",
    relationship: "När skuld eller villkorad närhet används för att få en viss respons kan tillit och friheten att säga nej påverkas.",
    reflection: "Vad vill du få fram, och hur skulle samma önskemål låta om den andra personen fick full information och verkligt utrymme att säga nej?",
  },
};

export function interpretation(result: Result, dimension: Dimension) {
  const value = result.scores[dimension];
  const item = copy[dimension];
  return {
    summary: value >= 45 ? item.high : value >= 25 ? item.middle : item.low,
    everyday: value < 25 ? `Detta område tar mindre plats i dina svar. ${dimension === "empathy" ? "Att kunna lyssna och ge stöd utan motprestation kan vara något att fortsätta värna." : "Lägg märke till vad som hjälper dig att behålla balans i de vardagssituationer som frågorna tar upp."}` : item.everyday,
    relationship: value < 25 ? `I nära relationer kan du reflektera över hur du vill bevara ${dimension === "empathy" ? "utrymmet för bådas behov och perspektiv" : "utrymmet för egna och andras behov utan att det här mönstret tar över"}.` : item.relationship,
    reflection: item.reflection,
  };
}

export function profileAnalysis(result: Result) {
  const { scores: s, ranked } = result;
  const top = ranked[0], low = ranked[ranked.length-1];
  if (result.percent === 0) return ["Dina svar ger inga poäng för de narcissistiska mönster som självtestet mäter. Du känner inte igen de direkt formulerade dragen och instämmer i påståendena om perspektivtagande, ansvar och stöd.", "Fundera på vad som fick dig att göra testet och vad du vill bevara i dina relationer. Resultatet kan användas som utgångspunkt för ett konkret samtal om vad som fungerar, snarare än för att leta efter ett problem."];
  const paragraphs = [result.percent < 25
    ? `Dina svar visar få narcissistiska drag totalt. Det område som märks mest är ${dimensionNames[top].toLowerCase()}. Det kan ge en riktning för reflektion utan att bli en beskrivning av hela din personlighet.`
    : `Det mest framträdande området är ${dimensionNames[top].toLowerCase()}, följt av ${dimensionNames[ranked[1]].toLowerCase()}. ${result.profileType === "Främst sårbar profil" ? "Profilen kretsar främst kring hur andras respons påverkar dig." : result.profileType === "Främst grandios profil" ? "Profilen kretsar främst kring självbild, förväntningar och inflytande." : "Flera delar av profilen behöver förstås tillsammans."}`];
  if (s.validation >= 45 && s.criticism >= 45) paragraphs.push(s.influence < 25
    ? "Högt bekräftelsebehov och hög kritikkänslighet förekommer tillsammans med relativt lågt strategiskt inflytande. I just det här sambandet framträder känslighet för hur andra värderar dig mer än medveten påverkan på andra."
    : "Bekräftelsebehov och kritikkänslighet framträder tillsammans. När uppskattning betyder mycket kan en kritisk kommentar få stor betydelse för självkänslan. Fundera på om behovet av respons också påverkar hur du försöker styra ett samtal.");
  if (s.grandiosity >= 45 && s.entitlement >= 45) paragraphs.push("Stark självbild och förväntningar på särskild hänsyn förekommer tillsammans. En upplevelse av att ha mycket att bidra med kan då också färga vad du förväntar dig tillbaka. I en konflikt kan det vara användbart att skilja uppskattning från krav på att någon ska anpassa sig.");
  if (s.influence >= 45 && s.empathy >= 45) paragraphs.push("Strategiskt inflytande förekommer tillsammans med svårigheter att ta in andras perspektiv. Kombinationen kan göra det lättare att fokusera på önskat resultat än på hur den andra personen upplever vägen dit. Ett konkret fokus kan vara att göra önskemål tydliga och lyssna innan du försöker övertyga.");
  if (paragraphs.length === 1) paragraphs.push(`Jämför ${dimensionNames[top].toLowerCase()} med ${dimensionNames[ranked[1]].toLowerCase()} i en konkret situation. Är det samma behov som återkommer, eller två olika reaktioner? En liknande totalpoäng kan rymma flera olika mönster.`);
  paragraphs.push(s[low] < 25 ? `${dimensionNames[low]} ligger relativt lågt. ${low === "empathy" ? "Du rapporterar alltså få svårigheter med ömsesidighet i de här frågorna." : "Det området verkar ta mindre plats i dina svar."} Det är en del av helheten och kan hjälpa dig att välja vad du vill fokusera på.` : "Alla områden innehåller åtminstone vissa drag. Välj en konkret vardagssituation att börja med, så att reflektionen blir hanterbar och inte bara en rad etiketter.");
  return paragraphs;
}
export function teaser(result: Result) {
  const spread = result.scores[result.ranked[0]] - result.scores[result.ranked[result.ranked.length-1]];
  if (result.percent === 0) return "Du har inte rapporterat de mönster som ger poäng i självtestet. Den fullständiga profilen ger utrymme att reflektera över dina svar och det som fungerar i dina relationer.";
  return spread >= 25 ? "Din profil är ojämn: vissa områden framträder mer än andra. Den fullständiga analysen visar skillnaderna och hur de kan hänga ihop." : "Dina svar ligger förhållandevis nära varandra mellan områdena. Den fullständiga analysen visar hur delarna bidrar till din profil och kan märkas i relationer.";
}
