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

  // 🔐 CHECK TOKEN SESSION
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

    router.push("/dashboard");
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") updatePassword();
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

              {/* ✅ MATCHES LOGIN INPUT */}
              <div style={styles.passwordContainer}>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                  style={styles.input}
                />

                {/* 👁 SAME ICON + HOLD */}
                <div
                  style={styles.eye}
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="20"
                    viewBox="0 0 24 24"
                    width="20"
                    fill="#6b7280"
                  >
                    <path d="M12 6c-5 0-9.27 3.11-11 6 1.73 2.89 6 6 11 6s9.27-3.11 
                    11-6c-1.73-2.89-6-6-11-6zm0 10c-2.21 
                    0-4-1.79-4-4s1.79-4 4-4 
                    4 1.79 4 4-1.79 4-4 
                    4zm0-6.5A2.5 2.5 0 1 0 12 
                    14a2.5 2.5 0 0 0 0-5z" />
                  </svg>
                </div>
              </div>

              {errorMsg && <p style={styles.error}>{errorMsg}</p>}

              <button
                onClick={updatePassword}
                disabled={loading}
                style={{
                  ...styles.button,
                  ...(loading ? styles.buttonDisabled : {}),
                }}
              >
                {loading ? <div style={styles.spinner}></div> : "Update Password"}
              </button>
            </>
          )}
        </div>
      </main>
    </PageLayout>
  );
}

/* ---------- STYLES ---------- */

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
    color: "var(--muted)",
    marginBottom: "1rem",
  },

  input: {
    width: "100%",
    padding: "0.75rem",
    paddingRight: "2.5rem", // ✅ CRITICAL for icon spacing
    background: "var(--card)",
    color: "var(--text)",
    border: "2px solid var(--border)",
    borderRadius: "8px",
  },

  passwordContainer: {
    position: "relative",
    width: "100%",
  },

  eye: {
    position: "absolute",
    right: "10px",
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
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "0.5rem",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  spinner: {
    width: "18px",
    height: "18px",
    border: "3px solid #fff",
    borderTop: "3px solid transparent",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  error: {
    color: "#dc2626",
    fontSize: "0.85rem",
    textAlign: "center",
  },
};