import { immutable } from "../immutable";
import type { Candidate, Condition, Family } from "./types";

export const CATALOG_VERSION = "persona-insights-catalog-v1.2";
export const FAMILIES: Readonly<Record<Family, string>> = immutable({
  motivation: "Drivkrafter och motivation",
  contrasts: "Inre kontraster",
  relationships: "Relationer och gränser",
  recovery: "Stress och återhämtning",
  execution: "Planering och genomförande",
  development: "Personlig utveckling",
});

function condition(questionId: string, direction: Condition["direction"], purpose: string): Condition {
  return { id: questionId + "-" + direction, questionId, direction, purpose };
}

type Draft = Omit<Candidate, "epistemicStatus" | "caution" | "questionIds" | "contradictory" | "maximumContradictions"> & { contradictory?: readonly Condition[] };

/** All entries are editorial hypotheses. Required premises can never be replaced by optional support. */
const candidates: readonly Draft[] = [
  {
    id: "autonomy-with-milestones", family: "motivation",
    title: "Eget handlingsutrymme med tydliga hållpunkter",
    required: [
      condition("Q31", "high", "Metodval motiverar"),
      condition("Q32", "high", "Delmål upplevs hjälpa"),
    ],
    supporting: [
      condition("Q03", "high", "Planer följs"),
      condition("Q23", "high", "Löften hålls"),
    ],
    contradictory: [condition("Q03", "low", "Motriktat svar på stödindikatorn om planer")],
    nuances: [condition("Q18", "high", "Startsvårighet kan samtidigt förekomma"), condition("Q23", "low", "Lågt löfteshållande motsäger inte nytta av metodfrihet och delmål")],
    minimumSupport: 3, messageKey: "autonomy-and-structure", adviceKey: "define-outcome-own-method",
    observation: "Du anger att både eget metodval och delmål hjälper dig, med ytterligare stöd från planföljande eller löfteshållande. Svaren visar inte att båda fungerar lika väl.",
    explanation: "Frihet och tydliga hållpunkter kan fylla olika funktioner för dig. Du kan pröva att bestämma målet och behålla eget metodval. Nyttan av den ramen behöver bedömas separat från hur väl enskilda löften hålls.",
    advice: "Välj en uppgift och bestäm en liten synlig leverans samt när du vill ha den klar. Lämna metoden öppen. Kontrollera efteråt om ramen gav dig handlingsutrymme.",
    limitations: ["Delmålens effekt och motivation mäts med en fråga var.", "Startsvårighet motsäger inte en preferens för autonomi och delmål.", "Lågt Q23 nyanserar genomförandet. Då krävs stöd från Q03; nyansen ersätter aldrig stöd."],
  },
  {
    id: "social-initiative-private-recovery", family: "contrasts",
    title: "Kontakt och återhämtning kan kräva olika miljöer",
    required: [
      condition("Q38", "high", "Ensamtid hjälper återhämtningen"),
      condition("Q11", "high", "Social bekvämlighet"),
      condition("Q01", "high", "Tar samtalsinitiativ"),
    ],
    supporting: [
      condition("Q21", "high", "Tar också ledning"),
      condition("Q16", "high", "Föredrar också egen tid"),
    ],
    nuances: [condition("Q06", "high", "Kan samtidigt vara tyst bland obekanta")],
    minimumSupport: 4, messageKey: "contact-versus-recovery", adviceKey: "separate-company-and-recovery",
    observation: "Du beskriver bekvämlighet och samtalsinitiativ tillsammans med att ensamtid hjälper dig att varva ner. Ytterligare ett svar stöder socialt initiativ eller egen tid.",
    explanation: "Ett givande möte och hjälpsam återhämtning kan kräva olika miljöer. Det är värt att skilja på hur samtalet fungerar och vad som passar efteråt.",
    advice: "Efter två sociala tillfällen, jämför en kort stund för dig själv med fortsatt sällskap. Notera vilket som hjälper dig att landa och använd erfarenheten när du planerar nästa kväll.",
    limitations: ["Ensamtid bevisar ingen social utmattning.", "Bekvämlighet med andra och tystnad bland obekanta kan samexistera."],
  },
  {
    id: "care-with-unwanted-yes", family: "relationships",
    title: "Omtanke och ett önskat nej behöver få varsin plats",
    required: [
      condition("Q36", "high", "Ibland ett ja trots ett önskat nej"),
      condition("Q07", "high", "Känner med andra"),
    ],
    supporting: [
      condition("Q17", "high", "Avsätter tid för andra"),
      condition("Q27", "high", "Föredrar samarbete"),
    ],
    nuances: [condition("Q35", "high", "Kan också uttrycka en annan uppfattning")],
    minimumSupport: 3, messageKey: "commitment-boundaries", adviceKey: "bounded-help",
    observation: "Du anger omtanke och ytterligare ett svar om tid för andra eller samarbete, tillsammans med tillfällen då ditt ja skiljer sig från vad du helst vill svara.",
    explanation: "Här finns ett utrymme att undersöka själva erbjudandet. Hur mycket vill du hjälpa till och vad vill du faktiskt lova? Svaren säger inte att omtanken orsakar ditt ja.",
    advice: "Vid nästa förfrågan, formulera vad du kan bidra med i tid eller omfattning. Ge ett avgränsat erbjudande och lägg märke till om beskedet blir lättare att stå för efteråt.",
    limitations: ["Q36 säger ibland och mäter inte hur ofta ett oönskat ja får konsekvenser.", "Förmåga att uttrycka en åsikt är inget motbevis mot ett oönskat ja."],
  },
  {
    id: "planning-with-stress", family: "recovery",
    title: "Planering och oro kan behöva följas upp var för sig",
    required: [
      condition("Q03", "high", "Planering och planföljande"),
      condition("Q09", "high", "Återkommande oro"),
      condition("Q13", "high", "Detaljuppmärksamhet"),
    ],
    supporting: [
      condition("Q23", "high", "Löfteshållande"),
    ],
    nuances: [
      condition("Q37", "high", "Upptäcker pausbehov"),
      condition("Q04", "high", "Känner sig också ofta avslappnad"),
      condition("Q14", "high", "Kan hålla lugnet under press"),
    ],
    minimumSupport: 4, messageKey: "worry-and-regulation", adviceKey: "separate-plan-and-worry",
    observation: "Du beskriver planföljande, oro, detaljuppmärksamhet och löfteshållande.",
    explanation: "En färdig plan och en minskad oro är två olika utfall. Kombinationen gör det relevant att undersöka vad planeringen faktiskt hjälper med utan att anta att den vare sig orsakar eller tar bort oro.",
    advice: "Inför en liten uppgift, notera vad som behöver bli ordnat och vad du oroar dig för. Följ upp efteråt om planen hjälpte arbetet, oron eller båda.",
    limitations: ["Oro bevisar inte stresskänslighet eller överkontroll.", "En tidig paussignal är en nyans och ger inget extra stöd för planföljande.", "Allmänt lugn och lugn under press avfärdar inte självrapporterad oro."],
  },
  {
    id: "ideas-with-starting-friction", family: "execution",
    title: "Idéfasen och första handlingen kan behöva olika stöd",
    required: [
      condition("Q15", "high", "Intresse för nya idéer"),
      condition("Q18", "high", "Svårt att komma igång"),
    ],
    supporting: [
      condition("Q05", "high", "Livlig fantasi"),
      condition("Q32", "high", "Delmål upplevs hjälpa"),
    ],
    nuances: [
      condition("Q03", "high", "Kan samtidigt hålla planer"),
      condition("Q28", "high", "Kan även agera före eftertanke"),
    ],
    minimumSupport: 3, messageKey: "starting-friction", adviceKey: "two-minute-start",
    observation: "Dina svar kombinerar idéintresse med startsvårighet och ytterligare stöd från fantasi eller delmål.",
    explanation: "Det som gör en uppgift lockande och det som gör den lätt att börja med kan vara olika saker. Ett tydligt första steg är därför värt att prova.",
    advice: "Välj en idé du vill ge en chans. Skriv första handlingen så liten att den går att göra på två minuter. Gör den och notera om tröskeln förändras.",
    limitations: ["Startsvårighetens orsak framgår inte.", "Planföljande och snabba handlingar utesluter inte att andra uppgifter är svårstartade."],
  },
  {
    id: "opinion-before-commitment", family: "development",
    title: "En åsikt och ett åtagande kan behöva olika betänketid",
    required: [
      condition("Q35", "high", "Uttrycker en annan uppfattning"),
      condition("Q36", "high", "Ibland ett oönskat ja"),
      condition("Q40", "high", "Vill ge besked mer betänketid"),
    ],
    supporting: [],
    nuances: [
      condition("Q28", "high", "Snabba handlingar kan också förekomma"),
      condition("Q28", "low", "Liten igenkänning i snabba handlingar"),
    ],
    minimumSupport: 3, messageKey: "commitment-boundaries", adviceKey: "return-with-answer",
    observation: "Du beskriver tydlighet om åsikter, tillfällen med ett oönskat ja och en önskan om mer tid innan du svarar.",
    explanation: "Att formulera en uppfattning och att avgöra vad du vill förbinda dig till kan vara två moment. Det ger ett avgränsat område att prova ditt uttalade utvecklingsmål inom.",
    advice: "Vid nästa förfrågan som kan vänta, säg vad du tycker om idén och ange när du återkommer med beskedet. Kontrollera om beskedet bättre motsvarade vad du ville.",
    limitations: ["Q40 uttrycker ett mål och ger ingen uppgift om varför svaret blir snabbt.", "Q28 skiljer inte mellan samma och andra situationer."],
  },
  {
    id: "lead-without-spotlight", family: "contrasts",
    title: "Att leda och att vilja synas kan vara olika saker",
    required: [
      condition("Q21", "high", "Tar ledning"),
      condition("Q26", "high", "Undviker helst uppmärksamhet"),
    ],
    supporting: [
      condition("Q01", "high", "Tar samtalsinitiativ"),
      condition("Q11", "high", "Känner sig socialt bekväm"),
    ],
    nuances: [condition("Q06", "high", "Kan vara tyst bland obekanta")],
    minimumSupport: 3, messageKey: "leadership-versus-visibility", adviceKey: "define-leading-task",
    observation: "Du tar gärna ledning men vill helst undvika uppmärksamhet, med ytterligare stöd från samtalsinitiativ eller social bekvämlighet.",
    explanation: "Det kan vara mer relevant att skilja själva uppgiften från synligheten än att kalla hela ditt sociala sätt utåtriktat eller tillbakadraget.",
    advice: "Vid nästa gemensamma aktivitet, välj en tydlig samordningsuppgift och kom överens om vem som presenterar eller står i centrum. Notera om uppdelningen passar dig.",
    limitations: ["Q21 mäter egen skattning av ledning och säger inget om ledarskapsförmåga.", "Q26 säger inget om orsaken till preferensen."],
  },
  {
    id: "empathy-with-slow-trust", family: "relationships",
    title: "Medkänsla behöver inte betyda att tillit kommer snabbt",
    required: [
      condition("Q07", "high", "Känner med andra"),
      condition("Q02", "high", "Försiktig med tillit"),
      condition("Q34", "high", "Behöver tid före personlig öppenhet"),
    ],
    supporting: [condition("Q17", "high", "Tar sig tid för andra")],
    nuances: [],
    minimumSupport: 3, messageKey: "empathy-versus-trust", adviceKey: "choose-small-disclosure",
    observation: "Du känner med andra och beskriver samtidigt försiktighet med tillit och personlig öppenhet.",
    explanation: "Att beröras av någons situation och att dela något eget kan följa olika tempo. Du kan undersöka vilken sorts kontakt som känns rimlig innan du vill öppna dig mer.",
    advice: "I en kontakt du själv vill fördjupa, välj något litet att dela. Lägg märke till hur det tas emot innan du avgör om du vill berätta mer.",
    limitations: ["Tillitens bakgrund framgår inte.", "Underlaget stödjer ingen anknytningsstil eller erfarenhet av svek."],
  },
  {
    id: "new-ideas-practical-filter", family: "motivation",
    title: "En ny idé kan behöva en synlig användning",
    required: [
      condition("Q15", "high", "Tycker om nya idéer"),
      condition("Q20", "high", "Svagt intresse utan vardagskoppling"),
      condition("Q13", "high", "Lägger märke till detaljer"),
    ],
    supporting: [],
    nuances: [condition("Q10", "high", "Föredrar också det bekanta")],
    minimumSupport: 3, messageKey: "ideas-and-usefulness", adviceKey: "idea-to-example",
    observation: "Du uppskattar nya idéer, vill gärna ha en koppling till vardagen och uppger att du märker detaljer.",
    explanation: "Ett exempel på användning kan vara ett sätt att undersöka en idé. Det behöver inte vara samma sak som att du saknar intresse för förändring.",
    advice: "När du möter en ny idé, be om ett konkret exempel och notera en detalj som skulle påverka hur den fungerar för dig.",
    limitations: ["Q20 är negativt formulerad och kan tolkas på flera sätt.", "Detta är ingen skattning av intelligens eller innovationsförmåga."],
  },
  {
    id: "imagination-and-detail", family: "contrasts",
    title: "Föreställningar och detaljer kan ge olika ingångar",
    required: [
      condition("Q05", "high", "Livlig fantasi"),
      condition("Q13", "high", "Detaljuppmärksamhet"),
      condition("Q25", "high", "Uppmärksammar vardaglig skönhet"),
    ],
    supporting: [],
    nuances: [],
    minimumSupport: 3, messageKey: "imagery-and-noticing", adviceKey: "imagine-observe-compare",
    observation: "Du beskriver livlig fantasi tillsammans med uppmärksamhet på detaljer och vardaglig skönhet.",
    explanation: "Att föreställa sig något och att se vad som faktiskt finns kan ge två ingångar när du formar en miljö eller ett uttryck. Svaren berättar inte hur skicklig du är på det.",
    advice: "När du vill förändra något litet hemma, skissa först hur du föreställer dig det. Titta sedan efter en konkret detalj i rummet och jämför om den ändrar idén.",
    limitations: ["Självskattad fantasi och estetik bevisar ingen kreativ prestation.", "Rådet är ett försök, inte ett påstående om vad personen redan gör."],
  },
  {
    id: "worry-with-composure", family: "recovery",
    title: "Oro och handlingslugn kan märkas vid olika tillfällen",
    required: [
      condition("Q09", "high", "Oroar sig ofta"),
      condition("Q14", "high", "Behåller lugnet under press"),
      condition("Q37", "high", "Märker tidiga paussignaler"),
    ],
    supporting: [],
    nuances: [condition("Q04", "high", "Beskriver också allmänt lugn")],
    minimumSupport: 3, messageKey: "worry-and-regulation", adviceKey: "notice-before-during-after",
    observation: "Du beskriver oro, lugn under press och att du tidigt märker när en paus behövs.",
    explanation: "Det är rimligt att undersöka när de olika signalerna visar sig. Ett lugnt agerande säger inte ensamt hur mycket energi situationen kräver.",
    advice: "Efter en krävande situation, notera vad som hände före, under och efter. Markera när du märkte ett pausbehov och pröva att lägga återhämtningen där nästa gång.",
    limitations: ["Frågorna visar inte att oron alltid kommer före pressen.", "Lugn i stunden bevisar varken låg belastning eller dold stress."],
  },
  {
    id: "recovery-with-late-signals", family: "recovery",
    title: "Ett sätt att varva ner och en tidig signal är olika resurser",
    required: [
      condition("Q37", "low", "Liten igenkänning i att märka pausbehov tidigt"),
      condition("Q38", "high", "Ensamtid hjälper att varva ner"),
      condition("Q09", "high", "Återkommande oro"),
    ],
    supporting: [],
    nuances: [],
    minimumSupport: 3, messageKey: "recovery-timing", adviceKey: "scheduled-check-in",
    observation: "Du anger att ensamtid hjälper dig att varva ner och att oro förekommer, men känner liten igenkänning i tidiga paussignaler.",
    explanation: "Det kan vara värt att pröva om en planerad avstämning gör ditt återhämtningssätt lättare att använda. Svaren säger inte att du faktiskt tar paus för sent.",
    advice: "Lägg in en kort avstämning vid en bestämd tid en dag. Känn efter om du vill fortsätta eller ta en stund för dig själv och jämför med en dag utan avstämning.",
    limitations: ["Ett lågt Q37 bevisar ingen bristande självinsikt.", "Oro förklarar inte varför en tidig signal saknas."],
  },
  {
    id: "cooperation-with-own-voice", family: "relationships",
    title: "Samarbete kan ge plats åt en annan uppfattning",
    required: [
      condition("Q27", "high", "Föredrar samarbete"),
      condition("Q35", "high", "Kan uttrycka en annan uppfattning"),
      condition("Q12", "low", "Liten igenkänning i vass ton"),
    ],
    supporting: [condition("Q07", "high", "Känner med andra")],
    nuances: [condition("Q36", "high", "Kan samtidigt ge ett oönskat ja")],
    minimumSupport: 3, messageKey: "cooperation-and-disagreement", adviceKey: "shared-goal-own-option",
    observation: "Du föredrar samarbete, anger att du kan säga vad du tycker och känner liten igenkänning i att uttrycka dig vasst.",
    explanation: "Att söka en gemensam väg kan innehålla olika förslag. En saklig invändning kan ge fler alternativ utan att samtalet måste bli en tävling.",
    advice: "I nästa gemensamma val, börja med vad ni vill uppnå tillsammans och lägg sedan fram ett eget alternativ. Fråga vilken del den andra skulle vilja ändra.",
    limitations: ["Låg Q12 bevisar inte konfliktkompetens.", "Frågorna visar inte hur andra uppfattar personens ton."],
  },
  {
    id: "commitment-with-starting-friction", family: "execution",
    title: "Att vilja hålla ett löfte kan ändå lämna en starttröskel",
    required: [
      condition("Q23", "high", "Håller löften"),
      condition("Q18", "high", "Startsvårighet"),
      condition("Q32", "high", "Delmål hjälper"),
    ],
    supporting: [],
    nuances: [condition("Q03", "high", "Planföljande kan också fungera")],
    minimumSupport: 3, messageKey: "starting-friction", adviceKey: "first-checkpoint",
    observation: "Du beskriver löfteshållande, svårighet att komma igång och hjälp av delmål.",
    explanation: "Ett åtagande och dess första handling kan behöva olika sorts stöd. Det går att pröva om en tidig hållpunkt hjälper utan att göra själva löftet större.",
    advice: "När du lovar något litet, välj också en första avstämning före slutdatum. Bestäm vad du behöver ha börjat med då och följ upp om det gjorde starten lättare.",
    limitations: ["Inget svar visar hur ofta ett löfte faktiskt försenas.", "Regeln delar budskapsgrupp med idéer och startsvårighet och väljs därför inte som en extra likadan insikt."],
  },
  {
    id: "self-direction-with-deliberation", family: "development",
    title: "Egen riktning kan få plats med eftertanke",
    required: [
      condition("Q31", "high", "Metodval motiverar"),
      condition("Q35", "high", "Uttrycker en annan uppfattning"),
      condition("Q28", "low", "Liten igenkänning i att agera före eftertanke"),
    ],
    supporting: [],
    nuances: [condition("Q40", "high", "Vill ändå ge besked mer tid")],
    minimumSupport: 3, messageKey: "self-direction-and-deliberation", adviceKey: "state-criterion-before-choice",
    observation: "Du uppskattar eget metodval, kan uttrycka din uppfattning och känner liten igenkänning i att agera innan du tänkt efter.",
    explanation: "Det kan vara intressant att skilja en egen riktning från ett snabbt beslut. Ett tydligt kriterium kan göra en genomtänkt ståndpunkt lättare att förklara för andra.",
    advice: "Inför ett litet gemensamt val, skriv ned ett kriterium som är viktigt för dig. Förklara kriteriet innan du presenterar ditt alternativ och fråga vad den andra väger in.",
    limitations: ["Låg Q28 är inte bevis för analytisk förmåga.", "Självständighetens orsaker och resultat mäts inte."],
  },
  {
    id: "quiet-contact-private-recovery", family: "contrasts",
    title: "Lågmäld kontakt och ensamtid kan fylla olika behov",
    required: [
      condition("Q06", "high", "Tyst bland obekanta"),
      condition("Q16", "high", "Föredrar ofta egen tid"),
      condition("Q38", "high", "Ensamtid hjälper att varva ner"),
    ],
    supporting: [], nuances: [],
    minimumSupport: 3, messageKey: "contact-versus-recovery", adviceKey: "quiet-meeting-own-interval",
    observation: "Du beskriver tystnad bland obekanta, en preferens för egen tid och att ensamtid hjälper dig att varva ner.",
    explanation: "Ditt sätt att delta och ditt sätt att återhämta dig kan behöva få varsin plats i planeringen. Svaren säger inte om du önskar mer eller mindre kontakt.",
    advice: "Om du själv vill träffa någon ny, prova en kort promenad med en person och lämna en stund för dig själv efteråt. Jämför hur själva mötet och tiden efteråt passar dig innan du ändrar omfattningen.",
    limitations: ["Ingen slutsats om social rädsla, ensamhet, utmattning eller social förmåga.", "Egentid behöver inte bero på sociala möten. Rådet gäller bara om personen själv vill ha kontakten.", "Delar budskapsgrupp med socialt initiativ och privat återhämtning; båda väljs inte som separata fynd."],
  },
  {
    id: "depth-with-self-direction", family: "motivation",
    title: "Fördjupning kan få en egenvald riktning",
    required: [
      condition("Q15", "high", "Intresse för nya idéer"),
      condition("Q30", "low", "Grunderna upplevs inte räcka"),
      condition("Q31", "high", "Eget metodval motiverar"),
    ],
    supporting: [], nuances: [],
    minimumSupport: 3, messageKey: "depth-and-self-direction", adviceKey: "choose-one-deeper-question",
    observation: "Du uppskattar nya idéer, känner liten igenkänning i att grunderna räcker och anger att eget metodval stärker motivationen.",
    explanation: "En egenvald fråga kan vara en möjlig ingång till fördjupning. Underlaget visar inte att självbestämmande orsakar ditt intresse eller att ett visst sätt att lära fungerar bäst.",
    advice: "Välj ett ämne du redan vill förstå bättre. Skriv en fråga som går bortom introduktionen och välj själv om du vill läsa, lyssna eller pröva något. Avsluta med att anteckna vad du faktiskt fick svar på.",
    limitations: ["Intresse bevisar inte kunskap, intelligens, uthållighet eller kreativ prestation.", "Lågt Q30 kan ha olika betydelser; ingen särskild lärstil fastställs.", "Rådet utlovar inte bättre inlärning."],
  },
  {
    id: "emotional-signals-with-pause-awareness", family: "recovery",
    title: "Tidiga paussignaler kan undersökas tillsammans med känsloskiftningar",
    required: [
      condition("Q19", "high", "Humöret skiftar ofta"),
      condition("Q29", "high", "Blir lätt irriterad"),
      condition("Q37", "high", "Märker pausbehov tidigt"),
    ],
    supporting: [], nuances: [],
    minimumSupport: 3, messageKey: "emotional-signals-and-pauses", adviceKey: "compare-pause-and-feeling",
    observation: "Du beskriver skiftande humör och lättväckt irritation, samtidigt som du uppger att du märker pausbehov tidigt.",
    explanation: "Det kan vara relevant att undersöka om paussignalerna och känsloskiftningarna sammanfaller. Frågorna visar inte att de gör det eller att en paus ändrar känslan.",
    advice: "Vid två tillfällen då du själv märker behov av paus, anteckna om irritation eller ett humörskifte också finns där. Om du tar en paus, notera hur läget är efteråt. Jämför tillfällena innan du ändrar din rutin.",
    limitations: ["Ingen slutsats om diagnos, orsak, självkontroll eller hur andra påverkas.", "Tidig signal betyder inte att pauser tas eller hjälper.", "Känsloskiftningar och pausbehov kan vara oberoende. Två observationer fastställer inget orsakssamband."],
  },
];

/** Explicit overrides allow rule-specific review of optional counterevidence.
 * By default only the opposite response to an optional support item is scored as counterevidence.
 * Other coexisting characteristics belong in nuances and never subtract evidence points. */
export const CATALOG: readonly Candidate[] = immutable(candidates.map(candidate => {
  const contradictory = candidate.contradictory ?? candidate.supporting.map(item => condition(
    item.questionId, item.direction === "high" ? "low" : "high",
    "Motriktat svar på den valfria stödindikatorn: " + item.purpose,
  ));
  const conditions = [...candidate.required, ...candidate.supporting, ...contradictory, ...candidate.nuances];
  return {
    ...candidate, questionIds: Array.from(new Set(conditions.map(item => item.questionId))),
    contradictory, maximumContradictions: 1,
    epistemicStatus: "preliminary-hypothesis" as const, caution: "provisional" as const,
  };
}));
