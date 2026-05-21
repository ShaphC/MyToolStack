"use client";

type Props = {
  title: string;
  items: string[];
};

export default function MetadataCards({
  title,
  items,
}: Props) {
  return (
    <div style={styles.card}>
      <div style={styles.title}>
        {title}
      </div>

      <div style={styles.tags}>
        {items.map((item) => (
          <div
            key={item}
            style={styles.tag}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: any = {
  card: {
    border: "1px solid var(--border)",
    borderRadius: "18px",
    padding: "1rem",
    background: "var(--card)",
  },

  title: {
    fontWeight: "bold",
    marginBottom: "1rem",
  },

  tags: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },

  tag: {
    padding: "0.45rem 0.7rem",
    borderRadius: "999px",
    background:
      "rgba(37,99,235,0.12)",
    color: "#60a5fa",
  },
};