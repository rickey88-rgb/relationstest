import { validLoginEmail } from "./authConfig.server";

type PilotUser = { id: string; email: string };
type AuthUser = { id: string; email?: string; email_confirmed_at?: string; is_anonymous?: boolean } | null;
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/** Server-only restriction on existing Auth, not a replacement for purchase proof.
 * Absent preserves the existing rollout behavior; present but invalid fails closed.
 * For a pilot this MUST be configured before ACCOUNT_PORTAL_ENABLED is enabled.
 */
function pilotUsers(): PilotUser[] | null {
  const raw = process.env.ACCOUNT_PILOT_USERS_JSON;
  if (raw === undefined) return null;
  try {
    if (raw.length > 2048) return [];
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value) || value.length !== 2) return [];
    const users: PilotUser[] = [];
    for (const item of value) {
      if (!item || typeof item !== "object" || Object.keys(item).sort().join(",") !== "email,id"
        || typeof item.id !== "string" || !uuid.test(item.id)) return [];
      const email = validLoginEmail(item.email)?.toLowerCase();
      if (!email || email !== item.email) return [];
      users.push({ id: item.id, email });
    }
    if (new Set(users.map(user => user.id.toLowerCase())).size !== 2 || new Set(users.map(user => user.email)).size !== 2) return [];
    return users;
  } catch { return []; }
}

export function accountPilotEmailAllowed(email: string) {
  const users = pilotUsers();
  return users === null || users.some(user => user.email === email.toLowerCase());
}

export function accountPilotUserAllowed(user: AuthUser) {
  const users = pilotUsers();
  return users === null || Boolean(user && user.email_confirmed_at && !user.is_anonymous
    && users.some(allowed => allowed.id === user.id && allowed.email === user.email?.toLowerCase()));
}
