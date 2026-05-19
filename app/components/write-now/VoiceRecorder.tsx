"use client";

import { useState, useRef } from "react";
import { Mic, Square, Loader2 } from "lucide-react";

type Props = {
  onTranscript: (text: string) => void;
  disabled?: boolean;
};

export default function VoiceRecorder({
  onTranscript,
  disabled = false,
}: Props) {
  const [recording, setRecording] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const mediaRef = useRef<any>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      const stream =
        await navigator.mediaDevices.getUserMedia(
          { audio: true }
        );

      const mediaRecorder =
        new MediaRecorder(stream);

      mediaRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (
        e
      ) => {
        chunksRef.current.push(
          e.data
        );
      };

      mediaRecorder.onstop =
        async () => {
          const blob = new Blob(
            chunksRef.current,
            {
              type: "audio/webm",
            }
          );

          await sendToServer(blob);
        };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (!mediaRef.current) return;

    mediaRef.current.stop();
    setRecording(false);
  };

  const sendToServer = async (
    blob: Blob
  ) => {
    setLoading(true);

    try {
      const form = new FormData();
      form.append("file", blob);

      const res = await fetch(
        "/api/ai/transcribe",
        {
          method: "POST",
          body: form,
        }
      );

      const data = await res.json();

      onTranscript(
        data.text || ""
      );
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div style={styles.wrapper}>
      <button
        onClick={
          recording
            ? stopRecording
            : startRecording
        }
        style={{
          ...styles.button,
          ...(recording
            ? styles.recording
            : {}),
        }}
      >
        {loading ? (
          <Loader2
            size={16}
            className="spin"
          />
        ) : recording ? (
          <Square size={16} />
        ) : (
          <Mic size={16} />
        )}

        <span>
          {loading
            ? "Processing"
            : recording
            ? "Stop"
            : "Record"}
        </span>
      </button>

      {recording && (
        <div style={styles.pulse} />
      )}
    </div>
  );
}

const styles: any = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
  },

  button: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",

    padding: "0.6rem 1rem",
    borderRadius: "999px",

    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",

    cursor: "pointer",
    fontWeight: "bold",

    transition: "all 0.2s ease",
  },

  recording: {
    border: "1px solid #ef4444",
    color: "#ef4444",
    background:
      "rgba(239,68,68,0.08)",
  },

  pulse: {
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    background: "#ef4444",
    animation: "pulse 1s infinite",
  },
};