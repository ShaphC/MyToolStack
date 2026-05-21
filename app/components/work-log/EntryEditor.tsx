"use client";

import { useState } from "react";

import {
  Loader2,
  Sparkles,
} from "lucide-react";

import VoiceRecorder from "./VoiceRecorder";

type Props = {
  onSave: (entry: any) => void;
};

export default function EntryEditor({
  onSave,
}: Props) {
  const [text, setText] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const processEntry = async () => {
    if (!text.trim()) return;

    setLoading(true);

    try {
      const response = await fetch(
        "/api/ai/worklog",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            message: text,
          }),
        }
      );

      const data =
        await response.json();

      const parsed = JSON.parse(
        data.response
      );

      onSave({
        id: crypto.randomUUID(),

        rawInput: text,

        ...parsed,

        createdAt:
          new Date().toISOString(),
      });

      setText("");
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.card}>
      <div style={styles.title}>
        New Work Entry
      </div>

      <VoiceRecorder
        onTranscript={(value) =>
          setText((prev) =>
            prev
              ? `${prev}\n\n${value}`
              : value
          )
        }
      />

      <textarea
        value={text}
        onChange={(e) =>
          setText(e.target.value)
        }
        placeholder="Describe your work..."
        style={styles.textarea}
      />

      <button
        onClick={processEntry}
        disabled={loading}
        style={styles.button}
      >
        {loading ? (
          <Loader2
            className="spin"
            size={18}
          />
        ) : (
          <Sparkles size={18} />
        )}

        Process Entry
      </button>

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
      `}</style>
    </div>
  );
}

const styles: any = {
  card: {
    border: "1px solid var(--border)",
    background: "var(--card)",
    borderRadius: "20px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  title: {
    fontSize: "1.1rem",
    fontWeight: "bold",
  },

  textarea: {
    width: "100%",
    minHeight: "220px",
    borderRadius: "16px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    padding: "1rem",
    resize: "vertical",
  },

  button: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.6rem",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "14px",
    padding: "1rem",
    fontWeight: "bold",
    cursor: "pointer",
  },
};