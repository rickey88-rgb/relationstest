import { immutable } from "./immutable";
export { TOTAL_COUNT } from "./v3/manifest";
export { VERSIONS } from "./v5/manifest";
export { PRICE_SEK } from "./v2/manifest";

export const CHAPTERS = immutable([
  { id: 1, title: "I vardagen", count: 10 },
  { id: 2, title: "Bland andra", count: 10 },
  { id: 3, title: "Fler sidor av dig", count: 10 },
  { id: 4, title: "Det som hjälper dig", count: 10 },
] as const);
