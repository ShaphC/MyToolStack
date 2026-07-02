"use client";

import { useEffect, useMemo, useState } from "react";
import PageLayout from "@/app/components/PageLayout";

import NotesHeader from "@/app/components/noteflow/NotesHeader";
import NotesGrid from "@/app/components/noteflow/NotesGrid";
import NoteModal from "@/app/components/noteflow/NoteModal";

import { supabase } from "@/app/lib/supabase";

export interface Note {
  id: string;
  title: string;
  content: string;

  color: string;

  pinned: boolean;
  archived: boolean;
  favorite: boolean;

  created_at: string;
  updated_at: string;
}

export default function NoteFlowPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setNotes(data || []);
    setLoading(false);
  };

  const createNote = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase
      .from("notes")
      .insert([
        {
          user_id: user.id,
          title: "",
          content: "",
          color: "#2563eb",
          pinned: false,
          archived: false,
          favorite: false,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setNotes((prev) => [data, ...prev]);
    openNote(data);
  };

  const openNote = (note: Note) => {
    setSelectedNote(note);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedNote(null);
  };

  const deleteNote = async (id: string) => {
    const { error } = await supabase
      .from("notes")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setNotes((prev) => prev.filter((n) => n.id !== id));

    if (selectedNote?.id === id) {
      closeModal();
    }
  };

  const filteredNotes = useMemo(() => {
    if (!search.trim()) return notes;

    const q = search.toLowerCase();

    return notes.filter(
      (n) =>
        n.title?.toLowerCase().includes(q) ||
        n.content?.toLowerCase().includes(q)
    );
  }, [notes, search]);

  const pinned = filteredNotes.filter((n) => n.pinned);
  const normal = filteredNotes.filter((n) => !n.pinned);

  return (
    <PageLayout>
      <main style={styles.page}>
        <NotesHeader
          search={search}
          onSearch={setSearch}
          onCreate={createNote}
        />

        <NotesGrid
          title="Pinned"
          notes={pinned}
          onSelect={openNote}
          onDelete={deleteNote}
        />

        <NotesGrid
          title="Notes"
          notes={normal}
          onSelect={openNote}
          onDelete={deleteNote}
        />

        <button style={styles.fab} onClick={createNote}>
          +
        </button>

        <NoteModal
          open={modalOpen}
          note={selectedNote}
          onClose={closeModal}
          onNotesUpdate={fetchNotes}
        />
      </main>
    </PageLayout>
  );
}

const styles: any = {
  page: {
    position: "relative",
    minHeight: "100vh",
    padding: "2rem 0 5rem",
  },

  fab: {
    position: "fixed",
    bottom: "32px",
    right: "32px",
    width: "64px",
    height: "64px",
    borderRadius: "999px",
    border: "none",
    background: "linear-gradient(135deg,#2563eb,#4f46e5)",
    color: "#fff",
    fontSize: "2rem",
    cursor: "pointer",
    boxShadow: "0 20px 60px rgba(37,99,235,.35)",
  },
};