import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { newsletterEmail, newsletterSource, NEWSLETTER_CONSENT_VERSION } from "./newsletter";
import { confirmNewsletter, newsletterRateLimit, requestNewsletterConfirmation, unsubscribeNewsletter } from "./newsletterDb.server";

const SITE = "https://www.relationsvarning.se";
const UUID = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
function secret() {
  const value = process.env.NEWSLETTER_TOKEN_SECRET?.trim();
  if (!value || value.length < 32) throw new Error("Newsletter unavailable");
  return value;
}
export function newsletterConfigured() {
  return process.env.NEWSLETTER_ENABLED === "true" && Boolean(process.env.DATABASE_URL?.trim() && process.env.RESEND_API_KEY?.trim() && (process.env.NEWSLETTER_EMAIL_FROM?.trim() || process.env.AUDHD_RECOVERY_EMAIL_FROM?.trim()) && (process.env.NEWSLETTER_TOKEN_SECRET?.trim().length ?? 0) >= 32);
}
export function newsletterHash(value: string) { return createHash("sha256").update(value).digest("hex"); }
function mac(value: string) { return createHmac("sha256", secret()).update(value).digest("base64url"); }

export function newsletterUnsubscribeUrl(id: string, nonce: string) {
  if (!UUID.test(id) || !UUID.test(nonce)) throw new Error("Invalid newsletter recipient");
  return `${SITE}/nyhetsbrev/avsluta#token=${id}.${nonce}.${mac(`unsubscribe:${id}:${nonce}`)}`;
}

export async function subscribeNewsletter(input: { email?: unknown; source?: unknown; consent?: unknown; version?: unknown; website?: unknown }, ip: string) {
  const email = newsletterEmail(input.email), source = newsletterSource(input.source);
  if (!email || !source || input.consent !== true || input.version !== NEWSLETTER_CONSENT_VERSION) return "invalid" as const;
  if (input.website) return "accepted" as const;
  if (!newsletterConfigured()) return "unavailable" as const;
  try {
    // No raw IP, referrer, page URL, account, product or test data is stored.
    if (!await newsletterRateLimit(mac(`ip:${ip}`), 20) || !await newsletterRateLimit(mac(`email:${email}`), 3)) return "accepted" as const;
    const token = randomBytes(32).toString("base64url");
    const id = await requestNewsletterConfirmation(email, source, newsletterHash(token));
    if (!id) return "accepted" as const;
    const confirmationUrl = `${SITE}/nyhetsbrev/bekrafta#token=${token}`;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST", signal: AbortSignal.timeout(8_000),
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY?.trim()}`, "Content-Type": "application/json", "Idempotency-Key": `newsletter-confirm:${newsletterHash(token)}` },
      body: JSON.stringify({ from: process.env.NEWSLETTER_EMAIL_FROM?.trim() || process.env.AUDHD_RECOVERY_EMAIL_FROM?.trim(), to: [email],
        subject: "Bekräfta att du vill följa Relationsvarning.se",
        text: `Hej!\n\nDu har bett om att få våra guider, nyheter om tester och böcker samt utvalda erbjudanden via e-post. Bekräfta genom att öppna länken och trycka på ”Bekräfta min prenumeration”:\n\n${confirmationUrl}\n\nLänken gäller i 24 timmar. Om du inte bad om detta behöver du inte göra något. Du registreras inte som aktiv förrän du bekräftar.\n\nDu kan avsluta när du vill via länken i varje nyhetsbrev. Dina köp, kvitton och produktleveranser påverkas inte.\n\nIntegritet: ${SITE}/nyhetsbrev/integritet\n\nVänliga hälsningar\nRelationsvarning.se`,
      }),
    });
    if (!response.ok) console.error(JSON.stringify({ event: "newsletter_confirmation_unavailable", reason: "email_rejected" }));
  } catch {
    console.error(JSON.stringify({ event: "newsletter_confirmation_unavailable", reason: "service_unavailable" }));
  }
  // Existing, pending, rate-limited and unknown addresses receive the same answer.
  return "accepted" as const;
}

export async function confirmNewsletterToken(token: unknown) {
  if (typeof token !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(token)) return null;
  return confirmNewsletter(newsletterHash(token));
}

export async function unsubscribeNewsletterToken(token: unknown) {
  if (typeof token !== "string" || token.length > 200) return false;
  const [id, nonce, signature, extra] = token.split(".");
  if (extra || !UUID.test(id ?? "") || !UUID.test(nonce ?? "") || !/^[A-Za-z0-9_-]{43}$/.test(signature ?? "")) return false;
  const expected = Buffer.from(mac(`unsubscribe:${id}:${nonce}`)), provided = Buffer.from(signature);
  if (expected.length !== provided.length || !timingSafeEqual(expected, provided)) return false;
  return unsubscribeNewsletter(id, nonce);
}
