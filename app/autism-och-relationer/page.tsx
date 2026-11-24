import InformationGuide, { informationGuideMetadata } from "../_components/InformationGuide";
import { relationships } from "../../content/autism-cluster";

export const metadata = informationGuideMetadata(relationships);

export default function Page() {
  return <InformationGuide data={relationships} />;
}
