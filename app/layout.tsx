import type { Metadata } from "next";
import "./globals.css";
import Analytics from "./_analytics/AnalyticsProvider";
import SiteFooter from "./_components/SiteFooter";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.relationsvarning.se"),
  title: "Relationsvarning – självtester, guider och kunskap",
  description:
    "Självtester, guider och verktyg om ADHD, autism, psykisk hälsa och relationer.",
  icons: {
    icon: "/icon.png",
  },
  other: {
    "p:domain_verify": "1cf0c8f0329365a4b1dc2e0dda1020d3",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
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
