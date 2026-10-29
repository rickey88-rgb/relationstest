// Frozen original inline questions/texts/useMemo bodies; regression reference only.
export type Area =
  | "denial"
  | "memory"
  | "minimization"
  | "blame"
  | "realityShift"
  | "selfDoubt";

export type Question = {
  text: string;
  area: Area;
};

export const questions: Question[] = [
  // FÖRNEKANDE AV HÄNDELSER
  {
    area: "denial",
    text: "Min partner förnekar ibland att hen sagt något som jag tydligt minns att hen sagt.",
  },
  {
    area: "denial",
    text: "Min partner hävdar ibland att en händelse aldrig inträffade trots att jag upplevde den tydligt.",
  },
  {
    area: "denial",
    text: "När jag tar upp något som sårat mig får jag ibland höra att det jag beskriver inte hände på det sättet.",
  },
  {
    area: "denial",
    text: "Min partner kan förneka tidigare löften, överenskommelser eller uttalanden när jag senare hänvisar till dem.",
  },
  {
    area: "denial",
    text: "Jag har varit med om att min partner bestämt förnekat något även när jag känt mig mycket säker på vad som faktiskt hände.",
  },

  // IFRÅGASÄTTANDE AV MINNE & PERCEPTION
  {
    area: "memory",
    text: "Min partner säger återkommande att jag minns saker fel när vi inte är överens om vad som hänt.",
  },
  {
    area: "memory",
    text: "Jag får ibland höra att jag har missförstått en situation som jag själv upplevde som tydlig.",
  },
  {
    area: "memory",
    text: "Min partner får mig ibland att känna att mitt minne är mindre pålitligt än hens.",
  },
  {
    area: "memory",
    text: "När våra versioner skiljer sig åt framställs min partners version ofta som självklar och min som felaktig.",
  },
  {
    area: "memory",
    text: "Min partner använder ibland påståenden om att jag är glömsk, förvirrad eller missuppfattar saker för att avfärda min version.",
  },

  // FÖRMINSKNING AV KÄNSLOR & REAKTIONER
  {
    area: "minimization",
    text: "När jag blir ledsen eller upprörd över något min partner gjort får jag ofta höra att jag överdriver.",
  },
  {
    area: "minimization",
    text: "Min partner beskriver ibland mina reaktioner som orimliga istället för att bemöta det jag reagerar på.",
  },
  {
    area: "minimization",
    text: "Jag får ofta höra att jag är för känslig när jag tar upp något som gjort mig illa.",
  },
  {
    area: "minimization",
    text: "När jag försöker prata om ett problem flyttas fokus ofta från partnerns beteende till hur starkt jag reagerar.",
  },
  {
    area: "minimization",
    text: "Min partner får ibland mina känslor att framstå som bevis på att det är jag som är problemet.",
  },

  // SKULDVÄNDNING
  {
    area: "blame",
    text: "När jag tar upp något min partner gjort slutar samtalet ofta med att jag själv får skulden.",
  },
  {
    area: "blame",
    text: "Min partner förklarar ibland sitt eget sårande beteende med att jag provocerade fram det.",
  },
  {
    area: "blame",
    text: "Jag går ibland in i ett samtal för att ta upp något som hänt men lämnar samtalet med känslan att jag måste försvara mig själv.",
  },
  {
    area: "blame",
    text: "Min partner vänder ofta konflikter så att mina misstag blir viktigare än det beteende jag försökte ta upp.",
  },
  {
    area: "blame",
    text: "Jag får ibland höra att partnerns beteende egentligen är en konsekvens av hur jag själv är eller beter mig.",
  },

  // MOTSÄGELSER & VERKLIGHETSFÖRSKJUTNING
  {
    area: "realityShift",
    text: "Min partners förklaring till samma händelse kan förändras när tidigare detaljer inte längre passar.",
  },
  {
    area: "realityShift",
    text: "När jag påpekar en motsägelse får jag ibland en ny förklaring som gör att jag börjar tvivla på om jag förstått situationen rätt.",
  },
  {
    area: "realityShift",
    text: "Min partner kan med stor säkerhet beskriva händelser på ett sätt som skiljer sig mycket från hur jag själv upplevde dem.",
  },
  {
    area: "realityShift",
    text: "Jag upplever ibland att reglerna för vad som anses sant eller rimligt förändras beroende på vad som passar min partner i stunden.",
  },
  {
    area: "realityShift",
    text: "När jag försöker reda ut motsägelser blir situationen ibland mer förvirrande istället för tydligare.",
  },

  // FÖRLUST AV TILLIT TILL EGET OMDÖME
  {
    area: "selfDoubt",
    text: "Jag har börjat tvivla mer på mitt eget minne sedan jag varit i relationen.",
  },
  {
    area: "selfDoubt",
    text: "Jag kontrollerar ibland med andra personer om min tolkning av en situation verkligen är rimlig.",
  },
  {
    area: "selfDoubt",
    text: "Jag känner mig ibland osäker på vad som faktiskt hänt efter en konflikt med min partner.",
  },
  {
    area: "selfDoubt",
    text: "Jag har blivit mindre säker på mitt eget omdöme i frågor som rör relationen.",
  },
  {
    area: "selfDoubt",
    text: "Jag kan ibland tänka att jag kanske överdriver eller hittar på problem trots att något först kändes tydligt fel.",
  },
];

export const answerLabels = [
  "Aldrig",
  "Sällan",
  "Ibland",
  "Ofta",
  "Mycket ofta",
];

export const areaLabels: Record<Area, string> = {
  denial: "Förnekande av händelser",
  memory: "Ifrågasättande av minne & perception",
  minimization: "Förminskning av känslor & reaktioner",
  blame: "Skuldvändning",
  realityShift: "Motsägelser & verklighetsförskjutning",
  selfDoubt: "Förlust av tillit till eget omdöme",
};

export const areaDescriptions: Record<Area, string> = {
  denial:
    "Visar hur ofta sådant du upplevt, hört eller kommit överens om senare förnekas eller avfärdas.",
  memory:
    "Visar i vilken grad din förmåga att minnas och tolka situationer återkommande ifrågasätts.",
  minimization:
    "Visar om fokus ofta flyttas från det som hänt till att dina känslor eller reaktioner framställs som problemet.",
  blame:
    "Visar hur ofta ansvar för partnerns beteende eller konflikter flyttas över på dig.",
  realityShift:
    "Visar om versioner, förklaringar eller regler förändras på sätt som gör situationer svårare att förstå och hålla fast vid.",
  selfDoubt:
    "Visar hur mycket relationen verkar ha påverkat tilliten till ditt eget minne, omdöme och din tolkning av vad som händer.",
};

export const LS_KEY = "gaslightingtest_state_v1";

export const CHECKOUT_URL: string = "https://buy.stripe.com/14A4gyb97bYBfkX7UQ0gw0l";

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function level(score: number) {
  if (score >= 75) return "Omfattande";
  if (score >= 50) return "Tydligt";
  if (score >= 25) return "Vissa tecken";
  return "Få tecken";
}

export function overallTitle(score: number) {
  if (score >= 75) return "Omfattande gaslightingmönster";
  if (score >= 50) return "Många tydliga gaslightingmönster";
  if (score >= 25) return "Vissa gaslightingmönster";
  return "Få tecken på gaslighting";
}

export function overallDescription(score: number) {
  if (score >= 75) {
    return "Dina svar visar ett omfattande återkommande mönster där händelser, minnen, känslor eller ansvar ofta verkar omtolkas på ett sätt som kan undergräva tilliten till din egen upplevelse och ditt eget omdöme.";
  }

  if (score >= 50) {
    return "Dina svar visar många tydliga mönster som är förenliga med gaslighting i en nära relation. Det verkar återkommande finnas situationer där din upplevelse, ditt minne eller dina reaktioner ifrågasätts eller omtolkas.";
  }

  if (score >= 25) {
    return "Dina svar visar vissa mönster som kan förekomma vid gaslighting. Enstaka meningsskiljaktigheter eller olika minnesbilder är normala, så det viktiga är om beteendena återkommer och gradvis påverkar tilliten till din egen upplevelse.";
  }

  return "Dina svar visar relativt få av de återkommande mönster som testet undersöker. Att två personer ibland minns eller tolkar en situation olika är i sig inte gaslighting.";
}

export function areaGuidance(area: Area, score: number) {
  const elevated = score >= 50;

  const guidance: Record<Area, string> = {
    denial: elevated
      ? "Dina svar tyder på att saker du upplevt eller hört relativt ofta förnekas i efterhand. Lägg särskilt märke till om detta sker som ett återkommande mönster snarare än som enstaka genuina minnesskillnader."
      : "Dina svar visar relativt få återkommande situationer där tydliga händelser eller uttalanden förnekas i efterhand.",

    memory: elevated
      ? "Din förmåga att minnas och tolka situationer verkar ofta ifrågasättas. Det kan bli särskilt problematiskt om partnerns version systematiskt behandlas som mer trovärdig än din utan sakliga skäl."
      : "Dina svar tyder inte på att ditt minne eller din verklighetsuppfattning regelbundet undergrävs i relationen.",

    minimization: elevated
      ? "När du reagerar på något verkar fokus ofta flyttas från det som hände till att din reaktion är för stark, känslig eller orimlig. Det kan göra det svårare att diskutera själva beteendet som utlöste reaktionen."
      : "Dina känslor och reaktioner verkar relativt sällan användas för att avfärda själva problemet du försöker ta upp.",

    blame: elevated
      ? "Konflikter verkar ofta vändas så att du själv hamnar i försvarsposition. Observera om ansvar för partnerns egna val återkommande flyttas över på dig."
      : "Dina svar visar relativt få tecken på ett återkommande mönster där partnerns ansvar flyttas över på dig.",

    realityShift: elevated
      ? "Du verkar ofta möta förändrade versioner, motsägelser eller nya förklaringar som gör det svårt att hålla fast vid vad som ursprungligen hände. Återkommande förvirring efter samtal kan vara viktig att uppmärksamma."
      : "Dina svar visar relativt få återkommande situationer där verklighetsbilden förändras eller blir mer förvirrande under samtal.",

    selfDoubt: elevated
      ? "Relationen verkar ha påverkat tilliten till ditt eget minne eller omdöme. Att börja behöva kontrollera sin verklighetsuppfattning med andra eller systematiskt tvivla på sig själv är en viktig signal att ta på allvar."
      : "Dina svar tyder på att du i relativt hög grad behåller tilliten till ditt eget minne, omdöme och din upplevelse av relationen.",
  };

  return guidance[area];
}

export function calculateScores(answers: number[]) {
const totalQuestions = questions.length;

    const raw = {} as Record<Area, number>;
    const maximum = {} as Record<Area, number>;

    (Object.keys(areaLabels) as Area[]).forEach((area) => {
      raw[area] = 0;
      maximum[area] = 0;
    });

    questions.forEach((question, questionIndex) => {
      maximum[question.area] += 4;

      const answer = answers[questionIndex];

      if (answer >= 0) {
        raw[question.area] += answer;
      }
    });

    const areas = {} as Record<Area, number>;

    (Object.keys(areaLabels) as Area[]).forEach((area) => {
      areas[area] =
        maximum[area] > 0
          ? Math.round((raw[area] / maximum[area]) * 100)
          : 0;
    });

    const overall = Math.round(
      (answers.reduce(
        (sum, answer) => sum + (answer >= 0 ? answer : 0),
        0
      ) /
        (totalQuestions * 4)) *
        100
    );

    return {
      areas,
      overall,
    };
  
}
export function sortScores(scores: ReturnType<typeof calculateScores>) {
    return (Object.keys(scores.areas) as Area[])
      .map((area) => ({
        area,
        score: scores.areas[area],
      }))
      .sort((a, b) => b.score - a.score);
  }
export function calculate(answers: number[]) {
 const scores = calculateScores(answers); const sortedAreas = sortScores(scores);
 return { scores, sortedAreas };
}
export type Result = ReturnType<typeof calculate>;
