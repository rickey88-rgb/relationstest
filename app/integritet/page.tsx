export default function IntegritetPage() {
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
      <h1 style={{ marginTop: 0, fontSize: 28, fontWeight: 900 }}>
        Integritetspolicy
      </h1>

      <p style={{ opacity: 0.85 }}>
        Här beskriver vi hur vi hanterar uppgifter när du använder relationstestet.
      </p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>1. Vilka uppgifter vi hanterar</h2>
      <ul style={{ opacity: 0.9 }}>
        <li>
          <b>Betalningsuppgifter:</b> hanteras av Stripe (vi ser inte dina fullständiga
          kortuppgifter).
        </li>
        <li>
          <b>Testdata lokalt:</b> för att testet ska fungera kan viss data sparas i din
          webbläsare (t.ex. via localStorage) så att du inte tappar dina svar vid refresh.
        </li>
      </ul>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>2. Lagring av testsvar</h2>
      <p style={{ opacity: 0.9 }}>
        I nuvarande version sparas dina testsvar främst <b>lokalt i din webbläsare</b>{" "}
        för funktionalitet (t.ex. om sidan laddas om). Vi eftersträvar att inte lagra
        känsliga testsvar på server permanent i MVP.
      </p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>3. Cookies och lokal lagring</h2>
      <p style={{ opacity: 0.9 }}>
        Tjänsten kan använda lokal lagring (t.ex. localStorage) för att komma ihåg testets
        status. Du kan rensa detta genom att rensa webbplatsdata i din webbläsare.
      </p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>4. Betalningsleverantör (Stripe)</h2>
      <p style={{ opacity: 0.9 }}>
        Betalning hanteras av Stripe. Stripe behandlar betalningsuppgifter enligt sina
        egna villkor och integritetspolicy.
      </p>

      <h2 style={{ marginTop: 22, fontSize: 18 }}>5. Kontakt</h2>
      <p style={{ opacity: 0.9 }}>
        Frågor om integritet:{" "}
        <a href="mailto:support@relationstest.se">support@relationsvarning.se</a>
      </p>

      <p style={{ marginTop: 26, fontSize: 12, opacity: 0.7 }}>
        Senast uppdaterad: {new Date().toISOString().slice(0, 10)}
      </p>
    </main>
  );
}
