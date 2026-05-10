"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabase";
import PageLayout from "@/app/components/PageLayout";
import { useToast } from "@/app/context/ToastContext";

export default function RequestsPage() {
  const { showToast } = useToast();

  const [user, setUser] = useState<any>(null);

  const [email, setEmail] = useState("");
  const [title, setTitle] = useState("");
  const [request, setRequest] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const { data } = await supabase.auth.getUser();

    if (data.user) {
      setUser(data.user);

      if (data.user.email) {
        setEmail(data.user.email);
      }
    }
  };

  const submitRequest = async () => {
    if (!title || !request) {
      showToast("Please fill all fields", "error");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("app_requests")
      .insert({
        user_id: user?.id || null,
        email,
        title,
        request,
      });

    setLoading(false);

    if (error) {
      console.error(error);

      showToast(
        "Failed to submit request",
        "error"
      );

      return;
    }

    showToast(
      "Request submitted successfully",
      "success"
    );

    setTitle("");
    setRequest("");
  };

  return (
    <PageLayout>
      <main style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>
            Request an App
          </h1>

          <p style={styles.subtitle}>
            Tell us what tool or app you’d like
            added to SimpleStack.
          </p>

          {!user && (
            <input
              placeholder="Your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              style={styles.input}
            />
          )}

          <input
            placeholder="App title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            style={styles.input}
          />

          <textarea
            placeholder="Describe the app or tool..."
            value={request}
            onChange={(e) =>
              setRequest(e.target.value)
            }
            style={styles.textarea}
          />

          <button
            onClick={submitRequest}
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading
                ? styles.buttonDisabled
                : {}),
            }}
          >
            {loading
              ? "Submitting..."
              : "Submit Request"}
          </button>
        </div>
      </main>
    </PageLayout>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
  },

  card: {
    width: "100%",
    maxWidth: "700px",

    background: "var(--card)",
    border: "2px solid var(--border)",
    borderRadius: "12px",

    padding: "2rem",

    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  title: {
    fontSize: "2rem",
    fontWeight: "bold",
  },

  subtitle: {
    color: "var(--muted)",
    marginBottom: "1rem",
    lineHeight: 1.6,
  },

  input: {
    width: "100%",

    padding: "0.85rem",

    background: "var(--bg)",
    color: "var(--text)",

    border: "2px solid var(--border)",
    borderRadius: "8px",

    fontSize: "0.95rem",
  },

  textarea: {
    width: "100%",
    minHeight: "180px",

    padding: "1rem",

    background: "var(--bg)",
    color: "var(--text)",

    border: "2px solid var(--border)",
    borderRadius: "8px",

    resize: "vertical",

    fontSize: "0.95rem",
    lineHeight: 1.6,
  },

  button: {
    background: "#1d4ed8",
    color: "#fff",

    border: "none",
    borderRadius: "8px",

    padding: "0.9rem",

    fontWeight: "bold",
    cursor: "pointer",

    transition: "all 0.2s ease",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
};