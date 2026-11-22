import PersonaV6Report from "./PersonaV6Report";
import type { presentCompletion } from "./v61Presentation";
export type PersonaV61Purchase={product:"persona_test";reportVersion:"persona-report-v61-release1"|"persona-report-v61-release2";presentation:ReturnType<typeof presentCompletion>};
export default function PersonaV61PaidReport({report}:{report:PersonaV61Purchase}){
  return <PersonaV6Report report={report.presentation}/>;
}
