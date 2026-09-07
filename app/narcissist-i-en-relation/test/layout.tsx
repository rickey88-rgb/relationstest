import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Narcissist test – lever du med en narcissist?",
  description:
    "Gör vårt narcissisttest med 30 frågor och undersök narcissistiska relationsmönster som manipulation, empatibrist, nedvärdering och starka reaktioner på kritik.",
  alternates: {
    canonical: "https://www.relationsvarning.se/narcissist-i-en-relation/test",
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
          <Link href="/narcissist-i-en-relation" style={{ color: "#555", textDecoration: "underline", textUnderlineOffset: 3 }}>Läs om narcissistiska mönster i relationer</Link>
        </nav>

        <h1
          style={{
            margin: "18px 0 8px",
            fontSize: "clamp(30px, 8vw, 44px)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
          }}
        >
          Lever du med en narcissist?
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
          Testet hjälper dig identifiera återkommande narcissistiska
          relationsmönster – exempelvis starkt bekräftelsebehov,
          berättigandekänsla, bristande ömsesidighet, manipulation,
          nedvärdering och kraftiga reaktioner på kritik.
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
          <b>Viktigt:</b> testet diagnostiserar inte narcissistiskt
          personlighetssyndrom. Det analyserar beteenden och relationsmönster
          som du själv upplever.
        </div>

      </header>
      {children}
    </main>
  );
}