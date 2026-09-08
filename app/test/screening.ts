// Heuristic screening rules, not validated clinical thresholds.
export const domains = [
  "control_autonomy", "gaslighting_reality", "degradation_manipulation",
  "isolation_monitoring", "threats_fear_punishment", "trauma_bond_patterns",
  "overresponsibility_self_erasure", "attachment_stress",
] as const;
export type Domain = typeof domains[number];
export type Scores = Record<Domain, number>;
export type Question = { id: string; domain: Domain; text: string };

const questionText: Record<Domain, string[]> = {
  control_autonomy: [
    "Min partner försöker bestämma vilka personer jag får träffa.",
    "Jag behöver be om tillåtelse innan jag gör egna planer.",
    "Min partner pressar mig att ändra kläder eller utseende när jag själv vill välja annorlunda.",
    "Min partner försöker bestämma vilka aktiviteter jag får ägna mig åt.",
    "Beslut som berör mig fattas av min partner utan att jag får påverka dem.",
    "Jag måste förklara och försvara varför jag vill gå någonstans på egen hand.",
  ],
  gaslighting_reality: [
    "Min partner förnekar saker som jag minns att hen har sagt eller gjort.",
    "Min partner beskriver om det som hänt så att min upplevelse inte får plats.",
    "Min partner säger att mitt minne inte går att lita på när jag tar upp något som hänt.",
    "När jag berättar att något sårat mig säger min partner att jag överdriver.",
    "Min partner avfärdar mina invändningar med att jag är för känslig.",
    "Efter samtal med min partner tvivlar jag på sådant jag tidigare var säker på att jag upplevt.",
  ],
  degradation_manipulation: [
    "Min partner kallar mig nedsättande saker när vi är oense.",
    "Min partner förlöjligar mig inför andra.",
    "Min partner lägger ansvaret för sitt sårande beteende på mig.",
    "Min partner får mig att känna skuld när jag säger nej till något hen vill.",
    "Min partner kritiserar mig på ett sätt som får mig att känna att jag aldrig duger.",
    "Min partners värme eller uppskattning beror på om jag gör som hen vill.",
  ],
  isolation_monitoring: [
    "Jag träffar vänner eller familj mindre för att undvika min partners reaktioner.",
    "Min partners svartsjuka leder till krav på att jag begränsar mina kontakter.",
    "Min partner går igenom min mobil utan att jag vill det.",
    "Min partner kräver att få läsa mina privata meddelanden.",
    "Min partner pressar mig att lämna ut lösenord till mina konton.",
    "Min partner kräver platsdelning eller uppdateringar för att kontrollera var jag är.",
  ],
  threats_fear_punishment: [
    "Min partner skrämmer mig genom att slå i saker, kasta föremål eller blockera min väg.",
    "Min partner hotar att skada mig eller någon annan.",
    "Min partner vägrar prata med mig tills jag ger efter eller tar tillbaka en gräns.",
    "Min partner hotar att göra slut för att få mig att gå med på ett krav.",
    "Min partner säger att hen ska skada sig själv om jag lämnar eller inte gör som hen vill.",
    "Jag ändrar vad jag säger eller gör eftersom jag är rädd för min partners reaktion.",
  ],
  trauma_bond_patterns: [
    "Relationen växlar mellan stark värme och perioder då jag blir illa behandlad.",
    "Efter en konflikt som gjort mig illa följer en intensiv försoning som gör det svårt att hålla fast vid mina gränser.",
    "Lättnaden när en svår period tar slut känns så stark att det som hände hamnar i bakgrunden.",
    "Jag återvänder till relationen efter att ha försökt lämna på grund av hur jag blivit behandlad.",
    "Jag känner mig oförmögen att skapa avstånd trots att relationen gör mig illa.",
    "Hoppet om att få tillbaka relationens varma perioder får mig att stanna i återkommande sårande situationer.",
  ],
  overresponsibility_self_erasure: [
    "Jag lägger mina egna behov åt sidan för att hålla min partner nöjd.",
    "Jag känner att det är mitt ansvar att lösa min partners känslor.",
    "Jag planerar min vardag för att förebygga konflikter eller dålig stämning mellan oss.",
  ],
  attachment_stress: [
    "Rädsla för att bli lämnad tar mycket plats i mina tankar även när inget tydligt har hänt.",
    "Jag behöver upprepade försäkringar om relationen men har ändå svårt att känna mig lugn.",
    "När känslomässig närhet blir stark drar jag mig undan eller stänger av trots att jag också vill ha kontakt.",
  ],
};

// Interleave domains to avoid presenting named category blocks during the test.
export const questions: Question[] = Array.from({ length: 6 }, (_, i) =>
  domains.flatMap((domain) => questionText[domain][i]
    ? [{ id: `${domain}_${i + 1}`, domain, text: questionText[domain][i] }]
    : [])
).flat();

export const answerLabels = ["Aldrig", "Sällan", "Ibland", "Ofta", "Mycket ofta"];
export const SCREENING_CHECKOUT_URL = "https://buy.stripe.com/aFa7sKcdbe6JdcPeje0gw0c";
// Launch dependency: replace the legacy Payment Link with the verified 79 SEK link.
export const SCREENING_PRICE_SEK = 79;
export const STORAGE_KEY = "relationstest_screening_state_v2";
export const STATE_VERSION = 2;
export const emptyAnswers = () => Array<number>(questions.length).fill(-1);

export const domainCopy: Record<Domain, {
  label: string; heading: string; explanation: string; reflection: string; guide: string; guideLabel: string;
}> = {
  control_autonomy: {
    label: "Kontroll och självständighet", heading: "Utrymmet för egna beslut",
    explanation: "Dina svar tar upp krav kring planer, aktiviteter eller egna val. När du behöver tillstånd eller måste försvara vardagliga beslut kan självständigheten begränsas. Det är skillnad på att ta hänsyn och att inte få välja själv.",
    reflection: "Välj ett vardagsbeslut du vill kunna fatta själv. Vad händer när du väljer annorlunda än partnern önskar? Om du är rädd, ta stöd innan du försöker pröva en ny gräns.",
    guide: "/kontrollerande-relation", guideLabel: "Kontrollerande partner – gränser och tecken",
  },
  gaslighting_reality: {
    label: "Gaslighting och egen upplevelse", heading: "Tilliten till det du upplever",
    explanation: "Dina svar berör förnekanden, avfärdanden eller tvivel efter samtal. Olika minnen är inte automatiskt gaslighting. Ett återkommande mönster där din version aldrig får undersökas kan däremot göra det svårt att orientera sig.",
    reflection: "Utgå från en konkret händelse och skilj mellan vad du minns, vad du kände och vad ni tolkar olika. Kan bådas perspektiv få plats utan att din trovärdighet angrips?",
    guide: "/gaslighting-relation", guideLabel: "Gaslighting – förstå mönstret",
  },
  degradation_manipulation: {
    label: "Nedvärdering och skuldbeläggning", heading: "När ansvar och uppskattning blir villkorade",
    explanation: "Dina svar berör kritik, skuld eller uppskattning som förändras när du säger nej. Att ta ansvar för egna misstag är inte samma sak som att bära ansvaret för partnerns sårande handlingar.",
    reflection: "Tänk på ett samtal där du tog upp något som gjorde ont. Blev det möjligt att prata om beteendet, eller slutade samtalet med att du behövde försvara dig själv?",
    guide: "/manipulativ-partner", guideLabel: "Manipulation och ansvar i relationen",
  },
  isolation_monitoring: {
    label: "Isolering och övervakning", heading: "Ditt privatliv och kontakten med andra",
    explanation: "Dina svar handlar om begränsade kontakter eller insyn i mobil, meddelanden och plats. Frivillig öppenhet behöver kunna omprövas. Krav som gör det svårt att behålla privatliv eller vänner kan minska ditt handlingsutrymme.",
    reflection: "Vilken kontakt eller aktivitet har du börjat avstå från? Om mobilen kan vara övervakad, välj en trygg kontaktväg när du söker stöd och planera tekniska förändringar varsamt.",
    guide: "/digitalt-vald", guideLabel: "Digital kontroll och stöd",
  },
  threats_fear_punishment: {
    label: "Hot, rädsla och bestraffning", heading: "När rädsla påverkar dina val",
    explanation: "Dina svar berör hot, skrämmande reaktioner eller tystnad som press. Även en enskild allvarlig händelse kan behöva stöd, oavsett områdets nivå. Du behöver inte utsätta dig för en ny reaktion för att se om oron är befogad.",
    reflection: "Finns det någon du kan berätta för hur du har det, och en plats där du kan få stöd? Vid akut fara, ring 112. Prioritera säkerhet framför att reda ut relationen i ett hotfullt läge.",
    guide: "/psykiskt-vald/hjalp", guideLabel: "Hjälp vid rädsla och hot",
  },
  trauma_bond_patterns: {
    label: "Bindning trots sårande mönster", heading: "Växlingen mellan smärta och lättnad",
    explanation: "Dina svar tar upp starka band samtidigt som relationen gör ont. Växlingar mellan sårande perioder och intensiv försoning kan göra det svårt att bedöma helheten. Saknad eller stark kärlek i sig betyder inte traumabindning.",
    reflection: "Jämför vad som faktiskt förändras efter en försoning med vad du hoppas ska förändras. Får dina behov plats även mellan de varma perioderna?",
    guide: "/traumabindning-i-relation", guideLabel: "Traumabindning och svårigheten att lämna",
  },
  overresponsibility_self_erasure: {
    label: "Överansvar och egna behov", heading: "Hur mycket plats finns kvar för dig?",
    explanation: "Dina svar berör anpassning, ansvar för partnerns känslor eller att förebygga konflikt. Omsorg kan vara ömsesidig, men ständig beredskap kan lämna lite plats för dina behov. Anpassningen gör dig inte ansvarig för någon annans kontroll.",
    reflection: "Identifiera ett eget behov som fått vänta. Finns det utrymme att uttrycka det utan att du också måste ta hand om partnerns reaktion? Sök stöd om det känns otryggt.",
    guide: "/medberoende", guideLabel: "Medberoende, överansvar och gränser",
  },
  attachment_stress: {
    label: "Stress kring närhet och avstånd", heading: "Oro eller avstånd i känslomässig närhet",
    explanation: "Dina svar handlar om rädsla för att bli lämnad, behov av försäkran eller att dra dig undan. Relationsmiljön kan också påverka hur trygg eller otrygg du känner dig.",
    reflection: "Vad händer strax innan oron eller avståndet ökar? Skilj på en inre farhåga och ett faktiskt beteende i relationen. Anknytningsspråk ska inte användas för att förklara bort hot eller kontroll.",
    guide: "/anknytning", guideLabel: "Anknytning i romantiska relationer",
  },
};

export function band(score: number) {
  if (score >= 65) return "Tydliga signaler";
  if (score >= 45) return "Förhöjda signaler";
  if (score >= 25) return "Vissa signaler";
  return "Få signaler";
}

export function calculate(answers: number[]) {
  const scores = Object.fromEntries(domains.map((domain) => {
    const indices = questions.flatMap((q, i) => q.domain === domain ? [i] : []);
    const total = indices.reduce((sum, i) => sum + Math.max(0, answers[i] ?? -1), 0);
    return [domain, Math.round(total / (indices.length * 4) * 100)];
  })) as Scores;
  const value = (id: string) => answers[questions.findIndex((q) => q.id === id)] ?? -1;
  const selfHarm = value("threats_fear_punishment_5") >= 1;
  const safety = selfHarm || value("threats_fear_punishment_1") >= 1
    || value("threats_fear_punishment_2") >= 1 || value("threats_fear_punishment_6") >= 3;
  const ranked = [...domains].sort((a, b) => scores[b] - scores[a]);
  const elevated = ranked.filter((d) => scores[d] >= 45);
  // Single-item severe signals are prioritized for interpretation, not folded into an inflated score.
  const ordered = safety ? ["threats_fear_punishment" as Domain, ...ranked.filter((d) => d !== "threats_fear_punishment")] : ranked;
  const meaningful = ordered.filter((d) => scores[d] >= 25 || (safety && d === "threats_fear_punishment"));
  const highlights = meaningful.slice(0, 3);
  const narcissisticPattern = scores.control_autonomy >= 45 && scores.degradation_manipulation >= 45
    && value("degradation_manipulation_3") >= 2
    && Math.max(value("degradation_manipulation_4"), value("degradation_manipulation_6")) >= 2;
  return { scores, ranked, elevated, safety, selfHarm, highlights, narcissisticPattern };
}
export type Profile = ReturnType<typeof calculate>;

export type Recommendation = { href: string; title: string; reason: string; rank: number };
export function recommendations(profile: Profile): Recommendation[] {
  const { scores: s } = profile;
  const items: Recommendation[] = [];
  const add = (score: number, href: string, title: string, reason: string) => {
    if (score >= 45) items.push({ href, title, reason, rank: score });
  };
  add(s.gaslighting_reality, "/gaslightingtest/test", "Gaslightingtest", "Fördjupa frågor om förnekanden och tilliten till din egen upplevelse.");
  add(Math.max(s.control_autonomy, s.degradation_manipulation, s.threats_fear_punishment, s.isolation_monitoring), "/psykisk-misshandel-relation/test", "Test om psykisk misshandel och psykiskt våld", "Undersök återkommande kontroll, nedvärdering, övervakning eller hot mer ingående.");
  add(s.trauma_bond_patterns, "/traumabindningtest/test", "Traumabindningstest", "Utforska växlingen mellan starka band och sårande perioder.");
  add(s.overresponsibility_self_erasure, "/medberoendetest/test", "Medberoendetest", "Reflektera vidare över överansvar och utrymmet för dina egna behov.");
  add(s.attachment_stress, "/anknytningstest/test", "Anknytningstest", "Undersök reaktioner på närhet och avstånd mer nyanserat än de tre screeningfrågorna kan göra.");
  if (profile.narcissisticPattern) {
    items.push({ href: "/narcissist-i-en-relation/test", title: "Test om narcissistiska relationsmönster",
      reason: "De här kombinerade mönstren kan också förekomma i narcissistiskt präglade relationer, utan att säga att partnern är narcissist.",
      rank: (s.control_autonomy + s.degradation_manipulation) / 2 });
  }
  return items.sort((a, b) => b.rank - a.rank).slice(0, 2);
}

export type SavedState = { version: number; index: number; answers: number[]; unlocked: boolean };
export function parseState(raw: string | null): SavedState | null {
  try {
    const data = JSON.parse(raw ?? "null");
    if (!data || data.version !== STATE_VERSION || !Array.isArray(data.answers)
      || data.answers.length !== questions.length
      || !data.answers.every((a: unknown) => typeof a === "number" && Number.isInteger(a) && a >= -1 && a <= 4)) return null;
    return { version: STATE_VERSION, answers: data.answers,
      index: Number.isInteger(data.index) ? Math.max(0, Math.min(data.index, questions.length - 1)) : 0,
      unlocked: data.unlocked === true };
  } catch { return null; }
}
