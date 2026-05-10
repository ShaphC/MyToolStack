"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import PageLayout from "@/app/components/PageLayout";

export default function ImprovementsPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchImprovements();
  }, []);

  const fetchImprovements = async () => {
    const { data, error } = await supabase
      .from("improvements")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setItems(data || []);
    }

    setLoading(false);
  };

  return (
    <PageLayout>
      <main style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.title}>🚀 Site Improvements</h1>

          <p style={styles.subtitle}>
            Everything being improved inside SimpleStack
          </p>

          <div style={styles.feed}>
            {loading && (
              <p style={styles.empty}>Loading...</p>
            )}

            {!loading && items.length === 0 && (
              <p style={styles.empty}>
                No improvements yet
              </p>
            )}

            {items.map((item, index) => (
              <div
                key={item.id}
                style={{
                  ...styles.item,
                  borderLeft: `6px solid ${item.color}`,
                  background:
                    index % 2 === 0
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(255,255,255,0.04)",
                }}
              >
                <div style={styles.itemTop}>
                  <span
                    style={{
                      ...styles.dot,
                      background: item.color,
                    }}
                  />

                  <span style={styles.date}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div style={styles.text}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

const styles: any = {
  container: {
    minHeight: "100vh",
    padding: "2rem",
    display: "flex",
    justifyContent: "center",
    background: "var(--bg)",
    color: "var(--text)",
  },

  card: {
    width: "100%",
    maxWidth: "900px",
    border: "2px solid var(--border)",
    borderRadius: "16px",
    background: "var(--card)",
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
  },

  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },

  subtitle: {
    color: "var(--muted)",
    marginBottom: "2rem",
  },

  feed: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxHeight: "70vh",
    overflowY: "auto",
    paddingRight: "0.5rem",
  },

  item: {
    padding: "1rem",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    background: "var(--bg)"
  },

  itemTop: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },

  date: {
    fontSize: "0.8rem",
    color: "var(--muted)",
  },

  text: {
    fontSize: "1rem",
    lineHeight: 1.5,
  },

  empty: {
    textAlign: "center",
    color: "var(--muted)",
  },
};