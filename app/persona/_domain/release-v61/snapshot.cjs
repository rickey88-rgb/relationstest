/* eslint-disable -- Generated immutable PERSONA V6.1 release snapshot; regenerate only for a NEW release. */
const factories={
"immutable.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.immutable = immutable;
/** Public content and calculated reports must not become mutable shared state. */
function immutable(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
        Object.values(value).forEach(immutable);
        Object.freeze(value);
    }
    return value;
}

},
"insights-v1/catalog.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CATALOG = exports.FAMILIES = exports.CATALOG_VERSION = void 0;
const immutable_1 = require("../immutable");
exports.CATALOG_VERSION = "persona-insights-catalog-v1.2";
exports.FAMILIES = (0, immutable_1.immutable)({
    motivation: "Drivkrafter och motivation",
    contrasts: "Inre kontraster",
    relationships: "Relationer och gränser",
    recovery: "Stress och återhämtning",
    execution: "Planering och genomförande",
    development: "Personlig utveckling",
});
function condition(questionId, direction, purpose) {
    return { id: questionId + "-" + direction, questionId, direction, purpose };
}
/** All entries are editorial hypotheses. Required premises can never be replaced by optional support. */
const candidates = [
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
exports.CATALOG = (0, immutable_1.immutable)(candidates.map(candidate => {
    var _a;
    const contradictory = (_a = candidate.contradictory) !== null && _a !== void 0 ? _a : candidate.supporting.map(item => condition(item.questionId, item.direction === "high" ? "low" : "high", "Motriktat svar på den valfria stödindikatorn: " + item.purpose));
    const conditions = [...candidate.required, ...candidate.supporting, ...contradictory, ...candidate.nuances];
    return Object.assign(Object.assign({}, candidate), { questionIds: Array.from(new Set(conditions.map(item => item.questionId))), contradictory, maximumContradictions: 1, epistemicStatus: "preliminary-hypothesis", caution: "provisional" });
}));

},
"insights-v1/engine.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENGINE_VERSION = void 0;
exports.analyzeInsights = analyzeInsights;
const immutable_1 = require("../immutable");
const manifest_1 = require("../v3/manifest");
const questions_1 = require("../v3/questions");
const catalog_1 = require("./catalog");
exports.ENGINE_VERSION = "persona-insights-v1.2";
function normalize(input) {
    if (!Array.isArray(input) || input.length !== manifest_1.TOTAL_COUNT)
        throw new Error("Expected 40 PERSONA answer slots");
    return Array.from(input, value => {
        if (value === null || value === undefined || value === 0)
            return null;
        if (typeof value !== "number" || !Number.isInteger(value) || value < 1 || value > 5)
            throw new Error("Invalid PERSONA answer");
        return value;
    });
}
function check(condition, answers) {
    const index = questions_1.questions.findIndex(question => question.id === condition.questionId);
    if (index < 0)
        throw new Error("Unknown PERSONA question in insight catalog");
    const answer = answers[index];
    if (answer === null)
        return { condition, answer, status: "missing" };
    if (answer === 3)
        return { condition, answer, status: "neutral" };
    const matched = condition.direction === "high" ? answer >= 4 : answer <= 2;
    return { condition, answer, status: matched ? "matched" : "opposed" };
}
function evidence(results, role) {
    return results.flatMap(result => result.status === "matched" && result.answer !== null
        ? [{ questionId: result.condition.questionId, answer: result.answer, role, conditionId: result.condition.id }] : []);
}
function evaluate(candidate, answers) {
    const required = candidate.required.map(condition => check(condition, answers));
    const supporting = candidate.supporting.map(condition => check(condition, answers));
    const contradictory = candidate.contradictory.map(condition => check(condition, answers));
    const nuances = candidate.nuances.map(condition => check(condition, answers));
    const nuanceEvidence = evidence(nuances, "nuance");
    const used = [...evidence(required, "required"), ...evidence(supporting, "supporting")];
    const opposedRequired = required.flatMap(result => result.status === "opposed" && result.answer !== null
        ? [{ questionId: result.condition.questionId, answer: result.answer, role: "contradictory", conditionId: result.condition.id }] : []);
    const against = [...opposedRequired, ...evidence(contradictory, "contradictory")];
    const supportCount = new Set(used.map(item => item.questionId)).size;
    const contradictionCount = new Set(against.map(item => item.questionId)).size;
    const score = supportCount * 2 - contradictionCount * 3;
    let decision = "selected";
    let reason = "Alla nödvändiga villkor uppfylldes och det samlade stödet räcker för en preliminär hypotes.";
    if (required.some(result => result.status === "missing")) {
        decision = "missing_required";
        reason = "Ett nödvändigt svar saknas. Det kan inte ersättas av en neutral poäng.";
    }
    else if (required.some(result => result.status !== "matched")) {
        decision = "required_not_met";
        reason = "Minst ett nödvändigt villkor är neutralt eller går åt motsatt håll.";
    }
    else if (supportCount < candidate.minimumSupport) {
        decision = "insufficient_support";
        reason = "För få olika svar stöder hypotesen.";
    }
    else if (contradictionCount > candidate.maximumContradictions || score < candidate.minimumSupport * 2 - 1) {
        decision = "counterevidence";
        reason = "Motbeläggen gör det samlade stödet för svagt för urval.";
    }
    return {
        candidateId: candidate.id, family: candidate.family,
        required, supporting, contradictory, nuances, evidence: used, counterEvidence: against, nuanceEvidence,
        supportCount, contradictionCount, score,
        strength: decision !== "selected" ? "insufficient" : contradictionCount || supportCount < 4 ? "limited" : "convergent",
        caution: contradictionCount ? "with_counterevidence" : nuanceEvidence.length ? "with_nuance" : "provisional",
        qualified: decision === "selected", decision, reason,
    };
}
function overlaps(first, second) {
    const firstIds = new Set(first.evidence.map(item => item.questionId));
    const secondIds = new Set(second.evidence.map(item => item.questionId));
    const intersection = Array.from(firstIds).filter(id => secondIds.has(id)).length;
    return intersection / new Set([...Array.from(firstIds), ...Array.from(secondIds)]).size >= 0.5;
}
/** Standalone analysis. Raw Q01–Q40 ratings are never recoded or sent to a report/payment entry point. */
function analyzeInsights(input) {
    const answers = normalize(input);
    const evaluated = catalog_1.CATALOG.map(candidate => evaluate(candidate, answers));
    const ranked = evaluated.filter(item => item.qualified).sort((a, b) => b.score - a.score || (a.candidateId < b.candidateId ? -1 : a.candidateId > b.candidateId ? 1 : 0));
    const selected = [];
    const outcomes = new Map(evaluated.map(item => [item.candidateId, item]));
    for (const item of ranked) {
        const candidate = catalog_1.CATALOG.find(entry => entry.id === item.candidateId);
        const duplicate = selected.some(other => {
            const previous = catalog_1.CATALOG.find(entry => entry.id === other.candidateId);
            return candidate.messageKey === previous.messageKey || candidate.adviceKey === previous.adviceKey;
        });
        let decision = "selected";
        let reason = "Högst tillgängligt stöd efter avdrag för motbelägg, med ett budskap som skiljer sig från tidigare val.";
        if (duplicate) {
            decision = "duplicate_message";
            reason = "Ett högre rankat fynd täcker samma budskap eller råd.";
        }
        else if (selected.some(other => overlaps(item, other))) {
            decision = "overlapping_evidence";
            reason = "Svarunderlaget överlappar ett högre rankat fynd för mycket för en självständig insikt.";
        }
        else if (selected.length >= 3) {
            decision = "limit";
            reason = "Tre tydligt åtskilda insikter med högre rang har redan valts.";
        }
        const resolved = Object.assign(Object.assign({}, item), { decision, reason });
        outcomes.set(item.candidateId, resolved);
        if (decision === "selected")
            selected.push(resolved);
    }
    const insights = selected.map(item => {
        const candidate = catalog_1.CATALOG.find(entry => entry.id === item.candidateId);
        return {
            id: candidate.id, family: candidate.family, title: candidate.title,
            observation: candidate.observation, possibleExplanation: candidate.explanation,
            evidence: item.evidence, counterEvidence: item.counterEvidence, nuanceEvidence: item.nuanceEvidence,
            strength: item.strength === "convergent" ? "convergent" : "limited", caution: item.caution,
            caveat: item.contradictionCount
                ? "Svaren innehåller också en nyanserande signal. Se motbeläggen och pröva om tolkningen passar i den aktuella situationen."
                : item.nuanceEvidence.length ? "Svaren innehåller ytterligare sidor som kan samexistera med observationen. Läs nyanserna tillsammans med den preliminära tolkningen."
                    : "Det här är en preliminär tolkning av dina svar. Regeln säger inget om varför mönstret uppstår eller hur det visar sig i varje situation.",
            selectionReason: item.reason, limitations: candidate.limitations,
        };
    });
    return (0, immutable_1.immutable)({
        engineVersion: exports.ENGINE_VERSION, catalogVersion: catalog_1.CATALOG_VERSION, questionVersion: manifest_1.VERSIONS.question,
        answered: answers.filter(answer => answer !== null).length,
        missingQuestionIds: questions_1.questions.filter((_, index) => answers[index] === null).map(question => question.id),
        insights,
        advice: selected.map(item => {
            const candidate = catalog_1.CATALOG.find(entry => entry.id === item.candidateId);
            return { id: candidate.adviceKey, insightId: candidate.id, text: candidate.advice,
                evidence: item.evidence, counterEvidence: item.counterEvidence, nuanceEvidence: item.nuanceEvidence };
        }),
        evaluations: catalog_1.CATALOG.map(candidate => outcomes.get(candidate.id)),
    });
}

},
"insights-v1/index.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FAMILIES = exports.CATALOG_VERSION = exports.CATALOG = exports.ENGINE_VERSION = exports.analyzeInsights = void 0;
var engine_1 = require("./engine");
Object.defineProperty(exports, "analyzeInsights", { enumerable: true, get: function () { return engine_1.analyzeInsights; } });
Object.defineProperty(exports, "ENGINE_VERSION", { enumerable: true, get: function () { return engine_1.ENGINE_VERSION; } });
var catalog_1 = require("./catalog");
Object.defineProperty(exports, "CATALOG", { enumerable: true, get: function () { return catalog_1.CATALOG; } });
Object.defineProperty(exports, "CATALOG_VERSION", { enumerable: true, get: function () { return catalog_1.CATALOG_VERSION; } });
Object.defineProperty(exports, "FAMILIES", { enumerable: true, get: function () { return catalog_1.FAMILIES; } });

},
"quality-v1/index.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POLICY = exports.QUALITY_VERSION = void 0;
exports.assessReportQuality = assessReportQuality;
// Isolated editorial gate. No registry, checkout or customer-flow imports.
const immutable_1 = require("../immutable");
const questions_1 = require("../v3/questions");
const index_1 = require("../v6/index");
exports.QUALITY_VERSION = "persona-report-quality-v1";
exports.POLICY = (0, immutable_1.immutable)({
    minimumValid: 24, minimumAssessedDimensions: 4,
    minimumSections: 3, minimumBlocks: 4, minimumDistinctEvidence: 6,
    maximumReservationShare: 0.5,
    readyValid: 36, readySections: 6, readyStrengths: 2, readyAdvice: 2, readyInsights: 1,
});
const fallbackClaim = "no-simple-label";
const isAnswer = (value) => typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5;
const unique = (items) => Array.from(new Set(items));
function proposals(missing, varied, neutral) {
    const result = [];
    if (missing.length)
        result.push({
            id: "complete-existing", purpose: "Återbesök saknade svar utan nya skalfrågor.",
            question: "Vill du återvända till någon av de frågor du hoppade över, eller lämna dem obesvarade?",
            format: "choice", options: ["Återvända till frågorna", "Lämna dem obesvarade"],
            limitation: "Ett frivilligt erbjudande, inte ett krav på att välja en annan grad av igenkänning.",
        });
    if (neutral >= 15)
        result.push({
            id: "meaning-of-middle", purpose: "Skilja ett meningsfullt mittsvar från osäkerhet om formuleringen.",
            question: "När du väljer mitten, vad brukar det betyda för dig?",
            format: "choice", options: ["Det stämmer ungefär till hälften", "Det varierar mellan situationer", "Jag vet inte hur jag ska bedöma det", "Något annat"],
            limitation: "Ingen betydelse antas i förväg. Mittsvar får behållas.",
        });
    result.push({
        id: "context-and-difference", purpose: varied ? "Förstå situationer bakom motriktade svar." : "Få ett konkret sammanhang utöver skalvärden.",
        question: "Tänk på två nyliga tillfällen då du var med andra. Vad var likt eller olika i hur du deltog?",
        format: "open", limitation: "Skillnader kan vara rimliga. Svaret fastställer inte varför beteendet varierar.",
    }, {
        id: "resource-in-action", purpose: "Söka en självuppgiven resurs när rapporten saknar tydliga styrkor.",
        question: "Tänk på något litet du nyligen hanterade på ett sätt du är nöjd med. Vad gjorde du som hjälpte?",
        format: "open", limitation: "En enskild händelse belägger inte en generell förmåga.",
    }, {
        id: "chosen-next-step", purpose: "Förankra ett eventuellt råd i en självvald prioritering.",
        question: "Finns det något i din vardag du vill göra lättare eller bevara som det är? Beskriv ett konkret tillfälle.",
        format: "open", limitation: "Det är tillåtet att inte vilja förändra något. Ingen svårighet förutsätts.",
    });
    return result.slice(0, 4);
}
/** Assesses the current V6 report, not the validity or worth of a person's personality.
 * Unknown/missing ratings become SKIPPED only in this private analysis copy.
 * The report is always rebuilt from those answers; callers cannot supply a richer foreign report.
 */
function assessReportQuality(input) {
    if (!Array.isArray(input) || input.length > 40)
        throw Error("Expected at most 40 PERSONA ratings");
    const answers = Array.from({ length: 40 }, (_, index) => isAnswer(input[index]) ? input[index] : 0);
    const invalidIds = Array.from({ length: 40 }, (_, index) => index)
        .filter(i => input[i] !== undefined && input[i] !== null && input[i] !== 0 && !isAnswer(input[i]))
        .map(i => "Q" + String(i + 1).padStart(2, "0"));
    const missingIds = answers.flatMap((a, i) => a ? [] : ["Q" + String(i + 1).padStart(2, "0")]);
    const report = (0, index_1.buildReport)({ answers, questionVersion: index_1.VERSIONS.question, reportVersion: index_1.VERSIONS.report });
    const validCount = answers.filter(isAnswer).length;
    const dimensionDiagnostics = report.readings.map(reading => {
        const values = questions_1.coreQuestions.flatMap((q, i) => q.dimension === reading.dimension && answers[i]
            ? [q.reverse ? 6 - answers[i] : answers[i]] : []);
        const high = values.filter(v => v >= 4).length, low = values.filter(v => v <= 2).length;
        return {
            dimension: reading.dimension, valid: values.length, direction: reading.direction,
            keyedValues: values, high, low, neutral: values.filter(v => v === 3).length,
            range: values.length ? Math.max(...values) - Math.min(...values) : null,
            // Descriptive agreement only: diverse facets are not redundant reliability items.
            dominantDirectionalShare: values.length ? Math.max(high, low) / values.length : null,
            bidirectional: high > 0 && low > 0,
        };
    });
    const validEvidence = (block) => unique(block.evidence.filter(e => {
        const index = Number(e.questionId.slice(1)) - 1;
        return /^Q(?:0[1-9]|[12][0-9]|3[0-9]|40)$/.test(e.questionId) && isAnswer(e.answer) && answers[index] === e.answer;
    }).map(e => e.questionId));
    const personal = (block) => {
        var _a;
        if (!block.interpretation.trim() || validEvidence(block).length < 2)
            return false;
        if (block.id === "portrait")
            return !!((_a = block.claims) === null || _a === void 0 ? void 0 : _a.some(c => c.id !== fallbackClaim && c.evidence.length >= 2));
        return true;
    };
    const sections = report.sections.map(section => ({
        id: section.id, title: section.title,
        meaningfulBlockIds: section.blocks.filter(personal).map(b => b.id),
        excludedBlockIds: section.blocks.filter(b => !personal(b)).map(b => b.id),
        noteOnly: !section.blocks.some(personal),
    }));
    const blocks = report.sections.flatMap(s => s.blocks.filter(personal));
    const distinctEvidence = unique(blocks.flatMap(validEvidence));
    const sectionCount = sections.filter(s => !s.noteOnly).length;
    const count = (id) => sections.find(s => s.id === id).meaningfulBlockIds.length;
    const insightCount = report.sections.find(s => s.id === "insights").blocks.filter(b => personal(b) && report.insightAnalysis.insights.some(i => i.id === b.insightId)).length;
    // Auditable proxy, not an NLP judgement: method, notes, qualifications and generic fallback
    // are reservations; supported observation/interpretation/example/reason text is personal prose.
    const reservationChars = report.method.length + report.sections.reduce((n, s) => {
        var _a, _b;
        return n + ((_b = (_a = s.note) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) + s.blocks.reduce((m, b) => m + b.limitations.join(" ").length + (personal(b) ? 0 : b.interpretation.length), 0);
    }, 0);
    const personalChars = blocks.reduce((n, b) => n + [b.observation, b.interpretation, b.example, b.adviceReason].filter(Boolean).join(" ").length, 0);
    const reservationShare = reservationChars / Math.max(1, reservationChars + personalChars);
    const rawUniformExtreme = answers.every(a => a === 1) || answers.every(a => a === 5);
    const checks = {
        sufficientAnswers: validCount >= exports.POLICY.minimumValid,
        sufficientDimensions: dimensionDiagnostics.filter(d => d.valid >= 4).length >= exports.POLICY.minimumAssessedDimensions,
        sufficientSections: sectionCount >= exports.POLICY.minimumSections,
        sufficientBlocks: blocks.length >= exports.POLICY.minimumBlocks,
        diverseEvidence: distinctEvidence.length >= exports.POLICY.minimumDistinctEvidence,
        usefulResource: count("strengths") > 0 || insightCount > 0,
        actionableAdvice: count("compass") > 0,
        personalContentDominates: reservationShare <= exports.POLICY.maximumReservationShare,
    };
    const readyChecks = {
        nearCompleteAnswers: validCount >= exports.POLICY.readyValid && invalidIds.length === 0,
        allDimensionsAssessed: dimensionDiagnostics.every(d => d.valid >= 4),
        allSectionsPersonal: sectionCount === exports.POLICY.readySections,
        multipleStrengths: count("strengths") >= exports.POLICY.readyStrengths,
        multipleAdvice: count("compass") >= exports.POLICY.readyAdvice,
        combinationInsight: insightCount >= exports.POLICY.readyInsights,
        interpretableResponsePattern: !rawUniformExtreme,
    };
    const failedMinimum = Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key);
    const failedReady = Object.entries(readyChecks).filter(([, ok]) => !ok).map(([key]) => key);
    const state = failedMinimum.length ? "insufficient" : failedReady.length ? "limited" : "ready";
    return (0, immutable_1.immutable)({
        version: exports.QUALITY_VERSION, reportVersion: report.reportVersion, contentVersion: report.contentVersion,
        scope: "current-report-information-value", state,
        validCount, missingIds, invalidIds, dimensionDiagnostics,
        neutralCount: answers.filter(a => a === 3).length,
        rawUniformExtreme, insights: insightCount, strengths: count("strengths"), advice: count("compass"),
        sections, meaningfulSections: sectionCount, meaningfulBlocks: blocks.length,
        distinctEvidenceIds: distinctEvidence, reservationShare, checks, readyChecks,
        reasons: failedMinimum.length ? failedMinimum : failedReady.length ? failedReady : ["allCriteriaMet"],
        followUpProposals: state === "insufficient" ? proposals(missingIds, dimensionDiagnostics.filter(d => d.bidirectional).length, answers.filter(a => a === 3).length) : [],
    });
}

},
"supplement-v1/experiments.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.experiment = experiment;
// Each suggestion fits both the selected recent resource and the current priority.
const copy = {
    "small-step": {
        voice: "Skriv en mening om vad du vill. Säg just den meningen i ett litet gemensamt val, utan att behöva förklara allt på en gång.",
        pause: "Be att få återkomma om en liten förfrågan. Ta en minut till att välja om du vill tacka ja, nej eller be om mer information.",
        start: "Välj en första handling som går att göra på fem minuter. Stanna där och avgör om du vill fortsätta.",
        connection: "Skicka en kort hälsning till personen och föreslå en liten kontakt, till exempel ett kort samtal.",
        preserve: "Välj en liten del av rutinen som du vill behålla. Ge just den delen plats vid nästa tillfälle, utan att göra rutinen större.",
    },
    listened: {
        voice: "Fråga vad den andra vill och lyssna färdigt. Säg sedan din egen önskan i en mening, innan ni bestämmer något.",
        pause: "Lyssna färdigt på förfrågan och sammanfatta vad den innebär. Be sedan om tid innan du ger besked.",
        start: "Om du vill bolla uppgiften med någon, lyssna på ett enda förslag. Välj sedan själv en första handling att prova.",
        connection: "Fråga personen om något som är viktigt för dem och ge svaret utrymme. Dela därefter något du själv ville berätta.",
        preserve: "Om rutinen berör någon annan, fråga hur den fungerar för dem. Välj själv vad du vill behålla; lyssnandet behöver inte innebära en förändring.",
    },
    asked: {
        voice: "Om en fråga är oklar, be om ett förtydligande. Säg sedan vilken del du själv vill, så att din önskan finns med i samtalet.",
        pause: "Be om den uppgift du behöver innan du svarar på förfrågan. Ge inget färdigt besked förrän du fått svar eller valt att avstå.",
        start: "Formulera en enda fråga som skulle göra nästa steg tydligare. Be någon om just det beskedet och välj sedan om du vill börja.",
        connection: "Fråga personen om en tid eller form för kontakt som skulle passa. Lägg också fram ett eget litet förslag.",
        preserve: "Om du behöver hjälp att ge rutinen plats, be om en enda avgränsad sak. Om rutinen redan fungerar behöver du inte ändra den.",
    },
    alternative: {
        voice: "Prova att skriva din önskan före ett samtal och använd den som stöd när du säger vad du vill.",
        pause: "Prova ett annat första besked på en förfrågan: att du vill återkomma. Avgör sedan i lugn och ro vad du vill svara.",
        start: "Byt sättet att börja vid ett enda tillfälle, till exempel genom ett enkelt utkast i stället för ett färdigt upplägg.",
        connection: "Prova en annan form för en liten kontakt, som en promenad i stället för ett längre samtal vid ett bord.",
        preserve: "Om något hindrar rutinen, prova ett annat sätt att ordna just den praktiska delen. Behåll det du redan uppskattar med rutinen.",
    },
};
function experiment(goal, resource) {
    var _a, _b;
    return (_b = (_a = copy[resource]) === null || _a === void 0 ? void 0 : _a[goal]) !== null && _b !== void 0 ? _b : "";
}

},
"supplement-v1/index.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPLEMENT_CONTENT_VERSION = exports.SUPPLEMENT_VERSION = exports.QUESTIONS = void 0;
exports.completeReport = completeReport;
const immutable_1 = require("../immutable");
const experiments_1 = require("./experiments");
const offer_1 = require("./offer");
const index_1 = require("../v6/index");
const index_2 = require("../quality-v1/index");
const questions_1 = require("./questions");
var questions_2 = require("./questions");
Object.defineProperty(exports, "QUESTIONS", { enumerable: true, get: function () { return questions_2.QUESTIONS; } });
exports.SUPPLEMENT_VERSION = "persona-supplement-v1";
exports.SUPPLEMENT_CONTENT_VERSION = "persona-supplement-content-v1.1";
const contexts = {
    one: "ett samtal med en person i taget", familiar: "ett samtal med någon du känner väl",
    writing: "ett meddelande du skriver i lugn och ro", spontaneous: "ett spontant samtal",
};
const resources = {
    listened: { description: "att lyssna innan du bestämde dig", action: "Ge den andra utrymme att berätta och sammanfatta vad du hört innan du väljer nästa steg." },
    "small-step": { description: "att ta ett litet steg i taget", action: "Välj en första handling som går att göra på fem minuter. Stanna där och avgör om du vill fortsätta." },
    asked: { description: "att be om hjälp eller ett förtydligande", action: "Formulera en enda fråga om det du behöver förstå. Be någon om just det beskedet, utan att lämna över hela valet." },
    alternative: { description: "att pröva ett annat sätt", action: "Prova ett annat sätt vid ett enda tillfälle. Jämför sedan vad det tillförde innan du bestämmer om du vill fortsätta." },
};
const goals = {
    voice: { description: "att få fram vad du själv vill", situation: "ett litet gemensamt val där din egen önskan spelar roll" },
    pause: { description: "att ge dig tid innan du tackar ja", situation: "en kommande förfrågan där du vill hinna känna efter" },
    start: { description: "att komma igång med något du själv vill göra", situation: "en liten sak du faktiskt vill börja med" },
    connection: { description: "att ge en kontakt du uppskattar mer plats", situation: "en kontakt du själv vill ta initiativ till" },
    preserve: { description: "att bevara en liten rutin som fungerar", situation: "en liten rutin du själv vill behålla" },
};
const methodNotes = {
    fits: "Du uppger att de ursprungliga svaren ungefär beskriver hur du brukar vara. De ligger kvar oförändrade.",
    context: "Du uppger att du är olika i olika situationer. Det ger kontext till variationen, men visar inte vilka skillnader som gäller i varje situation.",
    uncertain: "Du uppger att flera påståenden var svåra att bedöma. Därför bör en bred personlighetsbeskrivning fortsatt läsas försiktigt.",
    other: "Du uppger att inget av förtydligandena passar riktigt. Ingen ytterligare tolkning läggs till.",
};
function additionsFor(answers) {
    var _a, _b, _c;
    const context = contexts[(_a = answers.S02) !== null && _a !== void 0 ? _a : ""], resource = resources[(_b = answers.S03) !== null && _b !== void 0 ? _b : ""], goal = goals[(_c = answers.S04) !== null && _c !== void 0 ? _c : ""];
    const additions = [];
    const evidence = (ids) => ids.map(questionId => ({ questionId, optionId: answers[questionId] }));
    if (context && goal && ["voice", "pause", "connection"].includes(answers.S04))
        additions.push({
            id: "context-and-priority", section: "relationships", title: "Ett sammanhang för det du vill få fram",
            text: "Du pekar ut " + context + " som en form där det brukar vara lättare att säga det du vill. Samtidigt vill du ge mer plats åt " + goal.description + ". Det gör formen för kontakten relevant, inte bara vad du ska säga. Du behöver inte börja med den situation som känns mest krävande. Det här är ett avgränsat perspektiv på en självvald prioritering, inte ett mått på hur social du är.",
            evidence: evidence(["S02", "S04"]), group: "context-priority", scope: "self-reported-context",
            limitation: "Svaren visar inte att du har svårt att uttrycka dig i alla andra sammanhang.",
        });
    // S02 concerns expression, not task execution. A non-social goal is linked only
    // when S03 explicitly supplies a recent experience of asking for help/clarity.
    if (context && resource && answers.S03 === "asked" && goal && ["start", "preserve"].includes(answers.S04))
        additions.push({
            id: "context-for-clarification", section: "relationships", title: "En form för att be om något konkret",
            text: "Du vill ge utrymme åt " + goal.description + ". Vid ett nyligt tillfälle hjälpte det dig att be om hjälp eller ett förtydligande, och du pekar ut " + context + " som en form där det är lättare att få fram det du vill. Om den valda uppgiften eller rutinen någon gång behöver ett besked från någon annan kan du använda den formen för en enda konkret fråga. Du behöver inte lämna över hela valet eller göra det som redan fungerar till ett problem.",
            evidence: evidence(["S02", "S03", "S04"]), group: "context-priority", scope: "self-reported-context",
            limitation: "Svaren visar inte att uppgiften eller rutinen kräver hjälp. Kopplingen gäller bara om du själv behöver ett besked från någon annan.",
        });
    if (resource && goal) {
        additions.push({
            id: "resource-in-context", section: "strengths", title: "En resurs från ett tillfälle som fungerade",
            text: "Vid ett nyligt tillfälle som du själv tycker att du hanterade bra pekar du ut " + resource.description + " som det som hjälpte mest. Det är en konkret erfarenhet att ha med dig när du nu vill ge plats åt " + goal.description + ". Du behöver inte göra erfarenheten till en etikett om vem du är. Den kan få vara ett exempel på något du har haft nytta av, vars användbarhet i ett nytt sammanhang återstår att pröva.",
            evidence: evidence(["S03", "S04"]), group: "resource-priority", scope: "recent-example",
            limitation: "Ett självuppgivet tillfälle fastställer ingen generell styrka eller förklaring till andra svar.",
        }, {
            id: "resource-experiment", section: "compass", title: "Prova resursen i ett nytt litet sammanhang",
            text: "Utgå från " + goal.situation + ". " + (0, experiments_1.experiment)(answers.S04, answers.S03) + " Efteråt: hjälpte det dig med det du själv ville ge utrymme åt? Om svaret är nej behöver du inte upprepa försöket. Om det hjälpte kan du välja ett nytt litet tillfälle att prova vid.",
            evidence: evidence(["S03", "S04"]), group: "resource-priority", scope: "suggested-experiment",
            limitation: "Detta är ett frivilligt försök, inte ett påstående om vad du saknar eller borde bli bättre på.",
        });
    }
    return additions;
}
/** Isolated completion model. Original answers, scoring, V6 and quality-v1 remain untouched. */
function completeReport(input, extra = {}) {
    var _a, _b, _c;
    const before = (0, index_2.assessReportQuality)(input), answers = (0, questions_1.parseAnswers)(extra);
    const normalized = Array.from({ length: 40 }, (_, i) => typeof input[i] === "number" && Number.isInteger(input[i]) && input[i] >= 1 && input[i] <= 5 ? input[i] : 0);
    const baseReport = (0, index_1.buildReport)({ answers: normalized, questionVersion: index_1.VERSIONS.question, reportVersion: index_1.VERSIONS.report });
    const supplementRelevant = before.state === "insufficient" || (before.state === "limited" &&
        (before.strengths === 0 || before.advice < 2 || before.sections.find(s => s.id === "relationships").noteOnly));
    const offered = before.state !== "ready" && supplementRelevant;
    if (!offered && Object.keys(answers).length)
        throw Error("Supplement is not relevant for this report");
    const additions = offered ? additionsFor(answers).filter(a => a.section !== "compass" || before.advice < 3) : [];
    const methodNote = (_b = methodNotes[(_a = answers.S01) !== null && _a !== void 0 ? _a : ""]) !== null && _b !== void 0 ? _b : null;
    const sections = baseReport.sections.map(s => (Object.assign(Object.assign({}, s), { 
        // Omit an abstention note when a genuinely new block now supplies that section.
        note: additions.some(a => a.section === s.id) && !s.blocks.length ? undefined : s.note, additions: additions.filter(a => a.section === s.id) })));
    const meaningfulSections = new Set(before.sections.filter(s => !s.noteOnly).map(s => s.id));
    additions.forEach(a => meaningfulSections.add(a.section));
    // Resource and its proposed exercise share one fact pattern. Never count them twice.
    const novelGroups = Array.from(new Set(additions.map(a => a.group)));
    const distinctEvidence = Array.from(new Set([...before.distinctEvidenceIds, ...additions.flatMap(a => a.evidence.map(e => e.questionId))]));
    const basePersonalChars = baseReport.sections.reduce((n, s) => n + s.blocks.filter(b => before.sections.find(t => t.id === s.id).meaningfulBlockIds.includes(b.id))
        .reduce((m, b) => m + [b.observation, b.interpretation, b.example, b.adviceReason].filter(Boolean).join(" ").length, 0), 0);
    const reservationChars = baseReport.method.length + ((_c = methodNote === null || methodNote === void 0 ? void 0 : methodNote.length) !== null && _c !== void 0 ? _c : 0) + sections.reduce((n, s) => {
        var _a, _b;
        return n + ((_b = (_a = s.note) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0) + s.blocks.reduce((m, b) => m + b.limitations.join(" ").length +
            (before.sections.find(t => t.id === s.id).excludedBlockIds.includes(b.id) ? b.interpretation.length : 0), 0);
    }, 0) + additions.reduce((n, a) => n + a.limitation.length, 0);
    // Count the resource/experiment group's longest text once also in the density measure.
    const addedPersonalChars = novelGroups.reduce((n, g) => n + Math.max(...additions.filter(a => a.group === g).map(a => a.text.length)), 0);
    const reservationShare = reservationChars / Math.max(1, reservationChars + basePersonalChars + addedPersonalChars);
    const novelStrengths = additions.filter(a => a.section === "strengths").length, novelAdvice = additions.filter(a => a.section === "compass").length;
    const checks = {
        sufficientAnswers: before.checks.sufficientAnswers,
        sufficientDimensions: before.checks.sufficientDimensions,
        sufficientSections: meaningfulSections.size >= index_2.POLICY.minimumSections,
        sufficientBlocks: before.meaningfulBlocks + novelGroups.length >= index_2.POLICY.minimumBlocks,
        diverseEvidence: distinctEvidence.length >= index_2.POLICY.minimumDistinctEvidence,
        usefulResource: before.strengths + novelStrengths > 0 || before.insights > 0,
        actionableAdvice: before.advice + novelAdvice > 0,
        personalContentDominates: reservationShare <= index_2.POLICY.maximumReservationShare,
    };
    const failed = Object.entries(checks).filter(([, ok]) => !ok).map(([key]) => key);
    // Contextual, unvalidated additions can justify limited, never a new ready verdict.
    const state = offered ? (failed.length ? "insufficient" : "limited") : before.state;
    return (0, immutable_1.immutable)({
        version: exports.SUPPLEMENT_VERSION, contentVersion: exports.SUPPLEMENT_CONTENT_VERSION, baseReport, answers, offeredQuestions: offered ? questions_1.QUESTIONS : [],
        offer: (0, offer_1.describeOffer)({ state, sections: Array.from(meaningfulSections), insights: before.insights,
            strengths: before.strengths + novelStrengths, advice: before.advice + novelAdvice,
            supplementRelevant, completionAttempted: Object.keys(answers).length > 0 }),
        sections, additions, methodNote,
        before, after: offered ? { state, checks, reasons: failed.length ? failed : ["contextualInformationOnly"],
            meaningfulSections: meaningfulSections.size, independentContentUnits: before.meaningfulBlocks + novelGroups.length,
            distinctEvidenceIds: distinctEvidence, reservationShare, additionalInsights: 0,
            strengths: before.strengths + novelStrengths, advice: before.advice + novelAdvice,
        } : { state: before.state, checks: before.checks, reasons: before.reasons, meaningfulSections: before.meaningfulSections,
            independentContentUnits: before.meaningfulBlocks, distinctEvidenceIds: before.distinctEvidenceIds,
            reservationShare: before.reservationShare, additionalInsights: 0, strengths: before.strengths, advice: before.advice },
        // No payment connection exists in this experiment, including for ready/limited.
        allowCheckout: false,
        presentation: state === "insufficient" ? "free-fallback" : "local-report",
        freeResult: state === "insufficient" ? {
            title: "Det här kan vi säga just nu",
            text: before.neutralCount >= 15 ? "Dina svar ligger ofta nära mitten. Det kan ha flera betydelser, och vi väljer inte en förklaring åt dig." : "Dina svar ger ingen enkel helhetsbild. Avgränsade erfarenheter kan fortfarande vara meningsfulla utan att bli en beskrivning av hela din personlighet.",
            explanation: "Även med eventuella kompletteringar räcker underlaget i den här analysen inte till en tillräckligt individuell premiumrapport. Det betyder inte att dina svar är felaktiga. Därför erbjuder vi inget köp för det här resultatet.",
        } : null,
    });
}

},
"supplement-v1/offer.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OFFER_POLICY_VERSION = void 0;
exports.describeOffer = describeOffer;
const immutable_1 = require("../immutable");
const manifest_1 = require("../v6/manifest");
exports.OFFER_POLICY_VERSION = "persona-offer-policy-v1";
function describeOffer(input) {
    const included = Object.keys(manifest_1.SECTION_TITLES).filter(id => input.sections.includes(id));
    const missing = Object.keys(manifest_1.SECTION_TITLES).filter(id => !included.includes(id));
    const available = included.map(id => manifest_1.SECTION_TITLES[id]);
    const absent = missing.map(id => manifest_1.SECTION_TITLES[id]);
    return (0, immutable_1.immutable)({
        version: exports.OFFER_POLICY_VERSION, state: input.state, includedSections: available, missingSections: absent,
        counts: { insights: input.insights, strengths: input.strengths, advice: input.advice },
        // Eligibility for a future offer, not a payment entitlement or an activated checkout.
        fullPremiumOfferAllowed: input.state === "ready",
        // Conservative launch policy: limited is disclosed, never sold as the full six-part promise.
        limitedPurchaseAllowed: false,
        supplementAllowed: input.state !== "ready" && input.supplementRelevant,
        nextStep: input.state === "ready" ? "premium-offer" : input.state === "limited" ? "limited-summary" :
            input.completionAttempted ? "free-result" : "supplement",
        description: input.state === "ready"
            ? "Din rapport har individuellt innehåll i alla sex delar och kan erbjudas som en fullständig premiumrapport."
            : input.state === "limited"
                ? "Din rapport har avgränsat individuellt innehåll i " + available.join(", ") + ". Den innehåller " +
                    input.insights + " kombinationsinsikter, " + input.strengths + " styrkor eller situationsbundna resurser och " + input.advice + " råd." +
                    (absent.length ? " Följande delar saknar tillräckligt individuellt innehåll: " + absent.join(", ") + "." : "") +
                    " Detta är ett begränsat resultat och erbjuds inte som en fullständig premiumrapport." +
                    (input.supplementRelevant ? " Du kan frivilligt komplettera om frågorna känns relevanta." : "")
                : "Den här analysen ger ännu inte tillräckligt underlag för en individuell premiumrapport. Dina svar är inte felaktiga. " +
                    (input.completionAttempted ? "Du får ett gratisresultat och inget premiumköp erbjuds." : "Du kan frivilligt svara på högst fyra kompletteringar eller behålla ett gratisresultat."),
    });
}

},
"supplement-v1/questions.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QUESTIONS = void 0;
exports.parseAnswers = parseAnswers;
const immutable_1 = require("../immutable");
exports.QUESTIONS = (0, immutable_1.immutable)([
    { id: "S01", prompt: "Vad passar bäst in på hur du svarade på de första frågorna?",
        purpose: "Förstå innebörden i skattningarna utan att ändra dem.", reportUse: "Kort metodnyans, aldrig en ny personlighetsegenskap.",
        options: [
            { id: "fits", label: "Svaren beskriver mig ungefär som jag brukar vara." },
            { id: "context", label: "Jag är olika i olika situationer." },
            { id: "uncertain", label: "Flera påståenden var svåra att bedöma." },
            { id: "other", label: "Ingen av beskrivningarna passar riktigt." },
        ] },
    { id: "S02", prompt: "I vilket sammanhang blir det oftast lättast för dig att säga det du vill?",
        purpose: "Ge sociala preferenser ett självuppgivet sammanhang.", reportUse: "Relationsperspektiv tillsammans med en självvald prioritering i S04.",
        options: [
            { id: "one", label: "Med en person i taget." },
            { id: "familiar", label: "Bland människor jag känner väl." },
            { id: "writing", label: "När jag kan skriva i lugn och ro." },
            { id: "spontaneous", label: "I ett spontant samtal." },
            { id: "no-difference", label: "Sammanhanget gör ingen tydlig skillnad." },
            { id: "uncertain", label: "Det vet jag inte riktigt." },
        ] },
    { id: "S03", prompt: "Tänk på något litet du nyligen hanterade bra. Vad hjälpte mest just då?",
        purpose: "Hitta en självuppgiven resurs i ett avgränsat tillfälle.", reportUse: "Situationsbunden styrka; inget påstående om generell förmåga.",
        options: [
            { id: "listened", label: "Jag lyssnade innan jag bestämde mig." },
            { id: "small-step", label: "Jag tog ett litet steg i taget." },
            { id: "asked", label: "Jag bad om hjälp eller ett förtydligande." },
            { id: "alternative", label: "Jag prövade ett annat sätt." },
            { id: "no-example", label: "Jag kommer inte på något exempel just nu." },
            { id: "uncertain", label: "Jag vet inte vad som hjälpte." },
        ] },
    { id: "S04", prompt: "Vad vill du helst ge lite utrymme åt i vardagen just nu?",
        purpose: "Förankra ett försök i personens egen prioritering.", reportUse: "Konkret råd kombinerat med resursen i S03; relationskoppling till S02.",
        options: [
            { id: "voice", label: "Få fram vad jag själv vill." },
            { id: "pause", label: "Ge mig tid innan jag tackar ja." },
            { id: "start", label: "Komma igång med något jag vill göra." },
            { id: "connection", label: "Ge en kontakt jag uppskattar mer plats." },
            { id: "preserve", label: "Bevara en liten rutin som fungerar." },
            { id: "none", label: "Jag vill inte välja något att förändra nu." },
            { id: "uncertain", label: "Det vet jag inte ännu." },
        ] },
]);
function parseAnswers(input) {
    if (!input || typeof input !== "object" || Array.isArray(input))
        throw Error("Invalid supplementary answers");
    const result = {};
    for (const [key, value] of Object.entries(input)) {
        const question = exports.QUESTIONS.find(q => q.id === key);
        if (!question || typeof value !== "string" || (value !== "skip" && !question.options.some(o => o.id === value)))
            throw Error("Invalid supplementary option");
        result[question.id] = value;
    }
    return (0, immutable_1.immutable)(result);
}

},
"v3/manifest.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SKIPPED = exports.CHAPTER_SIZE = exports.CORE_COUNT = exports.TOTAL_COUNT = exports.VERSIONS = void 0;
const immutable_1 = require("../immutable");
exports.VERSIONS = (0, immutable_1.immutable)({ question: "persona-questions-v3", report: "persona-report-v3", analysis: "persona-analysis-v3", content: "persona-ipip-swedish-v3" });
exports.TOTAL_COUNT = 40;
exports.CORE_COUNT = 30;
exports.CHAPTER_SIZE = 10;
exports.SKIPPED = 0;

},
"v3/questions.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.questions = exports.coreQuestions = exports.skippedLabel = exports.ratingLabels = void 0;
const immutable_1 = require("../immutable");
const manifest_1 = require("./manifest");
exports.ratingLabels = (0, immutable_1.immutable)([
    "Stämmer inte alls", "Stämmer ganska dåligt", "Stämmer varken bra eller dåligt", "Stämmer ganska bra", "Stämmer helt",
]);
exports.skippedLabel = "Hoppade över";
// B: IPIP 50-item form (numbered). B20: lexical 20-item factor key.
// J: Johnson IPIP-NEO-120. F: full IPIP NEO facet key. D: IPIP NEO domain key.
// B: https://www.ipip.ori.org/New_IPIP-50-item-scale.htm
// B20: https://ipip.ori.org/newBigFive5broadKey.htm
// J: https://ipip.ori.org/30FacetNEO-PI-RItems.htm
// F: https://ipip.ori.org/newneofacetskey.htm
// D: https://ipip.ori.org/newNEOKey.htm
// The selection and Swedish adaptations are specific to PERSONA.
const core = [
    ["E", false, "Jag brukar inleda samtal.", "B21"],
    ["A", true, "Jag brukar vara försiktig med att lita på andra.", "F A1: vaksamhet inför andra"],
    ["C", false, "Jag brukar göra upp en plan och hålla mig till den.", "B20 III: hålla sig till planer"],
    ["N", true, "Jag känner mig avslappnad för det mesta.", "B09"],
    ["O", false, "Jag har livlig fantasi.", "B15"],
    ["E", true, "Jag är ofta tyst bland människor jag inte känner.", "B46"],
    ["A", false, "Jag känner med andra när de har det svårt.", "B17"],
    ["C", true, "Jag glömmer ofta att lägga tillbaka saker där de hör hemma.", "B28"],
    ["N", false, "Jag oroar mig ofta.", "B14"],
    ["O", true, "Jag håller mig helst till det jag redan känner till.", "J O4: föredra det bekanta"],
    ["E", false, "Jag känner mig bekväm tillsammans med andra.", "B11"],
    ["A", true, "Jag uttrycker mig ofta vasst mot andra.", "F A4: vass tunga"],
    ["C", false, "Jag lägger märke till detaljer i det jag gör.", "B13"],
    ["N", true, "Jag brukar behålla lugnet under press.", "J N6: lugn under press"],
    ["O", false, "Jag tycker om att höra nya idéer.", "D: intresse för nya idéer"],
    ["E", true, "Jag föredrar ofta att vara för mig själv.", "J E2: föredra att vara ensam"],
    ["A", false, "Jag brukar ta mig tid för andra.", "B37"],
    ["C", true, "Jag har ofta svårt att komma igång med det jag ska göra.", "J C5: svårt att komma igång"],
    ["N", false, "Mitt humör skiftar ofta.", "B34"],
    ["O", true, "Idéer utan tydlig koppling till vardagen intresserar mig sällan.", "B20 (fråga 20): ointresse för abstrakta idéer"],
    ["E", false, "När vi ska göra något tillsammans brukar jag ta ledningen.", "J E3: ta ledningen"],
    ["A", true, "Jag har svårt att släppa en oförrätt.", "F A4: hålla fast vid groll"],
    ["C", false, "Jag håller det jag lovar.", "J C3: hålla löften"],
    ["N", true, "Jag känner mig sällan nedstämd.", "B19"],
    ["O", false, "Jag lägger märke till det vackra i små vardagliga saker.", "J O2: lägga märke till skönhet"],
    ["E", true, "Jag undviker helst att dra uppmärksamhet till mig.", "B36"],
    ["A", false, "Jag föredrar samarbete framför tävling.", "F A6: samverkan före tävlan"],
    ["C", true, "Jag agerar ofta innan jag hunnit tänka efter.", "J C6: handla utan att tänka efter"],
    ["N", false, "Jag blir lätt irriterad.", "B44"],
    ["O", true, "När jag lär mig något nytt brukar grunderna räcka för mig.", "B20 V: inte fördjupa sig"],
];
const reflections = [
    "Jag blir mer motiverad när jag själv får välja hur jag gör.",
    "Tydliga delmål hjälper mig att hålla igång.",
    "När jag berättar om något svårt vill jag helst bli lyssnad på först.",
    "Jag behöver tid innan jag berättar något personligt för någon jag just lärt känna.",
    "Jag brukar säga vad jag tycker även när någon jag bryr mig om tycker annorlunda.",
    "Jag säger ibland ja fast jag helst skulle säga nej.",
    "Jag brukar märka tidigt när jag behöver en paus.",
    "En stund för mig själv hjälper mig att varva ner.",
    "Jag visar olika sidor av mig själv beroende på vem jag är med.",
    "Jag vill bli bättre på att ge mig själv tid att tänka innan jag svarar.",
];
const questionId = (index) => "Q" + String(index + 1).padStart(2, "0");
exports.coreQuestions = (0, immutable_1.immutable)(core.map(([dimension, reverse, prompt, source], i) => ({
    id: questionId(i), chapter: Math.floor(i / manifest_1.CHAPTER_SIZE) + 1, dimension, reverse, prompt, source,
})));
exports.questions = (0, immutable_1.immutable)([...exports.coreQuestions, ...reflections.map((prompt, i) => ({
        id: questionId(core.length + i), chapter: 4, prompt, source: "PERSONA-original",
    }))]);

},
"v3/score.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scoreDimensions = scoreDimensions;
const immutable_1 = require("../immutable");
const manifest_1 = require("./manifest");
const questions_1 = require("./questions");
const names = {
    E: "Socialt sätt", A: "Hänsyn och samspel", C: "Struktur och genomförande",
    N: "Känslomässig reaktivitet", O: "Öppenhet för idéer och upplevelser",
};
function scoreDimensions(answers) {
    return (0, immutable_1.immutable)(Object.keys(names).map(dimension => {
        const items = questions_1.coreQuestions.flatMap((question, index) => question.dimension === dimension
            ? [{ question, answer: answers[index] }] : []);
        const valid = items.filter(item => item.answer !== manifest_1.SKIPPED);
        const coded = valid.map(({ question, answer }) => question.reverse ? 6 - answer : answer);
        const raw = coded.reduce((sum, value) => sum + value, 0);
        const mean = raw / valid.length;
        return {
            dimension, name: names[dimension], valid: valid.length, raw,
            missingIds: items.filter(item => item.answer === manifest_1.SKIPPED).map(item => item.question.id),
            value: valid.length < 4 ? null : Math.round(mean * 10) / 10,
            level: valid.length < 4 ? "insufficient" : valid.length < 6 ? "limited" : mean < 2.5 ? "lower" : mean > 3.5 ? "higher" : "middle",
            varied: coded.some(value => value <= 2) && coded.some(value => value >= 4),
            evidence: valid.map(({ question, answer }) => ({ questionId: question.id, answer })),
        };
    }));
}

},
"v3/submission.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validAnswer = validAnswer;
exports.parseSubmission = parseSubmission;
exports.describeAnswers = describeAnswers;
const immutable_1 = require("../immutable");
const manifest_1 = require("./manifest");
const questions_1 = require("./questions");
function validAnswer(value) {
    return typeof value === "number" && Number.isInteger(value) && value >= manifest_1.SKIPPED && value <= 5;
}
function parseSubmission(input) {
    if (!input || typeof input !== "object" || Array.isArray(input))
        throw new Error("Invalid PERSONA submission");
    const value = input;
    if (Object.keys(value).sort().join(",") !== "answers,questionVersion,reportVersion"
        || value.questionVersion !== manifest_1.VERSIONS.question || value.reportVersion !== manifest_1.VERSIONS.report
        || !Array.isArray(value.answers) || value.answers.length !== manifest_1.TOTAL_COUNT)
        throw new Error("Invalid PERSONA submission");
    const answers = Array.from(value.answers);
    if (!answers.every(validAnswer))
        throw new Error("Invalid PERSONA answers");
    return (0, immutable_1.immutable)({ questionVersion: manifest_1.VERSIONS.question, reportVersion: manifest_1.VERSIONS.report, answers });
}
function describeAnswers(input) {
    const { answers } = parseSubmission(input);
    return (0, immutable_1.immutable)(questions_1.questions.map((question, index) => ({
        questionId: question.id, title: "", question: question.prompt, value: answers[index],
        answer: answers[index] === manifest_1.SKIPPED ? questions_1.skippedLabel : questions_1.ratingLabels[answers[index] - 1],
    })));
}

},
"v4/patterns.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patterns = void 0;
exports.patterns = [
    {
        id: "explore-then-build", keys: ["O+", "C+"], context: [31, 32], name: "Idébyggaren",
        core: "Nyfikenheten kan öppna flera vägar, medan ditt sätt att skapa struktur gör det lättare att avgöra vilken väg som är värd att pröva. En ny idé kan bli mer lockande när du ser hur den går att omsätta.",
        strength: "När andra fastnar mellan en lockande vision och en lång att-göra-lista kan du göra nästa steg litet nog att faktiskt ta.",
        risk: "Om du börjar ordna detaljer innan du har valt riktning kan du göra en svag idé mer genomförbar utan att upptäcka att du borde byta idé.",
        experiment: "Dela ett nytt projekt i två sittningar. Skissa först tre vägar utan att rangordna dem. Välj sedan ett litet försök med ett tydligt tecken på om du ska fortsätta.",
        scene: "Om ni planerar en helg ihop kan du föreslå flera upplägg och göra det lätt att välja genom att visa vad varje alternativ kräver.",
        driver: "Ett mål kan kännas mer värt att driva när ramarna säger vad som ska bli klart men lämnar öppet hur du tar dig dit.",
        free: ["Du kan ge en ny idé en första hållpunkt", "Din nyfikenhet verkar ha en praktisk följeslagare. Struktur kan göra en idé möjlig att undersöka i verkligheten.", "Det spelar roll när ett spännande alternativ konkurrerar med sådant du faktiskt hinner genomföra.", "Porträttet visar när det kan hjälpa att strukturera tidigt och när det kan låsa ett val för snart."],
    },
    {
        id: "wide-then-light", keys: ["O+", "C-"], context: [31], name: "Spårfinnaren",
        core: "Du kan vinna fart när en väg får växa fram ur det som händer. Ett oväntat spår blir lättare att följa när du kan ändra upplägg utan att först göra om en detaljerad plan.",
        strength: "Du kan hjälpa andra ur ett för tidigt antingen–eller genom att ta fram ett tredje alternativ som går att pröva direkt.",
        risk: "Om varje nytt spår får företräde riskerar den del som kräver repetition att bli kvar, även när du fortfarande tycker att slutresultatet spelar roll.",
        experiment: "Välj ett pågående projekt. Bestäm vad som räknas som tillräckligt klart innan nästa idé får konkurrera om platsen.",
        scene: "När ett tänkt utflyktsmål är stängt kan du föreslå en omväg som gör dagen intressant. Säg också när ni behöver välja, så att utflykten faktiskt blir av.",
        driver: "Ett mål som ger snabb återkoppling och utrymme att byta metod kan vara lättare att återvända till än en plan vars värde visar sig först långt senare.",
        free: ["En omväg kan vara produktiv för dig", "Det oväntade kan ge fart, eftersom nya möjligheter och ett öppnare genomförande tycks passa ihop i ditt underlag.", "Samma flexibilitet kan vara mer användbar i början av något än nära mållinjen.", "Rapporten skiljer på när det lönar sig att öppna fler vägar och när en behöver få bli klar."],
    },
    {
        id: "bring-people-along", keys: ["E+", "A+"], context: [33], name: "Samtalsöppnaren",
        core: "Socialt initiativ och hänsyn kan ge samtalet både fart och plats för andra. Du kan bidra till att människor kommer till tals även när det är du som startar utbytet.",
        strength: "Du kan göra det enklare för en ny person att hitta in genom att ställa en fråga som går att svara på utan att känna gruppens historia.",
        risk: "Om du både för samtalet framåt och försöker få med alla kan du råka ta på dig ansvaret för ett samförstånd som egentligen behöver delas.",
        experiment: "Nästa gång en grupp ska välja, ge ditt förslag och låt en annan person samla in de övrigas synpunkter. Lägg märke till om arbetet fördelas annorlunda.",
        scene: "När tre personer har olika idéer om en gemensam kväll kan du först få fram vad som är viktigt för var och en och sedan föreslå något alla kan ta ställning till.",
        relationship: "I en nära relation kan du öppna ett svårt samtal på ett sätt som ändå bjuder in den andra att sätta ord på sin egen version.",
        free: ["Ditt initiativ kan göra plats för andra", "Här pekar svaren på en särskild sorts social fart: att öppna en situation så att fler kan delta.", "Det kan förändra hur en grupp kommer fram till ett beslut.", "I rapporten får du exempel på vad som händer när initiativ också blir ett ansvar du kan dela."],
    },
    {
        id: "clear-course", keys: ["E+", "A-"], context: [35], name: "Riktningssättaren",
        core: "När socialt initiativ möter en mer återhållsam samspelsstil kan en diskussion snabbare få en riktning. Du kan bidra med ett förslag innan det finns en gemensam uppfattning.",
        strength: "Om en diskussion står still kan ett tydligt alternativ göra det lättare för andra att säga exakt vad de invänder mot.",
        risk: "Ett första förslag kan uppfattas som beslut om det kommer innan andra hunnit formulera sina alternativ.",
        experiment: "Formulera nästa tydliga förslag som en prövning: ’Det här är en väg. Vad skulle få oss att välja en annan?’ Vänta sedan in ett verkligt motförslag.",
        scene: "Om en gemensam uppgift blir liggande kan du föreslå vem som gör vad. Sätt också en tid då upplägget går att ändra.",
        relationship: "I ett meningsutbyte kan du göra sakfrågan tydlig tidigt. Det kan hjälpa att också fråga hur den andra uppfattade situationen innan ni diskuterar lösningen.",
        free: ["Ett tydligt förslag kan ge andra något att invända mot", "Initiativ och en mer självständig hållning i samspelet kan göra ett otydligt samtal lättare att ta vidare.", "Ett första förslag sätter ofta också ramen för vad som diskuteras.", "Rapporten visar hur du kan använda tydligheten och ändå ge alternativa förslag tid."],
    },
    {
        id: "careful-bridge", keys: ["E-", "A+"], context: [34, 38], name: "Den lågmälda länken",
        core: "Hänsynen kan bli tydligare i utbyten där du har tid att svara genomtänkt än i sammanhang där alla förväntas ta plats samtidigt. Närhet kan få byggas genom vad du gör mellan samtalen.",
        strength: "Att följa upp efteråt kan ge ett viktigt samtal en andra chans, särskilt för någon som hade svårt att formulera sig i stunden.",
        risk: "I snabba sammanhang kan andra missa att du vill bidra om de förväxlar din takt med brist på engagemang.",
        experiment: "Vid nästa samtal som går fort, säg en tidig mening om att frågan spelar roll för dig. Ta sedan upp detaljerna på det sätt som passar dig.",
        scene: "Om en vän berättar något oväntat i ett större sällskap kan ett kort meddelande efteråt ge mer plats för det ni faktiskt behöver prata om.",
        relationship: "På tu man hand kan din omtanke bli mer synlig genom ett precist nästa steg än genom att säga allt i stunden.",
        free: ["Omtanke kan bli tydligare efter samtalet", "I ditt underlag kan social återhållsamhet ge hänsynen en annan form. En följdfråga senare kan bära mer än ett snabbt svar inför alla.", "Det är relevant när andra behöver veta att en fråga landade hos dig.", "Porträttet visar hur du kan göra ditt engagemang lättare att uppfatta även när tempot är högt."],
    },
    {
        id: "private-track", keys: ["E-", "O+"], context: [31, 38], name: "Den egna upptäcktsvägen",
        core: "Du kan ha mycket rörelse i tankarna även när ditt sätt att delta är återhållsamt. En möjlighet kan hinna bli mer originell om den får ta form enskilt innan du behöver förklara den för andra.",
        strength: "Ett första eget utkast kan ge gruppen material som inte hade uppstått om alla bara reagerat på det första förslaget i rummet.",
        risk: "Om återkopplingen kommer först efter att idén blivit färdig i ditt huvud kan den bli svårare att justera utan att göra om mycket.",
        experiment: "Dela en ofärdig version med en person och be om svar på en enda fråga. Se om du får ny information utan att förlora arbetsron.",
        scene: "Om ni väljer present till en vän kan du först samla egna idéer och sedan visa två alternativ i stället för att behöva komma på något på stående fot.",
        relationship: "En gemensam fråga att utforska kan ge ett nära samtal utrymme. Det kan vara lättare att visa en ny sida av dig genom något ni upptäcker tillsammans.",
        driver: "Ett eget undersökningsutrymme kan göra det lättare att gå på djupet före ett gemensamt beslut.",
        free: ["Egen tid kan ge en idé större svängrum", "Nyfikenhet och social återhållsamhet kan bilda ett arbetssätt där en första tanke får ta form innan andras alternativ kommer in.", "Det påverkar när i processen det är värt att bjuda in återkoppling.", "Rapporten går vidare till hur du kan behålla arbetsron och ändå få respons i tid."],
    },
    {
        id: "steady-execution", keys: ["N-", "C+"], context: [32], name: "Den stadiga handen",
        core: "Ett jämnare känslomässigt tempo och ett strukturerat genomförande kan göra det lättare att skilja vad som faktiskt måste lösas från vad som bara har blivit brådskande i stunden.",
        strength: "När en plan går sönder kan du göra om ordningsföljden utan att förlora överblicken över vad som fortfarande behöver bli gjort.",
        risk: "Om du återgår snabbt till det praktiska kan andra tro att du inte sett vad ändringen kostade dem, även när du har uppfattat det.",
        experiment: "När något ändras, ge först en mening om vad som gick förlorat och sedan en mening om nästa steg. Jämför hur lätt ni kommer vidare.",
        scene: "Om en bokning faller bort kan du skilja på att alla är besvikna och vad som behöver ordnas inom nästa kvart.",
        relationship: "En tydlig plan kan skapa arbetsro i en relation, särskilt när båda först har fått säga vad de behöver av situationen.",
        free: ["När det brådskar kan du sortera före du löser", "Lugnare reaktioner tillsammans med struktur kan göra det lättare att hitta nästa steg när läget skiftar.", "Det gör skillnad mellan att återställa en plan och att dra alla med sig in i brådskan.", "Rapporten visar en konkret situation där ditt lugn kan hjälpa och när det behöver förklaras för andra."],
    },
    {
        id: "prepare-under-pressure", keys: ["N+", "C+"], context: [37], name: "Marginalbyggaren",
        core: "Starkare känslomässiga reaktioner kan göra det lättare att märka att något står på spel, medan ett strukturerat arbetssätt kan omsätta signalen i förberedelser. De två sidorna kan vara till hjälp vid olika tidpunkter.",
        strength: "Du kan göra en oklar risk konkret genom att ge den en reservväg och en punkt då det är dags att ändra plan.",
        risk: "Om varje stark signal får en ny kontroll kan förberedelsen fortsätta efter att den slutat tillföra ny information.",
        experiment: "Inför ett beslut, skriv en reservväg och ett villkor som skulle få dig att använda den. Bestäm sedan när du har kontrollerat tillräckligt för den här gången.",
        scene: "När ett gemensamt beslut känns viktigt kan en reservplan frigöra uppmärksamhet till samtalet, så länge ni också enas om vad som räknas som tillräcklig förberedelse.",
        tension: "Samma förberedelse som skapar handlingsutrymme kan börja ta utrymme från beslutet. En användbar skiljelinje är om en extra kontroll faktiskt kan ändra vad du gör.",
        free: ["En stark signal kan bli en användbar reservplan", "I dina svar finns både reaktion och struktur. När de samverkar kan en diffus risk få en konkret nästa åtgärd.", "Det är särskilt användbart om åtgärden gör det lättare att fatta beslut i tid.", "Rapporten hjälper dig skilja en reservplan som frigör tid från en kontroll som förbrukar den."],
    },
    {
        id: "respond-fast", keys: ["N+", "C-"], context: [40], name: "Den snabba omställaren",
        core: "När händelser känns tydligt och genomförandet är flexibelt kan du byta kurs tidigt. Det kan vara värdefullt när ny information kräver handling, men samma snabbhet blir mindre hjälpsam när situationen ännu är oklar.",
        strength: "Du kan märka att ett upplägg inte längre fungerar och föreslå en tillfällig lösning medan det fortfarande finns flera vägar.",
        risk: "Det som först väcker en stark reaktion kan få mer vikt än vad det behåller efter en stund.",
        experiment: "Skilj på beslut som går att backa och beslut som inte gör det. Prova en liten omväg direkt, men ge det stora beskedet en ny tidpunkt.",
        scene: "Om tonen i ett meddelande känns oväntad kan du börja med en fråga om hur det var menat och lämna större slutsatser tills du fått ett svar.",
        tension: "Snabb omställning hjälper när läget verkligen ändrats. Det kan bli svårare när en stark signal säger att något är viktigt utan att ännu säga vad som har hänt.",
        free: ["Det kan vara lätt att byta kurs innan läget klarnat", "Starkare reaktioner och ett flexibelt sätt att gå vidare kan göra ett första intryck handlingskraftigt.", "Tidpunkten blir viktig: vissa beslut går lätt att ändra medan andra får större följder.", "Rapporten skiljer de två sorternas beslut åt och ger dig ett sätt att hantera båda."],
    },
    {
        id: "warm-stakes", keys: ["A+", "N+"], context: [36, 37], name: "Den uppmärksamma medspelaren",
        core: "Hänsyn och starkare känslomässiga reaktioner kan göra mänskliga frågor svåra att avfärda för tidigt. När ett läge betyder mycket kan du bidra genom att lyfta både det praktiska och vad det innebär för de berörda.",
        strength: "Du kan ge ett beslut bättre villkor genom att göra en social kostnad synlig innan den uppstår, exempelvis vem som förväntas anpassa sig.",
        risk: "Det kan bli svårare att skilja vad du själv behöver ta ansvar för från vad du har lagt märke till hos andra.",
        experiment: "När du märker att något skaver, skriv ned vad du kan påverka och vad någon annan behöver säga eller göra. Ta först ett steg på din egen sida.",
        scene: "Om någon i en grupp verkar utelämnad kan du öppna för deras synpunkt. Stanna där tills du vet om de faktiskt vill ha hjälp.",
        relationship: "En rak avstämning om vad den andra behöver kan göra omtanken träffsäker och minska risken att du ensam börjar bära frågan.",
        free: ["Det du märker behöver inte alltid bli ditt ansvar", "Hänsyn och känslomässigt gensvar kan göra det lättare att ta en mellanmänsklig fråga på allvar.", "Att upptäcka att något spelar roll och att kunna lösa det är två olika saker.", "I rapporten får du ett sätt att skilja det du kan påverka från det andra behöver formulera själva."],
    },
    {
        id: "calm-boundary", keys: ["A-", "N-"], context: [35], name: "Den sakliga avgränsaren",
        core: "Ett lugnare känslomässigt tempo och en mer självständig samspelsstil kan ge dig utrymme att hålla en sakfråga öppen även när det socialt vore enklare att gå med på det första förslaget.",
        strength: "Du kan bidra med en tydlig gräns när alla andra pratar om hur något ska göras utan att fråga om det behöver göras alls.",
        risk: "Om resonemanget är tydligt för dig kan ett kort besked ändå lämna den andra utan sammanhang.",
        experiment: "När du håller en gräns, lägg till vad du försöker skydda i en mening. Fråga sedan om den andra uppfattade beskedet som du avsåg.",
        scene: "Om en gemensam plan tar mer tid än ni räknat med kan du föreslå ett tydligt stopp och förklara vilken del som fortfarande är genomförbar.",
        relationship: "Det kan vara lättare att stå kvar i en olikhet om du uttryckligen visar att sakfrågan får vara oavgjord medan relationen består.",
        free: ["Ett lugnt nej kan göra plats för ett bättre ja", "I ditt underlag kan lugn och en mer självständig hållning göra det möjligt att låta en fråga vara öppen tills alternativen klarnat.", "Det hjälper när ett snabbt ja skulle göra det svårare att säga vad som är rimligt senare.", "Rapporten visar hur du kan behålla gränsen och göra den lättare att förstå."],
    },
    {
        id: "reliable-care", keys: ["A+", "C+"], context: [36], name: "Den som får hjälpen att hända",
        core: "Hänsyn och genomförande kan göra omtanke pålitlig även när den kräver flera steg. Du kan bidra genom att ge ett löfte en form som går att följa upp.",
        strength: "När någon behöver hjälp kan du göra den lättare att ta emot genom att erbjuda något konkret och säga när du kan göra det.",
        risk: "Ett erbjudande som börjar av omtanke kan växa när du också vill få arbetet färdigt. Det är lättare att se gränsen när den är tydlig redan från början.",
        experiment: "Ge nästa erbjudande en omfattning och en sluttid: ’Jag kan göra den här delen fram till söndag.’ Låt resten vara en egen fråga.",
        scene: "Om en vän ska flytta kan det vara tydligare att erbjuda två timmar för ett visst moment än att säga att du kan hjälpa till med allt.",
        driver: "Ett mål kan kännas mer angeläget när det går att se vem som får nytta av arbetet och vilken del du själv kan ansvara för.",
        relationship: "Pålitliga, avgränsade erbjudanden kan vara lättare för andra att både tacka ja till och återgälda.",
        free: ["Din omtanke kan bli konkret tidigt", "När hänsyn får sällskap av struktur kan hjälp få en form som andra faktiskt kan planera kring.", "Hur hjälpen ramas in påverkar vem som bär resten av uppgiften.", "Rapporten visar hur du kan göra ett erbjudande tydligt utan att ta över hela arbetet."],
    },
    {
        id: "measured-focus", keys: ["O-", "C+"], context: [32], name: "Den praktiska förfinaren",
        core: "Ett konkret fokus tillsammans med struktur kan göra det lättare att förbättra något i flera små steg. Du kan se värdet i att förfina det som redan fungerar tillräckligt väl för att prövas.",
        strength: "När alternativen är många kan du göra jämförelsen användbar genom att välja två egenskaper som faktiskt får konsekvenser i vardagen.",
        risk: "En snabb sortering efter praktisk nytta kan utesluta ett ovant alternativ innan det hunnit visa vad det kan göra.",
        experiment: "När du jämför välkända lösningar, ge också ett ovant alternativ ett litet försök med samma villkor. Låt utfallet avgöra om det ska få mer tid.",
        scene: "Inför ett större inköp kan du jämföra kostnad och skötsel över tid och sedan prova den okända modellen i liten skala om det är möjligt.",
        driver: "Synliga förbättringar kan ge mer mening åt arbetet än en storslagen idé vars praktiska innebörd ännu är oklar.",
        free: ["En liten förbättring kan ge dig mer information än en stor plan", "Ett praktiskt fokus och struktur kan tillsammans göra ett experiment lätt att jämföra med det som redan fungerar.", "Då behöver en förändring inte vara stor för att ändra beslutet.", "Rapporten visar också hur du kan ge ett ovant alternativ en rättvis chans."],
    },
    {
        id: "social-motion", keys: ["E+", "O+"], context: [31], name: "Idébollaren",
        core: "När socialt initiativ och nyfikenhet möts kan ett samtal fungera som ett sätt att tänka. En idé kan bli tydligare när någon ställer frågan du inte hade tänkt på själv.",
        strength: "Du kan få en grupp ur en tidig låsning genom att låta någon bygga vidare på förslaget innan ni röstar om det.",
        risk: "Ett livligt utbyte kan kännas som framsteg även när ni ännu inte har valt vad som ska hända sedan.",
        experiment: "Avsluta nästa bra idésamtal med att var och en säger vilken idé som är värd ett försök och vad som skulle räknas som ett svar.",
        scene: "När ni planerar något ihop kan du använda första halvan av samtalet till idéer och sista fem minuterna till att välja vad ni faktiskt testar.",
        driver: "Ett mål kan få mer energi när det finns någon att pröva idéer tillsammans med och utrymme att förändra dem på vägen.",
        free: ["Samtalet kan vara en del av hur du tänker", "När nyfikenhet möter socialt initiativ kan andras frågor ge en idé en form den aldrig hade fått på egen hand.", "Därför kan den som deltar i samtalet påverka vad som över huvud taget blir ett alternativ.", "Rapporten visar hur du kan ta vara på det utan att förväxla ett livligt samtal med ett fattat beslut."],
    },
    {
        id: "quiet-consistency", keys: ["E-", "C+"], context: [38], name: "Den tysta genomföraren",
        core: "Återhållsamhet i större utbyten och struktur i arbetet kan göra att ditt bidrag blir tydligast i vad som faktiskt blir gjort. Det kan ge en annan sorts inflytande än att vara den som pratar först.",
        strength: "Du kan hjälpa en grupp att hålla kurs genom att göra det tydligt vad ni redan bestämt och vad som återstår.",
        risk: "Om du väntar med att visa arbetet tills det är genomtänkt kan andra fatta beslut utan att känna till den information du har.",
        experiment: "Visa en tidig lägesbild i tre rader: klart, öppet, nästa steg. På så sätt blir arbetet synligt innan du behöver försvara en färdig lösning.",
        scene: "När ni förbereder ett gemensamt arrangemang kan du skicka en kort avstämning innan någon annan börjar planera utifrån en annan tidslinje.",
        free: ["Ditt inflytande kan synas först i det som blir gjort", "Social återhållsamhet och struktur kan ge tyngd åt dina bidrag även när du inte är den som sätter tonen i rummet.", "Andra kan använda den tyngden bättre om de ser arbetet före slutresultatet.", "Rapporten ger ett konkret sätt att göra ditt bidrag synligt utan att byta arbetssätt."],
    },
];

},
"v6/content.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.content = void 0;
exports.content = {
    "E-high": {
        strength: { title: "Få ett första utbyte att hända", topic: "opening-contact",
            text: "Du kan använda din sociala bekvämlighet till att göra början på ett möte mindre stor. Det behöver inte vara ett långt samtal. En enkel fråga ger den andra något att svara på och kan räcka för att ni ska komma vidare.",
            example: "När du träffar en väns bekanta kan du fråga om något ni faktiskt har framför er, i stället för att försöka hitta ett perfekt samtalsämne." },
        blind: { title: "Ett tidigt förslag kan låta mer färdigt än det är", topic: "first-proposal-weight",
            text: "Om du är först med ett förslag kan andra börja förhålla sig till det innan de hunnit formulera sina egna idéer. Det är värt att vara uppmärksam på om ditt förslag fortfarande låter som ett alternativ, eller redan uppfattas som ett beslut." },
        advice: { title: "Gör plats för ett verkligt motförslag", topic: "alternative-invitation",
            text: "Efter ditt nästa förslag i ett gemensamt val, be någon föreslå en helt annan lösning. Vänta tills den är färdig innan du jämför. Notera om det kom fram något som en vanlig följdfråga hade missat." },
    },
    "E-low": {
        strength: { title: "Ge ditt bidrag en form som passar dig", topic: "chosen-contact-form",
            text: "Du kan välja hur du vill vara delaktig, utan att göra mängden prat till målet. En egen kommentar, ett genomtänkt meddelande eller ett samtal med en person ger olika möjligheter att få fram det som är viktigt för dig.",
            example: "Om du vill bidra i en snabb diskussion kan en kort uppföljning efteråt vara ett alternativ att prova." },
        blind: { title: "Tystnad kan lämna plats för andras gissningar", topic: "visibility-of-position",
            text: "När du säger mindre får andra också mindre information att gå på. Om en fråga är viktig för dig kan det finnas ett glapp mellan ditt engagemang och det som hörs. Kontrollpunkten är om den andra alls har fått veta vad du vill." },
        advice: { title: "Säg den viktigaste meningen först", topic: "early-position",
            text: "Välj ett samtal du vill bidra till. Skriv en mening om din viktigaste poäng före samtalet och säg den tidigt. Ta detaljerna senare. Kontrollera om poängen faktiskt fanns med när ni bestämde er." },
    },
    "A-high": {
        strength: { title: "Göra omtanken användbar", topic: "bounded-support",
            text: "Du kan ge din omtanke en konkret form genom ett avgränsat bidrag. Det viktiga är inte hur stort erbjudandet låter, utan om det passar både dig och den som tar emot det.",
            example: "Om en vän har en tung dag kan en bestämd stund tillsammans vara mer användbar än ett öppet Säg till om det är något." },
        blind: { title: "En kompromiss kan komma för tidigt", topic: "premature-compromise",
            text: "Om ni snabbt letar efter något båda kan acceptera kan det viktigaste önskemålet bli otydligt. En lösning mitt emellan två förslag behöver inte rymma det som faktiskt spelar roll. Det är skillnaden mellan att bli överens och att förstå vad ni ville uppnå." },
        advice: { title: "Skilj det viktiga från det förhandlingsbara", topic: "choice-priorities",
            text: "Inför ett gemensamt val, skriv varsin sak ni helst vill behålla och varsin sak ni kan släppa. Jämför de fyra punkterna innan ni föreslår en kompromiss." },
    },
    "A-low": {},
    "C-high": {
        strength: { title: "Göra ett åtagande lätt att följa upp", topic: "follow-through",
            text: "Du kan använda din struktur till att göra det tydligt vad ett åtagande innehåller. Då finns något konkret att återvända till, även när annat kommer emellan. Det kan vara en liten hållpunkt snarare än ett omfattande system.",
            example: "När du ordnar något med en vän kan ni skilja på det som redan är överenskommet och en enda sak som fortfarande behöver besked." },
        blind: { title: "En genomarbetad plan kan gälla fel mål", topic: "goal-review",
            text: "Om en plan fungerar bra kan du fortsätta förbättra detaljerna även när förutsättningarna har ändrats. Frågan att hålla levande är om upplägget fortfarande gör det du ville, eller bara har blivit lätt att fortsätta följa." },
        advice: { title: "Ta bort en detalj som inte längre behövs", topic: "remove-unneeded-detail",
            text: "Välj en plan du redan använder. Skriv vad den ska göra möjligt i dag. Ta bort en detalj som inte längre bidrar till det, innan du lägger till något nytt." },
    },
    "C-low": {},
    "N-high": {},
    "N-low": {
        strength: { title: "Ta hand om det som går att lösa nu", topic: "practical-next-question",
            text: "Ditt jämnare känsloläge kan vara en resurs när något oväntat händer. Du kan prova att ge en avgränsad praktisk fråga utrymme, utan att behöva avgöra allt som följer av händelsen på en gång.",
            example: "Om en bokning faller bort kan den första frågan vara var ni ska ses nu. Hur ni vill göra nästa gång kan få vänta." },
        blind: { title: "Ditt lugn är inte allas måttstock", topic: "different-emotional-needs",
            text: "När något känns hanterbart för dig kan någon annan fortfarande behöva tid att reagera. Om du går direkt till lösningen kan en viktig del av den andras upplevelse bli outtalad. Skillnaden kan behöva få plats även när ni är överens om vad som praktiskt ska göras." },
        advice: { title: "Ta reda på vilken del som blev svår", topic: "other-person-experience",
            text: "När en ändrad plan berör dig och någon annan olika, fråga vilken del som blev svårast för personen. Sammanfatta svaret innan du föreslår något. Se om det förändrar vilken fråga ni behöver lösa först." },
    },
    "O-high": {
        strength: { title: "Göra plats för ett alternativ till", topic: "alternative-perspective",
            text: "Du kan använda ditt idéintresse när ett val verkar ha fastnat mellan två givna alternativ. Ett tredje förslag behöver inte vara stort eller originellt. Det kan räcka att ändra en del av upplägget så att ni får något annat att jämföra med.",
            example: "Inför en ledig dag kan du behålla en aktivitet men ändra platsen eller sällskapet, i stället för att välja mellan att följa hela planen och att ställa in." },
        blind: { title: "Det oprövade har ännu inte visat sina nackdelar", topic: "novelty-comparison",
            text: "En ny möjlighet kan verka särskilt lockande när du jämför den med något vars begränsningar du redan känner. Då kan jämförelsen bli ojämn. Det bekanta har hunnit visa både fördelar och nackdelar; den nya idén kanske ännu bara har visat sin bästa sida." },
        advice: { title: "Jämför en verklig kostnad för båda alternativen", topic: "equal-comparison",
            text: "Inför ett litet val, skriv vad ett nytt och ett bekant alternativ skulle kräva i tid, pengar eller energi. Använd samma mått för båda innan du väljer. Kontrollera om jämförelsen ändrade din första uppfattning." },
    },
    "O-low": {
        strength: { title: "Göra en förändring lättare att jämföra", topic: "familiar-reference",
            text: "Du kan använda något bekant som utgångspunkt när du vill ändra en del av vardagen. Genom att behålla några saker blir det lättare att märka vad själva förändringen tillför.",
            example: "Om du vill prova en annan kvällsrutin kan du behålla samma tid och plats och bara byta ett moment." },
        advice: { title: "Prova en förändring utan att göra om allt", topic: "one-change",
            text: "Välj en rutin du själv vill ändra. Behåll tid och plats, men byt ett enda moment vid två tillfällen. Bestäm sedan om just den ändringen är värd att behålla." },
    },
};

},
"v6/dimensions.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDimensions = readDimensions;
const questions_1 = require("../v3/questions");
const score_1 = require("../v3/score");
// Report confidence only. This never changes existing dimension scores or item coding.
function readDimensions(answers) {
    return (0, score_1.scoreDimensions)(answers).map(score => {
        if (score.valid < 4 || score.value === null)
            return { dimension: score.dimension, direction: "insufficient", support: [], counter: [], score };
        const mean = score.raw / score.valid;
        const sign = mean > 3.5 ? 1 : mean < 2.5 ? -1 : 0;
        const keyed = score.evidence.map(item => {
            const q = questions_1.coreQuestions[Number(item.questionId.slice(1)) - 1];
            return { item, value: q.reverse ? 6 - item.answer : item.answer };
        });
        const support = keyed.filter(t => (t.value - 3) * sign >= 1).map(t => t.item);
        const counter = keyed.filter(t => (t.value - 3) * sign <= -1).map(t => t.item);
        const direction = sign && support.length >= 4 && counter.length <= 1 && support.length - counter.length >= 3
            ? sign === 1 ? "high" : "low" : score.varied ? "mixed" : "middle";
        return { dimension: score.dimension, direction, support: direction === "high" || direction === "low" ? support : score.evidence, counter, score };
    });
}

},
"v6/index.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECTION_TITLES = exports.VERSIONS = exports.countWords = exports.renderMarkdown = exports.buildReport = void 0;
// Experimental entry point. Deliberately absent from the active registry and customer imports.
var report_1 = require("./report");
Object.defineProperty(exports, "buildReport", { enumerable: true, get: function () { return report_1.buildReport; } });
var render_1 = require("./render");
Object.defineProperty(exports, "renderMarkdown", { enumerable: true, get: function () { return render_1.renderMarkdown; } });
Object.defineProperty(exports, "countWords", { enumerable: true, get: function () { return render_1.countWords; } });
var manifest_1 = require("./manifest");
Object.defineProperty(exports, "VERSIONS", { enumerable: true, get: function () { return manifest_1.VERSIONS; } });
Object.defineProperty(exports, "SECTION_TITLES", { enumerable: true, get: function () { return manifest_1.SECTION_TITLES; } });

},
"v6/insight-copy.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.insightCopy = void 0;
exports.presentInsight = presentInsight;
exports.insightCopy = {
    "autonomy-with-milestones": {
        title: "Frihet och tydliga hållpunkter passar ihop för dig",
        observation: "Eget handlingsutrymme och tydliga hållpunkter verkar vara komplement för dig.",
        interpretation: "Du kan uppskatta att veta vad du siktar på utan att vilja få varje steg bestämt. En tydlig ram kan då lämna mer plats för egna val, snarare än ta bort dem.",
        everyday: "Om du och en vän ordnar något tillsammans kan ni vara överens om vad som ska bli klart, men låta er lösa era delar på olika sätt. Det är skillnaden mellan att dela ett mål och att behöva följa samma metod.",
        adviceTitle: "Lämna en detalj öppen",
        advice: "Välj en liten uppgift som redan har ett tydligt mål. Låt en detalj i sättet att göra den vara obestämd tills du börjar. Efteråt: blev resultatet tillräckligt bra även utan att hela vägen var bestämd?",
        reason: "Här provar du utrymmet inom en ram, inte att göra ännu en plan.",
        topic: "method-freedom",
    },
    "social-initiative-private-recovery": {
        title: "Sällskap och återhämtning kan passa dig på olika sätt",
        observation: "Du kan känna dig bekväm med andra och ändå vilja varva ner på egen hand.",
        interpretation: "Det kan vara hjälpsamt att skilja ett bra möte från ett bra avslut på dagen. Du kan uppskatta kontakten och ändå vilja göra något annat efteråt.",
        everyday: "En trevlig kväll kan alltså följas av en stund på egen hand utan att det gör kvällen mindre lyckad. De två delarna behöver inte bedömas med samma mått.",
        adviceTitle: "Bedöm mötet och tiden efteråt var för sig",
        advice: "Efter nästa sociala tillfälle, skriv två korta svar: Vill jag träffa personen igen? Vad vill jag göra den närmaste halvtimmen? Låt det andra svaret påverka avslutet, utan att använda det som betyg på mötet.",
        reason: "Du skiljer önskad kontakt från vad som hjälper dig att landa.",
        topic: "social-recovery",
    },
    "care-with-unwanted-yes": {
        title: "Omtanke behöver inte bli ett större löfte",
        observation: "Du kan vilja någon väl och ändå märka att ditt ja blev större än du önskade.",
        interpretation: "En möjlighet är att skilja omtanken från omfattningen på det du erbjuder. Frågan blir då inte om du ska bry dig, utan vilken hjälp du faktiskt vill ge.",
        everyday: "Du kan gärna vilja finnas för en vän men inte vilja boka upp hela kvällen. Ett mindre, tydligt erbjudande kan vara mer användbart än ett ja som du sedan behöver omförhandla.",
        adviceTitle: "Ge ett erbjudande med en kant",
        advice: "Nästa gång någon ber om hjälp, erbjud en bestämd del: Jag kan prata en kvart eller Jag kan hjälpa till med just detta. Kontrollera efteråt om erbjudandet motsvarade vad du ville ge.",
        reason: "Du testar omfattningen på hjälpen, inte din omtanke.",
        topic: "commitment-boundaries",
    },
    "planning-with-stress": {
        title: "Ordning och sinnesro är två olika resultat",
        observation: "En fungerande struktur och återkommande oro ryms samtidigt i dina svar.",
        interpretation: "Det kan vara värt att skilja vad som behöver ordnas från det du fortfarande undrar över. En praktisk lösning besvarar inte automatiskt varje orosfråga.",
        everyday: "En utflykt kan vara bokad och genomtänkt samtidigt som du funderar på vad som kan gå fel. Då är en ytterligare lista inte nödvändigtvis det du behöver undersöka först.",
        adviceTitle: "Pröva vad nästa kontroll ska tillföra",
        advice: "Om du någon gång vill kontrollera en redan ordnad sak igen, skriv vilken ny uppgift du hoppas få. Gör kontrollen om den kan ge svaret. Om den inte kan det, låt just den kontrollen vänta och följ upp hur det kändes.",
        reason: "Försöket gäller vilken information en extra kontroll skulle tillföra.",
        topic: "worry-and-order",
    },
    "ideas-with-starting-friction": {
        title: "En lockande idé ger inte alltid en lätt start",
        observation: "Det verkar kunna finnas gott om intresse innan den första handlingen kommer.",
        interpretation: "Att välja något du vill göra och att faktiskt börja kan behöva olika sorts hjälp. Ett första försök kan därför vara mer värt att testa än ännu en bättre beskrivning av slutresultatet.",
        everyday: "Du kan vilja prova en maträtt men ändå inte ha börjat laga den. Att ta fram en enda råvara är ett annat slags steg än att fortsätta jämföra recept.",
        adviceTitle: "Gör en medvetet ofärdig början",
        advice: "Välj något du vill komma igång med. Gör ett första försök i två minuter och låt det vara ofärdigt. Öppna materialet, skriv en rad eller ta fram en sak. Bestäm först därefter om du vill fortsätta.",
        reason: "Du provar själva starten utan att behöva lösa hela uppgiften.",
        topic: "starting-friction",
    },
    "opinion-before-commitment": {
        title: "Du kan ha en åsikt innan du har ett besked",
        observation: "Tydlighet om vad du tycker verkar inte alltid räcka för att ge det svar du helst vill ge.",
        interpretation: "Att bedöma en idé och att bestämma vad du själv vill lova kan vara två olika beslut. Din önskan om mer betänketid kan få en konkret plats mellan dem.",
        everyday: "Du kan säga att en resa låter rolig och ändå behöva tänka på om du vill följa med. Den första reaktionen behöver inte bli en färdig överenskommelse.",
        adviceTitle: "Bestäm när beskedet kommer",
        advice: "Vid en förfrågan som kan vänta, säg vad du tycker om idén och en bestämd tid när du återkommer. Ge sedan beskedet då. Jämför om det bättre motsvarade vad du själv ville.",
        reason: "Du ger plats åt ditt uttalade mål om betänketid.",
        topic: "commitment-boundaries",
    },
    "lead-without-spotlight": {
        title: "Du kan vilja få något att hända utan att stå i centrum",
        observation: "Att ta ledning och att söka uppmärksamhet verkar vara olika saker för dig.",
        interpretation: "Du kan vara intresserad av att föra något framåt utan att vilja bli den som syns mest. Det gör själva uppgiften mer relevant att skilja ut än en bred etikett om att vara social.",
        everyday: "Vid en gemensam middag kan du vilja få ordning på bokningen utan att vara den som håller tal eller samlar allas blickar.",
        adviceTitle: "Välj uppgift före synlighet",
        advice: "När ni ordnar något tillsammans, välj en konkret del du vill samordna. Fråga vem som vill ta den mer synliga delen. Notera efteråt om den uppdelningen gjorde deltagandet mer passande för dig.",
        reason: "Du provar vilken del av initiativet du vill ha ansvar för.",
        topic: "leadership-and-visibility",
    },
    "empathy-with-slow-trust": {
        title: "Du kan bry dig innan du är redo att öppna dig",
        observation: "Omtanke om andra och försiktighet med personlig tillit får plats samtidigt hos dig.",
        interpretation: "Att beröras av någon och att låta personen komma nära kan gå i olika tempo. Du behöver inte använda mängden du berättar om dig själv som enda mått på ditt engagemang.",
        everyday: "Du kan vilja lyssna på någon du nyligen träffat och ändå avvakta med något privat. Ett vänligt möte och beslutet att dela mer är två skilda steg.",
        adviceTitle: "Välj en liten sak att dela",
        advice: "I en kontakt du själv vill fördjupa, välj något litet och ofarligt att berätta. Lägg märke till hur det tas emot. Avgör sedan om du vill dela mer, utan att behöva bestämma hela relationens framtid.",
        reason: "Du provar en lagom stor öppning; snabb tillit är inget mål i sig.",
        topic: "trust-and-disclosure",
    },
    "new-ideas-practical-filter": {
        title: "Du verkar vilja kunna sätta nya idéer i ett sammanhang",
        observation: "Nyfikenhet verkar kunna gå ihop med en önskan om tydlig vardagskoppling för dig.",
        interpretation: "Du kan vilja möta en ny idé utan att vara intresserad av varje abstrakt resonemang runt den. Ett konkret exempel kan hjälpa dig att avgöra vilken del du faktiskt vill gå vidare med.",
        everyday: "När någon beskriver ett nytt sätt att göra något kan frågan Hur skulle det se ut hemma hos mig? vara mer användbar än fler allmänna fördelar.",
        adviceTitle: "Be om ett exempel som går att undersöka",
        advice: "Välj en ny idé du är nyfiken på. Be om ett konkret exempel och välj en detalj som skulle spela roll i din vardag. Prova eller kontrollera just den detaljen innan du tar ställning till hela idén.",
        reason: "Du gör vardagskopplingen möjlig att pröva.",
        topic: "practical-ideas",
    },
    "imagination-and-detail": {
        title: "Det du föreställer dig kan möta det du faktiskt lägger märke till",
        observation: "Fantasi och blick för detaljer kan ge dig två olika ingångar till samma sak.",
        interpretation: "En föreställning kan hjälpa dig att tänka på hur något skulle kunna bli. En detalj du ser eller upplever kan sedan ge idén en mer bestämd form.",
        everyday: "Du kan föreställa dig ett annat uttryck i ett rum och sedan upptäcka att en särskild färg eller form är det du faktiskt vill behålla. Det gäller intresse och uppmärksamhet, inte en bedömning av konstnärlig förmåga.",
        adviceTitle: "Låt en detalj ändra utkastet",
        advice: "Skissa en liten förändring i något du vill forma. Titta sedan på en verklig detalj som utkastet missar. Gör en andra version som tar hänsyn till den och jämför vad du själv föredrar.",
        reason: "Du testar samspelet mellan föreställning och iakttagelse.",
        topic: "imagination-and-detail",
    },
    "worry-with-composure": {
        title: "Oro behöver inte betyda att du tappar lugnet",
        observation: "Du beskriver både oro och förmåga att behålla lugnet under press.",
        interpretation: "De sidorna kan bli relevanta vid olika tillfällen. Det är värt att undersöka när var och en märks, i stället för att låta det lugna agerandet eller oron beskriva hela situationen.",
        everyday: "Ett svårt samtal kan till exempel väcka frågor och samtidigt gå att genomföra lugnt. Om det stämmer för dig behöver förberedelsen och själva samtalet bedömas var för sig.",
        adviceTitle: "Hitta när pausen gör mest nytta",
        advice: "Vid nästa krävande situation, skriv en rad före, en efter och en lite senare. Notera när oro eller behov av paus faktiskt märktes. Prova en paus vid just den tidpunkten nästa gång, om det är möjligt.",
        reason: "Du testar tidpunkten, inte om du kan vara ännu lugnare.",
        topic: "worry-and-composure",
    },
    "recovery-with-late-signals": {
        title: "Du kan känna till vad som hjälper utan att märka behovet tidigt",
        observation: "Egentid verkar hjälpa dig att landa, medan tidiga paussignaler är mindre självklara.",
        interpretation: "Det kan finnas en praktisk skillnad mellan att ha ett sätt att varva ner och att hitta ett tillfälle att använda det. Du kan undersöka den skillnaden utan att utgå från att du pausar för sent.",
        everyday: "En stund på egen hand kan vara skön när den väl blir av, även om du inte tydligt kände efter tidigare under dagen.",
        adviceTitle: "Prova en avstämning utan krav på paus",
        advice: "Välj en enda tidpunkt en dag. Stanna upp då och välj mellan att fortsätta och att ta en kort stund för dig själv. Jämför med en dag då du inte hade någon bestämd avstämning.",
        reason: "Du ger ditt återhämtningssätt ett möjligt tillfälle, utan att kräva en viss känsla.",
        topic: "recovery-timing",
    },
    "cooperation-with-own-voice": {
        title: "Du kan söka samarbete utan att tycka likadant",
        observation: "En gemensam lösning verkar inte behöva betyda att du lägger undan din egen uppfattning.",
        interpretation: "Du kan se en invändning som en del av samarbetet. Skillnaden mellan ett eget förslag och en tävling om vem som får rätt kan bli viktig när ni vill olika saker.",
        everyday: "Två personer kan vara överens om att träffas men föreslå olika upplägg. Att skillnaden kommer fram kan göra valet tydligare, även innan ni hittat en lösning.",
        adviceTitle: "Be om en invändning innan du förklarar mer",
        advice: "När du lagt fram ett förslag i ett gemensamt val, fråga Vilken del skulle du vilja ändra? Sammanfatta invändningen innan du försvarar ditt alternativ. Se om ni hittar en fråga ni ännu inte hade diskuterat.",
        reason: "Du använder din tydlighet för att få fram något nytt från den andra.",
        topic: "cooperation-and-disagreement",
    },
    "commitment-with-starting-friction": {
        title: "Ett viktigt löfte behöver inte göra första steget lätt",
        observation: "Viljan att fullfölja och svårigheten att börja verkar kunna finnas samtidigt.",
        interpretation: "Åtagandet kan vara tydligt även när starten är trög. En tidig hållpunkt kan då vara ett annat slags stöd än att påminna dig själv om hur viktigt slutresultatet är.",
        everyday: "Du kan mena allvar med att ordna något till helgen och ändå behöva skilja ut det allra första som ska ske. Själva löftet gör inte den handlingen åt dig.",
        adviceTitle: "Bestäm vad som ska ha börjat",
        advice: "Vid ett litet åtagande, välj en avstämning före slutdatum. Skriv en enda handling som ska ha påbörjats då. Följ upp den handlingen, inte hur långt det är kvar till hela resultatet.",
        reason: "Du provar ett stöd för starten, inte ett större löfte.",
        topic: "starting-friction",
    },
    "self-direction-with-deliberation": {
        title: "En egen uppfattning behöver inte komma med ett snabbt beslut",
        observation: "Du uppskattar eget handlingsutrymme och känner liten igenkänning i att handla först och tänka sedan.",
        interpretation: "Du kan uppskatta att välja själv utan att göra själva hastigheten till ett mått på självständighet. En ståndpunkt kan få vara din även när du vill tänka en stund till.",
        everyday: "I ett gemensamt köp kan du ha en egen prioritering och ändå vilja jämföra alternativen innan du väljer.",
        adviceTitle: "Prova vad som skulle ändra ditt val",
        advice: "Inför ett litet beslut, skriv vad som är viktigast för dig och en uppgift som skulle få dig att välja annorlunda. Leta efter just den uppgiften. Avgör sedan om du behöver mer tid eller redan har det du behöver.",
        reason: "Du testar vad betänketiden ska ge, snarare än att bara lägga till mer av den.",
        topic: "self-direction-and-deliberation",
    },
    "quiet-contact-private-recovery": {
        title: "Din kontakt med andra och din egentid fyller olika roller",
        observation: "Du verkar både vilja ha eget utrymme och ha nytta av en stund för dig själv.",
        interpretation: "Det kan vara värt att skilja hur mycket kontakt du vill ha från hur du helst varvar ner. Samma svar på båda frågorna är inte nödvändigt.",
        everyday: "Du kan vilja träffa en person och ändå vilja ha kvällen efteråt för dig själv. Det blir mer precist än att låta önskan om egentid avgöra om du alls vill ha kontakt.",
        adviceTitle: "Skilj önskat sällskap från önskat avslut",
        advice: "Om du själv vill träffa någon, välj ett kort tillfälle. Bestäm först vad du vill få ut av mötet och välj efteråt hur du vill avsluta dagen. Jämför om önskan om kontakt och önskan om egentid gav olika besked.",
        reason: "Du provar två separata val, utan att behöva bli mer social.",
        topic: "social-recovery",
    },
    "depth-with-self-direction": {
        title: "Du verkar uppskatta fördjupning som får ta en egen väg",
        observation: "Att gå bortom grunderna och få välja hur du gör verkar passa ihop för dig.",
        interpretation: "En egenvald fråga kan ge fördjupningen en tydlig riktning. Det är skillnad mellan att själv vilja förstå något och att bara få mer material att ta sig igenom.",
        everyday: "Ett ämne kan bli mer relevant när du får följa frågan du själv fastnat för. Du kan till exempel vilja förstå en detalj ordentligt utan att gå igenom en hel introduktion en gång till.",
        adviceTitle: "Bestäm vad som räcker för just en fråga",
        advice: "Välj en fråga du vill förstå bättre. Ge den tjugo minuter med en metod du själv väljer. Avsluta med tre meningar om vad du fått svar på och vad som fortfarande är öppet, innan du bestämmer om du vill fortsätta.",
        reason: "Du provar en slutpunkt för ett försök, inte mer fördjupning för dess egen skull.",
        topic: "depth-and-self-direction",
    },
    "emotional-signals-with-pause-awareness": {
        title: "Känsloskiftningar och pausbehov är två signaler att skilja på",
        observation: "Känsloskiftningar och tidig uppmärksamhet på pausbehov ryms samtidigt i dina svar.",
        interpretation: "Det kan vara användbart att undersöka om signalerna någon gång kommer tillsammans. Då finns en konkret stund att välja hur du vill fortsätta, snarare än att försöka ändra hela ditt känsloläge.",
        everyday: "Om irritation och ett känt pausbehov sammanfaller under ett samtal kan du prova att återkomma till sakfrågan lite senare. Pausbehovet behöver däremot inte alltid ha med irritationen att göra.",
        adviceTitle: "Prova vad du gör med en känd signal",
        advice: "Vid ett tillfälle då du både känner irritation och märker att du behöver paus, vänta med ett besked som kan vänta. Säg när du återkommer och ta upp frågan då. Notera om beskedet blev detsamma eller annorlunda.",
        reason: "Du verkar redan märka pausbehov. Försöket gäller vad du gör när det sammanfaller med irritation.",
        topic: "emotional-signals",
    },
};
function presentInsight(id, readings) {
    const base = exports.insightCopy[id];
    if (!base)
        throw Error("Missing V6 insight presentation");
    const structured = readings.find(r => r.dimension === "C" && r.direction === "high");
    if (id === "depth-with-self-direction" && structured)
        return Object.assign(Object.assign({}, base), { variantId: id + ":structured", interpretation: "Du verkar uppskatta både fördjupning och ett eget sätt att ta dig an den. Med struktur i genomförandet kan du prova att låta en särskild fråga styra vad du undersöker, i stället för att hela ämnet måste få ett nytt upplägg.", everyday: "Om en detalj i något du läser väcker ditt intresse kan du följa just den frågan och sedan återvända. Det är ett möjligt sätt att förena en tydlig riktning med utrymme att upptäcka något oväntat.", adviceTitle: "Pröva en annan väg till samma fråga", advice: "Välj en fråga du redan vill förstå bättre. Prova ett annat format än du brukar: en kort text, ett ljudklipp eller ett litet försök. Efter tjugo minuter, skriv vilken ny uppgift du fått. Jämför vad formatet tillförde, inte hur mycket material du hann med.", reason: "Du verkar redan uppskatta struktur. Här testar du vägen till svaret snarare än mer planering.", contextEvidence: structured.support });
    return Object.assign(Object.assign({}, base), { variantId: id + ":base", contextEvidence: [] });
}

},
"v6/manifest.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SECTION_TITLES = exports.VERSIONS = void 0;
const immutable_1 = require("../immutable");
const manifest_1 = require("../v3/manifest");
exports.VERSIONS = (0, immutable_1.immutable)({
    question: manifest_1.VERSIONS.question, report: "persona-report-v6", analysis: "persona-analysis-v6",
    content: "persona-report-content-v6.3",
});
exports.SECTION_TITLES = (0, immutable_1.immutable)({
    persona: "Din PERSONA", insights: "Det du kanske inte ser hos dig själv",
    strengths: "Dina styrkor", blindSpots: "Dina blinda fläckar",
    relationships: "Du och andra människor", compass: "Din utvecklingskompass",
});

},
"v6/portrait.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildPortrait = buildPortrait;
function buildPortrait(readings, answers) {
    const claims = [];
    const is = (d, direction) => readings.some(r => r.dimension === d && r.direction === direction);
    const raw = (n, high = true) => answers[n - 1] > 0 && (high ? answers[n - 1] >= 4 : answers[n - 1] <= 2);
    function add(id, text, dims = [], numbers = []) {
        const selected = readings.filter(r => dims.includes(r.dimension));
        const evidence = [...selected.flatMap(r => r.support), ...numbers.map(n => ({ questionId: "Q" + String(n).padStart(2, "0"), answer: answers[n - 1] }))];
        claims.push({ id, text, evidence: Array.from(new Map(evidence.map(e => [e.questionId, e])).values()), counterEvidence: selected.flatMap(r => r.counter) });
    }
    const emotionalCare = is("A", "high") && is("N", "high") && raw(19) && !is("E", "high") && !is("E", "low");
    if (is("E", "high") && is("A", "high") && raw(27)) {
        add("contact-and-company", "Du verkar trivas med att ta kontakt och samtidigt värdesätta att människor hittar lösningar tillsammans. I en gemensam kväll eller ett nytt sällskap kan du både vilja komma in i samtalet och bry dig om hur ni har det ihop. För dig kan det vara skillnad mellan att få något att hända och att bestämma åt alla. Båda sidorna ryms i din profil.", ["E", "A"]);
    }
    else if (is("E", "low") && is("A", "high")) {
        add("quiet-care-" + (is("O", "high") ? "curious" : "familiar"), is("O", "high")
            ? "Du beskriver omtanke om andra och ett mer återhållsamt socialt sätt. Samtidigt finns ett tydligt intresse för nya idéer och upplevelser. Det kan alltså finnas gott om sådant du vill utforska, även när ditt sociala deltagande är mer lågmält. Hur mycket du pratar är ingen bra ensam måttstock på ditt intresse. De olika sidorna behöver få plats samtidigt i bilden av dig."
            : "Du verkar värdesätta att människor tar hänsyn till varandra, utan att själv behöva ta mycket plats. Du kan vilja vara delaktig och ändå föredra ett lugnare socialt tempo. Det gör det rimligt att skilja på hur synlig du är och vad du vill bidra med. Ett kort svar behöver till exempel inte betyda att en väns fråga är oviktig för dig.", is("O", "high") ? ["E", "A", "O"] : ["E", "A"]);
    }
    else if (emotionalCare) {
        add("care-and-changing-feelings", "Du verkar bry dig om hur andra har det, samtidigt som dina egna känslor kan skifta tydligt. I ett samtal kan du till exempel vilja lyssna på någon och samtidigt vara berörd av något eget. Då är det två frågor som får plats: vad den andra behöver och hur du själv har det. Porträttet handlar därför om både din vilja till hänsyn och din egen upplevelse, utan att göra den ena till förklaring av den andra.", ["A", "N"]);
    }
    else if (is("E", "mixed") && raw(1) && raw(11) && raw(6)) {
        add("different-social-situations", "Du kan känna dig bekväm med andra och gärna inleda ett samtal, men ändå bli tystare bland människor du inte känner. Det är en konkret skillnad i dina svar, snarare än en anledning att välja mellan etiketterna utåtriktad och tillbakadragen. Hur du deltar kan se olika ut i olika sällskap. Här är det mer användbart att behålla den skillnaden än att låta ett enda genomsnitt beskriva dig.", [], [1, 11, 6]);
    }
    else if (is("A", "high")) {
        if (raw(27)) {
            add("care-without-social-label", "Du verkar lägga vikt vid hänsyn och samarbete. I ett gemensamt val kan det därför vara viktigt för dig hur lösningen fungerar mellan människor, inte bara vilket alternativ som väljs. Ditt sociala sätt är mindre entydigt. Omtanken behöver alltså inte ta samma form i varje sällskap, och du behöver inte passa in i en bestämd social roll för att den ska vara en relevant del av bilden.", ["A", "E"], [27]);
        }
        else if (raw(17) && raw(12, false)) {
            add("time-and-tone", "Du beskriver att du tar dig tid för andra och känner mindre igen dig i att ofta uttrycka dig vasst. I ett samtal kan det till exempel handla om att ge plats åt det den andra vill få fram. Din hållning till att samarbeta eller tävla är en separat fråga. Den behöver få ett eget svar, i stället för att tolkas fram ur hur du brukar bemöta andra.", ["A"], [17, 12]);
        }
        else {
            add("individual-aspects-of-interaction", "Dina svar om samspel behöver läsas på sin egen nivå. Ton, tillit och tid för andra är olika delar. De behöver inte följas åt i varje situation, och den samlade riktningen får inte ersätta dina mer specifika svar.", ["A"]);
        }
    }
    else if (is("E", "high") || is("E", "low")) {
        add("social-preference", is("E", "high")
            ? "Du verkar gärna ta kontakt och vara med i det som händer mellan människor. Det ger en tydlig social utgångspunkt, men avgör inte vad du vill i varje relation. Vem du träffar och vad ni gör kan fortfarande spela stor roll för om ett sammanhang passar dig."
            : "Du verkar föredra ett mer återhållsamt sätt att delta. Du behöver inte vara den som pratar mest eller märks först för att en kontakt ska vara meningsfull för dig. Det är en social preferens, inte en förklaring till hur nära du står andra människor.", ["E"]);
    }
    if (is("C", "high") && is("O", "high")) {
        add("curiosity-and-structure", "Du verkar också uppskatta både nya infallsvinklar och en tydlig ordning när något ska genomföras. Det behöver inte bli ett val mellan nyfikenhet och struktur. Du kan vilja undersöka en möjlighet och samtidigt veta vad ett beslut innebär i praktiken. I vardagen kan det till exempel vara skillnaden mellan att lockas av en ny aktivitet och att vilja få grepp om tid, kostnad och upplägg innan du väljer.", ["C", "O"]);
    }
    else if (is("C", "high") && is("O", "low")) {
        add("familiar-structure", "Du verkar gärna bygga vidare på något du känner igen och hålla ihop det praktiska. Ett bekant upplägg kan ge dig en tydlig utgångspunkt när du väljer vad du vill lägga tid på. Det behöver finnas en poäng med att ändra något. En ny rutin kan därför bli mer relevant när du ser vad den tillför, än bara för att den är ny.", ["C", "O"]);
    }
    else if (is("C", "low") && is("O", "high")) {
        add("interest-and-follow-through", "Nya idéer och upplevelser verkar däremot ha en tydligare plats än en jämnt hållen ordning. Det kan finnas en skillnad mellan vad du tycker är intressant och hur du tar dig igenom sådant som ska bli gjort. Den skillnaden är värd att behålla i bilden av dig. Den behöver varken bli en berättelse om brist på ambition eller om att allt fungerar bäst utan ramar.", ["C", "O"]);
    }
    else if (is("C", "high")) {
        add("practical-continuity", "När något ska bli gjort beskriver du mer kontinuitet än ryckighet. En tydlig överenskommelse kan ge dig något att återvända till, även om alla delar av en uppgift inte är lika lätta. Det praktiska verkar därför vara en viktig del av helheten: både vad som ska hända och hur det hänger ihop med resten av vardagen.", ["C"]);
    }
    else if (is("C", "low")) {
        add("different-parts-of-doing", is("A", "high")
            ? "Det finns också en skillnad mellan ditt intresse för samarbete och hur du organiserar det praktiska. Hänsynen är tydligare i dina svar än en jämnt hållen ordning. En vardaglig situation att känna efter i är när ni ordnar något tillsammans: att vilja hitta något båda uppskattar är en fråga, hur detaljerna ska hållas ihop är en annan."
            : "Du känner mindre igen dig i en jämnt hållen ordning genom det praktiska. Det gör en stor etikett om disciplin mindre användbar än att hålla isär de delar som frågorna berör. Din ambition, vilka mål du väljer och hur mycket du vill åstadkomma behöver fortfarande få beskrivas på andra sätt.", is("A", "high") ? ["A", "C"] : ["C"]);
    }
    else if (is("O", "high") && !(is("E", "low") && is("A", "high"))) {
        add("curiosity-without-method", "Du verkar också uppskatta att möta idéer och upplevelser som ger något nytt att tänka på. Vad som väcker ditt intresse behöver få skiljas från hur du organiserar vardagen. Det går att vara nyfiken i en fråga och vilja hålla andra delar välbekanta. Därför beskriver din öppenhet ett intresseområde, inte en skyldighet att välja det mest ovanliga alternativet.", ["O"]);
    }
    else if (is("O", "low")) {
        add("familiar-start", "Du verkar gärna ha en bekant utgångspunkt när du möter något nytt. En konkret koppling till sådant du redan gör kan vara mer intressant än en idé som ännu saknar plats i vardagen. Det ger en riktning åt dina val, utan att bestämma hur långt du vill gå inom ett ämne du själv tycker om.", ["O"]);
    }
    if (is("N", "low") && raw(19)) {
        add("calm-with-mood-variation", "Du känner igen humörskiftningar, samtidigt som flera andra svar beskriver lugnare reaktioner. Det är en viktig skillnad att behålla. Ett lägre samlat värde ska därför inte göra din känslomässiga vardag mer enhetlig i texten än du själv har beskrivit den.", ["N"], [19]);
    }
    else if (is("N", "low")) {
        add("steady-emotional-pace-" + (is("C", "low") ? "less-structured" : "structured"), is("C", "low")
            ? "Samtidigt beskriver du ett förhållandevis jämnt känsloläge. Mindre fast struktur behöver alltså inte betyda att vardagen känns känslomässigt turbulent. Hur något blir gjort och hur du reagerar under tiden är två skilda delar av din profil. Den kombinationen gör det mer precist att tala om vissa praktiska delar än om att hela vardagen skulle kännas svår."
            : "Du beskriver också ett förhållandevis jämnt känsloläge. När något ändras kan känslan inför det och det som behöver ordnas vara två olika frågor. Din profil ger plats åt båda: vad du tycker om det som hänt och hur du vill gå vidare. Ett lugnt läge behöver inte göra själva valet mindre viktigt.", is("C", "low") ? ["N", "C"] : ["N"]);
    }
    else if (is("N", "high") && !emotionalCare) {
        add("responsive-emotional-pace", "Dina känslor verkar också kunna ta tydlig plats. En situation kan beröra dig utan att den för den skull behöver styra varje beslut du fattar. Det är därför värt att behålla både reaktionen och resten av ditt sätt att fungera i bilden, i stället för att låta ett starkt ögonblick beskriva hela dig.", ["N"]);
    }
    if (is("O", "mixed") && raw(15) && raw(30)) {
        add("interest-without-depth-demand", "I lärandet finns ytterligare en nyans: du kan uppskatta en ny idé och ändå tycka att grunderna ofta räcker. Intresse och lust att fördjupa sig i varje ämne är alltså inte samma sak i dina svar.", [], [15, 30]);
    }
    else if (emotionalCare) {
        add("care-not-a-duty", "Sammantaget behöver din omtanke och din egen upplevelse få varsin plats. I ett gemensamt val kan du vilja ta hänsyn och ändå behöva säga vad som passar dig. Det är ett vardagsnära sätt att förstå kombinationen, utan att göra dig ansvarig för allas upplevelse.", ["A", "N"]);
    }
    if (emotionalCare && !is("C", "high") && !is("C", "low") && is("O", "mixed") && raw(15) && raw(30)) {
        add("values-and-current-feeling", "Det som verkar viktigt i helheten är att hålla isär vad du vill bidra med och hur en viss stund känns. Du kan vilja vara omtänksam även när reaktionen är stark. Den ena sidan gör inte den andra mindre relevant.", ["A", "N"]);
    }
    if (!claims.length) {
        if (is("A", "low")) {
            add("reserved-interaction-only", "Dina svar ger en tydligare riktning inom samspel än inom de andra områdena. Den samlade skattningen är lägre, men ton, tillit och tid för andra är fortfarande olika frågor. De mer specifika relationssvaren behöver därför styra vad som går att säga om just ditt sätt att möta andra.", ["A"]);
        }
        else
            add("no-simple-label", readings.some(r => r.direction === "mixed")
                ? "Dina svar ger ingen enkel beskrivning som passar genomgående. Du känner igen olika sidor av samma område, och ett genomsnitt skulle göra flera av skillnaderna osynliga. Därför får du ingen bestämd arketyp här. De mer avgränsade mönstren längre ned kan fortfarande vara värda att undersöka, men de ska inte läsas som en förklaring till hela din personlighet."
                : "Du har inte markerat någon tydlig riktning som går igenom flera av frågorna. Därför får du ingen bestämd arketyp eller en färdig berättelse om vem du är. Det är ett avgränsat resultat av den här självskattningen. Det ger varken skäl att beskriva dig som särskilt balanserad eller att fylla luckorna med egenskaper du inte har uppgett.", readings.filter(r => r.score.valid > 0).map(r => r.dimension));
    }
    if (claims.length === 1 && is("C", "high") && is("O", "high")) {
        claims[0] = Object.assign(Object.assign({}, claims[0]), { evidence: readings.flatMap(r => r.score.evidence) });
        claims[0] = Object.assign(Object.assign({}, claims[0]), { text: "Du verkar uppskatta både nya infallsvinklar och en tydlig ordning när något ska genomföras. Det kan ge dig två olika saker att ta hänsyn till i samma beslut: vad som väcker ditt intresse och vad du vill få grepp om innan du väljer. De behöver inte konkurrera.\n\nEn ny aktivitet kan till exempel locka genom att vara annorlunda, samtidigt som du vill veta vad den kräver i tid och pengar. Du kan alltså vara nyfiken på innehållet och föredra att de praktiska delarna är begripliga. Det ena är inte ett färdigt svar på det andra.\n\nDet gör det mer träffsäkert att skilja intresset för en möjlighet från beslutet att faktiskt ge den plats. Du kan uppskatta något nytt utan att vilja göra om hela vardagen. De sociala och känslomässiga svaren ger inte lika tydliga gemensamma riktningar här. Därför får de inget bestämt tonläge i porträttet." });
    }
    if (claims.length === 1 && is("C", "high") && is("O", "low")) {
        claims[0] = Object.assign(Object.assign({}, claims[0]), { evidence: readings.flatMap(r => r.score.evidence) });
        claims[0] = Object.assign(Object.assign({}, claims[0]), { text: "Du verkar gärna utgå från något bekant och ha grepp om det praktiska. En ny idé behöver inte bli mer lockande bara för att den är ny. Det kan vara viktigare vad den skulle tillföra i en vardag du redan känner till.\n\nNär du överväger en förändring kan du därför vilja förstå både nyttan och hur den skulle passa in. En annan kvällsrutin kan till exempel vara intressant om den löser något bestämt, även om du helst behåller flera delar som de redan är. En bekant utgångspunkt och ett tydligt genomförande kan få finnas i samma val.\n\nDen kombinationen är mer precis än att beskriva dig som antingen förändringsvillig eller ovillig. Du kan värdera en bestämd förändring utan att behöva vilja ha mer nytt i allmänhet. De övriga delarna av din självskattning rymmer större variation. De får därför inte avgöra hur social, lugn eller omtänksam du ska beskrivas som i helheten." });
    }
    const evidence = Array.from(new Map(claims.flatMap(c => c.evidence).map(e => [e.questionId, e])).values());
    return { id: "portrait", theme: "whole-person-portrait", title: "Din helhetsbild", source: "dimension",
        interpretation: claims.map(c => c.text).join("\n\n"), claims, evidence,
        counterEvidence: Array.from(new Map(claims.flatMap(c => c.counterEvidence).map(e => [e.questionId, e])).values()), limitations: [] };
}

},
"v6/render.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderMarkdown = renderMarkdown;
exports.countWords = countWords;
// Counts visible report prose, including headings and qualifications, excluding evidence appendix and technical metadata.
function renderMarkdown(report, evidence = false) {
    var _a;
    const lines = ["# PERSONA – " + report.title, ""];
    for (const section of report.sections) {
        const shownLimits = new Set();
        lines.push("## " + section.title, "");
        if (section.note)
            lines.push(section.note, "");
        for (const b of section.blocks) {
            lines.push("### " + b.title, "");
            if (b.observation)
                lines.push("**Observation:** " + b.observation, "", "**Möjlig tolkning:**", "");
            if (b.adviceReason)
                lines.push(b.adviceReason, "");
            lines.push(b.interpretation, "");
            if (b.example)
                lines.push("**Ett möjligt vardagsexempel:** " + b.example, "");
            for (const limit of b.limitations) {
                if (shownLimits.has(limit))
                    continue;
                shownLimits.add(limit);
                lines.push("*" + limit + "*", "");
            }
            if (evidence) {
                lines.push("Underlag: " + b.evidence.map(e => e.questionId + "=" + e.answer).join(", ") + ".", "");
                if (b.counterEvidence.length)
                    lines.push("Motbelägg: " + b.counterEvidence.map(e => e.questionId + "=" + e.answer).join(", ") + ".", "");
                if ((_a = b.contextEvidence) === null || _a === void 0 ? void 0 : _a.length)
                    lines.push("Nyanser: " + b.contextEvidence.map(e => e.questionId + "=" + e.answer).join(", ") + ".", "");
            }
        }
    }
    lines.push("*" + report.method + "*", "");
    return lines.join("\n");
}
function countWords(report) {
    var _a;
    return ((_a = renderMarkdown(report).match(/[\p{L}\p{N}]+(?:[’'-][\p{L}\p{N}]+)*/gu)) !== null && _a !== void 0 ? _a : []).length;
}

},
"v6/report.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildReport = buildReport;
const immutable_1 = require("../immutable");
const patterns_1 = require("../v4/patterns");
const index_1 = require("../insights-v1/index");
const questions_1 = require("../v3/questions");
const dimensions_1 = require("./dimensions");
const content_1 = require("./content");
const insight_copy_1 = require("./insight-copy");
const portrait_1 = require("./portrait");
const manifest_1 = require("./manifest");
const submission_1 = require("./submission");
const archetypeIds = ["explore-then-build", "bring-people-along", "careful-bridge", "steady-execution"];
const method = "Det här är en självskattning. Texten beskriver svarsmönster och möjliga tolkningar, inte en diagnos eller ett facit på din personlighet. Exemplen är tänkbara situationer. Råden är försök att prova; orsaker och förmågor har inte undersökts.";
const isClear = (r) => r.direction === "high" || r.direction === "low";
function matches(answers, n, dir) {
    const v = answers[n - 1];
    return v > 0 && (dir === "high" ? v >= 4 : v <= 2);
}
function at(answers, numbers) {
    return numbers.map(n => ({ questionId: "Q" + String(n).padStart(2, "0"), answer: answers[n - 1] }));
}
function dimensionBlock(r, role) {
    var _a;
    if (!isClear(r))
        return null;
    const passage = (_a = content_1.content[r.dimension + "-" + r.direction]) === null || _a === void 0 ? void 0 : _a[role];
    if (!passage)
        return null;
    return { id: role + "-" + r.dimension, theme: role + "-" + r.dimension, topics: [passage.topic], title: passage.title, source: "dimension",
        interpretation: passage.text, example: passage.example, evidence: r.support, counterEvidence: r.counter, limitations: [] };
}
const relations = [
    { id: "trust-pace", title: "En kontakt kan få växa i etapper", conditions: [[2, "high"], [34, "high"]], exclude: "trust-and-disclosure" },
    { id: "listening-and-care", title: "Det stöd du vill ha behöver få bli tydligt", conditions: [[33, "high"], [7, "high"]] },
    { id: "voice-and-tone", title: "Sakfrågan och tonen kan få varsin plats", conditions: [[35, "high"], [12, "low"]], exclude: "cooperation-and-disagreement" },
    { id: "voice-and-boundaries", title: "Intresse är inte samma sak som ett ja", conditions: [[35, "high"], [36, "high"]], exclude: "commitment-boundaries" },
    { id: "tone-and-repair", title: "Det finns en fråga kvar efter ordväxlingen", conditions: [[12, "high"], [22, "high"]] },
];
function relationBlock(r, answers, readings) {
    var _a;
    const high = (d) => readings.find(t => t.dimension === d && t.direction === "high");
    const low = (d) => readings.find(t => t.dimension === d && t.direction === "low");
    let text = "", example = "", context;
    if (r.id === "listening-and-care") {
        if (high("N")) {
            context = high("N");
            text = "När du själv berättar om något svårt vill du helst bli lyssnad på först. " + (matches(answers, 19, "high") ? "Med känslor som kan skifta" : "När reaktioner tar tydlig plats") + " kan det vara särskilt relevant att skilja den stunden från ett senare samtal om vad som ska göras. Du kan prova att göra ordningen tydlig, utan att behöva veta lösningen redan när du börjar berätta.";
            example = "Du kan säga att du först vill få berätta färdigt och sedan gärna vill höra ett förslag. Hur den andra vill ha stöd behöver ni fråga om var för sig.";
        }
        else if (low("E")) {
            context = low("E");
            text = "Du vill helst bli lyssnad på först när du berättar om något svårt. Med ett mer återhållsamt sätt att delta kan det vara värt att ge själva berättandet ett tydligt utrymme, i stället för att hoppas att allt kommer fram mellan andra ämnen.";
            example = "En promenad med en person eller en bestämd stund i telefon kan vara former att prova om du själv vill prata. Det viktiga är att du hinner säga det du ville, inte att samtalet blir långt.";
        }
        else if (high("E")) {
            context = high("E");
            text = "Även om du gärna tar kontakt kan ett svårt samtal behöva ett annat upplägg än ett vanligt småprat. Du vill helst bli lyssnad på först. Det kan hjälpa att säga det i början, så att samtalet inte direkt fylls av frågor, egna berättelser eller lösningsförslag.";
            example = "Du kan be att få berätta klart innan ni diskuterar vad du ska göra. När en vän berättar behöver du fråga vilken sorts respons personen själv vill ha.";
        }
        else {
            text = "När något är svårt vill du helst få berätta innan lösningsförslagen kommer. Det ger en konkret utgångspunkt för hur du kan be om stöd. Den andra behöver få veta vilken del du vill ha hjälp med just nu.";
            example = "En fråga som Vill du att jag bara lyssnar en stund? kan tydliggöra ordningen när rollerna är omvända. Ditt eget önskemål behöver inte vara samma som vännen har.";
        }
    }
    else if (r.id === "trust-pace") {
        text = "Du behöver inte avgöra hur mycket du vill dela bara för att ett möte känns vänligt. En kontakt kan fortsätta medan tilliten får mer tid. Det kan vara hjälpsamt att låta den andra förstå att du gärna ses igen, även om du inte vill berätta mer om en personlig sak just då.";
        example = "Du kan föreslå ett nytt tillfälle att träffas och samtidigt säga att du vill vänta med ett visst ämne. De två beskeden kan finnas i samma samtal.";
    }
    else if (r.id === "voice-and-tone") {
        text = "Du beskriver att du kan säga vad du tycker och känner liten igenkänning i att ofta uttrycka dig vasst. Det öppnar för att skilja en invändning från ett avståndstagande. Någon kan höra ett nej till hela idén där du själv bara vill ändra en del.";
        example = "Om ni vill olika saker en kväll kan ni först reda ut om ni är oense om själva planen eller bara om tid och omfattning.";
    }
    else if (r.id === "voice-and-boundaries") {
        text = "Du kan tycka att ett förslag är bra utan att ännu vilja förbinda dig till det. För den andra kan skillnaden behöva bli tydlig. Ett positivt samtal om en idé är inte automatiskt en överenskommelse om vad du ska göra.";
        example = "Du kan uppskatta en inbjudan och ändå behöva återkomma om du vill delta. Det går att visa intresse utan att ge ett färdigt besked.";
    }
    else {
        text = "Efter ett skarpt meningsutbyte kan det finnas både en sakfråga och något som fortfarande skaver. De behöver inte vara samma problem. Om du vill återuppta kontakten kan det vara användbart att först skilja vad du fortfarande invänder mot från hur ni vill prata med varandra.";
        example = "Att förklara varför en sak var viktig besvarar inte alltid frågan om vad ni vill göra annorlunda nästa gång.";
    }
    return { id: "relation-" + r.id, theme: "relation-" + r.id, topics: ["relation-" + r.id], title: r.title, source: "reflection",
        interpretation: text, example, evidence: at(answers, r.conditions.map(([n]) => n)), contextEvidence: context === null || context === void 0 ? void 0 : context.support, counterEvidence: (_a = context === null || context === void 0 ? void 0 : context.counter) !== null && _a !== void 0 ? _a : [], limitations: [] };
}
function buildReport(input) {
    var _a;
    const { answers } = (0, submission_1.parseSubmission)(input);
    const readings = (0, dimensions_1.readDimensions)(answers), dimensions = readings.map(r => r.score);
    const insightAnalysis = (0, index_1.analyzeInsights)(answers);
    const clear = readings.filter(isClear);
    const byKey = (key) => clear.find(r => r.score.valid === 6 && r.counter.length === 0 && r.dimension === key[0] && (key[1] === "+" ? r.direction === "high" : r.direction === "low"));
    const candidate = patterns_1.patterns.filter(p => archetypeIds.includes(p.id) && p.keys.every(byKey)).sort((a, b) => {
        const weight = (keys) => keys.reduce((n, k) => n + byKey(k).support.length - byKey(k).counter.length, 0);
        return weight(b.keys) - weight(a.keys) || (a.id < b.id ? -1 : 1);
    })[0];
    const archetype = candidate ? { id: candidate.id, name: candidate.name, evidence: candidate.keys.flatMap(k => byKey(k).support) } : null;
    const strong = (d, dir) => clear.some(r => r.dimension === d && r.direction === dir);
    const title = (_a = archetype === null || archetype === void 0 ? void 0 : archetype.name) !== null && _a !== void 0 ? _a : (strong("A", "high") && strong("N", "high") ? (matches(answers, 19, "high") ? "Omtanke och känslor som skiftar" : "Samspel och tydligare känsloreaktioner") : clear.length ? "Din profil med " + clear.slice(0, 2).map(r => ({
        E: r.direction === "high" ? "socialt initiativ" : "ett lugnare socialt tempo",
        A: r.direction === "high" ? "omtanke" : "lägre värden inom samspel",
        C: r.direction === "high" ? "struktur" : "varierat genomförande",
        N: r.direction === "high" ? "tydligare känsloreaktioner" : "ett jämnare känsloläge",
        O: r.direction === "high" ? "nyfikenhet" : "en bekant utgångspunkt",
    }[r.dimension])).join(" och ") : "En bild med flera nyanser");
    const selectedTopics = new Set(insightAnalysis.insights.map(i => insight_copy_1.insightCopy[i.id].topic));
    const profile = (0, portrait_1.buildPortrait)(readings, answers);
    const insightBlocks = insightAnalysis.insights.map(i => {
        const copy = (0, insight_copy_1.presentInsight)(i.id, readings);
        const limits = [];
        if (i.id === "autonomy-with-milestones" && matches(answers, 23, "low"))
            limits.push("Du känner samtidigt mindre igen dig i att hålla det du lovar. Den nyansen gäller fullföljandet, även om delmål och eget metodval passar dig.");
        return { id: "insight-" + i.id, theme: "insight-" + i.id, topics: [copy.topic], title: copy.title, source: "insight", insightId: i.id,
            observation: copy.observation, interpretation: copy.interpretation, example: copy.everyday,
            evidence: i.evidence, counterEvidence: i.counterEvidence, contextEvidence: [...i.nuanceEvidence, ...copy.contextEvidence], presentationId: copy.variantId, limitations: limits };
    });
    const priority = [...clear].sort((a, b) => b.support.length - a.support.length || ["C", "O", "A", "E", "N"].indexOf(a.dimension) - ["C", "O", "A", "E", "N"].indexOf(b.dimension));
    const strengths = [];
    for (const r of priority) {
        if (r.dimension === "A" && selectedTopics.has("commitment-boundaries"))
            continue;
        if (r.dimension === "E" && selectedTopics.has("social-recovery"))
            continue;
        if (r.dimension === "N" && !matches(answers, 14, "high"))
            continue;
        if (r.dimension === "A" && (!matches(answers, 7, "high") || !matches(answers, 17, "high")))
            continue;
        if (r.dimension === "O" && r.direction === "high" && !matches(answers, 15, "high"))
            continue;
        const b = dimensionBlock(r, "strength");
        if (!b)
            continue;
        // Individual examples depend on a second clear direction; its evidence remains visible.
        if (r.dimension === "A" && strong("E", "high")) {
            strengths.push(Object.assign(Object.assign({}, b), { interpretation: "När du redan är i kontakt med andra kan du använda ett enkelt utbyte till att ta reda på vilken hjälp som faktiskt önskas. En konkret fråga gör det lättare att erbjuda något användbart, utan att du behöver ta över det som den andra vill sköta själv.", example: "Om en vän har mycket omkring sig kan du fråga om en bestämd praktisk del skulle underlätta, i stället för att börja ordna flera saker på eget initiativ.", contextEvidence: clear.find(t => t.dimension === "E").support }));
        }
        else if (r.dimension === "A" && strong("E", "low")) {
            strengths.push(Object.assign(Object.assign({}, b), { interpretation: "Omtanke kan få en tydlig form genom en liten handling. Du kan välja ett bidrag som inte kräver ett långt samtal eller en stor insats, men som den andra faktiskt vill ha.", example: "Ett erbjudande om att följa med på ett ärende eller lämna något som behövs kan vara former att prova. Stäm av vilken del personen själv vill ha hjälp med.", contextEvidence: clear.find(t => t.dimension === "E").support }));
        }
        else if (r.dimension === "O" && r.direction === "high" && strong("C", "high")) {
            strengths.push(Object.assign(Object.assign({}, b), { interpretation: "Du kan använda ditt idéintresse till att jämföra mer än ett genomförbart alternativ. Med struktur i genomförandet finns också en ram för att undersöka vad alternativen faktiskt kräver. Möjligheten ligger i jämförelsen, inte i att det nyaste förslaget måste vinna.", example: "Inför en ledig dag kan du jämföra två olika upplägg med samma tid och kostnad, så att skillnaden du väljer mellan faktiskt blir tydlig.", contextEvidence: clear.find(t => t.dimension === "C").support }));
        }
        else if (r.dimension === "O" && r.direction === "high" && strong("C", "low")) {
            strengths.push(Object.assign(Object.assign({}, b), { interpretation: "Du kan låta ditt idéintresse bidra när ett val känns låst. Ett tredje alternativ behöver inte bli ett helt nytt upplägg. Det kan räcka att ändra en del av en vardagsplan så att du får något annat att ta ställning till.", example: "Om två alternativ för en ledig dag inte passar kan du behålla aktiviteten från det ena och platsen från det andra. Det är ett möjligt försök, inte en beskrivning av vad du redan brukar göra.", contextEvidence: clear.find(t => t.dimension === "C").support }));
        }
        else
            strengths.push(b);
        if (strengths.length === 3)
            break;
    }
    if (strengths.length === 1 && strong("A", "high") && matches(answers, 12, "low") && matches(answers, 22, "low")) {
        strengths.push({ id: "strength-renewed-conversation", theme: "strength-renewed-conversation", topics: ["renewed-conversation"], title: "Ge en oenighet ett nytt samtal", source: "dimension",
            interpretation: "I dina svar tar en vass ton och kvarhållet groll mindre plats. Det kan vara en användbar utgångspunkt när en oenighet behöver tas upp igen: låt samtalet handla om den bestämda frågan, utan att göra den till ett omdöme om personen.",
            example: "Om ni valde olika saker i går kan nästa samtal börja med vad ni vill göra nu, snarare än vem som hade mest fel.",
            evidence: at(answers, [12, 22]), counterEvidence: [], limitations: [] });
    }
    if (strengths.length === 1 && strong("O", "high") && matches(answers, 5, "high") && matches(answers, 25, "high") && !selectedTopics.has("imagination-and-detail")) {
        strengths.push({ id: "strength-expression", theme: "strength-expression", topics: ["personal-expression"], title: "Ge en tanke något att möta", source: "dimension",
            interpretation: "Du kan använda fantasi och känsla för vardagliga uttryck till att göra en tanke synlig. Ett litet utkast ger något konkret att reagera på, utan att du behöver bestämma hur det färdiga resultatet ska bli.",
            example: "En färg, bild eller enkel skiss kan hjälpa dig att märka vilken del av en tänkt förändring du själv tycker om.",
            evidence: at(answers, [5, 25]), counterEvidence: [], limitations: [] });
    }
    const riskPriority = strong("C", "low") && strong("N", "low")
        ? [...priority].sort((a, b) => ["N", "A", "O", "E", "C"].indexOf(a.dimension) - ["N", "A", "O", "E", "C"].indexOf(b.dimension))
        : priority;
    const blindSpots = riskPriority.flatMap(r => {
        if (r.dimension === "A" && selectedTopics.has("commitment-boundaries"))
            return [];
        const b = dimensionBlock(r, "blind");
        if (b && r.dimension === "A" && strong("N", "high"))
            return [Object.assign(Object.assign({}, b), { title: "Ett lättare samtal är inte alltid ett färdigt beslut", interpretation: "Om ett samtal har varit intensivt kan det kännas skönt när tonen blir lättare. Det kan ändå finnas en sakfråga kvar. Kontrollpunkten är vad ni faktiskt har bestämt, inte bara om samtalet kändes bättre på slutet.", contextEvidence: clear.find(t => t.dimension === "N").support })];
        return b ? [b] : [];
    }).slice(0, 2);
    const relationships = relations.filter(r => r.conditions.every(([n, d]) => matches(answers, n, d)) && (!r.exclude || !selectedTopics.has(r.exclude))).slice(0, 2).map(r => relationBlock(r, answers, readings));
    const compass = insightAnalysis.advice.map(a => {
        const copy = (0, insight_copy_1.presentInsight)(a.insightId, readings);
        return { id: "advice-" + a.id, theme: "advice-" + a.id, topics: [copy.topic], title: copy.adviceTitle, source: "insight", insightId: a.insightId,
            interpretation: copy.advice, adviceReason: copy.reason, evidence: a.evidence, counterEvidence: a.counterEvidence, contextEvidence: [...a.nuanceEvidence, ...copy.contextEvidence], presentationId: copy.variantId, limitations: [] };
    });
    const usedDimensions = new Set();
    for (const i of insightAnalysis.insights)
        for (const e of i.evidence) {
            const q = questions_1.coreQuestions.find(q => q.id === e.questionId);
            if (q)
                usedDimensions.add(q.dimension);
        }
    for (const r of priority) {
        if (compass.length >= 3)
            break;
        if (usedDimensions.has(r.dimension))
            continue;
        if (r.dimension === "C" && !matches(answers, 3, "high"))
            continue;
        if (r.dimension === "A" && matches(answers, 35, "high") && matches(answers, 36, "low"))
            continue;
        const b = dimensionBlock(r, "advice");
        if (b) {
            compass.push(b);
            usedDimensions.add(r.dimension);
        }
    }
    // Keep the resource, but do not repeat the same one-change routine as both example and advice.
    const presentedStrengths = strengths.map(b => b.id === "strength-O" && strong("O", "low") && compass.some(a => a.id === "advice-O")
        ? Object.assign(Object.assign({}, b), { example: undefined }) : b);
    function section(id, blocks, note) { return { id, title: manifest_1.SECTION_TITLES[id], blocks, note }; }
    const varied = readings.filter(r => r.score.varied).map(r => r.dimension);
    const warnings = [...(varied.length ? ["varied_dimensions"] : []), ...(answers.some(a => a === 0) ? ["skipped_answers"] : []), ...(!clear.length ? ["no_clear_dimension_direction"] : [])];
    return (0, immutable_1.immutable)({
        product: "persona_test", experimental: true, reportVersion: manifest_1.VERSIONS.report, questionVersion: manifest_1.VERSIONS.question, analysisVersion: manifest_1.VERSIONS.analysis, contentVersion: manifest_1.VERSIONS.content,
        insightVersion: insightAnalysis.engineVersion, catalogVersion: insightAnalysis.catalogVersion, title, archetype, method, dimensions, readings, insightAnalysis,
        sections: [
            section("persona", [profile]),
            section("insights", insightBlocks, !insightBlocks.length ? "Inga tillräckligt underbyggda kombinationsinsikter valdes. De andra delarna bedöms var för sig." : !clear.length && varied.length ? "Dina svar rymmer motriktade signaler. Insikterna gäller avgränsade kombinationer, inte en bestämd personlighetstyp." : undefined),
            section("strengths", presentedStrengths, presentedStrengths.length ? undefined : "Här väljs inga generella styrkor med tillräckligt tydligt svarsstöd."),
            section("blindSpots", blindSpots, blindSpots.length ? "Det här är möjliga fallgropar att pröva mot din vardag." : "Ingen särskild fallgrop valdes med tillräckligt stöd."),
            section("relationships", relationships, relationships.length ? undefined : "Relationssvaren ger inget ytterligare perspektiv som är tillräckligt tydligt eller skiljer sig från insikterna ovan."),
            section("compass", compass, compass.length ? undefined : "Inget tillräckligt personligt försök valdes."),
        ],
        quality: { eligible: dimensions.every(d => d.value !== null), warnings, skipped: answers.filter(a => a === 0).length, variedDimensions: varied },
    });
}

},
"v6/submission.ts":function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSubmission = parseSubmission;
const immutable_1 = require("../immutable");
const submission_1 = require("../v3/submission");
const manifest_1 = require("../v3/manifest");
const manifest_2 = require("./manifest");
function parseSubmission(input) {
    if (!input || typeof input !== "object" || Array.isArray(input))
        throw Error("Invalid PERSONA V6 submission");
    const value = input;
    if (value.reportVersion !== manifest_2.VERSIONS.report)
        throw Error("Invalid PERSONA V6 report version");
    const validated = (0, submission_1.parseSubmission)(Object.assign(Object.assign({}, value), { reportVersion: manifest_1.VERSIONS.report }));
    return (0, immutable_1.immutable)(Object.assign(Object.assign({}, validated), { reportVersion: manifest_2.VERSIONS.report }));
}

}
};
const cache=new Map();function load(id){if(cache.has(id))return cache.get(id).exports;const factory=factories[id];if(!factory)throw Error("Unknown frozen module");const module={exports:{}};cache.set(id,module);factory(name=>{const parts=id.split("/");parts.pop();for(const part of name.split("/")){if(part==="..")parts.pop();else if(part!==".")parts.push(part);}return load(parts.join("/")+".ts");},module,module.exports);return module.exports;}
const supplement=load("supplement-v1/index.ts"),v6=load("v6/manifest.ts"),insights=load("insights-v1/index.ts");
module.exports=Object.freeze({completeReport:supplement.completeReport,sourceFingerprint:"cdfa997c1ab5085edd337c0603a58f127802f26fdf960d0af2ef92cc868dd55d",sourceHashes:Object.freeze({"immutable.ts":"842393db3f547ac5de9c48cf62c7c1e7a55ca6bf828906ddd3ebcce5f43150d6","insights-v1/catalog.ts":"70d4164a01287a3222582edd6dfa3f803f528385bd4f4a12d823e550a986da78","insights-v1/engine.ts":"6b140ed3c90209fec6f32f791969a22b5e4c5ea5c8f0a4baac4b626dc89ddcfa","insights-v1/index.ts":"c4482eec57fe8348f4ed7deb8899ef4753c237428af8670d2d3ef5a93a62dfe6","quality-v1/index.ts":"9209a355cc61087e91371ef2fd0a324e8532d6d45d7c3185ee1e2cf8f1882275","supplement-v1/experiments.ts":"b6b6087ec79b3df419b8ca38d6bdd383f69618b5f805a0e1dcf93e0a8162f180","supplement-v1/index.ts":"ccd02b17fe23cb1e9be1d2a10f23656140d188004b1cfad8c9200c79514e964d","supplement-v1/offer.ts":"2f01cad77a65ec4c032801331774521c477819d3f65313c0b1a87f35718fc199","supplement-v1/questions.ts":"d3e642b6a1bf1db11c1a7b407039d2b065f8af9c180118f2573a9084f5046efd","v3/manifest.ts":"47dfcf0ec29067575ed3eb51f59919a7aac830557ed60dfc73fd89cf31dca323","v3/questions.ts":"4a2ebfd45143c7a3d4e3c2203cb165a64aa5091c9a2a929351bc6db95ea39535","v3/score.ts":"d002b25a57f94c9dd05b1b860525430dd98296436579d331e011ebbc9c42ebe5","v3/submission.ts":"cd5fb49b49ea846e419a8232760258f1e184cfae9c2e33e18196978c552b238a","v4/patterns.ts":"ed21aa544708f0ce1240912ded34586c102c4ff841eaeab35cfbc78a5af08819","v6/content.ts":"af4fcdaff302f3c255b6fb3410685a032cb59da407fe012f4695e4caee395717","v6/dimensions.ts":"7e59b4c10e860507ec2424c203ff3f07bb6d70a7d8e16037ff64bde98342f8e9","v6/index.ts":"718e84067af15307f66cae8c9f0c6812b7ce9e237c9ab9fb65069dd706303c2f","v6/insight-copy.ts":"76cd187405b2af99173bae38f36484d87c08b5ff469ff5b8c48e9353d51322bb","v6/manifest.ts":"f2aea73271cb4789abd66c3ae6bb266ffddb1b2f49a3773fe0de9b02d6798073","v6/portrait.ts":"2d62a7a52bfac54957597600f38d580e2f1b950fc67bc41a8c0d82c7ff1f3e2e","v6/render.ts":"88ed271ccb21db42679296e041e8aa8e404b4a5aa8e69492635181a93b58807b","v6/report.ts":"28988d87e8538d6a9af46d1494911efd1f01b330a3e03fd3c6dd7dff5423ee84","v6/submission.ts":"8a93df186a39a5c373206f22e83baf7f80b349527a84d11abd768ab748a304f9"}),versions:Object.freeze({question:v6.VERSIONS.question,generator:v6.VERSIONS.report,analysis:v6.VERSIONS.analysis,reportContent:v6.VERSIONS.content,insightEngine:insights.ENGINE_VERSION,insightCatalog:insights.CATALOG_VERSION,supplement:supplement.SUPPLEMENT_VERSION,supplementContent:supplement.SUPPLEMENT_CONTENT_VERSION,quality:load("quality-v1/index.ts").QUALITY_VERSION,offerPolicy:load("supplement-v1/offer.ts").OFFER_POLICY_VERSION})});
