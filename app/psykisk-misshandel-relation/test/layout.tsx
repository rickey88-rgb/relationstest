import TestShell from "../../_components/TestShell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Psykisk misshandel-test – 30 frågor om kontroll och psykiskt våld",
  description:
    "Psykisk misshandel-test med 30 anonyma frågor om kontroll, förnedring, hot och övervakning i en relation. Identifiera återkommande mönster och få direkt resultat.",
  alternates: {
    canonical: "/psykisk-misshandel-relation/test",
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <TestShell>{children}</TestShell>;
}
