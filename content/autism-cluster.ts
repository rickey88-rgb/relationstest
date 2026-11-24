import type { InformationGuideData } from "../app/_components/InformationGuide";

const autism = { href: "https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/autism/", label: "1177 om autism, vård och stöd" };
const assessment = { href: "https://www.vardochinsats.se/autism/kartlaeggning-och-utredning/diagnostisk-utredning-vuxna/", label: "Nationella vård- och insatsprogrammet om utredning av vuxna" };
const masking = { href: "https://link.springer.com/article/10.1007/s10803-017-3166-5", label: "Hull med flera, kvalitativ studie om social maskering (2017)" };
const burnout = { href: "https://pdxscholar.library.pdx.edu/socwork_fac/378/", label: "Raymaker med flera, kvalitativ studie om autistisk utmattning (2020)" };
const balance = { href: "https://www.vardochinsats.se/autism/behandling-och-stoed/aktivitetsbalans/", label: "Nationella vård- och insatsprogrammet om aktivitetsbalans" };
const senses = { href: "https://www.habilitering.se/kunskap-och-stod/temasidor/smarta-och-sinnesintryck/viktigt-att-utreda-sensorisk-kanslighet-vid-autism/", label: "Habilitering & Hälsa om sensorisk känslighet" };
const adult = { href: "/autism-vuxna", label: "Autism hos vuxna" };
const mask = { href: "/maskering-autism", label: "Maskering vid autism" };
const women = { href: "/autism-kvinnor", label: "Autism hos kvinnor" };
const fatigue = { href: "/autistisk-utmattning", label: "Autistisk utmattning" };
const social = { href: "/autism-och-social-trotthet", label: "Autism och social trötthet" };
const sensory = { href: "/autism-och-sensorisk-kanslighet", label: "Autism och sensorisk känslighet" };
const overload = { href: "/meltdown-och-shutdown-vid-autism", label: "Meltdown och shutdown vid autism" };
const routine = { href: "/autism-och-rutiner", label: "Autism och rutiner" };
const relationship = { href: "/autism-och-relationer", label: "Autism och kärlek, närhet och relationer" };
const friends = { href: "/autism-och-vanskap", label: "Autism och vänskap" };
const practicalBook = { href: "/autism-bok", label: "AUTISM ALL INCLUSIVE – praktisk e-bok med arbetsblad" };

const publicationDate = "2026-11-25";

function guide(data: Omit<InformationGuideData, "datePublished" | "dateModified" | "eyebrow">): InformationGuideData {
  return { ...data, datePublished: publicationDate, dateModified: publicationDate, eyebrow: "" };
}

export const lateDiagnosis = guide({
  slug: "sen-autismdiagnos-hos-kvinnor",
  title: "Sen autismdiagnos hos kvinnor – inför och efter utredning",
  h1: "Sen autismdiagnos hos kvinnor",
  description: "Varför kan autism uppmärksammas först i vuxen ålder? Läs om maskering, hur en utredning går till och vad som kan vara hjälpsamt efter beskedet.",
  intro: "Du kanske har byggt ett helt vuxenliv kring att förbereda dig, hålla ihop på jobbet och vila när ingen ser. När autism blir en tänkbar förklaring kan många gamla minnen få en ny betydelse. Här går vi igenom vad vården behöver veta och hur du kan ta vara på det du lärt dig om dina behov.",
  sections: [
    {
      title: "När svårigheterna märks senare",
      paragraphs: [
        "En övergång kan göra ett gammalt mönster synligt. På en arbetsplats med fasta uppgifter gick dagarna att planera. Efter ett byte till öppet kontor, fler gruppmöten och växlande schema blev samma vecka svårare att få ihop. För vården är det relevant att höra både vad som fungerar och vad som krävs för att det ska fungera.",
        "Dold autism är ett vardagsuttryck. Det kan beskriva att omgivningen ser färre svårigheter än personen själv upplever. I studier om social maskering har deltagare bland annat beskrivit hur de övar repliker eller använder andra som modell för sitt beteende. Sådana strategier varierar och förekommer hos personer av olika kön. De räcker inte för att bedöma om någon har autism.",
      ],
      links: [women, mask],
    },
    {
      title: "Inför en utredning som vuxen",
      paragraphs: [
        "En neuropsykiatrisk utredning väger bland annat in utvecklingshistorik, hur olika miljöer fungerar i dag och andra möjliga förklaringar eller samtidiga besvär. Börja gärna med några exempel som går att beskriva konkret. Du kan ta med anteckningarna till en vårdkontakt även om du är osäker på vilken bedömning du behöver.",
      ],
      bullets: [
        "Från förr. Vilka miljöer eller situationer tog kraft när du gick i skolan? Vilka anpassningar eller rutiner hjälpte?",
        "Från nu. Välj en vanlig situation hemma och en på jobbet eller i studierna. Skriv hur du förbereder dig, vad som händer och hur länge du behöver återhämta dig.",
        "Ditt mål. Till exempel att kunna arbeta en hel vecka utan att måltider och sömn faller bort.",
      ],
    },
    {
      title: "Efter beskedet kan behoven få egna ord",
      paragraphs: [
        "En diagnos kan väcka lättnad och sorg samtidigt. Det går att börja i liten skala. Om otydliga mötesbesked tar mycket energi kan ett första önskemål vara en dagordning i förväg. Be utredningsteamet förklara vilka delar av bedömningen som hjälper dig förstå ditt stödbehov, vart du kan vända dig och vem som följer upp.",
        "Om utredningen landar i en annan förklaring kan du fråga vad vården har sett och vilka insatser som är lämpliga. Det du har antecknat om situationer som skaver kan fortfarande vara ett underlag för stöd.",
      ],
    },
  ],
  cta: { title: "Sätt ord på dina erfarenheter", text: "Relationsvarnings självskattning kan ge reflektionsfrågor inför ett samtal. Testet kan varken bekräfta eller utesluta autism.", href: "/autism-test", label: "Till autismtestet för vuxna" },
  related: [adult, women, mask, fatigue],
  sources: [assessment, autism, masking],
  faqs: [
    { question: "Kan autism uppmärksammas först i vuxen ålder?", answer: "Ja. Vid en utredning i vuxen ålder undersöker vården hur utvecklingen har sett ut och hur vardagen fungerar nu." },
    { question: "Vart vänder jag mig för att fråga om en utredning?", answer: "Se 1177:s regionala information eller kontakta din vårdcentral för att få veta vilken väg in som gäller där du bor." },
  ],
});

export const autisticBurnout = guide({
  slug: "autistisk-utmattning",
  title: "Autistisk utmattning – tecken, belastning och återhämtning",
  h1: "Autistisk utmattning",
  description: "Vad betyder autistisk utmattning? Läs om långvarig belastning, skillnaden mot social trötthet och vad du kan göra när vardagsorken förändras.",
  intro: "Det som tidigare gick på rutin kan plötsligt kräva hela dagens ork. Ljud blir svårare att sortera och ett samtal tar mer kraft än du har. Autistisk utmattning är ett begrepp som vuxna med autism och forskare använder för att beskriva erfarenheter av djup och ofta långvarig utmattning.",
  sections: [
    {
      title: "Vad personer beskriver i forskningen",
      paragraphs: [
        "I en tidig kvalitativ studie av Raymaker och kollegor beskrev deltagare svår utmattning, att tidigare hanterbara uppgifter blev svårare och en minskad tolerans för exempelvis ljud eller sociala krav. Berättelserna kopplade också utmattningen till långvarig belastning och otillräckligt stöd. Det är beskrivningar från deltagarna i studien, och begreppet har inga etablerade kliniska diagnoskriterier.",
        "En viktig skillnad i vardagen är hur länge förändringen sitter i och hur mycket som påverkas. Om du brukar bli trött efter jobbet men återhämtar dig en ledig kväll ser det annorlunda ut än om flera veckors vila inte räcker och du samtidigt har svårt att handla, planera eller kommunicera som tidigare.",
      ],
      links: [social, overload],
    },
    {
      title: "Gör några krav lättare att bära",
      paragraphs: [
        "Skriv upp ett par uppgifter som måste fungera den närmaste veckan och ett par som kan vänta. Välj något du kan be om konkret hjälp med. Om det är svårt att boka ett vårdbesök kanske en närstående kan sitta bredvid när du ringer, följa med eller hjälpa dig att skriva ner beskedet efteråt.",
        "Lägg märke till om en förändring verkligen minskar kravet eller bara flyttar det. Att jobba hemma kan minska ljud och resor men lämnar fortfarande möten och uppgifter kvar. Om belastningen är långvarig kan det vara värt att be arbetsgivare, chef eller vård om stöd som fungerar under en längre period.",
      ],
    },
    {
      title: "När förändringen behöver bedömas",
      paragraphs: [
        "Trötthet har flera möjliga orsaker. Om försämringen är ny, ihållande eller gör vardagen svår kan du kontakta vårdcentralen. Berätta hur länge det har pågått, vad du brukade kunna göra och vilka uppgifter du behöver stöd med nu. Säg också till om sömn, ork eller stämningsläge har förändrats. Vården kan bedöma tänkbara orsaker och vad som behövs härnäst.",
      ],
    },
  ],
  related: [social, sensory, adult, practicalBook],
  sources: [burnout, balance, autism],
  faqs: [
    { question: "Är autistisk utmattning en egen diagnos?", answer: "Begreppet används i forskning och av autistiska personer för att beskriva erfarenheter. Det saknar etablerade kliniska diagnoskriterier." },
    { question: "Vad kan man göra när det är svårt att säga vad som tar ork?", answer: "Välj en uppgift och dela upp den i före, under och efter. Ta med de delarna som exempel när du ber om stöd eller kontaktar vården." },
  ],
});

export const socialFatigue = guide({
  slug: "autism-och-social-trotthet",
  title: "Autism och social trötthet – återhämtning efter umgänge",
  h1: "Autism och social trötthet",
  description: "Blir du trött efter möten, middagar eller telefonsamtal? Så kan du skilja på vad som tar energi under umgänget och hitta utrymme för återhämtning.",
  intro: "En middag kan vara både rolig och ansträngande. Du kanske kan följa samtalet på plats och upptäcker först på vägen hem hur mycket kraft som gick åt. Genom att lägga märke till vilken del av umgänget som tar mest energi kan du göra plats för kontakten du faktiskt vill ha.",
  sections: [
    {
      title: "Vad var det som tog ork?",
      paragraphs: [
        "I ett gruppsamtal kan det krävas mycket för att skilja tal från bakgrundsljud, växla mellan flera personer och avgöra när det är dags att säga något. Ett telefonsamtal kan vara krävande av andra skäl. Det finns inga ansiktsuttryck att gå på och du behöver formulera dig i realtid.",
        "I studier om maskering har vissa vuxna beskrivit att de håller koll på sitt ansikte, sin blick eller sina svar samtidigt som de försöker följa samtalet. Sådana uppgifter kan ta kraft även när stunden är trevlig. Trötthet efter umgänge förekommer av många skäl och säger i sig inget om huruvida någon har autism.",
      ],
      links: [mask, sensory],
    },
    {
      title: "Prova en ändring i taget",
      paragraphs: [
        "Jämför två gånger då du umgås med personer du trivs med. Välj en skillnad du kan påverka. Det kan vara att ses två och två i stället för i grupp, boka en sluttid eller välja en plats där det går att höra varandra. Lägg märke till hur du mår direkt efteråt och vad du har ork till nästa dag.",
        "Ta även med resan och tiden före träffen i bedömningen. Om du varit på en konferens hela dagen kan kontrasten mellan en tom kalender och din faktiska ork vara stor. Boka gärna in återhämtningen precis som du bokar själva träffen.",
      ],
    },
    {
      title: "Säg hur du vill ses",
      paragraphs: [
        "Prova en inbjudan som också berättar vad du behöver. ”Jag vill gärna ses. Ska vi gå en promenad i en timme på lördag?” är ofta lättare att svara på än en öppen plan. Om du behöver lämna en middag tidigt kan du berätta det före middagen så att avskedet blir enklare.",
        "Om tröttheten håller i sig, ökar över flera veckor eller påverkar många uppgifter utanför det sociala är det värt att undersöka vad mer som ligger bakom. Vårdcentralen kan hjälpa till att bedöma en förändring som begränsar din vardag.",
      ],
      links: [fatigue, friends],
    },
  ],
  cta: { title: "Utforska hur olika situationer fungerar för dig", text: "I vår självskattning för vuxna ingår frågor om samspel, sinnesintryck och återhämtning. Den ger återkoppling på dina svar och kan inte ställa diagnos.", href: "/autism-test", label: "Till autismtestet för vuxna" },
  related: [fatigue, relationship, friends, adult],
  sources: [masking, balance, autism],
  faqs: [
    { question: "Kan jag tycka om att umgås och ändå bli socialt trött?", answer: "Ja. Glädjen i att träffa någon och kraften det tar att följa samtal, resa och hantera intryck kan finnas samtidigt." },
    { question: "Vad kan hjälpa när en stor grupp tar för mycket energi?", answer: "Prova att ses i en mindre grupp, byta till en tystare miljö, ha en tydlig sluttid eller planera en paus. Lägg märke till vilken ändring som hjälper dig." },
  ],
});

export const relationships = guide({
  slug: "autism-och-relationer",
  title: "Autism och relationer – kärlek, närhet och kommunikation",
  h1: "Autism och relationer",
  description: "En guide om autism, kärlek och närhet. Hitta konkreta sätt att prata om beröring, egentid, missförstånd och behov i en vuxen relation.",
  intro: "Den ena ser en tyst kväll ihop som närhet. Den andra undrar om något är fel. I en relation där en eller båda har autism kan det hjälpa att berätta vad vardagliga signaler betyder för just er. Här är exempel för dejting, fysisk närhet och ett liv tillsammans.",
  sections: [
    {
      title: "Berätta vad du menar när det finns tid att lyssna",
      paragraphs: [
        "”När jag blir tyst efter jobbet behöver jag ofta landa en stund. Jag vill gärna prata efter middagen.” Då får partnern både en förklaring och en tid för när ni kan hitta tillbaka till samtalet. Partnern kan i sin tur säga vad tystnaden väcker. Gör utrymme för bådas tolkningar innan ni bestämmer hur ni vill göra.",
        "När ni behöver lösa en konkret sak, säg gärna vilken. ”Jag vill att vi bestämmer vem som handlar före fredag” ger ett tydligare underlag än att försöka tolka vad ”du måste ta mer ansvar” betyder. Samma praktiska princip fungerar i sms, när ett samtal lätt blir för snabbt.",
      ],
    },
    {
      title: "Närhet kan se olika ut från en dag till nästa",
      paragraphs: [
        "En lätt strykning över armen kan upplevas annorlunda än en stilla hand. Beröring som känns bra på en lugn söndag kan vara svår efter en lång dag med mycket intryck. Prata i förväg om vad var och en uppskattar och hur ni vill fråga. ”Vill du att jag håller om dig eller sitter här bredvid?” ger två möjliga sätt att vara nära. Respektera ett nej och fråga igen en annan gång om det passar.",
        "Vid dejting går samma tydlighet att använda redan i planeringen. Säg hur du vill bli kontaktad och föreslå en plats där ni båda kan höra samtalet. Välj längd och aktivitet så att det är lätt att avsluta träffen när någon vill.",
      ],
      links: [sensory],
    },
    {
      title: "Gör en plan för samtalet som låser sig",
      paragraphs: [
        "Välj en signal för paus och kom överens om vem som tar upp frågan igen. ”Jag pausar nu och skickar ett sms vid åtta om när vi kan prata” gör det lättare att skilja mellan en paus och att frågan lämnas åt den andra. Om ni ofta fastnar kan ni be om stöd för relationen. Habilitering har i vissa regioner stöd kring relationer för personer med autism. Om du känner dig rädd eller pressad att gå med på något kan du söka stöd på egen hand.",
      ],
      links: [friends, { href: "/psykiskt-vald/hjalp", label: "Vägar till stöd vid hot och kontroll" }],
    },
  ],
  related: [friends, social, sensory, adult, { href: "/audhd-och-relationer", label: "Relationer vid samtidig ADHD och autism" }],
  sources: [
    { href: "https://www.habilitering.se/kunskap-och-stod/podden-funka-olika/dejtingtips-for-dig-med-autism/", label: "Habilitering & Hälsa om dejting, tydlighet och autism" },
    { href: "https://www.vardochinsats.se/autism/kommunikation-och-delaktighet/bemoetande-och-foerhaallningssaett-vid-autism/", label: "Nationella vård- och insatsprogrammet om individuellt bemötande" },
    senses,
  ],
  faqs: [
    { question: "Kan någon vilja ha närhet men undvika viss beröring?", answer: "Ja. Fråga vilken sorts beröring eller sällskap personen vill ha just nu och ge utrymme att svara nej." },
    { question: "Hur undviker vi att egentid tolkas som avstånd?", answer: "Förklara vad pausen gör för dig och kom överens om när ni hörs igen. Berätta för varandra vad som gör väntan enklare." },
  ],
});

export const sensorySensitivity = guide({
  slug: "autism-och-sensorisk-kanslighet",
  title: "Autism och sensorisk känslighet – när intrycken blir för många",
  h1: "Autism och sensorisk känslighet",
  description: "Ljud, ljus, kläder och dofter kan påverka vardagen olika. Lär dig kartlägga intryck och göra konkreta anpassningar vid överstimulering.",
  intro: "En mataffär kan vara svår på grund av sorlet, lysrören, dofterna eller kombinationen. Att veta vilket intryck som tar mest plats gör det lättare att hitta en förändring som hjälper. Den här guiden handlar om hur sinnesintryck kan upplevas vid autism och hur du kan undersöka vad som händer i din vardag.",
  sections: [
    {
      title: "Samma intryck kan spela olika stor roll",
      paragraphs: [
        "Sensorisk känslighet kan handla om att uppleva ljud, ljus, beröring, lukt eller andra intryck starkt. Personer med autism kan också märka vissa intryck mindre eller söka dem. En person kan ha svårt med plötsliga ljud och samtidigt uppskatta stark musik som hen själv har valt. Förutsägbarhet, möjlighet att stänga av och hur mycket som pågår runt omkring kan påverka upplevelsen.",
        "Överstimulering är ett vardagsord för att intrycken blir mer än du klarar att hantera i stunden. Du kanske tappar tråden, behöver komma ut eller märker först efteråt hur spänd du varit. Sådana reaktioner förekommer också hos personer utan autism.",
      ],
      links: [overload, social],
    },
    {
      title: "Gör en karta över en enda situation",
      paragraphs: [
        "Välj en plats du återkommer till. På kontoret kan du anteckna vad som händer när det blir svårt att koncentrera sig. Är det fläkten, människor som kommer bakifrån, ljus som blänker i skärmen eller de många samtalen tillsammans? Skriv vad du märker i kroppen och vad som blir svårt att göra.",
        "Prova en förändring som går att utvärdera. Flytta skärmen, be om en lugn arbetsplats eller gör ett besök på en tid när lokalen är mindre full. Om det fungerar bättre kan du be om just den ändringen. ”Jag hör samtalet bättre i ett mindre rum” är mer användbart än ”det är mycket där inne”.",
      ],
    },
    {
      title: "Bygg in en väg till paus",
      paragraphs: [
        "Tänk igenom var du kan ta en paus innan du behöver den. Vilket rum är lugnt? Hur kan du signalera att du behöver gå ut? Kan någon annan ta över kassan, mötet eller resan hem? Välj hjälpmedel efter miljön. I trafiken eller på en arbetsplats kan det till exempel vara viktigt att kunna höra varningssignaler.",
        "Sök vård om en känslighet har förändrats tydligt, orsakar smärta eller hindrar nödvändiga vardagsaktiviteter. Beskriv när den märks och vad som hjälper. Om du redan har kontakt med habiliteringen kan du fråga om stöd kring sinnesintryck och vardagsanpassningar.",
      ],
      links: [{ href: "/audhd-sensorisk-kanslighet", label: "Sensorisk känslighet när både ADHD- och autismdrag finns" }],
    },
  ],
  related: [overload, social, routine, adult, practicalBook],
  sources: [senses, autism, { href: "https://www.vardochinsats.se/autism/om-tillstaandet/autism-hos-barn-ungdomar-och-vuxna/", label: "Nationella vård- och insatsprogrammet om hur autism kan yttra sig" }],
  faqs: [
    { question: "Kan jag vara känslig för vissa ljud och ändå tycka om hög musik?", answer: "Ja. Eget val, förutsägbarhet och de andra intrycken i miljön kan påverka hur ett ljud upplevs." },
    { question: "Kan sensorisk känslighet ensam visa att jag har autism?", answer: "Nej. Autism bedöms utifrån ett bredare mönster över tid. Sensorisk känslighet kan ha olika orsaker." },
  ],
});

export const meltdownShutdown = guide({
  slug: "meltdown-och-shutdown-vid-autism",
  title: "Meltdown och shutdown vid autism hos vuxna – stöd vid överbelastning",
  h1: "Meltdown och shutdown vid autism",
  description: "Vad kan en meltdown eller shutdown innebära för en vuxen? Läs om skillnaderna och gör en konkret plan för stöd före, under och efter överbelastning.",
  intro: "Vid stark överbelastning kan en person gråta, höja rösten eller behöva komma bort. En annan gång kan det bli svårt att prata, fatta beslut eller ta ett första steg. Meltdown och shutdown är ord som många autistiska personer använder för sådana erfarenheter. Hur det känns inifrån varierar och är inte alltid synligt för den som står bredvid.",
  sections: [
    {
      title: "Hur kan en meltdown eller shutdown märkas?",
      paragraphs: [
        "En meltdown beskrivs ofta som en mer utåtriktad reaktion, till exempel att gråta eller behöva röra sig mycket. Vid en shutdown kan tal och initiativ i stället bli svårare. Att vara tyst säger ingenting säkert om hur mycket som pågår inuti. En person kan ha erfarenhet av båda och reaktionerna kan överlappa.",
        "Lägg märke till vad som fanns före reaktionen. Ett sent schemaändringsbesked kan vara den sista belastningen efter en lång dag med buller, uteblivna pauser och flera svåra samtal. Det ger fler möjliga ställen att minska belastningen än om hela förklaringen hamnar på den sista händelsen.",
      ],
      links: [sensory, routine],
    },
    {
      title: "När det händer",
      paragraphs: [
        "Minska sådant du kan påverka. Sänk ljudnivån, ge utrymme och pausa svåra frågor. Om du stöttar någon kan du använda få ord och ge tid för ett svar. Följ det personen tidigare sagt hjälper, om ni har pratat om det. Erbjud en lugnare plats om det går att förflytta sig tryggt. Fråga innan du tar i personen.",
        "Om det går lättare att skriva kan du ha en kort text i mobilen. Till exempel ”Jag hör dig. Jag kan inte prata just nu. Hjälp mig att komma till lugnare plats.” När en situation innebär akut fara går säkerheten först. Ring 112 vid ett akut nödläge.",
      ],
    },
    {
      title: "Planera när det finns ork igen",
      paragraphs: [
        "Skriv ner en tidig signal, en paus som fungerar och vad en annan person kan ta över. Ta ett exempel från en miljö där du vill kunna vara kvar på sikt. Ett möte kan exempelvis behöva kortare pass, frågor i förväg eller ett överenskommet sätt att lämna rummet.",
        "Kontakta vården om episoderna är nya, återkommer och begränsar vardagen, eller om du är osäker på vad som händer. Välj gärna ett konkret exempel och beskriv förloppet. Ordet du väljer för det behöver inte vara en förutsättning för att få hjälp.",
      ],
    },
  ],
  related: [sensory, routine, fatigue, practicalBook],
  sources: [
    { href: "https://autismspectrumresearch.com/wp-content/uploads/2023/01/accepted-version-the-lived-experience-of-meltdowns-for-autistics-adults.pdf", label: "Lewis och Stevens, intervjustudie om vuxnas erfarenheter av meltdowns" },
    { href: "https://pmc.ncbi.nlm.nih.gov/articles/PMC13315293/", label: "Kvalitativ studie om hur autistiska personer beskriver shutdowns" },
    senses,
    autism,
  ],
  faqs: [
    { question: "Vad är skillnaden mellan meltdown och shutdown?", answer: "Meltdown brukar beskriva en mer synlig reaktion på överbelastning. Vid shutdown beskriver många att de drar sig undan eller får svårt att svara eller agera. Hur det märks varierar." },
    { question: "Vad kan jag säga när någon har svårt att svara?", answer: "Använd få ord, låt det gå tid innan nästa fråga och ge möjlighet att svara på ett sätt personen kan använda, exempelvis genom att peka eller skriva." },
  ],
});

export const routines = guide({
  slug: "autism-och-rutiner",
  title: "Autism och rutiner – förutsägbarhet och stöd vid ändrade planer",
  h1: "Autism och rutiner",
  description: "Så kan rutiner göra vardagen mer förutsägbar vid autism. Prova en reservplan för sena ändringar och ge vardagsstruktur och specialintressen utrymme.",
  intro: "Du har räknat ut när bussen går och vad som behöver ligga i väskan. När mötesplatsen ändras fem minuter före avfärd är det flera beslut som måste tas om på en gång. En rutin kan göra de besluten färre. En reservplan kan göra själva förändringen lättare att hantera.",
  sections: [
    {
      title: "Vad gör rutinen möjlig?",
      paragraphs: [
        "En återkommande ordning kan hjälpa till att komma ihåg en uppgift, undvika oväntade intryck eller avsluta något man är uppslukad av. Fundera på vad den gör för dig. Om en välbekant frukost innebär att du faktiskt äter före jobbet kan värdet ligga i att du slipper välja eller vet hur maten kommer att kännas.",
        "Vid planering av stöd är det mer användbart att beskriva följden av en ändring än att bara notera att den var svår. Till exempel ”När schemat kommer samma morgon vet jag inte när jag ska äta eller hur jag ska resa, och jag blir sen.” Då blir det lättare för andra att se vilka besked som hjälper.",
      ],
    },
    {
      title: "Gör en reservplan som går att läsa när det är bråttom",
      paragraphs: [
        "Välj en tidpunkt som kan få vara fast när annat ändras. Om din arbetsplats byter lokal kanske din lunchrast kan ligga kvar. Skriv sedan en konkret ersättning för det som ändras. ”Om mötet flyttas skickar samordnaren adressen och starttiden i samma sms.”",
        "Gör förberedelserna enkla att hitta. En lapp där du lägger nycklarna kan vara mer användbar än ett dokument som måste öppnas. Om någon annan brukar ge ändringsbesked, be den personen ta med vad som ändras, vad som fortfarande gäller och vem du ska fråga.",
      ],
      links: [overload, fatigue],
    },
    {
      title: "Gör plats för fördjupning och övergångar",
      paragraphs: [
        "Specialintresse är ett ord för ett intresse som kan vara intensivt eller särskilt betydelsefullt. En del upplever stark glädje och hittar gemenskap genom sina intressen. För andra kan det vara svårt att avsluta när vardagen kräver en övergång. Det kan hjälpa att planera verklig tid för intresset och samtidigt ha ett enkelt sätt att lämna arbetet där du var. En anteckning om nästa steg kan göra det lättare att återvända.",
        "Om en rutin tar så mycket tid att du missar mat, sömn eller annat viktigt, ta med ett konkret exempel till en vårdkontakt. Beskriv vilken funktion rutinen ska fylla och vad som händer när du försöker ändra den.",
      ],
      links: [friends],
    },
  ],
  related: [adult, overload, sensory, practicalBook],
  sources: [autism, balance, { href: "https://www.vardochinsats.se/autism/om-tillstaandet/autism-hos-barn-ungdomar-och-vuxna/", label: "Nationella vård- och insatsprogrammet om rutiner och intressen vid autism" }, { href: "https://research.vu.nl/ws/files/72579810/Grove_et_al_2018_Autism_Research.pdf", label: "Grove med flera om specialintressen och välbefinnande hos vuxna (2018)" }],
  faqs: [
    { question: "Hur kan jag göra en oväntad ändring mer hanterbar?", answer: "Kontrollera vad som ändras, vad du kan behålla och vilket beslut du behöver ta först. Be om besked skriftligt om det hjälper." },
    { question: "Behöver ett specialintresse vara ovanligt?", answer: "Nej. Det kan handla om vilket ämne som helst. Det som beskrivs är hur betydelsefullt eller intensivt intresset är för personen." },
  ],
});

export const friendship = guide({
  slug: "autism-och-vanskap",
  title: "Autism och vänskap – hitta vänner och håll kontakten",
  h1: "Autism och vänskap",
  description: "Konkreta sätt att hitta sammanhang för vänskap, ta kontakt och umgås på sätt som passar din ork. Med exempel på första meddelanden och inbjudningar.",
  intro: "Vänskap kan börja med en person du träffar om och om igen på samma plats. Den kan också finnas i en chatt, en promenad varannan vecka eller ett gemensamt intresse. Om du har autism och vill hitta vänner kan ett tydligt sammanhang ge dig mer utrymme att faktiskt lära känna någon.",
  sections: [
    {
      title: "Börja med något som gör det lätt att ses igen",
      paragraphs: [
        "Vilka sammanhang skulle du kunna återvända till även om du inte klickar med någon första gången? En liten studiecirkel, en förening för ett särskilt intresse eller ett lugnt volontärpass kan ge samtalet ett ämne och mötet ett tydligt slut. Sätt ett första mål du själv kan påverka. Till exempel att gå två gånger och fråga en person om något ni gör där.",
        "En grupp för vuxna med autism kan vara en möjlighet om du vill träffa andra med liknande erfarenheter. Vissa habiliteringar erbjuder grupper om samspel eller vänskap. Fråga vad som finns där du bor och vilka alternativ som passar om gruppträffar tar mycket energi.",
      ],
      links: [routine, social],
    },
    {
      title: "Bjud in med tid, plats och ett enkelt svar",
      paragraphs: [
        "Om du har pratat med någon ett par gånger kan du föreslå något konkret. ”Jag tänkte gå på bokrean på lördag. Vill du följa med en stund vid elva?” gör det lätt att säga ja, nej eller föreslå en annan tid. Om du vill fortsätta prata om ett gemensamt ämne kan du fråga om det går bra att höra av sig och var personen helst svarar.",
        "Var uppmärksam på hur den andra svarar över tid. Ett sent svar kan ha många förklaringar. Om samma person upprepade gånger tackar nej utan att föreslå någon annan tid kan du lämna utrymme för den att ta nästa initiativ.",
      ],
    },
    {
      title: "Kom överens om hur ni håller kontakten",
      paragraphs: [
        "Det kan kännas lättare att ses regelbundet än att starta förhandlingen varje gång. Berätta vad du uppskattar. ”Jag tycker om våra promenader och är dålig på att komma ihåg att boka. Ska vi ta första söndagen i månaden?” Om långa chattar eller intensiva träffar blir svåra kan du föreslå ett format som ger mer ork över tid.",
        "Vid ett missförstånd kan en kort fråga räcka för att öppna samtalet. ”När jag gick tidigt var jag trött. Jag undrar hur det landade hos dig.” Du får välja vilka vänskaper och vilken mängd kontakt som fungerar för dig.",
      ],
    },
  ],
  related: [relationship, social, routine, adult],
  sources: [
    { href: "https://www.habilitering.se/kurskatalog/hela-kurskatalogen/vanskapsgrupp--for-vuxna-med-autism/", label: "Habilitering & Hälsa om vänskap och gruppstöd för vuxna med autism" },
    { href: "https://www.vardochinsats.se/autism/behandling-och-stoed/insatser-vid-diagnostiserad-autism-vuxna/", label: "Nationella vård- och insatsprogrammet om stöd till vuxna med autism" },
    autism,
  ],
  faqs: [
    { question: "Hur lär jag känna någon om småprat är svårt?", answer: "Ses i ett sammanhang där ni redan gör något tillsammans. Ställ en fråga om aktiviteten eller bygg vidare på något som kom upp förra gången." },
    { question: "Hur säger jag att jag vill ses fast jag ofta behöver vila?", answer: "Föreslå en träff med tydlig längd och tid. Berätta vad du tycker om med att ses och vad som gör det lättare för dig att orka." },
  ],
});
