"use client";

import PaywallCheckoutCTA from "../../_components/PaywallCheckoutCTA";
import PostPurchaseRecommendation from "../../_components/PostPurchaseRecommendation";
import { buildPaywallTeaser } from "../../_lib/paywallTeaser";

import { hasPaidReturn, usePaymentRecovery } from "../../_components/usePaymentRecovery";

import { useTestAnalytics } from "../../_analytics/useTestAnalytics";

import Link from "next/link";
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
  const { paywallRef, ...tracking } = useTestAnalytics("narcissist_partner", questions.length);

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

  /* eslint-disable react-hooks/set-state-in-effect -- preserve existing external-storage and paid-return hydration behavior. */
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
      // Ignorera trasig localStorage-data.
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
      // Testet ska fungera även om localStorage är blockerat.
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

  const current = questions[index];

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
 const {sortedAreas} = result;


  // Compare existing normalized scores only for teaser wording.
  const teaserCopy = buildPaywallTeaser(sortedAreas.map((item) => item.score));

  function pickAnswer(value: number) {
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

  function goPrev() {
    setIndex((currentIndex) => Math.max(0, currentIndex - 1));
  }

  function restart() {
    tracking.restart();
    setCheckoutUnavailable(false);
    setAnalysisStep(null);
    const reset = Array(totalQuestions).fill(-1);

    setAnswers(reset);
    setIndex(0);
    setUnlocked(hasPaidReturn(LS_KEY));

    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const [checkoutUnavailable, setCheckoutUnavailable] = useState(false);
  const accountCheckout = useTestAccountCheckout("narcissist-i-en-relation", answers, () => setCheckoutUnavailable(true));
  function goToCheckout() { if (accountCheckout()) return;
    if (!CHECKOUT_URL) {
      alert(
        "Betalningen för narcissisttestet kopplas in i nästa steg. Testresultatet är färdigt och kan testas lokalt."
      );
      return;
    }

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
            Hur ofta stämmer detta?
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
            {current.text}
          </p>

          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            {[0, 1, 2, 3, 4].map((value) => {
              const selected = answers[index] === value;

              return (
                <button
                  key={value}
                  type="button"
                  disabled={transitioning}
                  aria-pressed={selected}
                  onClick={() => pickAnswer(value)}
                  onKeyDown={(event) => { if (event.repeat) event.preventDefault(); }}
                  className={selected ? undefined : "hover:bg-neutral-100!"}
                  style={{
                    minHeight: 50,
                    width: "100%",
                    padding: "12px 14px",
                    borderRadius: 12,
                    border: selected
                      ? "2px solid #111"
                      : "1px solid #dcdcdc",
                    background: selected ? "#f0f0f0" : "#fff",
                    color: "#111",
                    cursor: "pointer",
                    textAlign: "left",
                    fontSize: 16,
                    fontWeight: selected ? 700 : 500,
                  }}
                >
                  {answerLabels[value]}
                </button>
              );
            })}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-start",
              marginTop: 16,
            }}
          >
            <button
              type="button"
              onClick={goPrev}
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
        <>
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
            <h3
              style={{
                margin: 0,
                fontSize: 21,
              }}
            >
              I din fullständiga analys ser du
            </h3>

            <p
              style={{
                margin: "10px 0 0",
                lineHeight: 1.65,
                color: "#ddd",
              }}
            >
              ✓ vilket relationsmönster som väger tyngst i dina svar<br />
              ✓ vad som förstärker eller nyanserar helhetsbilden<br />
              ✓ hur de olika beteendena hänger ihop i just din relation
            </p>

            <p style={{ margin: "14px 0 0", fontSize: 15, fontWeight: 700 }}>39 kr</p>

            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#d4d4d4" }}>Engångsbetalning · Ingen prenumeration</p>

            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#d4d4d4" }}>Resultatet visas direkt efter betalning</p>

            <PaywallCheckoutCTA onClick={goToCheckout} separated />

            
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 18,
              flexWrap: "wrap",
            }}
          >
            <button
              type="button"
              onClick={restart}
              style={{ minHeight: 44, width: "100%", marginTop: 10, border: 0, background: "transparent", color: "#d4d4d4", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4 }}
            >
              Gör om testet
            </button>

          </div>
        </section>
        <p style={{ margin: "14px 0 0", textAlign: "center", fontSize: 14, color: "#666" }}>
          Vill du läsa mer först? <Link href="/narcissist-i-en-relation" style={{ color: "inherit", textDecoration: "underline", textUnderlineOffset: 4 }}>Läs om narcissistiska relationsmönster →</Link>
        </p>
        </>
      )}

      {checkoutUnavailable && <p role="alert">Köpet kunde inte öppnas just nu. Dina svar finns kvar. Försök igen om en stund.</p>}
      {isFinished && unlocked && <ReportView result={result} onRestart={restart} />}
      {isFinished && unlocked && <PostPurchaseRecommendation sourceProduct="narcissist_partner" />}

      <p style={{ marginTop: 26, fontSize: 12, lineHeight: 1.6, color: "#777" }}>
        Testet är ett orienteringsverktyg och kan inte avgöra om en person
        har narcissistiskt personlighetssyndrom eller annan psykiatrisk
        diagnos.
      </p>
    </>
  );
}
