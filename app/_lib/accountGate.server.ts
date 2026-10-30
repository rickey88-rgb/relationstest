/** Framework-independent gate shared by Next and Supabase Edge. Default closed. */
export function accountPortalEnabled() { return process.env.ACCOUNT_PORTAL_ENABLED === "true"; }
export function assertAccountPortalEnabled() {
  if (!accountPortalEnabled()) throw new Error("Account portal unavailable");
}
