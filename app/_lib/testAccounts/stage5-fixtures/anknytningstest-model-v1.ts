// Frozen original inline questions/texts/useMemo bodies; regression reference only.
export type Dimension = "anxiety" | "avoidance";

export type Subscale =
  | "rejection"
  | "reassurance"
  | "hypervigilance"
  | "vulnerability"
  | "selfReliance"
  | "withdrawal";

export type Question = {
  text: string;
  dimension: Dimension;
  subscale: Subscale;
  reverse?: boolean;
};

export const questions: Question[] = [
  // ANKNYTNINGSÅNGEST – RÄDSLA FÖR AVVISANDE
  {
    dimension: "anxiety",
    subscale: "rejection",
    text:
      "Jag blir lätt orolig för att min partner ska tappa känslorna för mig.",
  },
  {
    dimension: "anxiety",
    subscale: "rejection",
    text:
      "Små förändringar i min partners ton eller beteende kan få mig att undra om något är fel mellan oss.",
  },
  {
    dimension: "anxiety",
    subscale: "rejection",
    text:
      "Jag är ofta rädd för att bli lämnad, även när det inte finns något tydligt tecken på att relationen är på väg att ta slut.",
  },
  {
    dimension: "anxiety",
    subscale: "rejection",
    text:
      "När min partner behöver mer eget utrymme kan jag tolka det som att hen håller på att dra sig undan från mig.",
  },
  {
    dimension: "anxiety",
    subscale: "rejection",
    text:
      "Jag har lätt att känna mig ersättningsbar eller mindre viktig för min partner än jag önskar.",
  },

  // ANKNYTNINGSÅNGEST – BEHOV AV FÖRSÄKRAN
  {
    dimension: "anxiety",
    subscale: "reassurance",
    text:
      "Jag behöver ofta tydliga tecken på att min partner fortfarande älskar eller vill vara med mig.",
  },
  {
    dimension: "anxiety",
    subscale: "reassurance",
    text:
      "Om min partner inte svarar eller hör av sig som vanligt blir jag snabbt orolig.",
  },
  {
    dimension: "anxiety",
    subscale: "reassurance",
    text:
      "Jag söker ofta bekräftelse på att relationen är trygg.",
  },
  {
    dimension: "anxiety",
    subscale: "reassurance",
    text:
      "När jag känner mig osäker i relationen har jag svårt att lugna mig utan respons från min partner.",
  },
  {
    dimension: "anxiety",
    subscale: "reassurance",
    text:
      "Jag kan känna ett starkt behov av närhet efter konflikt, även om min partner behöver mer tid.",
  },

  // ANKNYTNINGSÅNGEST – HYPERVAKSAMHET & RELATIONSORO
  {
    dimension: "anxiety",
    subscale: "hypervigilance",
    text:
      "Jag analyserar ofta meddelanden, tonfall eller små detaljer för att förstå hur min partner känner för mig.",
  },
  {
    dimension: "anxiety",
    subscale: "hypervigilance",
    text:
      "Det är svårt för mig att släppa relationsproblem innan jag känner att allt är helt utrett.",
  },
  {
    dimension: "anxiety",
    subscale: "hypervigilance",
    text:
      "Jag märker snabbt om min partner känns mindre varm, mindre närvarande eller mer distanserad än vanligt.",
  },
  {
    dimension: "anxiety",
    subscale: "hypervigilance",
    text:
      "När relationen känns osäker tar den lätt mycket plats i mina tankar.",
  },
  {
    dimension: "anxiety",
    subscale: "hypervigilance",
    text:
      "Jag kan ha svårt att koncentrera mig på annat när jag upplever känslomässigt avstånd mellan mig och min partner.",
  },

  // UNDVIKANDE – OBEHAG INFÖR SÅRBARHET
  {
    dimension: "avoidance",
    subscale: "vulnerability",
    text:
      "Jag tycker det är svårt att visa min partner hur sårbar jag egentligen känner mig.",
  },
  {
    dimension: "avoidance",
    subscale: "vulnerability",
    text:
      "Jag håller gärna vissa känslor för mig själv även när min partner försöker komma nära.",
  },
  {
    dimension: "avoidance",
    subscale: "vulnerability",
    text:
      "Jag kan känna mig obekväm när någon vill komma väldigt nära mig känslomässigt.",
  },
  {
    dimension: "avoidance",
    subscale: "vulnerability",
    text:
      "Det känns ibland tryggare att inte visa hur mycket jag behöver eller bryr mig om någon.",
  },
  {
    dimension: "avoidance",
    subscale: "vulnerability",
    text:
      "När samtal blir mycket känslomässiga vill jag ofta avsluta dem eller byta ämne.",
  },

  // UNDVIKANDE – SJÄLVTILLRÄCKLIGHET & BEROENDE
  {
    dimension: "avoidance",
    subscale: "selfReliance",
    text:
      "Jag föredrar ofta att lösa problem själv istället för att luta mig mot min partner.",
  },
  {
    dimension: "avoidance",
    subscale: "selfReliance",
    text:
      "Jag tycker det är obekvämt att känna att jag är beroende av någon annan.",
  },
  {
    dimension: "avoidance",
    subscale: "selfReliance",
    text:
      "Jag känner ett starkt behov av att behålla mycket självständighet även i en nära relation.",
  },
  {
    dimension: "avoidance",
    subscale: "selfReliance",
    text:
      "Jag har svårt att helt lita på att någon annan kommer finnas där när jag verkligen behöver stöd.",
  },
  {
    dimension: "avoidance",
    subscale: "selfReliance",
    text:
      "Jag känner mig ofta tryggare när jag inte behöver förlita mig för mycket på min partner.",
  },

  // UNDVIKANDE – TILLBAKADRAGANDE
  {
    dimension: "avoidance",
    subscale: "withdrawal",
    text:
      "När en konflikt blir intensiv behöver jag ofta skapa avstånd från min partner.",
  },
  {
    dimension: "avoidance",
    subscale: "withdrawal",
    text:
      "Om min partner vill prata om relationen när jag känner mig pressad kan jag vilja dra mig undan.",
  },
  {
    dimension: "avoidance",
    subscale: "withdrawal",
    text:
      "Jag kan bli mindre känslomässigt tillgänglig när min partner vill ha mycket närhet.",
  },
  {
    dimension: "avoidance",
    subscale: "withdrawal",
    text:
      "När jag känner mig överväldigad i relationen stänger jag ofta av mina känslor eller håller personen på avstånd.",
  },
  {
    dimension: "avoidance",
    subscale: "withdrawal",
    text:
      "Efter konflikt vill jag ofta få mycket mer distans än min partner verkar vilja ha.",
  },
];

export const answerLabels = [
  "Stämmer inte alls",
  "Stämmer lite",
  "Stämmer delvis",
  "Stämmer ganska mycket",
  "Stämmer helt",
];

export const subscaleLabels: Record<Subscale, string> = {
  rejection: "Rädsla för avvisande",
  reassurance: "Behov av försäkran",
  hypervigilance: "Relationsoro & vaksamhet",
  vulnerability: "Obehag inför sårbarhet",
  selfReliance: "Självtillräcklighet & beroende",
  withdrawal: "Tillbakadragande vid närhet eller konflikt",
};

export const subscaleDescriptions: Record<Subscale, string> = {
  rejection:
    "Beskriver hur känslig du är för tecken på att en partner kan tappa intresse, skapa avstånd eller lämna relationen.",
  reassurance:
    "Beskriver hur mycket trygghet du behöver få genom partnerns respons, bekräftelse och försäkringar.",
  hypervigilance:
    "Beskriver hur mycket uppmärksamhet och mental energi som går åt till att tolka relationens signaler och förändringar.",
  vulnerability:
    "Beskriver hur bekväm du är med att visa behov, känslor och sårbarhet i nära relationer.",
  selfReliance:
    "Beskriver tendensen att lita främst på dig själv och undvika känslomässigt beroende av en partner.",
  withdrawal:
    "Beskriver hur lätt du skapar känslomässigt eller praktiskt avstånd när relationen känns intensiv eller konfliktfylld.",
};

export const LS_KEY = "anknytningstest_state_v1";

export const CHECKOUT_URL = "https://buy.stripe.com/dRm7sKdhf8Mp4Gjeje0gw0g";

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function scoreLevel(score: number) {
  if (score >= 75) return "Hög";
  if (score >= 50) return "Förhöjd";
  if (score >= 25) return "Måttlig";
  return "Låg";
}

export function profileName(anxiety: number, avoidance: number) {
  const highAnxiety = anxiety >= 50;
  const highAvoidance = avoidance >= 50;

  if (!highAnxiety && !highAvoidance) {
    return "Övervägande trygg anknytningsprofil";
  }

  if (highAnxiety && !highAvoidance) {
    return "Övervägande ängslig / ambivalent anknytningsprofil";
  }

  if (!highAnxiety && highAvoidance) {
    return "Övervägande undvikande anknytningsprofil";
  }

  return "Blandad otrygg / rädd-undvikande anknytningsprofil";
}

export function profileShort(anxiety: number, avoidance: number) {
  const highAnxiety = anxiety >= 50;
  const highAvoidance = avoidance >= 50;

  if (!highAnxiety && !highAvoidance) {
    return (
      "Dina svar visar relativt låg anknytningsångest och relativt låg tendens " +
      "till känslomässigt undvikande. Det talar för att du oftast kan söka närhet " +
      "utan stark rädsla för att bli övergiven och samtidigt behålla självständighet " +
      "utan att behöva skapa stort känslomässigt avstånd."
    );
  }

  if (highAnxiety && !highAvoidance) {
    return (
      "Dina svar visar framför allt en stark känslighet för avstånd, osäkerhet och " +
      "risken att förlora närhet. Du verkar samtidigt relativt bekväm med känslomässig " +
      "närhet och vill ofta reparera avstånd snabbt när relationen känns osäker."
    );
  }

  if (!highAnxiety && highAvoidance) {
    return (
      "Dina svar visar framför allt en tendens att skydda självständighet och skapa " +
      "känslomässigt avstånd när närheten blir intensiv. Oro för att bli övergiven " +
      "framträder mindre tydligt än behovet av att inte känna dig alltför beroende."
    );
  }

  return (
    "Dina svar visar både tydlig anknytningsångest och tydlig tendens till undvikande. " +
    "Det kan skapa en inre konflikt där du längtar efter närhet men samtidigt blir " +
    "obekväm, försiktig eller tillbakadragen när relationen känns alltför intensiv."
  );
}

export function profileDeep(anxiety: number, avoidance: number) {
  const highAnxiety = anxiety >= 50;
  const highAvoidance = avoidance >= 50;

  if (!highAnxiety && !highAvoidance) {
    return (
      "Din profil ligger närmast det som brukar beskrivas som trygg anknytning. " +
      "Det betyder inte att du aldrig blir osäker eller drar dig undan, utan att varken " +
      "stark övergivenhetsoro eller starkt känslomässigt undvikande verkar dominera dina " +
      "relationer. Du har sannolikt lättare än många att både söka stöd och ge partnern utrymme."
    );
  }

  if (highAnxiety && !highAvoidance) {
    return (
      "Din profil ligger närmast ett ängsligt eller ambivalent anknytningsmönster. " +
      "När relationen känns trygg kan närhet kännas mycket positiv, men osäkerhet eller " +
      "avstånd kan snabbt aktivera oro. Det kan leda till starkt behov av kontakt, " +
      "försäkran eller snabb lösning efter konflikt."
    );
  }

  if (!highAnxiety && highAvoidance) {
    return (
      "Din profil ligger närmast ett undvikande anknytningsmönster. När relationen blir " +
      "känslomässigt intensiv kan självständighet och distans kännas tryggare än att luta " +
      "sig mot partnern. Du kan därför ha lättare att hantera oro genom att dra dig undan " +
      "än genom att söka mer närhet."
    );
  }

  return (
    "Din profil visar både hög anknytningsångest och högt undvikande. Det brukar beskrivas " +
    "som en mer blandad eller rädd-undvikande anknytningsprofil. Närhet kan vara starkt " +
    "efterlängtad samtidigt som den också kan kännas riskfylld. Det kan skapa växlingar " +
    "mellan att söka kontakt och att senare dra sig undan."
  );
}

export function subscaleGuidance(subscale: Subscale, score: number) {
  const high = score >= 50;

  const text: Record<Subscale, string> = {
    rejection: high
      ? "Du verkar vara känslig för signaler om avstånd eller minskat intresse. Försök skilja mellan faktiska förändringar i partnerns beteende och den oro som uppstår innan du har tillräckligt med information."
      : "Rädsla för avvisande framträder inte som ett starkt återkommande mönster i dina svar.",
    reassurance: high
      ? "Trygghet verkar ofta behöva bekräftas utifrån. Det kan hjälpa att observera om behovet av försäkran faktiskt lugnar dig på längre sikt eller bara ger kortvarig lättnad."
      : "Du verkar relativt sällan behöva upprepad försäkran från en partner för att känna att relationen är stabil.",
    hypervigilance: high
      ? "Du verkar lägga stor mental energi på att läsa av relationen. När detta blir starkt kan neutrala förändringar i ton, svarstid eller humör få större betydelse än de egentligen har."
      : "Du verkar relativt sällan fastna i intensiv analys av relationens små signaler.",
    vulnerability: high
      ? "Sårbarhet verkar vara något du ofta skyddar. Att gradvis uttrycka behov utan att först behöva vara helt säker på partnerns reaktion kan vara ett viktigt område att utveckla."
      : "Du verkar relativt bekväm med att visa känslor och behov när relationen känns trygg.",
    selfReliance: high
  ? "Du verkar sätta stort värde på att klara dig själv. Självständighet är inte ett problem i sig, men det kan bli begränsande om det gör det svårt att ta emot stöd eller bygga ömsesidigt beroende."
  : "Du verkar kunna behålla självständighet samtidigt som du i relativt hög grad kan förlita dig på en partner.",
withdrawal: high
  ? "Du verkar ofta reglera starka känslor genom att skapa avstånd. Kort paus kan vara konstruktivt, men långvarigt tillbakadragande kan göra att partnern upplever osäkerhet och söker ännu mer kontakt."
  : "Du verkar relativt sällan lösa relationsstress genom att stänga av eller skapa stort känslomässigt avstånd.",
  };

  return text[subscale];
}

export function calculateScores(answers: number[]) {

    const dimensionRaw: Record<Dimension, number> = {
      anxiety: 0,
      avoidance: 0,
    };

    const dimensionMax: Record<Dimension, number> = {
      anxiety: 0,
      avoidance: 0,
    };

    const subscaleRaw = {} as Record<Subscale, number>;
    const subscaleMax = {} as Record<Subscale, number>;

    (Object.keys(subscaleLabels) as Subscale[]).forEach((subscale) => {
      subscaleRaw[subscale] = 0;
      subscaleMax[subscale] = 0;
    });

    questions.forEach((question, i) => {
      const answer = answers[i];

      dimensionMax[question.dimension] += 4;
      subscaleMax[question.subscale] += 4;

      if (answer >= 0) {
        const scoredValue = question.reverse ? 4 - answer : answer;

        dimensionRaw[question.dimension] += scoredValue;
        subscaleRaw[question.subscale] += scoredValue;
      }
    });

    const dimensions: Record<Dimension, number> = {
      anxiety:
        dimensionMax.anxiety > 0
          ? Math.round(
              (dimensionRaw.anxiety / dimensionMax.anxiety) * 100
            )
          : 0,

      avoidance:
        dimensionMax.avoidance > 0
          ? Math.round(
              (dimensionRaw.avoidance / dimensionMax.avoidance) * 100
            )
          : 0,
    };

    const subscales = {} as Record<Subscale, number>;

    (Object.keys(subscaleRaw) as Subscale[]).forEach((subscale) => {
      subscales[subscale] =
        subscaleMax[subscale] > 0
          ? Math.round(
              (subscaleRaw[subscale] / subscaleMax[subscale]) * 100
            )
          : 0;
    });

    return {
      dimensions,
      subscales,
    };
  
}
export function sortScores(scores: ReturnType<typeof calculateScores>) {
    return (Object.keys(scores.subscales) as Subscale[])
      .map((subscale) => ({
        subscale,
        score: scores.subscales[subscale],
      }))
      .sort((a, b) => b.score - a.score);
  }
export function calculate(answers: number[]) {
 const scores = calculateScores(answers); const sortedSubscales = sortScores(scores);
 const anxiety = scores.dimensions.anxiety, avoidance = scores.dimensions.avoidance;
 return { scores, sortedSubscales, anxiety, avoidance, profile: profileName(anxiety, avoidance) };
}
export type Result = ReturnType<typeof calculate>;
