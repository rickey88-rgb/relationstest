/* eslint-disable @typescript-eslint/no-require-imports -- executable proof-boundary regression test. */
const assert = require("node:assert/strict");
const { randomBytes } = require("node:crypto");
const path = require("node:path");
const createLoader = require("../autism-test/test/test-loader.cjs");
process.env.AUDHD_CHECKOUT_ATTEMPT_ENCRYPTION_KEY = randomBytes(32).toString("base64url");
process.env.AUDHD_CHECKOUT_ACCESS_TOKEN_SECRET = "account-test-access-secret-at-least-32-characters";
process.env.AUDHD_RECOVERY_TOKEN_SECRET = "account-test-recovery-secret-at-least-32-characters";
const load = createLoader();
const crypto = load(path.join(__dirname, "audhdCheckoutAttempt.server.ts"));
const recovery = load(path.join(__dirname, "audhdRecovery.server.ts"));
const attemptId = "11111111-1111-4111-8111-111111111111";
const grantId = "22222222-2222-4222-8222-222222222222";
const secret = crypto.issueAudhdCheckoutBrowserSecret();
const answers = { reportVersion: "audhd-v1", answers: Array(48).fill(2), contextAnswers: Array(6).fill(3) };
const encrypted = crypto.encryptAudhdCheckoutAnswers(answers);
const record = { ...encrypted, checkoutSessionId: "cs_live_account", paymentIntentId: "pi_account", priceId: "price_account" };
let active = true, hasAnswers = true, paymentKind = "verified", revokeDuringCheck = false;
const resolver = createLoader({
  "./audhdCheckoutAttemptsDb.server": { loadAudhdCheckoutRestoreRecord: async (id, hash) => active && id === attemptId && hash === crypto.hashAudhdCheckoutBrowserSecret(secret) ? record : null },
  "./audhdRecoveryDb.server": { loadAudhdRecoveryRestoreRecord: async id => active && hasAnswers && id === grantId ? record : null },
  "./accountPurchasesDb.server": { loadAccountRecoveryPurchase: async id => active && id === grantId ? { checkoutSessionId: record.checkoutSessionId, paymentIntentId: record.paymentIntentId, priceId: record.priceId } : null },
  "./accountAudhdPayment.server": { verifyAccountAudhdPayment: async () => {
    if (revokeDuringCheck) active = false;
    return paymentKind === "verified" ? { kind: "verified", payment: { ...record, purchasedAt: new Date(), amountTotalOre: 7900, currency: "sek" } } : { kind: paymentKind };
  } },
})(path.join(__dirname, "accountAudhdProof.server.ts"));
const cookies = new Map();
const reader = { get: key => cookies.has(key) ? { value: cookies.get(key) } : undefined };
(async () => {
  cookies.set(crypto.AUDHD_CHECKOUT_ACCESS_COOKIE, crypto.issueAudhdCheckoutAccessToken(attemptId, new Date(Date.now() + 600000)));
  cookies.set(crypto.AUDHD_CHECKOUT_ATTEMPT_COOKIE, secret);
  assert.equal((await resolver.resolveAccountAudhdProof("checkout", reader)).kind, "verified");
  cookies.set(crypto.AUDHD_CHECKOUT_ATTEMPT_COOKIE, randomBytes(32).toString("base64url"));
  assert.equal((await resolver.resolveAccountAudhdProof("checkout", reader)).kind, "denied", "signed cookie alone is insufficient");
  cookies.clear(); cookies.set("rv_audhd_recovery", "legacy-unbound-token");
  assert.equal((await resolver.resolveAccountAudhdProof("recovery", reader)).kind, "denied", "legacy cookie lacks purchase-bound proof");
  cookies.set(recovery.AUDHD_RECOVERY_COOKIE, recovery.issueAudhdBrowserUnlockToken(grantId));
  assert.equal((await resolver.resolveAccountAudhdProof("recovery", reader)).kind, "verified");
  hasAnswers = false;
  const history = await resolver.resolveAccountAudhdProof("recovery", reader);
  assert.equal(history.kind, "verified"); assert.equal(history.encrypted, null, "active purchase proof can link history but cannot recreate expired answers");
  hasAnswers = true;
  paymentKind = "revoked";
  assert.equal((await resolver.resolveAccountAudhdProof("recovery", reader)).kind, "denied");
  paymentKind = "unavailable";
  assert.equal((await resolver.resolveAccountAudhdProof("recovery", reader)).kind, "unavailable");
  paymentKind = "verified"; revokeDuringCheck = true;
  assert.equal((await resolver.resolveAccountAudhdProof("recovery", reader)).kind, "denied", "concurrent grant revocation is re-read");
  cookies.set(recovery.AUDHD_RECOVERY_COOKIE, "forged");
  assert.equal((await resolver.resolveAccountAudhdProof("recovery", reader)).kind, "denied");
  console.log("PASS: account claim requires signed purchase-bound cookies, real encrypted answers, live Stripe verification and an active re-read proof.");
})().catch(error => { console.error(error); process.exitCode = 1; });
