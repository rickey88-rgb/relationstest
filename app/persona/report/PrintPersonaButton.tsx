"use client";
import styles from "./report.module.css";
export default function PrintPersonaButton() {
  return <button type="button" className={styles.printButton} onClick={() => window.print()}>Skriv ut eller spara som PDF ↗</button>;
}
