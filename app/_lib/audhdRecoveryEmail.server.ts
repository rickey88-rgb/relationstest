const RESEND_API_URL = "https://api.resend.com/emails";
const RESEND_REQUEST_TIMEOUT_MS = 8_000;

/** Resend returned a response confirming that it did not accept the message. */
export class AudhdRecoveryEmailRejected extends Error {
  constructor() {
    super("AudhdRecoveryEmailRejected");
    this.name = "AudhdRecoveryEmailRejected";
  }
}

function configured(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export function isAudhdRecoveryEmailConfigured() {
  return Boolean(configured("RESEND_API_KEY") && configured("AUDHD_RECOVERY_EMAIL_FROM"));
}

/** Server-only transactional mail boundary. It stays inactive until configured. */
export async function sendAudhdRecoveryEmail(input: { to: string; recoveryUrl: string; idempotencyKey?: string }) {
  const apiKey = configured("RESEND_API_KEY");
  const from = configured("AUDHD_RECOVERY_EMAIL_FROM");
  if (!apiKey || !from) throw new Error("AudhdRecoveryEmailNotConfigured");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESEND_REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", ...(input.idempotencyKey ? { "Idempotency-Key": input.idempotencyKey } : {}) },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: "Din AuDHD-analys – säker återställningslänk",
        text: `Din AuDHD-analys är klar. Om du redan har öppnat den behöver du inte göra något. Om analysen inte visas i din webbläsare kan du använda den här personliga engångslänken inom 72 timmar för att återställa åtkomsten: ${input.recoveryUrl}`,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) throw new AudhdRecoveryEmailRejected();
}
