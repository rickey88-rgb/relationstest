"use client";

import PaywallCheckoutCTA from "../../_components/PaywallCheckoutCTA";
import PostPurchaseRecommendation from "../../_components/PostPurchaseRecommendation";
import { buildPaywallTeaser } from "../../_lib/paywallTeaser";

import { hasPaidReturn, usePaymentRecovery } from "../../_components/usePaymentRecovery";

import { useTestAnalytics } from "../../_analytics/useTestAnalytics";

import { useEffect, useMemo, useRef, useState } from "react";



import { LS_KEY, STRIPE_PAYMENT_LINK, answerLabels, questions, clamp, calculate } from "./model";
import ReportView from "./ReportView";
import { useTestAccountCheckout } from "../../_components/useTestAccountCheckout";

export default function Page() {
  const totalQuestions = questions.length;

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    Array(totalQuestions).fill(-1)
  );
  const [transitioning, setTransitioning] = useState(false);
  const answerLock = useRef(false);
  const answerTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (answerTimer.current) clearTimeout(answerTimer.current); }, []);
  const [unlocked, setUnlocked] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const { paywallRef, ...tracking } = useTestAnalytics("psychological_abuse_test", questions.length);

  const [analysisStep, setAnalysisStep] = useState<number | null>(null);
  const analyzing = analysisStep !== null;
  useEffect(() => {
    if (!analyzing) return;
    const second = setTimeout(() => setAnalysisStep(1), 1000);
    const third = setTimeout(() => setAnalysisStep(2), 2000);
    const finish = setTimeout(() => setAnalysisStep(null), 3000);
    return () => { clearTimeout(second); clearTimeout(third); clearTimeout(finish); };
  }, [analyzing]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);

      if (!raw) return;

      const parsed = JSON.parse(raw) as {
        index?: number;
        answers?: number[];
        unlocked?: boolean;
      };

      let hasSavedProgress = false;

      if (
        Array.isArray(parsed.answers) &&
        parsed.answers.length === totalQuestions
      ) {
        setAnswers(parsed.answers);
        hasSavedProgress = parsed.answers.some((answer) => answer >= 0);
      }

      if (typeof parsed.index === "number") {
        setIndex(
          clamp(parsed.index, 0, totalQuestions - 1)
        );
      }

      if (parsed.unlocked === true) {
        setUnlocked(true);
        hasSavedProgress = true;
      }

      if (hasSavedProgress) setShowIntro(false);
    } catch {
      // ignore
    }
    finally { setHydrated(true); }
  }, [totalQuestions]);

  useEffect(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    if (params.get("paid") === "true") {
      tracking.purchase();
      setUnlocked(true);
      setShowIntro(false);

      try {
        const raw = localStorage.getItem(LS_KEY);
        const existing = raw ? JSON.parse(raw) : {};

        localStorage.setItem(
          LS_KEY,
          JSON.stringify({
            ...existing,
            unlocked: true,
          })
        );
      } catch {
        // ignore
      }

      window.history.replaceState(
        {},
        "",
        window.location.pathname
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        LS_KEY,
        JSON.stringify({
          index,
          answers,
          unlocked,
        })
      );
    } catch {
      // ignore
    }
  }, [index, answers, unlocked, hydrated]);

  const current = questions[index];

  const answeredCount = useMemo(
    () => answers.filter((a) => a >= 0).length,
    [answers]
  );

  const progress = Math.round(
    (answeredCount / totalQuestions) * 100
  );

  const payment = usePaymentRecovery(LS_KEY, unlocked, setUnlocked);

  const isFinished = useMemo(
    () => answers.every((a) => a >= 0),
    [answers]
  );

  const result = useMemo(() => calculate(answers), [answers]);
 const {sortedAreas} = result;

  // Compare existing normalized scores only for teaser wording.
  const teaserCopy = buildPaywallTeaser(sortedAreas.map((item) => item.score));

  function pickAnswer(value: number) {
    if (answerLock.current) return;
    answerLock.current = true;
    setTransitioning(true);
    tracking.answer(answers.filter(answer => answer >= 0).length + (answers[index] < 0 ? 1 : 0), index + 1);
    const next = [...answers];

    next[index] = value;

    setAnswers(next);

    answerTimer.current = setTimeout(() => {
      if (!unlocked && !isFinished && next.every((answer) => answer >= 0)) setAnalysisStep(0);
      if (index < totalQuestions - 1) {
        setIndex((currentIndex) =>
          Math.min(
            currentIndex + 1,
            totalQuestions - 1
          )
        );
      }
      answerLock.current = false;
      setTransitioning(false);
      answerTimer.current = null;
    }, 220);
  }

  function goPrev() {
    setIndex((i) => Math.max(0, i - 1));
  }

  function restart() {
    tracking.restart();
    setCheckoutUnavailable(false);
    if (answerTimer.current) clearTimeout(answerTimer.current);
    answerTimer.current = null;
    answerLock.current = false;
    setTransitioning(false);
    setAnalysisStep(null);
    setIndex(0);

    setAnswers(
      Array(totalQuestions).fill(-1)
    );

    setUnlocked(hasPaidReturn(LS_KEY));

    try {
      localStorage.removeItem(LS_KEY);
    } catch {
      // ignore
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  const [checkoutUnavailable, setCheckoutUnavailable] = useState(false);
  const accountCheckout = useTestAccountCheckout("psykisk-misshandel-relation", answers, () => setCheckoutUnavailable(true));
  function startPayment() { if (accountCheckout()) return;
    if (
      STRIPE_PAYMENT_LINK.includes(
        "REPLACE_ME"
      )
    ) {
      alert(
        "Stripe-länken för det nya testet är inte inkopplad ännu."
      );
      return;
    }

    if (!payment.prepareCheckout({ index, answers, unlocked })) return;
    tracking.checkout(() => { window.location.href = STRIPE_PAYMENT_LINK; });
  }

  function startTest() {
    setShowIntro(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!hydrated) {
    return (
      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: 24,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
          color: "#111",
        }}
      >
        <section style={{ textAlign: "center", padding: "20px 0 28px" }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", opacity: 0.55 }}>
            Psykisk misshandel & psykiskt våld
          </p>
          <h1 style={{ margin: "10px 0 0", fontSize: "clamp(30px, 8vw, 42px)", lineHeight: 1.12, fontWeight: 900 }}>
            Psykisk misshandel-test – känner du igen mönstren?
          </h1>
          <p style={{ maxWidth: 620, margin: "16px auto 0", lineHeight: 1.6, fontSize: 17, opacity: 0.8 }}>
            30 frågor om kontroll, förnedring, hot, övervakning och återkommande beteenden i en relation.
          </p>
          <p style={{ display: "inline-block", margin: "18px 0 0", padding: "8px 12px", borderRadius: 999, background: "#f1f1f1", fontSize: 14, fontWeight: 700 }}>
            30 frågor · anonymt · direkt resultat
          </p>
          <p style={{ maxWidth: 620, margin: "22px auto 0", padding: "16px 18px", border: "1px solid #dedede", borderRadius: 14, background: "#fafafa", textAlign: "left", lineHeight: 1.6 }}>
            Sedan 1 juli 2026 finns psykiskt våld som ett särskilt brott i svensk lag. Testet hjälper dig att identifiera återkommande beteendemönster, men kan inte avgöra om ett brott har begåtts.
          </p>
          <button type="button" onClick={startTest} style={{ marginTop: 24, minHeight: 52, padding: "13px 24px", border: 0, borderRadius: 12, background: "#111", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
            Starta testet
          </button>
        </section>
        <section style={{ borderTop: "1px solid #e6e6e6", paddingTop: 26 }}>
          <h2 style={{ margin: 0, fontSize: 24 }}>Vad undersöker testet?</h2>
          <ul style={{ margin: "16px 0 0", paddingLeft: 22, display: "grid", gap: 9, lineHeight: 1.5 }}>
            <li>Kontroll och begränsningar</li>
            <li>Förnedring och nedvärdering</li>
            <li>Skuld och beskyllningar</li>
            <li>Hot och rädsla</li>
            <li>Övervakning</li>
            <li>Upprepade beteenden över tid</li>
            <li>Påverkan på självkänsla och handlingsfrihet</li>
          </ul>
          <button type="button" onClick={startTest} style={{ marginTop: 24, minHeight: 48, padding: "12px 22px", border: 0, borderRadius: 12, background: "#111", color: "#fff", fontSize: 16, fontWeight: 800, cursor: "pointer" }}>
            Starta testet
          </button>
        </section>
      </main>
    );
  }

  if (showIntro) {
    return (
      <main
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: 24,
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
          color: "#111",
        }}
      >
        <section
          style={{
            textAlign: "center",
            padding: "20px 0 28px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: ".08em",
              textTransform: "uppercase",
              opacity: 0.55,
            }}
          >
            Psykisk misshandel & psykiskt våld
          </p>
          <h1
            style={{
              margin: "10px 0 0",
              fontSize: "clamp(30px, 8vw, 42px)",
              lineHeight: 1.12,
              fontWeight: 900,
            }}
          >
            Psykisk misshandel-test – känner du igen mönstren?
          </h1>
          <p
            style={{
              maxWidth: 620,
              margin: "16px auto 0",
              lineHeight: 1.6,
              fontSize: 17,
              opacity: 0.8,
            }}
          >
            30 frågor om kontroll, förnedring, hot, övervakning och återkommande
            beteenden i en relation.
          </p>
          <p
            style={{
              display: "inline-block",
              margin: "18px 0 0",
              padding: "8px 12px",
              borderRadius: 999,
              background: "#f1f1f1",
              fontSize: 14,
              fontWeight: 700,
            }}
          >
            30 frågor · anonymt · direkt resultat
          </p>
          <div
            style={{
              maxWidth: 620,
              margin: "22px auto 0",
              padding: "16px 18px",
              border: "1px solid #dedede",
              borderRadius: 14,
              background: "#fafafa",
              textAlign: "left",
              lineHeight: 1.6,
            }}
          >
            Sedan 1 juli 2026 finns psykiskt våld som ett särskilt brott i svensk
            lag. Testet hjälper dig att identifiera återkommande beteendemönster,
            men kan inte avgöra om ett brott har begåtts.
          </div>
          <button
            type="button"
            onClick={startTest}
            style={{
              marginTop: 24,
              minHeight: 52,
              padding: "13px 24px",
              border: 0,
              borderRadius: 12,
              background: "#111",
              color: "#fff",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Starta testet
          </button>
        </section>

        <section
          style={{
            borderTop: "1px solid #e6e6e6",
            paddingTop: 26,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 24 }}>Vad undersöker testet?</h2>
          <ul
            style={{
              margin: "16px 0 0",
              paddingLeft: 22,
              display: "grid",
              gap: 9,
              lineHeight: 1.5,
            }}
          >
            <li>Kontroll och begränsningar</li>
            <li>Förnedring och nedvärdering</li>
            <li>Skuld och beskyllningar</li>
            <li>Hot och rädsla</li>
            <li>Övervakning</li>
            <li>Upprepade beteenden över tid</li>
            <li>Påverkan på självkänsla och handlingsfrihet</li>
          </ul>
          <button
            type="button"
            onClick={startTest}
            style={{
              marginTop: 24,
              minHeight: 48,
              padding: "12px 22px",
              border: 0,
              borderRadius: 12,
              background: "#111",
              color: "#fff",
              fontSize: 16,
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            Starta testet
          </button>
        </section>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: 24,
        fontFamily:
          "system-ui, -apple-system, Segoe UI, Roboto, Arial",
        color: "#111",
      }}
    >
      {unlocked && <div data-flow="inset" role="status" style={{ margin: "20px 0", padding: 16, border: "1px solid #ddd", borderRadius: 12, lineHeight: 1.6 }}><strong>Ditt test är upplåst – du behöver inte betala igen.</strong>{answers.every(answer => answer >= 0) ? <p>Din fullständiga analys visas nedan.</p> : <p>Tidigare svar saknas eller är ofullständiga i den här webbläsaren. Öppna testet i samma webbläsare som före betalningen, eller svara på frågorna här utan att köpa igen. Behöver du hjälp? Kontakta <a href="mailto:support@relationsvarning.se">support@relationsvarning.se</a>.</p>}</div>}
      {payment.checkoutError && <p role="alert" style={{ margin: "20px 0", lineHeight: 1.6 }}>{payment.checkoutError}</p>}

      <nav aria-label="Vidare läsning och stöd" style={{ marginBottom: 20, fontSize: 13, lineHeight: 1.7 }}>
        <a href="/psykisk-misshandel-relation" style={{ textDecoration: "underline" }}>
          Till guiden om psykisk misshandel i relation
        </a>
        <p style={{ margin: "6px 0 0" }}>
          Behöver du stöd?{" "}
          <a href="/psykiskt-vald/hjalp" style={{ textDecoration: "underline" }}>
            Hjälp vid psykiskt våld
          </a>
        </p>
      </nav>

      <header
        style={{
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: 13,
            fontWeight: 800,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            opacity: 0.55,
          }}
        >
          Psykisk misshandel & psykiskt våld
        </p>

        <h1
          style={{
            margin: "8px 0 0",
            fontSize: 30,
            lineHeight: 1.15,
            fontWeight: 900,
          }}
        >
          Besvara 30 frågor om din relation
        </h1>

        <p
          style={{
            marginTop: 12,
            opacity: 0.78,
            lineHeight: 1.55,
          }}
        >
          Svara utifrån hur personen brukar
          bete sig över tid – inte bara utifrån
          er senaste konflikt.
        </p>

        {!isFinished && (
          <div
            style={{
              marginTop: 20,
              textAlign: "left",
            }}
          >
            <div data-flow="track"
              style={{
                height: 10,
                background: "#eee",
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <div data-flow="fill"
                style={{
                  height: "100%",
                  width: `${progress}%`,
                  background: "#111",
                  borderRadius: 999,
                  transition:
                    "width 200ms ease",
                }}
              />
            </div>

            <div
              style={{
                marginTop: 8,
                display: "flex",
                justifyContent:
                  "space-between",
                fontSize: 13,
                opacity: 0.7,
              }}
            >
              <span>{progress}% klart</span>

              <span>
                Fråga {index + 1} av{" "}
                {totalQuestions}
              </span>
            </div>
          </div>
        )}
      </header>

      {!isFinished && (
        <section data-flow="question"
          style={{
            background: "#fff",
            border: "1px solid #e8e8e8",
            borderRadius: 16,
            padding: 20,
            boxShadow:
              "0 6px 24px rgba(0,0,0,0.035)",
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: 13,
              opacity: 0.58,
              fontWeight: 700,
              marginTop: 0,
            }}
          >
            Hur ofta stämmer detta?
          </p>

          <p data-flow="question-text"
            style={{
              fontSize: 22,
              lineHeight: 1.4,
              margin:
                "14px auto 22px",
              textAlign: "center",
              fontWeight: 750,
              maxWidth: 620,
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
            {[0, 1, 2, 3, 4].map(
              (value) => (
                <button aria-pressed={answers[index] === value}
                  key={value}
                  disabled={transitioning}
                  onClick={() =>
                    pickAnswer(value)
                  }
                  style={{
                    textAlign: "left",
                    padding:
                      "13px 15px",
                    borderRadius: 12,
                    border:
                      answers[index] ===
                      value
                        ? "1px solid #999"
                        : "1px solid #ddd",
                    background:
                      answers[index] ===
                      value
                        ? "#ededed"
                        : "#fff",
                    color: "#111",
                    cursor: "pointer",
                    fontSize: 16,
                  }}
                >
                  {answerLabels[value]}
                </button>
              )
            )}
          </div>

          <div
            style={{
              marginTop: 18,
            }}
          >
            <button
              onClick={goPrev}
              disabled={index === 0 || transitioning}
              style={{
                padding: "10px 13px",
                borderRadius: 12,
                border:
                  "1px solid #ddd",
                background:
                  index === 0
                    ? "#f5f5f5"
                    : "#fff",
                color: "#111",
                cursor:
                  index === 0
                    ? "not-allowed"
                    : "pointer",
                opacity:
                  index === 0 ? 0.5 : 1,
              }}
            >
              Tillbaka
            </button>
          </div>

          <p
            style={{
              margin:
                "18px 0 0",
              fontSize: 12,
              opacity: 0.62,
              textAlign: "center",
              lineHeight: 1.55,
            }}
          >
            Testet ställer ingen diagnos
            och avgör inte om ett brott har
            begåtts. Det hjälper dig att
            identifiera återkommande
            beteendemönster.
          </p>
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
              marginTop: 22,
              paddingTop: 18,
              borderTop:
                "1px solid rgba(255,255,255,.13)",
            }}
          >
            <h3
              style={{
                margin:
                  "0 0 8px",
              }}
            >
              I din fullständiga analys ser du
            </h3>

            <ul
              style={{
                lineHeight: 1.85,
                paddingLeft: 22,
                opacity: 0.92,
              }}
            >
              <li>Vilket relationsmönster som väger tyngst i dina svar</li>
              <li>Vad som förstärker eller nyanserar helhetsbilden</li>
              <li>Hur beteenden, gränser och frihet hänger ihop i ditt resultat</li>
            </ul>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 22,
              flexWrap: "wrap",
            }}
          >
            <div style={{ width: "100%" }}><p style={{ margin: "0 0 2px", fontSize: 15, fontWeight: 700 }}>39 kr</p><p style={{ margin: 0, fontSize: 13, color: "#d4d4d4" }}>Engångsbetalning · Ingen prenumeration</p><p style={{ margin: "4px 0 0", fontSize: 13, color: "#d4d4d4" }}>Resultatet visas direkt efter betalning</p></div>
            <PaywallCheckoutCTA onClick={startPayment} />

            <button
              onClick={restart}
              style={{ minHeight: 44, width: "100%", marginTop: 10, border: 0, background: "transparent", color: "#d4d4d4", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 4 }}
            >
              Gör om testet
            </button>
          </div>

          <p
            style={{
              margin:
                "18px 0 0",
              fontSize: 12,
              lineHeight: 1.55,
              opacity: 0.6,
            }}
          >
            Testet är ett orienteringsverktyg
            och utgör inte juridisk rådgivning
            eller ett besked om att ett brott
            har begåtts.
          </p>
        </section>
      )}

      {checkoutUnavailable && <p role="alert">Köpet kunde inte öppnas just nu. Dina svar finns kvar. Försök igen om en stund.</p>}
      {isFinished && unlocked && <ReportView result={result} onRestart={restart} />}
      {isFinished && unlocked && <PostPurchaseRecommendation sourceProduct="psychological_abuse_test" />}

      <nav aria-label="Fördjupning om psykiskt våld" style={{ marginTop: 28, fontSize: 13, lineHeight: 1.7 }}>
        Läs vidare om{" "}
        <a href="/psykiskt-vald" style={{ textDecoration: "underline" }}>
          psykiskt våld
        </a>{" "}
        och{" "}
        <a href="/psykiskt-vald/bevis" style={{ textDecoration: "underline" }}>
          bevis och dokumentation
        </a>
        .
      </nav>

    </main>
  );
}
