"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Calendar } from "lucide-react";

import { supabase } from "@/app/lib/supabase";

import PageLayout from "@/app/components/PageLayout";

import AdminModal from "@/app/components/admin/AdminModal";

import ConfirmModal from "@/app/components/admin/ConfirmModal";

export default function FinancePage() {
  const [entries, setEntries] = useState<any[]>([]);

  const dateRef =
    useRef<HTMLInputElement | null>(null);

  const [title, setTitle] = useState("");

  const [amount, setAmount] = useState("");

  const [dueDate, setDueDate] = useState("");

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [showModal, setShowModal] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const { data } = await supabase
      .from("financial_entries")
      .select("*")
      .order("due_date", {
        ascending: true,
      });

    setEntries(data || []);
  };

  const total = useMemo(() => {
    return entries.reduce(
      (sum, item) =>
        sum + Number(item.amount),
      0
    );
  }, [entries]);

  const formatDate = (date: string) => {
    if (!date) return "";

    const [year, month, day] = date
      .split("-")
      .map(Number);

    return new Date(
      year,
      month - 1,
      day
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };

  const resetForm = () => {
    setTitle("");

    setAmount("");

    setDueDate("");

    setEditingId(null);
  };

  const saveEntry = async () => {
    if (
      !title.trim() ||
      !amount ||
      !dueDate
    )
      return;

    setLoading(true);

    const payload = {
      title,
      amount: Number(amount),
      due_date: dueDate,
    };

    let error;

    if (editingId) {
      const res = await supabase
        .from("financial_entries")
        .update(payload)
        .eq("id", editingId);

      error = res.error;
    } else {
      const res = await supabase
        .from("financial_entries")
        .insert([payload]);

      error = res.error;
    }

    setLoading(false);

    if (error) {
      console.error(error);
      return;
    }

    resetForm();

    setShowModal(false);

    fetchEntries();
  };

  const editEntry = (entry: any) => {
    setEditingId(entry.id);

    setTitle(entry.title);

    setAmount(String(entry.amount));

    setDueDate(entry.due_date);

    setShowModal(true);
  };

  const deleteEntry = async (
    id: string
  ) => {
    const { error } = await supabase
      .from("financial_entries")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    fetchEntries();
  };

return (
  <PageLayout>
    <main style={styles.page}>
      
      {/* STICKY TOP SECTION */}
      <div style={styles.stickyTop}>
        <div style={styles.top}>
          <div>
            <h1 style={styles.title}>
              Finance Tracker
            </h1>

            <p style={styles.subtitle}>
              Track upcoming payments and totals.
            </p>
          </div>

          <div style={styles.topRight}>
            <div style={styles.totalCard}>
              <div style={styles.totalLabel}>
                Total
              </div>

              <div style={styles.total}>
                $
                {total.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </div>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              style={styles.addButton}
            >
              + Add Entry
            </button>
          </div>
        </div>
      </div>

      {/* SCROLLING LIST ONLY */}
      <div style={styles.scrollArea}>
        <div style={styles.feed}>
          {entries.map((entry) => (
            <div key={entry.id} style={styles.entryCard}>
              <div style={styles.entryTop}>
                <div>
                  <div style={styles.entryTitle}>
                    {entry.title}
                  </div>

                  <div style={styles.entryDate}>
                    Due {formatDate(entry.due_date)}
                  </div>
                </div>

                <div style={styles.amount}>
                  ${Number(entry.amount).toLocaleString()}
                </div>
              </div>

              <div style={styles.entryActions}>
                <button
                  onClick={() => editEntry(entry)}
                  style={styles.editBtn}
                >
                  Edit
                </button>

                <button
                  onClick={() => setDeleteId(entry.id)}
                  style={styles.deleteBtn}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      <AdminModal
        open={showModal}
        title={editingId ? "Edit Entry" : "Add Entry"}
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
      >
        <div style={styles.formGrid}>
          <input
            placeholder="Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.input}
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={styles.input}
          />

          <div style={styles.dateWrapper}>
            <input
              ref={dateRef}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              style={styles.hiddenDateInput}
            />

            <button
              type="button"
              onClick={() => dateRef.current?.showPicker()}
              style={styles.dateButton}
            >
              <span>
                {dueDate ? formatDate(dueDate) : "Select due date"}
              </span>

              <Calendar size={18} />
            </button>
          </div>
        </div>

        <div style={styles.actions}>
          <button onClick={saveEntry} style={styles.button}>
            {loading
              ? "Saving..."
              : editingId
              ? "Update Entry"
              : "Add Entry"}
          </button>
        </div>
      </AdminModal>

      {/* DELETE */}
      <ConfirmModal
        open={!!deleteId}
        title="Delete Entry"
        description="Are you sure you want to delete this entry?"
        confirmText="Delete"
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (!deleteId) return;
          await deleteEntry(deleteId);
          setDeleteId(null);
        }}
      />
    </main>
  </PageLayout>
);
}

const styles: any = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    marginBottom: "2rem",
    flexWrap: "wrap",
  },

  topRight: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },

  title: {
    fontSize: "2rem",
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: "0.5rem",
    color: "var(--muted)",
  },

  totalCard: {
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "1rem 1.25rem",
    background: "var(--card)",
    minWidth: "220px",
  },

  totalLabel: {
    color: "var(--muted)",
    marginBottom: "0.5rem",
  },

  total: {
    fontSize: "2rem",
    fontWeight: "bold",
  },

  addButton: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "1rem 1.25rem",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
  },

  input: {
    width: "100%",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "1rem",
  },

  button: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.9rem 1.2rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },

  feed: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "2rem",
  },

  entryCard: {
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "1rem",
    background: "var(--card)",
  },

  entryTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem",
  },

  entryTitle: {
    fontWeight: "bold",
    fontSize: "1rem",
  },

  entryDate: {
    marginTop: "0.35rem",
    color: "var(--muted)",
    fontSize: "0.9rem",
  },

  amount: {
    fontWeight: "bold",
    fontSize: "1.1rem",
  },

  entryActions: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "1rem",
  },

  editBtn: {
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--text)",
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    cursor: "pointer",
  },

  deleteBtn: {
    border: "1px solid #dc2626",
    background: "transparent",
    color: "#dc2626",
    padding: "0.5rem 0.75rem",
    borderRadius: "8px",
    cursor: "pointer",
  },

  dateWrapper: {
    width: "100%",
    position: "relative",
  },

  hiddenDateInput: {
    position: "absolute",
    opacity: 0,
    pointerEvents: "none",
  },

  dateButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.9rem 1rem",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--card)",
    color: "var(--text)",
    cursor: "pointer",
    fontSize: "0.95rem",
  },
};