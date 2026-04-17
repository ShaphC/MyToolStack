"use client";

import { useEffect, useState } from "react";
import ToolHeader from "@/app/components/ToolHeader";

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
  return `${h}h ${m}m`;
}

function parseManualTime(input: string) {
  const value = input.toLowerCase().trim();

  if (value.includes("hour")) return parseFloat(value) * 60;
  if (value.includes("min")) return parseFloat(value);

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
    if (saved) setEntries(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("timeEntries", JSON.stringify(entries));
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
      if (duration < 0) duration += 24 * 60;
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
      setEntries([...entries, newEntry]);
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
  };

  const toggleClient = (name: string) => {
    setCollapsed({ ...collapsed, [name]: !collapsed[name] });
  };

  const clientGroups = entries.reduce((acc: any, entry) => {
    if (!acc[entry.client]) acc[entry.client] = [];
    acc[entry.client].push(entry);
    return acc;
  }, {});

  const dailyTotals = entries.reduce((acc: any, e) => {
    acc[e.date] = (acc[e.date] || 0) + e.duration;
    return acc;
  }, {});

  const exportCSV = () => {
    const rows = [
      ["Client", "Date", "Label", "Work", "Duration (minutes)"],
      ...entries.map((e) => [
        e.client,
        e.date,
        e.label,
        e.work,
        e.duration.toString(),
      ]),
    ];

    const csv = rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "time-tracker.csv";
    a.click();
  };

  return (
    <main style={styles.page}>
      <div style={styles.wrapper}>
        <ToolHeader title="Time Tracker" />

        <div style={styles.card}>
          {/* INPUT */}
          <div style={styles.panel}>
            <input
              placeholder="Client name"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              style={styles.input}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={styles.input}
            />

            <textarea
              placeholder="What work was done?"
              value={work}
              onChange={(e) => setWork(e.target.value)}
              style={styles.textarea}
            />

            <div style={styles.modeContainer}>
              <div style={styles.modeBox}>
                <input
                  placeholder="15min / 1 hour"
                  value={manualTime}
                  onChange={(e) => setManualTime(e.target.value)}
                  style={styles.input}
                />
              </div>

              <div style={styles.or}>OR</div>

              <div style={styles.modeBox}>
                <input
                  type="time"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  style={styles.input}
                />
                <input
                  type="time"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  style={styles.input}
                />
              </div>
            </div>

            <button onClick={addEntry} style={styles.button}>
              {editingIndex !== null ? "Update Entry" : "Add Time"}
            </button>

            <button onClick={exportCSV} style={styles.secondary}>
              Export CSV
            </button>
          </div>

          {/* DAILY TOTALS */}
          <div>
            <h3>Daily Totals</h3>
            {Object.entries(dailyTotals).map(([d, t]: any) => (
              <div key={d}>
                {d} — {formatTime(t)}
              </div>
            ))}
          </div>

          {/* CLIENT GROUPS */}
          <div style={styles.content}>
            {Object.entries(clientGroups).map(([clientName, list]: any) => {
              const total = list.reduce(
                (sum: number, e: Entry) => sum + e.duration,
                0
              );

              return (
                <div key={clientName} style={styles.entryCard}>
                  <div
                    style={styles.clientHeader}
                    onClick={() => toggleClient(clientName)}
                  >
                    <h3>{clientName}</h3>
                    <span>{collapsed[clientName] ? "+" : "-"}</span>
                  </div>

                  {!collapsed[clientName] &&
                    list.map((e: Entry, i: number) => {
                      const globalIndex = entries.findIndex(
                        (x) => x === e
                      );

                      return (
                        <div key={i} style={styles.entry}>
                          <div>
                            <div>
                              {e.date} • {e.label}
                            </div>
                            <div style={styles.work}>{e.work}</div>
                          </div>

                          <div style={styles.actions}>
                            <span>{formatTime(e.duration)}</span>

                            <button
                              onClick={() => editEntry(globalIndex)}
                              style={styles.smallBtn}
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => deleteEntry(globalIndex)}
                              style={styles.deleteBtn}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      );
                    })}

                  <div style={styles.total}>
                    Total: {formatTime(total)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    paddingTop: "2rem",
    background: "#fff",
    color: "#000000",
  },

  wrapper: {
    width: "100%",
    maxWidth: "650px",
  },

  card: {
    border: "2px solid #1d4ed8",
    borderRadius: "12px",
    padding: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  panel: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  input: {
    width: "100%",
    padding: "0.6rem",
    border: "2px solid #1d4ed8",
    borderRadius: "6px",
    color: "#000000",
    background: "#ffffff",
  },

  textarea: {
    width: "100%",
    minHeight: "70px",
    padding: "0.6rem",
    border: "2px solid #1d4ed8",
    borderRadius: "6px",
    color: "#000000",
  },

  modeContainer: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
  },

  modeBox: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
  },

  or: {
    fontWeight: "bold",
    color: "#1d4ed8",
  },

  button: {
    background: "#1d4ed8",
    color: "#ffffff",
    padding: "0.7rem",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  secondary: {
    background: "#eee",
    padding: "0.6rem",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    color: "#000000",
  },

  content: {
    display: "grid",
    gap: "1rem",
  },

  entryCard: {
    border: "2px solid #1d4ed8",
    borderRadius: "10px",
    padding: "1rem",
  },

  clientHeader: {
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
  },

  entry: {
    display: "flex",
    justifyContent: "space-between",
    padding: "0.3rem 0",
    alignItems: "center",
  },

  actions: {
    display: "flex",
    gap: "0.5rem",
    alignItems: "center",
  },

  smallBtn: {
    padding: "0.2rem 0.5rem",
    border: "1px solid #1d4ed8",
    background: "transparent",
    cursor: "pointer",
    color: "#000000",
  },

  deleteBtn: {
    padding: "0.2rem 0.5rem",
    border: "1px solid red",
    color: "red",
    background: "transparent",
    cursor: "pointer",
  },

  total: {
    marginTop: "0.5rem",
    fontWeight: "bold",
    color: "#1d4ed8",
  },

  work: {
    fontSize: "0.9rem",
    color: "#000000",
    opacity: 0.8,
  },
};