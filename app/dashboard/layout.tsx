"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const init = async () => {
      const start = Date.now();

      // 🔐 GET USER
      const { data } = await supabase.auth.getUser();

      // ⏳ Ensure spinner shows for at least 1s
      const elapsed = Date.now() - start;
      const remaining = 1000 - elapsed;
      if (remaining > 0) {
        await new Promise((res) => setTimeout(res, remaining));
      }

      // 🚫 NOT LOGGED IN
      if (!data.user) {
        router.replace("/login");
        return;
      }

      // ✅ USER EXISTS
      setUserEmail(data.user.email || "");

      // 📧 SEND WELCOME EMAIL (ONLY ONCE)
      try {
        const hasSent = localStorage.getItem("welcome_sent");

        if (!hasSent) {
          await fetch("/api/send-welcome", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: data.user.email,
            }),
          });

          localStorage.setItem("welcome_sent", "true");
        }
      } catch (err) {
        console.error("Welcome email failed:", err);
      }

      setLoading(false);
    };

    init();
  }, [router]);

  // 🚪 LOGOUT
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  // ⏳ LOADING SCREEN
  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>My Tools</h2>

        <nav style={styles.nav}>
          <SidebarLink
            href="/apps/time-tracker"
            label="Time Tracker"
            icon="⏱"
            active={pathname === "/apps/time-tracker"}
          />

          <SidebarLink
            href="/apps/random-generator"
            label="Number Generator"
            icon="🔢"
            active={pathname === "/apps/random-generator"}
          />

          <SidebarLink
            href="/apps/token-generator"
            label="Token Generator"
            icon="🔐"
            active={pathname === "/apps/token-generator"}
          />

          <SidebarLink
            href="/apps/secret-generator"
            label="Secure Links"
            icon="📨"
            active={pathname === "/apps/secret-generator"}
          />

          <SidebarLink
            href="/apps/message-repeater"
            label="Message Repeater"
            icon="🔐"
            active={pathname === "/apps/message-repeater"}
          />

          <SidebarLink
            href="/apps/link-bridge"
            label="LinkBrdige"
            icon="🔐"
            active={pathname === "/apps/link-bridge"}
          />
        </nav>

        <div style={{ marginTop: "2rem" }}>
          <div style={styles.user}>{userEmail}</div>

          <button onClick={handleLogout} style={styles.logout}>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>{children}</main>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  active,
}: any) {
  return (
    <Link
      href={href}
      style={{
        ...styles.link,
        ...(active ? styles.activeLink : {}),
      }}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.background = "#e0ecff";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.background = "transparent";
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

const styles: any = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "sans-serif",
  },

  sidebar: {
    width: "260px",
    borderRight: "2px solid var(--border)",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
  },

  logo: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    color: "var(--border)",
    marginBottom: "1rem",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  link: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
    padding: "0.5rem",
    borderRadius: "6px",
    textDecoration: "none",
    color: "var(--text)",
    transition: "all 0.15s ease",
  },

  activeLink: {
    background: "var(--border)",
    color: "#fff",
  },

  bottom: {
    marginTop: "auto",
  },

  user: {
    fontSize: "0.85rem",
    color: "var(--text)",
    marginBottom: "0.5rem",
  },

  logout: {
    width: "100%",
    background: "var(--border)",
    color: "#fff",
    border: "none",
    padding: "0.6rem",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  main: {
    flex: 1,
    padding: "2rem",
  },

  // ⏳ LOADER
  loaderContainer: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    background: "var(--bg)",
    color: "var(--text)",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #ddd",
    borderTop: "4px solid var(--border)",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};