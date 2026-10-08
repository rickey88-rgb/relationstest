import { areaNames, areas, symptomAreas, type Result, type Area } from "./model";
import { areaTexts } from "./copy";
const middle = [
  "Du beskriver vissa svårigheter med fokus och distraktioner, men inte genomgående på en hög nivå.",
  "Planering och struktur fungerar olika bra i olika situationer enligt dina svar.",
  "Du känner ibland igen snabba reaktioner eller impulser, utan att de framträder genomgående starkt.",
  "Viss inre rastlöshet och behov av stimulans finns i svaren, men bilden är inte genomgående stark.",
  "Igångsättning och tidsuppfattning kan vara svåra i vissa situationer, men inte lika tydligt över hela området.",
  "Du beskriver viss påverkan i vardagen. Det kan vara hjälpsamt att skilja mellan vilka situationer som fungerar och vilka som blir svåra.",
];
export function describeArea(area: Area, score: number) {
  const i = areas.indexOf(area);
  return score < 25 ? areaTexts[i].low : score >= 65 ? areaTexts[i].high : middle[i];
}
export function impactText(result: Result) {
  if (result.impactModifier === "limited") return { title: "Tydliga drag, men begränsad påverkan i vardagen", text: "Du känner igen flera ADHD-relaterade mönster, men dina svar tyder på att de i nuläget påverkar vardagen relativt lite. Det gör helhetsbilden mindre entydig." };
  if (result.impactModifier === "marked") return { title: "Tydligt mönster med märkbar vardagspåverkan", text: "Svårigheterna verkar inte bara finnas som enskilda drag utan påverkar också flera delar av vardagen. Det stärker betydelsen av helhetsmönstret." };
  return { title: "Så påverkas din vardag", text: describeArea("impact", result.scores.impact) + " Vardagspåverkan hålls separat från symptomindex och kan inte i sig fastställa orsaken till svårigheterna." };
}
export function standoutText(result: Result) {
  if (result.symptomIndex === 0) return "Du har svarat Aldrig på samtliga frågor i de fem symptomområdena. Inget av dessa områden sticker ut framför de andra.";
  const top = result.ranked.filter(a => result.scores[a] === result.scores[result.ranked[0]]);
  if (top.length > 1) return `${top.length === 2 ? "Två områden" : "Flera områden"} framträder lika tydligt: ${top.map(a => areaNames[a].toLowerCase()).join(", ")}. Helheten behöver läsas tillsammans med vardagspåverkan.`;
  if (result.leadingGap >= 15) return `${areaNames[result.ranked[0]]} ligger tydligare över de andra symptomområdena. ${describeArea(result.ranked[0], result.scores[result.ranked[0]])}`;
  const close = result.ranked.filter(a => result.scores[result.ranked[0]] - result.scores[a] < 15);
  return `${close.map(a => areaNames[a]).join(" och ")} ligger nära varandra. Det är kombinationen av dessa svar, tillsammans med vardagspåverkan, som behöver tolkas.`;
}

export type PersonalFinding = {
  kind: "low" | "executive-pair" | "restless-pair" | "contrast" | "dominant" | "shared" | "mixed";
  sentences: readonly [string, string, string];
};

const sentence = (first: string, second: string, third: string) => [first, second, third] as const;
const pairedAreaNames = (first: Area, second: Area) => `${areaNames[first]} samt ${areaNames[second].toLowerCase()}`;

/**
 * A deliberately limited pre-purchase observation. It uses only existing result
 * fields and never returns the overall level, symptom index, profile type, or
 * a list of all area scores.
 */
export function personalFinding(result: Result): PersonalFinding {
  const { scores } = result;
  const allLow = symptomAreas.every((area) => scores[area] < 25);
  const top = result.ranked[0];
  const second = result.ranked[1];

  if (allLow) {
    return {
      kind: "low",
      sentences: sentence(
        "Dina svar är genomgående låga i de fem områden som testet undersöker.",
        "Det finns därför inget enskilt område som tydligt drar ifrån resten i din egen skattning.",
        "Helheten behöver ändå läsas varsamt, eftersom ett självtest inte kan förklara varför en svårighet uppstår eller inte uppstår."
      ),
    };
  }

  if (scores.attention >= 65 && scores.organization >= 65 && scores.activation >= 65) {
    return {
      kind: "executive-pair",
      sentences: sentence(
        "Uppmärksamhet och organisation framträder tillsammans i dina svar.",
        "Även igångsättning och tid ligger tydligt högt, vilket gör att flera vardagsmoment berörs samtidigt i din egen skattning.",
        "Den kombinationen är relevant när resten av profilen vägs samman, utan att den ensam avgör den samlade bedömningen."
      ),
    };
  }

  if (scores.organization >= 65 && scores.activation >= 65) {
    return {
      kind: "executive-pair",
      sentences: sentence(
        "Organisation samt tid, igångsättning och motivation framträder tillsammans i dina svar.",
        "Du beskriver både svårigheter med att få struktur och att omsätta avsikter i handling när vardagen kräver det.",
        "Det är en kombination som behöver vägas mot de övriga områdena innan helhetsbilden kan beskrivas."
      ),
    };
  }

  if (scores.impulsivity >= 65 && scores.restlessness >= 65) {
    return {
      kind: "restless-pair",
      sentences: sentence(
        "Impulsivitet och inre rastlöshet framträder tillsammans i dina svar.",
        "Du beskriver både snabba reaktioner och ett tydligt behov av aktivitet eller stimulans.",
        "Hur denna kombination förhåller sig till övriga delar av vardagen är en viktig del av den samlade tolkningen."
      ),
    };
  }

  if (scores.impulsivity < 25 && scores.restlessness < 25 && scores[top] >= 65) {
    return {
      kind: "contrast",
      sentences: sentence(
        `${areaNames[top]} framträder tydligt, medan impulsivitet och inre rastlöshet ligger lågt i dina svar.`,
        "Din profil är alltså inte jämnt förhöjd över alla områden som testet tar upp.",
        "Den skillnaden är en nyans som behöver vägas in tillsammans med resten av svarsmönstret."
      ),
    };
  }

  if (scores[top] >= 65 && result.leadingGap >= 15) {
    return {
      kind: "dominant",
      sentences: sentence(
        `${areaNames[top]} är det område som tydligast drar ifrån i dina svar.`,
        describeArea(top, scores[top]),
        `Det gör området relevant för helheten, men den samlade tolkningen beror också på hur ${areaNames[second].toLowerCase()} och övriga delar av profilen ser ut.`
      ),
    };
  }

  if (result.leadingGap < 15) {
    return {
      kind: "shared",
      sentences: sentence(
        `${pairedAreaNames(top, second)} ligger nära varandra i dina svar.`,
        "Det finns därför inte ett enda område som ensamt förklarar det mönster du beskriver.",
        "Samspelet mellan de närliggande områdena blir mer relevant än en enskild toppnotering när helheten tolkas."
      ),
    };
  }

  return {
    kind: "mixed",
    sentences: sentence(
      `${areaNames[top]} framträder mest i dina svar, men bilden är inte helt jämn mellan områdena.`,
      "Flera delar av profilen bidrar på olika sätt till den vardag du beskriver.",
      "Den samlade tolkningen behöver därför väga ihop fler svar än bara det högsta området."
    ),
  };
}
