"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import PageLayout from "@/app/components/PageLayout";

export default function UpdatePassword() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [validSession, setValidSession] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔐 CHECK TOKEN SESSION (comes from email link)
  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session) {
        setValidSession(true);
      } else {
        setErrorMsg("Invalid or expired reset link.");
      }
    };

    checkSession();
  }, []);

  // 🔁 UPDATE PASSWORD
  const updatePassword = async () => {
    if (!password) {
      setErrorMsg("Password is required");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.updateUser({
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // ✅ AUTO LOGIN SUCCESS → REDIRECT
    router.push("/dashboard");
  };

  return (
    <PageLayout>
      <main style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Set New Password</h1>

          {!validSession ? (
            <p style={styles.error}>{errorMsg}</p>
          ) : (
            <>
              <p style={styles.subtitle}>
                Enter your new password below
              </p>

              <div style={styles.passwordWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  onChange={(e) => setPassword(e.target.value)}
                  style={styles.input}
                />

                <span
                  style={styles.eye}
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                >
                  👁️
                </span>
              </div>

              {errorMsg && <p style={styles.error}>{errorMsg}</p>}

              <button
                onClick={updatePassword}
                disabled={loading}
                style={{
                  ...styles.button,
                  opacity: loading ? 0.6 : 1,
                }}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </>
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
    paddingRight: "2.8rem",
    background: "var(--card)",
    color: "var(--text)",
    border: "2px solid var(--border)",
    borderRadius: "8px",
  },

  passwordWrapper: {
    position: "relative",
  },

  eye: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },

  button: {
    background: "#1d4ed8",
    color: "#fff",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },

  error: {
    color: "red",
    fontSize: "0.9rem",
    textAlign: "center",
  },
};