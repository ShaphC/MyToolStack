"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import PageLayout from "@/app/components/PageLayout";

export default function LinkBridge() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  /* -------------------- 🔐 GET USER -------------------- */
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
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
      .order("created_at", { ascending: false });

    // 🔥 Remove expired links
    const valid = (data || []).filter(
      (l: any) =>
        !l.expires_at || new Date(l.expires_at) > new Date()
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
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    });

    setUrl("");
    setLoading(false);
    fetchLinks();
  };

  /* -------------------- 🧠 TITLE PARSER -------------------- */
  const extractTitle = (link: string) => {
    try {
      const parsed = new URL(link);
      return parsed.hostname.replace("www.", "");
    } catch {
      return "Saved Link";
    }
  };

  /* -------------------- ❌ DELETE -------------------- */
  const deleteLink = async (id: string) => {
    await supabase.from("links").delete().eq("id", id);
    fetchLinks();
  };

  /* -------------------- UI -------------------- */
  return (
    <PageLayout>
      <main style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>Link Bridge</h1>

          <p style={styles.subtitle}>
            Send links from desktop → open on your phone instantly
          </p>

          {/* INPUT */}
          <div style={styles.inputRow}>
            <input
              placeholder="Paste a link..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              style={styles.input}
            />

            <button
              onClick={addLink}
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading ? styles.buttonDisabled : {}),
              }}
            >
              {loading ? "Saving..." : "Send"}
            </button>
          </div>

          {/* LIST */}
          <div style={styles.list}>
            {links.length === 0 && (
              <p style={styles.empty}>No links yet</p>
            )}

            {links.map((link) => (
              <div key={link.id} style={styles.linkCard}>
                <div
                  style={styles.linkInfo}
                  onClick={() => window.open(link.url, "_blank")}
                >
                  <div style={styles.linkTitle}>
                    {link.title}
                  </div>

                  <div style={styles.linkUrl}>
                    {link.url}
                  </div>
                </div>

                <button
                  onClick={() => deleteLink(link.id)}
                  style={styles.delete}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

/* ====================== STYLES ====================== */

const styles: any = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "2rem",
  },

  card: {
    width: "100%",
    maxWidth: "600px",
    background: "var(--card)",
    border: "2px solid var(--border)",
    borderRadius: "12px",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  title: {
    fontSize: "1.6rem",
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "var(--muted)",
    marginBottom: "1rem",
  },

  /* INPUT */
  inputRow: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    padding: "0.75rem",
    border: "2px solid var(--border)",
    borderRadius: "8px",
    background: "var(--card)",
    color: "var(--text)",
  },

  button: {
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1.2rem",
    borderRadius: "8px",
    cursor: "pointer",
  },

  buttonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },

  /* LIST */
  list: {
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  empty: {
    textAlign: "center",
    color: "var(--muted)",
  },

  linkCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem",
    border: "1px solid var(--border)",
    borderRadius: "8px",
  },

  linkInfo: {
    flex: 1,
    cursor: "pointer",
  },

  linkTitle: {
    fontWeight: "bold",
  },

  linkUrl: {
    fontSize: "0.8rem",
    color: "var(--muted)",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  delete: {
    background: "transparent",
    border: "none",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "1rem",
    marginLeft: "0.5rem",
  },
};