/** Build-time public settings only. Never accept a backend URL from query/localStorage. */
export function directCustomerEnabled() { return process.env.NEXT_PUBLIC_DIRECT_TEST_ACCOUNTS_ENABLED === "true"; }
export function directEndpoint() {
  const url = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "");
  if (url.protocol !== "https:" || !url.hostname.endsWith(".supabase.co") || url.username || url.password || url.search || url.hash || url.pathname !== "/") throw new Error("Kontotjänsten är inte tillgänglig.");
  // A query routes the browser's header-free CORS preflight to the same EU region too.
  return url.origin + "/functions/v1/customer-tests?forceFunctionRegion=eu-central-1";
}
export function directPortalEnabled() { return process.env.ACCOUNT_DIRECT_PORTAL_ENABLED === "true" && directCustomerEnabled(); }
