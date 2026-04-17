"use client";

import { useEffect, useState } from "react";
import ToolHeader from "@/app/components/ToolHeader";

export default function Home() {
  const [number, setNumber] = useState<number | null>(null);
  const [length, setLength] = useState(6);

  // generate on load
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
    alert("Copied!");
  };

  const banners = [
    { name: "App One", url: "https://example.com/app1" },
    { name: "App Two", url: "https://example.com/app2" },
  ];

  return (
    <main style={styles.container}>
      <ToolHeader title="Time Tracker" />
      <h1 style={styles.title}>Random Number Generator</h1>

      {/* NUMBER DISPLAY */}
      <div style={styles.numberBox}>
        <span style={styles.number}>
          {number ?? "Loading..."}
        </span>
      </div>

      {/* CONTROLS */}
      <div style={styles.controls}>
        <label>Digits: {length}</label>

        <input
          type="range"
          min="4"
          max="8"
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
        />

        <div style={styles.buttonRow}>
          <button style={styles.primaryBtn} onClick={() => generateNumber()}>
            Generate New Number
          </button>

          <button style={styles.secondaryBtn} onClick={copyToClipboard}>
            Copy
          </button>
        </div>
      </div>

      {/* BANNERS */}
      <div style={styles.bannerSection}>
        {banners.map((b, i) => (
          <a key={i} href={b.url} style={styles.banner}>
            {b.name}
          </a>
        ))}
      </div>
    </main>
  );
}

const styles: any = {
  container: {
    padding: "2rem",
    textAlign: "center",
    background: "#fff",
    minHeight: "100vh",
    color: "#0a0a0a",
    fontFamily: "sans-serif",
  },

  title: {
    marginBottom: "2rem",
  },

  numberBox: {
    border: "2px solid #1d4ed8",
    padding: "2rem",
    borderRadius: "12px",
    marginBottom: "2rem",
  },

  number: {
    fontSize: "3rem",
    fontWeight: "bold",
    letterSpacing: "2px",
  },

  controls: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    alignItems: "center",
  },

  buttonRow: {
    display: "flex",
    gap: "1rem",
  },

  primaryBtn: {
    background: "#1d4ed8",
    color: "white",
    padding: "0.8rem 1.2rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  secondaryBtn: {
    background: "white",
    color: "#1d4ed8",
    border: "2px solid #1d4ed8",
    padding: "0.8rem 1.2rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  bannerSection: {
    marginTop: "3rem",
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },

  banner: {
    border: "2px solid #1d4ed8",
    padding: "1rem",
    borderRadius: "10px",
    textDecoration: "none",
    color: "#1d4ed8",
    fontWeight: "bold",
  },
};