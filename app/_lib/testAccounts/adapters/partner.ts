import { calculate, questions } from "../../../narcissist-i-en-relation/test/model";
import { parseAnswers } from "./schema";
export const partner = {
 product: "narcissist_partner" as const, slug: "narcissist-i-en-relation", title: "Narcissist i en relation", amount: 3900,
 testPath: "/narcissist-i-en-relation/test", questionVersion: "narcissist-i-en-relation-questions-v1", reportVersion: "narcissist-i-en-relation-report-v1",
 flagPrefix: "TEST_ACCOUNTS_PARTNER", priceEnv: "TEST_ACCOUNTS_PARTNER_PRICE_ID",
 parse(input: unknown) { return parseAnswers(input, this.questionVersion, this.reportVersion, questions.length); }, calculate,
};
