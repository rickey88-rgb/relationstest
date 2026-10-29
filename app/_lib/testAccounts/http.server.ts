import type { NextRequest } from "next/server";
export const browserCookie = "rv_test_accounts_browser";
export function siteOrigin(request: NextRequest) {
  const value = process.env.TEST_ACCOUNTS_SITE_ORIGIN;
  if (!value) throw new Error("Canonical origin required");
  const url = new URL(value);
  if (url.origin !== value || url.origin !== request.nextUrl.origin
    || (url.protocol !== "https:" && !(process.env.NODE_ENV !== "production" && url.hostname === "localhost"))) throw new Error("Invalid origin");
  return value;
}
