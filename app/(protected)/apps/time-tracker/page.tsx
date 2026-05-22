"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "@/app/components/NavBar";

type Entry = {
  client: string;
  date: string;
  label: string;
  duration: number;
  work: string;
};

function timeToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function formatTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;

  return `${h}h ${m}m`;
}

function parseManualTime(input: string) {
  const value = input.toLowerCase().trim();

  if (value.includes("hour") || value.includes("hr")) {
    return parseFloat(value) * 60;
  }

  if (value.includes("min")) {
    return parseFloat(value);
  }

  const num = parseFloat(value);

  return isNaN(num) ? 0 : num;
}

export default function TimeTracker() {
  const [client, setClient] = useState("");
  const [date, setDate] = useState("");
  const [work, setWork] = useState("");

  const [manualTime, setManualTime] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const [entries, setEntries] = useState<Entry[]>([]);
  const [collapsed, setCollapsed] = useState<any>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setDate(today);

    const saved = localStorage.getItem("timeEntries");

    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "timeEntries",
      JSON.stringify(entries)
    );
  }, [entries]);

  const addEntry = () => {
    if (!client) return;

    let duration = 0;
    let label = "";

    if (manualTime) {
      duration = parseManualTime(manualTime);
      label = manualTime;
    } else if (start && end) {
      duration = timeToMinutes(end) - timeToMinutes(start);

      if (duration < 0) {
        duration += 24 * 60;
      }

      label = `${start} - ${end}`;
    }

    if (duration <= 0) return;

    const newEntry: Entry = {
      client,
      date,
      label,
      duration,
      work,
    };

    if (editingIndex !== null) {
      const updated = [...entries];
      updated[editingIndex] = newEntry;
      setEntries(updated);
      setEditingIndex(null);
    } else {
      setEntries([newEntry, ...entries]);
    }

    setManualTime("");
    setStart("");
    setEnd("");
    setWork("");
  };

  const deleteEntry = (index: number) => {
    setEntries(entries.filter((_, i) => i !== index));
  };

  const editEntry = (index: number) => {
    const e = entries[index];

    setClient(e.client);
    setDate(e.date);
    setManualTime(e.label);
    setWork(e.work);

    setEditingIndex(index);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const toggleClient = (name: string) => {
    setCollapsed({
      ...collapsed,
      [name]: !collapsed[name],
    });
  };

  const clientGroups = useMemo(() => {
    return entries.reduce((acc: any, entry) => {
      if (!acc[entry.client]) {
        acc[entry.client] = [];
      }

      acc[entry.client].push(entry);

      return acc;
    }, {});
  }, [entries]);

  const dailyTotals = useMemo(() => {
    return entries.reduce((acc: any, e) => {
      acc[e.date] = (acc[e.date] || 0) + e.duration;
      return acc;
    }, {});
  }, [entries]);

  const totalTracked = entries.reduce(
    (sum, e) => sum + e.duration,
    0
  );

  const exportCSV = () => {
    const rows = [
      [
        "Client",
        "Date",
        "Label",
        "Work",
        "Duration (minutes)",
      ],

      ...entries.map((e) => [
        e.client,
        e.date,
        e.label,
        e.work,
        e.duration.toString(),
      ]),
    ];

    const csv = rows
      .map((r) => r.join(","))
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = "time-tracker.csv";

    a.click();
  };

  return (
    <>
      <Navbar />

      <main style={styles.page}>
        <div style={styles.backgroundGlow} />

        <div style={styles.wrapper}>
          {/* HEADER */}
          <div style={styles.hero}>
            <div style={styles.heroBadge}>
              ⏱ Productivity Tool
            </div>

            <h1 style={styles.title}>
              Time Tracker
            </h1>

            <p style={styles.subtitle}>
              Track client work, log hours,
              organize sessions, and export
              everything when needed.
            </p>
          </div>

          {/* STATS */}
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                ⏳
              </div>

              <div>
                <div style={styles.statValue}>
                  {formatTime(totalTracked)}
                </div>

                <div style={styles.statLabel}>
                  Total Tracked
                </div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                👥
              </div>

              <div>
                <div style={styles.statValue}>
                  {
                    Object.keys(clientGroups)
                      .length
                  }
                </div>

                <div style={styles.statLabel}>
                  Clients
                </div>
              </div>
            </div>

            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                📝
              </div>

              <div>
                <div style={styles.statValue}>
                  {entries.length}
                </div>

                <div style={styles.statLabel}>
                  Entries
                </div>
              </div>
            </div>
          </div>

          {/* MAIN CARD */}
          <div style={styles.card}>
            {/* FORM */}
            <div style={styles.panel}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  Add Time Entry
                </h2>

                {editingIndex !== null && (
                  <div style={styles.editingBadge}>
                    Editing Entry
                  </div>
                )}
              </div>

              <div style={styles.inputGrid}>
                <input
                  placeholder="Client name"
                  value={client}
                  onChange={(e) =>
                    setClient(e.target.value)
                  }
                  style={styles.input}
                />

                <input
                  type="date"
                  value={date}
                  onChange={(e) =>
                    setDate(e.target.value)
                  }
                  style={styles.input}
                />
              </div>

              <textarea
                placeholder="Describe the work completed..."
                value={work}
                onChange={(e) =>
                  setWork(e.target.value)
                }
                style={styles.textarea}
              />

              <div style={styles.modeContainer}>
                <div style={styles.modeCard}>
                  <div style={styles.modeTitle}>
                    Manual Time
                  </div>

                  <input
                    placeholder="15min / 1 hour"
                    value={manualTime}
                    onChange={(e) =>
                      setManualTime(
                        e.target.value
                      )
                    }
                    style={styles.input}
                  />
                </div>

                <div style={styles.or}>
                  OR
                </div>

                <div style={styles.modeCard}>
                  <div style={styles.modeTitle}>
                    Time Range
                  </div>

                  <div style={styles.timeGrid}>
                    <input
                      type="time"
                      value={start}
                      onChange={(e) =>
                        setStart(
                          e.target.value
                        )
                      }
                      style={styles.input}
                    />

                    <input
                      type="time"
                      value={end}
                      onChange={(e) =>
                        setEnd(
                          e.target.value
                        )
                      }
                      style={styles.input}
                    />
                  </div>
                </div>
              </div>

              <div style={styles.buttonRow}>
                <button
                  onClick={addEntry}
                  style={styles.primaryBtn}
                >
                  {editingIndex !== null
                    ? "Update Entry"
                    : "Add Time"}
                </button>

                <button
                  onClick={exportCSV}
                  style={styles.secondaryBtn}
                >
                  Export CSV
                </button>
              </div>
            </div>

            {/* DAILY TOTALS */}
            <div style={styles.dailyCard}>
              <div style={styles.sectionHeader}>
                <h2 style={styles.sectionTitle}>
                  Daily Totals
                </h2>
              </div>

              <div style={styles.dailyList}>
                {Object.entries(
                  dailyTotals
                ).map(([d, t]: any) => (
                  <div
                    key={d}
                    style={styles.dailyItem}
                  >
                    <span>{d}</span>

                    <span
                      style={styles.dailyTime}
                    >
                      {formatTime(t)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ENTRIES */}
            <div style={styles.content}>
              {Object.entries(
                clientGroups
              ).map(
                ([clientName, list]: any) => {
                  const total = list.reduce(
                    (
                      sum: number,
                      e: Entry
                    ) => sum + e.duration,
                    0
                  );

                  return (
                    <div
                      key={clientName}
                      style={styles.entryCard}
                    >
                      <div
                        style={
                          styles.clientHeader
                        }
                        onClick={() =>
                          toggleClient(
                            clientName
                          )
                        }
                      >
                        <div>
                          <h3
                            style={
                              styles.clientName
                            }
                          >
                            {clientName}
                          </h3>

                          <div
                            style={
                              styles.clientTotal
                            }
                          >
                            {formatTime(
                              total
                            )}{" "}
                            tracked
                          </div>
                        </div>

                        <div
                          style={
                            styles.collapse
                          }
                        >
                          {collapsed[
                            clientName
                          ]
                            ? "+"
                            : "-"}
                        </div>
                      </div>

                      {!collapsed[
                        clientName
                      ] &&
                        list.map(
                          (
                            e: Entry,
                            i: number
                          ) => {
                            const globalIndex =
                              entries.findIndex(
                                (x) => x === e
                              );

                            return (
                              <div
                                key={i}
                                style={
                                  styles.entry
                                }
                              >
                                <div
                                  style={
                                    styles.entryLeft
                                  }
                                >
                                  <div
                                    style={
                                      styles.entryTop
                                    }
                                  >
                                    <span>
                                      {
                                        e.date
                                      }
                                    </span>

                                    <span>
                                      •
                                    </span>

                                    <span>
                                      {
                                        e.label
                                      }
                                    </span>
                                  </div>

                                  <div
                                    style={
                                      styles.work
                                    }
                                  >
                                    {
                                      e.work
                                    }
                                  </div>
                                </div>

                                <div
                                  style={
                                    styles.actions
                                  }
                                >
                                  <div
                                    style={
                                      styles.durationBadge
                                    }
                                  >
                                    {formatTime(
                                      e.duration
                                    )}
                                  </div>

                                  <button
                                    onClick={() =>
                                      editEntry(
                                        globalIndex
                                      )
                                    }
                                    style={
                                      styles.smallBtn
                                    }
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() =>
                                      deleteEntry(
                                        globalIndex
                                      )
                                    }
                                    style={
                                      styles.deleteBtn
                                    }
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            );
                          }
                        )}
                    </div>
                  );
                }
              )}
            </div>
          </div>
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
    padding: "7rem 1.25rem 3rem",
    position: "relative",
    overflow: "hidden",
  },

  backgroundGlow: {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at top left, rgba(37,99,235,0.18), transparent 30%),
      radial-gradient(circle at top right, rgba(139,92,246,0.14), transparent 30%)
    `,
    pointerEvents: "none",
  },

  wrapper: {
    maxWidth: "1100px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1,
  },

  hero: {
    marginBottom: "2rem",
  },

  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.9rem",
    borderRadius: "999px",
    border: "1px solid rgba(59,130,246,0.25)",
    background: "rgba(37,99,235,0.08)",
    color: "#60a5fa",
    fontSize: "0.85rem",
    fontWeight: 700,
    marginBottom: "1.25rem",
  },

  title: {
    fontSize: "clamp(2.5rem, 6vw, 4rem)",
    fontWeight: 800,
    letterSpacing: "-0.05em",
    marginBottom: "1rem",
  },

  subtitle: {
    maxWidth: "700px",
    lineHeight: 1.7,
    color: "var(--muted)",
    fontSize: "1.05rem",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },

  statCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    padding: "1.4rem",
    borderRadius: "24px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.04)",
    backdropFilter: "blur(18px)",
    boxShadow:
      "0 10px 30px rgba(0,0,0,0.08)",
  },

  statIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.6rem",
    background:
      "linear-gradient(135deg, rgba(37,99,235,0.25), rgba(59,130,246,0.08))",
    border:
      "1px solid rgba(59,130,246,0.25)",
  },

  statValue: {
    fontSize: "1.5rem",
    fontWeight: 800,
    marginBottom: "0.2rem",
  },

  statLabel: {
    color: "var(--muted)",
    fontSize: "0.92rem",
  },

  card: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
    padding: "1.5rem",
    borderRadius: "30px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.04)",
    backdropFilter: "blur(18px)",
    boxShadow:
      "0 20px 60px rgba(0,0,0,0.12)",
  },

  panel: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: "1.25rem",
    fontWeight: 700,
  },

  editingBadge: {
    padding: "0.4rem 0.8rem",
    borderRadius: "999px",
    background:
      "rgba(37,99,235,0.1)",
    color: "#60a5fa",
    fontSize: "0.82rem",
    fontWeight: 700,
  },

  inputGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "1rem",
  },

  input: {
    width: "100%",
    padding: "0.95rem 1rem",
    borderRadius: "14px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.04)",
    color: "var(--text)",
    outline: "none",
    fontSize: "0.95rem",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "1rem",
    borderRadius: "18px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.04)",
    color: "var(--text)",
    resize: "vertical",
    outline: "none",
    lineHeight: 1.6,
    fontSize: "0.95rem",
  },

  modeContainer: {
    display: "grid",
    gridTemplateColumns:
      "1fr auto 1fr",
    gap: "1rem",
    alignItems: "center",
  },

  modeCard: {
    padding: "1rem",
    borderRadius: "20px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.03)",
  },

  modeTitle: {
    marginBottom: "0.75rem",
    fontWeight: 700,
    color: "#60a5fa",
  },

  timeGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
  },

  or: {
    fontWeight: 800,
    color: "#60a5fa",
  },

  buttonRow: {
    display: "flex",
    gap: "1rem",
    flexWrap: "wrap",
  },

  primaryBtn: {
    background:
      "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#fff",
    padding: "0.95rem 1.4rem",
    border: "none",
    borderRadius: "14px",
    fontWeight: 700,
    cursor: "pointer",
    boxShadow:
      "0 12px 30px rgba(37,99,235,0.28)",
  },

  secondaryBtn: {
    background:
      "rgba(255,255,255,0.05)",
    color: "var(--text)",
    padding: "0.95rem 1.4rem",
    borderRadius: "14px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer",
    fontWeight: 700,
  },

  dailyCard: {
    padding: "1.2rem",
    borderRadius: "22px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.03)",
  },

  dailyList: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
    marginTop: "1rem",
  },

  dailyItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.85rem 1rem",
    borderRadius: "14px",
    background:
      "rgba(255,255,255,0.03)",
  },

  dailyTime: {
    color: "#60a5fa",
    fontWeight: 700,
  },

  content: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  entryCard: {
    padding: "1.2rem",
    borderRadius: "24px",
    border:
      "1px solid rgba(255,255,255,0.08)",
    background:
      "rgba(255,255,255,0.03)",
  },

  clientHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    marginBottom: "1rem",
  },

  clientName: {
    fontSize: "1.1rem",
    fontWeight: 700,
    marginBottom: "0.3rem",
  },

  clientTotal: {
    color: "#60a5fa",
    fontSize: "0.9rem",
  },

  collapse: {
    width: "36px",
    height: "36px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background:
      "rgba(255,255,255,0.05)",
    fontWeight: 700,
  },

  entry: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "flex-start",
    padding: "1rem 0",
    borderTop:
      "1px solid rgba(255,255,255,0.06)",
  },

  entryLeft: {
    flex: 1,
  },

  entryTop: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
    fontSize: "0.92rem",
    color: "var(--muted)",
    marginBottom: "0.6rem",
  },

  work: {
    lineHeight: 1.7,
    color: "var(--text)",
  },

  actions: {
    display: "flex",
    gap: "0.6rem",
    alignItems: "center",
    flexWrap: "wrap",
  },

  durationBadge: {
    padding: "0.45rem 0.75rem",
    borderRadius: "999px",
    background:
      "rgba(37,99,235,0.12)",
    color: "#60a5fa",
    fontWeight: 700,
    fontSize: "0.85rem",
  },

  smallBtn: {
    padding: "0.55rem 0.8rem",
    borderRadius: "12px",
    border:
      "1px solid rgba(59,130,246,0.25)",
    background:
      "rgba(37,99,235,0.08)",
    color: "#60a5fa",
    cursor: "pointer",
    fontWeight: 700,
  },

  deleteBtn: {
    padding: "0.55rem 0.8rem",
    borderRadius: "12px",
    border:
      "1px solid rgba(239,68,68,0.25)",
    background:
      "rgba(239,68,68,0.08)",
    color: "#f87171",
    cursor: "pointer",
    fontWeight: 700,
  },
};