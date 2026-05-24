"use client";

import { useRouter } from "next/navigation";

import Navbar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export default function UpgradePage() {
  const router = useRouter();

  const handleCheckout = () => {
    alert("Stripe checkout will go here");
  };

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <div style={styles.heroGlow} />

        <div style={styles.container}>
          <div style={styles.badge}>
            SIMPLESTACK PRO
          </div>

          <h1 style={styles.title}>
            Upgrade your workflow.
          </h1>

          <p style={styles.subtitle}>
            Get full access to every premium tool,
            future releases, and a faster way to
            manage your work.
          </p>

          <div style={styles.card}>
            <div style={styles.cardGlow} />

            <div style={styles.proBadge}>
              MOST POPULAR
            </div>

            <h2 style={styles.planTitle}>
              Pro Plan
            </h2>

            <div style={styles.priceWrap}>
              <span style={styles.price}>
                $19.99
              </span>

              <span style={styles.priceSubtext}>
                per month
              </span>
            </div>

            <div style={styles.features}>
              <div style={styles.featureItem}>
                ✔ Unlimited tools
              </div>

              <div style={styles.featureItem}>
                ✔ Access anywhere
              </div>

              <div style={styles.featureItem}>
                ✔ Future premium features
              </div>

              <div style={styles.featureItem}>
                ✔ Priority updates
              </div>
            </div>

            <button
              onClick={handleCheckout}
              style={styles.button}
            >
              Continue to Checkout
            </button>

            <p style={styles.note}>
              Cancel anytime. No long-term commitment.
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            style={styles.back}
          >
            ← Back to Home
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}

const styles: any = {
  page: {
    position: "relative",

    minHeight: "100vh",

    background: "var(--bg)",

    color: "var(--text)",

    fontFamily: "sans-serif",

    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    overflow: "hidden",

    padding: "7rem 1.5rem",
  },

  heroGlow: {
    position: "absolute",

    inset: 0,

    background: `
      radial-gradient(circle at top, rgba(59,130,246,0.20), transparent 35%),
      radial-gradient(circle at bottom right, rgba(139,92,246,0.14), transparent 35%)
    `,

    pointerEvents: "none",
  },

  container: {
    position: "relative",

    width: "100%",

    maxWidth: "560px",

    textAlign: "center",

    zIndex: 1,
  },

  badge: {
    display: "inline-flex",

    alignItems: "center",

    padding: "0.55rem 1rem",

    borderRadius: "999px",

    background: "rgba(37,99,235,0.12)",

    border: "1px solid rgba(59,130,246,0.25)",

    color: "#60a5fa",

    fontWeight: 700,

    fontSize: "0.82rem",

    letterSpacing: "0.04em",

    backdropFilter: "blur(12px)",
  },

  title: {
    marginTop: "1.5rem",

    fontSize: "clamp(3rem, 8vw, 4.5rem)",

    fontWeight: 800,

    lineHeight: 1,

    letterSpacing: "-0.06em",
  },

  subtitle: {
    marginTop: "1.5rem",

    color: "var(--muted)",

    lineHeight: 1.8,

    fontSize: "1.05rem",

    maxWidth: "680px",

    marginInline: "auto",
  },

  card: {
    position: "relative",

    overflow: "hidden",

    marginTop: "3rem",

    padding: "2.75rem",

    borderRadius: "32px",

    background: `
      linear-gradient(
        180deg,
        rgba(37,99,235,0.12),
        rgba(255,255,255,0.04)
      )
    `,

    border:
      "1px solid rgba(59,130,246,0.25)",

    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",

    boxShadow: `
      0 20px 60px rgba(37,99,235,0.18),
      inset 0 1px 0 rgba(255,255,255,0.06)
    `,
  },

  cardGlow: {
    position: "absolute",

    top: "-80px",
    right: "-80px",

    width: "180px",
    height: "180px",

    background:
      "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)",

    pointerEvents: "none",
  },

  proBadge: {
    alignSelf: "center",

    display: "inline-flex",

    padding: "0.45rem 0.8rem",

    borderRadius: "999px",

    background: "rgba(37,99,235,0.18)",

    border: "1px solid rgba(59,130,246,0.3)",

    color: "#60a5fa",

    fontSize: "0.75rem",

    fontWeight: 800,

    letterSpacing: "0.05em",

    marginBottom: "1.5rem",
  },

  planTitle: {
    fontSize: "1.7rem",

    fontWeight: 700,

    letterSpacing: "-0.03em",

    marginBottom: "1.5rem",
  },

  priceWrap: {
    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    marginBottom: "2rem",
  },

  price: {
    fontSize: "4rem",

    fontWeight: 800,

    lineHeight: 1,

    letterSpacing: "-0.06em",
  },

  priceSubtext: {
    marginTop: "0.75rem",

    color: "var(--muted)",

    fontSize: "0.95rem",
  },

  features: {
    display: "flex",

    flexDirection: "column",

    gap: "1rem",

    marginBottom: "2.5rem",

    textAlign: "left",
  },

  featureItem: {
    padding: "1rem 1.1rem",

    borderRadius: "14px",

    background: "rgba(255,255,255,0.03)",

    border:
      "1px solid rgba(255,255,255,0.06)",

    color: "var(--text)",

    lineHeight: 1.6,
  },

  button: {
    width: "100%",

    background: "#2563eb",

    color: "#fff",

    padding: "1rem 1.25rem",

    border: "none",

    borderRadius: "14px",

    fontWeight: 700,

    fontSize: "1rem",

    cursor: "pointer",

    boxShadow:
      "0 12px 40px rgba(37,99,235,0.35)",

    transition: "all 0.2s ease",
  },

  note: {
    marginTop: "1.25rem",

    color: "var(--muted)",

    fontSize: "0.9rem",
  },

  back: {
    marginTop: "2rem",

    background: "transparent",

    border: "none",

    color: "#60a5fa",

    cursor: "pointer",

    fontWeight: 600,

    fontSize: "0.95rem",
  },
};