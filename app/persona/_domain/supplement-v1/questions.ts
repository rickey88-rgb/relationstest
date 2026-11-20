import { immutable } from "../immutable";
export const QUESTIONS = immutable([
  { id: "S01", prompt: "Vad passar bäst in på hur du svarade på de första frågorna?",
    purpose: "Förstå innebörden i skattningarna utan att ändra dem.", reportUse: "Kort metodnyans, aldrig en ny personlighetsegenskap.",
    options: [
      { id: "fits", label: "Svaren beskriver mig ungefär som jag brukar vara." },
      { id: "context", label: "Jag är olika i olika situationer." },
      { id: "uncertain", label: "Flera påståenden var svåra att bedöma." },
      { id: "other", label: "Ingen av beskrivningarna passar riktigt." },
    ] },
  { id: "S02", prompt: "I vilket sammanhang blir det oftast lättast för dig att säga det du vill?",
    purpose: "Ge sociala preferenser ett självuppgivet sammanhang.", reportUse: "Relationsperspektiv tillsammans med en självvald prioritering i S04.",
    options: [
      { id: "one", label: "Med en person i taget." },
      { id: "familiar", label: "Bland människor jag känner väl." },
      { id: "writing", label: "När jag kan skriva i lugn och ro." },
      { id: "spontaneous", label: "I ett spontant samtal." },
      { id: "no-difference", label: "Sammanhanget gör ingen tydlig skillnad." },
      { id: "uncertain", label: "Det vet jag inte riktigt." },
    ] },
  { id: "S03", prompt: "Tänk på något litet du nyligen hanterade bra. Vad hjälpte mest just då?",
    purpose: "Hitta en självuppgiven resurs i ett avgränsat tillfälle.", reportUse: "Situationsbunden styrka; inget påstående om generell förmåga.",
    options: [
      { id: "listened", label: "Jag lyssnade innan jag bestämde mig." },
      { id: "small-step", label: "Jag tog ett litet steg i taget." },
      { id: "asked", label: "Jag bad om hjälp eller ett förtydligande." },
      { id: "alternative", label: "Jag prövade ett annat sätt." },
      { id: "no-example", label: "Jag kommer inte på något exempel just nu." },
      { id: "uncertain", label: "Jag vet inte vad som hjälpte." },
    ] },
  { id: "S04", prompt: "Vad vill du helst ge lite utrymme åt i vardagen just nu?",
    purpose: "Förankra ett försök i personens egen prioritering.", reportUse: "Konkret råd kombinerat med resursen i S03; relationskoppling till S02.",
    options: [
      { id: "voice", label: "Få fram vad jag själv vill." },
      { id: "pause", label: "Ge mig tid innan jag tackar ja." },
      { id: "start", label: "Komma igång med något jag vill göra." },
      { id: "connection", label: "Ge en kontakt jag uppskattar mer plats." },
      { id: "preserve", label: "Bevara en liten rutin som fungerar." },
      { id: "none", label: "Jag vill inte välja något att förändra nu." },
      { id: "uncertain", label: "Det vet jag inte ännu." },
    ] },
] as const);
export type SupplementId = typeof QUESTIONS[number]["id"];
export type SupplementAnswers = Partial<Record<SupplementId, string>>;
export function parseAnswers(input: unknown): SupplementAnswers {
  if (!input || typeof input !== "object" || Array.isArray(input)) throw Error("Invalid supplementary answers");
  const result: SupplementAnswers = {};
  for (const [key,value] of Object.entries(input)) {
    const question = QUESTIONS.find(q => q.id === key);
    if (!question || typeof value !== "string" || (value !== "skip" && !question.options.some(o => o.id === value)))
      throw Error("Invalid supplementary option");
    result[question.id] = value;
  }
  return immutable(result);
}
