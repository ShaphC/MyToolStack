"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/NavBar";

export default function Home() {
  const [number, setNumber] = useState<number | null>(null);
  const [length, setLength] = useState(6);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    generateNumber(6);
  }, []);

  const generateNumber = async (len = length) => {
    const res = await fetch(`/api/random?length=${len}`);
    const data = await res.json();

    setNumber(data.number);
    setLength(data.length);
  };

  const copyToClipboard = async () => {
    if (!number) return;

    await navigator.clipboard.writeText(String(number));

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
              Random Number Generator
            </h1>

            <p style={styles.subtitle}>
              Generate clean random numbers instantly.
            </p>
          </div>

          {/* MAIN CARD */}
          <div style={styles.card}>
            {/* NUMBER */}
            <div style={styles.numberBox}>
              <span style={styles.number}>
                {number ?? "Loading..."}
              </span>
            </div>

            {/* CONTROLS */}
            <div style={styles.controls}>
              <div style={styles.sliderTop}>
                <span style={styles.label}>
                  Number Length
                </span>

                <span style={styles.lengthBadge}>
                  {length} digits
                </span>
              </div>

              <input
                type="range"
                min="4"
                max="12"
                value={length}
                onChange={(e) =>
                  setLength(Number(e.target.value))
                }
                style={styles.slider}
              />

              <div style={styles.buttonRow}>
                <button
                  style={styles.primaryBtn}
                  onClick={() => generateNumber()}
                >
                  Generate Number
                </button>

                <button
                  style={styles.secondaryBtn}
                  onClick={copyToClipboard}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

const styles: any = {
container: {
  maxWidth: "680px",
  margin: "0 auto",
},

  page: {
  minHeight: "100vh",
  background: "var(--bg)",
  color: "var(--text)",
  overflowX: "hidden",

  // reduced top spacing
  padding: "2rem 1.5rem 4rem",
},

hero: {
  textAlign: "center",

  // MUCH smaller spacing
  marginBottom: "1.75rem",
},

title: {
  // smaller title
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

  background: "rgba(255,255,255,0.04)",

  border: "1px solid rgba(255,255,255,0.08)",

  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",

  boxShadow:
    "0 20px 60px rgba(0,0,0,0.25)",

  width: "100%",
},

numberBox: {
  // less vertical height
  padding: "2rem 1.5rem",

  borderRadius: "24px",

  // tighter spacing
  marginBottom: "1.5rem",

  background: `
    radial-gradient(
      circle at top,
      rgba(37,99,235,0.22),
      rgba(255,255,255,0.02)
    )
  `,

  border: "1px solid rgba(59,130,246,0.22)",

  boxShadow:
    "0 20px 60px rgba(37,99,235,0.18)",

  textAlign: "center",
},

number: {
  // slightly smaller number
  fontSize: "clamp(2.5rem, 8vw, 5rem)",

  fontWeight: 800,

  letterSpacing: "0.08em",

  background:
    "linear-gradient(135deg,#60a5fa,#a78bfa)",

  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
},

  controls: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  sliderTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  label: {
    fontWeight: 600,
  },

  lengthBadge: {
    background: "rgba(59,130,246,0.12)",

    color: "#60a5fa",

    borderRadius: "999px",

    padding: "0.45rem 0.85rem",

    fontSize: "0.85rem",

    fontWeight: 700,
  },

  slider: {
    width: "100%",
    cursor: "pointer",
  },

  buttonRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },

  primaryBtn: {
    flex: 1,

    minWidth: "220px",

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

  secondaryBtn: {
    minWidth: "140px",

    background: "rgba(255,255,255,0.04)",

    color: "var(--text)",

    border: "1px solid rgba(255,255,255,0.08)",

    padding: "1rem 1.4rem",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: 700,

    fontSize: "0.95rem",

    backdropFilter: "blur(12px)",

    transition: "all 0.2s ease",
  },
};