import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Medberoendetest – känner du igen medberoende mönster?",
  description:
    "Gör vårt medberoendetest med 30 frågor om självuppoffring, överansvar, gränser och känslomässigt fokus i relationen.",
  alternates: {
    canonical: "https://www.relationsvarning.se/medberoendetest/test",
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
          <Link href="/medberoende" style={{ color: "#555", textDecoration: "underline", textUnderlineOffset: 3 }}>Läs om medberoende</Link>
        </nav>

        <h1
          style={{
            margin: "18px 0 8px",
            fontSize: "clamp(30px, 8vw, 44px)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
          }}
        >
          Medberoendetest – vilka relationsmönster känner du igen?
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
          Svara på 30 frågor om ansvar, självuppoffring, gränser,
          känslor och hur starkt din partners behov påverkar dig.
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
          <b>Viktigt:</b> Medberoende är inte en klinisk diagnos och
          begreppet definieras på olika sätt. Testet undersöker konkreta
          relationsmönster som i forskning och klinisk litteratur ofta
          förknippas med medberoende. Det avgör inte att du ”är
          medberoende”.
        </div>

      </header>
      {children}
    </main>
  );
}