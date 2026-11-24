import InformationGuide, { informationGuideMetadata } from "../_components/InformationGuide";
import { routines } from "../../content/autism-cluster";

export const metadata = informationGuideMetadata(routines);

export default function Page() {
  return <InformationGuide data={routines} />;
}
