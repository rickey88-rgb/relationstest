import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { accountPortalEnabled } from "../_lib/accountLaunch.server";

export const metadata: Metadata = { robots: { index: false, follow: false } };
export default function AccountLayout({ children }: { children: ReactNode }) {
  if (!accountPortalEnabled()) notFound();
  return children;
}
