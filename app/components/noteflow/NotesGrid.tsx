"use client";

import { Note } from "@/app/(protected)/apps/noteflow/page";
import NoteCard from "./NoteCard";

interface NotesGridProps {
  title: string;
  notes: Note[];
  onSelect: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NotesGrid({
  title,
  notes,
  onSelect,
  onDelete,
}: NotesGridProps) {
  if (notes.length === 0) return null;

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>{title}</h2>

      <div style={styles.grid}>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={() => onSelect(note)}
            onDelete={() => onDelete(note.id)}
          />
        ))}
      </div>
    </section>
  );
}

const styles: any = {
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  heading: {
    margin: 0,
    fontSize: "1rem",
    fontWeight: 700,
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: ".08em",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))",
    gap: "1.25rem",
    alignItems: "start",
  },
};