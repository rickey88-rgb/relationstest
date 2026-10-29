import Link from "next/link";
import { redirect } from "next/navigation";
import { accountIdentity } from "../../../../_lib/accountHttp.server";
import { open } from "../../../../_lib/testAccounts/service.server";
import AdhdReport from "../../../../adhd-test/test/AdhdReport";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function SavedAdhd({ params }: { params: Promise<{ id: string }> }) {
  const identity = await accountIdentity();
  if (identity.kind !== "authenticated") redirect("/logga-in");
  let result;
  try { result = await open((await params).id, identity.userId); } catch { return <main className="mx-auto max-w-3xl px-5 py-12"><h1 className="text-2xl font-semibold">Analysen är inte tillgänglig</h1><p className="mt-4">Den kan vara raderad, utgången eller tillfälligt otillgänglig. Ingen ny betalning behövs för att försöka igen.</p><Link href="/mina-sidor/tester">Till Mina tester</Link></main>; }
  return <main data-nosnippet className="mx-auto max-w-3xl px-5 py-12"><Link href="/mina-sidor/tester">← Mina tester</Link><h1 className="mt-6 text-3xl font-semibold">Din sparade ADHD-analys</h1><AdhdReport result={result} /></main>;
}
