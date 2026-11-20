import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canOpenLocalReport } from "../dev-report/access";
import PersonaV6Report, { presentReport } from "./PersonaV6Report";
import styles from "./preview.module.css";

export const metadata: Metadata = {
  title: "PERSONA V6.1 – lokal förhandsgranskning",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

export default async function PersonaV6Preview({ searchParams }: {
  searchParams: Promise<{ profile?: string | string[] }>;
}) {
  // Fail before loading fixtures/generating content, even with opt-in in a production build.
  if (process.env.NODE_ENV !== "development" || !(await canOpenLocalReport())) notFound();
  const { profile = "F01" } = await searchParams;
  if (typeof profile !== "string" || !/^F(?:0[1-9]|1[0-9]|2[0-4])$/.test(profile)) notFound();
  const { previewProfiles, reportForProfile } = await import("./profiles.server");
  const report = reportForProfile(profile);
  if (!report) notFound();
  return <>
    <aside className={styles.toolbar} aria-label="Lokal rapportgranskning">
      <p><strong>Lokal förhandsgranskning · PERSONA V6.1</strong><br />Endast konstruerade testprofiler. Inga kundresultat eller köp används.</p>
      <form action="/persona/dev-report-v6" method="get">
        <label>Välj testprofil<select name="profile" defaultValue={profile}>
          {previewProfiles.map(item => <option key={item.id} value={item.id}>{item.id} – {item.name}</option>)}
        </select></label>
        <button type="submit">Visa rapport</button>
      </form>
    </aside>
    <PersonaV6Report report={presentReport(report)} />
  </>;
}
