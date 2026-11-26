"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { trackEvent } from "../_analytics/analytics";

export default function NpfLandingLink({ href, source, action, className, children }: {
  href: string;
  source: string;
  action: "test_start" | "why_relationsvarning" | "return_to_test" | "report_example";
  className: string;
  children: ReactNode;
}) {
  return <Link href={href} className={className} onClick={() => {
    trackEvent("npf_landing_click", { source_page: source, destination_page: href.split("?")[0], cta_label: action });
  }}>{children}</Link>;
}
