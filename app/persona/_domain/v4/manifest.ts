import { immutable } from "../immutable";
import { VERSIONS as previous } from "../v3/manifest";

export const VERSIONS = immutable({
  question: previous.question,
  report: "persona-report-v4",
  analysis: "persona-analysis-v4",
  content: previous.content,
} as const);

export const SECTION_TITLES = {
  signature: "Din PERSONA-signatur",
  portrait: "Din personlighetskärna",
  drivers: "Vad som driver dig",
  tensions: "Dina inre motsättningar",
  relationships: "Hur du fungerar i relationer",
  strengths: "Styrkor du kan använda bättre",
  blindSpots: "Dina möjliga blinda fläckar",
  compass: "Din personliga utvecklingskarta",
  practice: "Din PERSONA i praktiken",
  summary: "Ditt porträtt i korthet",
} as const;
