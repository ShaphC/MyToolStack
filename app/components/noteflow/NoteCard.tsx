"use client";

import { Trash2 } from "lucide-react";
import { Note } from "@/app/(protected)/apps/noteflow/page";

interface Props {
  note: Note;
  onClick: () => void;
  onDelete: () => void;
}

export default function NoteCard({
  note,
  onClick,
  onDelete,
}: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        ...styles.card,
        borderLeft: `4px solid ${
          note.color || "#2563eb"
        }`,
      }}
    >
      {/* TOP ROW */}
      <div style={styles.top}>
        <h3 style={styles.title}>
          {note.title || "Untitled"}
        </h3>

        <div style={styles.actions}>
          {note.pinned && (
            <span style={styles.pin}>📌</span>
          )}

          {/* DELETE BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            style={styles.deleteBtn}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <p style={styles.content}>
        {note.content}
      </p>

      {/* FOOTER */}
      <div style={styles.footer}>
        <div style={styles.badges}>
          {note.favorite && (
            <span style={styles.badge}>
              ★ Favorite
            </span>
          )}

          {note.archived && (
            <span style={styles.badge}>
              Archived
            </span>
          )}
        </div>

        <span style={styles.date}>
          {new Date(
            note.updated_at
          ).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

const styles: any = {
  card: {
    background: "var(--card)",
    borderRadius: "18px",
    padding: "1rem",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: ".9rem",
    minHeight: "180px",
    border: "1px solid rgba(59,130,246,.12)",
    boxShadow: "0 12px 35px rgba(0,0,0,.10)",
    transition: "all .25s ease",
    position: "relative",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: ".75rem",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: ".5rem",
  },

  title: {
    margin: 0,
    fontSize: "1.05rem",
    fontWeight: 700,
    color: "var(--text)",
    lineHeight: 1.4,
  },

  pin: {
    fontSize: "1rem",
  },

  deleteBtn: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    border: "1px solid rgba(239,68,68,.2)",
    background: "rgba(239,68,68,.08)",
    color: "#f87171",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  content: {
    margin: 0,
    color: "var(--muted)",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 7,
    WebkitBoxOrient: "vertical",
    flex: 1,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    gap: ".75rem",
  },

  badges: {
    display: "flex",
    gap: ".5rem",
    flexWrap: "wrap",
  },

  badge: {
    background: "rgba(37,99,235,.10)",
    color: "#3b82f6",
    padding: ".25rem .55rem",
    borderRadius: "999px",
    fontSize: ".7rem",
    fontWeight: 700,
  },

  date: {
    fontSize: ".72rem",
    color: "var(--muted)",
  },
};