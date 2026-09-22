import type { Metadata } from "next";
import "./globals.css";
import Analytics from "./_analytics/AnalyticsProvider";
import SiteFooter from "./_components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.relationsvarning.se"),
  title: "Relationsvarning – anonymt test om varningssignaler i relationer",
  description:
    "Gör ett anonymt relationsbaserat test och få en tydlig riskindikator. Ingen registrering.",
  other: {
    "p:domain_verify": "1cf0c8f0329365a4b1dc2e0dda1020d3",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv">
      <body className="antialiased">
        <Analytics />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
