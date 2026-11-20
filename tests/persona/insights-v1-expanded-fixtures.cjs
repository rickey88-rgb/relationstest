/* eslint-disable @typescript-eslint/no-require-imports -- additional synthetic fixtures */
const original = require("./insights-v1-fixtures.cjs");
const profile = (name, values) => {
  const answers = Array(40).fill(3);
  for (const [number, answer] of Object.entries(values)) answers[Number(number) - 1] = answer;
  return { name, answers };
};

module.exports = [
  ...original,
  profile("Leder gärna men undviker uppmärksamhet", { 21: 5, 26: 5, 11: 4 }),
  profile("Medkännande med långsam tillit", { 7: 5, 2: 5, 34: 4, 17: 4 }),
  profile("Nya idéer med praktisk koppling", { 15: 5, 20: 4, 13: 4, 10: 4 }),
  profile("Fantasi och blick för detaljer", { 5: 5, 13: 4, 25: 5 }),
  profile("Orolig och lugn under press", { 9: 5, 14: 5, 37: 4, 4: 4 }),
  profile("Återhämtning utan tidiga paussignaler", { 9: 4, 37: 1, 38: 5 }),
  profile("Samarbetsvillig med egen uppfattning", { 27: 5, 35: 5, 12: 1, 7: 4 }),
  profile("Håller löften men har svårt att starta", { 23: 5, 18: 4, 32: 5, 3: 4 }),
  profile("Egen riktning med eftertanke", { 31: 5, 35: 4, 28: 1 }),
  profile("Svag idéprofil utan sammanhängande stöd", { 15: 4, 5: 3, 18: 3, 13: 2, 20: 3 }),
  profile("Ofullständig relationsprofil", { 7: 5, 2: 4, 34: null, 17: 4 }),
  profile("Brett ja-mönster med flera tolkningar", Object.fromEntries(Array.from({ length: 40 }, (_, index) => [index + 1, 5]))),
  profile("Motriktat stöd för genomförande", { 31: 5, 32: 4, 3: 5, 23: 1 }),
  profile("Två närliggande starttolkningar", { 15: 5, 18: 5, 5: 5, 32: 5, 23: 5 }),
];
