export const NEWSLETTER_CONSENT_VERSION = "newsletter-2026-11-04-v1";
export const NEWSLETTER_CONSENT_TEXT = "Jag vill få Relationsvarning.se:s guider, produktnyheter om tester och böcker samt utvalda erbjudanden via e-post. Jag kan avsluta när jag vill.";
export const NEWSLETTER_SOURCES = ["home", "article", "footer", "result"] as const;
export type NewsletterSource = typeof NEWSLETTER_SOURCES[number];

export function newsletterEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  const parts = email.split("@");
  return email.length <= 254 && parts[0]?.length <= 64 && !parts[0].startsWith(".") && !parts[0].endsWith(".") && !email.includes("..") && /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(email) && parts[1].split(".").every(label => label.length <= 63) ? email : null;
}

export function newsletterSource(value: unknown): NewsletterSource | null {
  return NEWSLETTER_SOURCES.includes(value as NewsletterSource) ? value as NewsletterSource : null;
}
