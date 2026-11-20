/* eslint-disable @typescript-eslint/no-require-imports -- offline editorial artifacts from the exact versioned application model. */
const fs=require("node:fs"),path=require("node:path");
const root=path.resolve(__dirname,".."),out=path.join(root,".artifacts/persona-v2");fs.mkdirSync(out,{recursive:true});
const load=require("../app/autism-test/test/test-loader.cjs")();
const api=load(path.join(root,"app/persona/_domain/v2/index.ts"));
const {adaptiveRules}=load(path.join(root,"app/persona/_domain/v2/adaptive.ts"));
const {narrativeRules}=load(path.join(root,"app/persona/_domain/v2/findings.ts"));
const {experiments}=load(path.join(root,"app/persona/_domain/v2/experiments.ts"));
const {observations}=load(path.join(root,"app/persona/_domain/v2/copy.ts"));
const {profiles,fixed,submission}=require("../app/persona/_domain/tests/v2-fixtures.cjs");
const wordCount=text=>text.trim().split(/\s+/).length;
const reports=profiles.map(profile=>({name:profile.name,input:submission(api,profile),report:api.buildPersonaReport(submission(api,profile))}));
const use=new Map(api.questionBank.map(q=>[q.id,new Set()]));
function record(report){const map=new Map(report.findings.map(f=>[f.id,f]));report.sections.forEach(s=>s.paragraphs.forEach(p=>p.findingIds.forEach(id=>{const f=map.get(id);[...f.evidence,...f.counterEvidence].forEach(e=>use.get(e.questionId).add(s.title));})));}
reports.forEach(({report})=>record(report));
for(const q of api.fixedQuestions.filter(q=>q.kind==="scenario"))for(let answer=0;answer<4;answer++) {
  const answers=fixed(profiles[0]);answers[Number(q.id.slice(1))-1]=answer;
  record(api.buildPersonaReport({questionVersion:api.VERSIONS.question,reportVersion:api.VERSIONS.report,answers:[...answers,...Array(6).fill(0)]}));
}
for(const rule of adaptiveRules) {
  const answers=Array(34).fill(5);rule.conditions.forEach(c=>{answers[Number(c.questionId.slice(1))-1]=c.answers[0];});
  const at=api.selectAdaptive(answers).selectedIds.indexOf(rule.id);if(at<0)throw Error("Unreachable adaptive item");
  for(let answer=0;answer<4;answer++){const input={questionVersion:api.VERSIONS.question,reportVersion:api.VERSIONS.report,answers:[...answers,...Array(6).fill(0)]};input.answers[34+at]=answer;record(api.buildPersonaReport(input));}
}
const questionWords=api.questionBank.map(q=>wordCount(q.prompt)),answerWords=api.questionBank.flatMap(q=>q.options.map(wordCount));
const stats={versions:api.VERSIONS,fixed:34,adaptiveBank:18,adaptivePerRun:6,totalPerRun:40,fixedScenarios:19,ratings:15,scenarioShare:25/40,
  promptWords:{min:Math.min(...questionWords),max:Math.max(...questionWords),average:questionWords.reduce((a,b)=>a+b,0)/questionWords.length},
  answerWords:{min:Math.min(...answerWords),max:Math.max(...answerWords),average:answerWords.reduce((a,b)=>a+b,0)/answerWords.length}};
fs.writeFileSync(path.join(out,"metrics.json"),JSON.stringify(stats,null,2));
const matrix=api.questionBank.map(q=>({...q,words:wordCount(q.prompt),answerWords:q.options.map(wordCount),observedReportSections:[...use.get(q.id)],interpretations:observations[q.id]??null}));
fs.writeFileSync(path.join(out,"bank.json"),JSON.stringify({versions:api.VERSIONS,questions:matrix},null,2));
let bank="# PERSONA v2 – hela frågebanken och svarstolkningarna\n\n";
bank+="34 fasta frågor och 18 möjliga följdfrågor. Exakt sex följdfrågor väljs: en omgång är 40 frågor. Alla frågor har fyra ordinarie svar; Svårt att bedöma (kod 5) finns separat.\n\n";
bank+="Alla situationer och påståenden är nyskrivna. Big Five-begreppen är en orienteringsram, inte en validering av dessa frågor. Situationssvar ger inga poäng för att vara en bättre människa.\n\n";
bank+="## Granskningsmatris\n\nRapportkolumnen visar faktisk användning i de fem profilerna och täckningsgranskningen av alla situationsalternativ, inte bara deklarerad metadata.\n\n| ID | Kapitel | Fråga | Format | Ord | Svarsord | Psykologiskt syfte | Rapportspår |\n| --- | --- | --- | --- | --- | --- | --- | --- |\n";
for(const q of matrix)bank+=`| ${q.id} | ${q.chapter} | ${q.title} | ${q.kind==="rating"?"Egen fyrgradig indikator":"Vardagsscenario"} | ${q.words} | ${Math.min(...q.answerWords)}–${Math.max(...q.answerWords)} | ${q.purpose} | ${q.observedReportSections.join(", ")} |\n`;
for(const chapter of api.CHAPTERS) {
  bank+=`\n## ${chapter.id}. ${chapter.title}\n\n`;
  if(chapter.id===4)bank+="Nedan är hela banken. Användaren får endast de sex som servern rekonstruerar från tidigare svar.\n\n";
  for(const q of matrix.filter(q=>q.chapter===chapter.id)) {
    bank+=`### ${q.id} – ${q.title}\n\n${q.prompt}\n\nSyfte: ${q.purpose}\n\n`;
    q.options.forEach((answer,i)=>{bank+=`${String.fromCharCode(65+i)}. **${answer}**\n\n`;if(q.interpretations)bank+=`Tolkning: ${q.interpretations[i]}\n\n`;else bank+=`Kod: ${q.reverse?3-i:i} efter ${q.reverse?"omvänd":"rak"} kodning inom ${q.dimension}. Ett enskilt svar blir ingen personlig slutsats.\n\n`;});
    bank+="Separat: **Svårt att bedöma**. Ingen personlig tolkning eller mittpoäng fylls i.\n\n";
  }
}
fs.writeFileSync(path.join(out,"fragor-och-tolkningar.md"),bank);
const conditions=items=>items.map(c=>`${c.questionId}: ${c.answers.map(a=>`[${a}] ${api.getQuestion(c.questionId).options[a]}`).join(" ELLER ")}`).join("; OCH ");
let rules="# PERSONA v2 – kodning, adaptivitet och rapportlogik\n\n";
rules+="## Kodning och tolkningsgränser\n\nFyrgradiga egna frekvensindikatorer kodas 0–3. Omvända påståenden kodas 3−svar. UNKNOWN=5 är saknat underlag, inte en femte skalnivå; 4 är ogiltig kod.\n\n";
rules+="Varje dimension har tre indikatorer. Med tre svar: råsumma 0–3 ger lägre riktning, 4–5 mellanläge, 6–9 högre riktning. Två svar ger begränsat underlag utan samlad riktning; noll/ett ger inget numeriskt värde. Visuellt internt värde = råsumma/(antal bedömbara × 3) × 100, avrundat till en decimal. Skillnad minst två skalsteg flaggas som varierade sammanhang. Detta är redaktionella, icke validerade tolkningsregler, inga psykometriska eller kliniska cutoffs.\n\n";
for(const dimension of api.scoreDimensions(fixed(profiles[0])))rules+=`- ${dimension.name}: ${api.fixedQuestions.filter(q=>q.dimension===dimension.dimension).map(q=>q.id+(q.reverse?" (omvänd)":"")).join(", ")}.\n`;
rules+="\nEndast de 15 strukturerade frågorna påverkar dimensionsvärdena. Scenarier och adaptiva frågor bildar den egna situations-/reflektionsmodellen. En rapport får säljas först vid minst tio bedömbara fasta scenarier och minst fyra dimensioner med minst två svar. Detta är en produktgräns för tillräcklig textgrund, inte vetenskaplig säkerhet.\n\n";
rules+="## Adaptivt urval\n\nFör varje kandidat: två träffade ingångar ger 9 relevanspoäng, en ger 3, ingen ger 0. Osäkerhet matchar aldrig. Alla kombinationer om sex prövas deterministiskt. Summan maximeras med minst tre teman och högst tre frågor från ett tema. Vid lika poäng väljs först fler teman och sedan lexikografiskt lägst ID-kombination. Visningsordning: fallande relevans, sedan ID. Det finns ingen obligatorisk en-fråga-per-kategori-regel. Servern återskapar urvalet; klienten får inte skicka valda ID:n eller scores. Reservval beskrivs som breddning, inte som en funnen personlig signal.\n\n";
for(const rule of adaptiveRules)rules+=`- **${rule.id} – ${api.getQuestion(rule.id).title}** (${rule.theme}): ${conditions(rule.conditions)}.\n`;
rules+="\n## Sexton belagda kombinationer\n\nAlla villkor måste vara uppfyllda. En borttagen premiss eller ett osäkert svar får kombinationen att falla. Texten generaliserar inte från ett enda svar till ett helt personlighetsdrag.\n\n";
for(const rule of narrativeRules)rules+=`### ${rule.id} – ${rule.title}\n\n${conditions(rule.conditions)}\n\n${rule.text}\n\n${rule.counters?"Nyanserande underlag: "+conditions(rule.counters)+"\n\n":""}`;
rules+="## Personlig kompass, tillgång och möjlig kostnad\n\nHögst tre experiment väljs. Båda situationsvillkoren måste matcha; rangordning är antal belagda premisser, därefter versionerad redaktionell ordning. Ingen strategi tillskrivs användaren som en redan befintlig förmåga.\n\n";
for(const experiment of experiments)rules+=`### ${experiment.id} – ${experiment.title}\n\n${conditions(experiment.conditions)}\n\nTillgång: ${experiment.opportunity}\n\nMöjlig kostnad: ${experiment.tradeoff}\n\nPröva: ${experiment.action}\n\nReflektion: ${experiment.reflection}\n\n`;
rules+="## Åtta avsnitt\n\nPorträttet väljer upp till tre belagda kombinationer med spritt svarunderlag, kompletterat med enskilda val när det behövs. Signaturen är rubriken för en belagd kombination eller en uttryckligt vald situation. Dimensionerna hålls separata. Drivkrafter och relationella mönster återger samtliga relevanta fasta och adaptiva observationer. Självbildsfrågor och stödda spänningar finns i Inre motsägelser, utan att skillnader kallas falskhet. Styrkor/blinda fläckar och kompassen använder endast matchade experiment. Alla 19 fasta och alla valda adaptiva scenariers svar har synlig egen tolkning.\n\n";
rules+="Varje personligt stycke har finding-ID:n som pekar på verkliga svar. Inga omedvetna motiv, livshändelser, barndomsförklaringar eller diagnoser fylls i. Inget underlag ger endast metodtexter och en begränsad förhandsvisning. Publik frågemodul och privata premiumtolkningar hålls i olika beroendegrafer.\n";
fs.writeFileSync(path.join(out,"analysregler.md"),rules);
let examples="# PERSONA v2 – fem testsvarsprofiler\n\nFiktiva kontrastfall för kvalitetskontroll, inte fem användartyper. Namnen matas aldrig in i analysmotorn. Alla åtta avsnitt har olika innehåll mellan profilerna.\n\n| Testsvarsprofil | Signatur från motorn | Följdfrågor | Personliga experiment |\n| --- | --- | --- | --- |\n";
reports.forEach(({name,input,report},i)=>{
  fs.writeFileSync(path.join(out,`profil-${i+1}.json`),JSON.stringify({synthetic:true,name,input,report},null,2));
  examples+=`| ${name} | ${report.sections[1].paragraphs[0].text} | ${report.selection.selectedIds.join(", ")} | ${report.sections[7].paragraphs.filter(p=>p.scope==="experiment").length} |\n`;
});
for(const {name,report} of reports)examples+=`\n## ${name}\n\n${report.sections[0].paragraphs.filter(p=>p.scope==="personal").map(p=>p.text).join("\n\n")}\n\nInterna dimensionsvärden: ${report.dimensions.map(d=>`${d.name} ${d.value}`).join("; ")}. Ingen normjämförelse.\n`;
fs.writeFileSync(path.join(out,"fem-profiler.md"),examples);
console.log(JSON.stringify(stats));
