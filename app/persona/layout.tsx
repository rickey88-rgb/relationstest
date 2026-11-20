import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PersonaShell from "./_components/PersonaShell";
export const metadata: Metadata = {
  title: "PERSONA – Vem är du egentligen? | Relationsvarning",
  description: "40 korta påståenden om personlighet, relationer och vad som hjälper dig i vardagen. Fyra kapitel och en personlig insikt utan kostnad.",
  alternates: { canonical: "https://www.relationsvarning.se/persona" },
};
export default function PersonaLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NODE_ENV === "production" && process.env.TEST_ACCOUNTS_PERSONA_V61_ONLY === "true") notFound();
  return <PersonaShell>{children}</PersonaShell>;
}
