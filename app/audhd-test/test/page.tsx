"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import PaywallCheckoutCTA from "../../_components/PaywallCheckoutCTA";
import PostPurchaseRecommendation from "../../_components/PostPurchaseRecommendation";
import type { TestId } from "../../_analytics/config";
import { AUDHD_STRIPE_URL } from "./payment";
import { answerLabels, calculateReport, contextQuestions, descriptiveLevel, dimensionNames, dimensions, emptyAnswers, emptyContextAnswers, formatPercent, parseState, PRICE_SEK, questions, REPORT_VERSION, STORAGE_KEY, type Report } from "./model";
import { useAudhdAnalytics } from "./analytics";

const card = "mt-7 space-y-5 rounded-[26px] border border-neutral-200 bg-white p-5 leading-7 shadow-sm sm:p-7";
const btn = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900";

function freeMainResult(profileType: Report["profileType"]) {
  if (profileType === "Kombinerat dragmönster" || profileType === "Mycket framträdande kombinationsmönster") return "Dina svar visar tydliga drag från både ADHD- och autismrelaterade områden.";
  if (profileType === "ADHD-dominerat kombinationsmönster" || profileType === "Främst ADHD-liknande profil") return "Din profil lutar främst åt ADHD-relaterade drag, med vissa autismrelaterade inslag.";
  if (profileType === "Autismdominerat kombinationsmönster" || profileType === "Främst autismrelaterad profil") return "Dina svar visar främst autismrelaterade drag, medan ADHD-delen är mindre framträdande.";
  if (profileType === "Vissa drag från båda områdena") return "Dina svar visar vissa drag från både ADHD- och autismrelaterade områden.";
  if (profileType === "Gränsnära/ojämn profil") return "Dina svar visar ett ojämnt eller gränsnära mönster som behöver tolkas försiktigt.";
  return "Dina svar visar inget tydligt kombinerat mönster.";
}

function secondaryTeaser(report: Report) {
  const hasStrongPeak = report.outliers.some(item => item.kind === "stark topp");
  if (report.teaser.type === "friction" && hasStrongPeak) return "Ett av dina åtta områden ligger tydligt högre än resten av profilen.";
  if (hasStrongPeak) return "Din individuella kombination visar ett tydligt mönster som inte syns om man bara tittar på ADHD och autism var för sig.";
  if (Math.abs(report.indices.adhdIndex - report.indices.autismIndex) >= 15) return "Det finns mer att förstå i hur de två huvudområdena samspelar än i en totalsiffra.";
  if (report.indices.frictionIndex >= 50 || report.indices.maskingIndex >= 60) return "Flera viktiga mönster framträder först när hela din individuella kombination sätts i sammanhang.";
  return "Din fullständiga analys visar hur flera områden hänger ihop i just din profil.";
}

function audhdRecommendations(report: Report): [TestId, TestId] {
  const difference = report.indices.adhdIndex - report.indices.autismIndex;
  return difference <= -15 ? ["autism_test", "adhd_test"] : ["adhd_test", "autism_test"];
}

function primaryTeaser(report: Report) {
  // Masking and friction remain premium-only even when they determine teaser priority.
  if (report.teaser.type === "friction" || report.teaser.type === "masking") return {
    title: "Flera intressanta mönster framträder i din profil.",
    body: "Den fullständiga analysen visar hur de olika delarna hänger ihop utan att reducera resultatet till en totalsiffra.",
  };
  if (report.teaser.type === "sensory_peak") return {
    title: "Ett av dina åtta områden ligger tydligt högre än resten av profilen.",
    body: "I den fullständiga analysen ser du vilket område det gäller och vad som nyanserar bilden.",
  };
  if (report.teaser.type === "generic") return {
    title: "Din individuella kombination rymmer mer än en totalsiffra.",
    body: "Den fullständiga analysen visar hur de åtta områdena kan hänga ihop i just din profil.",
  };
  return report.teaser;
}

function mapAreasToUnlock(report: Report) {
  // This is presentation-only prioritisation. It uses existing report signals and
  // never changes scores, the report model, or which answers are saved.
  const priority = Object.fromEntries(dimensions.map(key => [key, 0])) as Record<typeof dimensions[number], number>;
  const keyFindings = report.keyFindings.join(" ").toLocaleLowerCase("sv-SE");

  for (const outlier of report.outliers) {
    priority[outlier.key] += outlier.kind === "stark topp" ? 60 : outlier.kind === "tydlig topp" ? 40 : 30;
  }

  if (report.indices.adhdIndex >= 25) {
    priority.A += report.scores.A * .6;
    priority.B += report.scores.B * .4;
  }
  if (report.indices.autismIndex >= 25) {
    priority.C += report.scores.C * .4;
    priority.D += report.scores.D * .35;
    priority.E += report.scores.E * .25;
  }
  if (Math.abs(report.adhd.difference) >= 12) priority[report.adhd.difference > 0 ? "A" : "B"] += 35;
  if (report.autism.difference >= 10) priority[report.autism.ranked[0]] += 35;
  if (report.indices.maskingIndex >= 50) priority.F += 45;
  else if (report.indices.maskingIndex >= 25) priority.F += 15;
  if (report.indices.frictionIndex >= 50) priority.G += 45;
  else if (report.indices.frictionIndex >= 25) priority.G += 15;
  if (report.impact.combined >= 35) priority.H += 25;

  for (const key of dimensions) {
    if (keyFindings.includes(dimensionNames[key].toLocaleLowerCase("sv-SE"))) priority[key] += 30;
  }
  if (keyFindings.includes("friktion")) priority.G += 30;
  if (keyFindings.includes("anpassning")) priority.F += 30;
  if (keyFindings.includes("vardagspåverkan")) priority.H += 30;

  return new Set([...dimensions]
    .sort((left, right) => priority[left] - priority[right] || dimensions.indexOf(left) - dimensions.indexOf(right))
    .slice(0, 4));
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
  page.document.write(`<!doctype html><html lang="sv"><head><title>Min AuDHD-profil</title><style>body{font:15px Arial;max-width:760px;margin:36px auto;line-height:1.6;color:#24312b}h1,h2{font-family:Georgia,serif}table{width:100%;border-collapse:collapse}td{padding:10px;border-bottom:1px solid #ddd}small{color:#526}</style></head><body><h1>Min AuDHD-profil</h1><p>${new Date().toLocaleDateString("sv-SE")}</p><h2>${report.profileType}</h2><p>ADHD-relaterat index: ${formatPercent(report.indices.adhdIndex)}/100 · Autismrelaterat index: ${formatPercent(report.indices.autismIndex)}/100</p><h2>Viktigast i min profil</h2><ul>${report.keyFindings.map(item => `<li>${item}</li>`).join("")}</ul><h2>Åtta områden</h2><table>${rows}</table><h2>Profiler</h2><p><strong>ADHD:</strong> ${report.adhd.label}<br><strong>Autism:</strong> ${report.autism.label}</p><h2>Friktion</h2><p>${report.friction.top.map(item => item.label).join(" · ")}</p><h2>Masking</h2><p>${report.masking.text}</p><h2>Vardagspåverkan</h2><p>${report.impact.text}</p><h2>Utvecklingsmönster</h2><p>${report.development.text}</p><p><small>AuDHD är ett informellt begrepp, inte en separat diagnos. Detta är Relationsvarnings självskattning och ersätter inte klinisk bedömning.</small></p><script>print()</script></body></html>`); page.document.close();
}

export default function AudhdTestPage() {
  const [answers, setAnswers] = useState<number[]>(emptyAnswers); const [context, setContext] = useState<number[]>(emptyContextAnswers);
  const [questionIndex, setQuestionIndex] = useState(0); const [contextIndex, setContextIndex] = useState(0); const [phase, setPhase] = useState<"questions" | "context" | "analysis" | "result">("questions");
  const [unlocked, setUnlocked] = useState(false); const [hydrated, setHydrated] = useState(false); const [transitioning, setTransitioning] = useState(false); const [analysisStep, setAnalysisStep] = useState(0); const [checkoutUnavailable, setCheckoutUnavailable] = useState(false); const [storageError, setStorageError] = useState(false); const [paymentRecoveryRequired, setPaymentRecoveryRequired] = useState(false); const [recoveryNotice, setRecoveryNotice] = useState(false); const [recoveryLinkInvalid, setRecoveryLinkInvalid] = useState(false);
  const lock = useRef(false); const checkoutPending = useRef(false); const analytics = useAudhdAnalytics(); const complete = answers.every(v => v >= 0) && context.every(v => v >= 0);
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
            analytics.purchase();
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
  }, []);
  useEffect(() => { if (!hydrated || paymentRecoveryRequired) return; try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ reportVersion: REPORT_VERSION, answers, contextAnswers: context, questionIndex, contextIndex, unlocked, report })); } catch { setStorageError(true); } }, [answers, context, questionIndex, contextIndex, unlocked, report, hydrated, paymentRecoveryRequired]);
  useEffect(() => { if (unlocked && report) analytics.result(); }, [unlocked, report]);
  useEffect(() => { if (phase !== "analysis" || !report) return; const timers = [setTimeout(() => setAnalysisStep(1), 1200), setTimeout(() => setAnalysisStep(2), 2500), setTimeout(() => { analytics.analysis(); setPhase("result"); analytics.paywall(report.teaser.type); }, 4000)]; return () => timers.forEach(clearTimeout); }, [phase, report]);
  function answer(value: number) { if (lock.current) return; lock.current = true; setTransitioning(true); if (phase === "questions") { const next = answers.map((item, i) => i === questionIndex ? value : item); setAnswers(next); const count = next.filter(item => item >= 0).length; analytics.progress(count); if (count === 1) analytics.start(); setTimeout(() => { if (questionIndex < 47) setQuestionIndex(questionIndex + 1); else { analytics.complete(); setPhase("context"); } lock.current = false; setTransitioning(false); }, 180); } else { const next = context.map((item, i) => i === contextIndex ? value : item); setContext(next); setTimeout(() => { if (contextIndex < 5) setContextIndex(contextIndex + 1); else setPhase("analysis"); lock.current = false; setTransitioning(false); }, 180); } }
  function checkout() { if (!report || unlocked) { setUnlocked(true); return; } if (checkoutPending.current) return; try { const checkoutState = { reportVersion: REPORT_VERSION, answers, contextAnswers: context, questionIndex, contextIndex, unlocked: false, report }; localStorage.setItem(STORAGE_KEY, JSON.stringify(checkoutState)); const persisted = parseState(localStorage.getItem(STORAGE_KEY)); if (!hasCompleteSavedState(persisted) || persisted?.unlocked) throw new Error("Checkout state could not be persisted"); } catch { setStorageError(true); return; } if (!AUDHD_STRIPE_URL.startsWith("https://buy.stripe.com/")) { setCheckoutUnavailable(true); return; } checkoutPending.current = true; analytics.cta(report.teaser.type); analytics.checkout(); window.location.href = AUDHD_STRIPE_URL; }
  function restart() { setAnswers(emptyAnswers()); setContext(emptyContextAnswers()); setQuestionIndex(0); setContextIndex(0); setPhase("questions"); setCheckoutUnavailable(false); try { localStorage.removeItem(STORAGE_KEY); } catch { setStorageError(true); } }
  if (!hydrated) return <p className="mt-8" role="status">Laddar testet…</p>;
  const storageNotice = storageError ? <p role="status" className="mt-6 rounded-xl border border-neutral-300 bg-[#ede4db] p-4 text-sm leading-6">Webbläsaren kan inte spara testet säkert. Du kan fortsätta här, men lämna inte sidan om du vill behålla svaren.</p> : null;
  const recoveryMessage = recoveryNotice ? <p role="status" className="mt-6 rounded-xl border border-[#c8a777] bg-[#fff8e8] p-4 text-sm font-medium leading-6 text-[#4a3823]">Ditt test är redan upplåst – du behöver inte betala igen.</p> : null;
  const invalidRecoveryMessage = recoveryLinkInvalid ? <p role="alert" className="mt-6 rounded-xl border border-[#d6a5a9] bg-[#fff5f5] p-4 text-sm leading-6 text-[#702d36]">Recovery-länken är ogiltig eller har gått ut. Inget har låsts upp.</p> : null;
  if (paymentRecoveryRequired) return <>{storageNotice}<section className={card} role="alert" aria-live="assertive"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#9d5663]">Betalningen behöver kopplas till dina svar</p><h2 className="text-2xl font-semibold">Vi kan inte öppna rapporten ännu</h2><p>Vi hittar inga kompletta AuDHD-svar i den här webbläsaren. Din betalning är inte borttappad, men rapporten kan inte återskapas utan de sparade testsvaren.</p><p>Kontakta <a className="underline underline-offset-4" href="mailto:support@relationsvarning.se">support@relationsvarning.se</a> och ange tidpunkt för köpet samt e-postadressen som användes vid betalningen, så kan vi hjälpa dig vidare.</p></section></>;
  if (phase === "questions" || phase === "context") { const isContext = phase === "context"; const item = isContext ? contextQuestions[contextIndex] : questions[questionIndex]; const selected = isContext ? context[contextIndex] : answers[questionIndex]; const current = isContext ? contextIndex + 1 : questionIndex + 1; const total = isContext ? 6 : 48; const options = isContext ? contextQuestions[contextIndex].options : answerLabels; return <>{storageNotice}{recoveryMessage}{invalidRecoveryMessage}<section className={card} aria-labelledby="question"><div className="text-sm text-neutral-600"><span>{isContext ? "Sista frågor" : `Fråga ${current} av 48`}</span></div><progress className="h-2 w-full accent-[#9d5663]" value={current - (selected >= 0 ? 0 : 1)} max={total} aria-label="Testets förlopp" /><h2 id="question" className="text-2xl font-semibold leading-snug">{isContext && contextIndex === 0 ? "Några sista frågor hjälper oss sätta dina svar i sammanhang." : item.text}</h2>{isContext && contextIndex === 0 && <p className="text-neutral-600">De ändrar inte dina index. De hjälper bara rapporten att använda ett mer försiktigt och relevant språk.</p>}<div role="group" aria-labelledby="question" className="space-y-2">{options.map((label, value) => <button key={label} type="button" disabled={transitioning} aria-pressed={selected === value} onClick={() => answer(value)} className={`flex min-h-12 w-full items-center rounded-xl border p-3 text-left ${selected === value ? "border-[#24312b] bg-[#ede4db] font-semibold" : "border-neutral-300 bg-white hover:bg-neutral-50"}`}>{label}</button>)}</div><div className="flex gap-3"><button className={`${btn} border border-neutral-300 bg-white`} type="button" disabled={transitioning || (isContext ? contextIndex === 0 : questionIndex === 0)} onClick={() => isContext ? setContextIndex(contextIndex - 1) : setQuestionIndex(questionIndex - 1)}>Tillbaka</button></div><p className="text-sm text-neutral-600">Dina svar sparas lokalt i den här webbläsaren.</p></section></>; }
  if (phase === "analysis") return <section className={card} aria-busy="true" aria-live="polite"><p className="text-sm uppercase tracking-[.16em] text-neutral-600">Din profil är på väg</p><h2 className="text-3xl font-semibold">Vi analyserar dina svar</h2><div className="space-y-3">{["Analyserar dina svar inom 8 områden…", "Jämför ADHD- och autismrelaterade mönster…", "Identifierar hur områdena samspelar hos dig…"].map((text, i) => <p key={text} className={i <= analysisStep ? "text-neutral-900" : "text-neutral-400"}>✓ {text}</p>)}</div></section>;
  if (!report) return null;
  const unlockedMapAreas = mapAreasToUnlock(report);
  const unlockedDimensions = dimensions.filter(key => unlockedMapAreas.has(key));
  const lockedDimensions = dimensions.filter(key => !unlockedMapAreas.has(key));
  const rankedUnlockedDimensions = [...unlockedDimensions].sort((left, right) => report.scores[right] - report.scores[left]);
  const unlockedMapInsight = `I den upplåsta delen är ${dimensionNames[rankedUnlockedDimensions[0]].toLocaleLowerCase("sv-SE")} och ${dimensionNames[rankedUnlockedDimensions[1]].toLocaleLowerCase("sv-SE")} mest framträdande.`;
  if (!unlocked) return <><section data-audhd-paywall className={`${card} bg-[#24312b] text-white`}>
    <div>
      <p data-audhd-kicker className="text-sm uppercase tracking-[.16em] text-[#e9d1cf]">Ditt huvudresultat</p>
      <h2 className="text-3xl font-semibold">{report.profileType}</h2>
      <p>{freeMainResult(report.profileType)}</p>
    </div>
    <div>
      <p data-audhd-kicker className="text-sm uppercase tracking-[.16em] text-[#e9d1cf]">Ett första fynd</p>
      <h3 className="text-xl font-semibold">{primaryTeaser(report).title}</h3>
      <p>{primaryTeaser(report).body}</p>
    </div>
    <div data-audhd-locked-card className="rounded-2xl border border-white/20 bg-white/10 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1"><p className="font-semibold">Din AuDHD-karta</p><p className="text-sm"><span className="sm:hidden">4 av 8 områden upplåsta</span><span className="hidden sm:inline">4 av 8 områden är upplåsta</span></p></div>
      <p className="mt-2 text-sm"><span className="sm:hidden">Här är den del av profilen du får direkt. De fyra återstående områdena innehåller några av analysens tydligaste samband.</span><span className="hidden sm:inline">Du kan redan se halva din profil. De återstående områdena innehåller några av de tydligaste sambanden och avvikelserna i din analys.</span></p>
      <div data-audhd-mobile-map className="sm:hidden"><div className="mt-3 grid grid-cols-2 gap-2 text-sm">{unlockedDimensions.map(key => <div data-audhd-free-area key={key} className="rounded-lg border bg-white p-2"><span className="block text-[13px] leading-5">{dimensionNames[key]}</span><strong className="mt-1 block text-xs leading-4">{descriptiveLevel(report.scores[key])}</strong><div data-audhd-free-track className="mt-2 h-1.5 overflow-hidden rounded"><div data-audhd-free-fill className="h-full rounded" style={{ width: `${report.scores[key]}%` }} /></div></div>)}</div><p data-audhd-free-insight className="mt-3 text-xs leading-5">{unlockedMapInsight}</p><div data-audhd-locked-panel className="mt-3 rounded-xl border p-3"><p className="font-semibold"><span aria-hidden="true">🔒</span> 4 områden återstår</p><p className="mt-1 text-xs leading-5">De innehåller några av de tydligaste avvikelserna och sambanden i din profil.</p><div className="mt-3 flex flex-wrap gap-2">{lockedDimensions.map(key => <span data-audhd-locked-chip key={key}><span aria-hidden="true">🔒</span> {dimensionNames[key]}</span>)}</div></div></div>
      <div data-audhd-desktop-map className="mt-3 hidden grid-cols-2 gap-2 text-sm sm:grid">{dimensions.map(key => unlockedMapAreas.has(key) ? <div data-audhd-free-area key={key} className="min-h-[5.5rem] rounded-lg border bg-white p-2"><div className="space-y-1"><span className="block">{dimensionNames[key]}</span><strong className="block text-xs">{descriptiveLevel(report.scores[key])}</strong></div><div data-audhd-free-track className="mt-2 h-1.5 overflow-hidden rounded"><div data-audhd-free-fill className="h-full rounded" style={{ width: `${report.scores[key]}%` }} /></div></div> : <div data-audhd-locked-area key={key} className="relative min-w-0 min-h-[5.5rem] rounded-lg border p-2"><span data-audhd-locked-title className="block min-w-0 pr-[4.75rem]">{dimensionNames[key]}</span><span data-audhd-lock-status className="absolute right-2 top-2 inline-flex items-center gap-1 whitespace-nowrap text-[11px] font-semibold leading-none"><span aria-hidden="true">🔒</span><span>Låst</span></span><div data-audhd-locked-track className="mt-2 h-1.5 rounded" /></div>)}</div>
    </div>
    <div>
      <p data-audhd-kicker className="text-sm uppercase tracking-[.16em] text-[#e9d1cf]">Fortsatt analys</p>
      <p>{secondaryTeaser(report)}</p>
    </div>
    <div>
      <h3 className="text-xl font-semibold">I din fullständiga analys ingår</h3>
      <ul className="mt-3 grid gap-3">
        <li><strong>Huvudmönster och åtta områden</strong> – se exakt vilka delar som är mest framträdande.</li>
        <li><strong>Interna konflikter och masking</strong> – förstå hur olika behov förstärker eller motverkar varandra.</li>
        <li><strong>Vardagspåverkan och utvecklingsmönster</strong> – se hur profilen passar ihop med din vardag och historik.</li>
        <li><strong>Individuell tolkning</strong> – vad som talar för och emot ett tydligt kombinerat mönster.</li>
      </ul>
    </div>
    <div data-audhd-cta-wrap className="pt-6 sm:pt-0"><PaywallCheckoutCTA onClick={checkout} label={<>Lås upp hela analysen – {PRICE_SEK}{"\u00a0"}kr</>} belowCta={<p className="mt-2 text-center text-sm">Engångsbetalning · resultatet öppnas direkt</p>} /></div>
    {checkoutUnavailable && <p role="alert">Betalning är inte konfigurerad ännu. Dina svar finns kvar lokalt.</p>}
  </section><div data-audhd-restart className="mt-3"><button type="button" className="text-sm underline" onClick={restart}>Gör om testet</button></div></>;
  const [recommendedTest, fallbackTest] = audhdRecommendations(report);
  return <><ReportView report={report} onRestart={restart} /><PostPurchaseRecommendation sourceTest="audhd_test" recommendedTest={recommendedTest} fallbackTests={[fallbackTest]} /></>;
}

function ReportView({ report, onRestart }: { report: Report; onRestart: () => void }) { return <div className="space-y-7"><section className={card}><p className="text-sm uppercase tracking-[.16em] text-neutral-600">Din huvudprofil</p><h2 className="text-3xl font-semibold">{report.profileType}</h2><p>Det här beskriver ett mönster i dina självskattade svar. Det är inte en diagnos och inte en sannolikhet för ADHD, autism eller AuDHD.</p><div className="grid gap-3 sm:grid-cols-2"><div className="rounded-2xl bg-[#ede4db] p-4"><strong>ADHD-relaterat index</strong><p className="text-3xl">{formatPercent(report.indices.adhdIndex)} / 100</p></div><div className="rounded-2xl bg-[#d7e0d6] p-4"><strong>Autismrelaterat index</strong><p className="text-3xl">{formatPercent(report.indices.autismIndex)} / 100</p></div></div></section><section className={card}><h2>Det viktigaste i din profil</h2><ul className="list-disc space-y-2 pl-5">{report.keyFindings.map(item => <li key={item}>{item}</li>)}</ul></section><section className={card}><h2>AuDHD-karta</h2><div className="space-y-3">{dimensions.map(key => <div key={key}><div className="flex justify-between gap-3 text-sm"><span>{dimensionNames[key]}</span><strong>{formatPercent(report.scores[key])}/100</strong></div><div className="mt-1 h-3 overflow-hidden rounded-full bg-neutral-200"><div className="h-full rounded-full bg-[#9d5663]" style={{ width: `${report.scores[key]}%` }} /></div></div>)}</div></section><section className={card}><h2>Dina åtta områden</h2><div className="grid gap-3">{dimensions.map(key => <div key={key} className="rounded-2xl border border-neutral-200 p-4"><div className="flex flex-wrap justify-between gap-2"><h3>{dimensionNames[key]}</h3><strong>{formatPercent(report.scores[key])}/100 · {descriptiveLevel(report.scores[key])}</strong></div><p className="mt-2 text-neutral-700">{key === "F" ? report.masking.text : key === "G" ? report.friction.text : `${dimensionNames[key]} ligger på ${descriptiveLevel(report.scores[key])} nivå i din självskattning.`}</p></div>)}</div></section><section className={card}><h2>Din ADHD-relaterade profil</h2><h3>{report.adhd.label}</h3><p>{report.adhd.text}</p></section><section className={card}><h2>Din autismrelaterade profil</h2><h3>{report.autism.label}</h3><p>{report.autism.text}</p></section><section className={card}><h2>När dina behov drar åt olika håll</h2><p>{report.friction.text}</p><ul className="list-disc pl-5">{report.friction.top.map(item => <li key={item.label}>{item.label}</li>)}</ul></section><section className={card}><h2>Masking och kompensation</h2><h3>{report.masking.title}</h3><p>{report.masking.text}</p></section><section className={card}><h2>Hur mycket mönstret påverkar vardagen</h2><h3>{report.impact.title}</h3><p>{report.impact.text}</p></section><section className={card}><h2>Har det här funnits länge?</h2><h3>{report.development.title}</h3><p>{report.development.text}</p></section><section className={card}><h2>Det som gör bilden mindre självklar</h2>{report.contradicting.length ? <ul className="list-disc space-y-2 pl-5">{report.contradicting.map(item => <li key={item}>{item}</li>)}</ul> : <p>Inga av modellens särskilda nyanserande faktorer framträder tydligt i dina svar. Det utesluter inte andra förklaringar.</p>}</section><section className={card}><h2>Andra möjliga förklaringar</h2><p>Långvarig stress, utmattning, ångest, depression, sömnproblem, trauma eller annan neuropsykiatrisk problematik kan ibland påverka liknande områden. Rapporten ställer ingen differentialdiagnos.</p></section><section className={card}><h2>Sidor av profilen som kan fungera till din fördel</h2>{report.scores.D >= 50 || report.indices.maskingIndex >= 50 ? <p>{report.scores.D >= 50 ? "Dina svar visar ett starkt och ihållande engagemang i vissa intressen eller välbekanta sätt att göra saker." : "Dina svar visar välutvecklade kompensationsstrategier och en tydlig medvetenhet om vad som tar energi."}</p> : <p>Rapporten lägger inte till generella styrkor som inte stöds av dina svar.</p>}</section><section className={card}><h2>Vad resultatet betyder och inte betyder</h2><p>AuDHD är ett informellt begrepp för samtidig ADHD och autism – inte en separat diagnos. Resultatet kan hjälpa dig att se mönster, men kan inte fastställa ADHD, autism eller AuDHD.</p></section><section className={card}><h2>Nästa steg</h2><p>{report.impact.combined >= 65 && report.development.title === "Profilen är konsekvent" ? "Om du vill undersöka ett långvarigt mönster med tydlig vardagspåverkan vidare kan en professionell bedömning vara relevant." : report.impact.combined < 35 ? "Vardagspåverkan är en viktig del av helhetsbilden. Du kan använda rapporten för att lägga märke till vilka situationer, behov och strategier som hjälper dig." : "Se rapporten som ett underlag för fortsatt reflektion. En klinisk bedömning kräver mer än ett webbtest."}</p></section><div className="flex flex-wrap gap-3"><button type="button" onClick={() => downloadPdf(report)} className={`${btn} bg-[#24312b] text-white`}>Spara min rapport som PDF</button><button type="button" onClick={onRestart} className={`${btn} border border-neutral-300 bg-white`}>Börja om</button></div></div>; }
