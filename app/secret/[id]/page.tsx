"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

export default function ViewSecret() {
  const { id } = useParams();

  const [password, setPassword] = useState("");
  const [content, setContent] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const revealSecret = async () => {
    setLoading(true);
    setError("");

    const res = await fetch("/api/get-secret", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, password }),
    });

    const data = await res.json();

    setLoading(false);

    if (data.error) {
      setError(data.error);
      return;
    }

    setContent(data.content);
    setRevealed(true);
  };

  return (
    <main style={styles.container}>
      <h1 style={styles.title}>🔐 Secure Message</h1>

      <div style={styles.card}>
        {!revealed ? (
          <>
            <div style={styles.mask}>••••••••••••••</div>

            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <button onClick={revealSecret} style={styles.button}>
              {loading ? "Unlocking..." : "Reveal"}
            </button>

            {error && <p style={styles.error}>{error}</p>}
          </>
        ) : (
          <>
            <div style={styles.secretBox}>
              {content}
            </div>

            <button
              onClick={() => setRevealed(false)}
              style={styles.secondary}
            >
              Hide
            </button>
          </>
        )}
      </div>
    </main>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
    background: "#ffffff",
    color: "#000000",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  title: {
    marginBottom: "2rem",
    color: "var(--border)",
  },

  card: {
    width: "100%",
    maxWidth: "400px",
    border: "2px solid var(--border)",
    borderRadius: "12px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  mask: {
    fontSize: "1.5rem",
    letterSpacing: "3px",
    textAlign: "center",
    color: "#888",
  },

  input: {
    padding: "0.6rem",
    border: "2px solid var(--border)",
    borderRadius: "6px",
  },

  button: {
    background: "var(--border)",
    color: "#fff",
    border: "none",
    padding: "0.6rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  secondary: {
    background: "#eee",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
  },

  secretBox: {
    border: "2px solid var(--border)",
    padding: "1rem",
    borderRadius: "6px",
    wordBreak: "break-word",
  },

  error: {
    color: "red",
    fontSize: "0.9rem",
  },
};