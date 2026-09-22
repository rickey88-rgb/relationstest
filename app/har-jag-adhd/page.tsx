import EditorialSurface from "../_components/EditorialSurface";
import ADHDGuide, { adhdMetadata } from "../_components/ADHDGuide";

export const metadata = adhdMetadata("har-jag-adhd");

export default function Page() {
  return <EditorialSurface><ADHDGuide slug="har-jag-adhd" /></EditorialSurface>;
}
