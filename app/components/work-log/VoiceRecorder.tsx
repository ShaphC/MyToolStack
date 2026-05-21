"use client";

import { useRef, useState } from "react";

import {
  Loader2,
  Mic,
  Square,
} from "lucide-react";

type Props = {
  onTranscript: (text: string) => void;
};

export default function VoiceRecorder({
  onTranscript,
}: Props) {
  const [recording, setRecording] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const mediaRecorderRef =
    useRef<MediaRecorder | null>(null);

  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream =
      await navigator.mediaDevices.getUserMedia(
        {
          audio: true,
        }
      );

    const mediaRecorder =
      new MediaRecorder(stream);

    mediaRecorderRef.current =
      mediaRecorder;

    chunksRef.current = [];

    mediaRecorder.ondataavailable = (
      event
    ) => {
      chunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = async () => {
      setLoading(true);

      const blob = new Blob(
        chunksRef.current,
        {
          type: "audio/webm",
        }
      );

      const formData =
        new FormData();

      formData.append(
        "file",
        blob,
        "recording.webm"
      );

      try {
        const response = await fetch(
          "/api/ai/transcribe",
          {
            method: "POST",
            body: formData,
          }
        );

        const data =
          await response.json();

        onTranscript(
          data.text || ""
        );
      } catch (err) {
        console.error(err);
      }

      setLoading(false);
    };

    mediaRecorder.start();

    setRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();

    setRecording(false);
  };

  return (
    <div style={styles.container}>
      {!recording ? (
        <button
          onClick={startRecording}
          style={styles.button}
        >
          <Mic size={18} />
          Record
        </button>
      ) : (
        <button
          onClick={stopRecording}
          style={{
            ...styles.button,
            background: "#dc2626",
          }}
        >
          <Square size={16} />
          Stop
        </button>
      )}

      {loading && (
        <div style={styles.loading}>
          <Loader2
            size={18}
            className="spin"
          />
          Transcribing...
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
      `}</style>
    </div>
  );
}

const styles: any = {
  container: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    marginTop: "1rem",
  },

  button: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    border: "none",
    background: "#2563eb",
    color: "#fff",
    padding: "0.9rem 1rem",
    borderRadius: "14px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  loading: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    color: "var(--muted)",
  },
};