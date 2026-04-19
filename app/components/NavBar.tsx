"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/app/context/ThemeContext";

export default function Navbar() {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const [isMobile, setIsMobile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const scrollTo = (id: string) => {
    if (window.location.pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const buttonFX = {
    onMouseEnter: (e: any) => {
      e.currentTarget.style.transform = "translateY(-2px)";
      e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
    },
    onMouseLeave: (e: any) => {
      e.currentTarget.style.transform = "translateY(0)";
      e.currentTarget.style.boxShadow = "none";
    },
    onMouseDown: (e: any) => {
      e.currentTarget.style.transform = "translateY(1px) scale(0.98)";
    },
    onMouseUp: (e: any) => {
      e.currentTarget.style.transform = "translateY(-2px) scale(1)";
    },
  };

  return (
    <nav style={styles.nav}>
      {/* LOGO */}
      <div style={styles.logo} onClick={() => router.push("/")}>
        ⚡ SimpleStack
      </div>

      {/* DESKTOP LINKS */}
      {!isMobile && (
        <div style={styles.links}>
          <button style={styles.link} onClick={() => scrollTo("features")}>
            Features
          </button>
          <button style={styles.link} onClick={() => scrollTo("pricing")}>
            Pricing
          </button>
        </div>
      )}

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        {/* ✅ THEME TOGGLE (ALWAYS VISIBLE) */}
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
              transform:
                theme === "dark"
                  ? "translateX(24px)"
                  : "translateX(2px)",
            }}
          >
            {theme === "dark" ? "🌙" : "☀️"}
          </div>
        </div>

        {/* DESKTOP AUTH */}
        {!isMobile && (
          <>
            <button
              {...buttonFX}
              onClick={() => router.push("/login")}
              style={styles.login}
            >
              Login
            </button>

            <button
              {...buttonFX}
              onClick={() => router.push("/signup")}
              style={styles.signup}
            >
              Sign Up
            </button>
          </>
        )}

        {/* MOBILE MENU BUTTON */}
        {isMobile && (
          <button
            style={styles.menuBtn}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        )}
      </div>

      {/* MOBILE MENU */}
      {isMobile && menuOpen && (
        <div style={styles.mobileMenu}>
          <button onClick={() => scrollTo("features")} style={styles.mobileLink}>
            Features
          </button>

          <button onClick={() => scrollTo("pricing")} style={styles.mobileLink}>
            Pricing
          </button>

          <button
            onClick={() => router.push("/login")}
            style={styles.mobileAuth}
          >
            Login
          </button>

          <button
            onClick={() => router.push("/signup")}
            style={styles.mobileAuthPrimary}
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}

/* ---------- STYLES ---------- */

const styles: any = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 50,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "1rem 1.5rem",
    background: "var(--bg)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    backdropFilter: "blur(10px)",
  },

  logo: {
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "1.1rem",
    color: "var(--text)",
  },

  links: {
    display: "flex",
    gap: "1.2rem",
  },

  link: {
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "var(--text)",
    fontSize: "0.95rem",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
  },

  login: {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)", // ✅ FIXED visibility
    cursor: "pointer",
  },

  signup: {
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    border: "none",
    background: "#1d4ed8",
    color: "#fff",
    cursor: "pointer",
  },

  toggle: {
    width: "50px",
    height: "26px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    padding: "2px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  knob: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    transition: "all 0.3s ease",
  },

  menuBtn: {
    fontSize: "1.5rem",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "var(--text)",
  },

  mobileMenu: {
    position: "absolute",
    top: "60px",
    left: 0,
    right: 0,
    background: "var(--bg)",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // ✅ CENTERED
    padding: "1.2rem",
    gap: "1rem",
    zIndex: 100,
  },

  mobileLink: {
    background: "transparent",
    border: "none",
    fontSize: "1.1rem",
    color: "var(--text)",
    cursor: "pointer",
  },

  mobileAuth: {
    width: "100%",
    maxWidth: "200px",
    padding: "0.7rem",
    border: "1px solid var(--border)",
    background: "transparent",
    borderRadius: "8px",
    color: "var(--text)",
  },

  mobileAuthPrimary: {
    width: "100%",
    maxWidth: "200px",
    padding: "0.7rem",
    border: "none",
    background: "#1d4ed8",
    color: "#fff",
    borderRadius: "8px",
  },
};