"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { answerLabels, band, calculate, domainCopy, domains, emptyAnswers, parseState, questions, recommendations, SCREENING_CHECKOUT_URL, SCREENING_PRICE_SEK, STATE_VERSION, STORAGE_KEY } from "./screening";

import { resultAnalysis } from "./analysis";

const button = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 text-center font-semibold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900";
const secondary = button + " border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-100";
const primary = button + " bg-neutral-900 text-white hover:bg-neutral-800";
const link = "underline underline-offset-4 decoration-neutral-400 focus-visible:outline-2 focus-visible:outline-offset-4";
const section = "mt-8 space-y-4 rounded-2xl border border-neutral-200 p-5 leading-7 sm:p-6";

export default function ScreeningPage() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(emptyAnswers);
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [editing, setEditing] = useState(false);
  const [storageUnavailable, setStorageUnavailable] = useState(false);
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
  const profile = useMemo(() => calculate(answers), [answers]);
  const suggested = useMemo(() => recommendations(profile), [profile]);
  const analysis = useMemo(() => resultAnalysis(profile, answers), [profile, answers]);
  useEffect(() => {
    if (moveFocus.current) { heading.current?.focus({ preventScroll: true }); moveFocus.current = false; }
  }, [index, showResult, hydrated]);

  function navigate(next: number) { moveFocus.current = true; setIndex(next); }
  function selectAnswer(value: number) {
    if (answerLock.current) return;
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
    setIndex(0); setAnswers(emptyAnswers()); setUnlocked(false); setEditing(false); moveFocus.current = true;
    try { localStorage.removeItem(STORAGE_KEY); } catch { setStorageUnavailable(true); }
  }
  function checkout() {
    // Save before redirect; don't lose a purchased result when storage is blocked.
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: STATE_VERSION, index, answers, unlocked }));
      if (!parseState(localStorage.getItem(STORAGE_KEY))) throw new Error("storage unavailable");
    } catch { setStorageUnavailable(true); return; }
    window.location.href = SCREENING_CHECKOUT_URL;
  }

  if (!hydrated) return <p className="mt-6" role="status">Laddar testet...</p>;
  return <>
    {storageUnavailable && <p role="status" className="mt-6 rounded-xl border border-neutral-300 bg-neutral-50 p-4 text-sm leading-6">Webbläsaren kan inte spara testet. Du kan svara här, men återupptagning och betalning behöver fungerande lokal lagring. Lämna inte sidan om du vill behålla svaren.</p>}
    {!showResult && <section className={section} aria-labelledby="question-heading">
      <div className="flex flex-wrap justify-between gap-2 text-sm text-neutral-600"><span>Fråga {index + 1} av {questions.length}</span><span>{answeredCount} av {questions.length} besvarade</span></div>
      <progress aria-label="Besvarade frågor" value={answeredCount} max={questions.length} className="h-2 w-full accent-neutral-900" />
      <h2 ref={heading} tabIndex={-1} id="question-heading" className="text-xl font-semibold leading-snug outline-none sm:text-2xl">{questions[index].text}</h2>
      <div role="group" aria-labelledby="question-heading" className="space-y-2">
        <p className="text-sm text-neutral-600">Välj ett svar för att gå vidare.</p>
        {answerLabels.map((label, value) => <button type="button" key={label} disabled={transitioning} aria-pressed={answers[index] === value} onClick={(event) => { if (event.detail <= 1) selectAnswer(value); }} onKeyDown={(event) => { if (event.repeat) event.preventDefault(); }} className={"flex min-h-12 w-full items-center rounded-xl border p-3 text-left leading-6 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 " + (answers[index] === value ? "border-neutral-900 bg-neutral-100 font-semibold" : "border-neutral-300 bg-white hover:bg-neutral-50")}>{label}</button>)}
      </div>
      <div className="flex flex-wrap gap-3 pt-2"><button type="button" disabled={index === 0 || transitioning} onClick={() => navigate(index - 1)} className={secondary + " disabled:cursor-not-allowed disabled:opacity-40"}>Tillbaka</button></div>
      <p className="text-xs leading-5 text-neutral-500">Svaren sparas lokalt i den här webbläsaren. Du kan ändra tidigare svar med Tillbaka.</p>
    </section>}
    {showResult && <div data-screening-result>
      {profile.safety && <aside aria-label="Stöd och säkerhet" className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6">
        <p><strong>Känner du dig otrygg i relationen?</strong> Du kan läsa om <Link href="/psykiskt-vald/hjalp" className={link}>stöd och hjälp</Link> här. Vid akut fara, ring 112.</p>
      </aside>}
      {!unlocked ? <section className={section} aria-labelledby="result-heading">
        <h2 id="result-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">{profile.elevated.length === 1 ? "Vi hittade en tydlig signal i dina svar" : profile.elevated.length > 1 ? "Vi hittade flera signaler i dina svar" : "Vi hittade få tydliga varningssignaler"}</h2>
        {profile.elevated.length > 0 ? <ul aria-label="Områden som sticker ut" className="space-y-3">{profile.elevated.slice(0,3).map(domain => <li key={domain} className="rounded-xl bg-neutral-50 p-4"><p className="font-semibold">{domainCopy[domain].label}</p><p className="mt-1 text-sm text-neutral-600">{band(profile.scores[domain])}</p></li>)}</ul> : <p>{analysis.zero ? "Du har inte rapporterat några av de beteenden eller upplevelser som screeningen frågar om." : `Det område som märks mest i dina svar är ${domainCopy[profile.ranked[0]].label.toLowerCase()}. Nivån är ${band(profile.scores[profile.ranked[0]]).toLowerCase()} och ligger under gränsen för förhöjda signaler.`}</p>}
        <p>{analysis.zero ? "Den fullständiga analysen hjälper dig att reflektera över vad som fick dig att göra testet och vilka behov eller fungerande delar du vill ge mer utrymme." : "Din screening visar vilka områden som sticker ut. Den fullständiga analysen går vidare och förklarar vad i dina svar som påverkat resultatet, hur mönstren kan hänga ihop och vad som kan vara relevant att uppmärksamma."}</p>
        <button type="button" onClick={checkout} className={primary + " w-full"}>Lås upp min analys – {SCREENING_PRICE_SEK} kr</button>
        <p className="text-sm text-neutral-600">Engångsköp – 79 kr för din fullständiga screeninganalys.</p>
      </section> : <>
        <section className={section} aria-labelledby="result-heading"><h2 id="result-heading" ref={heading} tabIndex={-1} className="text-2xl font-semibold outline-none">Din analys</h2>{analysis.paragraphs.map((text,i) => <p key={i}>{text}</p>)}</section>
        <section className={section}><h2 className="text-2xl font-semibold">Så hänger dina svar ihop</h2>{analysis.connections.map(item => <p key={item.id} data-insight={item.id}>{item.text}</p>)}</section>
        <section className={section}><h2 className="text-2xl font-semibold">Det här sticker ut i dina svar</h2>
          {analysis.observations.map(item => <div key={item.domain} className="space-y-3 border-t border-neutral-200 pt-4"><h3 className="text-xl font-semibold">{item.heading}</h3><p>{item.text}</p><p className="rounded-xl bg-neutral-50 p-3 text-sm">Ett konkret svar: ”{item.marker.text}” — {answerLabels[item.marker.value]}.</p><p>{item.reflection}</p><Link href={item.guide} className={link}>{item.guideLabel}</Link></div>)}
          {analysis.zero && <><p>Inget av de efterfrågade mönstren finns rapporterat. Vad fick dig att söka testet: ett behov, en enskild situation eller något som frågorna inte tog upp?</p><p>Fundera på vad du själv upplever fungerar, till exempel utrymme för egna val, privatliv och ett nej utan rädsla. Det är sådant du kan vilja bevara.</p><Link href="/beteenden" className={link}>Utforska guiden om beteenden i relationer</Link></>}
        </section>
        <section className={section}><h2 className="text-2xl font-semibold">Vad kan du göra med resultatet?</h2><ol className="list-decimal space-y-4 pl-5">{analysis.nextSteps.map(text => <li key={text}>{text}</li>)}</ol></section>
        <section className={section}><h2 className="text-xl font-semibold">Din fullständiga profil</h2><div className="grid gap-3 sm:grid-cols-2">{domains.map(domain => {
          const level = profile.scores[domain] >= 65 ? 4 : profile.scores[domain] >= 45 ? 3 : profile.scores[domain] >= 25 ? 2 : 1;
          return <div key={domain} className="min-w-0 rounded-xl bg-neutral-50 p-3"><h3 className="text-sm font-semibold">{domainCopy[domain].label}</h3><p className="mt-1 text-sm text-neutral-600">{band(profile.scores[domain])}</p><div className="mt-2 flex gap-1" aria-hidden="true">{[1,2,3,4].map(part => <span key={part} className={`h-1 flex-1 rounded ${part <= level ? "bg-neutral-500" : "bg-neutral-200"}`} />)}</div></div>;
        })}</div></section>
      </>}
      <section className="mt-8 space-y-2 text-sm leading-6 text-neutral-600"><h2 className="font-semibold text-neutral-900">Om resultatet</h2><p>Screeningen är ett reflektionsverktyg baserat på dina egna svar. Den ställer inte diagnoser och avgör inte juridiskt om ett brott har begåtts.</p><Link href="/metodik" className={link}>Läs om metodiken</Link></section>
      {unlocked && <section className={section}><h2 className="text-2xl font-semibold">Vill du förstå något område bättre?</h2>{suggested.length ? <div className="space-y-4">{suggested.map(item => <div key={item.href} className="space-y-3 rounded-xl bg-neutral-50 p-4"><h3 className="font-semibold">{item.title}</h3><p>{item.reason}</p><Link href={item.href} className={secondary + " w-full"}>{item.href === "/gaslightingtest/test" ? "Gör gaslightingtestet" : "Gör testet"}</Link></div>)}</div> : <p>Den här profilen pekar inte ut något särskilt fördjupningstest. Du kan börja med <Link href="/beteenden" className={link}>guiden om beteenden i relationer</Link> om du vill sätta ord på en egen fråga.</p>}</section>}
      <div className="mt-6 flex flex-wrap gap-3"><button type="button" onClick={() => { moveFocus.current = true; setEditing(true); setIndex(0); }} className={secondary}>Granska mina svar</button><button type="button" onClick={restart} className={secondary}>Börja om</button></div>
    </div>}
    <nav aria-label="Stöd och vidare läsning" className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm"><Link href="/" className={link + " inline-flex min-h-11 items-center"}>Till startsidan</Link>{(!showResult || !profile.safety) && <Link href="/psykiskt-vald/hjalp" className={link + " inline-flex min-h-11 items-center"}>Stöd och hjälp</Link>}</nav>
  </>;
}
