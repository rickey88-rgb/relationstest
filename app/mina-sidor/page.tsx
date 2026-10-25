import { redirect } from "next/navigation";
import { LOGIN_PATH } from "../_lib/authConfig.server";
import { authenticatedUser } from "../_lib/authSession.server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MyPages() {
  let user = null;
  try {
    user = await authenticatedUser();
  } catch {
    redirect(`${LOGIN_PATH}?status=unavailable`);
  }
  if (!user) redirect(LOGIN_PATH);

  return (
    <main className="mx-auto min-h-screen max-w-3xl px-5 py-16">
      <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Relationsvarning.se</p>
      <h1 className="mt-3 text-3xl font-semibold">Mina sidor</h1>
      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Du är inloggad</h2>
        <p className="mt-3 leading-7 text-neutral-700">Köphistorik och personliga resultat kopplas till konton i nästa steg. Inga tidigare köp eller testresultat har ändrats.</p>
        <form action="/logga-ut" method="post" className="mt-6">
          <button className="rounded-xl border border-neutral-400 px-5 py-3 font-semibold" type="submit">Logga ut</button>
        </form>
      </section>
    </main>
  );
}
