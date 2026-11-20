
import Fingerprint from "../_components/Fingerprint";
import PrintPersonaButton from "../report/PrintPersonaButton";
import shared from "../report/report.module.css";
import local from "./preview.module.css";

import { presentReport } from "./presentation";
export { presentReport } from "./presentation";
type Presentation = ReturnType<typeof presentReport>;
function Paragraphs({ text }: { text: string }) {
  return <>{text.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</>;
}
export default function PersonaV6Report({ report }: { report: Presentation }) {
  return <article id="persona-premium-report" className={shared.report} data-edition="6">
    <header className={shared.cover}>
      <Fingerprint className={shared.fingerprint} />
      <p className={shared.eyebrow}>PERSONA · Ditt personliga porträtt</p>
      <h1>{report.title}</h1>
      <p className={shared.context}>Sex perspektiv på din personlighet, dina mönster och din väg framåt.</p>
      <PrintPersonaButton />
    </header>
    <nav className={shared.contents} aria-label="Rapportens innehåll">
      {report.sections.map((section, index) => <a key={section.id} href={"#v6-" + section.id}><span aria-hidden="true">0{index + 1}</span>{section.title}</a>)}
    </nav>
    <div className={shared.sections}>
      {report.sections.map((section, index) => <section key={section.id} id={"v6-" + section.id} className={shared.section} aria-labelledby={"v6-title-" + section.id}>
        <p className={shared.eyebrow}>Perspektiv 0{index + 1}</p>
        <h2 id={"v6-title-" + section.id}>{section.title}</h2>
        {section.note && <div className={local.prose}><Paragraphs text={section.note} /></div>}
        {section.blocks.map((block, blockIndex) => <div key={blockIndex} className={local.block}>
          <h3>{block.title}</h3>
          <div className={local.prose}>
            {block.observation && <p><strong>Mönstret i dina svar</strong><br />{block.observation}</p>}
            {block.adviceReason && <Paragraphs text={block.adviceReason} />}
            {block.observation && <p className={local.label}>En möjlig tolkning</p>}
            <Paragraphs text={block.interpretation} />
            {block.example && <p><strong>I vardagen</strong><br />{block.example}</p>}
            {block.limitations.map((limit, limitIndex) => <p key={limitIndex} className={local.qualification}>{limit}</p>)}
          </div>
        </div>)}
      </section>)}
    </div>
    <footer className={shared.footer}><p>{report.method}</p></footer>
  </article>;
}
