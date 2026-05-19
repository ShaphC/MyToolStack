"use client";

import { useEffect, useState } from "react";

import {
  Check,
  Copy,
  Loader2,
  Sparkles,
  Wand2,
} from "lucide-react";

import PageLayout from "@/app/components/PageLayout";
import VoiceRecorder from "@/app/components/write-now/VoiceRecorder";
import { writingPresets } from "@/app/lib/write-now/presets";

export default function MomentumPage() {
  const [thoughts, setThoughts] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [copied, setCopied] = useState(false);
  const [preset, setPreset] = useState("atomicEssay");

  const [flow, setFlow] = useState<
    | "idle"
    | "ideas-loading"
    | "ideas-ready"
    | "draft-loading"
    | "draft-ready"
  >("idle");

  const [doneMessage, setDoneMessage] =
    useState("");

  const [thinkingStep, setThinkingStep] =
    useState("");

  const isBusy =
    flow === "ideas-loading" ||
    flow === "draft-loading";

  useEffect(() => {
    if (flow === "ideas-loading") {
      const steps = [
        "Analyzing thoughts...",
        "Finding themes...",
        "Extracting emotional tension...",
        "Generating writing angles...",
      ];

      let index = 0;

      setThinkingStep(steps[0]);

      const interval = setInterval(() => {
        index =
          (index + 1) % steps.length;

        setThinkingStep(steps[index]);
      }, 1800);

      return () =>
        clearInterval(interval);
    }

    if (flow === "draft-loading") {
      const steps = [
        "Structuring ideas...",
        "Writing opening...",
        "Refining clarity...",
        "Polishing final draft...",
      ];

      let index = 0;

      setThinkingStep(steps[0]);

      const interval = setInterval(() => {
        index =
          (index + 1) % steps.length;

        setThinkingStep(steps[index]);
      }, 1800);

      return () =>
        clearInterval(interval);
    }
  }, [flow]);

  const showDone = (msg: string) => {
    setDoneMessage(msg);

    setTimeout(() => {
      setDoneMessage("");
    }, 1800);
  };

  const generateIdeas = async () => {
    if (!thoughts.trim()) return;

    setFlow("ideas-loading");

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
            mode: "ideas",
            message: `
You are an elite writing coach.

Extract:
- themes
- emotional tension
- writing angles

Return ONLY JSON:

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

      setFlow("ideas-ready");

      showDone("Ideas Ready");
    } catch (err) {
      console.error(err);

      setFlow("idle");
    }
  };

  const generateDraft = async (
    idea: string
  ) => {
    setFlow("draft-loading");

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
            mode: "draft",
            preset,
            message: `
Write an Atomic Essay.

Rules:
- 250–350 words
- one core idea
- conversational
- concise
- modern formatting

Topic:
${idea}
            `,
          }),
        }
      );

      const data =
        await response.json();

      setDraft(data.response);

      setFlow("draft-ready");

      showDone("Draft Complete");
    } catch (err) {
      console.error(err);

      setFlow("ideas-ready");
    }
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
              WriteNow
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
                  disabled={isBusy}
                />

                <div
                  style={styles.cardSubtitle}
                >
                  What are you thinking
                  about today?
                </div>
              </div>
            </div>

            {/* PRESETS */}

            <div style={styles.presetRow}>
              {Object.entries(
                writingPresets
              ).map(([key, value]) => (
                <button
                  key={key}
                  disabled={isBusy}
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

                    opacity: isBusy
                      ? 0.7
                      : 1,
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
              disabled={isBusy}
            />

            <button
              onClick={generateIdeas}
              disabled={isBusy}
              style={{
                ...styles.primaryButton,
                opacity: isBusy
                  ? 0.7
                  : 1,
              }}
            >
              {flow ===
              "ideas-loading" ? (
                <Loader2
                  size={18}
                  className="spin"
                />
              ) : (
                <Sparkles size={18} />
              )}

              {flow ===
              "ideas-loading"
                ? "Thinking..."
                : "Generate Ideas"}
            </button>
          </div>

          {/* IDEAS */}

          {(flow ===
            "ideas-loading" ||
            flow ===
              "ideas-ready") && (
            <div style={styles.section}>
              <div
                style={styles.sectionTitle}
              >
                Suggested Angles
              </div>

              {flow ===
                "ideas-loading" && (
                <div
                  style={
                    styles.loadingCard
                  }
                >
                  <Loader2
                    className="spin"
                    size={28}
                  />

                  <div
                    style={
                      styles.loadingText
                    }
                  >
                    {thinkingStep}
                  </div>
                </div>
              )}

              {flow ===
                "ideas-ready" && (
                <div
                  style={styles.ideaGrid}
                >
                  {ideas.map(
                    (idea, index) => (
                      <button
                        key={index}
                        disabled={
                          isBusy
                        }
                        onClick={() =>
                          generateDraft(
                            idea
                          )
                        }
                        style={
                          styles.ideaCard
                        }
                      >
                        <Wand2
                          size={18}
                        />

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
              )}
            </div>
          )}

          {/* DRAFT */}

          {(flow ===
            "draft-loading" ||
            flow ===
              "draft-ready") && (
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
                  disabled={isBusy}
                  style={{
                    ...styles.secondaryButton,
                    opacity: isBusy
                      ? 0.7
                      : 1,
                  }}
                >
                  <Copy size={16} />

                  {copied
                    ? "Copied"
                    : "Copy"}
                </button>
              </div>

              {flow ===
                "draft-loading" && (
                <div
                  style={
                    styles.loadingCard
                  }
                >
                  <Loader2
                    className="spin"
                    size={28}
                  />

                  <div
                    style={
                      styles.loadingText
                    }
                  >
                    {thinkingStep}
                  </div>
                </div>
              )}

              {flow ===
                "draft-ready" && (
                <textarea
                  value={draft}
                  onChange={(e) =>
                    setDraft(
                      e.target.value
                    )
                  }
                  style={
                    styles.draftEditor
                  }
                  disabled={isBusy}
                />
              )}
            </div>
          )}
        </div>

        {/* DONE TOAST */}

        {doneMessage && (
          <div style={styles.doneToast}>
            <Check size={16} />
            {doneMessage}
          </div>
        )}

        <style jsx>{`
          .spin {
            animation: spin 1s linear
              infinite;
            transform-origin: center;
            display: inline-block;
            will-change: transform;
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
    fontSize: "3.5rem",
    fontWeight: "bold",
    letterSpacing: "-0.05em",
    color: "var(--text)",
  },

  subtitle: {
    marginTop: "0.75rem",
    fontSize: "1.05rem",
    color: "var(--muted)",
    maxWidth: "620px",
    lineHeight: 1.7,
  },

  card: {
    border: "1px solid var(--border)",
    background: "var(--card)",
    borderRadius: "24px",
    padding: "1.5rem",
    width: "100%",
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
    boxSizing: "border-box",
  },

  draftEditor: {
    width: "100%",
    minHeight: "520px",
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
    boxSizing: "border-box",
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
    minWidth: "220px",
    height: "48px",
    whiteSpace: "nowrap",
  },

  secondaryButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.5rem",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    padding: "0.85rem 1rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
    minWidth: "120px",
    height: "42px",
    whiteSpace: "nowrap",
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  sectionTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    color: "var(--text)",
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
    minHeight: "120px",
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
    minHeight: "40px",
    minWidth: "120px",
    whiteSpace: "nowrap",
  },

  loadingCard: {
    border: "1px solid var(--border)",
    background: "var(--card)",
    borderRadius: "20px",
    minHeight: "180px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
  },

  loadingText: {
    color: "var(--muted)",
    fontSize: "0.95rem",
    fontWeight: 500,
  },

  doneToast: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    background: "#2563eb",
    color: "#fff",
    padding: "0.85rem 1rem",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    fontWeight: "bold",
    zIndex: 9999,
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.2)",
  },
};