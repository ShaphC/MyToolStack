"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export default function UpgradePage() {
  const router = useRouter();

  const handleCheckout = () => {
    // 🚧 For now just simulate
    alert("Stripe checkout will go here");

    // later:
    // router.push("/api/checkout-session")
  };

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>Upgrade to Pro</h1>
          <p style={styles.subtitle}>
            Unlock full access and build faster
          </p>

          <div style={styles.card}>
            <h2>Pro Plan</h2>
            <p style={styles.price}>$49.99/month</p>

            <div style={styles.features}>
              <div>✔ Unlimited tools</div>
              <div>✔ Access anywhere</div>
              <div>✔ Future premium features</div>
              <div>✔ Priority updates</div>
            </div>

            <button onClick={handleCheckout} style={styles.button}>
              Continue to Checkout
            </button>
          </div>

          <button
            onClick={() => router.push("/")}
            style={styles.back}
          >
            ← Back
          </button>
        </div>
      </main>

      <Footer />
    </>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "#ffffff",
    color: "#000000",
    fontFamily: "sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    width: "100%",
    maxWidth: "500px",
    textAlign: "center",
    padding: "2rem",
  },

  title: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
  },

  subtitle: {
    color: "#6b7280",
    marginBottom: "2rem",
  },

  card: {
    border: "2px solid #1d4ed8",
    borderRadius: "16px",
    padding: "2rem",
    marginBottom: "2rem",
  },

  price: {
    fontSize: "2rem",
    fontWeight: "bold",
    margin: "1rem 0",
  },

  features: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    marginBottom: "2rem",
  },

  button: {
    background: "#1d4ed8",
    color: "#fff",
    padding: "0.9rem",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "100%",
  },

  back: {
    background: "transparent",
    border: "none",
    color: "#1d4ed8",
    cursor: "pointer",
  },
};