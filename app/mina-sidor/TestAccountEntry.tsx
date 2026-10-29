import Link from "next/link";
import { flags, registeredAdapters } from "../_lib/testAccounts/adapter";
export default function TestAccountEntry() {
  const enabled = registeredAdapters().filter(model => flags(model.product).read || flags(model.product).save);
  if (!enabled.length) return null;
  return <p><Link className="underline" href="/mina-sidor/tester">{enabled.length === 1 && enabled[0].product === "adhd_test" ? "Mina tester – sparade ADHD-analyser och köp →" : "Mina tester – sparade analyser och köp →"}</Link></p>;
}
