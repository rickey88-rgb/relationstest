"use client";

import ReportView from "./ReportView";
import { useTestAccountCheckout } from "../../_components/useTestAccountCheckout";
import PaywallCheckoutCTA from "../../_components/PaywallCheckoutCTA";
import PostPurchaseRecommendation from "../../_components/PostPurchaseRecommendation";
import { hasPaidReturn, usePaymentRecovery } from "../../_components/usePaymentRecovery";

import { useTestAnalytics } from "../../_analytics/useTestAnalytics";
import { purchaseEvent } from "../../_analytics/testEvents";

import { useEffect, useMemo, useRef, useState } from "react";
import { answerLabels, calculate, emptyAnswers, parseState, paywallFinding, questions, PRICE_SEK, STATE_VERSION, STORAGE_KEY } from "./model";
import { AUTISM_STRIPE_URL } from "./payment";


const button = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-center font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900";
const secondary = button + " border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100";
const section = "mt-8 space-y-4 rounded-2xl border border-neutral-200 p-5 leading-7 sm:p-6";

export default function AutismSelfTestPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(emptyAnswers);
  const [unlocked, setUnlocked] = useState(false);
  const { paywallRef, ...tracking } = useTestAnalytics("autism_test", questions.length);
  const [hydrated, setHydrated] = useState(false);
  const [editing, setEditing] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [checkoutUnavailable, setCheckoutUnavailable] = useState(false);
  const [recoveryLinkInvalid, setRecoveryLinkInvalid] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const answerLock = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  const moveFocus = useRef(false);
  const heading = useRef<HTMLHeadingElement>(null);
  const [analysisStep, setAnalysisStep] = useState<number | null>(null);
  const analyzing = analysisStep !== null;
  useEffect(() => {
    if (!analyzing) return;
    const second = setTimeout(() => setAnalysisStep(1), 1000);
    const third = setTimeout(() => setAnalysisStep(2), 2000);
    const finish = setTimeout(() => { moveFocus.current = true; setAnalysisStep(null); }, 3000);
    return () => { clearTimeout(second); clearTimeout(third); clearTimeout(finish); };
  }, [analyzing]);

  // Browser-only storage must be restored after hydration, following the existing test UX.
  /* eslint-disable react-hooks/set-state-in-effect -- Synchronizing external localStorage and paid-return state after SSR. */
  useEffect(() => {
    try {
      const saved = parseState(localStorage.getItem(STORAGE_KEY));
      if (saved) { setAnswers(saved.answers); setIndex(saved.index); setUnlocked(saved.unlocked); }
    } catch { setStorageUnavailable(true); }
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "true") {
      purchaseEvent("autism_test");
      setUnlocked(true);
      window.history.replaceState({}, "", window.location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setHydrated(true);
  }, []);

  // A support-recovery unlock is verified only by the HttpOnly cookie issued by the server.
  // It intentionally does not use the public paid-return query parameter.
  useEffect(() => {
    let cancelled = false;

    async function restoreSupportRecovery() {
      const recovery = new URLSearchParams(window.location.search).get("recovery");
      let recoveryUnlocked = false;

      try {
        const response = await fetch("/api/autism-recovery/status", { cache: "no-store" });
        const body: unknown = response.ok ? await response.json() : null;
        recoveryUnlocked = typeof body === "object" && body !== null && (body as { unlocked?: unknown }).unlocked === true;
      } catch {
        // A failed status check must never unlock a result.
      }

      if (cancelled) return;

      if (recovery === "invalid" || (recovery === "success" && !recoveryUnlocked)) {
        setRecoveryLinkInvalid(true);
        return;
      }

      if (!recoveryUnlocked) return;

      setUnlocked(true);
      if (recovery === "success") {
        window.history.replaceState({}, "", window.location.pathname);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }

    void restoreSupportRecovery();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STATE_VERSION, index, answers, unlocked })); }
    catch { setStorageUnavailable(true); }
  }, [index, answers, unlocked, hydrated]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const payment = usePaymentRecovery(STORAGE_KEY, unlocked, setUnlocked);

  const complete = answers.every((answer) => answer >= 0);
  const showResult = complete && !editing;
  const answeredCount = answers.filter((answer) => answer >= 0).length;
  const result = useMemo(() => complete ? calculate(answers) : null, [complete, answers]);
  const teaserFinding = result ? paywallFinding(result) : null;
  useEffect(() => {
    if (moveFocus.current) { heading.current?.focus({ preventScroll: true }); moveFocus.current = false; }
  }, [index, showResult, hydrated, analyzing]);

  function navigate(next: number) { moveFocus.current = true; setIndex(next); }
  function selectAnswer(value: number) {
    if (answerLock.current) return;
    tracking.answer(answers.filter(answer => answer >= 0).length + (answers[index] < 0 ? 1 : 0), index + 1);
    answerLock.current = true;
    setTransitioning(true);
    const next = answers.map((answer, i) => i === index ? value : answer);
    setAnswers(next);
    setEditing(true);
    timer.current = setTimeout(() => {
      moveFocus.current = true;
      if (index < questions.length - 1) setIndex(index + 1);
      else if (next.every(answer => answer >= 0)) { if (!unlocked) setAnalysisStep(0); setEditing(false); }
      else setIndex(next.findIndex(answer => answer < 0));
      answerLock.current = false;
      setTransitioning(false);
      timer.current = null;
    }, 220);
  }
  function restart() {
    tracking.restart();
    setAnalysisStep(null);
    setCheckoutUnavailable(false);
    setIndex(0); setAnswers(emptyAnswers()); setUnlocked(unlocked || hasPaidReturn(STORAGE_KEY) || new URLSearchParams(window.location.search).get("paid") === "true"); setEditing(false); moveFocus.current = true;
    try { localStorage.removeItem(STORAGE_KEY); } catch { setStorageUnavailable(true); }
  }
  const accountCheckout = useTestAccountCheckout("autism", answers, () => setCheckoutUnavailable(true));
  function checkout() { if (accountCheckout()) return;
    if (!payment.prepareCheckout({ version: STATE_VERSION, index, answers, unlocked })) return;
    if (!AUTISM_STRIPE_URL.startsWith("https://buy.stripe.com/")) { setCheckoutUnavailable(true); return; }
    tracking.checkout(() => { window.location.assign(AUTISM_STRIPE_URL); });
  }

  if (!hydrated) return <p className="mt-6" role="status">Laddar testet...</p>;
  return <>
      {unlocked && <div data-flow="inset" role="status" style={{ margin: "20px 0", padding: 16, border: "1px solid #ddd", borderRadius: 12, lineHeight: 1.6 }}><strong>Ditt test är upplåst – du behöver inte betala igen.</strong>{answers.every(answer => answer >= 0) ? <p>Din fullständiga analys visas nedan.</p> : <p>Tidigare svar saknas eller är ofullständiga i den här webbläsaren. Öppna testet i samma webbläsare som före betalningen, eller svara på frågorna här utan att köpa igen. Behöver du hjälp? Kontakta <a href="mailto:support@relationsvarning.se">support@relationsvarning.se</a>.</p>}</div>}
      {recoveryLinkInvalid && <p role="alert" style={{ margin: "20px 0", lineHeight: 1.6 }}>Recovery-länken är ogiltig eller har gått ut. Inget har låsts upp. Kontakta <a href="mailto:support@relationsvarning.se">support@relationsvarning.se</a> om du behöver hjälp.</p>}
      {payment.checkoutError && <p role="alert" style={{ margin: "20px 0", lineHeight: 1.6 }}>{payment.checkoutError}</p>}

    {storageUnavailable && <p role="status" className="mt-6 rounded-xl border border-neutral-300 bg-neutral-50 p-4 text-sm leading-6">Webbläsaren kan inte spara testet. Du kan svara här, men återupptagning och betalning behöver fungerande lokal lagring. Lämna inte sidan om du vill behålla svaren.</p>}
    {!showResult && <section data-flow="question" data-nosnippet className={section} aria-labelledby="question-heading">
      <div className="flex flex-wrap justify-between gap-2 text-sm text-neutral-600"><span>Fråga {index + 1} av {questions.length}</span><span>{answeredCount} av {questions.length} besvarade</span></div>
      <progress aria-label="Besvarade frågor" value={answeredCount} max={questions.length} className="h-2 w-full accent-neutral-900" />
      <h2 ref={heading} tabIndex={-1} id="question-heading" className="text-xl font-semibold leading-snug outline-none sm:text-2xl">{questions[index].text}</h2>
      <div role="group" aria-labelledby="question-heading" className="space-y-2">
        <p className="text-sm text-neutral-600">Välj ett svar för att gå vidare.</p>
        {answerLabels.map((label, value) => <button type="button" key={label} disabled={transitioning} aria-pressed={answers[index] === value} onClick={() => selectAnswer(value)} onKeyDown={(event) => { if (event.repeat) event.preventDefault(); }} className={"flex min-h-12 w-full items-center rounded-xl border p-3 text-left leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 " + (answers[index] === value ? "border-neutral-900 bg-neutral-100 font-semibold" : "border-neutral-300 bg-white hover:bg-neutral-50")}>{label}{" "}</button>)}
      </div>
      <div className="flex flex-wrap gap-3 pt-2"><button type="button" disabled={index === 0 || transitioning} onClick={() => navigate(index - 1)} className={secondary + " disabled:cursor-not-allowed disabled:opacity-40"}>Tillbaka</button></div>
      <p className="text-xs leading-5 text-neutral-500">Svaren sparas lokalt i den här webbläsaren. Du kan ändra tidigare svar med Tillbaka.</p>
    </section>}
    {showResult && analyzing && !unlocked && <section data-flow="analysis" className={section} aria-labelledby="analysis-heading" aria-busy="true">
      <h2 id="analysis-heading" ref={heading} tabIndex={-1} className="text-xl font-semibold outline-none">Vi sammanställer din profil</h2>
      <p role="status" aria-live="polite">{["Analyserar dina svar…", "Jämför mönster mellan sex områden…", "Sammanställer din profil…"][analysisStep ?? 0]}</p>
    </section>}
    {showResult && (!analyzing || unlocked) && result && <div data-autism-result>
      {!unlocked ? <section data-flow="paywall" data-autism-paywall ref={paywallRef} className="mt-8 space-y-3 rounded-[20px] bg-[#0d0d0d] px-[18px] py-5 leading-6 text-white sm:px-6" aria-labelledby="result-heading">
        <h2 id="result-heading" ref={heading} tabIndex={-1} className="pt-1 text-xl font-semibold leading-tight text-white outline-none">{teaserFinding?.title}</h2>
        <p className="font-medium text-white">{teaserFinding?.body}</p>
        <p className="text-sm leading-6 text-neutral-200">Den fullständiga analysen visar hur resten av dina svar påverkar bilden.</p>
        <p className="text-sm leading-6 text-neutral-300">Det här är ett självtest, inte en diagnos. Det kan inte bekräfta eller utesluta autism.</p>
        <div className="h-px bg-white/15" aria-hidden="true" />
        <div className="space-y-3 pt-1 lg:space-y-4">
          <p className="text-sm font-semibold text-white">Din låsta analys innehåller</p>
          <ul className="space-y-3.5 text-sm leading-6 text-neutral-200 lg:space-y-4"><li>🔒 Övergripande nivå och förklaring</li><li>🔒 Sex delområden med nivåer och förklaringar</li><li>🔒 Din profil och den sammanvägda tolkningen</li><li>🔒 Vardagspåverkan, långvarighet och nyanser</li></ul>
          <div className="pt-2"><PaywallCheckoutCTA onClick={checkout} label={<>Se min fullständiga analys · {PRICE_SEK} kr</>} trustText="Engångsbetalning · Ingen prenumeration." trustClassName="text-xs leading-5" /></div>
          {checkoutUnavailable && <p role="status" className="text-neutral-300">Köp är inte tillgängligt just nu. Dina svar finns kvar i den här webbläsaren.</p>}
        </div>
        <button data-flow="restart" type="button" onClick={restart} className="text-sm underline underline-offset-4">Gör om testet</button>
      </section> : <>
        <ReportView result={result} heading={heading} />
        <PostPurchaseRecommendation sourceProduct="autism_test" />
      </>}
      <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => { moveFocus.current = true; setEditing(true); setIndex(0); }} className={secondary}>Granska mina svar</button><button type="button" onClick={restart} className={secondary}>Börja om</button></div>
    </div>}
  </>;
}
