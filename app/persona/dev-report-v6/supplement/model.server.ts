import "server-only";
import fixtures from "../../../../tests/persona/insights-v2-full-fixtures.cjs";
import { completeReport } from "../../_domain/supplement-v1/index";
export function loadSupplement(profile: string, responses: unknown) {
  const item=fixtures.find((p:{id:string})=>p.id===profile);
  if(!item||!["F21","F23","F24"].includes(profile))return null;
  return completeReport(item.answers,responses);
}
