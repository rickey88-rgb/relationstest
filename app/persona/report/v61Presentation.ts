import type { Completion } from "../_domain/release-v61/manifest";
import { presentReport } from "./presentation";
export function presentCompletion(result:Completion){
  const original=presentReport(result.baseReport);
  return {...original,method:[original.method,result.methodNote].filter(Boolean).join(" "),
    sections:original.sections.map(section=>{
      const updated=result.sections.find(s=>s.id===section.id)!;
      return {...section,note:updated.note,blocks:[...section.blocks,...updated.additions.map(a=>({
        title:a.title,interpretation:a.text,observation:undefined,example:undefined,adviceReason:undefined,limitations:[a.limitation],
      }))]};
    })};
}
