"use client";
import { useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import Fingerprint from "../_components/Fingerprint";
import { CHAPTERS, PRICE_SEK, TOTAL_COUNT } from "../_domain/versions";
import { selectAdaptive } from "../_domain/v1/adaptive";
import { createPersonaSession } from "./session";
import { createAutoAdvance, navigationKey } from "./autoAdvance";
import { positionStep } from "./viewport";
import { answeredCount, chapterAt, chapterStarts, currentAnswer, currentQuestion, toSubmission } from "./state";
import { getPersonaPreview, type PreviewResult } from "./actions";
import styles from "../persona.module.css";
import PersonaPaywall from "./PersonaPaywall";
import PersonaJourney from "./PersonaJourney";
import PersonaQuestion from "./PersonaQuestion";
import journeyStyles from "./persona-journey.module.css";

const chapterCopy = [
  { intro: "Andra möter dina handlingar innan de känner dina skäl.", body: "Vi börjar i rummet, i samtalet och i ögonblicken när någon bildar sig en uppfattning om dig.", prompt: "Välj det som ligger närmast hur du faktiskt brukar göra. Flera alternativ kan vara rimliga." },
  { intro: "Nu börjar dina prioriteringar få ett pris.", body: "En möjlighet, ett löfte eller en relation behöver få väga tyngre. Föreställ dig vad du själv skulle vilja värna.", prompt: "Du behöver inte ha upplevt exakt samma situation. Ta dig den tid du behöver." },
  { intro: "Vissa sidor märks först när någon kommer nära.", body: "Nu handlar det om förtroende, behov och mötet mellan din självbild och det du faktiskt väljer.", prompt: "Du kan välja Svårt att bedöma. Ett osäkert svar görs aldrig om till ett personlighetsdrag." },
  { intro: "Dina tidigare val ger riktning åt de sista frågorna.", body: "Sex personliga följdfrågor hjälper oss att fördjupa några av de avvägningar som framträtt.", prompt: "Samma svar ger samma följdfrågor. Dina val får bestämma vilka delar som undersöks närmare." },
];
const reportSections = ["Personlighetsporträtt", "Personlig signatur", "Fem personlighetsdimensioner", "Drivkrafter", "Relationella mönster", "Inre motsägelser", "Styrkor och blinda fläckar", "Personlig kompass"];
type PreviewState = { key: string; result: PreviewResult | null; error: boolean };

export default function PersonaFlow() {
  const [session] = useState(() => createPersonaSession(() => window.localStorage));
  const [navigation] = useState(() => createAutoAdvance(session));
  const navigationSnapshot = useSyncExternalStore(navigation.subscribe, navigation.getSnapshot, navigation.getServerSnapshot);
  const snapshot = useSyncExternalStore(session.subscribe, session.getSnapshot, session.getServerSnapshot);
  const { draft } = snapshot;
  const stepKey = navigationKey(draft);
  const locked = navigationSnapshot.phase !== "idle";
  const entering = navigationSnapshot.phase === "entering";
  const chapter = chapterAt(draft.cursor);
  const chapterInfo = CHAPTERS[chapter - 1];
  const question = currentQuestion(draft);
  const selected = currentAnswer(draft);
  const count = answeredCount(draft);
  const heading = useRef<HTMLHeadingElement>(null);
  const [restartConfirm, setRestartConfirm] = useState(false);
  const [preview, setPreview] = useState<PreviewState | null>(null);
  const [retry, setRetry] = useState(0);
  const submission = useMemo(() => draft.phase === "preview" ? toSubmission(draft) : null, [draft]);
  const requestKey = submission ? JSON.stringify(submission) : "";
  const hasReserveQuestions = useMemo(() => {
    if (chapter !== 4 || draft.phase !== "chapter") return false;
    const selection = selectAdaptive(draft.fixed);
    return selection.candidates.some(item => selection.selectedIds.includes(item.id) && item.reason === "fallback");
  }, [chapter, draft.phase, draft.fixed]);
  useLayoutEffect(() => {
    if (snapshot.hydrated) positionStep({ heading: heading.current });
  }, [draft.phase, draft.cursor, snapshot.hydrated]);
  useEffect(() => {
    if (!requestKey) return;
    let active = true;
    getPersonaPreview(JSON.parse(requestKey)).then(result => {
      if (active) setPreview({ key: requestKey, result, error: false });
    }).catch(() => { if (active) setPreview({ key: requestKey, result: null, error: true }); });
    return () => { active = false; };
  }, [requestKey, retry]);
  useEffect(() => () => navigation.cancel(), [navigation]);

  const restart = () => { navigation.navigate("restart", stepKey); setPreview(null); setRestartConfirm(false); };
  const confirmRestart = () => { navigation.cancel(); setRestartConfirm(true); };
  const result = preview?.key === requestKey ? preview : null;
  const previewError = result?.error || result?.result?.kind === "invalid";
  const isPreview = draft.phase === "preview";
  const viewKey = `${draft.phase}-${draft.cursor}`;
  const storageNotice = snapshot.storageError === "unavailable"
    ? "Webbläsaren kan inte spara dina svar. Du kan fortsätta här, men lämna inte sidan om du vill behålla dem."
    : snapshot.storageError === "invalid" ? "Tidigare sparade svar kunde inte återställas. Du kan börja en ny omgång här." : null;

  if (!snapshot.hydrated) return <div className={styles.flowLoading} role="status"><Fingerprint className={styles.smallFingerprint} /><p>Din resa förbereds.</p></div>;

  if (!isPreview) return <PersonaJourney
    chapter={chapter} chapterTitle={chapterInfo.title} count={count}
    questionStep={draft.phase === "question"} entering={entering}
    onBack={() => navigation.navigate("back", stepKey)}
    notice={storageNotice || (snapshot.restored ? `Välkommen tillbaka. Dina ${count} sparade svar finns kvar.` : null)}
    viewKey={viewKey} transition={navigationSnapshot.phase}
    footer={<>
      <button type="button" className={styles.resetLink} disabled={count === 0} onClick={confirmRestart}>Radera svar och börja om</button>
      <details className={journeyStyles.storage}><summary>Om dina sparade svar</summary><p>Dina svar sparas i den här webbläsaren. För den kostnadsfria förhandsvisningen skickas de för beräkning utan att lagras på servern. Vid köp lagras svaren krypterat efter ditt separata samtycke. Du kan radera de lokala svaren genom att börja om. På en delad enhet kan andra som använder samma webbläsare se dem.</p></details>
      {restartConfirm && <section className={styles.restartConfirmation} aria-labelledby="restart-heading" role="alert">
        <h2 id="restart-heading">Börja med ett tomt blad?</h2><p>Alla dina sparade PERSONA-svar i den här webbläsaren tas bort.</p>
        <div><button type="button" className={styles.secondary} onClick={() => setRestartConfirm(false)}>Behåll mina svar</button><button type="button" className={styles.primary} onClick={restart}>Radera och börja om</button></div>
      </section>}
    </>}>
      {draft.phase === "chapter" && <section className={styles.chapterIntro} data-persona-chapter aria-labelledby="chapter-heading">
        <div className={styles.chapterSeal}><Fingerprint /><span>0{chapter}</span></div>
        <p className={styles.eyebrow}>{chapter === 4 ? "Dina personliga följdfrågor" : "Nästa del av resan"}</p>
        <h1 id="chapter-heading" ref={heading} tabIndex={-1} className={styles.chapterTitle}>{chapterInfo.title}</h1>
        <p className={styles.chapterLead}>{hasReserveQuestions ? "Sex sista frågor ger fler sätt att känna efter." : chapterCopy[chapter - 1].intro}</p>
        <p className={styles.chapterBody}>{hasReserveQuestions ? "Några frågor breddar underlaget där dina tidigare svar gett mindre ledning. Andra följer upp de val du kunnat göra." : chapterCopy[chapter - 1].body}</p>
        <p className={styles.finePrint}>{chapterCopy[chapter - 1].prompt}</p>
        {chapter === 1 && <p className={styles.finePrint}>Utgå främst från det senaste året i självskattningarna. Svaren sparas lokalt i den här webbläsaren.</p>}
        <button type="button" className={styles.primary} disabled={entering} onClick={() => navigation.navigate("start", stepKey)}>{count === 0 ? "Börja resan" : "Fortsätt till kapitlet"} <span aria-hidden="true">→</span></button>
        {draft.cursor > 0 && <button type="button" className={styles.back} disabled={entering} onClick={() => navigation.navigate("back", stepKey)}>← Tillbaka till förra frågan</button>}
      </section>}


      {question && draft.phase === "question" && <PersonaQuestion question={question}
        selected={selected} locked={locked} headingRef={heading}
        pending={navigationSnapshot.phase === "selected" || navigationSnapshot.phase === "leaving"}
        position={draft.cursor - chapterStarts[chapter - 1] + 1} total={chapterInfo.count}
        last={draft.cursor === TOTAL_COUNT - 1}
        onAnswer={value => navigation.answer(value, stepKey)} onNext={() => navigation.navigate("next", stepKey)} />}
  </PersonaJourney>;

  return <div className={styles.flow} data-nosnippet data-persona-flow data-layout="preview">
    <div className={styles.flowHeader}>
    <div className={styles.flowTop}><div className={styles.flowLinks}>
      <Link href="/persona" className={styles.textLink}>Om PERSONA</Link>
    </div><span className={styles.localBadge}><span aria-hidden="true">◌</span> Sparas lokalt</span></div>
    <div className={styles.flowMessage}>
      {storageNotice && <p className={styles.notice} role="status">{storageNotice}</p>}
      {!storageNotice && snapshot.restored && <p className={styles.resumeNotice} role="status">Välkommen tillbaka. Dina {count} sparade svar finns kvar.</p>}
    </div>
    <div className={styles.progressHeader}><span>{isPreview ? "Din förhandsvisning" : `Kapitel 0${chapter} av 04`}</span><span>{count} / {TOTAL_COUNT} besvarade</span></div>
    <progress className={styles.progress} aria-label="Besvarade frågor" value={count} max={TOTAL_COUNT} />
    <ol className={styles.chapterTrack} aria-label="Testets fyra kapitel">{CHAPTERS.map(c => <li key={c.id} aria-current={!isPreview && chapter === c.id ? "step" : undefined} className={c.id < chapter || isPreview ? styles.chapterComplete : undefined}><span>0{c.id}</span><span>{c.title}</span></li>)}</ol>
    </div>

    <div className={styles.stageViewport}>
    <div key={viewKey} className={`${styles.view} ${navigationSnapshot.phase === "leaving" ? styles.viewLeaving : ""}`} data-transition={navigationSnapshot.phase}>
      {isPreview && <section className={styles.preview} aria-labelledby="preview-heading">
        <Fingerprint className={styles.smallFingerprint} /><p className={styles.eyebrow}>40 val. En första inblick.</p>
        <h1 id="preview-heading" ref={heading} tabIndex={-1} className={styles.editorialTitle}>{result?.result?.kind === "limited" ? "Din bild behöver fler nyanser." : "En sida av dig tar form."}</h1>
        {!result && <div role="status" className={styles.insightLoading}><span className={styles.loadingDot} />Vi sammanställer din personliga insikt…</div>}
        {previewError && <div className={styles.notice} role="alert"><p>Din insikt kunde inte hämtas just nu. Dina svar finns kvar.</p><button className={styles.secondary} type="button" onClick={() => { setPreview(null); setRetry(value => value + 1); }}>Försök igen</button></div>}
        {result?.result && !previewError && <div className={styles.insight} data-persona-insight>
          <p className={styles.eyebrow}>{result.result.evidenceCount ? "Din personliga insikt" : "Om ditt underlag"}</p>
          <p className={styles.insightText}>{result.result.text}</p>
          <p className={styles.insightFootnote}>{result.result.evidenceCount ? "Grundad i dina egna svar. Ett första perspektiv, inte hela bilden." : "Du kan granska frågor du haft svårt att bedöma."}</p>
          {result.result.kind === "limited" && result.result.evidenceCount > 0 && <p className={styles.finePrint}>Flera delar av underlaget är begränsade. Granska gärna dina svar innan du drar större slutsatser.</p>}
        </div>}
        <section className={styles.premium} aria-labelledby="premium-heading">
          <div className={styles.premiumTop}><span className={styles.eyebrow}>Det fullständiga porträttet</span><span className={styles.lock} aria-label="Låst">◇ LÅST</span></div>
          <h2 id="premium-heading">Det finns mer i dina val.</h2>
          <p>Åtta perspektiv på dina prioriteringar, relationer och inre avvägningar — med en personlig kompass att ta vidare.</p>
          <ol className={styles.lockedSections}>{reportSections.map((title, i) => <li key={title}><span>0{i + 1}</span>{title}<span aria-hidden="true">↗</span></li>)}</ol>
          <div className={styles.price}><span>Premiumrapport</span><strong>{PRICE_SEK} <small>kr</small></strong><span>Engångsbetalning</span></div>
          <PersonaPaywall submission={submission} eligible={result?.result?.kind === "insight" && !previewError} />
        </section>
        <div className={styles.previewActions}><button type="button" className={styles.secondary} disabled={entering} onClick={() => navigation.navigate("review", stepKey)}>Granska mina svar</button><button type="button" className={styles.back} onClick={confirmRestart}>Börja om</button></div>
      </section>}
    </div>
    </div>

    <div className={styles.flowFooter}>
    {restartConfirm && <section className={styles.restartConfirmation} aria-labelledby="restart-heading" role="alert">
      <h2 id="restart-heading">Börja med ett tomt blad?</h2><p>Alla dina sparade PERSONA-svar i den här webbläsaren tas bort.</p>
      <div><button type="button" className={styles.secondary} onClick={() => setRestartConfirm(false)}>Behåll mina svar</button><button type="button" className={styles.primary} onClick={restart}>Radera och börja om</button></div>
    </section>}
    <p className={styles.storageNote}>Dina svar sparas i den här webbläsaren. För den kostnadsfria förhandsvisningen skickas de för beräkning utan att lagras på servern. Vid köp lagras svaren krypterat efter ditt separata samtycke. Du kan radera de lokala svaren genom att börja om. På en delad enhet kan andra som använder samma webbläsare se dem.</p>
    </div>
  </div>;
}
