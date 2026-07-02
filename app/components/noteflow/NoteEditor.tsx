"use client";

import { Note } from "@/app/(protected)/apps/noteflow/page";

interface Props {
  note: Note;
  onChange: (note: Note) => void;
}

export default function NoteEditor({
  note,
  onChange,
}: Props) {
  return (
    <div style={styles.wrapper}>
      {/* TITLE */}
      <input
        value={note.title}
        onChange={(e) =>
          onChange({
            ...note,
            title: e.target.value,
          })
        }
        placeholder="Untitled note..."
        style={styles.title}
      />

      {/* CONTENT */}
      <textarea
        value={note.content}
        onChange={(e) =>
          onChange({
            ...note,
            content: e.target.value,
          })
        }
        placeholder="Start writing..."
        style={styles.content}
      />
    </div>
  );
}

const styles: any = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    flex: 1,
  },

  title: {
    width: "100%",
    fontSize: "1.3rem",
    fontWeight: 700,
    border: "none",
    outline: "none",
    background: "transparent",
    color: "var(--text)",
  },

  content: {
    width: "100%",
    minHeight: "320px",
    resize: "none",
    border: "none",
    outline: "none",
    background: "transparent",
    color: "var(--text)",
    fontSize: "1rem",
    lineHeight: 1.6,
    fontFamily: "ui-monospace, monospace",
  },
};