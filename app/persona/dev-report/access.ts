import { headers } from "next/headers";

/** The opt-in is server-only. Use it with a development server bound to loopback. */
export async function canOpenLocalReport(requireOrigin = false) {
  if (process.env.NODE_ENV !== "development" || process.env.PERSONA_LOCAL_REPORT_PREVIEW !== "1") return false;

  const request = await headers();
  const host = request.get("host");
  if (!host || !/^127\.0\.0\.1:\d{1,5}$/.test(host)) return false;
  // Next derives this origin from its listening address, independent of HTTP headers.
  // A missing value or a wildcard/non-loopback listener must stay disabled.
  const localOrigin = `http://${host}`;
  if (process.env.__NEXT_PRIVATE_ORIGIN !== localOrigin) return false;
  const address = request.get("x-forwarded-for");
  if (address !== "127.0.0.1" && address !== "::ffff:127.0.0.1") return false;
  if (request.has("forwarded") || request.get("x-forwarded-host") !== host || request.get("x-forwarded-proto") !== "http") return false;
  const origin = request.get("origin");
  return origin === localOrigin || (!requireOrigin && origin === null);
}
