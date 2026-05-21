"use client";

type Props = {
  entry: any;
};

export default function EntryCard({
  entry,
}: Props) {
  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div>
          <div style={styles.date}>
            {new Date(
              entry.createdAt
            ).toLocaleString()}
          </div>

          <div style={styles.summary}>
            {entry.summary}
          </div>
        </div>
      </div>

      {/* LOCATIONS */}

      {entry.locations?.length >
        0 && (
        <div style={styles.section}>
          <div style={styles.label}>
            Locations
          </div>

          <div style={styles.tags}>
            {entry.locations.map(
              (item: string) => (
                <span
                  key={item}
                  style={styles.tag}
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* EQUIPMENT */}

      {entry.equipment?.length >
        0 && (
        <div style={styles.section}>
          <div style={styles.label}>
            Equipment
          </div>

          <div style={styles.tags}>
            {entry.equipment.map(
              (item: string) => (
                <span
                  key={item}
                  style={styles.tag}
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* TASKS */}

      {entry.tasks?.length > 0 && (
        <div style={styles.section}>
          <div style={styles.label}>
            Tasks
          </div>

          <div style={styles.tags}>
            {entry.tasks.map(
              (item: string) => (
                <span
                  key={item}
                  style={styles.tag}
                >
                  {item}
                </span>
              )
            )}
          </div>
        </div>
      )}

      {/* CLIENT */}

      {entry.client && (
        <div style={styles.section}>
          <div style={styles.label}>
            Client
          </div>

          <div style={styles.client}>
            {entry.client}
          </div>
        </div>
      )}

      {/* RAW INPUT */}

      <div style={styles.raw}>
        {entry.rawInput}
      </div>
    </div>
  );
}

const styles: any = {
  card: {
    border: "1px solid var(--border)",
    background: "var(--card)",
    borderRadius: "20px",
    padding: "1.25rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    gap: "1rem",
  },

  date: {
    fontSize: "0.85rem",
    color: "var(--muted)",
  },

  summary: {
    marginTop: "0.5rem",
    fontSize: "1rem",
    lineHeight: 1.7,
    color: "var(--text)",
    fontWeight: "bold",
  },

  section: {
    display: "flex",
    flexDirection: "column",
    gap: "0.6rem",
  },

  label: {
    fontSize: "0.85rem",
    fontWeight: "bold",
    color: "var(--muted)",
    textTransform: "uppercase",
    letterSpacing: "0.04em",
  },

  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.5rem",
  },

  tag: {
    padding: "0.45rem 0.7rem",
    borderRadius: "999px",
    background:
      "rgba(37,99,235,0.12)",
    color: "#60a5fa",
    fontSize: "0.85rem",
  },

  client: {
    color: "var(--text)",
    fontWeight: "500",
  },

  raw: {
    marginTop: "0.5rem",
    padding: "1rem",
    borderRadius: "14px",
    background: "var(--bg)",
    border: "1px solid var(--border)",
    color: "var(--muted)",
    lineHeight: 1.7,
    whiteSpace: "pre-wrap",
    fontSize: "0.92rem",
  },
};