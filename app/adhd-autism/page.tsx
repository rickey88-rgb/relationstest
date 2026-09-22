import EditorialSurface from "../_components/EditorialSurface";
import AutismGuide, { autismMetadata } from "../_components/AutismGuide";

export const metadata = autismMetadata("adhd-autism");

export default function Page() {
  return <EditorialSurface><AutismGuide slug="adhd-autism" /></EditorialSurface>;
}
