import type { RefObject } from "react";
import type { Question } from "../_domain/types";
import { UNKNOWN } from "../_domain/versions";
import { unknownLabel } from "../_domain/v1/questions";
import styles from "./persona-journey.module.css";

type Props = {
  question: Question; selected: number | null; locked: boolean; pending: boolean;
  position: number; total: number; last: boolean;
  headingRef: RefObject<HTMLHeadingElement | null>;
  onAnswer(value: number): void; onNext(): void;
};

export default function PersonaQuestion({ question, selected, locked, pending, position, total, last, headingRef, onAnswer, onNext }: Props) {
  const answer = (value: number) => onAnswer(value);
  return <section className={styles.question} aria-labelledby="question-heading" data-question-id={question.id}>
    <div className={styles.questionMeta}>
      <span>{question.kind === "rating" ? "En sida av dig" : question.chapter === 4 ? "Din personliga kod" : "Föreställ dig situationen"}</span>
      <span>{position} / {total}</span>
    </div>
    <h1 id="question-heading" className={styles.title} ref={headingRef} tabIndex={-1}>{question.title}</h1>
    <p className={styles.prompt} data-kind={question.kind}>{question.prompt}</p>
    <fieldset disabled={locked} aria-describedby="persona-auto-hint" className={styles.choices}>
      <legend className={styles.choiceLegend}>{question.kind === "rating" ? "Hur väl stämmer det på dig?" : "Vilket val ligger närmast dig?"}</legend>
      <div className={styles.options} data-kind={question.kind}>
        {question.options.map((label, index) => <label key={index} className={styles.choice} data-selected={selected === index}>
          <input type="radio" name={question.id} checked={selected === index} onChange={() => answer(index)} onClick={() => { if (selected === index) answer(index); }} value={index} />
          <span className={styles.letter} aria-hidden="true">{question.kind === "rating" ? index + 1 : String.fromCharCode(65 + index)}</span>
          <span className={styles.choiceText}>{label}</span><span className={styles.check} aria-hidden="true">✓</span>
        </label>)}
      </div>
      <label className={styles.unknown} data-selected={selected === UNKNOWN}>
        <input type="radio" name={question.id} checked={selected === UNKNOWN} onChange={() => answer(UNKNOWN)} onClick={() => { if (selected === UNKNOWN) answer(UNKNOWN); }} value={UNKNOWN} />
        <span className={styles.letter} aria-hidden="true">?</span><span>{unknownLabel}</span><span className={styles.check} aria-hidden="true">✓</span>
      </label>
    </fieldset>
    <div className={styles.navigation}>
      <p id="persona-auto-hint" className={styles.hint} role="status">{pending ? "Svar valt. Vi går vidare…" : "När du väljer ett svar går du vidare automatiskt efter en kort paus."}</p>
      <button type="button" className={styles.alternateNext} disabled={selected === null || locked} onClick={onNext}>{last ? "Visa min insikt" : "Fortsätt med valt svar"} <span aria-hidden="true">→</span></button>
    </div>
  </section>;
}
