"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "../_analytics/analytics";
import { answerLabels, applyAnswer, calculate, dimensionDescriptions, dimensionLabels, emptyAnswers, parseState, questions, STATE_VERSION, STORAGE_KEY, type SavedState } from "./model";

const panel = "rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7";
const button = "inline-flex min-h-12 items-center justify-center rounded-xl border border-neutral-300 px-5 py-3 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900";

export default function HealthyRelationshipTest() {
  const [answers, setAnswers] = useState<number[]>(emptyAnswers);
  const [index, setIndex] = useState(0);
  const [view, setView] = useState<SavedState["view"]>("test");
  const [analysisStep, setAnalysisStep] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const lock = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const completed = useRef(false);
  const resultViewed = useRef(false);
  const recommendationsViewed = useRef(false);

  useEffect(() => {
    const restore = setTimeout(() => {
      try {
        const saved = parseState(localStorage.getItem(STORAGE_KEY));
        if (saved) {
          setAnswers(saved.answers);
          setIndex(saved.index);
          setView(saved.view);
          completed.current = saved.answers.every((answer) => answer >= 0);
        }
      } catch { /* The test remains usable without persistence. */ }
      setHydrated(true);
    }, 0);
    return () => { clearTimeout(restore); if (timer.current) clearTimeout(timer.current); };
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STATE_VERSION, answers, index, view })); } catch { /* Optional persistence. */ }
  }, [answers, hydrated, index, view]);

  useEffect(() => {
    if (view !== "analysis") return;
    trackEvent("healthy_relationship_analysis_view", { test_id: "healthy_relationship_test", total_questions: questions.length });
    const second = setTimeout(() => setAnalysisStep(1), 1000);
    const third = setTimeout(() => setAnalysisStep(2), 2000);
    const finish = setTimeout(() => { setView("result"); heading.current?.focus({ preventScroll: true }); }, 3000);
    return () => { clearTimeout(second); clearTimeout(third); clearTimeout(finish); };
  }, [view]);

  const complete = answers.every((answer) => answer >= 0);
  const answeredCount = answers.filter((answer) => answer >= 0).length;
  const result = useMemo(() => complete ? calculate(answers) : null, [answers, complete]);

  useEffect(() => {
    if (view !== "result" || !result) return;
    if (!resultViewed.current) {
      trackEvent("healthy_relationship_result_view", { test_id: "healthy_relationship_test", weakest_dimension: result.weakestRanked[0] });
      resultViewed.current = true;
    }
    if (!recommendationsViewed.current && result.recommendations.length) {
      trackEvent("healthy_relationship_recommendation_view", { test_id: "healthy_relationship_test", weakest_dimension: result.weaker[0] });
      recommendationsViewed.current = true;
    }
  }, [result, view]);

  function persist(nextAnswers: number[], nextIndex: number, nextView: SavedState["view"]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STATE_VERSION, answers: nextAnswers, index: nextIndex, view: nextView })); } catch { /* Optional persistence. */ }
  }

  function selectAnswer(value: number) {
    if (lock.current) return;
    if (answers.every((answer) => answer < 0)) trackEvent("healthy_relationship_test_start", { test_id: "healthy_relationship_test", total_questions: questions.length });
    lock.current = true;
    setTransitioning(true);
    const transition = applyAnswer(answers, index, value);
    const nextAnswers = transition.answers;
    setAnswers(nextAnswers);
    timer.current = setTimeout(() => {
      if (!transition.complete) {
        setIndex(transition.nextIndex);
        persist(nextAnswers, transition.nextIndex, "test");
      } else {
        if (!completed.current) {
          trackEvent("healthy_relationship_test_complete", { test_id: "healthy_relationship_test", total_questions: questions.length });
          completed.current = true;
        }
        setView("analysis");
        persist(nextAnswers, index, "analysis");
      }
      lock.current = false;
      setTransitioning(false);
      heading.current?.focus({ preventScroll: true });
      timer.current = null;
    }, 220);
  }

  function restart() {
    if (timer.current) clearTimeout(timer.current);
    setAnswers(emptyAnswers());
    setIndex(0);
    setView("test");
    setAnalysisStep(0);
    completed.current = false;
    resultViewed.current = false;
    recommendationsViewed.current = false;
    lock.current = false;
    setTransitioning(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Optional persistence. */ }
    heading.current?.focus({ preventScroll: true });
  }

  if (!hydrated) return <p className="mt-8" role="status">Laddar relationstestet…</p>;

  if (view === "analysis") return <section data-nosnippet className={`${panel} mt-8`} aria-labelledby="healthy-analysis-heading" aria-busy="true"><h2 ref={heading} tabIndex={-1} id="healthy-analysis-heading" className="text-2xl font-semibold outline-none">Vi analyserar dina svar</h2><p className="mt-3 leading-7 text-neutral-700">Vi jämför dina svar inom trygghet, respekt, kommunikation och andra viktiga delar av relationen.</p><ol className="mt-6 space-y-3" aria-live="polite">{["Sammanställer svar", "Jämför områden", "Förbereder resultat"].map((label, step) => <li key={label} className={`flex items-center gap-3 ${step <= analysisStep ? "text-neutral-950" : "text-neutral-400"}`}><span aria-hidden="true" className={`h-3 w-3 rounded-full ${step <= analysisStep ? "bg-[#2F6B4F]" : "bg-neutral-200"}`} />{label}</li>)}</ol></section>;

  if (view === "result" && result) return <div data-nosnippet className="mt-8 space-y-8">
    <section className={panel} aria-labelledby="healthy-result-heading"><p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">Ditt resultat</p><h2 ref={heading} tabIndex={-1} id="healthy-result-heading" className="mt-2 text-2xl font-semibold tracking-tight outline-none sm:text-3xl">{result.title}</h2><p className="mt-4 leading-7 text-neutral-700">{result.category === "strong" ? "Dina svar tyder på att trygghet, respekt och ömsesidighet fungerar väl i relationen. Inget av de områden som testet undersöker sticker ut som tydligt svagt." : "Resultatet visar hur dina svar fördelar sig mellan sex viktiga relationsområden. Det är en orienterande självskattning, inte ett facit eller en diagnos."}</p></section>
    <section className={panel}><h2 className="text-2xl font-semibold">Styrkor i relationen</h2>{result.strengths.length ? <div className="mt-5 space-y-4">{result.strengths.map((dimension) => <DimensionCard key={dimension} dimension={dimension} score={result.scores[dimension]} tone="strength" />)}</div> : <p className="mt-3 leading-7 text-neutral-700">Inget område når nivån tydlig styrka i den här självskattningen. Det betyder inte att relationen saknar positiva delar, utan att svaren är mer blandade.</p>}</section>
    <section className={panel}><h2 className="text-2xl font-semibold">Områden som kan förtjäna mer uppmärksamhet</h2>{result.weaker.length ? <div className="mt-5 space-y-4">{result.weaker.map((dimension) => <DimensionCard key={dimension} dimension={dimension} score={result.scores[dimension]} tone="attention" />)}</div> : <p className="mt-3 leading-7 text-neutral-700">Inget av de sex områdena ligger på den svagare nivån i dina svar. Fortsatt öppenhet och respekt för bådas behov kan hjälpa relationens styrkor att bestå.</p>}</section>
    <section className={panel} aria-labelledby="healthy-next-heading"><h2 id="healthy-next-heading" className="text-2xl font-semibold">Relevanta nästa steg</h2><p className="mt-3 leading-7 text-neutral-700">{result.weaker.length ? "Länkarna väljs utifrån de svagare områdena i dina svar." : "Dina svar ger ingen anledning att fylla på med problemtester. Här är en neutral fördjupning om sunda relationer."}</p><div className="mt-5 grid gap-4 sm:grid-cols-2">{result.recommendations.map((recommendation, position) => <Link key={recommendation.href} href={recommendation.href} onClick={() => trackEvent("healthy_relationship_specialist_click", { target_route: recommendation.href, destination_test: recommendation.target, weakest_dimension: result.weaker[0], recommendation_position: position + 1, position: position + 1 })} className="rounded-xl border border-neutral-200 p-5 transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"><h3 className="font-semibold">{recommendation.title}</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{recommendation.description}</p><span className="mt-4 inline-block font-semibold underline underline-offset-4">Läs vidare</span></Link>)}</div></section>
    <div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setView("test"); setIndex(0); }} className={button}>Granska mina svar</button><button type="button" onClick={restart} className={button}>Gör om testet</button></div>
  </div>;

  return <section data-nosnippet className={`${panel} mt-8`} aria-labelledby="healthy-question-heading"><div className="flex items-center justify-between gap-3 text-sm text-neutral-600"><span>Fråga {index + 1} av {questions.length}</span><span>{answeredCount} besvarade</span></div><progress aria-label="Besvarade frågor" value={answeredCount} max={questions.length} className="mt-4 h-2 w-full accent-[#2F6B4F]" /><h2 ref={heading} tabIndex={-1} id="healthy-question-heading" className="mt-6 text-xl font-semibold leading-snug outline-none sm:text-2xl">{questions[index].text}</h2><p className="mt-3 text-sm text-neutral-600">Välj det svar som bäst beskriver relationen över tid.</p><div role="group" aria-labelledby="healthy-question-heading" className="mt-5 grid gap-3">{answerLabels.map((label, value) => <button key={label} type="button" disabled={transitioning} aria-pressed={answers[index] === value} onClick={() => selectAnswer(value)} onKeyDown={(event) => { if (event.repeat) event.preventDefault(); }} className={`min-h-14 w-full rounded-xl border px-5 py-4 text-left font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-wait ${answers[index] === value ? "border-neutral-900 bg-neutral-100" : "border-neutral-300 bg-white hover:bg-neutral-50"}`}>{label}</button>)}</div><div className="mt-5"><button type="button" disabled={index === 0 || transitioning} onClick={() => setIndex((current) => Math.max(0, current - 1))} className={`${button} disabled:cursor-not-allowed disabled:opacity-40`}>Tillbaka</button></div><p className="mt-5 text-xs leading-5 text-neutral-500">Dina svar sparas lokalt i den här webbläsaren så att du kan fortsätta efter en uppdatering.</p></section>;
}

function DimensionCard({ dimension, score, tone }: { dimension: keyof typeof dimensionLabels; score: number; tone: "strength" | "attention" }) {
  return <div className="rounded-xl bg-neutral-50 p-4"><div className="flex items-center justify-between gap-4"><h3 className="font-semibold">{dimensionLabels[dimension]}</h3><span className="shrink-0 text-sm tabular-nums text-neutral-600">{score} av 6</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200" aria-hidden="true"><div className={`h-full rounded-full ${tone === "strength" ? "bg-[#2F6B4F]" : "bg-amber-700"}`} style={{ width: `${score / 6 * 100}%` }} /></div><p className="mt-3 text-sm leading-6 text-neutral-700">{dimensionDescriptions[dimension]}</p></div>;
}
