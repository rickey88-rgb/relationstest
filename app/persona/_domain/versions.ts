import { immutable } from "./immutable";
export { VERSIONS, UNKNOWN, FIXED_COUNT, ADAPTIVE_COUNT, TOTAL_COUNT, PRICE_SEK } from "./v2/manifest";
export const CHAPTERS = immutable([
  { id: 1, title: "Den andra ser", count: 10 },
  { id: 2, title: "När det verkligen gäller", count: 12 },
  { id: 3, title: "Den du sällan visar", count: 12 },
  { id: 4, title: "Din personliga kod", count: 6 },
] as const);
