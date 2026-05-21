"use client";

import EntryCard from "./EntryCard";

type Props = {
  entries: any[];
};

export default function EntryTimeline({
  entries,
}: Props) {
  return (
    <div style={styles.container}>
      {entries.map((entry) => (
        <EntryCard
          key={entry.id}
          entry={entry}
        />
      ))}
    </div>
  );
}

const styles: any = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
};