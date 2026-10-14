export type AudhdCheckoutAnalyticsAttribution = {
  clientId: string;
  sessionId: string;
};

const CLIENT_ID = /^[1-9][0-9]{0,19}\.[1-9][0-9]{0,19}$/;
const SESSION_ID = /^[1-9][0-9]{0,14}$/;

/**
 * Attribution is optional and never participates in payment verification or
 * access control. It is accepted only after the browser has opted in to GA4.
 */
export function parseAudhdCheckoutAnalyticsAttribution(value: unknown): AudhdCheckoutAnalyticsAttribution | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const candidate = value as { clientId?: unknown; sessionId?: unknown };
  if (typeof candidate.clientId !== "string" || typeof candidate.sessionId !== "string") return null;
  if (!CLIENT_ID.test(candidate.clientId) || !SESSION_ID.test(candidate.sessionId)) return null;
  return { clientId: candidate.clientId, sessionId: candidate.sessionId };
}
