export default function VillkorPage() {
  return (
    <main
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: 24,
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
        lineHeight: 1.7,
      }}
    >
      <h1 style={{ marginTop: 0, fontSize: 28, fontWeight: 900 }}>Villkor</h1>

      <p style={{ opacity: 0.85 }}>
        Dessa villkor gäller för användning av relationstestet och köp av
        resultat/analys (“Tjänsten”).
      </p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>1. Vad tjänsten är</h2>
      <p style={{ opacity: 0.9 }}>
        Tjänsten är ett självskattningstest som sammanställer{" "}
        <b>riskindikatorer</b> baserat på de svar du lämnar. Resultatet är en{" "}
        <b>informationsbaserad riskprofil</b> som syftar till reflektion och
        vägledning.
      </p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>2. Vad tjänsten inte är</h2>
      <ul style={{ opacity: 0.9 }}>
        <li>
          Testet ställer <b>ingen diagnos</b> och bedömer inte en persons
          medicinska/psykologiska tillstånd.
        </li>
        <li>
          Tjänsten är <b>inte</b> terapi, vård, krisstöd eller juridisk
          rådgivning.
        </li>
        <li>
          Tjänsten ersätter inte professionell bedömning. Om du känner dig
          otrygg eller rädd, prioritera säkerhet och sök stöd.
        </li>
      </ul>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>3. Ditt ansvar</h2>
      <p style={{ opacity: 0.9 }}>
        Du ansvarar för hur du använder informationen. Vi kan inte garantera att
        resultatet passar alla situationer eller att det alltid speglar din
        verklighet. Enskilda svar kan påverka resultatet.
      </p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>4. Pris och betalning</h2>
      <p style={{ opacity: 0.9 }}>
        Betalning hanteras av Stripe. Pris visas i samband med köp. Om något
        blir fel i betalflödet, kontakta oss via e-post.
      </p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>5. Ångerrätt och återbetalning</h2>
      <p style={{ opacity: 0.9 }}>
        Tjänsten levereras digitalt direkt efter köp. Om du upplever tekniska
        problem (t.ex. att du inte får tillgång till innehållet), kontakta oss
        så hjälper vi dig.
      </p>
      <p style={{ opacity: 0.9 }}>
        Om du vill ha en tydlig policy kan du använda detta som enkel regel:
        <b> återbetalning ges vid verifierat tekniskt fel eller dubbeldebitering</b>.
      </p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>6. Kontakt</h2>
      <p style={{ opacity: 0.9 }}>
        Support och frågor:{" "}
        <a href="mailto:support@relationstest.se">support@relationstest.se</a>
      </p>

      <p style={{ marginTop: 26, fontSize: 12, opacity: 0.7 }}>
        Senast uppdaterad: {new Date().toISOString().slice(0, 10)}
      </p>
    </main>
  );
}
