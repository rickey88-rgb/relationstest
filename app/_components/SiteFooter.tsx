import Link from "next/link";
import { AnalyticsSettings } from "../_analytics/AnalyticsProvider";
import { NewsletterFooterSignup } from "./NewsletterSignup";

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200/70 bg-white text-neutral-600">
      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <NewsletterFooterSignup />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-sm">© 2026 Relationsvarning.se</p>
          <nav aria-label="Information om Relationsvarning">
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              {[
                { href: "/integritet", label: "Integritet" },
                { href: "/juridisk-information", label: "Juridisk information" },
                { href: "/villkor", label: "Villkor" },
                { href: "/kontakt", label: "Kontakt" },
                { href: "/metodik", label: "Metodik" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex min-h-11 items-center rounded-sm underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li><AnalyticsSettings /></li>
            </ul>
          </nav>
        </div>
        <div className="mt-2 flex flex-col gap-2 text-xs sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p>Integritet först • Inloggning är frivillig • Statistik endast med samtycke</p>
          <a
            href="mailto:support@relationsvarning.se"
            className="inline-flex min-h-11 items-center self-start rounded-sm underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
          >
            support@relationsvarning.se
          </a>
        </div>
        <div className="mt-2 flex flex-col items-start sm:flex-row sm:items-center sm:gap-4">
          <iframe
            {...{ credentialless: "" }}
            src="https://climate.stripe.com/badge/7HtcA4?theme=light&size=small&locale=sv-SE"
            width={380}
            height={38}
            className="block h-[58px] w-full max-w-[380px] border-0 min-[375px]:h-[38px]"
            loading="lazy"
            title="Stripe Climate – Relationsvarnings klimatmärke"
            referrerPolicy="no-referrer"
            sandbox=""
          />
          <a
            href="https://climate.stripe.com/pVny59"
            referrerPolicy="no-referrer"
            className="inline-flex min-h-11 items-center rounded-sm text-xs underline decoration-neutral-300 underline-offset-4 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neutral-900"
          >
            Vårt klimatåtagande
          </a>
        </div>
      </div>
    </footer>
  );
}
