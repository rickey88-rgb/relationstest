import type { Metadata } from "next";
import PersonaShell from "./_components/PersonaShell";
export const metadata: Metadata = {
  title: "PERSONA – Vem är du egentligen? | Relationsvarning",
  description: "40 korta påståenden om personlighet, relationer och vad som hjälper dig i vardagen. Fyra kapitel och en personlig insikt utan kostnad.",
  alternates: { canonical: "https://www.relationsvarning.se/persona" },
};
export default function PersonaLayout({ children }: { children: React.ReactNode }) {
  return <PersonaShell>{children}</PersonaShell>;
}
