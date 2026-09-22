import EditorialSurface from "../_components/EditorialSurface";
import AutismGuide, { autismMetadata } from "../_components/AutismGuide";

export const metadata = autismMetadata("har-jag-autism");

export default function Page() {
  return <EditorialSurface><AutismGuide slug="har-jag-autism" /></EditorialSurface>;
}
