import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anknytningstest – vilken anknytningsprofil har du?",
  description:
    "Gör vårt anknytningstest med 30 frågor och undersök din anknytningsprofil, anknytningsångest och anknytningsundvikande i romantiska relationer.",
  alternates: {
    canonical: "https://www.relationsvarning.se/anknytningstest/test",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "22px 16px 64px", color: "#111" }}>
      <header style={{ marginBottom: 20 }}>
        <nav aria-label="Testnavigation" style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", fontSize: 14 }}>
          <Link href="/" style={{ color: "#555", textDecoration: "underline", textUnderlineOffset: 3 }}>← Till Relationsvarning</Link>
          <Link href="/anknytning" style={{ color: "#555", textDecoration: "underline", textUnderlineOffset: 3 }}>Läs om anknytning i relationer</Link>
        </nav>

        <h1
          style={{
            margin: "18px 0 8px",
            fontSize: "clamp(30px, 8vw, 44px)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
          }}
        >
          Anknytningstest – vilken anknytningsprofil har du?
        </h1>

        <p
          style={{
            margin: 0,
            maxWidth: 690,
            fontSize: 17,
            lineHeight: 1.65,
            color: "#444",
          }}
        >
          Svara på 30 frågor om hur du brukar reagera på närhet,
          osäkerhet, beroende, konflikt och känslomässigt avstånd i
          romantiska relationer.
        </p>

        <div
          style={{
            marginTop: 14,
            padding: 14,
            borderRadius: 14,
            background: "#f7f7f7",
            border: "1px solid #e7e7e7",
            fontSize: 13,
            lineHeight: 1.55,
            color: "#555",
          }}
        >
          <b>Så ska resultatet tolkas:</b> testet mäter två dimensioner –
          anknytningsångest och anknytningsundvikande. De fyra
          anknytningsprofilerna är förenklade sammanfattningar av dessa
          dimensioner, inte diagnoser.
        </div>

      </header>
      {children}
    </main>
  );
}