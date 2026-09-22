import EditorialSurface from "../_components/EditorialSurface";
import SeoClusterGuide, { clusterMetadata } from "../_components/SeoClusterGuide";
import { relationshipGaps } from "../../content/relationship-gaps";
const data = relationshipGaps.arguments;
export const metadata = clusterMetadata(data);
export default function Page() { return <EditorialSurface><SeoClusterGuide data={data} /></EditorialSurface>; }
