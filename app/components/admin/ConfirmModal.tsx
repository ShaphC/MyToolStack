"use client";

import AdminModal from "./AdminModal";

export default function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  onConfirm,
  onClose,
}: any) {
  return (
    <AdminModal
      open={open}
      title={title}
      onClose={onClose}
    >
      <p style={styles.description}>
        {description}
      </p>

      <div style={styles.actions}>
        <button
          onClick={onClose}
          style={styles.cancelBtn}
        >
          Cancel
        </button>

        <button
          onClick={onConfirm}
          style={styles.confirmBtn}
        >
          {confirmText}
        </button>
      </div>
    </AdminModal>
  );
}

const styles: any = {
  description: {
    color: "var(--muted)",
    lineHeight: 1.6,
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",

    marginTop: "2rem",
  },

  cancelBtn: {
    background: "transparent",
    border: "1px solid var(--border)",
    color: "var(--text)",

    padding: "0.8rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
  },

  confirmBtn: {
    background: "#dc2626",
    color: "#fff",

    border: "none",
    padding: "0.8rem 1rem",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};