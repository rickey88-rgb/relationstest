/* Isolated raw-answer profiles. Names never enter the analysis API. */
const profile = (name, values) => {
  const answers = Array(40).fill(3);
  for (const [number, answer] of Object.entries(values)) answers[Number(number) - 1] = answer;
  return { name, answers };
};

module.exports = [
  profile("Social och utåtriktad", { 1: 5, 11: 5, 21: 4, 16: 4, 38: 5 }),
  profile("Självständig och eftertänksam", { 31: 5, 32: 4, 3: 4, 23: 5, 35: 5, 36: 4, 40: 5, 28: 1, 16: 5 }),
  profile("Strukturerad men stresskänslig", { 3: 5, 9: 5, 13: 4, 23: 5, 37: 4, 4: 2, 14: 2 }),
  profile("Idérik men svårstartad", { 5: 5, 15: 5, 18: 5, 32: 4, 3: 2 }),
  profile("Blandad och motsägelsefull", { 3: 5, 9: 5, 13: 4, 23: 5, 4: 5, 14: 5, 7: 5, 17: 4, 27: 4, 36: 5, 35: 5, 40: 4, 28: 1 }),
  profile("Neutral med svaga signaler", {}),
];
