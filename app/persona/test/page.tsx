import PersonaFlow from "./PersonaFlow";
import { canOpenLocalReport } from "../dev-report/access";

export default async function PersonaTestPage() {
  return <PersonaFlow localReportAvailable={await canOpenLocalReport()} />;
}
