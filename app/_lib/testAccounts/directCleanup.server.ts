/** Vercel remains a scheduler only; no customer data or journal identifiers return here. */
export async function forwardDirectCleanup(health: boolean) {
  if (process.env.TEST_ACCOUNTS_EDGE_CLEANUP_ENABLED !== "true") return null;
  const origin = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  const secret = process.env.TEST_ACCOUNTS_EDGE_CRON_SECRET ?? process.env.CRON_SECRET ?? "";
  if (origin.protocol !== "https:" || !origin.hostname.endsWith(".supabase.co") || origin.username || origin.password || origin.search || origin.hash || origin.pathname !== "/" || secret.length < 32) throw new Error("Cleanup unavailable");
  const response = await fetch(origin.origin + "/functions/v1/customer-tests/" + (health ? "health" : "cleanup"), {
    method: "POST", headers: { Authorization: "Bearer " + secret, "x-region": "eu-central-1" }, redirect: "error", cache: "no-store", signal: AbortSignal.timeout(240000),
  });
  if (!response.ok) throw new Error("Cleanup unavailable");
  const body = await response.json();
  if (health ? body.healthy !== true : body.ok !== true) throw new Error("Cleanup unavailable");
  return health ? { healthy: true } : { ok: true };
}
