// Frozen original declarations and inline calculation expressions.
export type Area =
  | "grandiosity"
  | "admiration"
  | "entitlement"
  | "empathy"
  | "exploitation"
  | "devaluation"
  | "criticism"
  | "impact";

export type Question = {
  text: string;
  area: Area;
};

export const questions: Question[] = [
  // GRANDIOSITET & ÖVERLÄGSENHET
  {
    area: "grandiosity",
    text:
      "Min partner framställer ofta sig själv som mer kompetent, intelligent eller insiktsfull än andra.",
  },
  {
    area: "grandiosity",
    text:
      "Min partner har svårt att acceptera att någon annan kan veta bättre eller ha mer rätt.",
  },
  {
    area: "grandiosity",
    text:
      "Min partner pratar nedlåtande om människor som hen tycker är mindre framgångsrika, smarta eller betydelsefulla.",
  },
  {
    area: "grandiosity",
    text:
      "Min partner överdriver sina prestationer, sin betydelse eller vad andra tycker om hen.",
  },

  // BEKRÄFTELSE & BEUNDRAN
  {
    area: "admiration",
    text:
      "Min partner verkar behöva mycket uppskattning, bekräftelse eller uppmärksamhet från andra.",
  },
  {
    area: "admiration",
    text:
      "Om min partner inte får den uppskattning hen förväntar sig förändras humöret tydligt.",
  },
  {
    area: "admiration",
    text:
      "Samtal om mina framgångar eller behov styrs ofta tillbaka till min partner.",
  },
  {
    area: "admiration",
    text:
      "Min partner verkar lägga stor vikt vid status, anseende eller hur relationen ser ut inför andra.",
  },

  // BERÄTTIGANDEKÄNSLA
  {
    area: "entitlement",
    text:
      "Min partner förväntar sig ofta att jag ska anpassa mig efter hens önskemål.",
  },
  {
    area: "entitlement",
    text:
      "Det verkar finnas olika regler för vad min partner får göra och vad jag får göra.",
  },
  {
    area: "entitlement",
    text:
      "Min partner reagerar negativt när jag inte prioriterar hens behov eller planer.",
  },
  {
    area: "entitlement",
    text:
      "Min partner beter sig ibland som om särskild hänsyn eller behandling är självklar.",
  },

  // EMPATI & ÖMSESIDIGHET
  {
    area: "empathy",
    text:
      "När jag berättar att jag blivit sårad har min partner svårt att stanna kvar i mitt perspektiv.",
  },
  {
    area: "empathy",
    text:
      "Mina känslor avfärdas, förminskas eller förklaras bort när de är obekväma för min partner.",
  },
  {
    area: "empathy",
    text:
      "Min partner verkar förstå mina känslor bättre när de inte kräver något av hen.",
  },
  {
    area: "empathy",
    text:
      "Jag upplever att relationen ofta saknar verklig ömsesidighet när mina och min partners behov krockar.",
  },

  // EXPLOATERING & MANIPULATION
  {
    area: "exploitation",
    text:
      "Min partner använder skuld för att få mig att göra sådant jag egentligen inte vill.",
  },
  {
    area: "exploitation",
    text:
      "Min partner använder sådant jag berättat i förtroende mot mig under konflikter.",
  },
  {
    area: "exploitation",
    text:
      "Min partner förvränger samtal eller händelser så att jag till slut får bära ansvaret för problemet.",
  },
  {
    area: "exploitation",
    text:
      "Jag känner ibland att min partners värme eller uppskattning beror på vad jag kan ge, göra eller bidra med.",
  },

  // IDEALISERING & NEDVÄRDERING
  {
    area: "devaluation",
    text:
      "Min partner kan växla mellan att lyfta mig väldigt högt och att behandla mig som om jag inte duger.",
  },
  {
    area: "devaluation",
    text:
      "Egenskaper som min partner tidigare uppskattade hos mig används senare som kritik mot mig.",
  },
  {
    area: "devaluation",
    text:
      "Efter konflikter kan min partner bli kall, nedlåtande eller dra tillbaka närhet på ett sätt som känns bestraffande.",
  },
  {
    area: "devaluation",
    text:
      "Jag får återkommande känslan av att jag måste förtjäna tillbaka min partners uppskattning.",
  },

  // KRITIKKÄNSLIGHET & REAKTIONER
  {
    area: "criticism",
    text:
      "När jag kritiserar min partner, även försiktigt, reagerar hen oproportionerligt starkt.",
  },
  {
    area: "criticism",
    text:
      "När jag tar upp något min partner gjort fel går samtalet ofta över till mina brister eller fel.",
  },
  {
    area: "criticism",
    text:
      "Min partner kan reagera med ilska, förakt, kyla eller offerposition när hen känner sig ifrågasatt.",
  },

  // PÅVERKAN PÅ DIG
  {
    area: "impact",
    text:
      "Jag tänker ofta igenom hur jag uttrycker mig för att undvika min partners reaktion.",
  },
  {
    area: "impact",
    text:
      "Jag tvivlar mer på mitt eget omdöme eller min egen betydelse sedan relationen började.",
  },
  {
    area: "impact",
    text:
      "Jag känner att relationen alltmer kretsar kring min partners behov, humör eller självbild.",
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
  grandiosity: "Grandiositet & överlägsenhet",
  admiration: "Behov av bekräftelse",
  entitlement: "Berättigandekänsla",
  empathy: "Empati & ömsesidighet",
  exploitation: "Exploatering & manipulation",
  devaluation: "Idealisering & nedvärdering",
  criticism: "Reaktion på kritik",
  impact: "Påverkan på dig",
};

export const areaDescriptions: Record<Area, string> = {
  grandiosity:
    "Handlar om överlägsenhet, behov av att ha rätt och tendensen att värdera människor hierarkiskt.",
  admiration:
    "Handlar om hur mycket självkänslan verkar bero på uppmärksamhet, uppskattning, status och bekräftelse.",
  entitlement:
    "Handlar om förväntningar på särbehandling, eftergifter och olika regler för olika personer.",
  empathy:
    "Handlar om förmågan att ta in dina känslor och behov även när de är obekväma eller konkurrerar med de egna.",
  exploitation:
    "Handlar om skuld, ansvarsförskjutning och om relationen används för att få kontroll, resurser eller bekräftelse.",
  devaluation:
    "Handlar om skiften mellan stark uppskattning och nedvärdering, kyla, kritik eller villkorad närhet.",
  criticism:
    "Handlar om hur personen reagerar när självkänslan utmanas genom kritik, gränser eller ifrågasättande.",
  impact:
    "Handlar om vad relationens mönster gör med din frihet, självkänsla, trygghet och tillit till ditt eget omdöme.",
};

export const weights: Record<Area, number> = {
  grandiosity: 0.95,
  admiration: 0.9,
  entitlement: 1.05,
  empathy: 1.1,
  exploitation: 1.15,
  devaluation: 1.05,
  criticism: 1.1,
  impact: 1.2,
};

export const LS_KEY = "narcissist_relation_test_state_v1";

export const CHECKOUT_URL = "https://buy.stripe.com/cNi3cu6SRd2FegT0so0gw0h";

export function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export function overallLevel(score: number) {
  if (score >= 75) return "Omfattande narcissistiska relationsmönster";
  if (score >= 55) return "Många tydliga narcissistiska relationsmönster";
  if (score >= 30) return "Vissa tydliga narcissistiska relationsmönster";
  return "Få tydliga narcissistiska relationsmönster";
}

export function areaLevel(score: number) {
  if (score >= 75) return "Mycket tydligt";
  if (score >= 50) return "Tydligt";
  if (score >= 25) return "Vissa tecken";
  return "Få tecken";
}

export function overallExplanation(score: number) {
  if (score >= 75) {
    return (
      "Dina svar visar ett omfattande mönster över flera områden som ofta förknippas " +
      "med narcissistisk problematik i nära relationer. Resultatet säger inte att din " +
      "partner har narcissistiskt personlighetssyndrom, men mönstret är tillräckligt " +
      "tydligt för att relationens påverkan på dig bör tas på allvar."
    );
  }

  if (score >= 55) {
    return (
      "Dina svar visar flera tydliga och återkommande narcissistiska relationsmönster. " +
      "Det viktiga är mindre vilken etikett personen har och mer hur beteendena påverkar " +
      "ömsesidighet, trygghet och din möjlighet att vara dig själv i relationen."
    );
  }

  if (score >= 30) {
    return (
      "Dina svar visar vissa tydliga narcissistiska relationsmönster, men bilden är blandad. " +
      "Det kan vara värdefullt att titta på vilka områden som sticker ut och om beteendena " +
      "är återkommande, ökar över tid eller förändras när du sätter gränser."
    );
  }

  return (
    "Dina svar visar få tydliga narcissistiska relationsmönster sammantaget. " +
    "Det utesluter inte problem i relationen. Ett enskilt beteende kan fortfarande vara " +
    "viktigt, särskilt om du känner dig rädd, kontrollerad, nedvärderad eller otrygg."
  );
}

export function guidanceForArea(area: Area, score: number) {
  const strong = score >= 50;

  const guides: Record<Area, string> = {
    grandiosity: strong
      ? "Det finns ett tydligt mönster där din partners självbild och behov av överläge får stort utrymme. Lägg särskilt märke till om oenighet kan existera utan att du förminskas."
      : "Det här området sticker inte ut särskilt starkt i dina svar.",
    admiration: strong
      ? "Din partners behov av uppskattning eller bekräftelse verkar påverka relationen tydligt. Observera vad som händer när uppmärksamheten ligger på dig eller när bekräftelsen uteblir."
      : "Dina svar visar inte något starkt mönster av extremt bekräftelsebehov.",
    entitlement: strong
      ? "Dina svar tyder på en obalans i vilka rättigheter och behov som får väga tyngst. En viktig fråga är om dina gränser respekteras även när din partner inte gillar dem."
      : "Det finns inte någon stark samlad signal om berättigandekänsla i dina svar.",
    empathy: strong
      ? "Ömsesidigheten verkar vara ett tydligt problem. Lägg märke till om dina känslor får vara giltiga utan att du först måste försvara eller bevisa dem."
      : "Dina svar visar inte någon stark generell brist på ömsesidighet eller empatiskt bemötande.",
    exploitation: strong
      ? "Det finns tydliga tecken på att skuld, ansvarsförskjutning eller manipulation används i relationen. Försök hålla fast vid konkreta händelser när samtal börjar flytta fokus från beteendet till dig som person."
      : "Exploatering och manipulation framträder inte som ett starkt samlat område.",
    devaluation: strong
      ? "Skiften mellan uppskattning och nedvärdering verkar vara framträdande. Sådana skiften kan skapa stark osäkerhet eftersom man börjar jaga tillbaka den positiva fasen."
      : "Dina svar visar inte något starkt mönster av idealisering följt av nedvärdering.",
    criticism: strong
      ? "Din partner verkar reagera starkt när självbilden utmanas. Observera särskilt om vanliga samtal om ansvar snabbt leder till motattack, kyla, förakt eller offerposition."
      : "Kritik och ifrågasättande verkar inte regelmässigt utlösa starka reaktioner enligt dina svar.",
    impact: strong
      ? "Relationen verkar påverka din självkänsla eller handlingsfrihet tydligt. Det här området väger tungt eftersom effekten på dig är viktig oavsett vilken diagnos eller etikett som eventuellt passar den andra personen."
      : "Dina svar visar relativt begränsad samlad påverkan på din egen självkänsla och frihet.",
  };

  return guides[area];
}

export function calculate(answers: number[]) {
const totalQuestions = questions.length;
const scores = (() => {
    const raw = {} as Record<Area, number>;
    const maximum = {} as Record<Area, number>;

    (Object.keys(areaLabels) as Area[]).forEach((area) => {
      raw[area] = 0;
      maximum[area] = 0;
    });

    questions.forEach((question, i) => {
      const answer = answers[i];

      maximum[question.area] += 4;

      if (answer >= 0) {
        raw[question.area] += answer;
      }
    });

    const percentages = {} as Record<Area, number>;

    (Object.keys(raw) as Area[]).forEach((area) => {
      percentages[area] =
        maximum[area] > 0
          ? Math.round((raw[area] / maximum[area]) * 100)
          : 0;
    });

    let weightedTotal = 0;
    let totalWeight = 0;

    (Object.keys(percentages) as Area[]).forEach((area) => {
      weightedTotal += percentages[area] * weights[area];
      totalWeight += weights[area];
    });

    const overall =
      totalWeight > 0 ? Math.round(weightedTotal / totalWeight) : 0;

    return {
      raw,
      percentages,
      overall,
    };
  })();
const sortedAreas = (() => {
    return (Object.keys(scores.percentages) as Area[])
      .map((area) => ({
        area,
        score: scores.percentages[area],
      }))
      .sort((a, b) => b.score - a.score);
  })();
return { scores, sortedAreas };
}
export type Result = ReturnType<typeof calculate>;
