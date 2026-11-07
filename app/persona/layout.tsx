import type { Metadata } from "next";
import PersonaShell from "./_components/PersonaShell";
export const metadata: Metadata = {
  title: "PERSONA – Vem är du egentligen? | Relationsvarning",
  description: "En personlig upptäcktsresa genom 40 frågor om val, relationer och det som betyder något för dig. Fyra kapitel och en personlig insikt utan kostnad.",
  alternates: { canonical: "https://www.relationsvarning.se/persona" },
};
export default function PersonaLayout({ children }: { children: React.ReactNode }) {
  return <PersonaShell>{children}</PersonaShell>;
}
