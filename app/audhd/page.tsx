import EditorialSurface from "../_components/EditorialSurface";
import SeoClusterGuide, { clusterMetadata } from "../_components/SeoClusterGuide";
import { audhdGuides } from "../_content/audhdGuides";
export const metadata = clusterMetadata(audhdGuides.audhd);
export default function Page() { return <EditorialSurface><SeoClusterGuide data={audhdGuides.audhd} /></EditorialSurface>; }
