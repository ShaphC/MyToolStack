"use client";

import { useState } from "react";
import ToolHeader from "@/app/components/ToolHeader";

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

    const data = await res.json();

    setLoading(false);

    // if (data.id) {
    //   const link = `${window.location.origin}/secret/${data.id}`;
    //   setGeneratedLink(link);
    // }

    const fakeId = Math.random().toString(36).substring(2, 10);

    const link = `${window.location.origin}/secret/${fakeId}`;

    setGeneratedLink(link);
  };

  return (
    <main style={styles.container}>
        <ToolHeader title="Time Tracker" />

      <h1 style={styles.title}>🔐 Secure Link Generator</h1>

      <div style={styles.card}>
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

        <button onClick={generateLink} style={styles.button}>
          {loading ? "Generating..." : "Generate Secure Link"}
        </button>

        {generatedLink && (
          <div style={styles.result}>
            <p>Share this link:</p>

            <div style={styles.linkBox}>
              <span>{generatedLink}</span>
              <button
                onClick={() => navigator.clipboard.writeText(generatedLink)}
                style={styles.copy}
              >
                Copy
              </button>
            </div>
          </div>
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
  },

  title: {
    textAlign: "center",
    marginBottom: "2rem",
    color: "var(--border)",
  },

  card: {
    maxWidth: "500px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    border: "2px solid var(--border)",
    borderRadius: "12px",
    padding: "1.5rem",
  },

  textarea: {
    minHeight: "120px",
    padding: "0.7rem",
    border: "2px solid var(--border)",
    borderRadius: "6px",
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
    padding: "0.7rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  result: {
    marginTop: "1rem",
  },

  linkBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "2px solid var(--border)",
    borderRadius: "6px",
    padding: "0.5rem",
  },

  copy: {
    background: "var(--border)",
    color: "#fff",
    border: "none",
    padding: "0.3rem 0.6rem",
    borderRadius: "4px",
    cursor: "pointer",
  },
};