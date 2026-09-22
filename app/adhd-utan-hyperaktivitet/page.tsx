import EditorialSurface from "../_components/EditorialSurface";
import ADHDGuide, { adhdMetadata } from "../_components/ADHDGuide";

export const metadata = adhdMetadata("adhd-utan-hyperaktivitet");

export default function Page() {
  return <EditorialSurface><ADHDGuide slug="adhd-utan-hyperaktivitet" /></EditorialSurface>;
}
