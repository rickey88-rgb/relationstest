import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gaslighting test – utsätts du för gaslighting i relationen?",
  description:
    "Gör vårt gaslightingtest med 30 frågor om förnekande, skuldvändning, minne, känslor och tvivel på det egna omdömet i en relation.",
  alternates: {
    canonical: "https://relationsvarning.se/gaslightingtest/test",
  },
};

export default function GaslightingTestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}