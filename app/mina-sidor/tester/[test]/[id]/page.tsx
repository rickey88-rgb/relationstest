import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { accountIdentity } from "../../../../_lib/accountHttp.server";
import { adapterForSlug } from "../../../../_lib/testAccounts/adapter";
import { openForProduct } from "../../../../_lib/testAccounts/service.server";
import ReportView from "../../ReportView";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default async function SavedTest({ params }: { params: Promise<{ test: string; id: string }> }) {
  const { test, id } = await params;
  let model;
  try { model = adapterForSlug(test); } catch { notFound(); }
  const identity = await accountIdentity();
  if (identity.kind !== "authenticated") redirect("/logga-in");
  let result;
  try { result = await openForProduct(id, identity.userId, model.product); }
  catch { return <main className="mx-auto max-w-3xl space-y-4 px-5 py-12"><h1 className="text-2xl font-semibold">Analysen är inte tillgänglig</h1><p>Den kan vara raderad, utgången eller tillfälligt otillgänglig. Ingen ny betalning behövs för att försöka igen.</p><Link href="/mina-sidor/tester">Till Mina tester</Link></main>; }
  return <main data-nosnippet className="mx-auto max-w-3xl px-5 py-12"><Link href="/mina-sidor/tester">← Mina tester</Link><h1 className="mt-6 text-3xl font-semibold">Din sparade {model.title}-analys</h1><ReportView product={model.product} result={result} /></main>;
}
