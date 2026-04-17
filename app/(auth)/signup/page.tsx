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

  const signup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "https://simplestack.vercel.app/auth/callback",
      },
    });

    if (!error) {
      alert("Check your email to confirm your account.");
    }
  };

  return (
    <PageLayout>
      <div style={styles.page}>
        <main style={styles.container}>
          <div style={styles.card}>
            <h1 style={styles.title}>Create account</h1>
            <p style={styles.subtitle}>Start using your tools instantly</p>

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

            <button onClick={signup} style={styles.button}>
              Sign up
            </button>

            <p style={styles.switchText}>
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
    textAlign: "center",
  },

  title: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#000000",
  },

  subtitle: {
    color: "#4b5563",
    marginBottom: "1.5rem",
  },

  input: {
    width: "100%",
    padding: "0.6rem",
    marginBottom: "0.75rem",
    border: "2px solid #1d4ed8",
    borderRadius: "6px",
    outline: "none",
    color: "#000000",
  },

  button: {
    width: "100%",
    background: "#1d4ed8",
    color: "white",
    padding: "0.7rem",
    border: "none",
    borderRadius: "6px",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "0.5rem",
  },

  switchText: {
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