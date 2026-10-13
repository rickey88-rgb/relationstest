import { type NextRequest, NextResponse } from "next/server";

// Next's configured redirects are case-insensitive. These exact request paths
// therefore live here so a misspelled URL cannot catch the real landing page.
const typoRedirects: Readonly<Record<string, string>> = {
  "/ADHD-Test": "/adhd-test",
  "/adhd test": "/adhd-test",
  "/autism test": "/autism-test",
};

const APEX_HOST = "relationsvarning.se";
const CANONICAL_HOST = "www.relationsvarning.se";

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
  if (!destination) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = destination;
  return NextResponse.redirect(url, 308);
}
