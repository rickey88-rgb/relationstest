import Link from "next/link";
import type { ReactNode } from "react";
import { AnalyticsSettings } from "../../_analytics/AnalyticsProvider";
import Fingerprint from "./Fingerprint";
import styles from "../persona.module.css";

export default function PersonaShell({ children }: { children: ReactNode }) {
  return <main className={styles.surface} data-persona-root>
    <a className={styles.skip} href="#persona-content">Till innehållet</a>
    <header className={styles.masthead}>
      <Link href="/persona" className={styles.wordmark} aria-label="PERSONA – till introduktionen"><Fingerprint /> <span>PERSONA</span></Link>
      <Link href="/" className={styles.siteLink}>En del av Relationsvarning <span aria-hidden="true">↗</span></Link>
    </header>
    <div id="persona-content" className={styles.content}>{children}</div>
    <footer className={styles.footer}>
      <p>En självskattning för eftertanke. Ingen diagnos eller fullständig beskrivning av vem du är.</p>
      <nav aria-label="PERSONA information"><Link href="/integritet">Integritet</Link><AnalyticsSettings /><Link href="/kontakt">Kontakt</Link></nav>
    </footer>
  </main>;
}
