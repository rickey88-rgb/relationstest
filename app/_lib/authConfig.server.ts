const PRODUCTION_ORIGIN = "https://www.relationsvarning.se";
const LOCAL_ORIGIN = "http://localhost:3000";

export const LOGIN_PATH = "/logga-in";
export const ACCOUNT_PATH = "/mina-sidor";

type Environment = Record<string, string | undefined>;

function configured(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed || null;
}

function validOrigin(value: string) {
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:")
      && url.pathname === "/"
      && !url.search
      && !url.hash
      ? url.origin
      : null;
  } catch {
    return null;
  }
}

/** Server-side application origin used for the fixed Auth callback. */
export function applicationOrigin(environment: Environment = process.env) {
  const configuredOrigin = configured(environment.AUTH_SITE_URL);
  if (configuredOrigin) {
    const origin = validOrigin(configuredOrigin);
    if (!origin) throw new Error("AUTH_SITE_URL must be an absolute origin without a path");
    if (environment.NODE_ENV === "production" && new URL(origin).protocol !== "https:") {
      throw new Error("AUTH_SITE_URL must use HTTPS in production");
    }
    return origin;
  }
  return environment.NODE_ENV === "production" ? PRODUCTION_ORIGIN : LOCAL_ORIGIN;
}

export function authConfirmUrl(environment: Environment = process.env) {
  return new URL("/auth/confirm", applicationOrigin(environment)).toString();
}

export function supabasePublicConfig(environment: Environment = process.env) {
  const url = configured(environment.NEXT_PUBLIC_SUPABASE_URL);
  const publishableKey = configured(environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY);
  if (!url || !publishableKey) throw new Error("Supabase Auth is not configured");

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must be an absolute URL");
  }
  if (parsedUrl.protocol !== "https:" && !(environment.NODE_ENV !== "production" && parsedUrl.protocol === "http:")) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL must use HTTPS in production");
  }
  return { url: parsedUrl.toString(), publishableKey };
}

export function validLoginEmail(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return null;
  const email = value.trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254 ? email : null;
}

export function loginUrl(origin: string, status?: "sent" | "invalid-link" | "unavailable") {
  const url = new URL(LOGIN_PATH, origin);
  if (status) url.searchParams.set("status", status);
  return url;
}
