/* Generate a short-lived, server-verified autism-test support-recovery link. */
const { createHmac, randomBytes } = require("node:crypto");

const secret = process.env.AUTISM_RECOVERY_TOKEN_SECRET;
if (!secret || secret.length < 32) throw new Error("Set AUTISM_RECOVERY_TOKEN_SECRET to a random value of at least 32 characters.");
const args = process.argv.slice(2);
const option = name => { const index = args.indexOf(name); return index >= 0 ? args[index + 1] : undefined; };
const baseUrl = (option("--base-url") ?? "https://relationsvarning.se").replace(/\/$/, "");
const hours = Number(option("--hours") ?? "48");
if (!Number.isInteger(hours) || hours < 1 || hours > 48) throw new Error("--hours must be an integer from 1 to 48.");
const payload = { v: 1, product: "autism", kind: "support-recovery", exp: Math.floor(Date.now() / 1000) + hours * 60 * 60, nonce: randomBytes(18).toString("base64url") };
const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
const signature = createHmac("sha256", secret).update(encodedPayload).digest("base64url");
console.log(`${baseUrl}/api/autism-recovery/redeem?token=${encodeURIComponent(`${encodedPayload}.${signature}`)}`);
