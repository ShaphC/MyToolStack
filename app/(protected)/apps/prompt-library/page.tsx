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

  const [
    showFlagsMobileModal,
    setShowFlagsMobileModal,
  ] = useState(false);

  const [
    showPromptsMobileModal,
    setShowPromptsMobileModal,
  ] = useState(false);

  const [
    reopenPromptsModal,
    setReopenPromptsModal,
  ] = useState(false);

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
      <main style={styles.page}>
        <div style={styles.backgroundGlow} />
        {/* HERO */}
        <div style={styles.hero}>
          <div style={styles.heroBadge}>
            ✨ AI Writing Workspace
          </div>

          <h1 style={styles.title}>
            Prompt Library
          </h1>

          <p style={styles.subtitle}>
            Build reusable prompts,
            constraints, and AI workflows
            in one organized workspace.
          </p>
        </div>

        {/* MOBILE TOP */}
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

        {/* MAIN GRID */}
        <div style={styles.container}>
          {/* FLAGS */}
          <aside
            className="desktop-sidebar"
            style={styles.sidebar}
          >
            <div style={styles.sidebarCard}>
              <button
                onClick={() =>
                  setShowFlagModal(true)
                }
                style={styles.primaryButton}
              >
                <Plus size={15} />
                New Flag
              </button>

              <div style={styles.sidebarTitle}>
                Constraints
              </div>

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
          <aside
            className="desktop-sidebar"
            style={styles.sidebar}
          >
            <div style={styles.sidebarCard}>
              <div style={styles.searchBox}>
                <Search size={14} />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search..."
                  style={styles.searchInput}
                />
              </div>

              <div style={styles.sidebarTitle}>
                Saved Prompts
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
                            ? "1px solid rgba(59,130,246,0.5)"
                            : "1px solid rgba(255,255,255,0.06)",
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

                          setReopenPromptsModal(
                            true
                          );

                          setDeleteId(
                            prompt.id
                          );
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
            </div>
          </aside>
        </div>

        {/* MOBILE FLAGS MODAL */}
        {showFlagsMobileModal && (
          <div style={styles.overlay}>
            <div style={styles.mobileSheet}>
              <div style={styles.modalTop}>
                <h2 style={styles.modalTitle}>
                  Flags
                </h2>

                <button
                  onClick={() =>
                    setShowFlagsMobileModal(
                      false
                    )
                  }
                  style={
                    styles.closeModalButton
                  }
                >
                  <X size={16} />
                </button>
              </div>

              <button
                onClick={() =>
                  setShowFlagModal(true)
                }
                style={styles.primaryButton}
              >
                <Plus size={15} />
                New Flag
              </button>

              <div style={styles.flagsList}>
                {flags.map((flag) => (
                  <button
                    key={flag.id}
                    onClick={() => {
                      addFlagToConstraints(
                        flag
                      );

                      setShowFlagsMobileModal(
                        false
                      );
                    }}
                    style={styles.flag}
                  >
                    {flag.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MOBILE PROMPTS MODAL */}
        {showPromptsMobileModal && (
          <div style={styles.overlay}>
            <div style={styles.mobileSheet}>
              <div style={styles.modalTop}>
                <h2 style={styles.modalTitle}>
                  Prompts
                </h2>

                <button
                  onClick={() =>
                    setShowPromptsMobileModal(
                      false
                    )
                  }
                  style={
                    styles.closeModalButton
                  }
                >
                  <X size={16} />
                </button>
              </div>

              <div style={styles.searchBox}>
                <Search size={14} />

                <input
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
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
                      style={
                        styles.promptCard
                      }
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
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

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
                    setShowFlagModal(false)
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

                    if (
                      reopenPromptsModal
                    ) {
                      setShowPromptsMobileModal(
                        true
                      );

                      setReopenPromptsModal(
                        false
                      );
                    }
                  }}
                  style={styles.cancelButton}
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    await deletePrompt(
                      deleteId
                    );

                    setReopenPromptsModal(
                      false
                    );
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
            .desktop-sidebar {
              display: none !important;
            }

            .mobile-top {
              display: flex !important;
            }
          }
        `}</style>
      </main>
    </PageLayout>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: `
      radial-gradient(
        circle at top,
        rgba(37,99,235,0.10),
        rgba(0,0,0,0) 40%
      ),
      radial-gradient(
        circle at bottom,
        rgba(168,85,247,0.08),
        rgba(0,0,0,0) 50%
      ),
      var(--bg)
    `,
    color: "var(--text)",
    padding: "1.25rem 1.25rem 2rem",
    overflowX: "hidden",
  },

  hero: {
    marginBottom: "1rem",
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.9rem",
    borderRadius: "999px",
    border:
      "1px solid rgba(59,130,246,0.22)",
    background:
      "rgba(37,99,235,0.08)",
    color: "#60a5fa",
    fontSize: "0.82rem",
    fontWeight: 700,
    marginBottom: "0.7rem",
  },

  title: {
    fontSize:
      "clamp(2rem, 5vw, 3.2rem)",
    fontWeight: 800,
    letterSpacing: "-0.05em",
    marginBottom: "0.55rem",
    lineHeight: 1,
  },

  subtitle: {
    color: "var(--muted)",
    lineHeight: 1.7,
    maxWidth: "720px",
    fontSize: "1rem",
  },

  mobileTop: {
    display: "none",
    gap: "0.7rem",
    marginBottom: "1rem",
  },

  mobileMenuButton: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.45rem",
    padding: "0.9rem",
    borderRadius: "16px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.04)",
    color: "var(--text)",
    cursor: "pointer",
    fontWeight: 600,
  },

  container: {
    display: "grid",
    gridTemplateColumns: "240px minmax(0,1fr) 320px",
    gap: "1.2rem",
    alignItems: "stretch",
    position: "relative",
    zIndex: 1,
  },

  backgroundGlow: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    background: `
      radial-gradient(
        circle at 20% 10%,
        rgba(59,130,246,0.10),
        transparent 40%
      ),
      radial-gradient(
        circle at 80% 80%,
        rgba(168,85,247,0.08),
        transparent 45%
      )
    `,
    zIndex: 0,
  },

  sidebar: {
    minHeight: 0,
  },

  sidebarCard: {
    height: "calc(100vh - 260px)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1rem",
    borderRadius: "28px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.04)",
    backdropFilter: "blur(18px)",
    overflow: "hidden",
  },

  sidebarTitle: {
    fontWeight: 700,
    fontSize: "0.95rem",
  },

  editor: {
    height: "calc(100vh - 260px)",
    display: "flex",
    flexDirection: "column",
    borderRadius: "32px",
    padding: "1.5rem",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.04)",
    backdropFilter: "blur(18px)",
    overflow: "hidden",
    minWidth: 0,
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "1rem",
    flexWrap: "wrap",
  },

  leftTop: {
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
  },

  saveState: {
    color: "var(--muted)",
    fontSize: "0.85rem",
  },

  actions: {
    display: "flex",
    gap: "0.6rem",
  },

  promptInput: {
    flex: 1,
    width: "100%",
    border: "none",
    outline: "none",
    resize: "none",
    background: "transparent",
    color: "var(--text)",
    fontSize: "1rem",
    lineHeight: 1.7,
    fontFamily:
      "ui-monospace, monospace",
    overflowY: "auto",
  },

  constraintsWrap: {
    marginTop: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
    overflowY: "auto",
  },

  constraintItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.6rem",
    padding: "0.85rem",
    borderRadius: "18px",
    background:
      "rgba(255,255,255,0.04)",
    border:
      "1px solid rgba(255,255,255,0.06)",
    fontSize: "0.9rem",
    lineHeight: 1.5,
  },

  removeConstraint: {
    width: "24px",
    height: "24px",
    borderRadius: "999px",
    border: "none",
    background:
      "rgba(239,68,68,0.18)",
    color: "#f87171",
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
    gap: "0.45rem",
    width: "100%",
    padding: "0.9rem",
    borderRadius: "16px",
    border: "none",
    background:
      "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    boxShadow:
      "0 10px 30px rgba(37,99,235,0.28)",
  },

  primaryButtonSmall: {
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    border: "none",
    borderRadius: "14px",
    padding: "0.8rem 1rem",
    background:
      "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },

  copyButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.45rem",
    border:
      "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "0.8rem 1rem",
    background:
      "rgba(255,255,255,0.04)",
    color: "var(--text)",
    cursor: "pointer",
    fontWeight: 600,
  },

  deleteButton: {
    width: "46px",
    height: "46px",
    borderRadius: "14px",
    border:
      "1px solid rgba(239,68,68,0.2)",
    background:
      "rgba(239,68,68,0.08)",
    color: "#f87171",
    cursor: "pointer",
  },

  flagsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
    overflowY: "auto",
  },

  flag: {
    width: "100%",
    padding: "0.85rem",
    borderRadius: "16px",
    border:
      "1px solid rgba(255,255,255,0.06)",
    background:
      "rgba(255,255,255,0.03)",
    color: "var(--text)",
    cursor: "pointer",
    textAlign: "left",
    wordBreak: "break-word",
    fontSize: "0.88rem",
    transition: "all 0.2s ease",
  },

  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    padding: "0.85rem 1rem",
    borderRadius: "16px",
    border:
      "1px solid rgba(255,255,255,0.06)",
    background:
      "rgba(255,255,255,0.03)",
  },

  searchInput: {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "var(--text)",
    fontSize: "0.92rem",
  },

  promptsList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.7rem",
    overflowY: "auto",
  },

  promptCard: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.5rem",
    padding: "0.8rem",
    borderRadius: "18px",
    background:
      "rgba(255,255,255,0.03)",
  },

  promptContent: {
    flex: 1,
    background: "transparent",
    border: "none",
    textAlign: "left",
    cursor: "pointer",
    color: "var(--text)",
  },

  cardDelete: {
    width: "34px",
    height: "34px",
    borderRadius: "10px",
    border:
      "1px solid rgba(239,68,68,0.18)",
    background:
      "rgba(239,68,68,0.08)",
    color: "#f87171",
    cursor: "pointer",
    flexShrink: 0,
  },

  promptPreview: {
    lineHeight: 1.5,
    display: "-webkit-box",
    WebkitLineClamp: 4,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    wordBreak: "break-word",
    fontSize: "0.88rem",
  },

  empty: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "var(--muted)",
  },

  emptyWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1rem",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
    padding: "1rem",
  },

  modal: {
    width: "100%",
    maxWidth: "420px",
    padding: "1.4rem",
    borderRadius: "24px",
    background: "#0f172a",
    border:
      "1px solid rgba(255,255,255,0.08)",
  },

  mobileSheet: {
    width: "100%",
    maxWidth: "500px",
    maxHeight: "85vh",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    padding: "1.2rem",
    borderRadius: "28px",
    background: "#0f172a",
    border:
      "1px solid rgba(255,255,255,0.08)",
  },

  modalTop: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  closeModalButton: {
    width: "38px",
    height: "38px",
    borderRadius: "12px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.04)",
    color: "#fff",
    cursor: "pointer",
  },

  modalTitle: {
    fontSize: "1rem",
    fontWeight: 700,
  },

  modalInput: {
    width: "100%",
    marginTop: "1rem",
    padding: "0.9rem",
    borderRadius: "14px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.04)",
    color: "#fff",
    outline: "none",
  },

  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "0.7rem",
    marginTop: "1rem",
  },

  cancelButton: {
    padding: "0.85rem 1rem",
    borderRadius: "14px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
  },

  saveButton: {
    padding: "0.85rem 1rem",
    borderRadius: "14px",
    border: "none",
    background:
      "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },

  confirmDelete: {
    padding: "0.85rem 1rem",
    borderRadius: "14px",
    border: "none",
    background: "#dc2626",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
};