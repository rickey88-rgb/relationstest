import EditorialSurface from "../_components/EditorialSurface";
import ADHDGuide, { adhdMetadata } from "../_components/ADHDGuide";

export const metadata = adhdMetadata("adhd-i-vardagen");

export default function Page() {
  return <EditorialSurface><ADHDGuide slug="adhd-i-vardagen" /></EditorialSurface>;
}
