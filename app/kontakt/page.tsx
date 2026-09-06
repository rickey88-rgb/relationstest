import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Kontakta Relationsvarning – frågor om webbplatsen, tester och köp",
  description:
    "Kontakta Relationsvarning via support@relationsvarning.se om du har frågor om webbplatsen, våra tester eller ett köp.",
  alternates: {
    canonical: "/kontakt",
  },
};

export default function KontaktPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10 text-neutral-900 sm:px-6 sm:py-14">
      <h1 className="text-3xl font-semibold tracking-tight">Kontakta Relationsvarning</h1>
      <p className="mt-5 leading-7 text-neutral-700">
        Har du frågor om webbplatsen, våra tester eller ett köp? Du är välkommen
        att kontakta oss via e-post.
      </p>
      <a
        href="mailto:support@relationsvarning.se"
        className="mt-3 inline-flex min-h-11 max-w-full items-center break-all rounded-sm font-medium underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
      >
        support@relationsvarning.se
      </a>
      <p className="mt-6 leading-7 text-neutral-700">
        Läs också vår{" "}
        <Link href="/integritet" className="underline underline-offset-4">integritetspolicy</Link>{" "}
        och våra{" "}
        <Link href="/villkor" className="underline underline-offset-4">villkor</Link>.
      </p>
    </main>
  );
}
