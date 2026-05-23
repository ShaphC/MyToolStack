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

function LogoWithText({
  onClick,
}: {
  onClick: () => void;
}) {
  const { theme } = useTheme();

  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        cursor: "pointer",
        fontWeight: 800,
        fontSize: "1.05rem",
      }}
    >
      <img
        src={
          theme === "dark"
            ? "/images/logo-dark.png"
            : "/images/logo-light.png"
        }
        alt="SimpleStack Logo"
        style={{
          width: "28px",
          height: "28px",
          objectFit: "contain",
        }}
      />

      <span>SimpleStack</span>
    </div>
  );
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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

    if (!data.user) {
      setLoggedIn(false);
      setIsAdmin(false);
      return;
    }

    setLoggedIn(true);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    setIsAdmin(profile?.role === "admin");
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

  const goHome = () => {
    if (loggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <nav style={styles.nav}>
        {/* MOBILE NAV */}
        {isMobile ? (
          <div style={styles.mobileNav}>
            <button
              onClick={() => setOpen(!open)}
              style={styles.hamburger}
            >
              ☰
            </button>

            <div style={styles.mobileLogo}>
              <LogoWithText onClick={goHome} />
            </div>

            <div>
              <ThemeToggle />
            </div>
          </div>
        ) : (
          /* DESKTOP NAV */
          <div style={styles.desktopNav}>
            {/* LEFT */}
            <LogoWithText onClick={goHome} />

            {/* CENTER */}
            <div style={styles.centerLinks}>
              {!loggedIn ? (
                <>
                  <button onClick={() => scrollTo("features")} style={styles.link}>
                    Features
                  </button>
                  <button onClick={() => scrollTo("pricing")} style={styles.link}>
                    Pricing
                  </button>
                  <button onClick={() => scrollTo("improvements")} style={styles.link}>
                    Improvements
                  </button>
                  <button onClick={() => scrollTo("contact")} style={styles.link}>
                    Contact
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => router.push("/dashboard")} style={styles.link}>
                    Dashboard
                  </button>
                  <button onClick={() => router.push("/improvements")} style={styles.link}>
                    Improvements
                  </button>
                  <button onClick={() => router.push("/requests")} style={styles.link}>
                    Requests
                  </button>
                  <button onClick={() => router.push("/contact")} style={styles.link}>
                    Contact
                  </button>
                  {isAdmin && (
                    <button onClick={() => router.push("/admin")} style={styles.link}>
                      Admin
                    </button>
                  )}
                </>
              )}
            </div>

            {/* RIGHT */}
            <div style={styles.right}>
              <ThemeToggle />

              {!loggedIn ? (
                <>
                  <button onClick={() => router.push("/login")} style={styles.login}>
                    Login
                  </button>
                  <button onClick={() => router.push("/signup")} style={styles.signup}>
                    Sign Up
                  </button>
                </>
              ) : (
                <button onClick={logout} style={styles.login}>
                  Logout
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* MOBILE DROPDOWN */}
      {isMobile && open && (
        <div style={styles.dropdown}>
          {!loggedIn ? (
            <>
              <button onClick={() => scrollTo("features")} style={styles.mobileLink}>
                Features
              </button>
              <button onClick={() => scrollTo("pricing")} style={styles.mobileLink}>
                Pricing
              </button>
              <button onClick={() => scrollTo("improvements")} style={styles.mobileLink}>
                Improvements
              </button>
              <button onClick={() => scrollTo("contact")} style={styles.mobileLink}>
                Contact
              </button>
              <button onClick={() => router.push("/login")} style={styles.mobileButton}>
                Login
              </button>
              <button onClick={() => router.push("/signup")} style={styles.mobilePrimary}>
                Sign Up
              </button>
            </>
          ) : (
            <>
              <button onClick={() => router.push("/dashboard")} style={styles.mobileLink}>
                Dashboard
              </button>
              <button onClick={() => router.push("/improvements")} style={styles.mobileLink}>
                Improvements
              </button>
              <button onClick={() => router.push("/requests")} style={styles.mobileLink}>
                Requests
              </button>
              <button onClick={() => router.push("/contact")} style={styles.mobileLink}>
                Contact
              </button>
              {isAdmin && (
                <button onClick={() => router.push("/admin")} style={styles.mobileLink}>
                  Admin
                </button>
              )}
              <button onClick={logout} style={styles.mobileLogout}>
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}

const styles: any = {
  nav: {
    position: "sticky",
    top: 0,
    zIndex: 100,
    background: "var(--bg)",
    borderBottom: "1px solid rgba(0,0,0,0.08)",
    padding: "1rem 1.5rem",
  },

  desktopNav: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  mobileNav: {
    display: "grid",
    gridTemplateColumns: "40px 1fr 50px",
    alignItems: "center",
  },

  hamburger: {
    background: "transparent",
    border: "none",
    fontSize: "1.5rem",
    color: "var(--text)",
    cursor: "pointer",
  },

  mobileLogo: {
    display: "flex",
    justifyContent: "center",
  },

  centerLinks: {
    display: "flex",
    gap: "1.5rem",
  },

  link: {
    background: "transparent",
    border: "none",
    color: "var(--text)",
    cursor: "pointer",
    fontSize: "0.95rem",
  },

  right: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
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
    fontWeight: "bold",
  },

  dropdown: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1.5rem",
    background: "var(--card)",
    borderBottom: "1px solid var(--border)",
  },

  mobileLink: {
    background: "transparent",
    border: "none",
    textAlign: "left",
    color: "var(--text)",
    fontSize: "1rem",
    cursor: "pointer",
  },

  mobileButton: {
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #1d4ed8",
    background: "transparent",
    color: "var(--text)",
    cursor: "pointer",
  },

  mobilePrimary: {
    padding: "0.8rem",
    borderRadius: "8px",
    border: "none",
    background: "#1d4ed8",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold",
  },

  mobileLogout: {
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #dc2626",
    background: "transparent",
    color: "#dc2626",
    cursor: "pointer",
  },
};