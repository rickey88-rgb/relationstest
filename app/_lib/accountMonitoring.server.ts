export function accountMonitoringConfigured() {
  try { monitoringUrl(); return true; } catch { return false; }
}
function monitoringUrl() {
  const url = new URL(process.env.ACCOUNT_CLEANUP_HEALTHCHECKS_URL ?? "");
  if (url.protocol !== "https:" || url.hostname !== "hc-ping.com" || url.port || url.username || url.password || url.search || url.hash
    || !/^\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(url.pathname)) throw new Error("Cleanup monitoring unavailable");
  return url.href;
}
/** No customer data, counts, exception text or email addresses are transmitted. */
export async function notifyAccountCleanup(success: boolean) {
  const response = await fetch(monitoringUrl() + (success ? "" : "/fail"), {
    method: "POST", body: "", redirect: "error", cache: "no-store", signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error("Cleanup monitoring unavailable");
}
