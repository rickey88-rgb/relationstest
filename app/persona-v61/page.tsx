import { notFound } from "next/navigation";
import PersonaV61Flow from "./PersonaV61Flow";
export const dynamic = "force-dynamic";
export default function Page() {
  if(process.env.TEST_ACCOUNTS_PERSONA_V61_ENABLED!=="true") notFound();
  return <PersonaV61Flow />;
}
