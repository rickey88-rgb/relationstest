import InformationGuide, { informationGuideMetadata } from "../_components/InformationGuide";
import { socialFatigue } from "../../content/autism-cluster";

export const metadata = informationGuideMetadata(socialFatigue);

export default function Page() {
  return <InformationGuide data={socialFatigue} />;
}
