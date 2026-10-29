export type Area =
  | "accusations"
  | "degrading"
  | "humiliation"
  | "threats"
  | "coercion"
  | "surveillance"
  | "pattern"
  | "impact";

export type Question = {
  id: number;
  area: Area;
  text: string;
};

export type AreaInfo = {
  label: string;
  short: string;
  legal: boolean;
  explanation: string;
};

export const LS_KEY = "psykiskt_vald_test_state_v1";

export const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/cNifZg0ut9Qt0q3grm0gw0i";

export const answerLabels = [
  "Aldrig",
  "Sällan",
  "Ibland",
  "Ofta",
  "Mycket ofta",
];

export const areaInfo: Record<Area, AreaInfo> = {
  accusations: {
    label: "Beskyllningar & skuldbeläggning",
    short: "beskyllningar",
    legal: true,
    explanation:
      "Återkommande beskyllningar kan användas för att sätta dig i försvarsställning och förskjuta ansvar. Beskyllning är uttryckligen en av de former av kränkningar som nämns i bestämmelsen om psykiskt våld.",
  },

  degrading: {
    label: "Nedsättande uttalanden",
    short: "nedvärdering",
    legal: true,
    explanation:
      "Nedsättande uttalanden kan gradvis påverka självbild och självkänsla. Det kan handla om återkommande kommentarer om exempelvis intelligens, värde, utseende, kompetens eller personlighet.",
  },

  humiliation: {
    label: "Förödmjukande beteende",
    short: "förödmjukelse",
    legal: true,
    explanation:
      "Förödmjukande beteende kan ske både privat och inför andra. Det viktiga är inte bara en enstaka händelse utan om beteendet bildar ett återkommande mönster som bryter ner eller förminskar.",
  },

  threats: {
    label: "Hot & skrämsel",
    short: "hot och skrämsel",
    legal: true,
    explanation:
      "Otillbörliga hot är en av de beteendeformer som anges i lagen. Hot behöver inte alltid uttryckas som ett direkt hot om fysiskt våld för att påverka hur någon vågar agera.",
  },

  coercion: {
    label: "Tvång & kontroll",
    short: "tvång och kontroll",
    legal: true,
    explanation:
      "Otillbörligt tvång handlar om att pressa någon att göra, tåla eller avstå från något på ett sätt som begränsar personens faktiska handlingsutrymme.",
  },

  surveillance: {
    label: "Övervakning & digital kontroll",
    short: "övervakning",
    legal: true,
    explanation:
      "Otillbörlig övervakning omfattas uttryckligen av bestämmelsen. Lagen innehåller dessutom en särskild reglering om varaktig otillbörlig övervakning.",
  },

  pattern: {
    label: "Upprepning & varaktighet",
    short: "upprepning",
    legal: false,
    explanation:
      "Lagens konstruktion är inriktad på upprepade kränkningar. Därför är frekvens, varaktighet och om olika beteenden bildar ett sammanhängande mönster centrala delar av orienteringen.",
  },

  impact: {
    label: "Påverkan på självkänsla & frihet",
    short: "påverkan på dig",
    legal: false,
    explanation:
      "Bestämmelsen kräver att kränkningarna sammantaget varit ägnade att allvarligt skada personens självkänsla. Din faktiska upplevelse avgör inte ensam den juridiska frågan, men påverkan är viktig för att förstå relationens konsekvenser.",
  },
};

export const weights: Record<Area, number> = {
  accusations: 1.0,
  degrading: 1.0,
  humiliation: 1.05,
  threats: 1.15,
  coercion: 1.1,
  surveillance: 1.1,
  pattern: 1.2,
  impact: 1.15,
};

export const questions: Question[] = [
  // Beskyllningar
  {
    id: 1,
    area: "accusations",
    text: "Blir du återkommande beskylld för saker du inte tycker att du har gjort?",
  },
  {
    id: 2,
    area: "accusations",
    text: "Får du ofta skulden för konflikter eller problem, även när ansvaret egentligen är gemensamt?",
  },
  {
    id: 3,
    area: "accusations",
    text: "Behöver du ofta försvara dig mot misstankar, anklagelser eller påståenden om dina avsikter?",
  },

  // Nedsättande uttalanden
  {
    id: 4,
    area: "degrading",
    text: "Blir du kallad dum, värdelös, känslig, galen eller andra saker som förminskar dig?",
  },
  {
    id: 5,
    area: "degrading",
    text: "Kommenterar personen återkommande ditt utseende, din intelligens eller din förmåga på ett nedvärderande sätt?",
  },
  {
    id: 6,
    area: "degrading",
    text: "Får du höra att ingen annan skulle stå ut med dig eller vilja vara med dig?",
  },
  {
    id: 7,
    area: "degrading",
    text: "Avfärdas dina känslor genom kommentarer som att du överdriver, är för känslig eller inte klarar någonting?",
  },

  // Förödmjukande beteende
  {
    id: 8,
    area: "humiliation",
    text: "Har personen gjort sig lustig över dig eller förödmjukat dig inför andra?",
  },
  {
    id: 9,
    area: "humiliation",
    text: "Används sådant som personen vet att du skäms över eller är sårbar för för att trycka ner dig?",
  },
  {
    id: 10,
    area: "humiliation",
    text: "Har personen medvetet fått dig att känna dig liten, löjlig eller ovärdig under konflikter?",
  },

  // Hot
  {
    id: 11,
    area: "threats",
    text: "Har personen hotat med konsekvenser om du inte gör som hen vill?",
  },
  {
    id: 12,
    area: "threats",
    text: "Har personen hotat att skada dig, sig själv, någon annan eller något du bryr dig om för att påverka dig?",
  },
  {
    id: 13,
    area: "threats",
    text: "Har personen hotat att förstöra ditt rykte, avslöja privata saker eller skapa problem för dig?",
  },
  {
    id: 14,
    area: "threats",
    text: "Anpassar du ibland vad du säger eller gör eftersom du är rädd för personens reaktion?",
  },

  // Tvång
  {
    id: 15,
    area: "coercion",
    text: "Pressas du att göra saker du egentligen inte vill göra för att undvika konflikt eller konsekvenser?",
  },
  {
    id: 16,
    area: "coercion",
    text: "Försöker personen bestämma vilka du får träffa, prata med eller ha kontakt med?",
  },
  {
    id: 17,
    area: "coercion",
    text: "Försöker personen styra dina pengar, ditt arbete, dina studier, kläder eller andra personliga val?",
  },
  {
    id: 18,
    area: "coercion",
    text: "Känner du att ett nej från dig ofta leder till så mycket press, skuld eller konflikt att du till slut ger efter?",
  },

  // Övervakning
  {
    id: 19,
    area: "surveillance",
    text: "Kontrollerar personen din mobil, dina meddelanden eller dina sociala medier utan att du egentligen vill det?",
  },
  {
    id: 20,
    area: "surveillance",
    text: "Kräver personen att få veta exakt var du är, vem du är med eller vad du gör?",
  },
  {
    id: 21,
    area: "surveillance",
    text: "Känner du dig tvungen att dela lösenord, platsinformation eller annan privat information för att undvika misstankar eller konflikt?",
  },
  {
    id: 22,
    area: "surveillance",
    text: "Har personen använt teknik, appar, konton eller andra människor för att hålla koll på dig?",
  },

  // Upprepning
  {
    id: 23,
    area: "pattern",
    text: "Har flera av de här beteendena återkommit under en längre period snarare än bara vid en enstaka konflikt?",
  },
  {
    id: 24,
    area: "pattern",
    text: "Kommer samma typer av kränkningar eller kontrollerande beteenden tillbaka även efter ursäkter eller löften om förändring?",
  },
  {
    id: 25,
    area: "pattern",
    text: "Upplever du att olika beteenden tillsammans bildar ett återkommande mönster där personen får mer kontroll och du får mindre utrymme?",
  },

  // Påverkan
  {
    id: 26,
    area: "impact",
    text: "Har du börjat tvivla mer på ditt eget omdöme eller din egen verklighetsuppfattning?",
  },
  {
    id: 27,
    area: "impact",
    text: "Har din självkänsla blivit sämre under relationen?",
  },
  {
    id: 28,
    area: "impact",
    text: "Känner du att du måste väga dina ord eller gå på äggskal för att hålla situationen lugn?",
  },
  {
    id: 29,
    area: "impact",
    text: "Har du blivit mindre fri att uttrycka behov, åsikter eller fatta egna beslut?",
  },
  {
    id: 30,
    area: "impact",
    text: "Känner du dig mindre som dig själv än du gjorde tidigare i relationen?",
  },
];

export const areaOrder: Area[] = [
  "accusations",
  "degrading",
  "humiliation",
  "threats",
  "coercion",
  "surveillance",
  "pattern",
  "impact",
];

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function percentFromArea(
  area: Area,
  answers: number[]
) {
  const indexes = questions
    .map((q, i) => ({ q, i }))
    .filter(({ q }) => q.area === area)
    .map(({ i }) => i);

  if (indexes.length === 0) return 0;

  const sum = indexes.reduce((acc, i) => {
    const answer = answers[i];
    return acc + (answer >= 0 ? answer : 0);
  }, 0);

  return Math.round((sum / (indexes.length * 4)) * 100);
}

export function areaLevel(percent: number) {
  if (percent >= 75) return "Mycket tydligt";
  if (percent >= 50) return "Tydligt";
  if (percent >= 25) return "Vissa tecken";
  return "Få tecken";
}

export function overallLevel(score: number) {
  if (score >= 75) {
    return {
      label: "Omfattande mönster",
      intro:
        "Dina svar visar ett omfattande återkommande mönster av psykiskt destruktiva beteenden.",
    };
  }

  if (score >= 55) {
    return {
      label: "Många tydliga mönster",
      intro:
        "Dina svar visar flera tydliga och återkommande mönster som bör tas på allvar.",
    };
  }

  if (score >= 30) {
    return {
      label: "Vissa tydliga mönster",
      intro:
        "Dina svar visar flera beteenden som kan vara viktiga att titta närmare på.",
    };
  }

  return {
    label: "Få tydliga mönster",
    intro:
      "Dina svar visar relativt få tydliga mönster totalt, även om enskilda områden fortfarande kan vara viktiga.",
  };
}

export function legalOverlapText(
  legalAreasHigh: number,
  patternPercent: number,
  impactPercent: number
) {
  if (
    legalAreasHigh >= 4 &&
    patternPercent >= 50 &&
    impactPercent >= 50
  ) {
    return "Dina svar visar flera återkommande beteendetyper som överlappar med de kategorier som anges i bestämmelsen om psykiskt våld. Upprepningen och påverkan på dig framträder också tydligt.";
  }

  if (legalAreasHigh >= 2 && patternPercent >= 40) {
    return "Dina svar visar flera beteenden som överlappar med kategorier som nämns i bestämmelsen om psykiskt våld, och det finns tecken på ett återkommande mönster.";
  }

  if (legalAreasHigh >= 1) {
    return "Några av dina svar berör beteenden som också förekommer i lagens beskrivning av psykiskt våld. Det räcker inte i sig för att avgöra om den juridiska bestämmelsen är uppfylld.";
  }

  return "Dina svar visar få tydliga träffar inom de beteendekategorier som den nya bestämmelsen särskilt tar sikte på.";
}

export function practicalGuidance(
  overallScore: number,
  threatPercent: number,
  coercionPercent: number,
  surveillancePercent: number
) {
  const urgent =
    threatPercent >= 75 ||
    coercionPercent >= 75 ||
    surveillancePercent >= 75;

  if (urgent) {
    return {
      heading: "Det finns områden som bör tas särskilt på allvar",
      text:
        "Dina svar visar en hög nivå inom minst ett område som rör hot, tvång eller övervakning. Prioritera din trygghet och undvik att utsätta dig för onödig risk för att testa eller konfrontera personen.",
    };
  }

  if (overallScore >= 55) {
    return {
      heading: "Mönstret är tydligt nog att följa upp",
      text:
        "När flera beteenden återkommer samtidigt är det ofta mer informativt att titta på helheten än att försöka avgöra om varje enskild händelse var tillräckligt allvarlig.",
    };
  }

  return {
    heading: "Följ mönstret över tid",
    text:
      "Även när totalnivån inte är hög kan ett specifikt område vara viktigt. Lägg särskilt märke till om beteenden upprepas, eskalerar eller gör att du begränsar dig själv.",
  };
}

export function calculate(answers: number[]) {
const areaScores = (() => {
    const result = {} as Record<Area, number>;

    areaOrder.forEach((area) => {
      result[area] = percentFromArea(
        area,
        answers
      );
    });

    return result;
  })();
const overallScore = (() => {
    let weightedTotal = 0;
    let totalWeight = 0;

    areaOrder.forEach((area) => {
      weightedTotal +=
        areaScores[area] * weights[area];

      totalWeight += weights[area];
    });

    return Math.round(
      weightedTotal / totalWeight
    );
  })();
const overall = overallLevel(overallScore);
const sortedAreas = (() => {
    return areaOrder
      .map((area) => ({
        area,
        score: areaScores[area],
      }))
      .sort((a, b) => b.score - a.score);
  })();
const topAreas = sortedAreas.slice(0, 3);
const legalAreasHigh = (() => {
    return areaOrder.filter(
      (area) =>
        areaInfo[area].legal &&
        areaScores[area] >= 50
    ).length;
  })();
const legalOverlap = legalOverlapText(
        legalAreasHigh,
        areaScores.pattern,
        areaScores.impact
      );
const guidance = practicalGuidance(
        overallScore,
        areaScores.threats,
        areaScores.coercion,
        areaScores.surveillance
      );
return { areaScores, overallScore, overall, sortedAreas, topAreas, legalAreasHigh, legalOverlap, guidance };
}
export type Result = ReturnType<typeof calculate>;
