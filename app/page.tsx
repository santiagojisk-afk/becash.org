export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "linear-gradient(135deg,#0f0f0f,#1a1a1a)",
        color: "#fff",
        textAlign: "center",
        padding: 24,
        margin: 0,
      }}
    >
      <h1 style={{ fontSize: 42, margin: 0, letterSpacing: 1 }}>Qash</h1>
      <p style={{ opacity: 0.85, maxWidth: 560 }}>
        Pagos simples y sociales. Enviar y recibir dinero con solo un <b>@usuario</b>.
      </p>

      <a
        href="mailto:team@beqash.org"
        style={{
          padding: "12px 20px",
          borderRadius: 12,
          border: "1px solid #2e2e2e",
          textDecoration: "none",
          color: "#fff",
        }}
      >
        Contáctanos
      </a>

      <div style={{ fontSize: 12, opacity: 0.6, marginTop: 24 }}>
        API: <code>{process.env.NEXT_PUBLIC_API_URL || "https://api.beqash.org"}</code>
      </div>
    </main>
  );
}