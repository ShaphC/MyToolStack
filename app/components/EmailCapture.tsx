"use client";

import { useEffect, useState } from "react";

export default function EmailCapture() {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  // ⏱ Show after delay (always)
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (!email) {
      setStatus("Please enter an email");
      return;
    }

    if (!email.includes("@")) {
      setStatus("Invalid email");
      return;
    }

    const saved = JSON.parse(
      localStorage.getItem("email_list") || "[]"
    );

    if (saved.includes(email)) {
      setStatus("You're already on the list 👍");
      return;
    }

    const updated = [...saved, email];
    localStorage.setItem("email_list", JSON.stringify(updated));

    setStatus("You're in! Check your inbox soon 🚀");
    setEmail("");
  };

  if (!visible) return null;

  return (
    <div
        style={{
            ...styles.container,
            maxHeight: collapsed ? "60px" : "400px",
        }}
    >
      {collapsed ? (
        // 🔽 COLLAPSED STATE
        <div
          style={styles.collapsed}
          onClick={() => setCollapsed(false)}
        >
          Ready to stop repeating work?
        </div>
      ) : (
        <>
          {/* CLOSE BUTTON (collapses only) */}
          <button
            style={styles.close}
            onClick={() => setCollapsed(true)}
          >
            ✕
          </button>

          {/* CONTENT */}
          <div style={styles.content}>
            <h3 style={styles.title}>
              Ready to stop repeating the same work?
            </h3>

            <p style={styles.text}>
              Enter your email to receive a 5-day course on building your own internal tools.
            </p>

            <input
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <button onClick={handleSubmit} style={styles.button}>
              Send me the course
            </button>

            {status && <p style={styles.status}>{status}</p>}
          </div>
        </>
      )}
    </div>
  );
}

const styles: any = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "340px",
    background: "var(--card)",
    border: "2px solid var(--border)",
    borderRadius: "14px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    zIndex: 100,
    overflow: "hidden",
    transition: "all 0.3s ease",
  },

  collapsed: {
    height: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "1rem",
    cursor: "pointer",
    color: "var(--text)",
  },

  close: {
    position: "absolute",
    top: "10px",
    right: "12px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "1rem",
    color: "var(--text)",
  },

  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "1.8rem 1.2rem",
    textAlign: "center",
  },

  title: {
    fontSize: "1.3rem",
    fontWeight: "bold",
    marginBottom: "0.6rem",
    color: "var(--muted)",
  },

  text: {
    fontSize: "1rem",
    marginBottom: "1rem",
    color: "var(--muted)",
  },

  input: {
    width: "100%",
    padding: "0.7rem",
    background: "var(--card)",
    color: "var(--text)",
    border: "2px solid var(--border)",
    borderRadius: "8px",
    marginBottom: "0.7rem",
    fontSize: "1rem",
  },

  button: {
    width: "100%",
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    padding: "0.75rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },

  status: {
    marginTop: "0.6rem",
    fontSize: "0.9rem",
    color: "#000000",
  },
};