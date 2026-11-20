import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canOpenLocalReport } from "../../dev-report/access";
import PersonaV6Report, { presentReport } from "../PersonaV6Report";
import styles from "../preview.module.css";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"PERSONA – lokal komplettering",robots:{index:false,follow:false}};
export default async function SupplementPreview({searchParams}:{searchParams:Promise<Record<string,string|string[]|undefined>>}) {
  if(process.env.NODE_ENV!=="development"||!(await canOpenLocalReport()))notFound();
  const params=await searchParams,profile=params.profile??"F21";
  if(typeof profile!=="string"||!["F21","F23","F24"].includes(profile))notFound();
  const responses:Record<string,string>={};
  for(const id of ["S01","S02","S03","S04"]) {
    const value=params[id];
    if(Array.isArray(value))notFound();
    if(value!==undefined)responses[id]=value;
  }
  const {loadSupplement}=await import("./model.server");
  let result:ReturnType<typeof loadSupplement>;
  try{result=loadSupplement(profile,responses);}catch{notFound();}
  if(!result)notFound();
  const report=presentReport(result.baseReport);
  const presentation={...report,method:[report.method,result.methodNote].filter(Boolean).join(" "),sections:report.sections.map(section=>{
    const updated=result.sections.find(s=>s.id===section.id)!;
    return {...section,note:updated.note,blocks:[...section.blocks,...updated.additions.map(a=>({
      title:a.title,interpretation:a.text,observation:undefined,example:undefined,adviceReason:undefined,limitations:[a.limitation],
    }))]};
  })};
  return <>
    <aside className={styles.toolbar} aria-label="Isolerad kompletteringsgranskning">
      <p><strong>Lokal komplettering · enbart syntetiska profiler</strong><br />
        Före: {result.before.state}. Efter: {result.after.state}. Ingen betalning erbjuds i denna förhandsgranskning.</p>
      <p role="status">{result.offer.description}</p>
      <form action="/persona/dev-report-v6/supplement" method="get">
        <label>Testprofil<select name="profile" defaultValue={profile}>
          {["F21","F23","F24"].map(id=><option key={id} value={id}>{id}</option>)}
        </select></label>
        {result.offeredQuestions.map(q=><label key={q.id}>{q.prompt}
          <select name={q.id} defaultValue={responses[q.id]??"skip"}>
            <option value="skip">Hoppa över / vill inte svara</option>
            {q.options.map(option=><option key={option.id} value={option.id}>{option.label}</option>)}
          </select>
        </label>)}
        <button type="submit">Visa vad svaren tillför</button>
      </form>

    </aside>
    {result.freeResult?<section className={styles.toolbar} aria-labelledby="free-result-title">
      <h1 id="free-result-title">{result.freeResult.title}</h1>
      <p>{result.freeResult.text}</p>
      {result.additions[0]&&<p>{result.additions[0].text}</p>}
      <p>{result.freeResult.explanation}</p>
      {result.methodNote&&<p>{result.methodNote}</p>}
    </section>:<PersonaV6Report report={presentation}/>}
  </>;
}
