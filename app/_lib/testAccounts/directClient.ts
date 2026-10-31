"use client";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { directEndpoint } from "./directPublic";
import { guestProcessingConsentVersion } from "./consent";
let client: SupabaseClient | undefined;
export function directAuthClient() {
  if (typeof window === "undefined") throw new Error("Browser required");
  if (!client) client = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storageKey: "rv-direct-auth-v1", storage: window.sessionStorage },
  });
  return client;
}
export const pendingKey = "rv-direct-pending-v1";
const pendingListKey = "rv-direct-purchases-v1";
const secretKey = "rv-direct-possession-v1";
const restoredSecretsKey = "rv-direct-restored-possession-v1";
export type PendingPurchase = { id: string; product: string };
export function pendingPurchases(): PendingPurchase[] {
  try { const items: unknown = JSON.parse(localStorage.getItem(pendingListKey) ?? "[]");
    return Array.isArray(items) ? items.filter(item => item && typeof item.id === "string" && /^[0-9a-f-]{36}$/i.test(item.id) && typeof item.product === "string") : [];
  } catch { return []; }
}
export function forgetPending(id: string) {
  localStorage.setItem(pendingListKey, JSON.stringify(pendingPurchases().filter(item => item.id !== id)));
  if (pendingPurchase()?.id === id) localStorage.removeItem(pendingKey);
  const secrets = restoredSecrets(); delete secrets[id];
  localStorage.setItem(restoredSecretsKey, JSON.stringify(secrets));
}
export function pendingPurchase(): PendingPurchase | null {
  try { const item = JSON.parse(localStorage.getItem(pendingKey) ?? "null"); return typeof item?.id === "string" && typeof item?.product === "string" ? item : null; } catch { return null; }
}
export function browserPossession(create = false) {
  let secret = localStorage.getItem(secretKey) ?? "";
  if (!/^[A-Za-z0-9_-]{43}$/.test(secret) && create) {
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    secret = btoa(String.fromCharCode(...bytes)).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
    localStorage.setItem(secretKey, secret);
  }
  return secret;
}
function restoredSecrets(): Record<string, string> {
  try { const value = JSON.parse(localStorage.getItem(restoredSecretsKey) ?? "{}");
    if (!value || typeof value !== "object" || Array.isArray(value)) return {};
    const secrets: Record<string, string> = {};
    for (const [id, secret] of Object.entries(value)) if (/^[0-9a-f-]{36}$/i.test(id) && typeof secret === "string" && /^[A-Za-z0-9_-]{43}$/.test(secret)) secrets[id] = secret;
    return secrets;
  } catch { return {}; }
}
export type GuestRestore = PendingPurchase & { secret: string };
export function readGuestRestore(hash: string): GuestRestore | null {
  if (!hash.startsWith("#restore?")) return null;
  const params = new URLSearchParams(hash.slice(9)), id = params.get("id"), product = params.get("product"), secret = params.get("secret");
  if (params.size !== 3 || !id || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)
    || !product || !/^[a-z][a-z0-9_]{1,63}$/.test(product) || !secret || !/^[A-Za-z0-9_-]{43}$/.test(secret)) return null;
  return { id, product, secret };
}
/** A support grant only works after an explicitly approved, purchase-bound server reset.
 * No local flags, email match or URL identifier can create an entitlement. */
export async function restoreGuestPurchase(item: GuestRestore) {
  const value = await directRequest({ action: "guest", id: item.id, product: item.product }, { possession: true, possessionSecret: item.secret });
  if (value.product !== item.product) throw new Error("Återställningen kunde inte verifieras.");
  localStorage.setItem(restoredSecretsKey, JSON.stringify({ ...restoredSecrets(), [item.id]: item.secret }));
  const purchase = { id: item.id, product: item.product };
  localStorage.setItem(pendingKey, JSON.stringify(purchase));
  localStorage.setItem(pendingListKey, JSON.stringify([...pendingPurchases().filter(existing => existing.id !== item.id), purchase]));
  return value;
}
/** Sensitive payloads/tokens go directly to Supabase, without site cookies or a Vercel proxy. */
export async function directRequest(body: Record<string, unknown>, options: { authenticated?: boolean; possession?: boolean; createPossession?: boolean; possessionSecret?: string } = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json", "x-region": "eu-central-1" };
  if (options.authenticated) {
    const { data } = await directAuthClient().auth.getSession();
    if (!data.session) throw new Error("Logga in för att fortsätta.");
    headers.Authorization = "Bearer " + data.session.access_token;
  }
  if (options.possession) {
    const secret = options.possessionSecret ?? (typeof body.id === "string" ? restoredSecrets()[body.id] : undefined) ?? browserPossession(options.createPossession);
    if (options.possessionSecret !== undefined && !/^[A-Za-z0-9_-]{43}$/.test(secret)) throw new Error("Invalid recovery proof");
    headers["x-test-possession"] = secret;
  }
  const response = await fetch(directEndpoint(), { method: "POST", body: JSON.stringify(body), headers, credentials: "omit", cache: "no-store", referrerPolicy: "no-referrer" });
  if (!response.ok) throw new Error("Åtgärden kunde inte genomföras. Försök igen från Mina sidor.");
  return response.json();
}
export async function startDirectCheckout(product: string, payload: unknown) {
  const value = await directRequest({ action: "checkout", product, payload, consent: guestProcessingConsentVersion }, { possession: true, createPossession: true });
  if (typeof value.id !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(value.secret) || typeof value.url !== "string" || new URL(value.url).origin !== "https://checkout.stripe.com") throw new Error("Checkout unavailable");
  localStorage.setItem(secretKey, value.secret);
  localStorage.setItem(pendingKey, JSON.stringify({ id: value.id, product }));
  localStorage.setItem(pendingListKey, JSON.stringify([...pendingPurchases().filter(item => item.id !== value.id), { id: value.id, product }]));
  window.location.assign(value.url);
}
/** Existing Auth email template appends ?token_hash after RedirectTo. Keep it in the fragment. */
export function directLoginRedirect(origin: string) { return new URL("/mina-sidor#login", origin).href; }
export function readLoginFragment(hash: string) {
  if (!hash.startsWith("#login?")) return null;
  const params = new URLSearchParams(hash.slice(7)), token = params.get("token_hash");
  return token && /^[A-Za-z0-9_-]{32,256}$/.test(token) && params.get("type") === "email" ? token : null;
}
