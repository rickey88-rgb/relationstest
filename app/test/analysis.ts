import { domainCopy, domains, questions, type Domain, type Profile } from "./screening";

type Connection = { id: string; overview: string; text: string };
type Pair = Connection & { domains: [Domain, Domain] };
const pairs: Pair[] = [
  { id: "control-monitoring", domains: ["control_autonomy", "isolation_monitoring"], overview: "Egna val och privatliv berörs samtidigt i dina svar. Det kan vara hjälpsamt att se begränsningar och krav på insyn som delar av ett gemensamt mönster.", text: "Kontroll och övervakning förekommer tillsammans i dina svar. Du beskriver både begränsningar av egna val och krav på insyn. När de mönstren sammanfaller kan privatliv och självständighet påverkas samtidigt." },
  { id: "control-gaslighting", domains: ["control_autonomy", "gaslighting_reality"], overview: "Dina svar förenar begränsat utrymme för egna val med tvivel på din egen upplevelse. Då kan både vad du får göra och hur du tolkar situationen behöva få mer utrymme.", text: "Du rapporterar kontroll samtidigt som din upplevelse ifrågasätts. Om du behöver försvara både dina val och ditt minne kan det bli svårare att formulera vilka krav som känns rimliga. Sambandet i svaren är en anledning att titta på konkreta situationer, utan att anta att allt har samma orsak." },
  { id: "control-degradation", domains: ["control_autonomy", "degradation_manipulation"], overview: "Kontroll och nedvärdering märks tillsammans. Analysen handlar därför både om ditt handlingsutrymme och om hur du blir bemött när dina behov skiljer sig från partnerns.", text: "Begränsningar av egna val förekommer tillsammans med skuld eller nedvärdering i dina svar. Krav kan bli svårare att värja sig mot om ett eget beslut samtidigt följs av kritik. Lägg märke till om samma situationer återkommer i båda områdena." },
  { id: "gaslighting-degradation", domains: ["gaslighting_reality", "degradation_manipulation"], overview: "Ifrågasättanden och skuldbeläggning förekommer sida vid sida. Det kan vara viktigt att skilja frågan om vad som hände från frågan om vem som förväntas bära ansvaret.", text: "Dina svar berör både tvivel på den egna upplevelsen och nedvärdering. Ett samtal kan då komma att handla om dina reaktioner i stället för den händelse du försökte ta upp. Undersök om det är så i de situationer du tänkte på när du svarade." },
  { id: "fear-control", domains: ["threats_fear_punishment", "control_autonomy"], overview: "Kontroll förekommer tillsammans med hot, rädsla eller bestraffning i dina svar. Utrymmet för egna beslut behöver då förstås också utifrån vilka reaktioner du försöker undvika.", text: "Du rapporterar både begränsningar och hot, rädsla eller bestraffning. Det kan göra anpassning till ett sätt att hantera en svår situation, snarare än ett uttryck för vad du själv vill. Ta hjälp att sortera detta utan att utsätta dig för en ny reaktion." },
  { id: "trauma-degradation", domains: ["trauma_bond_patterns", "degradation_manipulation"], overview: "Starka band och sårande bemötande märks samtidigt. För att förstå helheten kan det vara mer hjälpsamt att följa mönstret över tid än att bara utgå från den senaste försoningen.", text: "Nedvärdering och stark bindning trots sårande perioder förekommer tillsammans i dina svar. Värme efter en konflikt kan ge lättnad samtidigt som det tidigare beteendet fortfarande påverkar dig. Jämför därför försoningen med vad som faktiskt förändras i vardagen efteråt." },
  { id: "trauma-fear", domains: ["trauma_bond_patterns", "threats_fear_punishment"], overview: "Dina svar rymmer både stark bindning och hot, rädsla eller bestraffning. Att längta efter närhet och samtidigt behöva stöd i en svår situation är upplevelser som kan finnas parallellt.", text: "Bindning trots sårande mönster förekommer tillsammans med hot, rädsla eller bestraffning. Lättnad när en svår period upphör säger inte i sig vad som har förändrats. Stöd utanför relationen kan ge utrymme att förstå både banden och det som gör ont." },
  { id: "overresponsibility-control", domains: ["overresponsibility_self_erasure", "control_autonomy"], overview: "Överansvar och kontroll märks tillsammans. Det kan vara värt att skilja det du väljer av omtanke från det du gör för att få vardagen att fungera under andras krav.", text: "Du beskriver både begränsningar av egna val och att dina behov får stå tillbaka. Anpassningen kan behöva förstås i relation till de krav som finns omkring dig. Dina svar gör dig inte ansvarig för partnerns beteende." },
  { id: "overresponsibility-degradation", domains: ["overresponsibility_self_erasure", "degradation_manipulation"], overview: "Överansvar förekommer tillsammans med skuld eller nedvärdering. Analysen behöver därför ge plats åt dina behov, inte bara åt hur du försöker hantera partnerns reaktioner.", text: "Att bära partnerns känslor och samtidigt möta skuldbeläggning kan göra det svårt att se var det egna ansvaret slutar. I dina svar finns båda områdena. Fundera på vilka uppgifter du har tagit på dig och vilka som egentligen hör till den andra personen." },
];

const steps: Record<Domain, string> = {
  control_autonomy: "Välj en redan inträffad situation där du ville fatta ett eget beslut. Vad ville du, vad hände och vilket utrymme fick ditt val? Utgå från minnet; du behöver inte skapa en ny situation för att pröva reaktionen.",
  gaslighting_reality: "Om det är tryggt att göra det, skriv för egen klarhet ner en konkret händelse: vad du minns, vad du kände och vad ni tolkar olika. Förvara anteckningen så att du själv råder över den.",
  degradation_manipulation: "Titta tillbaka på ett samtal där du tog upp något som gjorde ont. Skilj på ditt ansvar för dina handlingar och partnerns ansvar för sitt bemötande.",
  isolation_monitoring: "Identifiera en kontakt eller del av ditt privatliv som du saknar. Tänk igenom en trygg kontaktväg innan du återtar kontakt eller ändrar inställningar, särskilt om någon kan se din mobil.",
  threats_fear_punishment: "Välj en betrodd person eller stödverksamhet och en trygg kontaktväg. Berätta om en konkret situation och hur den påverkar vad du vågar säga eller göra.",
  trauma_bond_patterns: "Jämför en försoning med tiden som följde. Vilka konkreta beteenden förändrades, hur länge höll det i sig och vilka behov blev fortfarande inte mötta?",
  overresponsibility_self_erasure: "Sätt ord på ett eget behov som fått vänta. Fundera för dig själv på vad som skulle ge det mer plats och vilket stöd du skulle behöva.",
  attachment_stress: "Lägg märke till vad som händer före oro eller känslomässigt avstånd. Skilj en farhåga från ett konkret beteende hos partnern och beskriv vilket behov som blir tydligt för dig.",
};
const opening: Record<Domain, string> = {
  control_autonomy: "Du beskriver situationer där partnerns krav eller beslut påverkar det du känner att du kan välja själv.",
  gaslighting_reality: "Dina svar kretsar kring vad som händer med tilliten till din upplevelse när ni pratar om sådant som har hänt.",
  degradation_manipulation: "Bemötandet när något skaver framträder i svaren, särskilt utrymmet för respekt och eget ansvar.",
  isolation_monitoring: "Kontakten med andra och möjligheten till privatliv är centrala i den bild du har lämnat.",
  threats_fear_punishment: "Reaktioner och konsekvenser i relationen tar plats i svaren och kan påverka hur fritt du känner att du kan agera.",
  trauma_bond_patterns: "Svaren beskriver banden till relationen samtidigt som återkommande perioder gör ont. Båda delarna behöver få plats när du ser på helheten.",
  overresponsibility_self_erasure: "Hur mycket ansvar du bär och hur lite plats som blir kvar för egna behov framträder särskilt.",
  attachment_stress: "Dina reaktioner på närhet och känslomässigt avstånd framträder särskilt. Det är värt att utforska vad du behöver för att känna trygghet och kontakt.",
};
const reflection: Record<Domain, string> = {
  control_autonomy: "Vilket eget val tänkte du på när du svarade, och hur påverkades det?",
  gaslighting_reality: "Vad var du säker på före samtalet och vad började du tvivla på efteråt?",
  degradation_manipulation: "Fick det du ville ta upp utrymme, eller hamnade fokus på att du behövde försvara dig?",
  isolation_monitoring: "Vilket privat utrymme eller vilken kontakt har blivit svårare att behålla?",
  threats_fear_punishment: "Vem skulle kunna lyssna och hjälpa dig att förstå den här situationen från en trygg plats?",
  trauma_bond_patterns: "Vad förändrades i vardagen efter den varma perioden, och vad återkom?",
  overresponsibility_self_erasure: "Vilket eget behov saknade utrymme i den situation du tänkte på?",
  attachment_stress: "Vad hände precis före oron eller avståndet, och vilken kontakt hade du behövt?",
};
const lowAbuse = (p: Profile) => ["control_autonomy", "gaslighting_reality", "degradation_manipulation", "isolation_monitoring", "threats_fear_punishment"].every(d => p.scores[d as Domain] < 25) && !p.safety;

export function resultAnalysis(profile: Profile, answers: number[]) {
  const { scores, ranked, safety } = profile;
  const zero = ranked.every(d => scores[d] === 0);
  const top = ranked[0];
  const focus = ranked.filter(d => scores[d] >= 25).slice(0, 3);
  const connections: Connection[] = pairs.filter(pair => pair.domains.every(d => scores[d] >= 45 && focus.includes(d)))
    .sort((a, b) => b.domains.reduce((sum,d) => sum + scores[d],0) - a.domains.reduce((sum,d) => sum + scores[d],0));
  if (scores.attachment_stress >= 45 && lowAbuse(profile)) connections.unshift({ id: "attachment-low-control", overview: "Stress kring närhet och avstånd framträder utan motsvarande signaler om kontroll eller nedvärdering. Det gör frågor om trygghet, behov och känslomässig kontakt särskilt relevanta här.", text: "Du rapporterar relativt lite kontroll, nedvärdering eller rädsla, men mer stress kring närhet och avstånd. Utifrån just den här profilen kan det vara mer relevant att undersöka relations- och anknytningsmönster än att tolka svaren som ett generellt kontrollmönster." });
  const selected = connections.slice(0,3);
  if (!selected.length) selected.push(zero
    ? { id: "zero", overview: "", text: "Ingen av de efterfrågade upplevelserna finns rapporterad i dina svar. Därför pekar analysen inte ut något samband mellan destruktiva mönster. Det finns ändå utrymme att fundera över behov eller situationer som frågorna inte tog upp." }
    : { id: "fallback", overview: "", text: focus.length >= 2
      ? `Både ${domainCopy[focus[0]].label.toLowerCase()} och ${domainCopy[focus[1]].label.toLowerCase()} märks i svaren. Jämför de situationer du tänkte på: sammanfaller upplevelserna, eller handlar de om olika delar av relationen? Svaren ensamma visar inte att det ena orsakar det andra.`
      : `Svaren är mest framträdande inom ${domainCopy[top].label.toLowerCase()}. Det finns inte lika starkt stöd i profilen för ett bredare samband mellan flera områden. Börja därför med en konkret upplevelse i det området.` });
  const paragraphs = zero ? [
    "Du har inte rapporterat några av de beteenden eller upplevelser som screeningen frågar om. Analysen pekar därför inte ut något destruktivt mönster i dina 42 svar.",
    "Fundera på vad som ändå fick dig att göra testet. Det kan handla om ett behov, en enskild händelse eller en fråga som inte fanns med. Sätt också ord på det som du upplever fungerar, som egna val, privatliv och att kunna säga nej utan rädsla.",
  ] : [
    scores[top] >= 45
      ? `Det tydligaste området i dina svar är ${domainCopy[top].label.toLowerCase()}. ${opening[top]}`
      : `Det område som märks mest är ${domainCopy[top].label.toLowerCase()}, men det ligger under gränsen för förhöjda signaler. Dina svar ger anledning att stanna vid en konkret upplevelse, utan att göra den till en beskrivning av hela relationen.`,
    selected[0].overview || (focus.length > 1
      ? `Även ${focus.slice(1).map(d => domainCopy[d].label.toLowerCase()).join(" och ")} finns med i bilden. Det kan vara hjälpsamt att skilja på vad som återkommer över tid och vad som hör till en enstaka situation.`
      : "Det är mer användbart att utgå från vad som faktiskt hände och hur det påverkade dig än att söka en enda etikett. Observationerna nedan knyter analysen till ett svar du själv har lämnat."),
  ];
  const covered = connections.length ? pairs.find(p => p.id === selected[0].id)?.domains ?? [top] : [top, ...focus.slice(1)];
  const third = focus.find(d => d !== top && !covered.includes(d));
  if (!zero && third) paragraphs.push(`I bilden finns också ${domainCopy[third].label.toLowerCase()}. Se om den upplevelsen uppstår i samma situationer eller behöver eget utrymme när du funderar vidare.`);
  if (safety) paragraphs.push("Ett enskilt svar om hot eller stark rädsla behöver också få plats i helhetsbilden, även om ett områdesgenomsnitt är lågt. Nästa steg här utgår därför från stöd och egen klarhet, inte från att pröva partnerns reaktion.");

  const observationDomains = [...profile.highlights];
  if (!zero && !observationDomains.length) observationDomains.push(top);
  const observations = observationDomains.slice(0,3).map(domain => {
    const markers = questions.map((q,i) => ({...q,value:answers[i]})).filter(q => q.domain === domain);
    const severe = safety && domain === "threats_fear_punishment" ? markers.filter(q => (["threats_fear_punishment_1","threats_fear_punishment_2","threats_fear_punishment_5"].includes(q.id) && q.value >= 1) || (q.id === "threats_fear_punishment_6" && q.value >= 3)) : [];
    const marker = (severe.length ? severe : markers).sort((a,b) => b.value - a.value)[0];
    return { domain, heading: domainCopy[domain].heading, text: scores[domain] < 25
      ? "Här finns ett konkret svar att stanna vid, även om området som helhet har få signaler. Utgå från den situation du tänkte på och vilken betydelse den har för dig."
      : domainCopy[domain].explanation, marker, reflection: reflection[domain], guide: domainCopy[domain].guide, guideLabel: domainCopy[domain].guideLabel };
  });
  const nextSteps = zero ? ["Fundera på vad som fick dig att söka testet. Formulera den frågan eller det behovet med egna ord.", "Sätt ord på vad som fungerar i relationen och vad du vill bevara: egna val, privatliv, ömsesidighet eller utrymme för olika åsikter."] : [
    ...(safety ? [steps.threats_fear_punishment] : []),
    ...ranked.filter(d => scores[d] > 0 && (!safety || d !== "threats_fear_punishment")).slice(0, safety ? 2 : 3).map(d => steps[d]),
  ];
  if (nextSteps.length < 2) nextSteps.push("Välj den observation som känns mest relevant och formulera vad du skulle vilja förstå bättre. Du behöver inte reda ut allt på en gång.");
  return { zero, paragraphs: paragraphs.slice(0,4), connections: selected, observations, nextSteps: nextSteps.slice(0,4) };
}
