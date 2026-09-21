"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { trackEvent } from "../_analytics/analytics";
import ShareTest from "../_components/ShareTest";
import { answerLabels, applyAnswer, calculate, dimensionDescriptions, dimensionLabels, emptyAnswers, parseState, questions, STATE_VERSION, STORAGE_KEY, type SavedState } from "./model";

const panel = "rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-7";
const button = "inline-flex min-h-12 items-center justify-center rounded-xl border border-neutral-300 px-5 py-3 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900";

export default function Quickcheck() {
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
      } catch { /* The quickcheck remains usable without persistence. */ }
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
    trackEvent("quickcheck_analysis_view", { test_id: "red_flags_quickcheck", total_questions: questions.length });
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
      trackEvent("quickcheck_result_view", { test_id: "red_flags_quickcheck", dominant_dimension: result.ranked[0] });
      resultViewed.current = true;
    }
    if (!recommendationsViewed.current && result.recommendations.length) {
      trackEvent("quickcheck_recommendation_view", { test_id: "red_flags_quickcheck", dominant_dimension: result.ranked[0] });
      recommendationsViewed.current = true;
    }
  }, [result, view]);

  function persist(nextAnswers: number[], nextIndex: number, nextView: SavedState["view"]) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STATE_VERSION, answers: nextAnswers, index: nextIndex, view: nextView })); } catch { /* Optional persistence. */ }
  }

  function selectAnswer(value: number) {
    if (lock.current) return;
    const firstAnswer = answers.every((answer) => answer < 0);
    if (firstAnswer) trackEvent("quickcheck_start", { test_id: "red_flags_quickcheck", total_questions: questions.length });
    lock.current = true;
    setTransitioning(true);
    const transition = applyAnswer(answers, index, value);
    const nextAnswers = transition.answers;
    setAnswers(nextAnswers);
    timer.current = setTimeout(() => {
      if (!transition.complete) {
        const nextIndex = transition.nextIndex;
        setIndex(nextIndex);
        persist(nextAnswers, nextIndex, "test");
      } else {
        if (!completed.current) {
          trackEvent("quickcheck_complete", { test_id: "red_flags_quickcheck", total_questions: questions.length });
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
    const next = emptyAnswers();
    setAnswers(next);
    setIndex(0);
    setView("test");
    completed.current = false;
    resultViewed.current = false;
    recommendationsViewed.current = false;
    lock.current = false;
    setTransitioning(false);
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* Optional persistence. */ }
    heading.current?.focus({ preventScroll: true });
  }

  if (!hydrated) return <p className="mt-8" role="status">Laddar snabbchecken…</p>;

  if (view === "analysis") return (
    <section data-nosnippet className={`${panel} mt-8`} aria-labelledby="analysis-heading" aria-busy="true">
      <h2 ref={heading} tabIndex={-1} id="analysis-heading" className="text-2xl font-semibold outline-none">Vi analyserar dina svar</h2>
      <p className="mt-3 leading-7 text-neutral-700">Vi jämför mönstren i dina svar och sammanställer vilka områden som verkar mest framträdande.</p>
      <ol className="mt-6 space-y-3" aria-live="polite">
        {["Sammanställer svar", "Jämför mönster", "Förbereder resultat"].map((label, step) => <li key={label} className={`flex items-center gap-3 ${step <= analysisStep ? "text-neutral-950" : "text-neutral-400"}`}><span aria-hidden="true" className={`h-3 w-3 rounded-full ${step <= analysisStep ? "bg-[#2F6B4F]" : "bg-neutral-200"}`} />{label}</li>)}
      </ol>
    </section>
  );

  if (view === "result" && result) return (
    <div data-nosnippet className="mt-8 space-y-8">
      <section className={panel} aria-labelledby="quickcheck-result-heading">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-neutral-500">Ditt resultat</p>
        <h2 ref={heading} tabIndex={-1} id="quickcheck-result-heading" className="mt-2 text-2xl font-semibold tracking-tight outline-none sm:text-3xl">{result.title}</h2>
        <p className="mt-4 leading-7 text-neutral-700">{result.category === "low" ? "Dina svar visar inte något tydligt genomgående mönster av de beteenden som snabbchecken undersöker. Det utesluter inte att enskilda situationer kan vara viktiga att ta på allvar." : "Resultatet visar vilka områden som fått högst poäng i just dina svar. Det beskriver återkommande signaler, inte en diagnos, juridisk bedömning eller ett facit över relationen."}</p>
        {result.prominent.length ? <div className="mt-6 space-y-4">{result.prominent.map((dimension) => <div key={dimension} className="rounded-xl bg-neutral-50 p-4"><div className="flex items-center justify-between gap-4"><h3 className="font-semibold">{dimensionLabels[dimension]}</h3><span className="shrink-0 text-sm tabular-nums text-neutral-600">{result.scores[dimension]} av 6</span></div><div className="mt-3 h-2 overflow-hidden rounded-full bg-neutral-200" aria-hidden="true"><div className="h-full rounded-full bg-[#2F6B4F]" style={{ width: `${result.scores[dimension] / 6 * 100}%` }} /></div><p className="mt-3 text-sm leading-6 text-neutral-700">{dimensionDescriptions[dimension]}</p></div>)}</div> : null}
      </section>

      <section className={panel} aria-labelledby="recommendations-heading">
        <h2 id="recommendations-heading" className="text-2xl font-semibold">Fördjupa det som sticker ut</h2>
        <p className="mt-3 leading-7 text-neutral-700">Här visas bara nästa steg som passar de högst rankade områdena i dina svar.</p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">{result.recommendations.map((recommendation, position) => <Link key={recommendation.href} href={recommendation.href} onClick={() => trackEvent("quickcheck_specialist_test_click", { target_route: recommendation.href, destination_test: recommendation.target, dominant_dimension: result.ranked[0], recommendation_position: position + 1, position: position + 1 })} className="rounded-xl border border-neutral-200 p-5 transition-colors hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"><h3 className="font-semibold">{recommendation.title}</h3><p className="mt-2 text-sm leading-6 text-neutral-600">{recommendation.description}</p><span className="mt-4 inline-block font-semibold underline underline-offset-4">Gå till testet</span></Link>)}</div>
      </section>

      <ShareTest
        heading="Känner du någon som också vill göra snabbchecken?"
        description="Du kan skicka testet vidare. Dina egna svar och ditt resultat delas aldrig."
        shareTitle="Röda flaggor i relation – snabbcheck"
        shareText="En snabbcheck med 12 frågor om återkommande mönster i en relation."
        shareUrl="https://www.relationsvarning.se/roda-flaggor-relation-test?utm_source=share&utm_medium=referral&utm_campaign=red_flags_quickcheck"
        clickEvent="quickcheck_share_click"
        successEvent="quickcheck_share_success"
      />

      <div className="flex flex-wrap gap-3"><button type="button" onClick={() => { setView("test"); setIndex(0); }} className={button}>Granska mina svar</button><button type="button" onClick={restart} className={button}>Gör om snabbchecken</button></div>
    </div>
  );

  return (
    <section data-nosnippet className={`${panel} mt-8`} aria-labelledby="question-heading">
      <div className="flex items-center justify-between gap-3 text-sm text-neutral-600"><span>Fråga {index + 1} av {questions.length}</span><span>{answeredCount} besvarade</span></div>
      <progress aria-label="Besvarade frågor" value={answeredCount} max={questions.length} className="mt-4 h-2 w-full accent-[#2F6B4F]" />
      <h2 ref={heading} tabIndex={-1} id="question-heading" className="mt-6 text-xl font-semibold leading-snug outline-none sm:text-2xl">{questions[index].text}</h2>
      <p className="mt-3 text-sm text-neutral-600">Välj det svar som bäst beskriver ett återkommande mönster.</p>
      <div role="group" aria-labelledby="question-heading" className="mt-5 grid gap-3">{answerLabels.map((label, value) => <button key={label} type="button" disabled={transitioning} aria-pressed={answers[index] === value} onClick={() => selectAnswer(value)} onKeyDown={(event) => { if (event.repeat) event.preventDefault(); }} className={`min-h-14 w-full rounded-xl border px-5 py-4 text-left font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 disabled:cursor-wait ${answers[index] === value ? "border-neutral-900 bg-neutral-100" : "border-neutral-300 bg-white hover:bg-neutral-50"}`}>{label}</button>)}</div>
      <div className="mt-5"><button type="button" disabled={index === 0 || transitioning} onClick={() => setIndex((current) => Math.max(0, current - 1))} className={`${button} disabled:cursor-not-allowed disabled:opacity-40`}>Tillbaka</button></div>
      <p className="mt-5 text-xs leading-5 text-neutral-500">Dina svar sparas lokalt i den här webbläsaren så att du kan fortsätta efter en uppdatering.</p>
    </section>
  );
}
