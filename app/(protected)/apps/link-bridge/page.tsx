"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import Navbar from "@/app/components/NavBar";

export default function LinkBridge() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(
    null
  );

  /* -------------------- 🔐 GET USER -------------------- */
  useEffect(() => {
    const getUser = async () => {
      const { data } =
        await supabase.auth.getUser();

      setUserId(data.user?.id || null);
    };

    getUser();
  }, []);

  /* -------------------- 📥 FETCH LINKS -------------------- */
  const fetchLinks = async () => {
    if (!userId) return;

    const { data } = await supabase
      .from("links")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", {
        ascending: false,
      });

    const valid = (data || []).filter(
      (l: any) =>
        !l.expires_at ||
        new Date(l.expires_at) > new Date()
    );

    setLinks(valid);
  };

  useEffect(() => {
    fetchLinks();
  }, [userId]);

  /* -------------------- ➕ ADD LINK -------------------- */
  const addLink = async () => {
    if (!url || !userId) return;

    setLoading(true);

    await supabase.from("links").insert({
      user_id: userId,
      url,
      title: extractTitle(url),
      expires_at: new Date(
        Date.now() + 24 * 60 * 60 * 1000
      ),
    });

    setUrl("");
    setLoading(false);

    fetchLinks();
  };

  /* -------------------- 🧠 TITLE PARSER -------------------- */
  const extractTitle = (link: string) => {
    try {
      const parsed = new URL(link);

      return parsed.hostname.replace(
        "www.",
        ""
      );
    } catch {
      return "Saved Link";
    }
  };

  /* -------------------- ❌ DELETE -------------------- */
  const deleteLink = async (id: string) => {
    await supabase
      .from("links")
      .delete()
      .eq("id", id);

    fetchLinks();
  };

  /* -------------------- 📊 STATS -------------------- */
  const totalLinks = links.length;

  const domains = useMemo(() => {
    return new Set(
      links.map((l) => {
        try {
          return new URL(l.url).hostname;
        } catch {
          return "unknown";
        }
      })
    ).size;
  }, [links]);

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <div style={styles.backgroundGlow} />

        <div style={styles.wrapper}>
          {/* HERO */}
          <div style={styles.hero}>
            <div style={styles.heroBadge}>
              🔗 Quick Sharing Tool
            </div>

            <h1 style={styles.title}>
              LinkBridge
            </h1>

            <p style={styles.subtitle}>
              Instantly move links between
              devices without emailing yourself
              or digging through messages.
            </p>
          </div>

          {/* STATS */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                🔗
              </div>

              <div>
                <div style={styles.statValue}>
                  {totalLinks}
                </div>

                <div style={styles.statLabel}>
                  Saved Links
                </div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                🌐
              </div>

              <div>
                <div style={styles.statValue}>
                  {domains}
                </div>

                <div style={styles.statLabel}>
                  Unique Domains
                </div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                ⚡
              </div>

              <div>
                <div style={styles.statValue}>
                  24h
                </div>

                <div style={styles.statLabel}>
                  Auto Expiry
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CARD */}
          <div style={styles.card}>
            {/* INPUT */}
            <div style={styles.inputSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  Send a Link
                </h2>

                <div style={styles.badge}>
                  Instant Sync
                </div>
              </div>

              <div style={styles.inputRow}>
                <input
                  placeholder="Paste a link..."
                  value={url}
                  onChange={(e) =>
                    setUrl(e.target.value)
                  }
                  style={styles.input}
                />

                <button
                  onClick={addLink}
                  disabled={loading}
                  style={{
                    ...styles.button,
                    ...(loading
                      ? styles.buttonDisabled
                      : {}),
                  }}
                >
                  {loading
                    ? "Saving..."
                    : "Send"}
                </button>
              </div>
            </div>

            {/* LINKS */}
            <div style={styles.linksSection}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  Your Links
                </h2>

                <div style={styles.linkCount}>
                  {links.length} total
                </div>
              </div>

              <div style={styles.list}>
                {links.length === 0 && (
                  <div style={styles.emptyCard}>
                    <div
                      style={styles.emptyIcon}
                    >
                      📭
                    </div>

                    <div
                      style={styles.emptyTitle}
                    >
                      No links yet
                    </div>

                    <div
                      style={styles.emptyText}
                    >
                      Save your first link to
                      instantly access it on
                      another device.
                    </div>
                  </div>
                )}

                {links.map((link) => (
                  <div
                    key={link.id}
                    style={styles.linkCard}
                  >
                    <div
                      style={styles.linkInfo}
                      onClick={() =>
                        window.open(
                          link.url,
                          "_blank"
                        )
                      }
                    >
                      <div
                        style={
                          styles.linkTop
                        }
                      >
                        <div
                          style={
                            styles.linkIcon
                          }
                        >
                          🌐
                        </div>

                        <div>
                          <div
                            style={
                              styles.linkTitle
                            }
                          >
                            {link.title}
                          </div>

                          <div
                            style={
                              styles.linkMeta
                            }
                          >
                            Tap to open
                          </div>
                        </div>
                      </div>

                      <div
                        style={
                          styles.linkUrl
                        }
                      >
                        {link.url}
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        deleteLink(link.id)
                      }
                      style={styles.delete}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

/* ====================== STYLES ====================== */

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text)",
    padding: "7rem 1.25rem 3rem",
    position: "relative",
    overflow: "hidden",
  },

  backgroundGlow: {
    position: "absolute",
    inset: 0,

    background: `
      radial-gradient(circle at top left, rgba(37,99,235,0.18), transparent 30%),
      radial-gradient(circle at top right, rgba(139,92,246,0.14), transparent 30%)
    `,

    pointerEvents: "none",
  },

  wrapper: {
    maxWidth: "950px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },

  hero: {
    marginBottom: "2rem",
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",

    padding: "0.5rem 0.9rem",

    borderRadius: "999px",

    border:
      "1px solid rgba(59,130,246,0.25)",

    background:
      "rgba(37,99,235,0.08)",

    color: "#60a5fa",

    fontSize: "0.85rem",
    fontWeight: 700,

    marginBottom: "1.25rem",
  },

  title: {
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    fontWeight: 800,
    letterSpacing: "-0.05em",
    marginBottom: "1rem",
  },

  subtitle: {
    maxWidth: "680px",
    lineHeight: 1.7,
    color: "var(--muted)",
    fontSize: "1.05rem",
  },

  statsGrid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",

    gap: "1rem",

    marginBottom: "2rem",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",

    padding: "1.4rem",

    borderRadius: "24px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.04)",

    backdropFilter: "blur(18px)",

    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  statIcon: {
    width: "58px",
    height: "58px",

    borderRadius: "18px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "1.6rem",

    background:
      "linear-gradient(135deg, rgba(37,99,235,0.25), rgba(59,130,246,0.08))",

    border:
      "1px solid rgba(59,130,246,0.25)",
  },

  statValue: {
    fontSize: "1.5rem",
    fontWeight: 800,
    marginBottom: "0.2rem",
  },

  statLabel: {
    color: "var(--muted)",
    fontSize: "0.92rem",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",

    padding: "1.5rem",

    borderRadius: "30px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.04)",

    backdropFilter: "blur(18px)",

    boxShadow:
      "0 20px 60px rgba(0,0,0,0.12)",
  },

  inputSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  linksSection: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },

  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
  },

  badge: {
    padding: "0.45rem 0.8rem",

    borderRadius: "999px",

    background:
      "rgba(37,99,235,0.12)",

    color: "#60a5fa",

    fontWeight: 700,
    fontSize: "0.82rem",
  },

  linkCount: {
    color: "var(--muted)",
    fontSize: "0.9rem",
  },

  inputRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    minWidth: "240px",

    padding: "1rem 1rem",

    borderRadius: "16px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.04)",

    color: "var(--text)",

    outline: "none",

    fontSize: "0.95rem",
  },

  button: {
    padding: "1rem 1.4rem",

    borderRadius: "16px",

    border: "none",

    background:
      "linear-gradient(135deg, #2563eb, #3b82f6)",

    color: "#fff",

    fontWeight: 700,

    cursor: "pointer",

    boxShadow:
      "0 12px 30px rgba(37,99,235,0.28)",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  emptyCard: {
    padding: "3rem 2rem",

    borderRadius: "24px",

    border:
      "1px dashed rgba(255,255,255,0.1)",

    textAlign: "center",

    background:
      "rgba(255,255,255,0.02)",
  },

  emptyIcon: {
    fontSize: "2.5rem",
    marginBottom: "1rem",
  },

  emptyTitle: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: "0.5rem",
  },

  emptyText: {
    color: "var(--muted)",
    lineHeight: 1.6,
  },

  linkCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    padding: "1.1rem",
    borderRadius: "22px",
    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.03)",

    backdropFilter: "blur(12px)",
    transition: "all 0.2s ease",
  },

  linkInfo: {
    flex: 1,
    cursor: "pointer",
    minWidth: 0,
  },

  linkTop: {
    display: "flex",
    alignItems: "center",
    gap: "0.9rem",
    marginBottom: "0.8rem",
  },

  linkIcon: {
    width: "48px",
    height: "48px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(37,99,235,0.12)",
    border:
      "1px solid rgba(59,130,246,0.18)",
    fontSize: "1.2rem",
    flexShrink: 0,
  },

  linkTitle: {
    fontWeight: 700,
    fontSize: "1rem",
    marginBottom: "0.2rem",
  },

  linkMeta: {
    fontSize: "0.82rem",
    color: "var(--muted)",
  },

  linkUrl: {
    color: "var(--muted)",
    fontSize: "0.88rem",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  delete: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    border:
      "1px solid rgba(239,68,68,0.18)",
    background:
      "rgba(239,68,68,0.08)",
    color: "#f87171",
    cursor: "pointer",
    fontSize: "1rem",
    flexShrink: 0,
  },
};