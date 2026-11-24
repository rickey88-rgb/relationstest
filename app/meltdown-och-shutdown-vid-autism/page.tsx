import InformationGuide, { informationGuideMetadata } from "../_components/InformationGuide";
import { meltdownShutdown } from "../../content/autism-cluster";

export const metadata = informationGuideMetadata(meltdownShutdown);

export default function Page() {
  return <InformationGuide data={meltdownShutdown} />;
}
