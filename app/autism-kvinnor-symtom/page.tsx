import EditorialSurface from "../_components/EditorialSurface";
import AutismGuide, { autismMetadata } from "../_components/AutismGuide";

export const metadata = autismMetadata("autism-kvinnor-symtom");

export default function Page() {
  return <EditorialSurface><AutismGuide slug="autism-kvinnor-symtom" /></EditorialSurface>;
}
