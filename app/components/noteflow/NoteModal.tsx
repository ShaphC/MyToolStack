"use client";

import { useEffect, useRef, useState } from "react";
import { Note } from "@/app/(protected)/apps/noteflow/page";
import NoteEditor from "./NoteEditor";
import { supabase } from "@/app/lib/supabase";

interface Props {
  open: boolean;
  note: Note | null;
  onClose: () => void;
  onNotesUpdate: () => void;
}

export default function NoteModal({
  open,
  note,
  onClose,
  onNotesUpdate,
}: Props) {
  const [draft, setDraft] = useState<Note | null>(null);
  const [saveState, setSaveState] =
    useState<"idle" | "saving" | "saved">("idle");

  const saveTimeout = useRef<NodeJS.Timeout | null>(null);
  const hasInserted = useRef(false);

  // Load note into draft
  useEffect(() => {
    if (!open) return;

    if (note) {
      setDraft(note);
      hasInserted.current = true;
    } else {
      setDraft({
        id: "",
        title: "",
        content: "",
        color: "#2563eb",
        pinned: false,
        archived: false,
        favorite: false,
        created_at: "",
        updated_at: "",
      });

      hasInserted.current = false;
    }
  }, [note, open]);

  // AUTO SAVE (Prompt Library pattern)
  useEffect(() => {
    if (!open || !draft) return;

    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    setSaveState("saving");

    saveTimeout.current = setTimeout(async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) return;

      let savedNote: Note | null = null;

      // CREATE (first time typing new note)
      if (!hasInserted.current && !note) {
        const { data, error } = await supabase
          .from("notes")
          .insert([
            {
              user_id: userData.user.id,
              title: draft.title,
              content: draft.content,
              color: draft.color,
              pinned: draft.pinned,
              archived: draft.archived,
              favorite: draft.favorite,
            },
          ])
          .select()
          .single();

        if (error) {
          console.error(error);
          return;
        }

        savedNote = data;
        hasInserted.current = true;
      }

      // UPDATE
      else {
        const { data, error } = await supabase
          .from("notes")
          .update({
            title: draft.title,
            content: draft.content,
            color: draft.color,
            pinned: draft.pinned,
            archived: draft.archived,
            favorite: draft.favorite,
            updated_at: new Date().toISOString(),
          })
          .eq("id", note?.id || draft.id)
          .select()
          .single();

        if (error) {
          console.error(error);
          return;
        }

        savedNote = data;
      }

      setSaveState("saved");

      onNotesUpdate();

      if (savedNote) {
        setDraft(savedNote);
      }

      setTimeout(() => {
        setSaveState("idle");
      }, 1200);
    }, 1000);

    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, [draft]);

  if (!open || !draft) return null;

  return (
    <div
      style={styles.overlay}
      onClick={onClose}
    >
      <div
        style={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div style={styles.header}>
          <h2 style={styles.title}>
            {note?.id ? "Edit Note" : "New Note"}
          </h2>

          <div style={styles.status}>
            {saveState === "saving" && "Saving..."}
            {saveState === "saved" && "Saved ✓"}
          </div>

          <button style={styles.close} onClick={onClose}>
            ✕
          </button>
        </div>

        {/* EDITOR */}
        <NoteEditor note={draft} onChange={setDraft} />

      </div>
    </div>
  );
}

const styles: any = {
  overlay: {
    position: "fixed",
    inset: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "rgba(0,0,0,.55)",
    backdropFilter: "blur(10px)",
    zIndex: 9999,
    padding: "1rem",
  },

  modal: {
    width: "100%",
    maxWidth: "760px",
    background: "var(--card)",
    borderRadius: "24px",
    padding: "1.75rem",
    border: "1px solid rgba(59,130,246,.15)",
    boxShadow: "0 30px 90px rgba(0,0,0,.35)",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: 800,
  },

  status: {
    fontSize: "0.85rem",
    color: "var(--muted)",
    marginLeft: "auto",
    marginRight: "1rem",
  },

  close: {
    width: "42px",
    height: "42px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    background: "rgba(255,255,255,.05)",
    color: "var(--text)",
    fontSize: "1rem",
  },
};