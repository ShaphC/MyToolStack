"use client";

type Props = {
  filter: string;
  setFilter: (value: string) => void;
};

export default function Filters({
  filter,
  setFilter,
}: Props) {
  return (
    <input
      value={filter}
      onChange={(e) =>
        setFilter(e.target.value)
      }
      placeholder="Filter entries..."
      style={styles.input}
    />
  );
}

const styles: any = {
  input: {
    width: "100%",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "1rem",
    background: "var(--card)",
    color: "var(--text)",
  },
};