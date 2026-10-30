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
export type PendingPurchase = { id: string; product: string };
export function pendingPurchases(): PendingPurchase[] {
  try { const items: unknown = JSON.parse(localStorage.getItem(pendingListKey) ?? "[]");
    return Array.isArray(items) ? items.filter(item => item && typeof item.id === "string" && /^[0-9a-f-]{36}$/i.test(item.id) && typeof item.product === "string") : [];
  } catch { return []; }
}
export function forgetPending(id: string) {
  localStorage.setItem(pendingListKey, JSON.stringify(pendingPurchases().filter(item => item.id !== id)));
  if (pendingPurchase()?.id === id) localStorage.removeItem(pendingKey);
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
/** Sensitive payloads/tokens go directly to Supabase, without site cookies or a Vercel proxy. */
export async function directRequest(body: Record<string, unknown>, options: { authenticated?: boolean; possession?: boolean; createPossession?: boolean } = {}) {
  const headers: Record<string, string> = { "Content-Type": "application/json", "x-region": "eu-central-1" };
  if (options.authenticated) {
    const { data } = await directAuthClient().auth.getSession();
    if (!data.session) throw new Error("Logga in för att fortsätta.");
    headers.Authorization = "Bearer " + data.session.access_token;
  }
  if (options.possession) headers["x-test-possession"] = browserPossession(options.createPossession);
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
