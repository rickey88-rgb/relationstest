import EditorialSurface from "../_components/EditorialSurface";
import ADHDGuide, { adhdMetadata } from "../_components/ADHDGuide";

export const metadata = adhdMetadata("adhd-symtom-vuxna");

export default function Page() {
  return <EditorialSurface><ADHDGuide slug="adhd-symtom-vuxna" /></EditorialSurface>;
}
