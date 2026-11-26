// Enabled only on the explicitly configured development server.
export const npfLocalPreview = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_NPF_LOCAL_PREVIEW === "true";

export function showNpfPreview() {
  return npfLocalPreview && typeof window !== "undefined" && new URLSearchParams(window.location.search).get("preview") === "paywall";
}
