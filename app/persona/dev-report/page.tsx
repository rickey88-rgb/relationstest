import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { canOpenLocalReport } from "./access";
import LocalPersonaReport from "./LocalPersonaReport";

export const metadata: Metadata = { title: "PERSONA · lokal rapportgranskning", robots: { index: false, follow: false } };

export default async function LocalPersonaReportPage() {
  if (!await canOpenLocalReport()) notFound();
  return <LocalPersonaReport />;
}
