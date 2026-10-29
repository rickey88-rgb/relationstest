// Frozen original inline questions/texts/useMemo bodies; regression reference only.
export type Area =
  | "selfSacrifice"
  | "rescuing"
  | "control"
  | "boundaries"
  | "suppression"
  | "externalFocus";

export type Question = {
  text: string;
  area: Area;
};

export const questions: Question[] = [
  // SJÄLVUPPOFFRING
  {
    area: "selfSacrifice",
    text: "Jag sätter ofta min partners behov före mina egna, även när det går ut över mitt eget mående.",
  },
  {
    area: "selfSacrifice",
    text: "Jag avstår ofta från sådant som är viktigt för mig för att undvika att göra min partner missnöjd.",
  },
  {
    area: "selfSacrifice",
    text: "Jag anpassar ofta mina planer, önskemål eller behov efter min partner utan att förvänta mig samma hänsyn tillbaka.",
  },
  {
    area: "selfSacrifice",
    text: "Jag kan känna mig självisk när jag prioriterar något jag själv behöver framför min partners behov.",
  },
  {
    area: "selfSacrifice",
    text: "Jag fortsätter ofta ge stöd och energi till min partner även när jag själv känner mig helt dränerad.",
  },

  // ÖVERANSVAR & RÄDDANDE
  {
    area: "rescuing",
    text: "Jag känner ofta att det är mitt ansvar att lösa problem som egentligen är min partners.",
  },
  {
    area: "rescuing",
    text: "Jag försöker ofta skydda min partner från konsekvenserna av hens egna beslut eller beteenden.",
  },
  {
    area: "rescuing",
    text: "När min partner mår dåligt känner jag starkt att jag måste få hen att må bättre.",
  },
  {
    area: "rescuing",
    text: "Jag tar ofta över ansvar när min partner inte klarar eller vill hantera något själv.",
  },
  {
    area: "rescuing",
    text: "Jag har svårt att låta min partner hantera sina egna problem när jag tror att jag kan hjälpa eller lösa dem.",
  },

  // KONTROLL & PROBLEMLÖSNING
  {
    area: "control",
    text: "Jag försöker ofta förutse vad som kan gå fel för min partner så att jag kan förhindra det.",
  },
  {
    area: "control",
    text: "Jag känner mig lugnare när jag vet vad min partner gör och hur situationen utvecklas.",
  },
  {
    area: "control",
    text: "Jag lägger mycket energi på att försöka få min partner att fatta bättre beslut.",
  },
  {
    area: "control",
    text: "När min partner gör något jag tror kommer skapa problem har jag svårt att låta bli att ingripa.",
  },
  {
    area: "control",
    text: "Jag känner ofta att relationen eller vardagen skulle falla isär om jag slutade hålla ihop saker.",
  },

  // GRÄNSER & SJÄLVHÄVDELSE
  {
    area: "boundaries",
    text: "Jag har svårt att säga nej till min partner även när jag egentligen inte vill göra det hen ber om.",
  },
  {
    area: "boundaries",
    text: "Jag går ibland med på sådant jag inte är bekväm med för att undvika konflikt eller besvikelse.",
  },
  {
    area: "boundaries",
    text: "Jag har svårt att stå fast vid en gräns när min partner reagerar negativt på den.",
  },
  {
    area: "boundaries",
    text: "Jag håller ibland tillbaka mina egna önskemål eftersom jag är rädd att de ska skapa problem i relationen.",
  },
  {
    area: "boundaries",
    text: "Jag känner ofta ansvar för min partners reaktion när jag uttrycker ett behov eller sätter en gräns.",
  },

  // KÄNSLOMÄSSIG SJÄLVUNDERTRYCKNING
  {
    area: "suppression",
    text: "Jag döljer ofta hur jag egentligen mår för att inte belasta eller störa min partner.",
  },
  {
    area: "suppression",
    text: "Jag tonar ofta ner min egen besvikelse, ilska eller sorg för att hålla relationen lugn.",
  },
  {
    area: "suppression",
    text: "Jag har lättare att fokusera på min partners känslor än att uttrycka mina egna.",
  },
  {
    area: "suppression",
    text: "Jag låtsas ibland att något är okej fast det egentligen gör mig ledsen eller frustrerad.",
  },
  {
    area: "suppression",
    text: "Jag har svårt att visa vissa känslor om jag tror att min partner kommer reagera negativt på dem.",
  },

  // YTTRE FOKUS & RELATIONSBEROENDE SJÄLVVÄRDE
  {
    area: "externalFocus",
    text: "Min partners humör påverkar ofta mitt eget mående väldigt starkt.",
  },
  {
    area: "externalFocus",
    text: "Jag lägger mycket tid på att tänka på vad min partner behöver, känner eller gör.",
  },
  {
    area: "externalFocus",
    text: "Hur min partner reagerar på mig påverkar starkt hur jag känner inför mig själv.",
  },
  {
    area: "externalFocus",
    text: "När min partner är missnöjd med mig har jag svårt att känna mig trygg eller okej i mig själv.",
  },
  {
    area: "externalFocus",
    text: "Jag kan bli så upptagen av relationen och min partners situation att mina egna behov hamnar i bakgrunden.",
  },
];

export const answerLabels = [
  "Stämmer inte alls",
  "Stämmer lite",
  "Stämmer delvis",
  "Stämmer ganska mycket",
  "Stämmer helt",
];

export const areaLabels: Record<Area, string> = {
  selfSacrifice: "Självuppoffring",
  rescuing: "Överansvar & räddande",
  control: "Kontroll & problemlösning",
  boundaries: "Gränser & självhävdelse",
  suppression: "Känslomässig självundertryckning",
  externalFocus: "Yttre fokus & relationsberoende självvärde",
};

export const areaDescriptions: Record<Area, string> = {
  selfSacrifice:
    "Visar i vilken grad dina egna behov, önskemål och din återhämtning får stå tillbaka för partnerns.",
  rescuing:
    "Visar i vilken grad du känner ansvar för att lösa partnerns problem, reglera partnerns mående eller skydda hen från konsekvenser.",
  control:
    "Visar hur mycket energi du lägger på att förebygga, styra eller hantera partnerns beteende och situation.",
  boundaries:
    "Visar hur lätt eller svårt det är för dig att säga nej, uttrycka egna behov och stå fast vid personliga gränser.",
  suppression:
    "Visar i vilken grad du döljer, tonar ner eller håller tillbaka dina egna känslor för relationens eller partnerns skull.",
  externalFocus:
    "Visar hur starkt ditt fokus och självvärde påverkas av partnerns behov, humör, respons och situation.",
};

export const LS_KEY = "medberoendetest_state_v1";

export const CHECKOUT_URL = "https://buy.stripe.com/aFa14m2CBd2F3Cf8YU0gw0k";

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
  if (score >= 75) {
    return "Omfattande medberoenderelaterade relationsmönster";
  }

  if (score >= 50) {
    return "Tydliga medberoenderelaterade relationsmönster";
  }

  if (score >= 25) {
    return "Vissa medberoenderelaterade relationsmönster";
  }

  return "Få medberoenderelaterade relationsmönster";
}

export function overallDescription(score: number) {
  if (score >= 75) {
    return "Dina svar visar att flera mönster kring självuppoffring, ansvar, gränser eller starkt fokus på partnern återkommer i hög grad. Det kan innebära att relationens behov regelbundet får större utrymme än ditt eget välbefinnande och din självständighet.";
  }

  if (score >= 50) {
    return "Dina svar visar flera tydliga mönster som ofta förknippas med medberoende relationer. Det handlar inte om att du bryr dig för mycket, utan om att ansvar, gränser eller partnerns mående verkar få stor påverkan på hur du själv fungerar i relationen.";
  }

  if (score >= 25) {
    return "Dina svar visar vissa mönster som kan vara värda att uppmärksamma. En del av dem kan förekomma även i fungerande relationer, men blir mer problematiska om de återkommer ofta och gör att dina egna behov eller gränser får stå tillbaka.";
  }

  return "Dina svar visar relativt få av de relationsmönster som testet undersöker. Att hjälpa, kompromissa och bry sig om en partner är normalt och behöver inte innebära medberoende.";
}

export function areaGuidance(area: Area, score: number) {
  const elevated = score >= 50;

  const guidance: Record<Area, string> = {
    selfSacrifice: elevated
      ? "Du verkar ofta ge partnerns behov företräde framför dina egna. Fundera särskilt på om kompromisserna är ömsesidiga eller om du regelbundet är den som får avstå, anpassa dig eller fortsätta ge trots att du själv är dränerad."
      : "Dina svar tyder inte på att självuppoffring dominerar relationen. Du verkar i relativt hög grad kunna ta hänsyn till partnern utan att konsekvent prioritera bort dig själv.",

    rescuing: elevated
      ? "Du verkar ofta ta ansvar för sådant som egentligen tillhör din partner. Att stötta någon är något annat än att bära deras ansvar eller skydda dem från konsekvenserna av deras egna val."
      : "Du verkar relativt väl kunna skilja mellan att stötta din partner och att ta över ansvaret för partnerns problem.",

    control: elevated
      ? "Du verkar lägga mycket energi på att hålla ihop, förebygga eller lösa situationer kring partnern. Kontroll kan ibland kännas som omsorg eller problemlösning, särskilt när alternativet upplevs som att allt riskerar att falla samman."
      : "Dina svar visar relativt liten tendens att försöka styra eller förebygga partnerns problem för att själv kunna känna trygghet.",

    boundaries: elevated
      ? "Det verkar ibland vara svårt att uttrycka behov eller hålla fast vid ett nej när partnern blir besviken, arg eller missnöjd. Ett viktigt område kan vara att skilja på ansvar för din egen gräns och ansvar för partnerns reaktion på den."
      : "Du verkar i relativt hög grad kunna uttrycka behov och upprätthålla personliga gränser även när det innebär att partnern inte alltid blir nöjd.",

    suppression: elevated
      ? "Du verkar ofta hålla tillbaka dina egna känslor för att skydda partnern eller relationen. På kort sikt kan det minska konflikt, men på längre sikt kan det göra dina behov svårare att se både för dig själv och för partnern."
      : "Du verkar relativt bekväm med att låta dina egna känslor få plats i relationen istället för att konsekvent undertrycka dem.",

    externalFocus: elevated
      ? "Din partners mående och respons verkar ha stor betydelse för hur du själv känner och fungerar. Lägg märke till om ditt fokus på relationen gör det svårt att behålla kontakt med dina egna behov, intressen och din egen känsla av värde."
      : "Dina svar tyder på att partnerns humör och respons inte helt styr ditt eget självvärde eller fokus.",
  };

  return guidance[area];
}

export function calculateScores(answers: number[]) {

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

    const overall =
      Math.round(
        (Object.values(areas).reduce((sum, score) => sum + score, 0) /
          Object.values(areas).length) *
          10
      ) / 10;

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
