import { iq } from "./adapters/iq";
import { accountPortalEnabled } from "../accountLaunch.server";
import { partner } from "./adapters/partner";
import { traumaBond } from "./adapters/traumaBond";
import { psychologicalAbuse } from "./adapters/psychologicalAbuse";
import { calculate, type Result } from "../../adhd-test/test/model";
import type { PaymentProductKey } from "../paymentProductCatalog.server";
import { hsp } from "./adapters/hsp";
import { angest } from "./adapters/angest";
import { ptsd } from "./adapters/ptsd";
import { narcissism } from "./adapters/narcissism";
import { screening } from "./adapters/screening";
import { autism } from "./adapters/autism";
import { attachment } from "./adapters/attachment";
import { codependency } from "./adapters/codependency";
import { gaslighting } from "./adapters/gaslighting";

export type Adapter<Report = unknown> = { product: PaymentProductKey; questionVersion: string; reportVersion: string; amount: number;
  slug: string; title: string; testPath?: string; flagPrefix: string; priceEnv: string; parse(input: unknown): number[]; calculate(answers: number[]): Report };

// Only registered adapters can reach storage or checkout. Never accept a client-supplied calculator/version.
const adhd: Adapter<Result> = {
  product: "adhd_test", questionVersion: "adhd-questions-v1", reportVersion: "adhd-report-v1", amount: 3900,
  slug: "adhd", title: "ADHD",
  flagPrefix: "TEST_ACCOUNTS_ADHD", priceEnv: "TEST_ACCOUNTS_ADHD_PRICE_ID",
  parse(input) {
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid answers");
    const value = input as Record<string, unknown>;
    if (Object.keys(value).sort().join(",") !== "answers,questionVersion,reportVersion"
      || value.questionVersion !== this.questionVersion || value.reportVersion !== this.reportVersion
      || !Array.isArray(value.answers) || value.answers.length !== 30
      || !value.answers.every(a => typeof a === "number" && Number.isInteger(a) && a >= 0 && a <= 4)) throw new Error("Invalid answers");
    return [...value.answers];
  }, calculate,
};
const adapters = { iq_test: iq, adhd_test: adhd, hsp_test: hsp, angest_test: angest, ptsd_test: ptsd, narcissism_selftest: narcissism, screening_test: screening, autism_test: autism, attachment_test: attachment, codependency_test: codependency, gaslighting_test: gaslighting, narcissist_partner: partner, trauma_bond_test: traumaBond, psychological_abuse_test: psychologicalAbuse };
export function adapter(product: string): Adapter {
  if (!Object.hasOwn(adapters, product)) throw new Error("Unsupported test");
  return adapters[product as keyof typeof adapters];
}
export function registeredAdapters(): Adapter[] { return Object.values(adapters); }
export function adapterForSlug(slug: string): Adapter {
  const model = registeredAdapters().find(item => item.slug === slug);
  if (!model) throw new Error("Unsupported test");
  return model;
}
export function flags(product: string) {
  const model = adapter(product);
  const enabled = (name: string) => accountPortalEnabled() && process.env[`${model.flagPrefix}_${name}_ENABLED`] === "true";
  return { checkout: enabled("CHECKOUT"), save: enabled("SAVE"), read: enabled("READ"), legacyImport: enabled("LEGACY_IMPORT") };
}
export function assertFlag(product: string, flag: keyof ReturnType<typeof flags>) {
  if (!flags(product)[flag]) throw new Error("Feature disabled");
}
export const consentVersion = "test-account-storage-v1";
