"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageLayout from "@/app/components/PageLayout";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (!error) router.push("/dashboard");
  };

  return (
    <>
    <PageLayout>
      <div style={styles.page}>
        <main style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>Welcome Back</h1>
            <p style={styles.subtitle}>
              Login to access your tools
            </p>

            <input
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <button onClick={login} style={styles.button}>
              Login
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
    </>
  );
}

const styles: any = {
  container: {
    flex: 1,
    width: "100%",
    background: "#ffffff",
    color: "#000000",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "380px",
    padding: "2rem",
    border: "2px solid #1d4ed8",
    borderRadius: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "0.25rem",
    textAlign: "center",
    color: "#000000",
  },

  subtitle: {
    textAlign: "center",
    color: "#4b5563",
    marginBottom: "1rem",
  },

  input: {
    padding: "0.75rem",
    border: "2px solid #1d4ed8",
    borderRadius: "8px",
    fontSize: "1rem",
    outline: "none",
    color: "#000000",
  },

  button: {
    background: "#1d4ed8",
    color: "white",
    border: "none",
    padding: "0.75rem",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "0.5rem",
  },

  bottomText: {
    textAlign: "center",
    marginTop: "1rem",
    fontSize: "0.9rem",
    color: "#000000",
  },

  link: {
    color: "#1d4ed8",
    fontWeight: "bold",
    textDecoration: "none",
  },

  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#ffffff",
  },
};