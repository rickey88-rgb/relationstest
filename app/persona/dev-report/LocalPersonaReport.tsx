"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { PersonaReport } from "../_domain/types";
import PersonaReportView from "../report/PersonaReportView";
import { parseDraft, STORAGE_KEY, toSubmission } from "../test/state";
import { loadLocalPersonaReport } from "./actions";
import styles from "../persona.module.css";

type Result = { report: PersonaReport } | { message: string };

async function readReport(): Promise<Result> {
  try {
    const saved = parseDraft(window.localStorage.getItem(STORAGE_KEY));
    const submission = saved && toSubmission(saved);
    if (!submission) return { message: "Slutför testet i den här webbläsaren för att se rapporten från dina sparade svar." };
    const report = await loadLocalPersonaReport(submission);
    if (report.sections.length === 1) return { message: "Besvara fler grundfrågor så att rapporten får två dimensioner att jämföra." };
    return { report };
  } catch {
    return { message: "Rapporten kunde inte visas. Kontrollera att du öppnar den från samma lokala adress och webbläsare där du gjorde testet." };
  }
}

export default function LocalPersonaReport() {
  const [result, setResult] = useState<Result>();
  useEffect(() => {
    let current = true;
    void readReport().then(value => { if (current) setResult(value); });
    return () => { current = false; };
  }, []);
  return <div className={styles.flow} data-nosnippet>
    <div className={styles.localReportBar}>
      <span className={styles.eyebrow}>Lokal rapportgranskning</span>
      <Link className={styles.textLink} href="/persona/test">← Tillbaka till testet</Link>
    </div>
    {!result ? <p role="status" className={styles.notice}>Läser dina sparade svar…</p>
      : "report" in result ? <PersonaReportView report={result.report} />
      : <p role="status" className={styles.notice}>{result.message}</p>}
  </div>;
}
