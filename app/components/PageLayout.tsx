"use client";

import Navbar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={styles.page}>
      <Navbar />

      <main style={styles.main}>
        <div style={styles.container}>
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "sans-serif",
  },

  main: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    padding: "2rem 1rem",
  },

  container: {
    width: "100%",
    maxWidth: "1100px", // 🔥 centered layout
    background: "var(--bg)",
    color: "var(--text)",
  },
};