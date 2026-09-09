"use client";

import { useTestAnalytics } from "../../_analytics/useTestAnalytics";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { answerLabels, calculate, dimensionNames, dimensions, emptyAnswers, formatPercent, parseState, questions, PRICE_SEK, STATE_VERSION, STORAGE_KEY, dimensionLevel } from "./model";
import { NARCISSISM_SELFTEST_STRIPE_URL } from "./payment";

import { interpretation, profileAnalysis, teaser } from "./interpretation";

const button = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-center font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900";
const secondary = button + " border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100";
const primary = button + " bg-neutral-900 text-white hover:bg-neutral-800";
const link = "underline underline-offset-4 decoration-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-4";
const section = "mt-8 space-y-4 rounded-2xl border border-neutral-200 p-5 leading-7 sm:p-6";

export default function NarcissismSelfTestPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(emptyAnswers);
  const [unlocked, setUnlocked] = useState(false);
  const tracking = useTestAnalytics("narcissism_selftest", questions.length);
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

  useEffect(() => {
    try {
      const saved = parseState(localStorage.getItem(STORAGE_KEY));
      if (saved) { setAnswers(saved.answers); setIndex(saved.index); setUnlocked(saved.unlocked); }
    } catch { setStorageUnavailable(true); }
    const params = new URLSearchParams(window.location.search);
    if (params.get("paid") === "true") {
      tracking.purchase();
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

  const complete = answers.every((answer) => answer >= 0);
  const showResult = complete && !editing;
  const answeredCount = answers.filter((answer) => answer >= 0).length;
  const result = useMemo(() => complete ? calculate(answers) : null, [complete, answers]);
  useEffect(() => {
    if (moveFocus.current) { heading.current?.focus({ preventScroll: true }); moveFocus.current = false; }
  }, [index, showResult, hydrated]);

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
      else if (next.every(answer => answer >= 0)) setEditing(false);
      else setIndex(next.findIndex(answer => answer < 0));
      answerLock.current = false;
      setTransitioning(false);
      timer.current = null;
    }, 220);
  }
  function restart() {
    tracking.restart();
    setCheckoutUnavailable(false);
    setIndex(0); setAnswers(emptyAnswers()); setUnlocked(false); setEditing(false); moveFocus.current = true;
    try { localStorage.removeItem(STORAGE_KEY); } catch { setStorageUnavailable(true); }
  }
  function checkout() {
    // Save before redirect; don't lose a purchased result when storage is blocked.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STATE_VERSION, index, answers, unlocked }));
      if (!parseState(localStorage.getItem(STORAGE_KEY))) throw new Error("storage unavailable");
    } catch { setStorageUnavailable(true); return; }
    if (!NARCISSISM_SELFTEST_STRIPE_URL.startsWith("https://buy.stripe.com/")) { setCheckoutUnavailable(true); return; }
    tracking.checkout();
    window.location.href = NARCISSISM_SELFTEST_STRIPE_URL;
  }

  if (!hydrated) return <p className="mt-6" role="status">Laddar testet...</p>;
  return <>
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
    {showResult && result && <div data-selftest-result>
      <section ref={unlocked ? null : tracking.paywallRef} className={section} aria-labelledby="result-heading">
        <h2 id="result-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">Din övergripande profil</h2>
        <p className="text-xl font-semibold">{result.level}</p><p className="text-4xl font-semibold tabular-nums">{formatPercent(result.percent)} %</p>
        <p className="text-sm text-neutral-600">Andel av självtestets möjliga poäng, inte en sannolikhet.</p>
        {!unlocked && <><p>{teaser(result)}</p><p>Din fullständiga profil visar sex delresultat, profiltyp och en personlig analys av hur dina svar kan hänga ihop och märkas i relationer.</p><button type="button" onClick={checkout} className={primary + " w-full"}>Se min fullständiga profil</button><p className="text-sm text-neutral-600">Engångsköp – {PRICE_SEK} kr.</p>{checkoutUnavailable && <p role="status" className="text-sm text-neutral-600">Köp av fullständig profil är inte tillgängligt just nu. Dina svar finns kvar i den här webbläsaren.</p>}</>}
        {unlocked && <p className="rounded-xl bg-neutral-50 p-4"><span className="block text-sm text-neutral-600">Profiltyp</span><strong>{result.profileType}</strong></p>}
      </section>
      {unlocked && <>
        <section className={section}><h2 className="text-2xl font-semibold">Din personliga analys</h2>{profileAnalysis(result).map((text,i) => <p key={i}>{text}</p>)}</section>
        <section className={section}><h2 className="text-2xl font-semibold">Dina sex dimensionsresultat</h2><p className="text-sm text-neutral-600">Högre värden visar mer av de drag som frågorna mäter. För empati och ömsesidighet betyder ett högre värde större svårigheter.</p><div className="grid gap-3 sm:grid-cols-2">{dimensions.map(d => <div key={d} className="min-w-0 rounded-xl bg-neutral-50 p-4"><h3 className="font-semibold">{dimensionNames[d]}</h3><p className="mt-1 text-sm">{dimensionLevel(result.scores[d])} · {formatPercent(result.scores[d])} %</p><div className="mt-3 h-2 overflow-hidden rounded bg-neutral-200" aria-hidden="true"><div className="h-full rounded bg-neutral-700" style={{width: `${result.scores[d]}%`}} /></div></div>)}</div></section>
        <section className={section}><h2 className="text-2xl font-semibold">Så kan områdena märkas i ditt liv</h2>{result.ranked.map(d => { const text = interpretation(result,d); return <div key={d} className="space-y-3 border-t border-neutral-200 pt-5"><h3 className="text-xl font-semibold">{dimensionNames[d]}</h3><p>{text.summary}</p><p><strong>I vardagen: </strong>{text.everyday}</p><p><strong>I nära relationer: </strong>{text.relationship}</p><p className="rounded-xl bg-neutral-50 p-4"><strong>Att reflektera över: </strong>{text.reflection}</p></div>; })}</section>
        <section className={section}><h2 className="text-xl font-semibold">Ta med dig en konkret fråga</h2><p>Välj en situation som du kände igen dig i när du svarade. Vad hände, vad behövde du och vilket utrymme fick den andra personen? Börja med en liten förändring du själv kan påverka, till exempel att uttrycka ett önskemål tydligt eller lyssna färdigt innan du svarar.</p><Link href="/narcissism-sjalvtest" className={link}>Läs mer om de sex områdena</Link></section>
      </>}
      <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => { moveFocus.current = true; setEditing(true); setIndex(0); }} className={secondary}>Granska mina svar</button><button type="button" onClick={restart} className={secondary}>Börja om</button></div>
    </div>}
  </>;
}
