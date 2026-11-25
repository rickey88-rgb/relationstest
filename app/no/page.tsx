import { permanentRedirect } from "next/navigation";
import { norwegian } from "../_content/market";

export default function Page() {
  permanentRedirect(norwegian.test);
}
