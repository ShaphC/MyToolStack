"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import PageLayout from "@/app/components/PageLayout";

export default function AdminImprovementsPage() {
  const router = useRouter();

  const [text, setText] = useState("");
  const [color, setColor] = useState("#2563eb");

  const [editingId, setEditingId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(false);

  const [improvements, setImprovements] = useState<any[]>([]);

  useEffect(() => {
    fetchImprovements();
  }, []);

  const fetchImprovements = async () => {
    const { data } = await supabase
      .from("improvements")
      .select("*")
      .order("created_at", { ascending: false });

    setImprovements(data || []);
  };

  const resetForm = () => {
    setText("");
    setColor("#2563eb");
    setEditingId(null);
  };

  const addImprovement = async () => {
    if (!text.trim()) return;

    setLoading(true);

    const { error } = await supabase
      .from("improvements")
      .insert([
        {
          text,
          color,
        },
      ]);

    setLoading(false);

    if (error) {
      console.error(error);
      return;
    }

    resetForm();

    fetchImprovements();
  };

  const updateImprovement = async () => {
    if (!editingId) return;

    setLoading(true);

    const { error } = await supabase
      .from("improvements")
      .update({
        text,
        color,
      })
      .eq("id", editingId);

    setLoading(false);

    if (error) {
      console.error(error);
      return;
    }

    resetForm();

    fetchImprovements();
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setText(item.text);
    setColor(item.color);
  };

  const deleteImprovement = async (id: string) => {
    const confirmed = confirm(
      "Delete this improvement?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("improvements")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    fetchImprovements();
  };

  return (
    <PageLayout>
      <main style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>
              Improvements
            </h1>

            <p style={styles.subtitle}>
              Publish updates that appear on the homepage.
            </p>
          </div>

          <button
            onClick={() => router.push("/admin")}
            style={styles.backBtn}
          >
            Back
          </button>
        </div>

        {/* FORM */}
        <div style={styles.card}>
          <h2>
            {editingId
              ? "Edit Improvement"
              : "Add Improvement"}
          </h2>

          <textarea
            placeholder="What changed?"
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={styles.textarea}
          />

          <div style={styles.row}>
            <div style={styles.colorRow}>
              <span>Accent Color</span>

              <input
                type="color"
                value={color}
                onChange={(e) =>
                  setColor(e.target.value)
                }
                style={styles.colorInput}
              />
            </div>

            <div style={styles.actions}>
              {editingId && (
                <button
                  onClick={resetForm}
                  style={styles.cancelBtn}
                >
                  Cancel
                </button>
              )}

              <button
                onClick={
                  editingId
                    ? updateImprovement
                    : addImprovement
                }
                style={styles.button}
              >
                {loading
                  ? editingId
                    ? "Saving..."
                    : "Publishing..."
                  : editingId
                  ? "Save Changes"
                  : "Publish"}
              </button>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div style={styles.feed}>
          {improvements.map((item) => (
            <div
              key={item.id}
              style={{
                ...styles.improvementCard,
                borderLeft: `6px solid ${item.color}`,
              }}
            >
              <div style={styles.improvementTop}>
                <div
                  style={{
                    ...styles.dot,
                    background: item.color,
                  }}
                />

                <div style={styles.date}>
                  {new Date(
                    item.created_at
                  ).toLocaleDateString()}
                </div>
              </div>

              <div style={styles.text}>
                {item.text}
              </div>

              <div style={styles.cardActions}>
                <button
                  onClick={() => startEdit(item)}
                  style={styles.editBtn}
                >
                  Edit
                </button>

                <button
                  onClick={() =>
                    deleteImprovement(item.id)
                  }
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </PageLayout>
  );
}

const styles: any = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "2rem",
    gap: "1rem",
  },

  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },

  subtitle: {
    color: "var(--muted)",
  },

  card: {
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "1.5rem",
    background: "var(--card)",
    marginBottom: "2rem",
  },

  textarea: {
    width: "100%",
    minHeight: "140px",
    marginTop: "1rem",
    padding: "1rem",

    borderRadius: "12px",
    border: "1px solid var(--border)",

    background: "var(--bg)",
    color: "var(--text)",

    resize: "vertical",
    outline: "none",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "1rem",
    gap: "1rem",
    flexWrap: "wrap",
  },

  colorRow: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },

  colorInput: {
    width: "48px",
    height: "48px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },

  button: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.85rem 1.25rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  cancelBtn: {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text)",
    padding: "0.85rem 1.25rem",
    borderRadius: "10px",
    cursor: "pointer",
  },

  backBtn: {
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    padding: "0.75rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
  },

  feed: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  improvementCard: {
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "1rem",
    background: "var(--card)",
  },

  improvementTop: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.75rem",
  },

  dot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },

  date: {
    fontSize: "0.85rem",
    color: "var(--muted)",
  },

  text: {
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },

  cardActions: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1rem",
  },

  editBtn: {
    background: "transparent",
    border: "1px solid #2563eb",
    color: "#2563eb",
    padding: "0.6rem 0.9rem",
    borderRadius: "8px",
    cursor: "pointer",
  },

  deleteBtn: {
    background: "transparent",
    border: "1px solid #dc2626",
    color: "#dc2626",
    padding: "0.6rem 0.9rem",
    borderRadius: "8px",
    cursor: "pointer",
  },
};