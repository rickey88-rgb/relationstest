import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Relationstest – varningssignaler och destruktiva mönster",
  description:
    "Gör ett anonymt relationstest för en bred överblick över varningssignaler, manipulation, kontroll och andra destruktiva mönster i din relation.",
  alternates: {
    canonical: "/test",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
