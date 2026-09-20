"use client";

import PaywallCheckoutCTA from "../../_components/PaywallCheckoutCTA";
import { buildPaywallTeaser } from "../../_lib/paywallTeaser";

import { hasPaidReturn, usePaymentRecovery } from "../../_components/usePaymentRecovery";

import { useTestAnalytics } from "../../_analytics/useTestAnalytics";
import { purchaseEvent } from "../../_analytics/testEvents";

import { useEffect, useMemo, useRef, useState } from "react";
import { answerLabels, calculate, areaNames, areas, emptyAnswers, formatPercent, parseState, questions, PRICE_SEK, STATE_VERSION, STORAGE_KEY } from "./model";
import { AUTISM_STRIPE_URL } from "./payment";

import { describeArea, impactText, standoutText } from "./interpretation";
import { levelTexts, profileTexts } from "./copy";

const button = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-center font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900";
const secondary = button + " border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100";
const link = "underline underline-offset-4 decoration-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-4";
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
  const previewScores = result ? Object.values(result.scores).sort((a, b) => b - a) : [];
  const preview = buildPaywallTeaser(previewScores);
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
  function checkout() {
    if (!payment.prepareCheckout({ version: STATE_VERSION, index, answers, unlocked })) return;
    if (!AUTISM_STRIPE_URL.startsWith("https://buy.stripe.com/")) { setCheckoutUnavailable(true); return; }
    tracking.checkout();
    window.location.assign(AUTISM_STRIPE_URL);
  }

  if (!hydrated) return <p className="mt-6" role="status">Laddar testet...</p>;
  return <>
      {unlocked && <div role="status" style={{ margin: "20px 0", padding: 16, border: "1px solid #ddd", borderRadius: 12, lineHeight: 1.6 }}><strong>Ditt test är upplåst – du behöver inte betala igen.</strong>{answers.every(answer => answer >= 0) ? <p>Din fullständiga analys visas nedan.</p> : <p>Tidigare svar saknas eller är ofullständiga i den här webbläsaren. Öppna testet i samma webbläsare som före betalningen, eller svara på frågorna här utan att köpa igen. Behöver du hjälp? Kontakta <a href="mailto:support@relationsvarning.se">support@relationsvarning.se</a>.</p>}</div>}
      {payment.checkoutError && <p role="alert" style={{ margin: "20px 0", lineHeight: 1.6 }}>{payment.checkoutError}</p>}

    {storageUnavailable && <p role="status" className="mt-6 rounded-xl border border-neutral-300 bg-neutral-50 p-4 text-sm leading-6">Webbläsaren kan inte spara testet. Du kan svara här, men återupptagning och betalning behöver fungerande lokal lagring. Lämna inte sidan om du vill behålla svaren.</p>}
    {!showResult && <section data-nosnippet className={section} aria-labelledby="question-heading">
      <div className="flex flex-wrap justify-between gap-2 text-sm text-neutral-600"><span>Fråga {index + 1} av {questions.length}</span><span>{answeredCount} av {questions.length} besvarade</span></div>
      <progress aria-label="Besvarade frågor" value={answeredCount} max={questions.length} className="h-2 w-full accent-neutral-900" />
      <h2 ref={heading} tabIndex={-1} id="question-heading" className="text-xl font-semibold leading-snug outline-none sm:text-2xl">{questions[index].text}</h2>
      <div role="group" aria-labelledby="question-heading" className="space-y-2">
        <p className="text-sm text-neutral-600">Välj ett svar för att gå vidare.</p>
        {answerLabels.map((label, value) => <button type="button" key={label} disabled={transitioning} aria-pressed={answers[index] === value} onClick={(event) => { if (event.detail <= 1) selectAnswer(value); }} onKeyDown={(event) => { if (event.repeat) event.preventDefault(); }} className={"flex min-h-12 w-full items-center rounded-xl border p-3 text-left leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 " + (answers[index] === value ? "border-neutral-900 bg-neutral-100 font-semibold" : "border-neutral-300 bg-white hover:bg-neutral-50")}>{label}{" "}</button>)}
      </div>
      <div className="flex flex-wrap gap-3 pt-2"><button type="button" disabled={index === 0 || transitioning} onClick={() => navigate(index - 1)} className={secondary + " disabled:cursor-not-allowed disabled:opacity-40"}>Tillbaka</button></div>
      <p className="text-xs leading-5 text-neutral-500">Svaren sparas lokalt i den här webbläsaren. Du kan ändra tidigare svar med Tillbaka.</p>
    </section>}
    {showResult && analyzing && !unlocked && <section className={section} aria-labelledby="analysis-heading" aria-busy="true">
      <h2 id="analysis-heading" ref={heading} tabIndex={-1} className="text-xl font-semibold outline-none">Vi sammanställer din profil</h2>
      <p role="status" aria-live="polite">{["Analyserar dina svar…", "Jämför mönster mellan sex områden…", "Sammanställer din profil…"][analysisStep ?? 0]}</p>
    </section>}
    {showResult && (!analyzing || unlocked) && result && <div data-autism-result>
      {!unlocked ? <section ref={paywallRef} className="mt-8 space-y-5 rounded-[20px] bg-[#0d0d0d] px-[18px] py-6 leading-7 text-white" aria-labelledby="result-heading">
        <h2 id="result-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">{preview.title}</h2>
        <p className="text-neutral-200">{preview.body}</p>
        <div className="space-y-4 border-t border-white/15 pt-5">
          <h3 className="text-xl font-semibold">Det här får du se i din fullständiga analys</h3>
          <ul className="space-y-2 text-neutral-200"><li>✓ vad som väger tyngst i dina svar</li><li>✓ hur olika sociala och sensoriska erfarenheter samspelar</li><li>✓ vad som förstärker eller nyanserar bilden i vardagen</li></ul>
          <div><p className="font-semibold">{PRICE_SEK} kr</p><p className="text-sm text-neutral-300">Engångsbetalning · Ingen prenumeration</p><p className="text-sm text-neutral-300">Resultatet visas direkt efter betalning</p></div>
          <PaywallCheckoutCTA onClick={checkout} />
          <button type="button" onClick={restart} className="min-h-11 w-full text-sm text-neutral-300 underline underline-offset-4 hover:text-white">Gör om testet</button>
          {checkoutUnavailable && <p role="status" className="text-neutral-300">Köp är inte tillgängligt just nu. Dina svar finns kvar i den här webbläsaren.</p>}
        </div>
      </section> : <>
        <section className={section} aria-labelledby="result-heading"><h2 id="result-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">Din övergripande profil</h2>
          <p className="text-xl font-semibold">{result.level}</p><p className="text-4xl font-semibold tabular-nums">{formatPercent(result.symptomIndex)} / 100</p>
          <p className="text-sm text-neutral-600">Symptomindex för fem områden. Detta är självskattningspoäng, inte sannolikheten att ha autism.</p>
          <p>{levelTexts[result.level]}</p>
          {result.impactModifier !== "standard" && <p>{impactText(result).title}. {impactText(result).text}</p>}
        </section>
        <section className={section}><h2 className="text-2xl font-semibold">Det som sticker ut mest</h2><p>{standoutText(result)}</p></section>
        <section className={section}><h2 className="text-2xl font-semibold">Dina sex områden</h2><div className="grid gap-3 sm:grid-cols-2">{areas.map(area => <div key={area} className="min-w-0 space-y-3 rounded-xl bg-neutral-50 p-4"><h3 className="font-semibold">{areaNames[area]}</h3><p className="tabular-nums">{formatPercent(result.scores[area])} / 100</p><div className="h-2 overflow-hidden rounded bg-neutral-200" aria-hidden="true"><div className="h-full rounded bg-neutral-700" style={{ width: result.scores[area] + "%" }} /></div><p>{describeArea(area, result.scores[area])}</p></div>)}</div></section>
        <section className={section}><h2 className="text-2xl font-semibold">Din produktprofil</h2><h3 className="text-xl font-semibold">{result.profileType}</h3><p>{profileTexts[result.profileType]}</p><p className="text-sm text-neutral-600">Profilen är en beskrivning inom detta självtest, inte en klinisk diagnos eller en diagnostisk subtyp. Produktnivåer och profilgränser är inte kliniskt validerade cutoffs.</p></section>
        <section className={section}><h2 className="text-2xl font-semibold">Vardagspåverkan och långvarighet</h2><h3 className="text-xl font-semibold">{impactText(result).title}</h3><p>{impactText(result).text}</p></section>
        <section className={section}><h2 className="text-2xl font-semibold">Vad som talar för ett mer autismrelaterat mönster</h2>{result.supporting.length ? <ul className="list-disc space-y-3 pl-5">{result.supporting.map(text => <li key={text}>{text}</li>)}</ul> : <p>Dina svar ger inte tydligt stöd för de kombinationer av förhöjda områden, vardagspåverkan eller tidigare svårigheter som den här modellen lyfter fram.</p>}</section>
        <section className={section}><h2 className="text-2xl font-semibold">Vad som gör bilden mindre tydlig</h2>{result.lessClear.length ? <ul className="list-disc space-y-3 pl-5">{result.lessClear.map(text => <li key={text}>{text}</li>)}</ul> : <p>Inga av modellens särskilda dämpande faktorer framträder i dina svar. Det betyder inte att andra förklaringar har uteslutits.</p>}</section>
        <section className={section}><h2 className="text-2xl font-semibold">Andra möjliga förklaringar</h2><p>Liknande svårigheter och egenskaper kan även förekomma av andra skäl, exempelvis ADHD, social ångest, långvarig stress, sömnbrist eller annan belastning. Resultatet bör därför ses som en strukturerad självskattning och inte som en diagnos.</p><p>Även depression, personlighetsdrag och sensorisk känslighet utan autism kan vara relevanta för en bred bedömning. Detta förklarar inte bort dina upplevelser; ett webbtest kan inte avgöra orsaken.</p></section>
        <p className="mt-8 text-sm leading-6 text-neutral-600">Det här resultatet ställer ingen diagnos. En autismbedömning behöver väga in utvecklingshistoria, funktion över tid, flera delar av livet och alternativa förklaringar. <a href="https://www.1177.se/sjukdomar--besvar/hjarna-och-nerver/neuropsykiatriska-funktionsnedsattningar/autism/" className={link}>Läs om autism och att söka stöd på 1177.</a></p>
      </>}
      <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => { moveFocus.current = true; setEditing(true); setIndex(0); }} className={secondary}>Granska mina svar</button><button type="button" onClick={restart} className={secondary}>Börja om</button></div>
    </div>}
  </>;
}
