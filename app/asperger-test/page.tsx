import EditorialSurface from "../_components/EditorialSurface";
import AutismGuide, { autismMetadata } from "../_components/AutismGuide";

export const metadata = autismMetadata("asperger-test");

export default function Page() {
  return <EditorialSurface><AutismGuide slug="asperger-test" /></EditorialSurface>;
}
