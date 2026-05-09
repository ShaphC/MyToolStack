"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { useTheme } from "@/app/context/ThemeContext";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      style={{
        width: "50px",
        height: "26px",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        padding: "2px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        background:
          theme === "dark"
            ? "linear-gradient(135deg, #1d4ed8, #6366f1)"
            : "#e5e7eb",
      }}
    >
      <div
        style={{
          width: "22px",
          height: "22px",
          borderRadius: "50%",
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.8rem",
          transition: "all 0.25s ease",
          transform:
            theme === "dark"
              ? "translateX(24px)"
              : "translateX(0px)",
        }}
      >
        {theme === "dark" ? "🌙" : "☀️"}
      </div>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    setLoggedIn(!!data.user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const scrollTo = (id: string) => {
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }

    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
    <nav style={styles.nav}>
      {/* LOGO */}
      <div
        style={styles.logo}
        onClick={() => {
          if (loggedIn) {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        }}
      >
        ⚡ SimpleStack
      </div>

      {/* CENTER LINKS */}
      <div style={styles.centerLinks}>
        {!loggedIn ? (
          <>
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

            <button
              onClick={() => scrollTo("improvements")}
              style={styles.link}
            >
              Improvements
            </button>

            {/* <button
              onClick={() => router.push("/contact")}
              style={styles.link}
            >
              Contact
            </button> */}
          </>
        ) : (
          <>
            <button
              onClick={() => router.push("/dashboard")}
              style={styles.link}
            >
              Dashboard
            </button>

            <button
              onClick={() => router.push("/improvements")}
              style={styles.link}
            >
              Improvements
            </button>

            <button
              onClick={() => router.push("/requests")}
              style={styles.link}
            >
              Requests
            </button>

            <button
              onClick={() => router.push("/contact")}
              style={styles.link}
            >
              Contact
            </button>
          </>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div style={styles.right}>
        <ThemeToggle />

        {!loggedIn ? (
          <>
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
          </>
        ) : (
          <button
            onClick={logout}
            style={styles.login}
          >
            Logout
          </button>
        )}

        {/* MOBILE MENU */}
        <div
          style={styles.mobileMenu}
          onClick={() => setOpen(!open)}
        >
          ☰
        </div>
      </div>

      {/* MOBILE DROPDOWN */}
      {open && (
        <div style={styles.mobileDropdown}>
          {!loggedIn ? (
            <>
              <button
                onClick={() => {
                  scrollTo("features");
                  setOpen(false);
                }}
                style={styles.mobileLink}
              >
                Features
              </button>

              <button
                onClick={() => {
                  scrollTo("pricing");
                  setOpen(false);
                }}
                style={styles.mobileLink}
              >
                Pricing
              </button>

              <button
                onClick={() => {
                  scrollTo("improvements");
                  setOpen(false);
                }}
                style={styles.mobileLink}
              >
                Improvements
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  router.push("/dashboard");
                  setOpen(false);
                }}
                style={styles.mobileLink}
              >
                Dashboard
              </button>

              <button
                onClick={() => {
                  router.push("/improvements");
                  setOpen(false);
                }}
                style={styles.mobileLink}
              >
                Improvements
              </button>

              <button
                onClick={() => {
                  router.push("/requests");
                  setOpen(false);
                }}
                style={styles.mobileLink}
              >
                Requests
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

const styles: any = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(10px)",
    background: "rgba(0,0,0,0.5)",
  },

  logo: {
    fontWeight: "bold",
    cursor: "pointer",
    minWidth: "160px",
  },

  centerLinks: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "1.5rem",
    flex: 1,
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    minWidth: "160px",
    justifyContent: "flex-end",
  },

  link: {
    background: "transparent",
    border: "none",
    color: "var(--text)",
    cursor: "pointer",
    fontSize: "0.95rem",
  },

  login: {
    border: "1px solid #1d4ed8",
    background: "transparent",
    color: "var(--text)",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
  },

  signup: {
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    padding: "0.5rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
  },

  mobileMenu: {
    display: "none",
    cursor: "pointer",
    fontSize: "1.4rem",
  },

  mobileDropdown: {
    position: "absolute",
    top: "72px",
    left: 0,
    width: "100%",
    background: "var(--card)",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    flexDirection: "column",
    padding: "1rem",
    gap: "1rem",
  },

  mobileLink: {
    background: "transparent",
    border: "none",
    color: "var(--text)",
    fontSize: "1rem",
    textAlign: "center",
    cursor: "pointer",
  },
};