import type { Evidence, PersonaReport } from "../_domain/types";
import { getQuestion, unknownLabel } from "../_domain/v2/questions";
import { UNKNOWN } from "../_domain/versions";
import Fingerprint from "../_components/Fingerprint";
import PrintPersonaButton from "./PrintPersonaButton";
import styles from "./report.module.css";

function unique(evidence: readonly Evidence[]) {
  return evidence.filter((item, index) => evidence.findIndex(other => other.questionId === item.questionId && other.answer === item.answer) === index);
}
function EvidenceList({ evidence }: { evidence: readonly Evidence[] }) {
  return <ul>{evidence.map(item => {
    const question = getQuestion(item.questionId);
    return <li key={`${item.questionId}-${item.answer}`}><strong>{question.title}</strong><span className={styles.questionId}>{item.questionId}</span>
      <p>{question.prompt}</p><blockquote>{item.answer === UNKNOWN ? unknownLabel : question.options[item.answer]}</blockquote></li>;
  })}</ul>;
}

/** Presentational only. Callers supply a report ONLY after server payment/ownership checks. */
export default function PersonaReportView({ report }: { report: PersonaReport }) {
  const usedFindings = report.sections.flatMap(section => section.paragraphs.flatMap(paragraph => paragraph.findingIds));
  const evidence = unique(report.findings.filter(finding => usedFindings.includes(finding.id)).flatMap(finding => [...finding.evidence, ...finding.counterEvidence]));
  return <article id="persona-premium-report" className={styles.report} data-nosnippet>
    <header className={styles.cover}>
      <Fingerprint className={styles.fingerprint} />
      <p className={styles.eyebrow}>PERSONA · Vem är du egentligen?</p>
      <h1>Ditt personliga porträtt</h1>
      <p className={styles.lead}>Dina val, betraktade från åtta håll.</p>
      <p className={styles.context}>En självskattning för eftertanke. Rapporten beskriver svaren du har lämnat, inte en diagnos eller hela din personlighet.</p>
      <PrintPersonaButton />
    </header>
    <nav className={styles.contents} aria-label="Rapportens åtta avsnitt">
      {report.sections.map((section, index) => <a key={section.id} href={`#persona-${section.id}`}><span>0{index + 1}</span>{section.title}</a>)}
    </nav>
    {report.quality.warnings.length > 0 && <aside className={styles.quality} aria-label="Om ditt underlag"><h2>Nyanser att ha med sig</h2><ul>{report.quality.warnings.map(warning => <li key={warning}>{warning}</li>)}</ul></aside>}
    <div className={styles.sections}>{report.sections.map((section, index) => <section key={section.id} id={`persona-${section.id}`} className={styles.section}>
      <p className={styles.eyebrow}>Perspektiv 0{index + 1}</p><h2>{section.title}</h2>
      {section.id === "dimensions" && <div className={styles.dimensions} aria-label="Dina fem interna dimensionsvärden">
        {report.dimensions.map(dimension => <figure key={dimension.dimension} className={styles.dimension}>
          <figcaption><strong>{dimension.name}</strong><span>{dimension.value === null ? "Otillräckligt underlag" : `${dimension.value.toLocaleString("sv-SE")} / 100`}</span></figcaption>
          {dimension.value !== null && <meter min={0} max={100} value={dimension.value} aria-label={`${dimension.name}, internt värde, inte percentil`} />}
          <p>{dimension.valid} av 3 bedömbara svar{dimension.valid < 3 ? " · begränsat underlag" : ""}{dimension.varied ? " · varierade svar" : ""}</p>
        </figure>)}
        <p className={styles.chartNote}>Interna beskrivande värden, inte percentiler, diagnoser eller jämförelser med andra. Scenarier och följdfrågor ingår inte i dessa fem skalor.</p>
      </div>}
      {section.paragraphs.map(paragraph => {
        const findings = report.findings.filter(finding => paragraph.findingIds.includes(finding.id));
        const supporting = unique(findings.flatMap(finding => finding.evidence));
        const counter = unique(findings.flatMap(finding => finding.counterEvidence));
        return <div key={paragraph.id} className={styles.paragraph} data-scope={paragraph.scope}>
          {section.id === "signature" && paragraph.scope === "personal" ? <blockquote className={styles.signature}>{paragraph.text}</blockquote> : <p>{paragraph.text}</p>}
          {supporting.length > 0 && <details className={styles.evidence}><summary>Så syns det i dina svar · {supporting.length} svar</summary><EvidenceList evidence={supporting} />
            {counter.length > 0 && <><h3>Svar som nyanserar bilden</h3><EvidenceList evidence={counter} /></>}
          </details>}
        </div>;
      })}
    </section>)}</div>
    <section className={styles.printEvidence}><h2>Rapportens svarunderlag</h2><EvidenceList evidence={evidence} /></section>
    <footer className={styles.footer}>
      <p>Du kan använda porträttet som utgångspunkt för reflektion och samtal. Egna situationsmodeller hålls åtskilda från de fem personlighetsbegreppen; frågorna är inte en validerad klinisk skala.</p>
      <details><summary>Om rapportens version och underlag</summary><p>{report.questionVersion} · {report.reportVersion} · {report.analysisVersion} · {report.adaptiveVersion}</p><p>{report.quality.validScenarios} bedömbara fasta scenarier · {report.quality.unknownCount} svar som var svåra att bedöma.</p></details>
      <PrintPersonaButton />
    </footer>
  </article>;
}
