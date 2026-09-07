import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Gaslighting test – utsätts du för gaslighting i relationen?",
  description:
    "Gör vårt gaslightingtest med 30 frågor om förnekande, skuldvändning, minne, känslor och tvivel på det egna omdömet i en relation.",
  alternates: {
    canonical: "https://www.relationsvarning.se/gaslightingtest/test",
  },
};

export default function GaslightingTestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "22px 16px 64px", color: "#111" }}>
      <header style={{ marginBottom: 20 }}>
        <nav aria-label="Testnavigation" style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", fontSize: 14 }}>
          <Link href="/" style={{ color: "#555", textDecoration: "underline", textUnderlineOffset: 3 }}>← Till Relationsvarning</Link>
          <Link href="/gaslighting-relation" style={{ color: "#555", textDecoration: "underline", textUnderlineOffset: 3 }}>Läs om gaslighting i relationer</Link>
        </nav>

        <h1
          style={{
            margin: "18px 0 8px",
            fontSize: "clamp(30px, 8vw, 44px)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
          }}
        >
          Gaslightingtest – blir din verklighetsuppfattning ifrågasatt?
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
          Svara på 30 frågor om förnekande, minne, skuldvändning,
          förminskning och hur relationen påverkar tilliten till ditt eget
          omdöme.
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
          <b>Viktigt:</b> Att två personer ibland minns eller tolkar en
          situation olika är inte automatiskt gaslighting. Testet undersöker
          återkommande mönster där din tillit till den egna upplevelsen,
          minnet eller bedömningen kan undermineras.
        </div>

      </header>
      {children}
    </main>
  );
}