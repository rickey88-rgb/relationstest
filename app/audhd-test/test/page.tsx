"use client";
import { marketText, audhdApi, norwegian, type Market } from "../../_content/market";
import { useMarket } from "../../_components/MarketProvider";
import { npfLocalPreview, showNpfPreview } from "../../_content/npfLocalPreview";

import { useEffect, useMemo, useRef, useState } from "react";
import { NewsletterAfterResult } from "../../_components/NewsletterSignup";
import ReportView from "./ReportView";
import { useTestAccountCheckout } from "../../_components/useTestAccountCheckout";
import PaywallCheckoutCTA from "../../_components/PaywallCheckoutCTA";
import PostPurchaseRecommendation from "../../_components/PostPurchaseRecommendation";
import type { TestId } from "../../_analytics/config";
import { captureGa4CheckoutAttribution } from "../../_analytics/analytics";
import { useTestAnalytics } from "../../_analytics/useTestAnalytics";
import { answerLabels, calculateReport, contextQuestions, localizedDimensionNames, emptyAnswers, emptyContextAnswers, parseState, PRICE_SEK, questions, REPORT_VERSION, STORAGE_KEY, type Report } from "./model";

import { answerLabelsNb, contextQuestionsNb, questionsNb } from "./questions.nb";
import NorwegianBookOffer from "../../no/_components/NorwegianBookOffer";

const card = "mt-7 space-y-5 rounded-[26px] border border-neutral-200 bg-white p-5 leading-7 shadow-sm sm:p-7";
const btn = "inline-flex min-h-12 items-center justify-center rounded-xl px-5 py-3 font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900";

function freeFinding(report: Report, market: Market) {
  const dimensionNames = localizedDimensionNames(market);
  // Keep masking, friction and impact/history fully premium, even when one of
  // them is the report's strongest signal. The free finding is drawn only from
  // the five core ADHD/autism dimensions and contains no level or score.
  const findingDimensions = ["A", "B", "C", "D", "E"] as const;
  const highest = [...findingDimensions].sort((left, right) => report.scores[right] - report.scores[left] || findingDimensions.indexOf(left) - findingDimensions.indexOf(right));
  const first = highest[0];
  const second = highest[1];
  const tied = report.scores[first] === report.scores[second];
  return {
    title: tied ? marketText(market, "Två områden framträder mest i dina svar.", "To områder er mest fremtredende i svarene dine.") : marketText(market, "Ett område framträder mest i dina svar.", "Ett område er mest fremtredende i svarene dine."),
    body: tied
      ? marketText(market, `${dimensionNames[first]} och ${dimensionNames[second]} ligger lika högt i din självskattning.`, `${dimensionNames[first]} og ${dimensionNames[second]} skårer like høyt i egenvurderingen din.`)
      : marketText(market, `${dimensionNames[first]} framträder mest i din självskattning.`, `${dimensionNames[first]} skiller seg mest ut i egenvurderingen din.`),
    teaser: marketText(market, "Den fullständiga analysen undersöker hur ADHD- och autismrelaterade svar samspelar, utan att dra diagnostiska slutsatser.", "Den fullstendige rapporten viser hvordan ADHD- og autismerelaterte svar henger sammen i profilen din."),
  };
}

function audhdRecommendations(report: Report): [TestId, TestId] {
  const difference = report.indices.adhdIndex - report.indices.autismIndex;
  return difference <= -15 ? ["autism_test", "adhd_test"] : ["adhd_test", "autism_test"];
}


function hasCompleteSavedState(state: ReturnType<typeof parseState>) {
  return Boolean(state && state.answers.every(value => value >= 0) && state.contextAnswers.every(value => value >= 0));
}

function hasLegacyPaidMarker(storageKey = STORAGE_KEY) {
  try { return localStorage.getItem(storageKey + ":paid") === "true"; }
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
    return { reportVersion: REPORT_VERSION, answers, contextAnswers, questionIndex: index, contextIndex: 5, unlocked: false, report: calculateReport(answers, contextAnswers) };
  } catch { return null; }
}

function restoredAudhdAnswers(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const restored = value as { reportVersion?: unknown; answers?: unknown; contextAnswers?: unknown };
  if (restored.reportVersion !== REPORT_VERSION || !Array.isArray(restored.answers) || !Array.isArray(restored.contextAnswers)) return null;
  if (restored.answers.length !== questions.length || restored.contextAnswers.length !== contextQuestions.length) return null;
  if (![...restored.answers, ...restored.contextAnswers].every(answer => Number.isInteger(answer) && answer >= 0 && answer <= 4)) return null;
  return { answers: restored.answers as number[], contextAnswers: restored.contextAnswers as number[] };
}

function clearCheckoutQuery() {
  window.history.replaceState({}, "", window.location.pathname);
}

function validCheckoutUrl(value: unknown) {
  if (typeof value !== "string") return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "checkout.stripe.com" ? url.toString() : null;
  } catch { return null; }
}

async function retryPendingCheckout(market: Market) {
  for (const delay of [0, 1500, 4000]) {
    if (delay) await new Promise(resolve => window.setTimeout(resolve, delay));
    try {
      const response = await fetch(audhdApi("/api/audhd-checkout/status", market), { cache: "no-store" });
      const body: unknown = await response.json();
      const status = body && typeof body === "object" ? (body as { status?: unknown }).status : null;
      if (status === "ready" || status === "unavailable") return status;
    } catch {
      // The route itself distinguishes temporary service trouble from invalid access.
    }
  }
  return "pending";
}

type JsonFetchResult = { ok: boolean; status: number; body: unknown };
type RecoveryRestoreFailure = "temporary" | "unavailable";

async function fetchJson(url: string): Promise<JsonFetchResult> {
  try {
    const response = await fetch(url, { cache: "no-store" });
    let body: unknown = null;
    try { body = await response.json(); } catch { /* A malformed failure response is never trusted. */ }
    return { ok: response.ok, status: response.status, body };
  } catch {
    return { ok: false, status: 0, body: null };
  }
}

/** Retry only an explicitly temporary recovery failure; a valid recovery cookie is not consumed here. */
async function restoreRecoveryWithRetry(market: Market) {
  let latest: JsonFetchResult = { ok: false, status: 0, body: null };
  for (const delay of [0, 1500, 4000]) {
    if (delay) await new Promise(resolve => window.setTimeout(resolve, delay));
    latest = await fetchJson(audhdApi("/api/audhd-recovery/restore", market));
    const retryable = latest.status === 0 || latest.status === 503 || Boolean(latest.body && typeof latest.body === "object" && (latest.body as { retryable?: unknown }).retryable === true);
    if (latest.ok || !retryable) return latest;
  }
  return latest;
}


export default function AudhdTestPage() {
  const market = useMarket();
  const isNorway = market === "no";
  const storageKey = isNorway ? STORAGE_KEY + "_no" : STORAGE_KEY;
  const [answers, setAnswers] = useState<number[]>(emptyAnswers); const [context, setContext] = useState<number[]>(emptyContextAnswers);
  const [questionIndex, setQuestionIndex] = useState(0); const [contextIndex, setContextIndex] = useState(0); const [phase, setPhase] = useState<"questions" | "context" | "analysis" | "result">("questions");
  const [unlocked, setUnlocked] = useState(false); const [hydrated, setHydrated] = useState(false); const [transitioning, setTransitioning] = useState(false); const [analysisStep, setAnalysisStep] = useState(0); const [checkoutUnavailable, setCheckoutUnavailable] = useState(false); const [storageError, setStorageError] = useState(false); const [paymentRecoveryRequired, setPaymentRecoveryRequired] = useState(false); const [recoveryNotice] = useState(false); const [recoveryLinkInvalid, setRecoveryLinkInvalid] = useState(false); const [checkoutNotice, setCheckoutNotice] = useState(false); const [checkoutPendingVerification, setCheckoutPendingVerification] = useState(false); const [recoveryEmailSent, setRecoveryEmailSent] = useState(false); const [recoveryRestoreFailure, setRecoveryRestoreFailure] = useState<RecoveryRestoreFailure | null>(null); const [recoveryRetry, setRecoveryRetry] = useState(0);
  const lock = useRef(false); const checkoutPending = useRef(false); const standardAnalytics = useTestAnalytics(isNorway ? "audhd_test_no" : "audhd_test", questions.length + contextQuestions.length); const complete = answers.every(v => v >= 0) && context.every(v => v >= 0);
  const report = useMemo(() => complete ? calculateReport(answers, context, market) : null, [answers, context, complete, market]);
  useEffect(() => {
    let disposed = false;
    async function hydrate() {
      const query = new URLSearchParams(window.location.search);
      if (!isNorway && showNpfPreview()) {
        setAnswers(questions.map(question => question.dimension === "A" ? 4 : 2));
        setContext([3, 2, 2, 3, 2, 1]); setPhase("result"); setHydrated(true); return;
      }
      const paidReturn = query.get("paid") === "true";
      const checkoutCancelled = query.get("checkout") === "cancelled";
      const checkoutUnavailableReturn = query.get("checkout") === "unavailable";
      const checkoutPendingReturn = query.get("checkout") === "pending";
      const checkoutRecoveryReturn = query.get("checkout") === "recovery";
      const recoveryReturn = query.get("recovery");
      let recoveryUnlocked = false;
      let serverAnswers: ReturnType<typeof restoredAudhdAnswers> = null;
      let checkoutRestoreResult: JsonFetchResult = { ok: false, status: 0, body: null };
      let recoveryRestoreResult: JsonFetchResult = { ok: false, status: 0, body: null };
      try {
        if (checkoutPendingReturn) {
          const pendingStatus = await retryPendingCheckout(market);
          if (disposed) return;
          if (pendingStatus === "ready") { clearCheckoutQuery(); window.location.reload(); return; }
          if (pendingStatus === "unavailable") setPaymentRecoveryRequired(true);
          else setCheckoutPendingVerification(true);
        }
        const [restoreResponse, recoveredResponse, recoveryResponse] = await Promise.all([
          fetchJson(audhdApi("/api/audhd-checkout/restore", market)),
          restoreRecoveryWithRetry(market),
          fetchJson(audhdApi("/api/audhd-recovery/status", market)),
        ]);
        checkoutRestoreResult = restoreResponse;
        recoveryRestoreResult = recoveredResponse;
        const restoreBody = restoreResponse.ok ? restoreResponse.body : null;
        const recoveryRestoreBody = recoveredResponse.ok ? recoveredResponse.body : null;
        const directAnswers = restoreBody && typeof restoreBody === "object" && (restoreBody as { restored?: unknown }).restored === true
          ? restoredAudhdAnswers((restoreBody as { answers?: unknown }).answers)
          : null;
        const recoveredAnswers = recoveryRestoreBody && typeof recoveryRestoreBody === "object" && (recoveryRestoreBody as { restored?: unknown }).restored === true
          ? restoredAudhdAnswers((recoveryRestoreBody as { answers?: unknown }).answers)
          : null;
        // A direct Checkout restore always wins. A failed parallel recovery
        // request must never overwrite either successful answer set.
        serverAnswers = directAnswers ?? recoveredAnswers;
        const recoveryBody = recoveryResponse.ok ? recoveryResponse.body : null;
        recoveryUnlocked = Boolean(recoveryBody && typeof recoveryBody === "object" && (recoveryBody as { unlocked?: unknown }).unlocked === true);
      } catch {
        // Failed server checks must never unlock the browser client-side.
      }
      if (disposed) return;
      try {
        const rawState = localStorage.getItem(storageKey);
        const paidMarker = !isNorway && hasLegacyPaidMarker();
        let saved = parseState(rawState);
        if (!saved && !isNorway) {
          const migrated = migrateLegacyAudhdCheckoutState(rawState);
          if (migrated) {
            const migratedState = { ...migrated, unlocked: false };
            localStorage.setItem(storageKey, JSON.stringify(migratedState));
            saved = parseState(localStorage.getItem(storageKey));
            if (!saved) throw new Error("Legacy state could not be migrated");
          }
        }
        if (recoveryReturn === "success" && !recoveryUnlocked) setRecoveryLinkInvalid(true);
        if (recoveryReturn === "invalid") setRecoveryLinkInvalid(true);
        if (paidReturn || checkoutCancelled || checkoutUnavailableReturn || checkoutPendingReturn || checkoutRecoveryReturn || recoveryReturn === "success" || recoveryReturn === "invalid") clearCheckoutQuery();
        if (checkoutCancelled) setCheckoutNotice(true);
        if (checkoutUnavailableReturn) setPaymentRecoveryRequired(true);
        if (checkoutRecoveryReturn) setRecoveryEmailSent(true);

        // A signed, database-backed Checkout entitlement is the only payment
        // path that can restore this report. It works without localStorage.
        if (serverAnswers) {
          setRecoveryRestoreFailure(null);
          const restoredReport = calculateReport(serverAnswers.answers, serverAnswers.contextAnswers, market);
          setAnswers(serverAnswers.answers); setContext(serverAnswers.contextAnswers); setQuestionIndex(questions.length - 1); setContextIndex(contextQuestions.length - 1); setPhase("result"); setUnlocked(true);
          try { localStorage.setItem(storageKey, JSON.stringify({ reportVersion: REPORT_VERSION, answers: serverAnswers.answers, contextAnswers: serverAnswers.contextAnswers, questionIndex: questions.length - 1, contextIndex: contextQuestions.length - 1, unlocked: false, report: restoredReport })); } catch { setStorageError(true); }
          return;
        }

        // Never turn a valid recovery credential into a blank, apparently paid
        // test. This includes cleared storage and a customer opening the link
        // in another browser context.
        const checkoutRestoreRetryable = checkoutRestoreResult.status === 503 || Boolean(checkoutRestoreResult.body && typeof checkoutRestoreResult.body === "object" && (checkoutRestoreResult.body as { retryable?: unknown }).retryable === true);
        if (!hasCompleteSavedState(saved) && (recoveryUnlocked || recoveryReturn === "success" || checkoutRestoreRetryable)) {
          const retryable = checkoutRestoreRetryable || recoveryRestoreResult.status === 0 || recoveryRestoreResult.status === 503 || Boolean(recoveryRestoreResult.body && typeof recoveryRestoreResult.body === "object" && (recoveryRestoreResult.body as { retryable?: unknown }).retryable === true);
          setRecoveryRestoreFailure(retryable ? "temporary" : "unavailable");
          return;
        }

        const paidStateExists = paidReturn || paidMarker || saved?.unlocked === true;
        if (paidStateExists && !hasCompleteSavedState(saved) && !recoveryUnlocked) {
          setPaymentRecoveryRequired(true);
          return;
        }
        if (saved) {
          const restoredUnlocked = !isNorway && recoveryUnlocked;
          setAnswers(saved.answers); setContext(saved.contextAnswers); setQuestionIndex(saved.questionIndex); setContextIndex(saved.contextIndex); setUnlocked(restoredUnlocked);
          if (hasCompleteSavedState(saved)) setPhase("result");
          if (paidStateExists && !recoveryUnlocked) setPaymentRecoveryRequired(true);
        }
      } catch {
        setStorageError(true);
        if (paidReturn || checkoutUnavailableReturn) setPaymentRecoveryRequired(true);
      } finally {
        if (!disposed) setHydrated(true);
      }
    }
    void hydrate();
    return () => { disposed = true; };
  }, [standardAnalytics, recoveryRetry, storageKey, isNorway, market]);
  useEffect(() => { if (!hydrated || (!isNorway && showNpfPreview())) return; try { localStorage.setItem(storageKey, JSON.stringify({ reportVersion: REPORT_VERSION, answers, contextAnswers: context, questionIndex, contextIndex, unlocked: false, report })); } catch { setStorageError(true); } }, [answers, context, questionIndex, contextIndex, report, hydrated, storageKey, isNorway]);
  useEffect(() => { if (unlocked && report) standardAnalytics.resultView(); }, [unlocked, report, standardAnalytics]);
  useEffect(() => { if (phase !== "analysis" || !report) return; const timers = [setTimeout(() => setAnalysisStep(1), 1200), setTimeout(() => setAnalysisStep(2), 2500), setTimeout(() => { standardAnalytics.analysisView(); setPhase("result"); }, 4000)]; return () => timers.forEach(clearTimeout); }, [phase, report, standardAnalytics]);
  function answer(value: number) { if (lock.current) return; lock.current = true; setTransitioning(true); if (phase === "questions") { const next = answers.map((item, i) => i === questionIndex ? value : item); setAnswers(next); const count = next.filter(item => item >= 0).length; standardAnalytics.answer(count, questionIndex + 1); setTimeout(() => { if (questionIndex < 47) setQuestionIndex(questionIndex + 1); else setPhase("context"); lock.current = false; setTransitioning(false); }, 180); } else { const next = context.map((item, i) => i === contextIndex ? value : item); setContext(next); const count = next.filter(item => item >= 0).length; standardAnalytics.answer(questions.length + count, questions.length + contextIndex + 1); setTimeout(() => { if (contextIndex < 5) setContextIndex(contextIndex + 1); else setPhase("analysis"); lock.current = false; setTransitioning(false); }, 180); } }
  const directCheckout = useTestAccountCheckout("audhd", [...answers, ...context], () => setCheckoutUnavailable(true), undefined, undefined, !isNorway);
  async function checkout() { if (!isNorway && (npfLocalPreview || directCheckout())) return; if (!report || unlocked || checkoutPending.current || checkoutPendingVerification) return; checkoutPending.current = true; setCheckoutUnavailable(false); try { const prepared = await fetch(audhdApi("/api/audhd-checkout/prepare", market), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reportVersion: REPORT_VERSION, answers, contextAnswers: context, ...(isNorway ? { processingConsent: true } : {}) }), cache: "no-store" }); const preparedBody: unknown = prepared.ok ? await prepared.json() : null; const attemptId = preparedBody && typeof preparedBody === "object" ? (preparedBody as { attemptId?: unknown }).attemptId : null; if (typeof attemptId !== "string") throw new Error("Checkout preparation failed"); const analytics = await captureGa4CheckoutAttribution(); const started = await fetch(audhdApi("/api/audhd-checkout/start", market), { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ attemptId, ...(analytics ? { analytics } : {}) }), cache: "no-store" }); const startedBody: unknown = started.ok ? await started.json() : null; const checkoutUrl = startedBody && typeof startedBody === "object" ? validCheckoutUrl((startedBody as { checkoutUrl?: unknown }).checkoutUrl) : null; if (!checkoutUrl) throw new Error("Checkout start failed"); standardAnalytics.checkout(() => { window.location.assign(checkoutUrl); }); } catch { checkoutPending.current = false; setCheckoutUnavailable(true); } }
  function restart() { standardAnalytics.restart(); setAnswers(emptyAnswers()); setContext(emptyContextAnswers()); setQuestionIndex(0); setContextIndex(0); setPhase("questions"); if (isNorway) setUnlocked(false); setCheckoutUnavailable(false); try { localStorage.removeItem(storageKey); } catch { setStorageError(true); } }
  function retryRecoveryRestore() { setRecoveryRestoreFailure(null); setHydrated(false); setRecoveryRetry(value => value + 1); }
  if (!hydrated) return <p className="mt-8" role="status">{marketText(market, "Laddar testet…", "Laster inn testen…")}</p>;
  const storageNotice = storageError ? <p role="status" className="mt-6 rounded-xl border border-neutral-300 bg-[#F1E8E2] p-4 text-sm leading-6">{marketText(market, "Webbläsaren kan inte spara testet säkert. Du kan fortsätta här, men lämna inte sidan om du vill behålla svaren.", "Nettleseren kan ikke lagre testen lokalt. Du kan fortsette her. Hold siden åpen for å beholde svarene.")}</p> : null;
  const recoveryMessage = recoveryNotice ? <p role="status" className="mt-6 rounded-xl border border-[#c8a777] bg-[#fff8e8] p-4 text-sm font-medium leading-6 text-[#4a3823]">{marketText(market, "Ditt test är redan upplåst – du behöver inte betala igen.", "Rapporten din er allerede åpen. Du trenger ikke å betale igjen.")}</p> : null;
  const recoveryEmailMessage = recoveryEmailSent ? <p role="status" className="mt-6 rounded-xl border border-[#c8a777] bg-[#fff8e8] p-4 text-sm font-medium leading-6 text-[#4a3823]">{marketText(market, "En säker återställningslänk kan ha begärts till e-postadressen som användes vid betalningen. Kontrollera inkorg och skräppost innan du försöker igen. Betala inte igen.", "En sikker lenke kan ha blitt sendt til e-postadressen du brukte ved betaling. Sjekk innboksen og søppelposten før du prøver igjen.")}</p> : null;
  const pendingPaymentMessage = checkoutPendingVerification ? <p role="status" className="mt-6 rounded-xl border border-[#c8a777] bg-[#fff8e8] p-4 text-sm font-medium leading-6 text-[#4a3823]">{marketText(market, "Vi kontrollerar fortfarande din betalning. Betala inte igen och lämna sidan öppen en stund.", "Vi sjekker fortsatt betalingen din. Hold siden åpen litt til og vent med å prøve på nytt.")}</p> : null;
  const invalidRecoveryMessage = recoveryLinkInvalid ? <p role="alert" className="mt-6 rounded-xl border border-[#d6a5a9] bg-[#fff5f5] p-4 text-sm leading-6 text-[#702d36]">{marketText(market, "Länken kunde inte användas. Den kan ha gått ut eller redan ha använts. Betala inte igen – kontakta ", "Lenken kunne ikke åpnes. Den kan ha utløpt eller allerede vært i bruk. Kontakt ")}<a className="underline underline-offset-4" href="mailto:support@relationsvarning.se">support@relationsvarning.se</a> {marketText(market, " så hjälper vi dig vidare.", " så hjelper vi deg videre.")}</p> : null;
  if (recoveryRestoreFailure) return <>{storageNotice}<section className={card} role="alert" aria-live="assertive"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">{marketText(market, "Återställningen behöver slutföras", "Gjenåpningen må fullføres")}</p><h2 className="text-2xl font-semibold">{marketText(market, "Ditt betalda resultat har inte ersatts", "Den betalte rapporten din venter på gjenåpning")}</h2><p>{recoveryRestoreFailure === "temporary" ? marketText(market, "Vi kan inte nå den säkra återställningen just nu. Din återställningsåtkomst finns kvar och inget nytt test har skapats.", "Vi får ikke kontakt med tjenesten for gjenåpning akkurat nå. Tilgangen din er fortsatt gyldig.") : marketText(market, "Vi kan inte längre läsa den sparade analysen från den här återställningsåtkomsten. Inget nytt test har skapats och du ska inte betala igen.", "Vi kan ikke hente den lagrede rapporten via denne lenken. Du kan få hjelp av kundestøtte med det opprinnelige kjøpet.")}</p><button type="button" onClick={retryRecoveryRestore} className={`${btn} bg-[#202124] text-white`}>{marketText(market, "Försök återställa igen", "Prøv å åpne rapporten igjen")}</button><p className="text-sm text-neutral-600">{marketText(market, "Om problemet fortsätter, kontakta ", "Hvis problemet fortsetter, kontakt ")}<a className="underline underline-offset-4" href="mailto:support@relationsvarning.se">support@relationsvarning.se</a> {marketText(market, " med tidpunkten för köpet och e-postadressen som användes vid betalningen.", " med kjøpstidspunktet og e-postadressen du brukte ved betaling.")}</p></section></>;
  if (paymentRecoveryRequired) return <>{storageNotice}<section className={card} role="alert" aria-live="assertive"><p className="text-sm font-semibold uppercase tracking-[.16em] text-[#27666A]">{marketText(market, "Betalningen behöver verifieras", "Betalingen må bekreftes")}</p><h2 className="text-2xl font-semibold">{marketText(market, "Betala inte igen", "Vent med å betale på nytt")}</h2><p>{marketText(market, "Vi kan inte säkert koppla den här webbläsaren till ett genomfört köp ännu. Dina svar och din betalning är inte automatiskt förlorade, men rapporten kan inte öppnas förrän köpet har verifierats.", "Vi kan foreløpig ikke knytte denne nettleseren til et fullført kjøp. Rapporten åpnes så snart kjøpet er bekreftet.")}</p><p>{marketText(market, "Öppna i första hand länken i Stripe-kvittot i samma webbläsare. Om det inte hjälper, kontakta ", "Prøv først å åpne lenken du fikk på e-post i samme nettleser. Hvis det ikke hjelper, kontakt ")}<a className="underline underline-offset-4" href="mailto:support@relationsvarning.se">support@relationsvarning.se</a> {marketText(market, " med tidpunkt för köpet och e-postadressen som användes vid betalningen, så hjälper vi dig vidare.", " med kjøpstidspunkt og e-postadresse, så hjelper vi deg videre.")}</p></section></>;
  if (phase === "questions" || phase === "context") { const isContext = phase === "context"; const item = isContext ? (isNorway ? contextQuestionsNb : contextQuestions)[contextIndex] : (isNorway ? questionsNb : questions)[questionIndex]; const selected = isContext ? context[contextIndex] : answers[questionIndex]; const current = isContext ? contextIndex + 1 : questionIndex + 1; const total = isContext ? 6 : 48; const options = isContext ? (isNorway ? contextQuestionsNb : contextQuestions)[contextIndex].options : isNorway ? answerLabelsNb : answerLabels; return <>{storageNotice}{recoveryMessage}{recoveryEmailMessage}{pendingPaymentMessage}{invalidRecoveryMessage}<section className={card} aria-labelledby="question"><div className="text-sm text-neutral-600"><span>{isContext ? marketText(market, "Sista frågor", "Avsluttende spørsmål") : marketText(market, `Fråga ${current} av 48`, `Spørsmål ${current} av 48`)}</span></div><progress className="h-2 w-full accent-[#27666A]" value={current - (selected >= 0 ? 0 : 1)} max={total} aria-label={marketText(market, "Testets förlopp", "Fremdrift")} />{isContext && contextIndex === 0 && <div className="space-y-2"><p className="font-semibold">{marketText(market, "Några sista frågor hjälper oss sätta dina svar i sammanhang.", "De siste spørsmålene setter svarene dine i sammenheng.")}</p><p className="text-neutral-600">{marketText(market, "De ändrar inte dina index. De hjälper bara rapporten att använda ett mer försiktigt och relevant språk.", "Svarene brukes til å nyansere rapporten. De to hovedindeksene beregnes fra de tidligere svarene.")}</p></div>}<h2 id="question" className="text-2xl font-semibold leading-snug">{item.text}</h2><div role="group" aria-labelledby="question" className="space-y-2">{options.map((label, value) => <button key={label} type="button" disabled={transitioning} aria-pressed={selected === value} onClick={() => answer(value)} className={`flex min-h-12 w-full items-center rounded-xl border p-3 text-left ${selected === value ? "border-[#202124] bg-[#F1E8E2] font-semibold" : "border-neutral-300 bg-white hover:bg-neutral-50"}`}>{label}</button>)}</div><div className="flex gap-3"><button className={`${btn} border border-neutral-300 bg-white`} type="button" disabled={transitioning || (isContext ? contextIndex === 0 : questionIndex === 0)} onClick={() => isContext ? setContextIndex(contextIndex - 1) : setQuestionIndex(questionIndex - 1)}>{marketText(market, "Tillbaka", "Tilbake")}</button></div><p className="text-sm text-neutral-600">{marketText(market, "Dina svar sparas lokalt i den här webbläsaren.", "Svarene lagres lokalt i denne nettleseren.")}</p></section></>; }
  if (phase === "analysis") return <section className={card} aria-busy="true" aria-live="polite"><p className="text-sm uppercase tracking-[.16em] text-neutral-600">{marketText(market, "Din profil är på väg", "Profilen din er snart klar")}</p><h2 className="text-3xl font-semibold">{marketText(market, "Vi analyserar dina svar", "Vi sammenstiller svarene dine")}</h2><div className="space-y-3">{[marketText(market, "Analyserar dina svar inom 8 områden…", "Ser på svarene dine på åtte områder…"), marketText(market, "Jämför ADHD- och autismrelaterade mönster…", "Sammenligner ADHD- og autismerelaterte mønstre…"), marketText(market, "Identifierar hur områdena samspelar hos dig…", "Ser hvordan områdene henger sammen hos deg…")].map((text, i) => <p key={text} className={i <= analysisStep ? "text-neutral-900" : "text-neutral-400"}>✓ {text}</p>)}</div></section>;
  if (!report) return null;
  const finding = freeFinding(report, market);
  if (!unlocked) return <>{!isNorway && npfLocalPreview && <p className="mt-5 rounded-xl border border-neutral-300 bg-neutral-50 p-3 text-sm">Lokal förhandsvisning. Betalning är avstängd.</p>}{checkoutNotice && <p role="status" className="mt-6 rounded-xl border border-[#c8a777] bg-[#fff8e8] p-4 text-sm font-medium leading-6 text-[#4a3823]">{marketText(market, "Betalningen avbröts. Dina svar finns kvar och du har inte debiterats.", "Betalingen ble avbrutt. Svarene dine er fortsatt lagret.")}</p>}{recoveryEmailMessage}{pendingPaymentMessage}<section ref={standardAnalytics.paywallRef} data-audhd-paywall className={`${card} bg-[#202124] text-white`}>
    <div>
      <p data-audhd-kicker className="text-sm uppercase tracking-[.16em] text-[#DDE8E3]">{marketText(market, "Ett första fynd", "Det som skiller seg ut")}</p>
      <h2 className="text-xl font-semibold">{finding.title}</h2>
      <p>{finding.body}</p>
      <p className="text-sm text-neutral-200">{finding.teaser}</p>
    </div>
    <div>
      <h3 className="text-xl font-semibold">{marketText(market, "Din låsta AuDHD-analys innehåller", "Den fullstendige AuDHD-rapporten inneholder")}</h3>
      <ul className="mt-3 grid gap-3 text-neutral-100">
        <li>{marketText(market, "🔒 Profiltyp, ADHD- och autismindex samt AuDHD-karta", "🔒 Profiltype, ADHD- og autismeindeks og AuDHD-kart")}</li>
        <li>{marketText(market, "🔒 Samtliga åtta områden och deras nivåer", "🔒 Oversikt over alle åtte områder")}</li>
        <li>{marketText(market, "🔒 Masking, friktion, vardagspåverkan och historik", "🔒 Maskering, friksjon, hverdagspåvirkning og utvikling over tid")}</li>
        <li>{marketText(market, "🔒 Sammanvägd tolkning och rapport som PDF", "🔒 Samlet tolkning og mulighet til å lagre rapporten som PDF")}</li>
      </ul>
    </div>
    <p className="text-sm leading-6 text-neutral-300">{marketText(market, "AuDHD är ett informellt begrepp för samtidig ADHD och autism. Det här självtestet kan inte fastställa en diagnos.", "AuDHD er et uformelt navn på samtidig ADHD og autisme. Selvtesten er laget for refleksjon og kan ikke gi en diagnose.")}</p>
    {isNorway && <p className="text-sm">Se <a className="underline" href="/no/kjopsvilkar">kjøpsvilkårene</a> før du fortsetter til betaling.</p>}
    <div data-audhd-cta-wrap className="pt-2 sm:pt-0">
      <PaywallCheckoutCTA onClick={checkout} label={isNorway ? `Åpne hele AuDHD-rapporten · ${norwegian.reportPrice} NOK` : <>Lås upp min AuDHD-profil · {PRICE_SEK} kr</>} trustText={marketText(market, "Engångsbetalning · Ingen prenumeration.", "Engangsbetaling · Uten abonnement.")} />
    </div>
    {checkoutUnavailable && <p role="alert">{marketText(market, "Vi kunde inte starta betalningen just nu. Dina svar finns kvar. Försök igen om en stund – du har inte debiterats.", "Vi kunne ikke starte betalingen akkurat nå. Svarene dine er fortsatt lagret. Prøv igjen om litt.")}</p>}
  </section><div data-audhd-restart className="mt-3"><button type="button" className="text-sm underline" onClick={restart}>{marketText(market, "Gör om testet", "Ta testen på nytt")}</button></div></>;
  if (isNorway) return <><ReportView report={report} onRestart={restart} /><NorwegianBookOffer /></>;
  const [recommendedTest, fallbackTest] = audhdRecommendations(report);
  return <><ReportView report={report} onRestart={restart} /><aside className={card}><h2 className="text-xl font-semibold">Vill du hitta tillbaka till analysen?</h2><p>Du kan välja att spara en krypterad kopia på ditt konto i upp till 12 månader. Inloggning är frivillig.</p><a href="/mina-sidor/koppla" className={`${btn} bg-[#27666A] text-white`}>Spara analysen på Mina sidor</a></aside><NewsletterAfterResult><PostPurchaseRecommendation sourceProduct="audhd_test" preferredProductIds={[recommendedTest, fallbackTest]} /></NewsletterAfterResult></>;
}

