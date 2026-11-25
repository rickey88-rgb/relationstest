"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import Analytics from "../_analytics/AnalyticsProvider";

export default function LocalizedDocument({ children, header, footer }: {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}) {
  const pathname = usePathname();
  const norsk = pathname === "/no" || pathname?.startsWith("/no/");
  return <html lang={norsk ? "nb-NO" : "sv"}>
    <body className="antialiased">
      <Analytics market={norsk ? "no" : "sv"} />
      {!norsk && header}
      {children}
      {!norsk && footer}
    </body>
  </html>;
}
