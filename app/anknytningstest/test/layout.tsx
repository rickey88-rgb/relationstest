import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anknytningstest – vilken anknytningsprofil har du?",
  description:
    "Gör vårt anknytningstest med 30 frågor och undersök din anknytningsprofil, anknytningsångest och anknytningsundvikande i romantiska relationer.",
  alternates: {
    canonical: "https://relationsvarning.se/anknytningstest/test",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}