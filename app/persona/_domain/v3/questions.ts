import { immutable } from "../immutable";
import type { Dimension } from "../types";
import { CHAPTER_SIZE } from "./manifest";

export const ratingLabels = immutable([
  "Stämmer inte alls", "Stämmer ganska dåligt", "Stämmer varken bra eller dåligt", "Stämmer ganska bra", "Stämmer helt",
]);
export const skippedLabel = "Hoppade över";

type CoreRow = readonly [Dimension, reverse: boolean, prompt: string, source: string];

// B: IPIP 50-item form (numbered). B20: lexical 20-item factor key.
// J: Johnson IPIP-NEO-120. F: full IPIP NEO facet key. D: IPIP NEO domain key.
// B: https://www.ipip.ori.org/New_IPIP-50-item-scale.htm
// B20: https://ipip.ori.org/newBigFive5broadKey.htm
// J: https://ipip.ori.org/30FacetNEO-PI-RItems.htm
// F: https://ipip.ori.org/newneofacetskey.htm
// D: https://ipip.ori.org/newNEOKey.htm
// The selection and Swedish adaptations are specific to PERSONA.
const core: readonly CoreRow[] = [
  ["E", false, "Jag brukar inleda samtal.", "B21"],
  ["A", true, "Jag brukar vara försiktig med att lita på andra.", "F A1: vaksamhet inför andra"],
  ["C", false, "Jag brukar göra upp en plan och hålla mig till den.", "B20 III: hålla sig till planer"],
  ["N", true, "Jag känner mig avslappnad för det mesta.", "B09"],
  ["O", false, "Jag har livlig fantasi.", "B15"],
  ["E", true, "Jag är ofta tyst bland människor jag inte känner.", "B46"],
  ["A", false, "Jag känner med andra när de har det svårt.", "B17"],
  ["C", true, "Jag glömmer ofta att lägga tillbaka saker där de hör hemma.", "B28"],
  ["N", false, "Jag oroar mig ofta.", "B14"],
  ["O", true, "Jag håller mig helst till det jag redan känner till.", "J O4: föredra det bekanta"],
  ["E", false, "Jag känner mig bekväm tillsammans med andra.", "B11"],
  ["A", true, "Jag uttrycker mig ofta vasst mot andra.", "F A4: vass tunga"],
  ["C", false, "Jag lägger märke till detaljer i det jag gör.", "B13"],
  ["N", true, "Jag brukar behålla lugnet under press.", "J N6: lugn under press"],
  ["O", false, "Jag tycker om att höra nya idéer.", "D: intresse för nya idéer"],
  ["E", true, "Jag föredrar ofta att vara för mig själv.", "J E2: föredra att vara ensam"],
  ["A", false, "Jag brukar ta mig tid för andra.", "B37"],
  ["C", true, "Jag har ofta svårt att komma igång med det jag ska göra.", "J C5: svårt att komma igång"],
  ["N", false, "Mitt humör skiftar ofta.", "B34"],
  ["O", true, "Idéer utan tydlig koppling till vardagen intresserar mig sällan.", "B20 (fråga 20): ointresse för abstrakta idéer"],
  ["E", false, "När vi ska göra något tillsammans brukar jag ta ledningen.", "J E3: ta ledningen"],
  ["A", true, "Jag har svårt att släppa en oförrätt.", "F A4: hålla fast vid groll"],
  ["C", false, "Jag håller det jag lovar.", "J C3: hålla löften"],
  ["N", true, "Jag känner mig sällan nedstämd.", "B19"],
  ["O", false, "Jag lägger märke till det vackra i små vardagliga saker.", "J O2: lägga märke till skönhet"],
  ["E", true, "Jag undviker helst att dra uppmärksamhet till mig.", "B36"],
  ["A", false, "Jag föredrar samarbete framför tävling.", "F A6: samverkan före tävlan"],
  ["C", true, "Jag agerar ofta innan jag hunnit tänka efter.", "J C6: handla utan att tänka efter"],
  ["N", false, "Jag blir lätt irriterad.", "B44"],
  ["O", true, "När jag lär mig något nytt brukar grunderna räcka för mig.", "B20 V: inte fördjupa sig"],
];

const reflections = [
  "Jag blir mer motiverad när jag själv får välja hur jag gör.",
  "Tydliga delmål hjälper mig att hålla igång.",
  "När jag berättar om något svårt vill jag helst bli lyssnad på först.",
  "Jag behöver tid innan jag berättar något personligt för någon jag just lärt känna.",
  "Jag brukar säga vad jag tycker även när någon jag bryr mig om tycker annorlunda.",
  "Jag säger ibland ja fast jag helst skulle säga nej.",
  "Jag brukar märka tidigt när jag behöver en paus.",
  "En stund för mig själv hjälper mig att varva ner.",
  "Jag visar olika sidor av mig själv beroende på vem jag är med.",
  "Jag vill bli bättre på att ge mig själv tid att tänka innan jag svarar.",
];

const questionId = (index: number) => "Q" + String(index + 1).padStart(2, "0");
export const coreQuestions = immutable(core.map(([dimension, reverse, prompt, source], i) => ({
  id: questionId(i), chapter: Math.floor(i / CHAPTER_SIZE) + 1, dimension, reverse, prompt, source,
})));
export const questions = immutable([...coreQuestions, ...reflections.map((prompt, i) => ({
  id: questionId(core.length + i), chapter: 4, prompt, source: "PERSONA-original",
}))]);
export type V3Question = typeof questions[number];
