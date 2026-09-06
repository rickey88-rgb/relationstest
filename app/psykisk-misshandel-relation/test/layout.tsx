import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Test om psykisk misshandel och psykiskt våld i relationen",
  description:
    "Gör ett anonymt test med 30 frågor om kontroll, hot, förnedring, övervakning och psykisk nedbrytning i din relation. Få hjälp att se återkommande mönster.",
  alternates: {
    canonical: "/psykisk-misshandel-relation/test",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
