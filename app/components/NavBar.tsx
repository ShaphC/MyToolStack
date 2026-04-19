"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      style={{
        ...styles.toggle,
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #1d4ed8, #6366f1)"
            : "#e5e7eb",
      }}
    >
      <div
        style={{
          ...styles.knob,
          transform: theme === "dark" ? "translateX(26px)" : "translateX(2px)",
        }}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </div>
    </div>
  );
}

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
        ⚡ SimpleStack
      </div>

      {/* LINKS */}
      <div style={styles.navLinks}>
        <button
          onClick={() => scrollTo("features")}
          style={styles.link}
        >
          Features
        </button>

        <button
          onClick={() => scrollTo("pricing")}
          style={styles.link}
        >
          Pricing
        </button>
      </div>

      {/* ACTIONS */}
      <div style={styles.auth}>
        <ThemeToggle />

        <button
          onClick={() => router.push("/login")}
          style={styles.login}
        >
          Login
        </button>

        <button
          onClick={() => router.push("/signup")}
          style={styles.signup}
        >
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
    background: "var(--bg)",
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 2rem",
    borderBottom: "1px solid #e5e7eb",
  },

  logo: {
    fontWeight: "bold",
    cursor: "pointer",
    color: "var(--text)",
    transition: "opacity 0.15s ease",
  },

  navLinks: {
    display: "flex",
    gap: "1.5rem",
  },

  link: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "var(--text)",
    fontSize: "0.95rem",
    padding: "0.3rem 0.5rem",
    borderRadius: "6px",
    transition: "all 0.15s ease",
  },

  auth: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },

  login: {
    border: "1px solid #1d4ed8",
    background: "transparent",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.15s ease",
    color: "var(--text)",
  },

  signup: {
    background: "#1d4ed8",
    color: "#fff",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },

  themeBtn: {
    border: "1px solid #e5e7eb",
    background: "transparent",
    padding: "0.4rem 0.7rem",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  
  toggle: {
    width: "50px",
    height: "26px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    padding: "2px",
    cursor: "pointer",
    transition: "all 0.25s ease",
  },

  knob: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.8rem",
    transition: "all 0.25s ease",
  },
};