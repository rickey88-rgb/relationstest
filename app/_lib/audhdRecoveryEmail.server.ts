const RESEND_API_URL = "https://api.resend.com/emails";
const RESEND_REQUEST_TIMEOUT_MS = 8_000;

function configured(name: string) {
  const value = process.env[name]?.trim();
  return value ? value : null;
}

export function isAudhdRecoveryEmailConfigured() {
  return Boolean(configured("RESEND_API_KEY") && configured("AUDHD_RECOVERY_EMAIL_FROM"));
}

/** Server-only transactional mail boundary. It stays inactive until configured. */
export async function sendAudhdRecoveryEmail(input: { to: string; recoveryUrl: string }) {
  const apiKey = configured("RESEND_API_KEY");
  const from = configured("AUDHD_RECOVERY_EMAIL_FROM");
  if (!apiKey || !from) throw new Error("AudhdRecoveryEmailNotConfigured");
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), RESEND_REQUEST_TIMEOUT_MS);
  let response: Response;
  try {
    response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [input.to],
        subject: "Återställ din AuDHD-analys",
        text: `Vi kunde inte säkert koppla din webbläsare till köpet. Öppna denna engångslänk inom 72 timmar för att återställa din åtkomst: ${input.recoveryUrl}`,
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }
  if (!response.ok) throw new Error("AudhdRecoveryEmailDeliveryFailed");
}
