import InformationGuide, { informationGuideMetadata } from "../_components/InformationGuide";
import { audhdSupportGuides } from "../_content/audhdSupportGuides";

const data = audhdSupportGuides["audhd-och-somn"];

export const metadata = informationGuideMetadata(data);

export default function Page() {
  return <InformationGuide data={data} />;
}
