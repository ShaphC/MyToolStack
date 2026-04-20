"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import PageLayout from "@/app/components/PageLayout";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {
    if (!email) return;

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://simplestack.vercel.app//update-password",
    });

    setLoading(false);

    if (!error) setSent(true);
  };

  return (
    <PageLayout>
      <main style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Reset Password</h1>

          {!sent ? (
            <>
              <p style={styles.subtitle}>
                Enter your email and we’ll send you a reset link
              </p>

              <input
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
              />

              <button
                onClick={resetPassword}
                disabled={loading}
                style={{
                  ...styles.button,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </>
          ) : (
            <p style={styles.success}>
              Check your email for the reset link.
            </p>
          )}
        </div>
      </main>
    </PageLayout>
  );
}

const styles: any = {
  container: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: "380px",
    padding: "2rem",
    background: "var(--card)",
    border: "2px solid var(--border)",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  title: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "var(--mute)",
    marginBottom: "1rem",
  },

  input: {
    padding: "0.75rem",
    background: "var(--card)",
    color: "var(--text)",
    border: "2px solid var(--border)",
    borderRadius: "8px",
  },

  button: {
    background: "#1d4ed8",
    color: "#fff",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },

  success: {
    textAlign: "center",
    color: "green",
  },
};