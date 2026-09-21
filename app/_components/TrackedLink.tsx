"use client";

import Link from "next/link";
import { trackEvent, type EventName, type EventParams } from "../_analytics/analytics";

export default function TrackedLink({ href, event, params, className, children }: {
  href: string;
  event: EventName;
  params: EventParams;
  className: string;
  children: React.ReactNode;
}) {
  return <Link href={href} onClick={() => trackEvent(event, params)} className={className}>{children}</Link>;
}
