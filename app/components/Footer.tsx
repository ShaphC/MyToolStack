"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { useTheme } from "@/app/context/ThemeContext";

export default function Footer() {
  const router = useRouter();

  const { theme } = useTheme();

  const [loggedIn, setLoggedIn] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    checkUser();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkUser();
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();

    setLoggedIn(!!data.user);
  };

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div
          style={{
            ...styles.grid,
            ...(isMobile ? styles.mobileGrid : {}),
          }}
        >
          {/* LOGO */}
          <div style={isMobile ? styles.mobileSection : {}}>
            <div
              style={styles.logoWrap}
              onClick={() => {
                if (loggedIn) {
                  router.push("/dashboard");
                } else {
                  router.push("/");
                }
              }}
            >
              <img
                src={
                  theme === "dark"
                    ? "/images/logo-dark.png"
                    : "/images/logo-light.png"
                }
                alt="SimpleStack Logo"
                style={styles.logoImage}
              />

              <span style={styles.logoText}>
                SimpleStack
              </span>
            </div>
          </div>
          {/* PRODUCT */}
          <div style={isMobile ? styles.mobileSection : {}}>
            <h4>Product</h4>

            <p
              style={styles.link}
              onClick={() => router.push("/#features")}
            >
              Features
            </p>

            <p
              style={styles.link}
              onClick={() => router.push("/#pricing")}
            >
              Pricing
            </p>
          </div>

          {/* ACCOUNT */}
          <div style={isMobile ? styles.mobileSection : {}}>
            <h4>Account</h4>

            {!loggedIn ? (
              <>
                <p
                  onClick={() => router.push("/login")}
                  style={styles.link}
                >
                  Login
                </p>

                <p
                  onClick={() => router.push("/signup")}
                  style={styles.link}
                >
                  Sign Up
                </p>
              </>
            ) : (
              <p
                onClick={logout}
                style={styles.link}
              >
                Logout
              </p>
            )}
          </div>
        </div>

        <p style={styles.copy}>
          © {new Date().getFullYear()} SimpleStack.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

const styles: any = {
  footer: {
    borderTop: "var(--border)",
    marginTop: "3rem",
    padding: "3rem 2rem",
    background: "var(--bg)",
    color: "var(--text)",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: "2rem",
    marginBottom: "2rem",
  },

  mobileGrid: {
    textAlign: "center",
  },

  mobileSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "0.7rem",
    cursor: "pointer",
  },

  logoImage: {
    width: "28px",
    height: "28px",
    objectFit: "contain",
  },

  logoText: {
    fontWeight: 800,
    fontSize: "1.05rem",
    letterSpacing: "-0.03em",
  },
  link: {
    cursor: "pointer",
    marginTop: "0.5rem",
    color: "var(--text)",
  },

  copy: {
    textAlign: "center",
    color: "#6b7280",
    marginTop: "2rem",
    fontSize: "0.9rem",
  },
};