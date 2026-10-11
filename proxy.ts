import { type NextRequest, NextResponse } from "next/server";

// Next's configured redirects are case-insensitive. These exact request paths
// therefore live here so a misspelled URL cannot catch the real landing page.
const typoRedirects: Readonly<Record<string, string>> = {
  "/ADHD-Test": "/adhd-test",
  "/adhd test": "/adhd-test",
  "/autism test": "/autism-test",
};

export function proxy(request: NextRequest) {
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
