"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/app/components/PageLayout";

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);

  const signup = async () => {
    setErrorMsg("");

    if (!email || !password) {
      triggerError("Please fill all fields");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      triggerError(error.message);
      return;
    }

    alert("Check your email to confirm your account.");
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") signup();
  };

  return (
    <PageLayout>
      <div style={styles.page}>
        <main style={styles.container}>
          <div
            style={{
              ...styles.card,
              ...(shake ? styles.shake : {}),
            }}
          >
            <h1 style={styles.title}>Create Account</h1>
            <p style={styles.subtitle}>
              Start using your tools instantly
            </p>

            {/* EMAIL */}
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.input}
            />

            {/* PASSWORD WITH PROPER EYE */}
            <div style={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={styles.input}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={styles.iconBtn}
              >
                <div
                  style={styles.eye}
                  onMouseDown={() => setShowPassword(true)}
                  onMouseUp={() => setShowPassword(false)}
                  onMouseLeave={() => setShowPassword(false)}
                  onTouchStart={() => setShowPassword(true)}
                  onTouchEnd={() => setShowPassword(false)}
                >
                  {/* 👁 SVG ICON */}
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
              </button>
            </div>

            {/* ERROR */}
            {errorMsg && (
              <p style={styles.error}>{errorMsg}</p>
            )}

            {/* BUTTON */}
            <button
              onClick={signup}
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
            >
              {loading ? (
                <div style={styles.spinner}></div>
              ) : (
                "Sign Up"
              )}
            </button>

            <p style={styles.bottomText}>
              Already have an account?{" "}
              <Link href="/login" style={styles.link}>
                Login
              </Link>
            </p>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}

/* ---------- STYLES ---------- */

const styles: any = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
  },

  container: {
    background: "var(--bg)",
    color: "var(--text)",
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
    fontSize: "1.8rem",
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
    background: "var(--card)",
    color: "var(--text)",
    border: "2px solid var(--border)",
    borderRadius: "8px",
  },

  inputWrapper: {
    position: "relative",
    width: "100%",
  },

  // inputWithIcon: {
  //   width: "100%",
  //   padding: "0.75rem",
  //   paddingRight: "2.8rem",
  //   border: "2px solid #1d4ed8",
  //   borderRadius: "8px",
  // },

  iconBtn: {
    position: "absolute",
    right: "8px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
  },

  button: {
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    padding: "0.75rem",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "0.5rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
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

  bottomText: {
    textAlign: "center",
    marginTop: "1rem",
  },

  link: {
    color: "#1d4ed8",
    fontWeight: "bold",
    textDecoration: "none",
  },

  shake: {
    animation: "shake 0.4s",
  },
};