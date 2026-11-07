// Deliberately authored synthetic choices, not personality types.
const ratingIds=[[1,9,25],[3,15,29],[7,19,32],[12,23,31],[5,17,27]];
const scenarioIds=[2,4,6,8,10,11,13,14,16,18,20,21,22,24,26,28,30,33,34];
function profile(name,ratings,scenarios,followups,required){return {name,ratings,scenarios,followups:Object.fromEntries(followups.map((value,i)=>["A"+String(i+1).padStart(2,"0"),"ABCD"[value]])),required};}
const profiles=[
  profile("Öppen samhörighet",[[3,0,3],[3,3,0],[2,2,1],[3,0,3],[2,1,2]],
    [0,0,3,2,0,1,3,2,1,0,1,2,2,0,0,1,3,1,0],
    [3,0,1,2,2,0,0,2,2,1,0,3,0,2,0,3,0,1],["own-path-together","say-the-need"]),
  profile("Egen riktning",[[0,3,0],[1,2,2],[3,3,0],[1,3,1],[0,3,0]],
    [0,1,1,0,1,2,0,0,2,1,2,0,3,2,2,2,1,0,2],
    [1,1,0,3,1,0,1,1,1,3,1,1,2,3,3,2,2,0],["own-measure","clear-ground","closeness-with-door"]),
  profile("Varsam tillit",[[1,2,1],[1,1,3],[3,3,0],[2,1,2],[2,0,3]],
    [3,3,2,1,2,0,2,1,0,3,3,3,3,1,3,3,0,3,1],
    [0,3,2,0,0,2,0,3,0,1,0,0,3,0,1,0,0,1],["trust-in-steps","earlier-promise"]),
  profile("Rörlig livslust",[[3,0,3],[3,3,0],[0,0,3],[2,1,2],[1,3,1]],
    [1,2,0,3,3,3,1,3,3,0,1,1,1,3,2,0,0,2,0],
    [1,2,3,2,3,1,3,2,2,2,3,2,1,2,2,1,1,3],["room-for-discovery","gentle-opening"]),
  profile("Närhet och eget skydd",[[2,2,1],[3,2,1],[3,1,3],[3,2,1],[3,0,3]],
    [2,0,3,3,0,0,0,2,0,2,0,2,2,2,1,3,3,3,0],
    [3,2,0,1,2,0,1,0,3,0,2,1,3,1,3,0,1,2],["closeness-with-door","want-and-retreat"]),
];
const selections=[
 ["A04","A09","A10","A13","A15","A01"],["A06","A07","A11","A14","A01","A16"],
 ["A01","A05","A06","A07","A12","A18"],["A02","A09","A10","A12","A15","A17"],["A01","A04","A08","A11","A14","A16"],
];
profiles.forEach((item,index)=>{item.selected=selections[index];});
function fixed(profile){const answers=Array(34).fill(5);ratingIds.forEach((ids,d)=>ids.forEach((id,i)=>{answers[id-1]=profile.ratings[d][i];}));scenarioIds.forEach((id,i)=>{answers[id-1]=profile.scenarios[i];});return answers;}
function submission(api,profile){const answers=fixed(profile);return {questionVersion:api.VERSIONS.question,reportVersion:api.VERSIONS.report,answers:[...answers,...api.selectAdaptive(answers).selectedIds.map(id=>"ABCD".indexOf(profile.followups[id]))]};}
module.exports={profiles,fixed,submission,ratingIds,scenarioIds};
