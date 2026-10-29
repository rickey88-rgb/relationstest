"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReportView from "./ReportView";
import { useTestAccountCheckout } from "../../_components/useTestAccountCheckout";
import { topAreaSummary } from "./interpretation";
import PaywallCheckoutCTA from "../../_components/PaywallCheckoutCTA";
import PostPurchaseRecommendation from "../../_components/PostPurchaseRecommendation";
import { hasPaidReturn, usePaymentRecovery } from "../../_components/usePaymentRecovery";
import { useTestAnalytics } from "../../_analytics/useTestAnalytics";
import { answerLabels, areaLevel, calculate, dimensionExplanations, dimensionNames, emptyAnswers, parseState, PRICE_SEK, questions, STATE_VERSION, STORAGE_KEY, symptomLevel, type Result } from "./model";
import { PTSD_STRIPE_URL } from "./payment";

const button = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-center font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900";
const secondary = `${button} border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100`;
const section = "mt-8 space-y-4 rounded-2xl border border-neutral-200 p-5 leading-7 sm:p-6";

function teaser(result: Result) {
  const highest = dimensionNames[result.highest];
  const second = dimensionNames[result.second];
  const impact = result.scores.dailyImpact;
  const highAnswers = result.drivers[result.highest].filter((item) => item.answer >= 3).length;
  const middle = impact >= 45
    ? `Dina svar visar också att reaktionerna kan påverka vardagen mer än andra delar av resultatet.`
    : `Det finns samtidigt skillnader mellan dina fem områden som blir tydligare i den fullständiga genomgången.`;
  return {
    title: "Det finns mer i dina svar",
    body: `${highest} är ditt tydligaste område${highAnswers ? ", med flera reaktioner som framträder tydligt" : ""}. ${second} är också en viktig del av mönstret. ${middle} I den fullständiga analysen bryter vi ner dina fem områden och visar vilka reaktioner som driver ditt resultat.`,
  };
}

export default function PtsdTestPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(emptyAnswers);
  const [unlocked, setUnlocked] = useState(false);
  const { paywallRef, ...tracking } = useTestAnalytics("ptsd_test", questions.length);
  const [hydrated, setHydrated] = useState(false);
  const [editing, setEditing] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<number | null>(null);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
  const [checkoutUnavailable, setCheckoutUnavailable] = useState(false);
  const answerLock = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const moveFocus = useRef(false);
  const analyzing = analysisStep !== null;

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  useEffect(() => {
    try {
      const saved = parseState(localStorage.getItem(STORAGE_KEY));
      if (saved) { setAnswers(saved.answers); setIndex(saved.index); setUnlocked(saved.unlocked); }
      if (new URLSearchParams(window.location.search).get("paid") === "true") {
        tracking.purchase();
        setUnlocked(true);
        window.history.replaceState({}, "", window.location.pathname);
      }
    } catch { setStorageUnavailable(true); }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restore state and record paid returns only once.
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STATE_VERSION, index, answers, unlocked })); }
    catch { setStorageUnavailable(true); }
  }, [answers, hydrated, index, unlocked]);
  useEffect(() => {
    if (!analyzing) return;
    const timers = [setTimeout(() => setAnalysisStep(1), 900), setTimeout(() => setAnalysisStep(2), 1800), setTimeout(() => setAnalysisStep(3), 2700), setTimeout(() => { moveFocus.current = true; setAnalysisStep(null); }, 3600)];
    return () => timers.forEach(clearTimeout);
  }, [analyzing]);

  const payment = usePaymentRecovery(STORAGE_KEY, unlocked, setUnlocked);
  const complete = answers.every((answer) => answer >= 0);
  const showResult = complete && !editing;
  const answered = answers.filter((answer) => answer >= 0).length;
  const result = useMemo(() => complete ? calculate(answers) : null, [answers, complete]);
  const preview = result ? teaser(result) : null;
  useEffect(() => { if (showResult && !analyzing && !unlocked) tracking.teaser(); }, [analyzing, showResult, tracking, unlocked]);
  useEffect(() => { if (moveFocus.current) { heading.current?.focus({ preventScroll: true }); moveFocus.current = false; } }, [analyzing, index, showResult]);

  function choose(value: number) {
    if (answerLock.current) return;
    answerLock.current = true;
    setTransitioning(true);
    tracking.answer(answered + (answers[index] < 0 ? 1 : 0), index + 1);
    const next = answers.map((answer, position) => position === index ? value : answer);
    setAnswers(next);
    setEditing(true);
    timer.current = setTimeout(() => {
      moveFocus.current = true;
      if (index < questions.length - 1) setIndex(index + 1);
      else if (next.every((answer) => answer >= 0)) { if (!unlocked) setAnalysisStep(0); setEditing(false); }
      else setIndex(next.findIndex((answer) => answer < 0));
      answerLock.current = false;
      setTransitioning(false);
      timer.current = null;
    }, 220);
  }

  function restart() {
    tracking.restart();
    if (timer.current) clearTimeout(timer.current);
    answerLock.current = false;
    setAnalysisStep(null);
    setCheckoutUnavailable(false);
    setIndex(0);
    setAnswers(emptyAnswers());
    setUnlocked(hasPaidReturn(STORAGE_KEY));
    setEditing(false);
    moveFocus.current = true;
    try { localStorage.removeItem(STORAGE_KEY); } catch { setStorageUnavailable(true); }
  }

  const accountCheckout = useTestAccountCheckout("ptsd", answers, () => setCheckoutUnavailable(true));
  function checkout() { if (accountCheckout()) return;
    if (!payment.prepareCheckout({ version: STATE_VERSION, index, answers, unlocked })) return;
    if (!PTSD_STRIPE_URL.startsWith("https://buy.stripe.com/")) { setCheckoutUnavailable(true); return; }
    tracking.checkout(() => { window.location.assign(PTSD_STRIPE_URL); });
  }

  if (!hydrated) return <p className="mt-6" role="status">Laddar testet…</p>;

  return <>
    {!showResult && <div className="mt-5"><p className="leading-7 text-neutral-700">Tänk på den senaste månaden. Hur ofta har följande stämt för dig i samband med en mycket svår eller traumatisk upplevelse?</p><p className="mt-4 text-sm leading-6 text-neutral-600">30 frågor · fem områden · svaren sparas lokalt i den här webbläsaren.</p></div>}
    {unlocked && <aside data-flow="inset" role="status" className="mt-6 rounded-xl border border-[#bfd2c3] bg-[#EFF5F2] p-4 leading-6 text-neutral-800"><strong>Ditt test är upplåst – du behöver inte betala igen.</strong>{complete ? <p className="mt-1">Din fullständiga analys visas nedan.</p> : <p className="mt-1">Svara på frågorna igen så öppnas hela analysen direkt efter sista svaret.</p>}</aside>}
    {payment.checkoutError && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 leading-6">{payment.checkoutError}</p>}
    {storageUnavailable && <p role="status" className="mt-6 rounded-xl border border-neutral-300 bg-neutral-50 p-4 text-sm leading-6">Webbläsaren kan inte spara testet. Lämna inte sidan om du vill behålla dina svar.</p>}

    {!showResult && <section data-flow="question" data-nosnippet className={section} aria-labelledby="question-heading"><div className="flex justify-between gap-2 text-sm text-neutral-600"><span>Fråga {index + 1} av {questions.length}</span><span>{answered} av {questions.length} besvarade</span></div><progress aria-label="Besvarade frågor" value={answered} max={questions.length} className="h-2 w-full accent-[#27666A]" /><h2 ref={heading} tabIndex={-1} id="question-heading" className="text-xl font-semibold leading-snug outline-none sm:text-2xl">{questions[index].text}</h2><div role="group" aria-labelledby="question-heading" className="space-y-2"><p className="text-sm text-neutral-600">Hur ofta stämmer detta för dig?</p>{answerLabels.map((label, value) => <button type="button" key={label} disabled={transitioning} aria-pressed={answers[index] === value} onClick={() => choose(value)} className={`flex min-h-12 w-full items-center rounded-xl border p-3 text-left leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27666A] ${answers[index] === value ? "border-[#27666A] bg-[#EFF5F2] font-semibold" : "border-neutral-300 bg-white hover:bg-neutral-50"}`}>{label}</button>)}</div><button type="button" disabled={index === 0 || transitioning} onClick={() => { moveFocus.current = true; setIndex(index - 1); }} className={`${secondary} disabled:cursor-not-allowed disabled:opacity-40`}>Tillbaka</button><p className="text-xs leading-5 text-neutral-500">Svaren sparas lokalt i den här webbläsaren.</p></section>}

    {showResult && analyzing && !unlocked && <section data-flow="analysis" className={section} aria-busy="true"><h2 ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">Vi sammanställer ditt resultat</h2><p role="status" aria-live="polite">{["Analyserar dina svar…", "Identifierar symtommönster…", "Jämför dina områden…", "Sammanställer ditt resultat…"][analysisStep ?? 0]}</p></section>}

    {showResult && (!analyzing || unlocked) && result && preview && <div data-ptsd-result>
      {!unlocked ? <>
        <section data-flow="card" className={section} aria-labelledby="result-heading"><p className="text-lg font-semibold text-neutral-950">{symptomLevel(result.overallPercent)}</p><h2 ref={heading} tabIndex={-1} id="result-heading" className="text-2xl font-semibold outline-none">Ditt tydligaste område: {dimensionNames[result.highest]}</h2><p>{topAreaSummary(result)}</p><div data-flow="inset" className="rounded-xl bg-neutral-50 p-4"><p className="font-semibold">{dimensionNames[result.highest]}</p><p className="mt-1 text-sm text-neutral-700">{areaLevel(result.scores[result.highest])}</p><p className="mt-2 text-sm text-neutral-700">{dimensionExplanations[result.highest]}</p></div><p className="text-sm text-neutral-600">Det här är ett självtest och resultatet innebär inte att du har PTSD.</p></section>
        <section data-flow="paywall" ref={paywallRef} className="mt-8 space-y-5 rounded-[20px] bg-[#18241e] px-[18px] py-6 leading-7 text-white"><h2 className="text-2xl font-semibold">{preview.title}</h2><p className="text-neutral-200">{preview.body}</p><div className="space-y-4 border-t border-white/15 pt-5"><ul className="space-y-2 text-neutral-100"><li>🔒 Din personliga symtomprofil</li><li>🔒 Dina starkaste reaktionsmönster</li><li>🔒 Hur dina områden samspelar</li><li>🔒 Påverkan på vardag och relationer</li><li>🔒 Vad du kan göra härnäst</li></ul><div><p className="font-semibold">{PRICE_SEK} kr</p><p className="text-sm text-neutral-300">Engångsbetalning · Direkt tillgång · Ingen prenumeration</p></div><PaywallCheckoutCTA onClick={checkout} label="Full analys – 39 kr" />{checkoutUnavailable && <p role="status" className="text-sm text-neutral-200">Köp är inte tillgängligt just nu. Dina svar finns kvar här.</p>}</div></section>
        <div className="mt-5 text-center"><button type="button" onClick={restart} className="min-h-11 text-sm text-neutral-700 underline underline-offset-4 hover:text-neutral-950">Gör om testet</button></div>
      </> : <>
<ReportView result={result} heading={heading} />
        <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => { moveFocus.current = true; setEditing(true); setIndex(0); }} className={secondary}>Granska mina svar</button><button type="button" onClick={restart} className={secondary}>Börja om</button></div>
        <PostPurchaseRecommendation sourceProduct="ptsd_test" />
      </>}
    </div>}
  </>;
}
