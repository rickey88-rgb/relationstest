import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Medberoendetest – känner du igen medberoende mönster?",
  description:
    "Gör vårt medberoendetest med 30 frågor om självuppoffring, överansvar, gränser och känslomässigt fokus i relationen.",
  alternates: {
    canonical: "https://relationsvarning.se/medberoendetest/test",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}