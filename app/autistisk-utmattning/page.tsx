import InformationGuide, { informationGuideMetadata } from "../_components/InformationGuide";
import { autisticBurnout } from "../../content/autism-cluster";

export const metadata = informationGuideMetadata(autisticBurnout);

export default function Page() {
  return <InformationGuide data={autisticBurnout} />;
}
