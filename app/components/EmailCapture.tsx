"use client";

import { useEffect, useState } from "react";
import Button from "./ui/Button";
import { supabase } from "@/app/lib/supabase";

export default function EmailCapture() {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    if (!email) {
      setStatus("Please enter an email");
      return;
    }

    if (!email.includes("@")) {
      setStatus("Invalid email");
      return;
    }

    try {
      setLoading(true);
      setStatus("");

      const { error } = await supabase
        .from("email_subscribers")
        .insert([
          {
            email: email.toLowerCase(),
            source: "homepage_popup",
          },
        ]);

      if (error) {
        if (
          error.message.includes("duplicate") ||
          error.code === "23505"
        ) {
          setStatus("You're already subscribed 👍");
        } else {
          console.error(error);
          setStatus("Something went wrong");
        }

        return;
      }

      setStatus(
        "You're in! Check your inbox soon 🚀"
      );

      setEmail("");

      // Optional future welcome email trigger
      await fetch("/api/send-welcome", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });
    } catch (err) {
      console.error(err);
      setStatus("Something went wrong");
    } finally {
      setLoading(false);
    }
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
        <div
          style={styles.collapsed}
          onClick={() => setCollapsed(false)}
        >
          Ready to stop repeating work?
        </div>
      ) : (
        <>
          <button
            style={styles.close}
            onClick={() => setCollapsed(true)}
          >
            ✕
          </button>

          <div style={styles.content}>
            <h3 style={styles.title}>
              Ready to stop repeating the same work?
            </h3>

            <p style={styles.text}>
              Enter your email to receive a 5-day
              course on building your own internal
              tools.
            </p>

            <input
              placeholder="Your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={styles.input}
            />

            <Button
              onClick={handleSubmit}
              disabled={loading}
              style={styles.button}
            >
              {loading
                ? "Joining..."
                : "Send me the course"}
            </Button>

            {status && (
              <p style={styles.status}>
                {status}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles: any = {
  container: {
    position: "fixed",
    bottom: "24px",
    right: "24px",

    width: "380px",
    maxWidth: "calc(100vw - 32px)",

    background: "rgba(255,255,255,0.04)",

    border: "1px solid rgba(255,255,255,0.08)",

    borderRadius: "24px",

    backdropFilter: "blur(18px)",
    WebkitBackdropFilter: "blur(18px)",

    boxShadow:
      "0 20px 60px rgba(0,0,0,0.35)",

    zIndex: 100,

    overflow: "hidden",

    transition: "all 0.3s ease",
  },

  collapsed: {
    height: "64px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontWeight: 700,
    fontSize: "0.95rem",

    cursor: "pointer",

    color: "var(--text)",

    background:
      "linear-gradient(135deg, rgba(37,99,235,0.08), rgba(139,92,246,0.08))",
  },

  close: {
    position: "absolute",

    top: "14px",
    right: "16px",

    border: "none",
    background: "transparent",

    cursor: "pointer",

    fontSize: "1rem",

    color: "var(--muted)",

    transition: "all 0.2s ease",
  },

  content: {
    display: "flex",
    flexDirection: "column",

    alignItems: "center",

    padding: "2rem 1.5rem",

    textAlign: "center",
  },

  title: {
    fontSize: "1.4rem",

    fontWeight: 800,

    letterSpacing: "-0.03em",

    marginBottom: "0.75rem",

    color: "var(--text)",
  },

  text: {
    fontSize: "0.95rem",

    lineHeight: 1.7,

    color: "var(--muted)",

    marginBottom: "1.25rem",

    maxWidth: "280px",
  },

  input: {
    width: "100%",

    padding: "0.95rem 1rem",

    borderRadius: "14px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.03)",

    color: "var(--text)",

    fontSize: "0.95rem",

    outline: "none",

    marginBottom: "0.9rem",

    transition: "all 0.2s ease",
  },

  button: {
    width: "100%",

    padding: "0.95rem",

    borderRadius: "14px",

    border: "none",

    background:
      "linear-gradient(135deg,#2563eb,#3b82f6)",

    color: "#fff",

    fontWeight: 700,

    cursor: "pointer",

    fontSize: "0.95rem",

    boxShadow:
      "0 10px 30px rgba(37,99,235,0.25)",
  },

  status: {
    marginTop: "0.9rem",

    fontSize: "0.9rem",

    color: "#60a5fa",

    fontWeight: 500,
  },
};