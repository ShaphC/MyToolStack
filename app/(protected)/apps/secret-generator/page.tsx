"use client";

import { useState } from "react";
import Navbar from "@/app/components/NavBar";

export default function SecretGenerator() {
  const [content, setContent] = useState("");
  const [password, setPassword] = useState("");
  const [expires, setExpires] = useState("1");
  const [generatedLink, setGeneratedLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

    const fakeId = Math.random()
      .toString(36)
      .substring(2, 10);

    const link = `${window.location.origin}/secret/${fakeId}`;

    setGeneratedLink(link);
  };

  const copyLink = async () => {
    if (!generatedLink) return;

    await navigator.clipboard.writeText(
      generatedLink
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <div style={styles.container}>
          {/* HERO */}
          <div style={styles.hero}>
            <h1 style={styles.title}>
              Secure Link Generator
            </h1>

            <p style={styles.subtitle}>
              Create private password-protected
              links that automatically expire.
            </p>
          </div>

          {/* MAIN CARD */}
          <div style={styles.card}>
            {/* SECRET PREVIEW */}
            <div style={styles.secretBox}>
              <div style={styles.secretTop}>
                <span style={styles.secretBadge}>
                  🔐 Encrypted Secret
                </span>

                <span style={styles.expiryBadge}>
                  {expires === "1" &&
                    "1 Hour"}
                  {expires === "24" &&
                    "24 Hours"}
                  {expires === "72" &&
                    "3 Days"}
                </span>
              </div>

              <div style={styles.secretPreview}>
                {content
                  ? content
                  : "Your secret preview will appear here"}
              </div>
            </div>

            {/* INPUTS */}
            <div style={styles.controls}>
              <textarea
                placeholder="Enter your secret..."
                value={content}
                onChange={(e) =>
                  setContent(e.target.value)
                }
                style={styles.textarea}
              />

              <input
                type="password"
                placeholder="Set a password"
                value={password}
                onChange={(e) =>
                  setPassword(
                    e.target.value
                  )
                }
                style={styles.input}
              />

              <div style={styles.selectWrap}>
                <span style={styles.label}>
                  Expiration
                </span>

                <select
                  value={expires}
                  onChange={(e) =>
                    setExpires(
                      e.target.value
                    )
                  }
                  style={styles.select}
                >
                  <option value="1">
                    1 Hour
                  </option>

                  <option value="24">
                    24 Hours
                  </option>

                  <option value="72">
                    3 Days
                  </option>
                </select>
              </div>

              <button
                onClick={generateLink}
                disabled={loading}
                style={{
                  ...styles.primaryBtn,
                  ...(loading
                    ? styles.buttonDisabled
                    : {}),
                }}
              >
                {loading
                  ? "Generating..."
                  : "Generate Secure Link"}
              </button>
            </div>

            {/* GENERATED LINK */}
            {generatedLink && (
              <div style={styles.resultCard}>
                <div style={styles.resultTop}>
                  <div>
                    <div
                      style={
                        styles.resultTitle
                      }
                    >
                      Share Link
                    </div>

                    <div
                      style={
                        styles.resultSubtitle
                      }
                    >
                      Your secure link is ready
                    </div>
                  </div>

                  <div
                    style={
                      styles.liveBadge
                    }
                  >
                    Active
                  </div>
                </div>

                <div style={styles.linkBox}>
                  <span
                    style={styles.link}
                  >
                    {generatedLink}
                  </span>

                  <button
                    onClick={copyLink}
                    style={
                      styles.secondaryBtn
                    }
                  >
                    {copied
                      ? "Copied"
                      : "Copy"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text)",
    overflowX: "hidden",
    padding: "2rem 1.5rem 4rem",
  },

  container: {
    maxWidth: "760px",
    margin: "0 auto",
  },

  hero: {
    textAlign: "center",
    marginBottom: "1.75rem",
  },

  title: {
    fontSize: "clamp(2rem, 5vw, 3.5rem)",
    fontWeight: 800,
    letterSpacing: "-0.05em",
    lineHeight: 1,
  },

  subtitle: {
    marginTop: "0.85rem",
    color: "var(--muted)",
    fontSize: "1rem",
    lineHeight: 1.6,
    maxWidth: "560px",
    marginInline: "auto",
  },

  card: {
    borderRadius: "28px",

    padding: "1.5rem",

    background:
      "rgba(255,255,255,0.04)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    backdropFilter: "blur(16px)",
    WebkitBackdropFilter:
      "blur(16px)",

    boxShadow:
      "0 20px 60px rgba(0,0,0,0.25)",

    width: "100%",

    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  secretBox: {
    padding: "1.5rem",

    borderRadius: "24px",

    background: `
      radial-gradient(
        circle at top,
        rgba(37,99,235,0.22),
        rgba(255,255,255,0.02)
      )
    `,

    border:
      "1px solid rgba(59,130,246,0.22)",

    boxShadow:
      "0 20px 60px rgba(37,99,235,0.18)",
  },

  secretTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },

  secretBadge: {
    background:
      "rgba(59,130,246,0.14)",

    color: "#60a5fa",

    borderRadius: "999px",

    padding: "0.45rem 0.85rem",

    fontSize: "0.82rem",

    fontWeight: 700,
  },

  expiryBadge: {
    background:
      "rgba(168,85,247,0.14)",

    color: "#c084fc",

    borderRadius: "999px",

    padding: "0.45rem 0.85rem",

    fontSize: "0.82rem",

    fontWeight: 700,
  },

  secretPreview: {
    fontSize: "1rem",
    lineHeight: 1.8,
    color: "var(--text)",
    minHeight: "60px",
    wordBreak: "break-word",
  },

  controls: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  textarea: {
    minHeight: "140px",

    padding: "1rem",

    borderRadius: "18px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.03)",

    color: "var(--text)",

    resize: "vertical",

    outline: "none",

    fontSize: "0.95rem",

    lineHeight: 1.7,
  },

  input: {
    padding: "1rem",

    borderRadius: "16px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.03)",

    color: "var(--text)",

    outline: "none",

    fontSize: "0.95rem",
  },

  selectWrap: {
    display: "flex",
    flexDirection: "column",
    gap: "0.65rem",
  },

  label: {
    fontWeight: 600,
  },

  select: {
    padding: "1rem",

    borderRadius: "16px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.03)",

    color: "var(--text)",

    outline: "none",

    fontSize: "0.95rem",
  },

  primaryBtn: {
    background: "#2563eb",

    color: "#fff",

    border: "none",

    padding: "1rem 1.4rem",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: 700,

    fontSize: "0.95rem",

    boxShadow:
      "0 15px 40px rgba(37,99,235,0.35)",

    transition: "all 0.2s ease",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  resultCard: {
    padding: "1.25rem",

    borderRadius: "22px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.03)",

    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  resultTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },

  resultTitle: {
    fontWeight: 700,
    fontSize: "1rem",
  },

  resultSubtitle: {
    color: "var(--muted)",
    fontSize: "0.9rem",
    marginTop: "0.3rem",
  },

  liveBadge: {
    background:
      "rgba(34,197,94,0.14)",

    color: "#4ade80",

    borderRadius: "999px",

    padding: "0.45rem 0.85rem",

    fontSize: "0.82rem",

    fontWeight: 700,
  },

  linkBox: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
    alignItems: "center",
  },

  link: {
    flex: 1,

    minWidth: "220px",

    padding: "1rem",

    borderRadius: "14px",

    background:
      "rgba(255,255,255,0.03)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",

    color: "var(--muted)",
  },

  secondaryBtn: {
    minWidth: "120px",

    background:
      "rgba(255,255,255,0.04)",

    color: "var(--text)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    padding: "1rem 1.2rem",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: 700,

    backdropFilter: "blur(12px)",
  },
};