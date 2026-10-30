import { type NextRequest, NextResponse } from "next/server";
import { ACCOUNT_PATH, loginUrl } from "./app/_lib/authConfig.server";
import { copyResponseCookies, refreshAuthSession } from "./app/_lib/authSession.server";
import { accountLaunchUnavailable, accountPortalEnabled, isAccountLaunchPath } from "./app/_lib/accountLaunch.server";
import { authorizedCleanupJob } from "./app/_lib/accountCleanupContext.server";
import { directPortalEnabled } from "./app/_lib/testAccounts/directPublic";

// Next's configured redirects are case-insensitive. These exact request paths
// therefore live here so a misspelled URL cannot catch the real landing page.
const typoRedirects: Readonly<Record<string, string>> = {
  "/ADHD-Test": "/adhd-test",
  "/adhd test": "/adhd-test",
  "/autism test": "/autism-test",
};

const APEX_HOST = "relationsvarning.se";
const CANONICAL_HOST = "www.relationsvarning.se";

async function protectAccount(request: NextRequest) {
  const response = NextResponse.next();
  try {
    const user = await refreshAuthSession(request, response);
    if (user) return response;
    return copyResponseCookies(response, NextResponse.redirect(loginUrl(request.nextUrl.origin), 303));
  } catch {
    return NextResponse.redirect(loginUrl(request.nextUrl.origin, "unavailable"), 303);
  }
}

export function proxy(request: NextRequest) {
  // Checkout cookies are deliberately host-only. Normalize the apex before any
  // page or API route can set one, so Stripe's fixed www return keeps the same
  // browser secret without sharing it with unrelated subdomains.
  if (request.nextUrl.hostname === APEX_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = CANONICAL_HOST;
    url.port = "";
    return NextResponse.redirect(url, 308);
  }

  let pathname = request.nextUrl.pathname;

  try {
    pathname = decodeURIComponent(pathname);
  } catch {
    // Keep malformed paths on the normal 404 path.
  }

  const destination = typoRedirects[pathname];
  if (destination) {
    const url = request.nextUrl.clone();
    url.pathname = destination;
    return NextResponse.redirect(url, 308);
  }

  // Only the generic direct-client shell is public. Old SSR/API routes retain their gate.
  if (pathname === "/mina-sidor" && directPortalEnabled()) return NextResponse.next();
  if (directPortalEnabled() && pathname === "/logga-in" && request.method === "GET") return NextResponse.redirect(new URL("/mina-sidor", request.nextUrl.origin), 303);
  if (directPortalEnabled() && isAccountLaunchPath(pathname) && !authorizedCleanupJob(request)) return accountLaunchUnavailable();
  // Fail closed before Auth/session refresh, rendering or server actions.
  if (!accountPortalEnabled() && isAccountLaunchPath(pathname) && !authorizedCleanupJob(request)) return accountLaunchUnavailable();

  // Auth is intentionally limited to the account surface. Tests, Checkout,
  // recovery and book-delivery requests remain completely anonymous flows.
  // These registered guest reports authenticate purchase possession in their server reader;
  // requiring an account here would break anonymous purchases. Other portal paths remain protected.
  if (/^\/mina-sidor\/gast\/(iq|adhd|hsp|angest|ptsd|narcissism-sjalvtest|screening|autism|anknytningstest|medberoendetest|gaslightingtest|narcissist-i-en-relation|traumabindningtest|psykisk-misshandel-relation)\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\/?$/i.test(pathname)) {
    return NextResponse.next();
  }
  if (pathname === ACCOUNT_PATH || pathname.startsWith(`${ACCOUNT_PATH}/`)) {
    return protectAccount(request);
  }

  return NextResponse.next();
}
