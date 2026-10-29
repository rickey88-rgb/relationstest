"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ReportView from "./ReportView";
import { useTestAccountCheckout } from "../../_components/useTestAccountCheckout";
import PaywallCheckoutCTA from "../../_components/PaywallCheckoutCTA";
import PostPurchaseRecommendation from "../../_components/PostPurchaseRecommendation";
import { hasPaidReturn, usePaymentRecovery } from "../../_components/usePaymentRecovery";
import { useTestAnalytics } from "../../_analytics/useTestAnalytics";
import { answerLabels, calculate, dimensionNames, emptyAnswers, level, parseState, PRICE_SEK, questions, STATE_VERSION, STORAGE_KEY, type Result } from "./model";
import { HSP_STRIPE_URL } from "./payment";

const button = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-center font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900";
const secondary = `${button} border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100`;
const section = "mt-8 space-y-4 rounded-2xl border border-neutral-200 p-5 leading-7 sm:p-6";
const link = "underline underline-offset-4 decoration-neutral-400 hover:decoration-neutral-800";

function teaser(result: Result) {
  const highest = dimensionNames[result.highest];
  if (result.pattern === "even") return { signal: "Dina svar visar drag relaterade till hög känslighet.", title: "Flera delar av din profil förstärker varandra", body: "Dina sex områden ligger nära varandra. Ingen enskild del driver helheten, utan flera erfarenheter samspelar i din profil." };
  if (result.pattern === "pair") return { signal: "Dina svar visar tydliga drag relaterade till hög känslighet.", title: "En tydlig kombination framträder i dina svar", body: `${highest} är en framträdande del av din profil. Det mest intressanta är hur det området samspelar med en annan stark del av resultatet.` };
  if (result.pattern === "contrast") return { signal: "Dina svar visar drag relaterade till hög känslighet.", title: "Din profil innehåller en intressant kontrast", body: `${highest} är den tydligaste delen av din profil, medan ett annat område ligger betydligt lägre. Den kontrasten påverkar hur helheten kan förstås.` };
  if (result.pattern === "dominant") return { signal: "Dina svar visar tydliga drag relaterade till hög känslighet.", title: "Ditt resultat har ett tydligt mönster", body: `${highest} skiljer sig tydligt från resten av din profil. Det mest intressanta i dina svar är inte bara totalnivån, utan hur detta område förhåller sig till de andra.` };
  return { signal: "Dina svar visar vissa drag relaterade till hög känslighet.", title: "Ditt resultat har ett tydligt mönster", body: `${highest} är den mest framträdande delen av din profil. Den fullständiga analysen visar hur de olika områdena hänger ihop.` };
}

export default function HspTestPage() {
  const [index, setIndex] = useState(0); const [answers, setAnswers] = useState<number[]>(emptyAnswers); const [unlocked, setUnlocked] = useState(false);
  const { paywallRef, ...tracking } = useTestAnalytics("hsp_test", questions.length);
  const [hydrated, setHydrated] = useState(false); const [editing, setEditing] = useState(false); const [transitioning, setTransitioning] = useState(false); const [analysisStep, setAnalysisStep] = useState<number | null>(null); const [storageUnavailable, setStorageUnavailable] = useState(false); const [checkoutUnavailable, setCheckoutUnavailable] = useState(false);
  const answerLock = useRef(false); const timer = useRef<ReturnType<typeof setTimeout> | null>(null); const heading = useRef<HTMLHeadingElement>(null); const moveFocus = useRef(false);
  const analyzing = analysisStep !== null;
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  /* eslint-disable react-hooks/set-state-in-effect -- restore browser state before test UI is rendered. */
  useEffect(() => { try { const saved = parseState(localStorage.getItem(STORAGE_KEY)); if (saved) { setAnswers(saved.answers); setIndex(saved.index); setUnlocked(saved.unlocked); } if (new URLSearchParams(window.location.search).get("paid") === "true") { tracking.purchase(); setUnlocked(true); window.history.replaceState({}, "", window.location.pathname); } } catch { setStorageUnavailable(true); } setHydrated(true); }, []);
  useEffect(() => { if (!hydrated) return; try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STATE_VERSION, index, answers, unlocked })); } catch { setStorageUnavailable(true); } }, [answers, hydrated, index, unlocked]);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => { if (!analyzing) return; const second = setTimeout(() => setAnalysisStep(1), 1000); const third = setTimeout(() => setAnalysisStep(2), 2000); const done = setTimeout(() => { moveFocus.current = true; setAnalysisStep(null); }, 3000); return () => { clearTimeout(second); clearTimeout(third); clearTimeout(done); }; }, [analyzing]);

  const payment = usePaymentRecovery(STORAGE_KEY, unlocked, setUnlocked);
  const complete = answers.every((answer) => answer >= 0); const showResult = complete && !editing; const answered = answers.filter((answer) => answer >= 0).length;
  const result = useMemo(() => complete ? calculate(answers) : null, [answers, complete]); const preview = result ? teaser(result) : null;
  useEffect(() => { if (showResult && !analyzing && !unlocked) tracking.teaser(); }, [analyzing, showResult, tracking, unlocked]);
  useEffect(() => { if (moveFocus.current) { heading.current?.focus({ preventScroll: true }); moveFocus.current = false; } }, [analyzing, index, showResult]);

  function choose(value: number) {
    if (answerLock.current) return;
    tracking.answer(answered + (answers[index] < 0 ? 1 : 0), index + 1); answerLock.current = true; setTransitioning(true);
    const next = answers.map((answer, position) => position === index ? value : answer); setAnswers(next); setEditing(true);
    timer.current = setTimeout(() => { moveFocus.current = true; if (index < questions.length - 1) setIndex(index + 1); else if (next.every((answer) => answer >= 0)) { if (!unlocked) setAnalysisStep(0); setEditing(false); } else setIndex(next.findIndex((answer) => answer < 0)); answerLock.current = false; setTransitioning(false); timer.current = null; }, 220);
  }
  function restart() { tracking.restart(); setAnalysisStep(null); setCheckoutUnavailable(false); setIndex(0); setAnswers(emptyAnswers()); setUnlocked(hasPaidReturn(STORAGE_KEY)); setEditing(false); moveFocus.current = true; try { localStorage.removeItem(STORAGE_KEY); } catch { setStorageUnavailable(true); } }
  const accountCheckout = useTestAccountCheckout("hsp", answers, () => setCheckoutUnavailable(true));
  function checkout() { if (accountCheckout()) return;
    if (!payment.prepareCheckout({ version: STATE_VERSION, index, answers, unlocked })) return;
    if (!HSP_STRIPE_URL.startsWith("https://buy.stripe.com/")) { setCheckoutUnavailable(true); return; }
    tracking.checkout(() => { window.location.assign(HSP_STRIPE_URL); });
  }

  if (!hydrated) return <p className="mt-6" role="status">Laddar testet…</p>;
  return <>
    {unlocked && <aside data-flow="inset" role="status" className="mt-6 rounded-xl border border-[#bfd2c3] bg-[#EFF5F2] p-4 leading-6 text-neutral-800"><strong>Ditt test är upplåst – du behöver inte betala igen.</strong>{complete ? <p className="mt-1">Din fullständiga analys visas nedan.</p> : <p className="mt-1">Svara på frågorna igen så öppnas hela analysen direkt efter sista svaret.</p>}</aside>}
    {payment.checkoutError && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 leading-6">{payment.checkoutError}</p>}
    {storageUnavailable && <p role="status" className="mt-6 rounded-xl border border-neutral-300 bg-neutral-50 p-4 text-sm leading-6">Webbläsaren kan inte spara testet. Lämna inte sidan om du vill behålla dina svar.</p>}
    {!showResult && <section data-flow="question" data-nosnippet className={section} aria-labelledby="question-heading"><div className="flex justify-between gap-3 text-sm text-neutral-600"><span>Fråga {index + 1} av {questions.length}</span><span>{answered} av {questions.length} besvarade</span></div><progress aria-label="Besvarade frågor" value={answered} max={questions.length} className="h-2 w-full accent-[#27666A]" /><h2 ref={heading} tabIndex={-1} id="question-heading" className="text-xl font-semibold leading-snug outline-none sm:text-2xl">{questions[index]}</h2><div role="group" aria-labelledby="question-heading" className="space-y-2"><p className="text-sm text-neutral-600">Välj det svar som passar bäst.</p>{answerLabels.map((label, value) => <button type="button" key={label} disabled={transitioning} aria-pressed={answers[index] === value} onClick={() => choose(value)} onKeyDown={(event) => { if (event.repeat) event.preventDefault(); }} className={`flex min-h-12 w-full items-center rounded-xl border p-3 text-left leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#27666A] ${answers[index] === value ? "border-[#27666A] bg-[#EFF5F2] font-semibold" : "border-neutral-300 bg-white hover:bg-neutral-50"}`}>{label}</button>)}</div><button type="button" disabled={index === 0 || transitioning} onClick={() => { moveFocus.current = true; setIndex(index - 1); }} className={`${secondary} disabled:cursor-not-allowed disabled:opacity-40`}>Tillbaka</button><p className="text-xs leading-5 text-neutral-500">Svaren sparas lokalt i den här webbläsaren.</p></section>}
    {showResult && analyzing && !unlocked && <section data-flow="analysis" className={section} aria-busy="true"><h2 ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">Vi sammanställer din profil</h2><p role="status" aria-live="polite">{["Analyserar dina svar…", "Jämför dina sex känslighetsområden…", "Identifierar mönster i din profil…"][analysisStep ?? 0]}</p></section>}
    {showResult && (!analyzing || unlocked) && result && preview && <div data-hsp-result>{!unlocked ? <section data-flow="paywall" ref={paywallRef} className="mt-8 space-y-5 rounded-[20px] bg-[#18241e] px-[18px] py-6 leading-7 text-white" aria-labelledby="result-heading"><p className="text-sm font-semibold text-[#d9e6da]">{preview.signal}</p><h2 ref={heading} tabIndex={-1} id="result-heading" className="text-2xl font-semibold outline-none">{preview.title}</h2><div className="rounded-xl border border-white/15 bg-white/5 p-4"><p className="font-semibold">{dimensionNames[result.highest]}</p><p className="mt-1 text-sm text-[#d9e6da]">{level(result.raw[result.highest])}</p><div className="mt-3 h-2 overflow-hidden rounded bg-white/20"><div className="h-full rounded bg-[#d9e6da]" style={{ width: `${result.normalized[result.highest]}%` }} /></div></div><p className="text-neutral-200">{preview.body}</p><div className="space-y-4 border-t border-white/15 pt-5"><h3 className="text-xl font-semibold">I din fullständiga analys ser du</h3><ul className="space-y-2 text-neutral-200"><li>✓ hur alla sex områden förhåller sig till varandra</li><li>✓ vad som förstärker eller skapar kontrast i din profil</li><li>✓ vardagsnära strategier och relevanta styrkor</li></ul><p className="text-sm text-neutral-200">Engångsbetalning · Direkt tillgång · Ingen prenumeration</p><PaywallCheckoutCTA onClick={checkout} label={<>Se hela min analys – {PRICE_SEK}{"\u00a0"}kr</>} /><button type="button" onClick={restart} className="min-h-11 w-full text-sm text-neutral-300 underline underline-offset-4 hover:text-white">Gör om testet</button>{checkoutUnavailable && <p role="status" className="text-sm text-neutral-200">Köp är inte tillgängligt just nu. Dina svar finns kvar här.</p>}</div></section> : <><ReportView result={result} heading={heading} /></>}<div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => { moveFocus.current = true; setEditing(true); setIndex(0); }} className={secondary}>Granska mina svar</button><button type="button" onClick={restart} className={secondary}>Börja om</button></div></div>}{showResult && unlocked && <PostPurchaseRecommendation sourceTest="hsp_test" recommendedTest="autism_test" fallbackTests={["adhd_test"]} />}
  </>;
}
