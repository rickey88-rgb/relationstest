import InformationGuide, { informationGuideMetadata } from "../_components/InformationGuide";
import { sensorySensitivity } from "../../content/autism-cluster";

export const metadata = informationGuideMetadata(sensorySensitivity);

export default function Page() {
  return <InformationGuide data={sensorySensitivity} />;
}
