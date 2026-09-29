"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import PaywallCheckoutCTA from "../../_components/PaywallCheckoutCTA";
import PostPurchaseRecommendation from "../../_components/PostPurchaseRecommendation";
import { hasPaidReturn, usePaymentRecovery } from "../../_components/usePaymentRecovery";
import { useTestAnalytics } from "../../_analytics/useTestAnalytics";
import { answerLabels, areaLevel, calculate, dimensionExplanations, dimensionNames, dimensions, emptyAnswers, parseState, PRICE_SEK, questions, STATE_VERSION, STORAGE_KEY, symptomLevel, type Dimension, type Result } from "./model";
import { PTSD_STRIPE_URL } from "./payment";

const button = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-center font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900";
const secondary = `${button} border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100`;
const section = "mt-8 space-y-4 rounded-2xl border border-neutral-200 p-5 leading-7 sm:p-6";

function topAreaSummary(result: Result) {
  const name = dimensionNames[result.highest];
  return `I dina svar är ${name.toLowerCase()} det tydligaste området. ${dimensionExplanations[result.highest]}`;
}

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

function interplay(result: Result) {
  const first = dimensionNames[result.highest].toLowerCase();
  const second = dimensionNames[result.second].toLowerCase();
  if (result.highest === "hyperarousal" && result.second === "avoidance") return "I dina svar syns både stark beredskap och ett mönster av att hålla sådant som väcker obehag på avstånd. Tillsammans kan de reaktionerna göra återhämtning eller vardagliga val mer krävande.";
  if (result.highest === "reexperiencing" && result.second === "avoidance") return "I dina svar syns både påminnelser som väcker reaktioner och försök att undvika sådant som känns svårt. Det mönstret kan innebära att vissa situationer får extra stor plats i vardagen.";
  return `${first[0].toUpperCase() + first.slice(1)} och ${second} ligger högst i dina svar. När två områden framträder samtidigt kan de förstärka hur belastande reaktionerna upplevs, men testet kan inte avgöra varför de ser ut så.`;
}

function impactCopy(result: Result) {
  const items = result.drivers.dailyImpact.filter((item) => item.answer >= 2);
  if (!items.length) return "I frågorna om vardagen framträder ingen enskild del som särskilt stark. Det betyder inte att andra reaktioner saknar betydelse, utan att den här delen av självtestet är mindre framträdande i dina svar.";
  const labels: Record<number, string> = {
    25: "påverkan på nära relationer",
    26: "svårigheter med arbete, studier eller vardagliga uppgifter",
    27: "begränsningar i platser, aktiviteter eller sociala situationer",
    28: "energi som går åt till att hantera eller undvika reaktioner",
    29: "påverkan på livskvaliteten",
  };
  return `I vardagsdelen framträder särskilt ${items.slice(0, 2).map((item) => labels[item.index]).join(" och ")}.`;
}

function nextStep(result: Result) {
  if (result.overallPercent >= 45 && result.scores.dailyImpact >= 45) return "Eftersom flera reaktioner och en påverkan på vardagen framträder i dina svar kan det vara hjälpsamt att överväga kontakt med vårdcentral eller annan professionell vårdkontakt för en bedömning. Du behöver inte ha en färdig förklaring för att be om stöd.";
  if (result.scores.dailyImpact >= 45) return "När reaktioner påverkar vardag, relationer eller återhämtning kan det vara värdefullt att prata med vårdcentral eller annan professionell kontakt om vad som skulle kunna hjälpa dig.";
  return "Du kan använda resultatet för att lägga märke till vilka situationer, påminnelser eller reaktioner som återkommer. Om besvären ökar eller börjar begränsa din vardag kan du söka professionellt stöd.";
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

  function checkout() {
    if (!payment.prepareCheckout({ version: STATE_VERSION, index, answers, unlocked })) return;
    if (!PTSD_STRIPE_URL.startsWith("https://buy.stripe.com/")) { setCheckoutUnavailable(true); return; }
    tracking.checkout();
    window.location.assign(PTSD_STRIPE_URL);
  }

  if (!hydrated) return <p className="mt-6" role="status">Laddar testet…</p>;

  return <>
    {!showResult && <div className="mt-5"><p className="leading-7 text-neutral-700">Tänk på den senaste månaden. Hur ofta har följande stämt för dig i samband med en mycket svår eller traumatisk upplevelse?</p><p className="mt-4 text-sm leading-6 text-neutral-600">30 frågor · fem områden · svaren sparas lokalt i den här webbläsaren.</p></div>}
    {unlocked && <aside data-flow="inset" role="status" className="mt-6 rounded-xl border border-[#bfd2c3] bg-[#f2f7f1] p-4 leading-6 text-neutral-800"><strong>Ditt test är upplåst – du behöver inte betala igen.</strong>{complete ? <p className="mt-1">Din fullständiga analys visas nedan.</p> : <p className="mt-1">Svara på frågorna igen så öppnas hela analysen direkt efter sista svaret.</p>}</aside>}
    {payment.checkoutError && <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 leading-6">{payment.checkoutError}</p>}
    {storageUnavailable && <p role="status" className="mt-6 rounded-xl border border-neutral-300 bg-neutral-50 p-4 text-sm leading-6">Webbläsaren kan inte spara testet. Lämna inte sidan om du vill behålla dina svar.</p>}

    {!showResult && <section data-flow="question" data-nosnippet className={section} aria-labelledby="question-heading"><div className="flex justify-between gap-2 text-sm text-neutral-600"><span>Fråga {index + 1} av {questions.length}</span><span>{answered} av {questions.length} besvarade</span></div><progress aria-label="Besvarade frågor" value={answered} max={questions.length} className="h-2 w-full accent-[#576f60]" /><h2 ref={heading} tabIndex={-1} id="question-heading" className="text-xl font-semibold leading-snug outline-none sm:text-2xl">{questions[index].text}</h2><div role="group" aria-labelledby="question-heading" className="space-y-2"><p className="text-sm text-neutral-600">Hur ofta stämmer detta för dig?</p>{answerLabels.map((label, value) => <button type="button" key={label} disabled={transitioning} aria-pressed={answers[index] === value} onClick={() => choose(value)} className={`flex min-h-12 w-full items-center rounded-xl border p-3 text-left leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#576f60] ${answers[index] === value ? "border-[#576f60] bg-[#f2f7f1] font-semibold" : "border-neutral-300 bg-white hover:bg-neutral-50"}`}>{label}</button>)}</div><button type="button" disabled={index === 0 || transitioning} onClick={() => { moveFocus.current = true; setIndex(index - 1); }} className={`${secondary} disabled:cursor-not-allowed disabled:opacity-40`}>Tillbaka</button><p className="text-xs leading-5 text-neutral-500">Svaren sparas lokalt i den här webbläsaren.</p></section>}

    {showResult && analyzing && !unlocked && <section data-flow="analysis" className={section} aria-busy="true"><h2 ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">Vi sammanställer ditt resultat</h2><p role="status" aria-live="polite">{["Analyserar dina svar…", "Identifierar symtommönster…", "Jämför dina områden…", "Sammanställer ditt resultat…"][analysisStep ?? 0]}</p></section>}

    {showResult && (!analyzing || unlocked) && result && preview && <div data-ptsd-result>
      {!unlocked ? <>
        <section data-flow="card" className={section} aria-labelledby="result-heading"><p className="text-lg font-semibold text-neutral-950">{symptomLevel(result.overallPercent)}</p><h2 ref={heading} tabIndex={-1} id="result-heading" className="text-2xl font-semibold outline-none">Ditt tydligaste område: {dimensionNames[result.highest]}</h2><p>{topAreaSummary(result)}</p><div data-flow="inset" className="rounded-xl bg-neutral-50 p-4"><p className="font-semibold">{dimensionNames[result.highest]}</p><p className="mt-1 text-sm text-neutral-700">{areaLevel(result.scores[result.highest])}</p><p className="mt-2 text-sm text-neutral-700">{dimensionExplanations[result.highest]}</p></div><p className="text-sm text-neutral-600">Det här är ett självtest och resultatet innebär inte att du har PTSD.</p></section>
        <section data-flow="paywall" ref={paywallRef} className="mt-8 space-y-5 rounded-[20px] bg-[#18241e] px-[18px] py-6 leading-7 text-white"><h2 className="text-2xl font-semibold">{preview.title}</h2><p className="text-neutral-200">{preview.body}</p><div className="space-y-4 border-t border-white/15 pt-5"><ul className="space-y-2 text-neutral-100"><li>🔒 Din personliga symtomprofil</li><li>🔒 Dina starkaste reaktionsmönster</li><li>🔒 Hur dina områden samspelar</li><li>🔒 Påverkan på vardag och relationer</li><li>🔒 Vad du kan göra härnäst</li></ul><div><p className="font-semibold">{PRICE_SEK} kr</p><p className="text-sm text-neutral-300">Engångsbetalning · Direkt tillgång · Ingen prenumeration</p></div><PaywallCheckoutCTA onClick={checkout} label="Full analys – 39 kr" />{checkoutUnavailable && <p role="status" className="text-sm text-neutral-200">Köp är inte tillgängligt just nu. Dina svar finns kvar här.</p>}</div></section>
        <div className="mt-5 text-center"><button type="button" onClick={restart} className="min-h-11 text-sm text-neutral-700 underline underline-offset-4 hover:text-neutral-950">Gör om testet</button></div>
      </> : <>
        <section data-flow="card" className={section} aria-labelledby="result-heading"><p className="text-sm font-semibold uppercase tracking-wide text-neutral-600">Fullständig analys</p><h2 ref={heading} tabIndex={-1} id="result-heading" className="text-2xl font-semibold outline-none">Din PTSD-relaterade symtomprofil</h2><p>{symptomLevel(result.overallPercent)}. Procentvärdena beskriver bara hur dina svar fördelas i detta självtest, inte sannolikheten för en diagnos.</p><div className="grid gap-3 sm:grid-cols-2">{dimensions.map((dimension) => <div data-flow="inset" key={dimension} className="min-w-0 rounded-xl bg-neutral-50 p-4"><h3 className="font-semibold">{dimensionNames[dimension]}</h3><p className="mt-1 text-sm text-neutral-700">{areaLevel(result.scores[dimension])}</p><div className="mt-3 h-2 overflow-hidden rounded bg-neutral-200"><div data-flow="fill" className="h-full rounded bg-[#576f60]" style={{ width: `${result.scores[dimension]}%` }} /></div><p className="mt-2 text-sm text-neutral-700">{result.scores[dimension]} av 100</p></div>)}</div></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Övergripande personlig analys</h2><p>{topAreaSummary(result)}</p><p>{dimensionNames[result.second]} är näst mest framträdande. Skillnaden mellan områdena visar att helheten inte bara handlar om en totalpoäng, utan om hur olika reaktioner förhåller sig till varandra i dina svar.</p></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Fördjupning per område</h2><div className="space-y-5">{dimensions.map((dimension) => <div key={dimension} className="border-t border-neutral-200 pt-5 first:border-t-0 first:pt-0"><h3 className="font-semibold text-neutral-950">{dimensionNames[dimension]}</h3><p>{dimensionExplanations[dimension]}</p><p><strong>I dina svar:</strong> {areaLevel(result.scores[dimension])}.</p><p className="font-medium">Reaktioner som ligger högst i det här området:</p><ul className="list-disc space-y-2 pl-5 text-sm">{result.drivers[dimension].filter((item) => item.answer > 0).map((item) => <li key={item.index}>{item.text}</li>)}{!result.drivers[dimension].some((item) => item.answer > 0) && <li>Inga enskilda reaktioner framträder i dina svar inom detta område.</li>}</ul></div>)}</div></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Så hänger dina svar ihop</h2><p>{interplay(result)}</p></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Det som påverkar dig mest</h2><p>{impactCopy(result)}</p><p>{result.scores.dailyImpact >= 45 ? "Påverkan på vardagen är en tydlig del av ditt resultat. Det kan vara värdefullt att ge den delen extra utrymme när du funderar på stöd och återhämtning." : "Vardagspåverkan är mindre framträdande i just dina svar, men behöver alltid förstås utifrån din egen situation."}</p></section>
        <section data-flow="card" className={section}><h2 className="text-2xl font-semibold">Nästa steg</h2><p>{nextStep(result)}</p><p className="text-sm text-neutral-600">Testet undersöker inte suicidtankar och säger därför inget om suicidrisk.</p></section>
        <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => { moveFocus.current = true; setEditing(true); setIndex(0); }} className={secondary}>Granska mina svar</button><button type="button" onClick={restart} className={secondary}>Börja om</button></div>
        <PostPurchaseRecommendation sourceTest="ptsd_test" recommendedTest="angest_test" />
      </>}
    </div>}
  </>;
}
