"use client";

import { useState } from "react";
import Navbar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

type Task = {
  task: string;
  owner: string | null;
  due_date: string | null;
};

export default function ActionExtract() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [transcript, setTranscript] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);

  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] =
    useState<MediaRecorder | null>(null);

  const [audioFile, setAudioFile] =
    useState<File | null>(null);

  // ----------------------------
  // START RECORDING
  // ----------------------------
  const startRecording = async () => {
    setError("");

    try {
      const stream =
        await navigator.mediaDevices.getUserMedia({
          audio: true,
        });

      const recorder =
        new MediaRecorder(stream);

      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const blob = new Blob(audioChunks, {
          type: "audio/webm",
        });

        const file = new File(
          [blob],
          "recording.webm",
          {
            type: "audio/webm",
          }
        );

        setAudioFile(file);

        // stop mic completely
        stream
          .getTracks()
          .forEach((track) => track.stop());

        await processAudio(file);
      };

      recorder.start();

      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      console.error(err);
      setError("Microphone access denied");
    }
  };

  // ----------------------------
  // STOP RECORDING
  // ----------------------------
  const stopRecording = () => {
    if (!mediaRecorder) return;

    mediaRecorder.stop();
    setRecording(false);
  };

  // ----------------------------
  // PROCESS AUDIO
  // ----------------------------
  const processAudio = async (
    fileOverride?: File
  ) => {
    const fileToUse =
      fileOverride || audioFile;

    if (!fileToUse) {
      setError("No audio found");
      return;
    }

    setLoading(true);
    setError("");

    setTranscript("");
    setTasks([]);

    try {
      const formData = new FormData();

      formData.append(
        "file",
        fileToUse,
        fileToUse.name
      );

      const res = await fetch(
        "/api/ai/action-extract",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      console.log(
        "ACTION EXTRACT RESPONSE"
      );
      console.log(data);

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Action extraction failed"
        );
      }

      setTranscript(
        data.transcript || ""
      );

      setTasks(
        Array.isArray(data.tasks)
          ? data.tasks
          : []
      );

      setAudioFile(null);
    } catch (err: any) {
      console.error(err);

      setError(
        err.message ||
          "Action extraction failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>
            Action Extract
          </h1>

          <p style={styles.subtitle}>
            Record a voice note and
            instantly extract actionable
            tasks.
          </p>

          {/* RECORDING CARD */}
          <div style={styles.card}>
            <div
              style={{
                display: "flex",
                gap: "1rem",
              }}
            >
              {!recording ? (
                <button
                  onClick={
                    startRecording
                  }
                  disabled={loading}
                  style={{
                    ...styles.button,
                    opacity: loading
                      ? 0.6
                      : 1,
                  }}
                >
                  🎙 Start Recording
                </button>
              ) : (
                <button
                  onClick={
                    stopRecording
                  }
                  disabled={loading}
                  style={
                    styles.stopButton
                  }
                >
                  ⏹ Stop Recording
                </button>
              )}
            </div>

            {recording && (
              <p
                style={
                  styles.recording
                }
              >
                ● Recording...
              </p>
            )}

            {loading && (
              <p>
                Processing audio...
              </p>
            )}

            {error && (
              <p style={styles.error}>
                {error}
              </p>
            )}
          </div>

          {/* TRANSCRIPT */}
          {transcript && (
            <div style={styles.card}>
              <h2>Transcript</h2>

              <p style={styles.text}>
                {transcript}
              </p>
            </div>
          )}

          {/* TASKS */}
          {transcript && (
            <div style={styles.card}>
              <h2>
                Actionable Steps
              </h2>

              {tasks.length === 0 ? (
                <p
                  style={
                    styles.text
                  }
                >
                  No action items
                  found.
                </p>
              ) : (
                <>
                  <ul
                    style={
                      styles.list
                    }
                  >
                    {tasks.map(
                      (task, index) => (
                        <li
                          key={index}
                          style={
                            styles.task
                          }
                        >
                          <input
                            type="checkbox"
                          />

                          <div>
                            <strong>
                              {
                                task.task
                              }
                            </strong>

                            {(task.owner ||
                              task.due_date) && (
                              <p
                                style={
                                  styles.meta
                                }
                              >
                                {task.owner &&
                                  `Owner: ${task.owner}`}

                                {task.owner &&
                                  task.due_date &&
                                  " • "}

                                {task.due_date &&
                                  `Due: ${task.due_date}`}
                              </p>
                            )}
                          </div>
                        </li>
                      )
                    )}
                  </ul>

                  <button
                    onClick={() =>
                      console.log(
                        "SAVE TO SUPABASE LATER"
                      )
                    }
                    style={
                      styles.secondaryButton
                    }
                  >
                    Save to AppliStack
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text)",
    padding: "6rem 1.5rem",
  },

  container: {
    maxWidth: "800px",
    margin: "0 auto",
  },

  title: {
    fontSize: "2.6rem",
    fontWeight: 800,
    letterSpacing: "-0.04em",
  },

  subtitle: {
    color: "var(--muted)",
    marginTop: "1rem",
    marginBottom: "2rem",
    lineHeight: 1.6,
  },

  card: {
    marginTop: "1.5rem",
    padding: "1.5rem",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    background:
      "rgba(255,255,255,0.03)",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  button: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.9rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },

  stopButton: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "0.9rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: 600,
  },

  secondaryButton: {
    marginTop: "1rem",
    background: "transparent",
    border:
      "1px solid var(--border)",
    color: "var(--text)",
    padding: "0.8rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
  },

  text: {
    color: "var(--muted)",
    lineHeight: 1.7,
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    padding: 0,
    margin: 0,
    listStyle: "none",
  },

  task: {
    display: "flex",
    gap: "0.75rem",
    padding: "0.75rem",
    borderRadius: "10px",
    background:
      "rgba(255,255,255,0.02)",
  },

  meta: {
    fontSize: "0.85rem",
    color: "var(--muted)",
    marginTop: "0.25rem",
  },

  error: {
    color: "#ef4444",
  },

  recording: {
    color: "#ef4444",
    fontWeight: 600,
  },
};