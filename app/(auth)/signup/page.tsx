"use client";

import { useState } from "react";
import PageLayout from "@/app/components/PageLayout";

export default function Signup() {
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");

  const [loading, setLoading] = useState(false);

  const submitApplication = async () => {
    if (!name || !email || !reason) return;

    setLoading(true);

    try {
      await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          reason,
        }),
      });

      const emailRes = await fetch("/api/send-application-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
          reason,
        }),
      });

      // const emailData = await emailRes.json();

      // console.log("EMAIL RESPONSE:", emailData);

      if (!emailRes.ok) {

        throw new Error(emailData.error || "Email failed");

      }

      setStep(1);
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  return (
    <PageLayout>
      <main style={styles.page}>
        <div style={styles.glow} />

        <div style={styles.container}>
          <div style={styles.card}>
            {step === 0 && (
              <>
                <div style={styles.hero}>
                  <div style={styles.badge}>
                    Early Access
                  </div>

                  <h1 style={styles.title}>
                    Join the Waitlist
                  </h1>

                  <p style={styles.subtitle}>
                    We're accepting a small number
                    of users while the platform
                    evolves.
                  </p>
                </div>

                <div style={styles.form}>
                  <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    style={styles.input}
                  />

                  <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    style={styles.input}
                  />

                  <textarea
                    placeholder="Why would you like access?"
                    value={reason}
                    onChange={(e) =>
                      setReason(e.target.value)
                    }
                    style={styles.textarea}
                  />

                  <button
                    onClick={submitApplication}
                    disabled={loading}
                    style={styles.primaryBtn}
                  >
                    {loading
                      ? "Submitting..."
                      : "Submit Application"}
                  </button>
                </div>
              </>
            )}

            {step === 1 && (
              <div style={styles.slide}>
                <h2 style={styles.slideTitle}>
                  Thank You
                </h2>

                <p style={styles.slideText}>
                  Thank you for your interest in
                  this application.
                </p>

                <button
                  style={styles.primaryBtn}
                  onClick={() => setStep(2)}
                >
                  Next
                </button>
              </div>
            )}

            {step === 2 && (
              <div style={styles.slide}>
                <h2 style={styles.slideTitle}>
                  Small & Focused
                </h2>

                <p style={styles.slideText}>
                  We're intentionally keeping the
                  user base small so we can work
                  closely with early users and
                  improve the platform based on
                  real feedback.
                </p>

                <div style={styles.buttonRow}>
                  <button
                    style={styles.secondaryBtn}
                    onClick={() => setStep(1)}
                  >
                    Back
                  </button>

                  <button
                    style={styles.primaryBtn}
                    onClick={() => setStep(3)}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div style={styles.slide}>
                <h2 style={styles.slideTitle}>
                  What's Next?
                </h2>

                <p style={styles.slideText}>
                  If accepted, you'll receive an
                  email invitation with
                  instructions to create your
                  account.
                </p>

                <div style={styles.buttonRow}>
                  <button
                    style={styles.secondaryBtn}
                    onClick={() => setStep(2)}
                  >
                    Back
                  </button>

                  <button
                    style={styles.primaryBtn}
                    onClick={() =>
                      (window.location.href = "/")
                    }
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            <div style={styles.dots}>
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    ...styles.dot,
                    ...(step === i
                      ? styles.activeDot
                      : {}),
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    padding: "7rem 1.5rem 4rem",
    position: "relative",
  },

  glow: {
    position: "absolute",
    inset: 0,

    background: `
      radial-gradient(
        circle at top left,
        rgba(37,99,235,0.18),
        transparent 35%
      ),

      radial-gradient(
        circle at bottom right,
        rgba(139,92,246,0.18),
        transparent 35%
      )
    `,
  },

  container: {
    maxWidth: "700px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },

  card: {
    padding: "2rem",

    borderRadius: "28px",

    background:
      "rgba(255,255,255,0.04)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    backdropFilter: "blur(18px)",

    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  hero: {
    textAlign: "center",
  },

  badge: {
    display: "inline-block",

    padding: "0.5rem 1rem",

    borderRadius: "999px",

    background:
      "rgba(37,99,235,0.12)",

    color: "#60a5fa",

    marginBottom: "1rem",
  },

  title: {
    fontSize: "3rem",
    fontWeight: 800,
  },

  subtitle: {
    marginTop: "1rem",
    color: "var(--muted)",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  input: {
    padding: "1rem",

    borderRadius: "16px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.03)",

    color: "var(--text)",
  },

  textarea: {
    minHeight: "140px",

    padding: "1rem",

    borderRadius: "16px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.03)",

    color: "var(--text)",

    resize: "vertical",
  },

  primaryBtn: {
    padding: "1rem",

    borderRadius: "14px",

    border: "none",

    background: "#2563eb",

    color: "#fff",

    fontWeight: 700,

    cursor: "pointer",
  },

  secondaryBtn: {
    padding: "1rem",

    borderRadius: "14px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.04)",

    color: "var(--text)",

    cursor: "pointer",
  },

  slide: {
    textAlign: "center",

    padding: "2rem 1rem",

    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  slideTitle: {
    fontSize: "2rem",
    fontWeight: 800,
  },

  slideText: {
    color: "var(--muted)",
    lineHeight: 1.8,
  },

  buttonRow: {
    display: "flex",
    gap: "1rem",
    justifyContent: "center",
  },

  dots: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5rem",
  },

  dot: {
    width: "8px",
    height: "8px",
    borderRadius: "999px",
    background: "#6b7280",
    transition: "all 0.25s ease",
  },

  activeDot: {
    width: "24px",
    background: "#2563eb",
  },
};