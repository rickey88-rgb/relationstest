import InformationGuide, { informationGuideMetadata } from "../_components/InformationGuide";
import { friendship } from "../../content/autism-cluster";

export const metadata = informationGuideMetadata(friendship);

export default function Page() {
  return <InformationGuide data={friendship} />;
}
