import SeoClusterGuide, { clusterMetadata } from "../_components/SeoClusterGuide";
import { clusterGuides } from "../../content/relationship-clusters";
const data = clusterGuides.stay;
export const metadata = clusterMetadata(data);
export default function Page() { return <SeoClusterGuide data={data} />; }
