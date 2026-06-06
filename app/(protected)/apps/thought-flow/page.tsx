"use client";

import { useEffect, useRef, useState } from "react";
import PageLayout from "@/app/components/PageLayout";
import { supabase } from "@/app/lib/supabase";

type TranscriptItem = {
  id: string;
  text: string;
  created_at?: string;
};

export default function ThoughtFlow() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const [time, setTime] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);

  const [waveData, setWaveData] = useState<number[]>([]);
  const [transcript, setTranscript] = useState("");
  const [history, setHistory] = useState<TranscriptItem[]>([]);

  const [error, setError] = useState("");

  const [historyOpen, setHistoryOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<TranscriptItem | null>(null);

  const [search, setSearch] = useState("");

  const isBusy = isTranscribing;

  const MAX_RECORD_TIME = 600; // 10 minutes

  /* ---------------- SUPABASE LOAD ---------------- */
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("transcripts")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) setHistory(data);
    };

    load();
  }, []);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    let interval: any;

    if (isRecording && !isPaused && !isTranscribing) {
      interval = setInterval(() => {
        setTime((t) => {
          const next = t + 1;

          if (next >= MAX_RECORD_TIME) {
            stopRecording(); // auto-stop at limit
            return MAX_RECORD_TIME;
          }

          return next;
        });

        setDisplayTime((t) => t + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRecording, isPaused, isTranscribing]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  /* ---------------- WAVEFORM ---------------- */
  const startWaveform = (stream: MediaStream) => {
    const AudioContextClass =
      window.AudioContext || (window as any).webkitAudioContext;

    const audioCtx = new AudioContextClass();
    const analyser = audioCtx.createAnalyser();

    const source = audioCtx.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 64;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    audioCtxRef.current = audioCtx;
    analyserRef.current = analyser;

    const update = () => {
      analyser.getByteFrequencyData(dataArray);
      setWaveData(Array.from(dataArray));
      animationRef.current = requestAnimationFrame(update);
    };

    update();
  };

  const stopWaveform = () => {
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    audioCtxRef.current?.close();
    audioCtxRef.current = null;
  };

  /* ---------------- START ---------------- */
  const startRecording = async () => {
    if (isBusy) return;

    setError("");
    setTranscript("");
    setTime(0);
    setDisplayTime(0);

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });

    streamRef.current = stream;

    const recorder = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });

    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    recorder.start();

    setIsRecording(true);
    setIsPaused(false);

    startWaveform(stream);
  };

  /* ---------------- PAUSE ---------------- */
  const togglePause = () => {
    if (isBusy) return;

    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    if (recorder.state === "recording") {
      recorder.pause();
      setIsPaused(true);
    } else {
      recorder.resume();
      setIsPaused(false);
    }
  };

  /* ---------------- STOP + TRANSCRIBE ---------------- */
  const stopRecording = async () => {
    if (isBusy) return;

    const recorder = mediaRecorderRef.current;
    if (!recorder) return;

    setIsTranscribing(true);

    recorder.stop();
    stopWaveform();

    recorder.onstop = async () => {
      const audioBlob = new Blob(chunksRef.current, {
        type: "audio/webm",
      });

      const file = new File([audioBlob], "audio.webm", {
        type: "audio/webm",
      });

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/ai/transcribe", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Transcription failed");

        const text = data.transcript || data.text || "";

        setTranscript(text);

        /* ---------------- SUPABASE SAVE (IMMEDIATE UI SYNC FIX) ---------------- */
        if (text?.trim()) {
          const newItem = {
            id: crypto.randomUUID(),
            text,
            created_at: new Date().toISOString(),
            user_id: (await supabase.auth.getUser()).data.user?.id,
          };

          const { error: saveError } = await supabase
            .from("transcripts")
            .insert([newItem]);

          if (!saveError) {
            // 🔥 INSTANT UI UPDATE (no waiting for DB return)
            setHistory((prev) => [newItem, ...prev]);
          }
        }
      } catch (err: any) {
        setError(err.message || "Failed to transcribe");
      } finally {
        setIsTranscribing(false);
        setIsRecording(false);
        setIsPaused(false);
        setTime(0);
        setDisplayTime(0);

        streamRef.current?.getTracks().forEach((t) => t.stop());
      }
    };
  };

  const filteredHistory = history.filter((h) =>
    h.text.toLowerCase().includes(search.toLowerCase())
  );

  const openItem = (item: TranscriptItem) => {
    setActiveItem(item);
    setHistoryOpen(false);
  };

  const closeAll = () => {
    setActiveItem(null);
    setHistoryOpen(false);
  };

  const deleteTranscript = async (id: string) => {
    const { error } = await supabase
      .from("transcripts")
      .delete()
      .eq("id", id);

    if (error) {
      setError("Failed to delete transcript");
      return;
    }

    setHistory((prev) => prev.filter((t) => t.id !== id));
    setActiveItem(null);
  };

  const disabled = isBusy;

  return (
    <PageLayout>
      <main style={styles.page}>
        <div style={styles.container}>
          <h1 style={styles.title}>Voice Recorder</h1>

          {/* HISTORY BUTTON */}
          <button
            onClick={() => setHistoryOpen(true)}
            style={styles.historyBtn}
            disabled={disabled}
          >
            History
          </button>

          {/* TIMER */}
          <div
            style={{
              ...styles.timer,
              color:
                displayTime > MAX_RECORD_TIME * 0.8
                  ? "#f59e0b" // amber warning
                  : displayTime > MAX_RECORD_TIME * 0.95
                  ? "#ef4444" // red critical
                  : "#60a5fa", // normal
            }}
          >
            {formatTime(displayTime)}
          </div>

          {displayTime > MAX_RECORD_TIME * 0.8 && (
            <p style={styles.warningText}>
              Approaching max recording limit
            </p>
          )}

          {/* WAVEFORM */}
          <div style={styles.waveWrapper}>
            {waveData.length ? (
              waveData.slice(0, 24).map((v, i) => (
                <div
                  key={i}
                  style={{
                    ...styles.bar,
                    height: `${Math.max(v / 2, 4)}px`,
                  }}
                />
              ))
            ) : (
              <div style={styles.waveEmpty}>No audio input</div>
            )}
          </div>

          {/* CONTROLS */}
          <div style={styles.controls}>
            {!isRecording ? (
              <button onClick={startRecording} disabled={disabled} style={styles.primary}>
                Start
              </button>
            ) : (
              <>
                <button onClick={togglePause} disabled={disabled} style={styles.secondary}>
                  {isPaused ? "Resume" : "Pause"}
                </button>

                <button onClick={stopRecording} disabled={disabled} style={styles.stop}>
                  Stop
                </button>
              </>
            )}
          </div>

          {/* STATUS */}
          {isTranscribing && <p style={styles.status}>Transcribing...</p>}
          {error && <p style={styles.error}>{error}</p>}

          {/* TRANSCRIPT */}
          <div style={styles.card}>
            <h3>Transcript</h3>
            {transcript ? (
              <p style={styles.text}>{transcript}</p>
            ) : (
              <p style={styles.empty}>No transcript yet</p>
            )}
          </div>
        </div>

        {/* HISTORY MODAL */}
        {historyOpen && (
          <div style={styles.modalOverlay} onClick={closeAll}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <h3>History</h3>

              <input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={styles.search}
              />

              {filteredHistory.length === 0 ? (
                <p style={styles.empty}>No results</p>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    style={styles.historyItem}
                    onClick={() => openItem(item)}
                  >
                    {item.text.split("\n")[0]}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ITEM MODAL (UPDATED HEADER) */}
        {activeItem && (
          <div style={styles.modalOverlay} onClick={closeAll}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              
              {/* FIXED HEADER */}
              <div style={styles.modalHeader}>
                <button onClick={closeAll} style={styles.backBtn}>
                  ← Back
                </button>

                <div>Transcript</div>

                <button
                  onClick={() => deleteTranscript(activeItem.id)}
                  style={styles.trashBtn}
                >
                  🗑
                </button>
              </div>

              {/* SCROLLABLE BODY */}
              <div style={styles.modalBody}>
                <p style={styles.modalText}>{activeItem.text}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </PageLayout>
  );
}

/* ---------------- STYLES ---------------- */

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
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },

  title: {
    fontSize: "2.2rem",
    fontWeight: 800,
  },

  historyBtn: {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid var(--border)",
    color: "var(--text)",
    padding: "0.8rem 1rem",
    borderRadius: "12px",
    width: "fit-content",
  },

  timer: {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#60a5fa",
  },

  waveWrapper: {
    display: "flex",
    alignItems: "end",
    gap: "4px",
    height: "60px",
  },

  bar: {
    width: "4px",
    background: "#3b82f6",
    borderRadius: "4px",
  },

  waveEmpty: { color: "var(--muted)" },

  controls: {
    display: "flex",
    gap: "0.75rem",
    flexWrap: "wrap",
  },

  primary: {
    background: "#2563eb",
    color: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    border: "none",
  },

  secondary: {
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    padding: "1rem",
    borderRadius: "12px",
  },

  stop: {
    background: "#dc2626",
    color: "#fff",
    padding: "1rem",
    borderRadius: "12px",
    border: "none",
  },

  status: { color: "var(--muted)" },
  error: { color: "#ef4444" },

  card: {
    padding: "1.2rem",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    background: "var(--card)",
  },

  text: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
  },

  empty: { color: "var(--muted)" },

  /* MODAL */
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "1rem",
    zIndex: 9999,
  },

  modal: {
    width: "100%",
    maxWidth: "600px",
    background: "var(--card)",
    borderRadius: "16px",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  },

  modalHeader: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "1rem",
    borderBottom: "1px solid var(--border)",
    position: "sticky",
    top: 0,
    background: "var(--card)",
  },

  backBtn: {
    justifySelf: "start",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "var(--text)",
  },

  trashBtn: {
    justifySelf: "end",
    background: "#dc2626",
    border: "none",
    color: "#fff",
    width: "36px",
    height: "36px",
    borderRadius: "10px",
    cursor: "pointer",
  },

  modalBody: {
    padding: "1.2rem",
    overflowY: "auto",
  },

  modalText: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.7,
  },

  search: {
    margin: "1rem",
    padding: "0.75rem",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
  },

  historyItem: {
    padding: "0.75rem",
    border: "1px solid var(--border)",
    borderRadius: "12px",
    margin: "0 1rem 0.75rem",
    cursor: "pointer",
  },

  warningText: {
    color: "#f59e0b",
    fontSize: "0.85rem",
    marginTop: "-0.5rem",
  },
};