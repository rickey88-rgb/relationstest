import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Traumabindningstest – är du fast i en traumabindning?",
  description:
    "Gör vårt traumabindningstest med 30 frågor om stark bindning, smärta och närhet, hopp om förändring, återdragning och egna gränser.",
  alternates: {
    canonical: "https://relationsvarning.se/traumabindningtest/test",
  },
};

export default function TraumabindningTestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}