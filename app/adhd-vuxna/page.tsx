import EditorialSurface from "../_components/EditorialSurface";
import ADHDGuide, { adhdMetadata } from "../_components/ADHDGuide";

export const metadata = adhdMetadata("adhd-vuxna");

export default function Page() {
  return <EditorialSurface><ADHDGuide slug="adhd-vuxna" /></EditorialSurface>;
}
