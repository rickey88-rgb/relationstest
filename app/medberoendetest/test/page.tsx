"use client";

import PaywallCheckoutCTA from "../../_components/PaywallCheckoutCTA";
import PostPurchaseRecommendation from "../../_components/PostPurchaseRecommendation";
import { buildPaywallTeaser } from "../../_lib/paywallTeaser";

import { hasPaidReturn, usePaymentRecovery } from "../../_components/usePaymentRecovery";

import { useTestAnalytics } from "../../_analytics/useTestAnalytics";

import { useEffect, useMemo, useRef, useState } from "react";



import { questions, answerLabels, LS_KEY, CHECKOUT_URL, clamp, calculate } from "./model";
import ReportView from "./ReportView";
import { useTestAccountCheckout } from "../../_components/useTestAccountCheckout";

export default function Page() {
  const totalQuestions = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(totalQuestions).fill(-1)
  );
  const [unlocked, setUnlocked] = useState(false);
  const { paywallRef, ...tracking } = useTestAnalytics("codependency_test", questions.length);

  const [transitioning, setTransitioning] = useState(false);
  const answerLock = useRef(false);
  const answerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (answerTimer.current) clearTimeout(answerTimer.current); }, []);
  const [analysisStep, setAnalysisStep] = useState<number | null>(null);
  const analyzing = analysisStep !== null;
  useEffect(() => {
    if (!analyzing) return;
    const second = setTimeout(() => setAnalysisStep(1), 1000);
    const third = setTimeout(() => setAnalysisStep(2), 2000);
    const finish = setTimeout(() => setAnalysisStep(null), 3000);
    return () => { clearTimeout(second); clearTimeout(third); clearTimeout(finish); };
  }, [analyzing]);
  const [hydrated, setHydrated] = useState(false);
  /* eslint-disable react-hooks/set-state-in-effect -- Preserve existing post-hydration synchronization with external localStorage and the paid-return URL. */

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);

      if (raw) {
        const parsed = JSON.parse(raw) as {
          index?: number;
          answers?: number[];
        };

        if (
          Array.isArray(parsed.answers) &&
          parsed.answers.length === totalQuestions
        ) {
          setAnswers(parsed.answers);
        }

        if (typeof parsed.index === "number") {
          setIndex(clamp(parsed.index, 0, totalQuestions - 1));
        }
      }
    } catch {
      // Testet fungerar även om lokal lagring inte är tillgänglig.
    }

    setHydrated(true);
  }, [totalQuestions]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          index,
          answers,
        })
      );
    } catch {
      // Ignorera om localStorage är blockerat.
    }
  }, [index, answers, hydrated]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get("paid") === "true") {
      tracking.purchase();
      setUnlocked(true);
      window.history.replaceState({}, "", window.location.pathname);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  const answeredCount = useMemo(
    () => answers.filter((answer) => answer >= 0).length,
    [answers]
  );

  const progress = clamp(
    Math.round((answeredCount / totalQuestions) * 100),
    0,
    100
  );

  const payment = usePaymentRecovery(LS_KEY, unlocked, setUnlocked);

  const isFinished = !transitioning && answers.every((answer) => answer >= 0);

  const result = useMemo(() => calculate(answers), [answers]);
  const { sortedAreas } = result;


  const currentQuestion = questions[index];

  // Compare existing normalized scores only for teaser wording.
  const teaserCopy = buildPaywallTeaser(sortedAreas.map((item) => item.score));

  function selectAnswer(value: number) {
    if (answerLock.current) return;
    answerLock.current = true;
    setTransitioning(true);
    tracking.answer(answers.filter(answer => answer >= 0).length + (answers[index] < 0 ? 1 : 0), index + 1);
    setAnswers((previous) => {
      const next = [...previous];
      next[index] = value;
      return next;
    });

    answerTimer.current = setTimeout(() => {
    if (!unlocked && !isFinished && answers.every((answer, i) => i === index || answer >= 0)) setAnalysisStep(0);
      if (index < totalQuestions - 1) {
        setIndex((currentIndex) => currentIndex + 1);
      }
      answerLock.current = false;
      setTransitioning(false);
      answerTimer.current = null;
    }, 220);
  }

  function goBack() {
    setIndex((currentIndex) => Math.max(0, currentIndex - 1));
  }

  function restart() {
    tracking.restart();
    setCheckoutUnavailable(false);
    setAnalysisStep(null);
    setAnswers(Array(totalQuestions).fill(-1));
    setIndex(0);
    setUnlocked(hasPaidReturn(LS_KEY));

    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // Ignorera.
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

 const [checkoutUnavailable, setCheckoutUnavailable] = useState(false);
  const accountCheckout = useTestAccountCheckout("medberoendetest", answers, () => setCheckoutUnavailable(true));


 function goToCheckout() { if (accountCheckout()) return;
    if (!payment.prepareCheckout({ index, answers, unlocked })) return;
  tracking.checkout(() => { window.location.href = CHECKOUT_URL; });
}

  if (!hydrated) {
    return (
      <>
        <p>Laddar testet...</p>
      </>
    );
  }

  return (
    <>
      {checkoutUnavailable && <p role="alert">Köpet kunde inte öppnas just nu. Dina svar finns kvar. Försök igen om en stund.</p>}
      {unlocked && <div data-flow="inset" role="status" style={{ margin: "20px 0", padding: 16, border: "1px solid #ddd", borderRadius: 12, lineHeight: 1.6 }}><strong>Ditt test är upplåst – du behöver inte betala igen.</strong>{answers.every(answer => answer >= 0) ? <p>Din fullständiga analys visas nedan.</p> : <p>Tidigare svar saknas eller är ofullständiga i den här webbläsaren. Öppna testet i samma webbläsare som före betalningen, eller svara på frågorna här utan att köpa igen. Behöver du hjälp? Kontakta <a href="mailto:support@relationsvarning.se">support@relationsvarning.se</a>.</p>}</div>}
      {payment.checkoutError && <p role="alert" style={{ margin: "20px 0", lineHeight: 1.6 }}>{payment.checkoutError}</p>}

      <div style={{ marginBottom: 20 }}>
        {!isFinished && (
          <div style={{ marginTop: 20 }}>
            <div data-flow="track"
              style={{
                height: 9,
                background: "#ededed",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div data-flow="fill"
                style={{
                  width: `${progress}%`,
                  height: "100%",
                  background: "#111",
                  transition: "width 180ms ease",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                fontSize: 13,
                color: "#666",
              }}
            >
              <span>{progress}% klart</span>
              <span>
                Fråga {index + 1} av {totalQuestions}
              </span>
            </div>
          </div>
        )}
      </div>

      {!isFinished && (
        <section data-flow="question"
          style={{
            background: "#fff",
            border: "1px solid #e6e6e6",
            borderRadius: 18,
            padding: "20px 16px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.035)",
          }}
        >
          <p
            style={{
              margin: 0,
              textAlign: "center",
              color: "#777",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Hur väl stämmer detta in på dig?
          </p>

          <p data-flow="question-text"
            style={{
              margin: "14px auto 20px",
              maxWidth: 620,
              fontSize: "clamp(20px, 5vw, 25px)",
              lineHeight: 1.4,
              textAlign: "center",
              fontWeight: 750,
            }}
          >
            {currentQuestion.text}
          </p>

          <div style={{ display: "grid", gap: 10 }}>
            {[0, 1, 2, 3, 4].map((value) => {
              const selected = answers[index] === value;

              return (
                <button
                  key={value}
                  type="button"
                  disabled={transitioning}
                  aria-pressed={selected}
                  onClick={() => selectAnswer(value)}
                  onKeyDown={(event) => { if (event.repeat) event.preventDefault(); }}
                  className={`answer-button ${
                    selected ? "selected" : ""
                  }`}
                >
                  {answerLabels[value]}
                </button>
              );
            })}
          </div>

          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={goBack}
              disabled={index === 0 || transitioning}
              style={{
                minHeight: 44,
                padding: "10px 14px",
                borderRadius: 11,
                border: "1px solid #ddd",
                background: index === 0 ? "#f5f5f5" : "#fff",
                color: index === 0 ? "#aaa" : "#222",
                cursor: index === 0 ? "not-allowed" : "pointer",
              }}
            >
              ← Tillbaka
            </button>
          </div>
        </section>
      )}

      {isFinished && analyzing && !unlocked && <section data-flow="analysis" style={{ border: "1px solid #ddd", borderRadius: 20, padding: "24px 18px" }} aria-busy="true">
        <h2 style={{ margin: 0, fontSize: 24 }}>Vi sammanställer din analys</h2>
        <p role="status" aria-live="polite" style={{ marginTop: 14, lineHeight: 1.7 }}>{["Analyserar dina svar...", "Identifierar återkommande mönster...", "Sammanställer din profil..."][analysisStep ?? 0]}</p>
      </section>}

      {isFinished && !unlocked && !analyzing && !transitioning && (
        <section data-flow="paywall" ref={paywallRef}
          style={{
            background: "#0d0d0d",
            color: "#fff",
            borderRadius: 20,
            padding: "24px 18px",
          }}
        >
          <h2 style={{ margin: "8px 0 0", fontSize: "clamp(24px, 7vw, 32px)", lineHeight: 1.2 }}>{teaserCopy.title}</h2>
          <p style={{ marginTop: 14, lineHeight: 1.7, color: "#e5e5e5" }}>{teaserCopy.body}</p>

          <div
            style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <h3 style={{ margin: 0, fontSize: 21 }}>
              I din fullständiga analys ser du
            </h3>

            <p
              style={{
                margin: "10px 0 0",
                lineHeight: 1.65,
                color: "#ddd",
              }}
            >
              ✓ vilket mönster som väger tyngst i dina svar<br />
              ✓ vad som förstärker eller nyanserar helhetsbilden<br />
              ✓ hur omsorg, egna behov och gränser hänger ihop
            </p>

            <p style={{ margin: "14px 0 0", fontSize: 15, fontWeight: 700 }}>39 kr</p>

            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#d4d4d4" }}>Engångsbetalning · Ingen prenumeration</p>

            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#d4d4d4" }}>Resultatet visas direkt efter betalning</p>

            <PaywallCheckoutCTA onClick={goToCheckout} separated />
          </div>

          <button
            type="button"
            onClick={restart}
            style={{ minHeight: 44, width: "100%", marginTop: 10, border: 0, background: "transparent", color: "#d4d4d4", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4 }}
          >
            Gör om testet
          </button>
        </section>
      )}

      {isFinished && unlocked && <ReportView result={result} onRestart={restart} />}
      {isFinished && unlocked && <PostPurchaseRecommendation sourceProduct="codependency_test" />}

      <style jsx>{`
        .answer-button {
          min-height: 50px;
          width: 100%;
          padding: 12px 14px;
          border-radius: 12px;
          border: 1px solid #dcdcdc;
          background: #fff;
          color: #111;
          cursor: pointer;
          text-align: left;
          font-size: 16px;
          font-weight: 500;
          transition:
            background 0.15s ease,
            border-color 0.15s ease;
        }

        .answer-button:hover {
          background: #f1f1f1;
          border-color: #c7c7c7;
        }

        .answer-button.selected {
          background: #ececec;
          border: 2px solid #111;
          font-weight: 700;
        }
      `}</style>
    </>
  );
}

