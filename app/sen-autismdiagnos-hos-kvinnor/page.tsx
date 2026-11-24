import InformationGuide, { informationGuideMetadata } from "../_components/InformationGuide";
import { lateDiagnosis } from "../../content/autism-cluster";

export const metadata = informationGuideMetadata(lateDiagnosis);

export default function Page() {
  return <InformationGuide data={lateDiagnosis} />;
}
