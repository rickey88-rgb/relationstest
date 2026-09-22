import EditorialSurface from "../_components/EditorialSurface";
import ADHDGuide, { adhdMetadata } from "../_components/ADHDGuide";

export const metadata = adhdMetadata("add-test");

export default function Page() {
  return <EditorialSurface><ADHDGuide slug="add-test" /></EditorialSurface>;
}
