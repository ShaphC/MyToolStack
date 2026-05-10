"use client";

import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/app/components/PageLayout";
import { useToast } from "@/app/context/ToastContext";

/* ---------------- WRAPPER (fixes Vercel prerender error) ---------------- */

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

/* ---------------- MAIN LOGIN ---------------- */

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams.get("redirect") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [shake, setShake] = useState(false);

  const { showToast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem("saved_email");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const login = async () => {
    setErrorMsg("");

    if (!email || !password) {
      triggerError("Please fill all fields");
      return;
    }

    setLoading(true);

    if (remember) {
      localStorage.setItem("saved_email", email);
    } else {
      localStorage.removeItem("saved_email");
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      triggerError("Wrong email or password");
      showToast("Wrong email or password", "error");
      return;
    }

    showToast("Welcome back!", "success");

    router.push(redirect);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") login();
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
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>Login to access your tools</p>

            {/* EMAIL */}
            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
              style={styles.input}
            />

            {/* REMEMBER */}
            <label style={styles.checkboxRow}>
              <input
                type="checkbox"
                checked={remember}
                onChange={() => setRemember(!remember)}
              />
              Remember my email
            </label>

            {/* PASSWORD */}
            <div style={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                style={styles.input}
              />

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

            {/* ERROR */}
            {errorMsg && <p style={styles.error}>{errorMsg}</p>}

            {/* BUTTON */}
            <button
              onClick={login}
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <p style={styles.bottomText}>
              Don’t have an account?{" "}
              <Link href="/signup" style={styles.link}>
                Sign up
              </Link>
            </p>
          </div>
        </main>
      </div>
    </PageLayout>
  );
}

/* ---------------- STYLES ---------------- */

const styles: any = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg)",
    color: "var(--text)",
  },

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

  passwordContainer: {
    position: "relative",
  },

  eye: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
  },

  button: {
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    padding: "0.75rem",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
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
  },

  shake: {
    animation: "shake 0.4s",
  },
};