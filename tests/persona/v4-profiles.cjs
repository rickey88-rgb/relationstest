/* Synthetic review profiles. */
const profiles = [
  { name: "Social och utåtriktad", axes: { E: 1, O: 1 }, context: [31], expected: "social-motion" },
  { name: "Introvert och självständig", axes: { E: -1, O: 1 }, context: [31, 38], expected: "private-track" },
  { name: "Strukturerad och analytisk", axes: { C: 1, O: 1 }, context: [31, 32], expected: "explore-then-build" },
  { name: "Spontan och kreativ", axes: { C: -1, O: 1 }, context: [31], expected: "wide-then-light" },
  { name: "Känslomässigt reaktiv", axes: { N: 1, C: -1 }, context: [40], expected: "respond-fast" },
  { name: "Emotionellt stabil", axes: { N: -1, C: 1 }, context: [32], expected: "steady-execution" },
  { name: "Samarbetsinriktad", axes: { E: 1, A: 1 }, context: [33], expected: "bring-people-along" },
  { name: "Självständig och ifrågasättande", axes: { A: -1, N: -1 }, context: [35], expected: "calm-boundary" },
  { name: "Blandad med tydliga spänningar", axes: {}, context: [3, 18, 32, 35, 36, 40], expected: "start-versus-course" },
  { name: "Neutral med svaga signaler", axes: {}, context: [], expected: undefined },
];

function submission(api, profile) {
  const answers = [...api.coreQuestions.map((question, index) => {
    const direction = profile.axes[question.dimension] ?? 0;
    const keyed = 3 + direction * (index % 2 ? 1 : 2);
    return question.reverse ? 6 - keyed : keyed;
  }), ...Array(10).fill(3)];
  for (const number of profile.context) answers[number - 1] = 5;
  return { questionVersion: api.VERSIONS.question, reportVersion: api.VERSIONS.report, answers };
}

module.exports = { profiles, submission };
