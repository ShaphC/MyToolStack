"use client";

export default function AdminModal({
  open,
  title,
  children,
  onClose,
}: any) {
  if (!open) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.top}>
          <h2 style={styles.title}>
            {title}
          </h2>

          <button
            onClick={onClose}
            style={styles.closeBtn}
          >
            ✕
          </button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}

const styles: any = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    padding: "1rem",
    zIndex: 999,
  },

  modal: {
    width: "100%",
    maxWidth: "700px",

    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "20px",

    padding: "1.5rem",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: "1.5rem",
  },

  title: {
    fontSize: "1.4rem",
    fontWeight: "bold",
  },

  closeBtn: {
    background: "transparent",
    border: "none",
    color: "var(--text)",
    fontSize: "1.2rem",
    cursor: "pointer",
  },
};