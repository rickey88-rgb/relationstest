import Link from "next/link";
import type { ReactNode } from "react";
import Fingerprint from "../_components/Fingerprint";
import { TOTAL_COUNT } from "../_domain/versions";
import styles from "./persona-journey.module.css";

type Props = {
  homePath?: string; chapter: number; chapterTitle: string; count: number; questionStep: boolean;
  entering: boolean; onBack(): void; notice: ReactNode; children: ReactNode;
  footer: ReactNode; viewKey: string; transition: string;
};

/** A dedicated journey frame; no landing/report layout rules or fixed navigation. */
export default function PersonaJourney(props: Props) {
  return <div className={styles.journey} data-persona-journey data-persona-flow data-nosnippet>
    <header className={styles.header}>
      <div className={styles.toolbar}>
        <Link href={props.homePath ?? "/persona"} className={styles.brand}><Fingerprint /><span>PERSONA</span></Link>
        <nav aria-label="Testnavigation" className={styles.tools}>
          {props.questionStep && <button type="button" disabled={props.entering} onClick={props.onBack}>← Tillbaka</button>}
          <Link href={props.homePath ?? "/persona"}>Om PERSONA</Link>
          <span className={styles.saved}>Sparas lokalt</span>
        </nav>
      </div>
      <div className={styles.progressLabel}>
        <p><span>Kapitel {props.chapter} / 4</span><strong>{props.chapterTitle}</strong></p>
        <span>{props.count} / {TOTAL_COUNT} genomgångna</span>
      </div>
      <progress className={styles.progress} aria-label="Genomgångna frågor" value={props.count} max={TOTAL_COUNT} />
      {props.notice && <div className={styles.notice} role="status">{props.notice}</div>}
    </header>
    <div className={styles.stage}>
      <div key={props.viewKey} className={styles.step} data-transition={props.transition}>
        {props.children}
      </div>
    </div>
    <footer className={styles.footer}>{props.footer}</footer>
  </div>;
}
