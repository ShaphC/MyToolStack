"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav style={styles.nav}>
      {/* LOGO */}
      <div style={styles.logo} onClick={() => router.push("/")}>
        ⚡ ToolStack
      </div>

      {/* LINKS */}
      <div style={styles.navLinks}>
        <button onClick={() => scrollTo("features")} style={styles.link}>
          Features
        </button>

        <button onClick={() => scrollTo("pricing")} style={styles.link}>
          Pricing
        </button>
      </div>

      {/* AUTH */}
      <div style={styles.auth}>
        <button onClick={toggleTheme} style={styles.themeBtn}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>

        <button onClick={() => router.push("/login")} style={styles.login}>
          Login
        </button>

        <button onClick={() => router.push("/signup")} style={styles.signup}>
          Sign Up
        </button>
      </div>
    </nav>
  );
}

const styles: any = {
  nav: {
    position: "sticky",
    top: 0,
    backdropFilter: "blur(10px)",
    background: "rgba(255,255,255)",
    // background: "rgba(255,255,255,0.8)",
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    borderBottom: "1px solid #e5e7eb",
  },

  logo: {
    fontWeight: "bold",
    cursor: "pointer",
    color: "#000",
  },

  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },

  auth: {
    display: "flex",
    gap: "0.5rem",
  },

  link: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#000",
    fontSize: "0.95rem",
  },

  login: {
    border: "1px solid #1d4ed8",
    background: "transparent",
    padding: "0.4rem 0.8rem",
    cursor: "pointer",
    color: "#000",
  },

  signup: {
    background: "#1d4ed8",
    color: "#fff",
    padding: "0.4rem 0.8rem",
    border: "none",
    cursor: "pointer",
  },

  themeBtn: {
    border: "1px solid var(--border)",
    background: "transparent",
    padding: "0.4rem 0.7rem",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#000000",
  }
};