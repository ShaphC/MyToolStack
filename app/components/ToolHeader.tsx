"use client";

import Link from "next/link";

export default function ToolHeader({ title }: { title: string }) {
  return (
    <div style={styles.header}>
      <Link href="/dashboard" style={styles.back}>
        Home
      </Link>

      <h1 style={styles.title}>{title}</h1>
    </div>
  );
}

const styles: any = {
  header: {
    width: "100%",
    padding: "1.5rem 2rem",
    // borderBottom: "2px solid #1d4ed8",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  back: {
    color: "#1d4ed8",
    textDecoration: "none",
    fontWeight: "bold",
  },

  title: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
};