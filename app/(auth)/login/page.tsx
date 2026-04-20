"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/app/components/PageLayout";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("saved_email");
    if (saved) {
      setEmail(saved);
      setRemember(true);
    }
  }, []);

  const login = async () => {
    setErrorMsg("");
    setSuccessMsg("");

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
      return;
    }

    router.push("/dashboard");
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

              {/* 👁 INSIDE INPUT */}
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

            {/* DISABLED UNTIL READY TO UTILIZE */}
            {/* FORGOT PASSWORD */}
            <p
              onClick={() => router.push("/reset-password")}
              style={styles.forgot}
            >
              Forgot password?
            </p>

            {/* ERROR / SUCCESS */}
            {errorMsg && <p style={styles.error}>{errorMsg}</p>}
            {successMsg && <p style={styles.success}>{successMsg}</p>}

            {/* BUTTON */}
            <button
              onClick={login}
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
            >
              {loading ? <div style={styles.spinner}></div> : "Login"}
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

/* ---------- STYLES ---------- */

const styles: any = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg)",
    color: "var(--text)", 
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

  passwordContainer: {
    position: "relative",
    width: "100%",
  },

  // passwordInput: {
  //   width: "100%",
  //   padding: "0.75rem",
  //   paddingRight: "2.5rem",
  //   border: "2px solid #1d4ed8",
  //   borderRadius: "8px",
  // },

  eye: {
    position: "absolute",
    right: "10px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    fontSize: "1rem",
  },

  checkboxRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontSize: "0.9rem",
  },

  forgot: {
    fontSize: "0.85rem",
    color: "var(--text)",
    cursor: "pointer",
    textAlign: "right",
    marginTop: "-0.25rem",
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

  success: {
    color: "#16a34a",
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