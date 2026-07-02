"use client";

interface NotesHeaderProps {
  search: string;
  onSearch: (value: string) => void;
  onCreate: () => void;
}

export default function NotesHeader({
  search,
  onSearch,
  onCreate,
}: NotesHeaderProps) {
  return (
    <header style={styles.wrapper}>
      <div>
        <h1 style={styles.title}>NoteFlow</h1>

        <p style={styles.subtitle}>
          Capture ideas before they disappear.
        </p>
      </div>

      <div style={styles.actions}>
        <div style={styles.searchContainer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={styles.searchIcon}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z"
            />
          </svg>

          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search notes..."
            style={styles.input}
          />
        </div>

        <button
          style={styles.button}
          onClick={onCreate}
        >
          + New Note
        </button>
      </div>
    </header>
  );
}

const styles: any = {
  wrapper: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "2rem",
    flexWrap: "wrap",
  },

  title: {
    margin: 0,
    fontSize: "2.5rem",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    color: "var(--text)",
  },

  subtitle: {
    marginTop: "0.5rem",
    color: "var(--muted)",
    fontSize: "1rem",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },

  searchContainer: {
    display: "flex",
    alignItems: "center",
    gap: ".75rem",

    width: "340px",
    maxWidth: "100%",

    padding: ".85rem 1rem",

    borderRadius: "16px",

    background: "var(--card)",

    border: "1px solid rgba(59,130,246,.15)",

    boxShadow: "0 8px 30px rgba(0,0,0,.08)",
  },

  searchIcon: {
    color: "var(--muted)",
    flexShrink: 0,
  },

  input: {
    flex: 1,

    background: "transparent",

    border: "none",

    outline: "none",

    color: "var(--text)",

    fontSize: ".95rem",
  },

  button: {
    padding: ".9rem 1.4rem",

    borderRadius: "14px",

    border: "none",

    cursor: "pointer",

    background:
      "linear-gradient(135deg,#2563eb,#4f46e5)",

    color: "#fff",

    fontWeight: 700,

    fontSize: ".95rem",

    boxShadow:
      "0 12px 30px rgba(37,99,235,.30)",

    transition: "all .2s ease",
  },
};