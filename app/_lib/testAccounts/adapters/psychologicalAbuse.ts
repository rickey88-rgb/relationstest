import { calculate, questions } from "../../../psykisk-misshandel-relation/test/model";
import { parseAnswers } from "./schema";
export const psychologicalAbuse = {
 product: "psychological_abuse_test" as const, slug: "psykisk-misshandel-relation", title: "Psykisk misshandel", amount: 3900,
 testPath: "/psykisk-misshandel-relation/test", questionVersion: "psykisk-misshandel-relation-questions-v1", reportVersion: "psykisk-misshandel-relation-report-v1",
 flagPrefix: "TEST_ACCOUNTS_PSYCHOLOGICAL_ABUSE", priceEnv: "TEST_ACCOUNTS_PSYCHOLOGICAL_ABUSE_PRICE_ID",
 parse(input: unknown) { return parseAnswers(input, this.questionVersion, this.reportVersion, questions.length); }, calculate,
};
