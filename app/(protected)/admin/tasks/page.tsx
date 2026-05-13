"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import PageLayout from "@/app/components/PageLayout";
import AdminModal from "@/app/components/admin/AdminModal";
import ConfirmModal from "@/app/components/admin/ConfirmModal";

export default function AdminTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");

  const [priority, setPriority] =
    useState("medium");

  const [loading, setLoading] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [showModal, setShowModal] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data } = await supabase
      .from("admin_tasks")
      .select("*")
      .order("priority", {
        ascending: true,
      })
      .order("completed", {
        ascending: true,
      })
      .order("created_at", {
        ascending: false,
      });

    setTasks(data || []);
  };

  const getPriorityColor = (
    priority: string
  ) => {
    switch (priority) {
      case "high":
        return "#dc2626";

      case "medium":
        return "#eab308";

      case "low":
        return "#2563eb";

      default:
        return "#6b7280";
    }
  };

  const saveTask = async () => {
    if (!title.trim()) return;

    setLoading(true);

    const payload = {
      title,
      description,
      priority,
      color: getPriorityColor(priority),
    };

    let error;

    if (editingId) {
      const res = await supabase
        .from("admin_tasks")
        .update(payload)
        .eq("id", editingId);

      error = res.error;
    } else {
      const res = await supabase
        .from("admin_tasks")
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

    fetchTasks();
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setEditingId(null);
  };

  const editTask = (task: any) => {
    setEditingId(task.id);

    setTitle(task.title);

    setDescription(
      task.description || ""
    );

    setPriority(task.priority);

    setShowModal(true);
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase
      .from("admin_tasks")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    fetchTasks();
  };

  const toggleComplete = async (
    id: string,
    completed: boolean
  ) => {
    const { error } = await supabase
      .from("admin_tasks")
      .update({
        completed: !completed,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    fetchTasks();
  };

  return (
    <PageLayout>
      <main style={styles.container}>
        <div style={styles.topBar}>
          <div>
            <h1 style={styles.title}>
              Admin Tasks
            </h1>

            <p style={styles.subtitle}>
              Internal roadmap and work tracker.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            style={styles.addButton}
          >
            + Add Task
          </button>
        </div>

        {/* TASKS */}

        <div style={styles.feed}>
          {tasks.map((task) => (
            <div
              key={task.id}
              style={{
                ...styles.taskCard,
                borderLeft: `6px solid ${task.color}`,
                opacity: task.completed
                  ? 0.6
                  : 1,
              }}
            >
              <div style={styles.taskTop}>
                <div style={styles.taskLeft}>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() =>
                      toggleComplete(
                        task.id,
                        task.completed
                      )
                    }
                  />

                  <div>
                    <div
                      style={{
                        ...styles.taskTitle,
                        textDecoration:
                          task.completed
                            ? "line-through"
                            : "none",
                      }}
                    >
                      {task.title}
                    </div>

                    <div style={styles.priority}>
                      {task.priority}
                    </div>
                  </div>
                </div>

                <div style={styles.actions}>
                  <button
                    onClick={() =>
                      editTask(task)
                    }
                    style={styles.editBtn}
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      setDeleteId(task.id)
                    }
                    style={styles.deleteBtn}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {task.description && (
                <div style={styles.description}>
                  {task.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      <AdminModal
        open={showModal}
        title={
          editingId
            ? "Edit Task"
            : "Add Task"
        }
        onClose={() => {
          setShowModal(false);
          resetForm();
        }}
      >
        <input
          placeholder="Task title"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          style={styles.input}
        />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          style={styles.textarea}
        />

        <div style={styles.row}>
          <select
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value)
            }
            style={styles.select}
          >
            <option value="high">
              High Priority
            </option>

            <option value="medium">
              Medium Priority
            </option>

            <option value="low">
              Low Priority
            </option>
          </select>

          <button
            onClick={saveTask}
            style={styles.button}
          >
            {loading
              ? "Saving..."
              : editingId
              ? "Update Task"
              : "Add Task"}
          </button>
        </div>
      </AdminModal>

      <ConfirmModal
        open={!!deleteId}
        title="Delete Task"
        description="Are you sure you want to delete this task?"
        confirmText="Delete"
        onClose={() =>
          setDeleteId(null)
        }
        onConfirm={async () => {
          if (!deleteId) return;

          await deleteTask(deleteId);

          setDeleteId(null);
        }}
      />
    </PageLayout>
  );
}

const styles: any = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem",
  },

  topBar: {
    marginBottom: "2rem",

    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",

    flexWrap: "wrap",
  },

  title: {
    fontSize: "2rem",
    fontWeight: "bold",
  },

  subtitle: {
    color: "var(--muted)",
    marginTop: "0.5rem",
  },

  input: {
    width: "100%",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    marginBottom: "1rem",
  },

  textarea: {
    width: "100%",
    minHeight: "120px",
    padding: "1rem",
    borderRadius: "12px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
    resize: "vertical",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    marginTop: "1rem",
    flexWrap: "wrap",
  },

  select: {
    padding: "0.9rem",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
    color: "var(--text)",
  },

  button: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "0.9rem 1.25rem",
    borderRadius: "10px",
    cursor: "pointer",
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

  feed: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "2rem",
  },

  taskCard: {
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "1rem",
    background: "var(--card)",
  },

  taskTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
    alignItems: "flex-start",
  },

  taskLeft: {
    display: "flex",
    gap: "1rem",
    alignItems: "flex-start",
  },

  taskTitle: {
    fontWeight: "bold",
    fontSize: "1rem",
  },

  priority: {
    marginTop: "0.35rem",
    fontSize: "0.85rem",
    color: "var(--muted)",
    textTransform: "capitalize",
  },

  description: {
    marginTop: "1rem",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },

  actions: {
    display: "flex",
    gap: "0.5rem",
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
};