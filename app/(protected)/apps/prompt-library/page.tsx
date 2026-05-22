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
  Menu,
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

  const [showFlagsMobileModal,setShowFlagsMobileModal]=useState(false);

  const [showPromptsMobileModal,setShowPromptsMobileModal]=useState(false);

  const [reopenPromptsModal,setReopenPromptsModal]=useState(false);

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
    }, 1000);

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

    setShowPromptsMobileModal(false);
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
        ? `${prev}\n${flag.content}`
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
        <div
          className="mobile-top"
          style={styles.mobileTop}
        >
          <button
            onClick={() =>
              setShowFlagsMobileModal(true)
            }
            style={styles.mobileMenuButton}
          >
            <Menu size={16} />
            Flags
          </button>

          <button
            onClick={() =>
              setShowPromptsMobileModal(true)
            }
            style={styles.mobileMenuButton}
          >
            <Menu size={16} />
            Prompts
          </button>
        </div>

        {/* FLAGS */}

        <aside style={styles.flagsSidebar}>
          <button
            onClick={() =>
              setShowFlagModal(true)
            }
            style={styles.primaryButton}
          >
            <Plus size={15} />
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
                        size={14}
                        className="spin"
                      />
                    ) : (
                      <Plus size={14} />
                    )}

                    New
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
                    <Copy size={14} />

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
                    <Trash2 size={14} />
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
                          <X size={12} />
                        </button>

                        <div
                          style={{
                            wordBreak:
                              "break-word",
                          }}
                        >
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
              <div style={styles.emptyWrap}>
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
                      size={14}
                      className="spin"
                    />
                  ) : (
                    <Plus size={14} />
                  )}

                  New Prompt
                </button>

                <div>
                  Create or select a
                  prompt
                </div>
              </div>
            </div>
          )}
        </section>

        {/* PROMPTS */}

        <aside style={styles.promptsSidebar}>
          <div style={styles.searchBox}>
            <Search size={14} />

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
                    onClick={() => {
                      setShowPromptsMobileModal(false);
                      setReopenPromptsModal(true);
                      setDeleteId(prompt.id);
                    }}
                    style={
                      styles.cardDelete
                    }
                  >
                    <Trash2 size={13} />
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
              placeholder="Write your flag..."
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
                style={styles.saveButton}
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
                onClick={() => {
                  setDeleteId(null);

                  if (reopenPromptsModal) {
                    setShowPromptsMobileModal(true);
                    setReopenPromptsModal(false);
                  }
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await deletePrompt(deleteId);

                  setReopenPromptsModal(false);
                }}
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
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 1000px) {
          main {
            grid-template-columns: 1fr !important;
          }

          aside {
            display: none !important;
          }

          .mobile-top {
            display: flex !important;
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
      "180px minmax(0, 1fr) 260px",
    minHeight:
      "calc(100vh - 70px)",
    gap: "0.6rem",
    position: "relative",
    padding: "0.6rem",
  },

  mobileTop: {
    display: "none",
    gap: "0.5rem",
    marginBottom: "0.5rem",
    width: "100%",
  },

  mobileMenuButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.35rem",
    width: "120px",
    height: "38px",
    flexShrink: 0,
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.9rem",
  },

  flagsSidebar: {
    padding: "0.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  promptsSidebar: {
    padding: "0.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  editor: {
    padding: "0.8rem",
    overflowY: "auto",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    minWidth: 0,
    height: "calc(100vh - 90px)",
    boxSizing: "border-box",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.6rem",
    flexWrap: "wrap",
  },

  leftTop: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    flexWrap: "wrap",
  },

  saveState: {
    color: "var(--muted)",
    fontSize: "0.8rem",
  },

  actions: {
    display: "flex",
    gap: "0.4rem",
    flexWrap: "wrap",
  },

  promptInput: {
    width: "100%",
    minHeight: "180px",
    border: "none",
    outline: "none",
    resize: "none",
    background: "transparent",
    color: "var(--text)",
    fontSize: "0.95rem",
    lineHeight: 1.5,
    fontFamily:
      "ui-monospace, monospace",
  },

  constraintsWrap: {
    marginTop: "0.8rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  constraintItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    padding: "0.65rem",
    borderRadius: "10px",
    background: "var(--card)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    fontSize: "0.9rem",
  },

  removeConstraint: {
    width: "22px",
    height: "22px",
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
    gap: "0.4rem",
    width: "100%",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.7rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },

  primaryButtonSmall: {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.6rem 0.8rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    whiteSpace: "nowrap",
    fontSize: "0.85rem",
  },

  copyButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.35rem",
    background: "var(--card)",
    color: "var(--text)",
    border: "1px solid var(--border)",
    padding: "0.6rem 0.8rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },

  deleteButton: {
    width: "38px",
    height: "38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
    border: "1px solid #dc2626",
    background: "transparent",
    color: "#dc2626",
    cursor: "pointer",
  },

  flagsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
    overflowY: "auto",
  },

  flag: {
    width: "100%",
    padding: "0.6rem 0.7rem",
    borderRadius: "9px",
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
    cursor: "pointer",
    textAlign: "left",
    wordBreak: "break-word",
    fontSize: "0.85rem",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    border: "1px solid var(--border)",
    borderRadius: "10px",
    padding: "0.65rem 0.75rem",
    background: "var(--card)",
  },

  searchInput: {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "var(--text)",
    fontSize: "0.9rem",
  },

  promptsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.45rem",
    overflowY: "auto",
    maxHeight: "520px",
  },

  promptCard: {
    background: "var(--card)",
    color: "var(--text)",
    borderRadius: "10px",
    padding: "0.55rem",
    display: "flex",
    alignItems: "flex-start",
    gap: "0.45rem",
  },

  promptContent: {
    flex: 1,
    background: "transparent",
    border: "none",
    color: "var(--text)",
    textAlign: "left",
    cursor: "pointer",
    minWidth: 0,
  },

  cardDelete: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
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
    lineHeight: 1.4,
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    wordBreak: "break-word",
    fontSize: "0.85rem",
  },

  empty: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--muted)",
    textAlign: "center",
  },

  emptyWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.6rem",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: "0.8rem",
  },

  modal: {
    width: "100%",
    maxWidth: "400px",
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "18px",
    padding: "1rem",
  },

  modalTitle: {
    fontSize: "1rem",
    fontWeight: "bold",
    color: "var(--text)",
  },

  modalInput: {
    width: "100%",
    marginTop: "0.8rem",
    padding: "0.8rem",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    outline: "none",
    fontSize: "0.9rem",
  },

  modalActions: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: "0.5rem",
    marginTop: "1rem",
    flexWrap: "wrap",
  },

  cancelButton: {
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    padding: "0.7rem 0.9rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "0.85rem",
  },

  saveButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.7rem 0.9rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.85rem",
  },

  confirmDelete: {
    background: "#dc2626",
    color: "#fff",
    border: "none",
    padding: "0.7rem 0.9rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.85rem",
  },
};