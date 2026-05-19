"use client";

import { useState } from "react";

import {
  Copy,
  Loader2,
  Mic,
  Sparkles,
  Wand2,
} from "lucide-react";

import PageLayout from "@/app/components/PageLayout";

import VoiceRecorder from "@/app/components/write-now/VoiceRecorder";

import { writingPresets } from "@/app/lib/write-now/presets";

export default function MomentumPage() {
  const [thoughts, setThoughts] =
    useState("");

  const [ideas, setIdeas] = useState<
    string[]
  >([]);

  const [draft, setDraft] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [copied, setCopied] =
    useState(false);

  const [preset, setPreset] =
    useState("atomicEssay"); 

  const generateIdeas = async () => {
    if (!thoughts.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "/api/ai/write-now",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: `
You are an elite writing coach.

The user is sharing raw thoughts.

Your job:
- identify themes
- identify emotional tension
- identify interesting insights
- identify strong writing angles

Return ONLY valid JSON.

{
  "ideas": [
    "idea 1",
    "idea 2",
    "idea 3",
    "idea 4"
  ]
}

USER INPUT:
${thoughts}
            `,
          }),
        }
      );

      const data =
        await response.json();

      const parsed = JSON.parse(
        data.response
      );

      setIdeas(parsed.ideas || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const generateDraft = async (
    idea: string
  ) => {
    setLoading(true);

    try {
      const response = await fetch(
        "/api/ai/write-now",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: `
You are an expert internet writer.

Write an Atomic Essay.

Rules:
- 250-350 words
- one core idea
- sharp insight
- conversational
- concise
- modern writing style
- visually clean formatting

Topic:
${idea}
            `,
          }),
        }
      );

      const data =
        await response.json();

      setDraft(data.response);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  const copyDraft = async () => {
    await navigator.clipboard.writeText(
      draft
    );

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1500);
  };

  return (
    <PageLayout>
      <main style={styles.page}>
        <div style={styles.container}>
          {/* HERO */}

          <div style={styles.hero}>
            <div style={styles.badge}>
              Daily Writing System
            </div>

            <h1 style={styles.title}>
              Momentum
            </h1>

            <p style={styles.subtitle}>
              Turn scattered thoughts
              into consistent writing.
            </p>
          </div>

          {/* CHECK IN */}

          <div style={styles.card}>
            <div style={styles.cardTop}>
              <div>
                <div style={styles.cardTitle}>
                  Daily Check-In
                </div>

                <VoiceRecorder
                  onTranscript={(text) =>
                    setThoughts((prev) =>
                      prev
                        ? `${prev}\n\n${text}`
                        : text
                    )
                  }
                />

                <div
                  style={styles.cardSubtitle}
                >
                  What are you thinking
                  about today?
                </div>
              </div>
            </div>

            <div style={styles.presetRow}>
              {Object.entries(
                writingPresets
              ).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() =>
                    setPreset(key)
                  }
                  style={{
                    ...styles.presetButton,

                    background:
                      preset === key
                        ? "#2563eb"
                        : "var(--card)",

                    color:
                      preset === key
                        ? "#fff"
                        : "var(--text)",
                  }}
                >
                  {value.label}
                </button>
              ))}
            </div>

            <textarea
              value={thoughts}
              onChange={(e) =>
                setThoughts(
                  e.target.value
                )
              }
              placeholder="What's on your mind?"
              style={styles.textarea}
            />

            <button
              onClick={generateIdeas}
              disabled={loading}
              style={styles.primaryButton}
            >
              {loading ? (
                <Loader2
                  size={18}
                  className="spin"
                />
              ) : (
                <Sparkles size={18} />
              )}

              Generate Writing Ideas
            </button>
          </div>

          {/* IDEAS */}

          {ideas.length > 0 && (
            <div style={styles.section}>
              <div style={styles.sectionTop}>
                <div>
                  <div
                    style={
                      styles.sectionTitle
                    }
                  >
                    Suggested Angles
                  </div>

                  <div
                    style={
                      styles.sectionSubtitle
                    }
                  >
                    Pick a direction to
                    expand.
                  </div>
                </div>
              </div>

              <div style={styles.ideaGrid}>
                {ideas.map(
                  (idea, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        generateDraft(
                          idea
                        )
                      }
                      style={styles.ideaCard}
                    >
                      <Wand2 size={18} />

                      <div
                        style={
                          styles.ideaText
                        }
                      >
                        {idea}
                      </div>
                    </button>
                  )
                )}
              </div>
            </div>
          )}

          {/* DRAFT */}

          {draft && (
            <div style={styles.card}>
              <div style={styles.draftTop}>
                <div>
                  <div
                    style={
                      styles.cardTitle
                    }
                  >
                    Draft
                  </div>

                  <div
                    style={
                      styles.cardSubtitle
                    }
                  >
                    Edit and refine your
                    writing.
                  </div>
                </div>

                <button
                  onClick={copyDraft}
                  style={
                    styles.secondaryButton
                  }
                >
                  <Copy size={16} />

                  {copied
                    ? "Copied"
                    : "Copy"}
                </button>
              </div>

              <textarea
                value={draft}
                onChange={(e) =>
                  setDraft(
                    e.target.value
                  )
                }
                style={styles.draftEditor}
              />
            </div>
          )}
        </div>

        <style jsx>{`
          .spin {
            animation: spin 1s linear
              infinite;
          }

          @keyframes spin {
            from {
              transform: rotate(
                0deg
              );
            }

            to {
              transform: rotate(
                360deg
              );
            }
          }
        `}</style>
      </main>
    </PageLayout>
  );
}

const styles: any = {
  page: {
    padding: "2rem",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  hero: {
    marginBottom: "1rem",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    padding: "0.45rem 0.8rem",
    borderRadius: "999px",
    background:
      "rgba(37,99,235,0.12)",
    color: "#60a5fa",
    fontSize: "0.85rem",
    fontWeight: "bold",
    border:
      "1px solid rgba(37,99,235,0.2)",
  },

  title: {
    marginTop: "1rem",
    fontSize: "3rem",
    fontWeight: "bold",
    letterSpacing: "-0.04em",
    color: "var(--text)",
  },

  subtitle: {
    marginTop: "0.75rem",
    fontSize: "1.05rem",
    color: "var(--muted)",
    maxWidth: "620px",
    lineHeight: 1.7,
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  sectionTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },

  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "var(--text)",
  },

  sectionSubtitle: {
    marginTop: "0.35rem",
    color: "var(--muted)",
    fontSize: "0.95rem",
  },

  card: {
    border: "1px solid var(--border)",
    background: "var(--card)",
    borderRadius: "24px",
    padding: "1.5rem",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },

  draftTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },

  cardTitle: {
    fontSize: "1.15rem",
    fontWeight: "bold",
    color: "var(--text)",
  },

  cardSubtitle: {
    marginTop: "0.35rem",
    color: "var(--muted)",
    fontSize: "0.95rem",
  },

  textarea: {
    width: "100%",
    minHeight: "220px",
    borderRadius: "18px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    padding: "1.25rem",
    resize: "vertical",
    outline: "none",
    fontSize: "1rem",
    lineHeight: 1.8,
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, monospace",
  },

  draftEditor: {
    width: "100%",
    minHeight: "500px",
    borderRadius: "18px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    padding: "1.5rem",
    resize: "vertical",
    outline: "none",
    fontSize: "1rem",
    lineHeight: 1.9,
    fontFamily:
      "ui-monospace, SFMono-Regular, Menlo, monospace",
  },

  primaryButton: {
    marginTop: "1rem",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.75rem",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "1rem 1.25rem",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.95rem",
  },

  secondaryButton: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    padding: "0.85rem 1rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  ideaGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(260px,1fr))",
    gap: "1rem",
  },

  ideaCard: {
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
    borderRadius: "18px",
    padding: "1.2rem",
    cursor: "pointer",
    textAlign: "left",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    transition: "0.2s ease",
  },

  ideaText: {
    lineHeight: 1.7,
    fontSize: "0.97rem",
    wordBreak: "break-word",
  },

  presetRow: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
    marginBottom: "1rem",
  },

  presetButton: {
    border: "1px solid var(--border)",
    padding: "0.75rem 1rem",
    borderRadius: "999px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};