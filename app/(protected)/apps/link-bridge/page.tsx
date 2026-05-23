"use client";

import { useState } from "react";
import Navbar from "@/app/components/NavBar";

export default function SecretGenerator() {
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [expires, setExpires] = useState("1");
  const [generatedLink, setGeneratedLink] = useState("");
  const [loading, setLoading] = useState(false);

  const generateLink = async () => {
    if (!content || !password) return;

    setLoading(true);

    const res = await fetch("/api/create-secret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
        password,
        expiresInHours: Number(expires),
      }),
    });

    await res.json();

    setLoading(false);

    const fakeId = Math.random().toString(36).substring(2, 10);
    const link = `${window.location.origin}/secret/${fakeId}`;

    setGeneratedLink(link);
  };

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <div style={styles.backgroundGlow} />

        <div style={styles.wrapper}>
          {/* HERO */}
          <section style={styles.hero}>
            <div style={styles.badge}>🔐 Privacy Tool</div>

            <h1 style={styles.title}>Secure Link Generator</h1>

            <p style={styles.subtitle}>
              Create password-protected, auto-expiring secrets and
              share them safely across devices.
            </p>
          </section>

          {/* MAIN CARD */}
          <section style={styles.card}>
            {/* SECRET INPUT */}
            <div style={styles.section}>
              <h2 style={styles.sectionTitle}>Create Secret</h2>

              <textarea
                placeholder="Enter your secret..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={styles.textarea}
              />

              <input
                type="password"
                placeholder="Set a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
              />

              <select
                value={expires}
                onChange={(e) => setExpires(e.target.value)}
                style={styles.input}
              >
                <option value="1">Expires in 1 hour</option>
                <option value="24">Expires in 24 hours</option>
                <option value="72">Expires in 3 days</option>
              </select>

              <button
                onClick={generateLink}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {}),
                }}
              >
                {loading ? "Generating..." : "Generate Secure Link"}
              </button>
            </div>

            {/* RESULT */}
            {generatedLink && (
              <div style={styles.resultBox}>
                <div style={styles.resultHeader}>Your Secure Link</div>

                <div style={styles.linkBox}>
                  <span style={styles.linkText}>{generatedLink}</span>

                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(generatedLink)
                    }
                    style={styles.copy}
                  >
                    Copy
                  </button>
                </div>

                <p style={styles.helperText}>
                  Share this link with someone — it will expire automatically.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  );
}

/* ====================== STYLES ====================== */

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text)",
    padding: "7rem 1.25rem 3rem",
    position: "relative",
    overflow: "hidden",
  },

  backgroundGlow: {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at top left, rgba(37,99,235,0.18), transparent 35%),
      radial-gradient(circle at bottom right, rgba(139,92,246,0.14), transparent 35%)
    `,
    pointerEvents: "none",
  },

  wrapper: {
    maxWidth: "900px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },

  /* HERO */
  hero: {
    marginBottom: "2rem",
    textAlign: "center",
  },

  badge: {
    display: "inline-flex",
    padding: "0.5rem 0.9rem",
    borderRadius: "999px",
    background: "rgba(37,99,235,0.1)",
    border: "1px solid rgba(59,130,246,0.25)",
    color: "#60a5fa",
    fontWeight: 700,
    fontSize: "0.85rem",
    marginBottom: "1rem",
  },

  title: {
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    fontWeight: 800,
    letterSpacing: "-0.05em",
    marginBottom: "0.75rem",
  },

  subtitle: {
    maxWidth: "650px",
    margin: "0 auto",
    color: "var(--muted)",
    lineHeight: 1.7,
  },

  /* CARD */
  card: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",

    padding: "1.75rem",
    borderRadius: "28px",

    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",

    backdropFilter: "blur(18px)",
    boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  sectionTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
  },

  textarea: {
    minHeight: "120px",
    padding: "1rem",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    color: "var(--text)",
    outline: "none",
    resize: "vertical",
  },

  input: {
    padding: "0.9rem",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.03)",
    color: "var(--text)",
    outline: "none",
  },

  button: {
    padding: "1rem",
    borderRadius: "14px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow: "0 12px 30px rgba(37,99,235,0.25)",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  /* RESULT */
  resultBox: {
    marginTop: "1rem",
    padding: "1.25rem",
    borderRadius: "20px",
    border: "1px solid rgba(59,130,246,0.2)",
    background: "rgba(37,99,235,0.08)",
  },

  resultHeader: {
    fontWeight: 700,
    marginBottom: "0.75rem",
    color: "#60a5fa",
  },

  linkBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    padding: "0.75rem",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(0,0,0,0.2)",
  },

  linkText: {
    fontSize: "0.9rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  copy: {
    padding: "0.4rem 0.8rem",
    borderRadius: "10px",
    border: "1px solid rgba(59,130,246,0.3)",
    background: "rgba(37,99,235,0.2)",
    color: "#fff",
    cursor: "pointer",
  },

  helperText: {
    marginTop: "0.75rem",
    fontSize: "0.85rem",
    color: "var(--muted)",
  },
};