import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Narcissist test – lever du med en narcissist?",
  description:
    "Gör vårt narcissisttest med 30 frågor och undersök narcissistiska relationsmönster som manipulation, empatibrist, nedvärdering och starka reaktioner på kritik.",
  alternates: {
    canonical: "/narcissist-i-en-relation/test",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}