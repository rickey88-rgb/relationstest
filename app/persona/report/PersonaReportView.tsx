import type { Evidence, PersonaReport } from "../_domain/types";
import { getQuestion as getV1Question, unknownLabel as v1Unknown } from "../_domain/v1/questions";
import { getQuestion as getV2Question, unknownLabel as v2Unknown } from "../_domain/v2/questions";
import { VERSIONS as v1, UNKNOWN as v1UnknownValue } from "../_domain/v1/manifest";
import { UNKNOWN as v2UnknownValue } from "../_domain/v2/manifest";
import { VERSIONS as v5 } from "../_domain/v5/manifest";
import { VERSIONS as v4 } from "../_domain/v4/manifest";
import { VERSIONS as v3 } from "../_domain/v3/manifest";
import { questions, ratingLabels } from "../_domain/v3/questions";
import Fingerprint from "../_components/Fingerprint";
import PrintPersonaButton from "./PrintPersonaButton";
import styles from "./report.module.css";

function unique(evidence: readonly Evidence[]) {
  return evidence.filter((item, index) => evidence.findIndex(other => other.questionId === item.questionId && other.answer === item.answer) === index);
}
function EvidenceList({ evidence, questionVersion }: { evidence: readonly Evidence[]; questionVersion: string }) {
  return <ul>{evidence.map(item => {
    const current = questionVersion === v3.question;
    const original = questionVersion === v1.question;
    const question = current ? questions.find(entry => entry.id === item.questionId)
      : (original ? getV1Question : getV2Question)(item.questionId);
    if (!question) return null;
    const label = "options" in question
      ? (item.answer === (original ? v1UnknownValue : v2UnknownValue) ? (original ? v1Unknown : v2Unknown) : question.options[item.answer])
      : ratingLabels[item.answer - 1];
    return <li key={`${item.questionId}-${item.answer}`}>{ "title" in question && <strong>{question.title}</strong>}<span className={styles.questionId}>{item.questionId}</span>
      <p>{question.prompt}</p><blockquote>{label}</blockquote></li>;
  })}</ul>;
}

/** Renders an authorized report. The local development route has its own server guard. */
export default function PersonaReportView({ report }: { report: PersonaReport }) {
  const current = report.questionVersion === v3.question;
  const synthesis = report.reportVersion === v4.report;
  const compact = report.reportVersion === v5.report;
  const scale = current ? { min: 1, max: 5, count: 6 } : { min: 0, max: 100, count: 3 };
  const usedFindings = report.sections.flatMap(section => section.paragraphs.flatMap(paragraph => paragraph.findingIds));
  const evidence = unique(report.findings.filter(finding => usedFindings.includes(finding.id)).flatMap(finding => [...finding.evidence, ...finding.counterEvidence, ...(finding.context ?? [])]));
  return <article id="persona-premium-report" className={styles.report} data-edition={synthesis || compact ? "4" : current ? "3" : undefined} data-nosnippet>
    <header className={styles.cover}>
      <Fingerprint className={styles.fingerprint} />
      <p className={styles.eyebrow}>PERSONA · Vem är du egentligen?</p>
      <h1>Ditt personliga porträtt</h1>
      <p className={styles.lead}>{synthesis || compact ? "Hur dina sidor samverkar i vardagen." : "Dina svar, betraktade från åtta håll."}</p>
      <p className={styles.context}>En självskattning för eftertanke. Rapporten beskriver svaren du har lämnat, inte en diagnos eller hela din personlighet.</p>
      <PrintPersonaButton />
    </header>
    <nav className={styles.contents} aria-label="Rapportens innehåll">
      {report.sections.map((section, index) => <a key={section.id} href={`#persona-${section.id}`}><span>0{index + 1}</span>{section.title}</a>)}
    </nav>
    {report.quality.warnings.length > 0 && <aside className={styles.quality} aria-label="Om ditt underlag"><h2>Nyanser att ha med sig</h2><ul>{report.quality.warnings.map(warning => <li key={warning}>{warning}</li>)}</ul></aside>}
    <div className={styles.sections}>{report.sections.map((section, index) => <section key={section.id} id={`persona-${section.id}`} className={styles.section}>
      <p className={styles.eyebrow}>Perspektiv {String(index + 1).padStart(2, "0")}</p><h2>{section.title}</h2>
      {(section.id === "dimensions" || (synthesis && section.id === "portrait")) && <div className={styles.dimensions} aria-label="Dina fem interna dimensionsvärden">
        {synthesis && <h3>Fem dimensioner i ditt underlag</h3>}
        {report.dimensions.map(dimension => <figure key={dimension.dimension} className={styles.dimension}>
          <figcaption><strong>{dimension.name}</strong><span>{dimension.value === null ? "Otillräckligt underlag" : `${dimension.value.toLocaleString("sv-SE")} / ${scale.max}`}</span></figcaption>
          {dimension.value !== null && <meter min={scale.min} max={scale.max} value={dimension.value} aria-label={`${dimension.name}, internt värde, inte percentil`} />}
          <p>{dimension.valid} av {scale.count} bedömbara svar{dimension.valid < scale.count ? " · begränsat underlag" : ""}{dimension.varied ? " · varierade svar" : ""}</p>
        </figure>)}
        <p className={styles.chartNote}>Interna beskrivande värden, inte percentiler, diagnoser eller jämförelser med andra. {current ? "Fördjupningarna påverkar inte dimensionsvärdena." : "Scenarier och följdfrågor ingår inte i dessa fem skalor."}</p>
      </div>}
      {section.paragraphs.map(paragraph => {
        const findings = report.findings.filter(finding => paragraph.findingIds.includes(finding.id));
        const supporting = unique(findings.flatMap(finding => finding.evidence));
        const counter = unique(findings.flatMap(finding => finding.counterEvidence));
        const context = unique(findings.flatMap(finding => finding.context ?? []));
        const dimensions = report.dimensions.filter(item => findings.some(finding => finding.dimensions?.includes(item.dimension)));
        return <div key={paragraph.id} className={styles.paragraph} data-scope={paragraph.scope}>
          {section.id === "signature" && paragraph.scope === "personal" ? <blockquote className={styles.signature}>{paragraph.text}</blockquote> : <p>{paragraph.text}</p>}
          {supporting.length > 0 && <details className={styles.evidence}><summary>Så syns det i dina svar · {supporting.length} svar</summary>{dimensions.length > 0 && <p>{dimensions.map(item => item.name).join(" · ")}</p>}
            <EvidenceList evidence={supporting} questionVersion={report.questionVersion} />
            {context.length > 0 && <><h3>Fördjupningssvar som påverkade urvalet</h3><EvidenceList evidence={context} questionVersion={report.questionVersion} /></>}
            {counter.length > 0 && <><h3>Svar som nyanserar bilden</h3><EvidenceList evidence={counter} questionVersion={report.questionVersion} /></>}
          </details>}
        </div>;
      })}
    </section>)}</div>
    <section className={styles.printEvidence}><h2>Rapportens svarunderlag</h2><EvidenceList evidence={evidence} questionVersion={report.questionVersion} /></section>
    <footer className={styles.footer}>
      <p>Du kan använda porträttet som utgångspunkt för reflektion och samtal. {current ? "De 30 grundfrågorna är ett svenskt urval och en bearbetning av IPIP-material. PERSONA:s urval är inte normerat eller validerat." : "Egna situationsmodeller hålls åtskilda från de fem personlighetsbegreppen."}</p>
      <details><summary>Om rapportens version och underlag</summary><p>{report.questionVersion} · {report.reportVersion} · {report.analysisVersion}{report.adaptiveVersion ? ` · ${report.adaptiveVersion}` : ""}</p><p>{current ? `${report.quality.validReflections} besvarade fördjupningar · ${report.quality.unknownCount} överhoppade påståenden` : `${report.quality.validScenarios} bedömbara fasta scenarier · ${report.quality.unknownCount} svar som var svåra att bedöma`}.</p></details>
      <PrintPersonaButton />
    </footer>
  </article>;
}
