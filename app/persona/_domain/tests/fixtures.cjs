const ratingIds = [[1, 9, 25], [3, 15, 29], [7, 19, 32], [12, 23, 31], [5, 17, 27]];
const scenarioIds = [2, 4, 6, 8, 10, 11, 13, 14, 16, 18, 20, 21, 22, 24, 26, 28, 30, 33, 34];
const profiles = [
  { name: "relationell-framåtrörelse", ratings: [[4,1,3],[3,3,1],[2,2,3],[4,1,4],[4,1,3]], scenarios: "BABDCAAAAABBBCACADA",
    selected: ["A01","A04","A05","A07","A12","A13"], followups: { A01:"B", A04:"B", A05:"B", A07:"C", A12:"B", A13:"C" },
    raw: [10,9,5,11,10], required: ["success-and-relationship", "recognition-precision", "support-by-agreement"] },
  { name: "tydligt-ansvar", ratings: [[3,1,3],[3,4,1],[4,3,0],[1,4,2],[1,4,1]], scenarios: "ABAAAABACBAAABBBBAC",
    selected: ["A01","A08","A11","A14","A03","A04"], followups: { A01:"C", A03:"C", A04:"C", A08:"B", A11:"C", A14:"B" },
    raw: [9,10,11,3,2], required: ["visible-responsibility", "private-support", "decision-context"] },
  { name: "öppenhet-och-gränser", ratings: [[1,3,1],[4,4,0],[1,1,4],[3,1,3],[3,1,3]], scenarios: "CDCCBCDDDCCCCACDCCB",
    selected: ["A02","A06","A09","A11","A03","A04"], followups: { A02:"D", A03:"A", A04:"D", A06:"D", A09:"C", A11:"D" },
    raw: [3,12,2,9,9], required: ["selected-audience", "delegation-and-limits", "sharing-and-trust"] },
];
function fixed(profile) {
  const answers = Array(34).fill(5);
  ratingIds.forEach((ids, dimension) => ids.forEach((id, i) => { answers[id-1] = profile.ratings[dimension][i]; }));
  scenarioIds.forEach((id, i) => { answers[id-1] = "ABCD".indexOf(profile.scenarios[i]); });
  return answers;
}
function submission(api, profile) {
  return { questionVersion: api.VERSIONS.question, reportVersion: api.VERSIONS.report,
    answers: [...fixed(profile), ...profile.selected.map(id => "ABCD".indexOf(profile.followups[id]))] };
}
module.exports = { profiles, fixed, submission, ratingIds, scenarioIds };
