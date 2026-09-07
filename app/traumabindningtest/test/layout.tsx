import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Traumabindningstest – är du fast i en traumabindning?",
  description:
    "Gör vårt traumabindningstest med 30 frågor om stark bindning, smärta och närhet, hopp om förändring, återdragning och egna gränser.",
  alternates: {
    canonical: "https://www.relationsvarning.se/traumabindningtest/test",
  },
};

export default function TraumabindningTestLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main style={{ maxWidth: 760, margin: "0 auto", padding: "22px 16px 64px", color: "#111" }}>
      <header style={{ marginBottom: 20 }}>
        <nav aria-label="Testnavigation" style={{ display: "flex", flexWrap: "wrap", gap: "8px 20px", fontSize: 14 }}>
          <Link href="/" style={{ color: "#555", textDecoration: "underline", textUnderlineOffset: 3 }}>← Till Relationsvarning</Link>
          <Link href="/traumabindning-i-relation" style={{ color: "#555", textDecoration: "underline", textUnderlineOffset: 3 }}>Läs om traumabindning i relationer</Link>
        </nav>

        <h1
          style={{
            margin: "18px 0 8px",
            fontSize: "clamp(30px, 8vw, 44px)",
            lineHeight: 1.08,
            letterSpacing: "-0.025em",
          }}
        >
          Traumabindningstest – varför är det så svårt att släppa relationen?
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
          Svara på 30 frågor om stark bindning, växlingen mellan smärta och
          närhet, hopp om förändring, återdragning och hur relationen påverkar
          dina egna gränser.
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
          <b>Viktigt:</b> Stark kärlek, saknad eller svårigheter att lämna en
          relation är inte automatiskt traumabindning. Testet undersöker ett
          återkommande mönster där stark anknytning förekommer tillsammans med
          smärta, instabilitet eller beteenden som påverkar ditt välmående.
        </div>

      </header>
      {children}
    </main>
  );
}