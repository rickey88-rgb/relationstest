import * as adhd from "../../adhd-test/test/model";
import * as autism from "../../autism-test/test/model";
import * as audhd from "../../audhd-test/test/model";
import * as hsp from "../../hsp-test/test/model";
import * as angest from "../../angest-test/test/model";
import * as ptsd from "../../ptsd-test/test/model";
import * as narcissism from "../../narcissism-sjalvtest/test/model";
import * as screening from "../../test/screening";
import * as attachment from "../../anknytningstest/test/model";
import * as codependency from "../../medberoendetest/test/model";
import * as gaslighting from "../../gaslightingtest/test/model";
import * as partner from "../../narcissist-i-en-relation/test/model";
import * as trauma from "../../traumabindningtest/test/model";
import * as abuse from "../../psykisk-misshandel-relation/test/model";
import * as iq from "../../iq-test/test/model";

type Question = string | { text?: string; prompt?: string; options?: readonly string[]; visual?: iq.MatrixVisual };
type Definition = { questions: readonly Question[]; answerLabels?: readonly string[] };
const definitions: Record<string, Definition> = {
  adhd_test: adhd, autism_test: autism, hsp_test: hsp, angest_test: angest, ptsd_test: ptsd,
  narcissism_selftest: narcissism, screening_test: screening, attachment_test: attachment,
  codependency_test: codependency, gaslighting_test: gaslighting, narcissist_partner: partner,
  trauma_bond_test: trauma, psychological_abuse_test: abuse, iq_test: iq,
  audhd_test: { questions: [...audhd.questions, ...audhd.contextQuestions], answerLabels: audhd.answerLabels },
};
export type AnswerDescription = { question: string; answer: string; value: number; visual?: iq.MatrixVisual };
/** Only public question wording + the validated answer. Never expose IQ answer keys. */
export function describeAnswers(product: string, answers: number[]): AnswerDescription[] {
  const definition = definitions[product];
  if (!definition || answers.length !== definition.questions.length) throw new Error("Answers unavailable");
  return definition.questions.map((question, index) => {
    const item = typeof question === "string" ? { text: question } : question;
    const answer = (item.options ?? definition.answerLabels)?.[answers[index]];
    if (typeof answer !== "string") throw new Error("Answers unavailable");
    return { question: item.text ?? item.prompt ?? "", answer, value: answers[index], ...(item.visual ? { visual: item.visual } : {}) };
  });
}
