"use client";

import { useState } from "react";
import { supabase } from "@/app/lib/supabase";
import PageLayout from "@/app/components/PageLayout";
import { useToast } from "@/app/context/ToastContext";

export default function ContactPage() {
  const { showToast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!email || !message) {
      showToast("Email and message required", "error");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      message,
    });

    setLoading(false);

    if (error) {
      showToast("Failed to send message", "error");
      return;
    }

    setName("");
    setEmail("");
    setMessage("");

    showToast("Message sent successfully!", "success");
  };

  return (
    <PageLayout>
      <main style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Contact Me</h1>
          <p style={styles.subtitle}>
            Send a message and I’ll get back to you.
          </p>

          <input
            placeholder="Name (optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <textarea
            placeholder="Your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={styles.textarea}
          />

          <button
            onClick={sendMessage}
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Sending..." : "Send Message"}
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
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    background: "var(--bg)",
    color: "var(--text)",
  },

  card: {
    width: "100%",
    maxWidth: "500px",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    padding: "2rem",
    borderRadius: "12px",
    border: "2px solid var(--border)",
    background: "var(--card)",
  },

  title: {
    textAlign: "center",
    fontSize: "1.6rem",
    fontWeight: "bold",
  },

  subtitle: {
    textAlign: "center",
    color: "var(--muted)",
    marginBottom: "1rem",
  },

  input: {
    padding: "0.75rem",
    borderRadius: "8px",
    border: "2px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
  },

  textarea: {
    minHeight: "120px",
    padding: "0.75rem",
    borderRadius: "8px",
    border: "2px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
    resize: "vertical",
  },

  button: {
    marginTop: "0.5rem",
    padding: "0.75rem",
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};