"use client";

import { useEffect, useState } from "react";
import Navbar from "@/app/components/NavBar";

type Template = {
  name: string;
  content: string;
};

export default function MessageRepeater() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selected, setSelected] = useState<Template | null>(null);

  const [templateName, setTemplateName] = useState("");
  const [templateContent, setTemplateContent] = useState("");

  const [variables, setVariables] = useState<string[]>([]);
  const [valuesList, setValuesList] = useState<any[]>([{}]);
  const [outputs, setOutputs] = useState<string[]>([]);

  const [error, setError] = useState("");
  const [copied, setCopied] = useState<number | null>(null);

  /* ---------------- LOAD ---------------- */

  useEffect(() => {
    const saved = localStorage.getItem("msgTemplates");

    if (saved) {
      setTemplates(JSON.parse(saved));
    }
  }, []);

  /* ---------------- SAVE ---------------- */

  useEffect(() => {
    localStorage.setItem(
      "msgTemplates",
      JSON.stringify(templates)
    );
  }, [templates]);

  /* ---------------- HELPERS ---------------- */

  const extractVariables = (text: string) => {
    const matches = [...text.matchAll(/{(.*?)}/g)];

    return [...new Set(matches.map((m) => m[1]))];
  };

  const selectTemplate = (t: Template) => {
    setSelected(t);

    const vars = extractVariables(t.content);

    setVariables(vars);

    setValuesList([{}]);

    setOutputs([]);
  };

  const addTemplate = () => {
    if (!templateName.trim()) {
      setError("Template name is required");
      return;
    }

    if (!templateContent.trim()) {
      setError("Template content cannot be empty");
      return;
    }

    setTemplates((prev) => [
      ...prev,
      {
        name: templateName,
        content: templateContent,
      },
    ]);

    setTemplateName("");
    setTemplateContent("");
    setError("");
  };

  const updateValue = (
    rowIndex: number,
    key: string,
    value: string
  ) => {
    const updated = [...valuesList];

    updated[rowIndex][key] = value;

    setValuesList(updated);
  };

  const addRow = () => {
    setValuesList([...valuesList, {}]);
  };

  const generateMessages = () => {
    if (!selected) {
      setError("Select a template first");
      return;
    }

    const results = valuesList.map((row) => {
      let msg = selected.content;

      variables.forEach((v) => {
        msg = msg.replaceAll(
          `{${v}}`,
          row[v] || ""
        );
      });

      return msg;
    });

    setOutputs(results);

    setError("");
  };

  const copyToClipboard = async (
    text: string,
    index: number
  ) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopied(index);

      setTimeout(() => {
        setCopied(null);
      }, 1500);
    } catch {
      console.log("Copy failed");
    }
  };

  const deleteTemplate = (name: string) => {
    const updated = templates.filter(
      (t) => t.name !== name
    );

    setTemplates(updated);

    if (selected?.name === name) {
      setSelected(null);
      setVariables([]);
      setOutputs([]);
    }
  };

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <div style={styles.backgroundGlow} />

        <div style={styles.container}>
          {/* HERO */}

          <div style={styles.hero}>
            <div style={styles.iconWrap}>
              📨
            </div>

            <h1 style={styles.title}>
              Message Repeater
            </h1>

            <p style={styles.subtitle}>
              Create reusable templates and
              instantly generate personalized
              messages at scale.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div style={styles.error}>
              ⚠ {error}
            </div>
          )}

          {/* CREATE TEMPLATE */}

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                Create Template
              </h2>

              <div style={styles.cardBadge}>
                Variables Supported
              </div>
            </div>

            <input
              placeholder="Template name"
              value={templateName}
              onChange={(e) =>
                setTemplateName(e.target.value)
              }
              style={styles.input}
            />

            <textarea
              placeholder="Example: Hey {name}, thanks for reaching out..."
              value={templateContent}
              onChange={(e) =>
                setTemplateContent(
                  e.target.value
                )
              }
              style={styles.textarea}
            />

            <div style={styles.tip}>
              Use variables like{" "}
              <span style={styles.code}>
                {"{name}"}
              </span>{" "}
              or{" "}
              <span style={styles.code}>
                {"{company}"}
              </span>
            </div>

            <button
              onClick={addTemplate}
              style={styles.primaryBtn}
            >
              Save Template
            </button>
          </div>

          {/* TEMPLATE LIST */}

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <h2 style={styles.cardTitle}>
                Templates
              </h2>

              <div style={styles.cardBadge}>
                {templates.length}
              </div>
            </div>

            {templates.length === 0 && (
              <div style={styles.empty}>
                No templates created yet.
              </div>
            )}

            <div style={styles.templateGrid}>
              {templates.map((t, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.templateCard,
                    ...(selected?.name ===
                    t.name
                      ? styles.templateActive
                      : {}),
                  }}
                >
                  <div
                    onClick={() =>
                      selectTemplate(t)
                    }
                    style={{
                      flex: 1,
                      cursor: "pointer",
                    }}
                  >
                    <div
                      style={
                        styles.templateName
                      }
                    >
                      {t.name}
                    </div>

                    <div
                      style={
                        styles.templatePreview
                      }
                    >
                      {t.content.slice(
                        0,
                        80
                      )}
                      ...
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      deleteTemplate(
                        t.name
                      )
                    }
                    style={styles.deleteBtn}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* VARIABLES */}

          {selected && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  Fill Variables
                </h2>

                <div style={styles.cardBadge}>
                  {variables.length} fields
                </div>
              </div>

              {valuesList.map(
                (row, rowIndex) => (
                  <div
                    key={rowIndex}
                    style={styles.row}
                  >
                    {variables.map((v) => (
                      <input
                        key={v}
                        placeholder={v}
                        value={row[v] || ""}
                        onChange={(e) =>
                          updateValue(
                            rowIndex,
                            v,
                            e.target.value
                          )
                        }
                        style={
                          styles.input
                        }
                      />
                    ))}
                  </div>
                )
              )}

              <div style={styles.buttonRow}>
                <button
                  onClick={addRow}
                  style={
                    styles.secondaryBtn
                  }
                >
                  + Add Row
                </button>

                <button
                  onClick={
                    generateMessages
                  }
                  style={
                    styles.primaryBtn
                  }
                >
                  Generate Messages
                </button>
              </div>
            </div>
          )}

          {/* OUTPUT */}

          {outputs.length > 0 && (
            <div style={styles.card}>
              <div style={styles.cardHeader}>
                <h2 style={styles.cardTitle}>
                  Generated Messages
                </h2>

                <div style={styles.cardBadge}>
                  {outputs.length}
                </div>
              </div>

              <div style={styles.outputs}>
                {outputs.map((msg, i) => (
                  <div
                    key={i}
                    style={styles.outputCard}
                  >
                    <div
                      style={
                        styles.outputText
                      }
                    >
                      {msg}
                    </div>

                    <button
                      onClick={() =>
                        copyToClipboard(
                          msg,
                          i
                        )
                      }
                      style={
                        styles.copyBtn
                      }
                    >
                      {copied === i
                        ? "Copied"
                        : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text)",
    padding:
      "5.5rem 1.25rem 3rem",
    position: "relative",
    overflow: "hidden",
  },

  backgroundGlow: {
    position: "absolute",
    inset: 0,

    background: `
      radial-gradient(circle at top left, rgba(37,99,235,0.16), transparent 30%),
      radial-gradient(circle at top right, rgba(59,130,246,0.12), transparent 30%),
      radial-gradient(circle at bottom center, rgba(37,99,235,0.08), transparent 40%)
    `,

    pointerEvents: "none",
  },

  container: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",

    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",

    position: "relative",
    zIndex: 1,
  },

  hero: {
    textAlign: "center",
    marginBottom: "0.5rem",
  },

  iconWrap: {
    width: "80px",
    height: "80px",

    margin: "0 auto 1rem",

    borderRadius: "24px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    fontSize: "2rem",

    background:
      "rgba(37,99,235,0.15)",

    border:
      "1px solid rgba(59,130,246,0.25)",

    boxShadow:
      "0 20px 50px rgba(37,99,235,0.22)",
  },

  title: {
    fontSize:
      "clamp(2rem, 5vw, 3rem)",

    fontWeight: 800,

    letterSpacing: "-0.04em",

    marginBottom: "0.75rem",
  },

  subtitle: {
    maxWidth: "650px",

    margin: "0 auto",

    color: "var(--muted)",

    lineHeight: 1.7,

    fontSize: "1rem",
  },

  card: {
    background:
      "rgba(255,255,255,0.04)",

    backdropFilter: "blur(18px)",

    border:
      "1px solid rgba(59,130,246,0.18)",

    borderRadius: "24px",

    padding: "1.5rem",

    display: "flex",
    flexDirection: "column",
    gap: "1rem",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.12)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },

  cardTitle: {
    fontSize: "1.15rem",
    fontWeight: 700,
  },

  cardBadge: {
    padding:
      "0.45rem 0.8rem",

    borderRadius: "999px",

    fontSize: "0.8rem",
    fontWeight: 700,

    color: "#60a5fa",

    background:
      "rgba(37,99,235,0.12)",

    border:
      "1px solid rgba(59,130,246,0.2)",
  },

  input: {
    width: "100%",

    padding:
      "0.95rem 1rem",

    borderRadius: "14px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.04)",

    color: "var(--text)",

    outline: "none",

    fontSize: "0.95rem",

    boxSizing: "border-box",
  },

  textarea: {
    width: "100%",

    minHeight: "120px",

    padding:
      "1rem 1rem",

    borderRadius: "14px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.04)",

    color: "var(--text)",

    resize: "vertical",

    outline: "none",

    lineHeight: 1.7,

    fontSize: "0.95rem",

    boxSizing: "border-box",
  },

  tip: {
    fontSize: "0.9rem",
    color: "var(--muted)",
  },

  code: {
    padding:
      "0.2rem 0.45rem",

    borderRadius: "6px",

    background:
      "rgba(37,99,235,0.12)",

    color: "#60a5fa",

    fontFamily: "monospace",
  },

  buttonRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },

  primaryBtn: {
    background:
      "linear-gradient(135deg,#2563eb,#3b82f6)",

    color: "#fff",

    border: "none",

    padding:
      "0.95rem 1.2rem",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: 700,

    boxShadow:
      "0 15px 40px rgba(37,99,235,0.3)",

    transition: "all 0.2s ease",
  },

  secondaryBtn: {
    background:
      "rgba(255,255,255,0.04)",

    color: "var(--text)",

    border:
      "1px solid rgba(255,255,255,0.08)",

    padding:
      "0.95rem 1.2rem",

    borderRadius: "14px",

    cursor: "pointer",

    fontWeight: 600,
  },

  templateGrid: {
    display: "grid",
    gap: "0.85rem",
  },

  templateCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",

    gap: "1rem",

    padding: "1rem",

    borderRadius: "16px",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background:
      "rgba(255,255,255,0.03)",

    transition: "all 0.2s ease",
  },

  templateActive: {
    border:
      "1px solid rgba(59,130,246,0.4)",

    background:
      "rgba(37,99,235,0.08)",

    boxShadow:
      "0 10px 30px rgba(37,99,235,0.15)",
  },

  templateName: {
    fontWeight: 700,
    marginBottom: "0.35rem",
  },

  templatePreview: {
    fontSize: "0.88rem",
    color: "var(--muted)",
    lineHeight: 1.5,
  },

  row: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(180px,1fr))",

    gap: "0.75rem",
  },

  outputs: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  outputCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",

    gap: "1rem",

    padding: "1rem",

    borderRadius: "16px",

    border:
      "1px solid rgba(59,130,246,0.15)",

    background:
      "rgba(255,255,255,0.03)",
  },

  outputText: {
    flex: 1,
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },

  copyBtn: {
    background:
      "rgba(37,99,235,0.12)",

    color: "#60a5fa",

    border:
      "1px solid rgba(59,130,246,0.2)",

    padding:
      "0.65rem 0.9rem",

    borderRadius: "10px",

    cursor: "pointer",

    fontWeight: 700,

    flexShrink: 0,
  },

  deleteBtn: {
    width: "36px",
    height: "36px",

    borderRadius: "10px",

    border:
      "1px solid rgba(239,68,68,0.2)",

    background:
      "rgba(239,68,68,0.08)",

    color: "#ef4444",

    cursor: "pointer",

    flexShrink: 0,
  },

  empty: {
    padding: "1rem",
    textAlign: "center",
    color: "var(--muted)",
  },

  error: {
    background:
      "rgba(239,68,68,0.12)",

    border:
      "1px solid rgba(239,68,68,0.25)",

    color: "#f87171",

    padding:
      "0.9rem 1rem",

    borderRadius: "14px",

    fontWeight: 600,
  },
};