import EditorialSurface from "../../_components/EditorialSurface";
import SeoClusterGuide, { clusterMetadata } from "../../_components/SeoClusterGuide";
import { clusterGuides } from "../../../content/relationship-clusters";
const data = clusterGuides.no;
export const metadata = clusterMetadata(data);
export default function Page() { return <EditorialSurface><SeoClusterGuide data={data} /></EditorialSurface>; }
