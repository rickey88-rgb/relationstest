import SeoClusterGuide, { clusterMetadata } from "../_components/SeoClusterGuide";
import { relationshipGaps } from "../../content/relationship-gaps";
const data = relationshipGaps.rebuilding;
export const metadata = clusterMetadata(data);
export default function Page() { return <SeoClusterGuide data={data} />; }
