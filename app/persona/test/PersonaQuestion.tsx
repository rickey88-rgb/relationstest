import type { RefObject } from "react";
import { SKIPPED } from "../_domain/v3/manifest";
import { ratingLabels, type V3Question } from "../_domain/v3/questions";
import styles from "./persona-journey.module.css";

type Props = {
  question: V3Question; selected: number | null; locked: boolean; pending: boolean;
  position: number; total: number; last: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onAnswer(value: number): void; onSelect(value: number): void; onNext(): void;
};

export default function PersonaQuestion({ question, selected, locked, pending, position, total, last, headingRef, onAnswer, onSelect, onNext }: Props) {
  return <section className={styles.question} aria-labelledby="question-heading" data-question-id={question.id}>
    <div className={styles.questionMeta}>
      <span>{question.chapter === 4 ? "Fördjupning" : "Om dig i vardagen"}</span>
      <span>{position} / {total}</span>
    </div>
    <h1 id="question-heading" className={styles.title} ref={headingRef} tabIndex={-1}>{question.prompt}</h1>
    <fieldset disabled={locked} aria-describedby="persona-auto-hint" className={styles.choices}>
      <legend className={styles.choiceLegend}>Hur väl stämmer det in på dig?</legend>
      <div className={styles.options} data-kind="rating">
        {ratingLabels.map((label, index) => {
          const value = index + 1;
          return <label key={value} className={styles.choice} data-selected={selected === value}>
            <input type="radio" name={question.id} checked={selected === value} value={value}
              onChange={() => onSelect(value)} onClick={event => { if (event.detail > 0) onAnswer(value); }} />
            <span className={styles.letter} aria-hidden="true">{value}</span>
            <span className={styles.choiceText}>{label}</span><span className={styles.check} aria-hidden="true">✓</span>
          </label>;
        })}
      </div>
    </fieldset>
    <div className={styles.navigation}>
      <p id="persona-auto-hint" className={styles.hint} role="status">{pending ? "Går vidare…" : "Med tangentbord väljer du ett svar och trycker sedan på Fortsätt."}</p>
      <button type="button" className={styles.skipQuestion} disabled={locked} onClick={() => onAnswer(SKIPPED)}>Hoppa över</button>
      <button type="button" className={styles.alternateNext} disabled={selected === null || locked} onClick={onNext}>{last ? "Visa min insikt" : "Fortsätt"} <span aria-hidden="true">→</span></button>
    </div>
  </section>;
}
