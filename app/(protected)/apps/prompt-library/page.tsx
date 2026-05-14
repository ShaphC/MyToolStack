"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Copy,
  Loader2,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import PageLayout from "@/app/components/PageLayout";
import { supabase } from "@/app/lib/supabase";

export default function PromptLibraryPage() {
  const [prompts, setPrompts] = useState<any[]>([]);
  const [flags, setFlags] = useState<any[]>([]);

  const [selectedPrompt, setSelectedPrompt] =
    useState<any>(null);

  const [content, setContent] =
    useState("");

  const [constraints, setConstraints] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [saveState, setSaveState] =
    useState<
      "idle" | "saving" | "saved"
    >("idle");

  const [creatingPrompt, setCreatingPrompt] =
    useState(false);

  const [showFlagModal, setShowFlagModal] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  const [flagLabel, setFlagLabel] =
    useState("");

  const [copied, setCopied] =
    useState(false);

  const textareaRef =
    useRef<HTMLTextAreaElement | null>(
      null
    );

  useEffect(() => {
    fetchPrompts();
    fetchFlags();
  }, []);

  useEffect(() => {
    autoResize();
  }, [content]);

  useEffect(() => {
    if (!selectedPrompt) return;

    setSaveState("saving");

    const timeout = setTimeout(async () => {
      const { error } = await supabase
        .from("prompts")
        .update({
          content,
          constraints,
          updated_at:
            new Date().toISOString(),
        })
        .eq("id", selectedPrompt.id);

      if (error) {
        console.error(error);
        return;
      }

      setSaveState("saved");

      fetchPrompts();
    }, 1200);

    return () => clearTimeout(timeout);
  }, [content, constraints]);

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height =
        "auto";

      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const fetchPrompts = async () => {
    const { data } = await supabase
      .from("prompts")
      .select("*")
      .order("updated_at", {
        ascending: false,
      });

    setPrompts(data || []);

    if (
      data &&
      data.length > 0 &&
      !selectedPrompt
    ) {
      openPrompt(data[0]);
    }
  };

  const fetchFlags = async () => {
    const { data } = await supabase
      .from("flags")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    setFlags(data || []);
  };

  const openPrompt = (prompt: any) => {
    setSelectedPrompt(prompt);

    setContent(prompt.content || "");

    setConstraints(
      prompt.constraints || ""
    );
  };

  const createPrompt = async () => {
    if (creatingPrompt) return;

    setCreatingPrompt(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setCreatingPrompt(false);
      return;
    }

    const { data, error } =
      await supabase
        .from("prompts")
        .insert([
          {
            user_id: user.id,
            content: "",
            constraints: "",
          },
        ])
        .select()
        .single();

    setCreatingPrompt(false);

    if (error) {
      console.error(error);
      return;
    }

    setContent("");
    setConstraints("");

    fetchPrompts();

    openPrompt(data);
  };

  const createFlag = async () => {
    if (!flagLabel.trim()) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("flags")
      .insert([
        {
          user_id: user.id,
          label: flagLabel,
          content: flagLabel,
        },
      ]);

    if (error) {
      console.error(error);
      return;
    }

    setFlagLabel("");

    setShowFlagModal(false);

    fetchFlags();
  };

  const deletePrompt = async (
    id: string
  ) => {
    const { error } = await supabase
      .from("prompts")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    setDeleteId(null);

    if (selectedPrompt?.id === id) {
      setSelectedPrompt(null);
      setContent("");
      setConstraints("");
    }

    fetchPrompts();
  };

  const filteredPrompts = useMemo(() => {
    return prompts.filter((prompt) =>
      prompt.content
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [prompts, search]);

  const addFlagToConstraints = (
    flag: any
  ) => {
    setConstraints((prev) =>
      prev
        ? `${prev}\n ${flag.content}`
        : `${flag.content}`
    );
  };

  const removeConstraint = (
    line: string
  ) => {
    const updated = constraints
      .split("\n")
      .filter((item) => item !== line)
      .join("\n");

    setConstraints(updated);
  };

  const copyPrompt = async () => {
    const fullPrompt = `${content}

${constraints}`;

    await navigator.clipboard.writeText(
      fullPrompt
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  const constraintLines =
    constraints
      .split("\n")
      .filter((line) => line.trim());

  return (
    <PageLayout>
      <main style={styles.container}>
        {/* FLAGS */}

        <aside style={styles.flagsSidebar}>
          <button
            onClick={() =>
              setShowFlagModal(true)
            }
            style={styles.primaryButton}
          >
            <Plus size={16} />
            Flag
          </button>

          <div style={styles.flagsList}>
            {flags.map((flag) => (
              <button
                key={flag.id}
                onClick={() =>
                  addFlagToConstraints(
                    flag
                  )
                }
                style={styles.flag}
              >
                {flag.label}
              </button>
            ))}
          </div>
        </aside>

        {/* EDITOR */}

        <section style={styles.editor}>
          {selectedPrompt ? (
            <>
              <div style={styles.topBar}>
                <div style={styles.leftTop}>
                  <button
                    onClick={createPrompt}
                    disabled={
                      creatingPrompt
                    }
                    style={
                      styles.primaryButtonSmall
                    }
                  >
                    {creatingPrompt ? (
                      <Loader2
                        size={16}
                        className="spin"
                      />
                    ) : (
                      <Plus size={16} />
                    )}

                    New Prompt
                  </button>

                  <div
                    style={styles.saveState}
                  >
                    {saveState ===
                      "saving" &&
                      "Saving..."}

                    {saveState ===
                      "saved" &&
                      "Saved ✓"}
                  </div>
                </div>

                <div style={styles.actions}>
                  <button
                    onClick={copyPrompt}
                    style={styles.copyButton}
                  >
                    <Copy size={16} />

                    {copied
                      ? "Copied"
                      : "Copy"}
                  </button>

                  <button
                    onClick={() =>
                      setDeleteId(
                        selectedPrompt.id
                      )
                    }
                    style={styles.deleteButton}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <textarea
                ref={textareaRef}
                value={content}
                onChange={(e) =>
                  setContent(
                    e.target.value
                  )
                }
                placeholder="Write your prompt..."
                style={styles.promptInput}
              />

              {constraintLines.length >
                0 && (
                <div
                  style={
                    styles.constraintsWrap
                  }
                >
                  {constraintLines.map(
                    (line, index) => (
                      <div
                        key={index}
                        style={
                          styles.constraintItem
                        }
                      >
                        <button
                          onClick={() =>
                            removeConstraint(
                              line
                            )
                          }
                          style={
                            styles.removeConstraint
                          }
                        >
                          <X size={14} />
                        </button>

                        <div>
                          {line}
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </>
          ) : (
            <div style={styles.empty}>
              Create or select a prompt
            </div>
          )}
        </section>

        {/* PROMPTS */}

        <aside style={styles.promptsSidebar}>
          <div style={styles.searchBox}>
            <Search size={16} />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search..."
              style={styles.searchInput}
            />
          </div>

          <div style={styles.promptsList}>
            {filteredPrompts.map(
              (prompt) => (
                <div
                  key={prompt.id}
                  style={{
                    ...styles.promptCard,
                    border:
                      selectedPrompt?.id ===
                      prompt.id
                        ? "1px solid #2563eb"
                        : "1px solid var(--border)",
                  }}
                >
                  <button
                    onClick={() =>
                      openPrompt(prompt)
                    }
                    style={
                      styles.promptContent
                    }
                  >
                    <div
                      style={
                        styles.promptPreview
                      }
                    >
                      {prompt.content ||
                        "Untitled Prompt"}
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      setDeleteId(
                        prompt.id
                      )
                    }
                    style={
                      styles.cardDelete
                    }
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              )
            )}
          </div>
        </aside>
      </main>

      {/* FLAG MODAL */}

      {showFlagModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              Create Flag
            </h2>

            <input
              value={flagLabel}
              onChange={(e) =>
                setFlagLabel(
                  e.target.value
                )
              }
              placeholder="No fluff"
              style={styles.modalInput}
            />

            <div style={styles.modalActions}>
              <button
                onClick={() =>
                  setShowFlagModal(
                    false
                  )
                }
                style={styles.cancelButton}
              >
                Cancel
              </button>

              <button
                onClick={createFlag}
                style={styles.primaryButton}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE */}

      {deleteId && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h2 style={styles.modalTitle}>
              Delete Prompt?
            </h2>

            <div style={styles.modalActions}>
              <button
                onClick={() =>
                  setDeleteId(null)
                }
                style={styles.cancelButton}
              >
                Cancel
              </button>

              <button
                onClick={() =>
                  deletePrompt(deleteId)
                }
                style={styles.confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .spin {
          animation: spin 1s linear
            infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </PageLayout>
  );
}

const styles: any = {
  container: {
    display: "grid",
    gridTemplateColumns:
      "220px 1fr 320px",
    minHeight:
      "calc(100vh - 70px)",
  },

  flagsSidebar: {
    borderRight:
      "1px solid var(--border)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  editor: {
    padding: "1rem 1.5rem",
    overflowY: "auto",
  },

  promptsSidebar: {
    borderLeft:
      "1px solid var(--border)",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },

  leftTop: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },

  saveState: {
    color: "var(--muted)",
    fontSize: "0.9rem",
  },

  actions: {
    display: "flex",
    gap: "0.75rem",
  },

  promptInput: {
    width: "100%",
    minHeight: "260px",
    border: "none",
    outline: "none",
    resize: "none",
    background: "transparent",
    color: "var(--text)",
    fontSize: "1rem",
    lineHeight: 1.8,
    fontFamily:
      "ui-monospace, monospace",
  },

  constraintsWrap: {
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  constraintItem: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "0.9rem 1rem",
    borderRadius: "12px",
    background: "var(--card)",
    border: "1px solid var(--border)",
    color: "var(--text)",
  },

  removeConstraint: {
    width: "28px",
    height: "28px",
    borderRadius: "999px",
    border: "none",
    background: "#dc2626",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },

  primaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.85rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  primaryButtonSmall: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.75rem 1rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  copyButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    background: "var(--card)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    padding: "0.75rem 1rem",
    borderRadius: "12px",
    cursor: "pointer",
  },

  deleteButton: {
    width: "44px",
    height: "44px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "12px",
    border: "1px solid #dc2626",
    background: "transparent",
    color: "#dc2626",
    cursor: "pointer",
  },

  flagsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  flag: {
    width: "100%",
    padding: "0.7rem 0.9rem",
    borderRadius: "999px",
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
    cursor: "pointer",
    textAlign: "left",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "0.8rem 1rem",
    background: "var(--card)",
  },

  searchInput: {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "var(--text)",
  },

  promptsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    overflowY: "auto",
    maxHeight: "540px",
  },

  promptCard: {
    background: "var(--card)",
    color: "var(--text)",
    borderRadius: "14px",
    padding: "0.75rem",
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
  },

  promptContent: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "var(--text)",
    textAlign: "left",
    cursor: "pointer",
  },

  cardDelete: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    border: "1px solid #dc2626",
    background: "transparent",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flexShrink: 0,
  },

  promptPreview: {
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 5,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  empty: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--muted)",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  modal: {
    width: "100%",
    maxWidth: "450px",
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "24px",
    padding: "1.5rem",
  },

  modalTitle: {
    fontSize: "1.25rem",
    fontWeight: "bold",
    color: "var(--text)",
  },

  modalInput: {
    width: "100%",
    marginTop: "1rem",
    padding: "1rem",
    borderRadius: "14px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    outline: "none",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.75rem",
    marginTop: "1.5rem",
  },

  cancelButton: {
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    padding: "0.85rem 1rem",
    borderRadius: "12px",
    cursor: "pointer",
  },

  confirmDelete: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "0.85rem 1rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};