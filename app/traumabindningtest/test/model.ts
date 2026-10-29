export type Area =
  | "intermittent"
  | "attachment"
  | "hope"
  | "rationalization"
  | "separation"
  | "selfLoss";

export type Question = {
  text: string;
  area: Area;
};

export const questions: Question[] = [
  // VÄXLING MELLAN NÄRHET OCH SMÄRTA
  {
    area: "intermittent",
    text: "Relationen växlar mellan mycket nära eller kärleksfulla perioder och perioder då jag blir sårad, avvisad eller illa behandlad.",
  },
  {
    area: "intermittent",
    text: "De bra perioderna känns extra starka eftersom de ofta kommer efter konflikter, kyla eller obehag.",
  },
  {
    area: "intermittent",
    text: "När min partner åter blir varm eller kärleksfull efter en svår period känner jag en stark lättnad.",
  },
  {
    area: "intermittent",
    text: "Jag upplever att relationens starka toppar och dalar gör bindningen mer intensiv.",
  },
  {
    area: "intermittent",
    text: "Efter att jag blivit sårad kan en kort period av närhet få mig att snabbt känna hopp igen.",
  },

  // STARK BINDNING TROTS SKADA
  {
    area: "attachment",
    text: "Jag känner mig starkt bunden till min partner trots att relationen återkommande får mig att må dåligt.",
  },
  {
    area: "attachment",
    text: "Det känns svårt att föreställa mig ett liv utan min partner även när jag vet att relationen skadar mig.",
  },
  {
    area: "attachment",
    text: "Jag längtar efter min partner även efter situationer där jag blivit illa behandlad.",
  },
  {
    area: "attachment",
    text: "Jag kan känna stark kärlek eller saknad samtidigt som jag vet att relationen inte känns trygg.",
  },
  {
    area: "attachment",
    text: "Min känslomässiga bindning till relationen känns ibland starkare än min bedömning av hur jag faktiskt blir behandlad.",
  },

  // HOPP OM FÖRÄNDRING
  {
    area: "hope",
    text: "Jag håller ofta fast vid minnet av hur bra relationen kan vara och hoppas att den versionen ska komma tillbaka.",
  },
  {
    area: "hope",
    text: "När min partner visar värme eller ånger tänker jag ofta att problemen kanske äntligen kommer att försvinna.",
  },
  {
    area: "hope",
    text: "Jag stannar kvar delvis för att jag tror att relationen kan bli som den var under de bästa perioderna.",
  },
  {
    area: "hope",
    text: "Små positiva förändringar får mig ofta att återfå mycket hopp trots tidigare återkommande problem.",
  },
  {
    area: "hope",
    text: "Jag fokuserar ofta på partnerns potential snarare än på hur relationen faktiskt fungerar över tid.",
  },

  // FÖRSVAR & RATIONALISERING
  {
    area: "rationalization",
    text: "Jag hittar ofta förklaringar till min partners sårande beteende som gör det lättare att acceptera.",
  },
  {
    area: "rationalization",
    text: "Jag försvarar ibland min partner inför andra trots att jag själv varit väldigt sårad av beteendet.",
  },
  {
    area: "rationalization",
    text: "Jag tänker ofta att partnerns beteende beror på stress, tidigare erfarenheter eller andra problem snarare än på hur jag faktiskt blir behandlad.",
  },
  {
    area: "rationalization",
    text: "Jag tonar ibland ned sådant som hänt för att relationen ska kännas mindre problematisk.",
  },
  {
    area: "rationalization",
    text: "Jag märker att jag ofta letar efter skäl till varför jag ändå borde förstå eller förlåta beteenden som sårar mig.",
  },

  // SEPARATION & ÅTERDRAGNING
  {
    area: "separation",
    text: "När jag försöker skapa avstånd från relationen får jag en stark längtan att återvända.",
  },
  {
    area: "separation",
    text: "Tanken på att relationen verkligen skulle ta slut väcker stark oro även när jag själv funderat på att lämna.",
  },
  {
    area: "separation",
    text: "Efter ett uppbrott, avstånd eller en paus känner jag ofta ett starkt behov av kontakt med min partner.",
  },
  {
    area: "separation",
    text: "Jag har återvänt till relationen trots att samma problem tidigare fått mig att vilja lämna.",
  },
  {
    area: "separation",
    text: "När min partner söker kontakt efter en svår period har jag svårt att hålla fast vid beslutet att skapa avstånd.",
  },

  // FÖRLUST AV EGEN KOMPASS
  {
    area: "selfLoss",
    text: "Jag har gradvis anpassat mina behov eller gränser för att hålla relationen kvar.",
  },
  {
    area: "selfLoss",
    text: "Det har blivit svårare för mig att avgöra vad jag själv egentligen vill i relationen.",
  },
  {
    area: "selfLoss",
    text: "Jag prioriterar ofta relationens fortsättning framför mitt eget välmående.",
  },
  {
    area: "selfLoss",
    text: "Jag har accepterat sådant i relationen som jag tidigare inte trodde att jag skulle acceptera.",
  },
  {
    area: "selfLoss",
    text: "Jag känner ibland att relationen har förändrat min uppfattning om vilka gränser jag har rätt att sätta.",
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
  intermittent: "Växling mellan närhet och smärta",
  attachment: "Stark bindning trots skada",
  hope: "Hopp om förändring",
  rationalization: "Försvar & rationalisering",
  separation: "Separation & återdragning",
  selfLoss: "Förlust av egen kompass",
};

export const areaDescriptions: Record<Area, string> = {
  intermittent:
    "Visar hur starkt relationen präglas av växling mellan positiva perioder och perioder av obehag, avvisande eller skada.",
  attachment:
    "Visar hur stark den känslomässiga bindningen är trots att relationen samtidigt upplevs som skadlig eller otrygg.",
  hope:
    "Visar hur mycket hoppet om att de goda perioderna ska återkomma påverkar viljan att stanna kvar.",
  rationalization:
    "Visar i vilken grad sårande beteenden förklaras, försvaras eller tonas ned för att relationen ska kännas mer begriplig eller möjlig att fortsätta.",
  separation:
    "Visar hur stark dragningen tillbaka till relationen blir när avstånd, paus eller uppbrott uppstår.",
  selfLoss:
    "Visar hur mycket egna behov, gränser och bedömningar kan ha försvagats eller anpassats för relationens skull.",
};

export const LS_KEY = "traumabindningtest_state_v1";

export const CHECKOUT_URL: string = "https://buy.stripe.com/28EbJ02CB4w9dcP3EA0gw0j";

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
    return "Omfattande traumabindningsrelaterade mönster";
  }

  if (score >= 50) {
    return "Tydliga traumabindningsrelaterade mönster";
  }

  if (score >= 25) {
    return "Vissa traumabindningsrelaterade mönster";
  }

  return "Få tecken på traumabindningsrelaterade mönster";
}

export function overallDescription(score: number) {
  if (score >= 75) {
    return "Dina svar visar ett omfattande mönster där stark känslomässig bindning verkar finnas sida vid sida med återkommande smärta, instabilitet eller beteenden som påverkar ditt välmående och dina gränser.";
  }

  if (score >= 50) {
    return "Dina svar visar flera tydliga mönster som ofta förknippas med traumabindning: stark anknytning trots skada, återkommande hopp efter svåra perioder och svårigheter att skapa eller behålla avstånd.";
  }

  if (score >= 25) {
    return "Dina svar visar vissa mönster som kan förekomma vid traumabindning. Det betyder inte i sig att relationen är traumabindande, men det kan vara värdefullt att undersöka hur bindningen påverkas av återkommande smärta, lättnad och hopp.";
  }

  return "Dina svar visar relativt få av de mönster som testet undersöker. Stark kärlek, saknad eller svårigheter vid ett uppbrott är i sig inte samma sak som traumabindning.";
}

export function areaGuidance(area: Area, score: number) {
  const elevated = score >= 50;

  const guidance: Record<Area, string> = {
    intermittent: elevated
      ? "Dina svar tyder på en tydlig växling mellan svåra perioder och stark närhet eller lättnad. Lägg märke till om de positiva perioderna främst känns starka därför att de följer efter stress, rädsla, kyla eller konflikt."
      : "Dina svar visar relativt lite av den starka växling mellan smärta och återförening som ofta diskuteras vid traumabindning.",

    attachment: elevated
      ? "Du verkar känna en stark emotionell bindning även när relationen samtidigt orsakar betydande smärta eller otrygghet. Det kan vara viktigt att skilja känslans styrka från frågan om relationen faktiskt är trygg och hållbar."
      : "Din emotionella anknytning verkar i mindre grad hålla dig kvar trots tydlig skada eller otrygghet.",

    hope: elevated
      ? "Hoppet om förändring verkar spela en stor roll. Observera om du framför allt bedömer relationen utifrån dess bästa perioder och partnerns potential, snarare än utifrån det återkommande mönstret över tid."
      : "Dina svar tyder på att hopp om framtida förändring i mindre grad håller dig kvar trots återkommande problem.",

    rationalization: elevated
      ? "Du verkar ofta hitta förklaringar som gör partnerns beteende lättare att acceptera. Förklaringar kan vara sanna och samtidigt inte förändra effekten beteendet har på dig."
      : "Dina svar visar relativt lite av ett mönster där sårande beteenden återkommande försvaras, förklaras bort eller tonas ned.",

    separation: elevated
      ? "Avstånd verkar utlösa en stark dragning tillbaka till relationen. Lägg märke till om lättnaden efter återkontakt gör att orsakerna till att du ville skapa avstånd snabbt hamnar i bakgrunden."
      : "Dina svar visar relativt få tecken på en stark återdragningsprocess när du skapar avstånd från relationen.",

    selfLoss: elevated
      ? "Relationen verkar ha påverkat dina egna behov, gränser eller bedömningar. Det kan vara värdefullt att återigen formulera vad du själv behöver och vilka beteenden du inte vill acceptera, oberoende av relationens framtid."
      : "Dina svar tyder på att du i relativt hög grad behåller kontakten med dina egna behov, gränser och bedömningar.",
  };

  return guidance[area];
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
  })();
const sortedAreas = (() => {
    return (Object.keys(scores.areas) as Area[])
      .map((area) => ({
        area,
        score: scores.areas[area],
      }))
      .sort((a, b) => b.score - a.score);
  })();
return { scores, sortedAreas };
}
export type Result = ReturnType<typeof calculate>;
