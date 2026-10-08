"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import PaywallCheckoutCTA from "../../_components/PaywallCheckoutCTA";
import PostPurchaseRecommendation from "../../_components/PostPurchaseRecommendation";
import type { TestId } from "../../_analytics/config";
import { useTestAnalytics } from "../../_analytics/useTestAnalytics";
import { AUDHD_STRIPE_URL } from "./payment";
import { answerLabels, calculateReport, contextQuestions, descriptiveLevel, dimensionNames, dimensions, emptyAnswers, emptyContextAnswers, formatPercent, parseState, PRICE_SEK, questions, REPORT_VERSION, STORAGE_KEY, type Report } from "./model";

const card = "mt-7 space-y-5 rounded-[26px] border border-neutral-200 bg-white p-5 leading-7 shadow-sm sm:p-7";
const btn = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900";

function freeFinding(report: Report) {
  // Keep masking, friction and impact/history fully premium, even when one of
  // them is the report's strongest signal. The free finding is drawn only from
  // the five core ADHD/autism dimensions and contains no level or score.
  const findingDimensions = ["A", "B", "C", "D", "E"] as const;
  const highest = [...findingDimensions].sort((left, right) => report.scores[right] - report.scores[left] || findingDimensions.indexOf(left) - findingDimensions.indexOf(right));
  const first = highest[0];
  const second = highest[1];
  const tied = report.scores[first] === report.scores[second];
  return {
    title: tied ? "Två områden framträder mest i dina svar." : "Ett område framträder mest i dina svar.",
    body: tied
      ? `${dimensionNames[first]} och ${dimensionNames[second]} ligger lika högt i din självskattning.`
      : `${dimensionNames[first]} framträder mest i din självskattning.`,
    teaser: "Den fullständiga analysen undersöker hur ADHD- och autismrelaterade svar samspelar, utan att dra diagnostiska slutsatser.",
  };
}

function audhdRecommendations(report: Report): [TestId, TestId] {
  const difference = report.indices.adhdIndex - report.indices.autismIndex;
  return difference <= -15 ? ["autism_test", "adhd_test"] : ["adhd_test", "autism_test"];
}


function hasCompleteSavedState(state: ReturnType<typeof parseState>) {
  return Boolean(state && state.answers.every(value => value >= 0) && state.contextAnswers.every(value => value >= 0));
}

function hasLegacyPaidMarker() {
  try { return localStorage.getItem(STORAGE_KEY + ":paid") === "true"; }
  catch { return false; }
}

function migrateLegacyAudhdCheckoutState(raw: string | null) {
  try {
    const legacy: unknown = JSON.parse(raw ?? "null");
    if (!legacy || typeof legacy !== "object") return null;
    const state = legacy as Record<string, unknown>;
    const index = state.index;
    const exactKeys = Object.keys(state).sort().join(",") === "answers,index,unlocked,version";
    if (!exactKeys || state.version !== 1 || !Array.isArray(state.answers) || state.answers.length !== 54 || !state.answers.every(value => Number.isInteger(value) && value >= 0 && value <= 4) || typeof index !== "number" || !Number.isInteger(index) || index < 0 || index > 47 || typeof state.unlocked !== "boolean") return null;
    const answers = state.answers.slice(0, 48) as number[];
    const contextAnswers = state.answers.slice(48) as number[];
    return { reportVersion: REPORT_VERSION, answers, contextAnswers, questionIndex: index, contextIndex: 5, unlocked: state.unlocked, report: calculateReport(answers, contextAnswers) };
  } catch { return null; }
}

function downloadPdf(report: Report) {
  const rows = dimensions.map(key => `<tr><td>${dimensionNames[key]}</td><td>${formatPercent(report.scores[key])}/100 · ${descriptiveLevel(report.scores[key])}</td></tr>`).join("");
  const page = window.open("", "_blank", "noopener,noreferrer"); if (!page) return;
  page.document.write(`<!doctype html><html lang="sv"><head><title>Min AuDHD-profil</title><style>body{font:15px Arial;max-width:760px;margin:36px auto;line-height:1.6;color:#202124}h1,h2{font-family:Georgia,serif}table{width:100%;border-collapse:collapse}td{padding:10px;border-bottom:1px solid #ddd}small{color:#526}</style></head><body><h1>Min AuDHD-profil</h1><p>${new Date().toLocaleDateString("sv-SE")}</p><h2>${report.profileType}</h2><p>ADHD-relaterat index: ${formatPercent(report.indices.adhdIndex)}/100 · Autismrelaterat index: ${formatPercent(report.indices.autismIndex)}/100</p><h2>Viktigast i min profil</h2><ul>${report.keyFindings.map(item => `<li>${item}</li>`).join("")}</ul><h2>Åtta områden</h2><table>${rows}</table><h2>Profiler</h2><p><strong>ADHD:</strong> ${report.adhd.label}<br><strong>Autism:</strong> ${report.autism.label}</p><h2>Friktion</h2><p>${report.friction.top.map(item => item.label).join(" · ")}</p><h2>Masking</h2><p>${report.masking.text}</p><h2>Vardagspåverkan</h2><p>${report.impact.text}</p><h2>Utvecklingsmönster</h2><p>${report.development.text}</p><p><small>AuDHD är ett informellt begrepp, inte en separat diagnos. Detta är Relationsvarnings självskattning och ersätter inte klinisk bedömning.</small></p><script>print()</script></body></html>`); page.document.close();
}

export default function AudhdTestPage() {
  const [answers, setAnswers] = useState<number[]>(emptyAnswers); const [context, setContext] = useState<number[]>(emptyContextAnswers);
  const [questionIndex, setQuestionIndex] = useState(0); const [contextIndex, setContextIndex] = useState(0); const [phase, setPhase] = useState<"questions" | "context" | "analysis" | "result">("questions");
  const [unlocked, setUnlocked] = useState(false); const [hydrated, setHydrated] = useState(false); const [transitioning, setTransitioning] = useState(false); const [analysisStep, setAnalysisStep] = useState(0); const [checkoutUnavailable, setCheckoutUnavailable] = useState(false); const [storageError, setStorageError] = useState(false); const [paymentRecoveryRequired, setPaymentRecoveryRequired] = useState(false); const [recoveryNotice, setRecoveryNotice] = useState(false); const [recoveryLinkInvalid, setRecoveryLinkInvalid] = useState(false);
  const lock = useRef(false); const checkoutPending = useRef(false); const standardAnalytics = useTestAnalytics("audhd_test", questions.length + contextQuestions.length); const complete = answers.every(v => v >= 0) && context.every(v => v >= 0);
  const report = useMemo(() => complete ? calculateReport(answers, context) : null, [answers, context, complete]);
  useEffect(() => {
    let disposed = false;
    async function hydrate() {
      const query = new URLSearchParams(window.location.search);
      const paidReturn = query.get("paid") === "true";
      const recoveryReturn = query.get("recovery");
      let recoveryUnlocked = false;
      try {
        const response = await fetch("/api/audhd-recovery/status", { cache: "no-store" });
        const body: unknown = response.ok ? await response.json() : null;
        recoveryUnlocked = Boolean(body && typeof body === "object" && (body as { unlocked?: unknown }).unlocked === true);
      } catch {
        // A failed status check must never unlock the browser client-side.
      }
      if (disposed) return;
      try {
        const rawState = localStorage.getItem(STORAGE_KEY);
        const paidMarker = hasLegacyPaidMarker();
        let saved = parseState(rawState);
        if (!saved) {
          const migrated = migrateLegacyAudhdCheckoutState(rawState);
          if (migrated) {
            const migratedState = { ...migrated, unlocked: migrated.unlocked || paidReturn || paidMarker };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedState));
            saved = parseState(localStorage.getItem(STORAGE_KEY));
            if (!saved) throw new Error("Legacy state could not be migrated");
          }
        }
        if (recoveryReturn === "success" && !recoveryUnlocked) setRecoveryLinkInvalid(true);
        if (recoveryReturn === "invalid") setRecoveryLinkInvalid(true);

        // A signed server cookie can only start a new test or restore an existing
        // recovery test. It never relies on a query parameter to unlock a report.
        const shouldStartRecoveredTest = recoveryUnlocked && !hasCompleteSavedState(saved) && (recoveryReturn === "success" || !saved || !saved.unlocked);
        if (shouldStartRecoveredTest) {
          const recoveredState = { reportVersion: REPORT_VERSION, answers: emptyAnswers(), contextAnswers: emptyContextAnswers(), questionIndex: 0, contextIndex: 0, unlocked: true };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(recoveredState));
          const persisted = parseState(localStorage.getItem(STORAGE_KEY));
          if (!persisted?.unlocked) throw new Error("Recovery unlock could not be persisted");
          setAnswers(persisted.answers); setContext(persisted.contextAnswers); setQuestionIndex(0); setContextIndex(0); setPhase("questions"); setUnlocked(true); setRecoveryNotice(true);
          if (recoveryReturn === "success") window.history.replaceState({}, "", window.location.pathname);
          return;
        }

        const paidStateExists = paidReturn || paidMarker || saved?.unlocked === true;
        if (paidStateExists && !hasCompleteSavedState(saved) && !recoveryUnlocked) {
          setPaymentRecoveryRequired(true);
          return;
        }
        if (saved) {
          const restoredUnlocked = saved.unlocked || paidReturn || paidMarker || recoveryUnlocked;
          setAnswers(saved.answers); setContext(saved.contextAnswers); setQuestionIndex(saved.questionIndex); setContextIndex(saved.contextIndex); setUnlocked(restoredUnlocked);
          if (hasCompleteSavedState(saved)) setPhase("result");
          if (restoredUnlocked && !saved.unlocked) {
            const paidState = { ...saved, unlocked: true };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(paidState));
            if (!parseState(localStorage.getItem(STORAGE_KEY))?.unlocked) throw new Error("Paid state could not be persisted");
          }
          if (paidReturn) {
            standardAnalytics.purchase();
            window.history.replaceState({}, "", window.location.pathname);
          }
        }
      } catch {
        setStorageError(true);
        if (paidReturn) setPaymentRecoveryRequired(true);
      } finally {
        if (!disposed) setHydrated(true);
      }
    }
    void hydrate();
    return () => { disposed = true; };
  }, [standardAnalytics]);
  useEffect(() => { if (!hydrated || paymentRecoveryRequired) return; try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ reportVersion: REPORT_VERSION, answers, contextAnswers: context, questionIndex, contextIndex, unlocked, report })); } catch { setStorageError(true); } }, [answers, context, questionIndex, contextIndex, unlocked, report, hydrated, paymentRecoveryRequired]);
  useEffect(() => { if (unlocked && report) standardAnalytics.resultView(); }, [unlocked, report, standardAnalytics]);
  useEffect(() => { if (phase !== "analysis" || !report) return; const timers = [setTimeout(() => setAnalysisStep(1), 1200), setTimeout(() => setAnalysisStep(2), 2500), setTimeout(() => { standardAnalytics.analysisView(); setPhase("result"); }, 4000)]; return () => timers.forEach(clearTimeout); }, [phase, report, standardAnalytics]);
  function answer(value: number) { if (lock.current) return; lock.current = true; setTransitioning(true); if (phase === "questions") { const next = answers.map((item, i) => i === questionIndex ? value : item); setAnswers(next); const count = next.filter(item => item >= 0).length; standardAnalytics.answer(count, questionIndex + 1); setTimeout(() => { if (questionIndex < 47) setQuestionIndex(questionIndex + 1); else setPhase("context"); lock.current = false; setTransitioning(false); }, 180); } else { const next = context.map((item, i) => i === contextIndex ? value : item); setContext(next); const count = next.filter(item => item >= 0).length; standardAnalytics.answer(questions.length + count, questions.length + contextIndex + 1); setTimeout(() => { if (contextIndex < 5) setContextIndex(contextIndex + 1); else setPhase("analysis"); lock.current = false; setTransitioning(false); }, 180); } }
  function checkout() { if (!report || unlocked) { setUnlocked(true); return; } if (checkoutPending.current) return; try { const checkoutState = { reportVersion: REPORT_VERSION, answers, contextAnswers: context, questionIndex, contextIndex, unlocked: false, report }; localStorage.setItem(STORAGE_KEY, JSON.stringify(checkoutState)); const persisted = parseState(localStorage.getItem(STORAGE_KEY)); if (!hasCompleteSavedState(persisted) || persisted?.unlocked) throw new Error("Checkout state could not be persisted"); } catch { setStorageError(true); return; } if (!AUDHD_STRIPE_URL.startsWith("https://buy.stripe.com/")) { setCheckoutUnavailable(true); return; } checkoutPending.current = true; standardAnalytics.checkout(); window.location.href = AUDHD_STRIPE_URL; }
  function restart() { standardAnalytics.restart(); setAnswers(emptyAnswers()); setContext(emptyContextAnswers()); setQuestionIndex(0); setContextIndex(0); setPhase("questions"); setCheckoutUnavailable(false); try { localStorage.removeItem(STORAGE_KEY); } catch { setStorageError(true); } }
  if (!hydrated) return <p className="mt-8" role="status">Laddar testet…</p>;
  const storageNotice = storageError ? <p role="status" className="mt-6 rounded-xl border border-neutral-300 bg-[#F1E8E2] p-4 text-sm leading-6">Webbläsaren kan inte spara testet säkert. Du kan fortsätta här, men lämna inte sidan om du vill behålla svaren.</p> : null;
  const recoveryMessage = recoveryNotice ? <p role="status" className="mt-6 rounded-xl border border-[#c8a777] bg-[#fff8e8] p-4 text-sm font-medium leading-6 text-[#4a3823]">Ditt test är redan upplåst – du behöver inte betala igen.</p> : null;
  const invalidRecoveryMessage = recoveryLinkInvalid ? <p role="alert" className="mt-6 rounded-xl border border-[#d6a5a9] bg-[#fff5f5] p-4 text-sm leading-6 text-[#702d36]">Recovery-länken är ogiltig eller har gått ut. Inget har låsts upp.</p> : null;
  if (paymentRecoveryRequired) return <>{storageNotice}<section className={card} role="alert" aria-live="assertive"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">Betalningen behöver kopplas till dina svar</p><h2 className="text-2xl font-semibold">Vi kan inte öppna rapporten ännu</h2><p>Vi hittar inga kompletta AuDHD-svar i den här webbläsaren. Din betalning är inte borttappad, men rapporten kan inte återskapas utan de sparade testsvaren.</p><p>Kontakta <a className="underline underline-offset-4" href="mailto:support@relationsvarning.se">support@relationsvarning.se</a> och ange tidpunkt för köpet samt e-postadressen som användes vid betalningen, så kan vi hjälpa dig vidare.</p></section></>;
  if (phase === "questions" || phase === "context") { const isContext = phase === "context"; const item = isContext ? contextQuestions[contextIndex] : questions[questionIndex]; const selected = isContext ? context[contextIndex] : answers[questionIndex]; const current = isContext ? contextIndex + 1 : questionIndex + 1; const total = isContext ? 6 : 48; const options = isContext ? contextQuestions[contextIndex].options : answerLabels; return <>{storageNotice}{recoveryMessage}{invalidRecoveryMessage}<section className={card} aria-labelledby="question"><div className="text-sm text-neutral-600"><span>{isContext ? "Sista frågor" : `Fråga ${current} av 48`}</span></div><progress className="h-2 w-full accent-[#27666A]" value={current - (selected >= 0 ? 0 : 1)} max={total} aria-label="Testets förlopp" /><h2 id="question" className="text-2xl font-semibold leading-snug">{isContext && contextIndex === 0 ? "Några sista frågor hjälper oss sätta dina svar i sammanhang." : item.text}</h2>{isContext && contextIndex === 0 && <p className="text-neutral-600">De ändrar inte dina index. De hjälper bara rapporten att använda ett mer försiktigt och relevant språk.</p>}<div role="group" aria-labelledby="question" className="space-y-2">{options.map((label, value) => <button key={label} type="button" disabled={transitioning} aria-pressed={selected === value} onClick={() => answer(value)} className={`flex min-h-12 w-full items-center rounded-xl border p-3 text-left ${selected === value ? "border-[#202124] bg-[#F1E8E2] font-semibold" : "border-neutral-300 bg-white hover:bg-neutral-50"}`}>{label}</button>)}</div><div className="flex gap-3"><button className={`${btn} border border-neutral-300 bg-white`} type="button" disabled={transitioning || (isContext ? contextIndex === 0 : questionIndex === 0)} onClick={() => isContext ? setContextIndex(contextIndex - 1) : setQuestionIndex(questionIndex - 1)}>Tillbaka</button></div><p className="text-sm text-neutral-600">Dina svar sparas lokalt i den här webbläsaren.</p></section></>; }
  if (phase === "analysis") return <section className={card} aria-busy="true" aria-live="polite"><p className="text-sm uppercase tracking-[.16em] text-neutral-600">Din profil är på väg</p><h2 className="text-3xl font-semibold">Vi analyserar dina svar</h2><div className="space-y-3">{["Analyserar dina svar inom 8 områden…", "Jämför ADHD- och autismrelaterade mönster…", "Identifierar hur områdena samspelar hos dig…"].map((text, i) => <p key={text} className={i <= analysisStep ? "text-neutral-900" : "text-neutral-400"}>✓ {text}</p>)}</div></section>;
  if (!report) return null;
  const finding = freeFinding(report);
  if (!unlocked) return <><section ref={standardAnalytics.paywallRef} data-audhd-paywall className={`${card} bg-[#202124] text-white`}>
    <div>
      <p data-audhd-kicker className="text-sm uppercase tracking-[.16em] text-[#DDE8E3]">Ett första fynd</p>
      <h2 className="text-xl font-semibold">{finding.title}</h2>
      <p>{finding.body}</p>
      <p className="text-sm text-neutral-200">{finding.teaser}</p>
    </div>
    <div>
      <h3 className="text-xl font-semibold">Din låsta AuDHD-analys innehåller</h3>
      <ul className="mt-3 grid gap-3 text-neutral-100">
        <li>🔒 Profiltyp, ADHD- och autismindex samt AuDHD-karta</li>
        <li>🔒 Samtliga åtta områden och deras nivåer</li>
        <li>🔒 Masking, friktion, vardagspåverkan och historik</li>
        <li>🔒 Sammanvägd tolkning och rapport som PDF</li>
      </ul>
    </div>
    <p className="text-sm leading-6 text-neutral-300">AuDHD är ett informellt begrepp för samtidig ADHD och autism. Det här självtestet kan inte fastställa en diagnos.</p>
    <div data-audhd-cta-wrap className="pt-2 sm:pt-0"><PaywallCheckoutCTA onClick={checkout} label={<>Lås upp min AuDHD-profil · {PRICE_SEK} kr</>} trustText="Engångsbetalning · Ingen prenumeration." /></div>
    {checkoutUnavailable && <p role="alert">Betalning är inte konfigurerad ännu. Dina svar finns kvar lokalt.</p>}
  </section><div data-audhd-restart className="mt-3"><button type="button" className="text-sm underline" onClick={restart}>Gör om testet</button></div></>;
  const [recommendedTest, fallbackTest] = audhdRecommendations(report);
  return <><ReportView report={report} onRestart={restart} /><PostPurchaseRecommendation sourceProduct="audhd_test" preferredProductIds={[recommendedTest, fallbackTest]} /></>;
}

function ReportView({ report, onRestart }: { report: Report; onRestart: () => void }) { return <div className="space-y-7"><section className={card}><p className="text-sm uppercase tracking-[.16em] text-neutral-600">Din huvudprofil</p><h2 className="text-3xl font-semibold">{report.profileType}</h2><p>Det här beskriver ett mönster i dina självskattade svar. Det är inte en diagnos och inte en sannolikhet för ADHD, autism eller AuDHD.</p><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-[#F1E8E2] p-4"><strong>ADHD-relaterat index</strong><p className="text-3xl">{formatPercent(report.indices.adhdIndex)} / 100</p></div><div className="rounded-2xl bg-[#DDE8E3] p-4"><strong>Autismrelaterat index</strong><p className="text-3xl">{formatPercent(report.indices.autismIndex)} / 100</p></div></div></section><section className={card}><h2>Det viktigaste i din profil</h2><ul className="list-disc space-y-2 pl-5">{report.keyFindings.map(item => <li key={item}>{item}</li>)}</ul></section><section className={card}><h2>AuDHD-karta</h2><div className="space-y-3">{dimensions.map(key => <div key={key}><div className="flex justify-between gap-3 text-sm"><span>{dimensionNames[key]}</span><strong>{formatPercent(report.scores[key])}/100</strong></div><div className="mt-1 h-3 overflow-hidden rounded-full bg-neutral-200"><div className="h-full rounded-full bg-[#27666A]" style={{ width: `${report.scores[key]}%` }} /></div></div>)}</div></section><section className={card}><h2>Dina åtta områden</h2><div className="grid gap-3">{dimensions.map(key => <div key={key} className="rounded-2xl border border-neutral-200 p-4"><div className="flex flex-wrap justify-between gap-2"><h3>{dimensionNames[key]}</h3><strong>{formatPercent(report.scores[key])}/100 · {descriptiveLevel(report.scores[key])}</strong></div><p className="mt-2 text-neutral-700">{key === "F" ? report.masking.text : key === "G" ? report.friction.text : `${dimensionNames[key]} ligger på ${descriptiveLevel(report.scores[key])} nivå i din självskattning.`}</p></div>)}</div></section><section className={card}><h2>Din ADHD-relaterade profil</h2><h3>{report.adhd.label}</h3><p>{report.adhd.text}</p></section><section className={card}><h2>Din autismrelaterade profil</h2><h3>{report.autism.label}</h3><p>{report.autism.text}</p></section><section className={card}><h2>När dina behov drar åt olika håll</h2><p>{report.friction.text}</p><ul className="list-disc pl-5">{report.friction.top.map(item => <li key={item.label}>{item.label}</li>)}</ul></section><section className={card}><h2>Masking och kompensation</h2><h3>{report.masking.title}</h3><p>{report.masking.text}</p></section><section className={card}><h2>Hur mycket mönstret påverkar vardagen</h2><h3>{report.impact.title}</h3><p>{report.impact.text}</p></section><section className={card}><h2>Har det här funnits länge?</h2><h3>{report.development.title}</h3><p>{report.development.text}</p></section><section className={card}><h2>Det som gör bilden mindre självklar</h2>{report.contradicting.length ? <ul className="list-disc space-y-2 pl-5">{report.contradicting.map(item => <li key={item}>{item}</li>)}</ul> : <p>Inga av modellens särskilda nyanserande faktorer framträder tydligt i dina svar. Det utesluter inte andra förklaringar.</p>}</section><section className={card}><h2>Andra möjliga förklaringar</h2><p>Långvarig stress, utmattning, ångest, depression, sömnproblem, trauma eller annan neuropsykiatrisk problematik kan ibland påverka liknande områden. Rapporten ställer ingen differentialdiagnos.</p></section><section className={card}><h2>Sidor av profilen som kan fungera till din fördel</h2>{report.scores.D >= 50 || report.indices.maskingIndex >= 50 ? <p>{report.scores.D >= 50 ? "Dina svar visar ett starkt och ihållande engagemang i vissa intressen eller välbekanta sätt att göra saker." : "Dina svar visar välutvecklade kompensationsstrategier och en tydlig medvetenhet om vad som tar energi."}</p> : <p>Rapporten lägger inte till generella styrkor som inte stöds av dina svar.</p>}</section><section className={card}><h2>Vad resultatet betyder och inte betyder</h2><p>AuDHD är ett informellt begrepp för samtidig ADHD och autism – inte en separat diagnos. Resultatet kan hjälpa dig att se mönster, men kan inte fastställa ADHD, autism eller AuDHD.</p></section><section className={card}><h2>Nästa steg</h2><p>{report.impact.combined >= 65 && report.development.title === "Profilen är konsekvent" ? "Om du vill undersöka ett långvarigt mönster med tydlig vardagspåverkan vidare kan en professionell bedömning vara relevant." : report.impact.combined < 35 ? "Vardagspåverkan är en viktig del av helhetsbilden. Du kan använda rapporten för att lägga märke till vilka situationer, behov och strategier som hjälper dig." : "Se rapporten som ett underlag för fortsatt reflektion. En klinisk bedömning kräver mer än ett webbtest."}</p></section><div className="flex flex-wrap gap-3"><button type="button" onClick={() => downloadPdf(report)} className={`${btn} bg-[#202124] text-white`}>Spara min rapport som PDF</button><button type="button" onClick={onRestart} className={`${btn} border border-neutral-300 bg-white`}>Börja om</button></div></div>; }
