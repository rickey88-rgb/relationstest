import EditorialSurface from "../_components/EditorialSurface";
import AutismGuide, { autismMetadata } from "../_components/AutismGuide";

export const metadata = autismMetadata("maskering-autism");

export default function Page() {
  return <EditorialSurface><AutismGuide slug="maskering-autism" /></EditorialSurface>;
}
