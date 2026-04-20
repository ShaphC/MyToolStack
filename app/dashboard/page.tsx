"use client";

import Link from "next/link";
import PageLayout from "../components/PageLayout";

const tools = [
  {
    name: "Random Number Generator",
    slug: "random-generator",
    description: "Generate random numbers with custom digit length",
    image: "/images/random.png",
  },
  {
    name: "Token Generator",
    slug: "token-generator",
    description: "Generate secure tokens and codes",
    image: "/images/token.png",
  },
  {
    name: "Time Tracker",
    slug: "time-tracker",
    description: "Track and calculate worked time",
    image: "/images/tracker.png",
  },
  {
    name: "Secure Links",
    slug: "secret-generator",
    description: "Send a secure link",
    image: "/images/secret.png",
  },
  {
    name: "Message Repeater",
    slug: "message-repeater",
    description: "Create reusable templates foe messages to send",
    image: "/images/message.png",
  },
];

export default function Home() {
  return (
    <PageLayout>
    <main style={styles.container}>
      <h1 style={styles.title}>Toolbox</h1>
      <p style={styles.subtitle}>
        Simple tools to get real work done
      </p>

      <div style={styles.grid}>
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/apps/${tool.slug}`}
            style={styles.card}
          >
            <h2>{tool.name}</h2>
            <p>{tool.description}</p>
          </Link>
        ))}
      </div>
    </main>
    </PageLayout>
  );
}

const styles: any = {
  container: {
    padding: "3rem",
    background: "var(--bg)",
    minHeight: "100vh",
    color: "var(--text)",
    fontFamily: "sans-serif",
  },

  title: {
    fontSize: "2.5rem",
    marginBottom: "0.5rem",
  },

  subtitle: {
    marginBottom: "2rem",
    color: "var(--muted)",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "1.5rem",
  },

  card: {
    border: "2px solid #1d4ed8",
    padding: "1.5rem",
    borderRadius: "12px",
    textDecoration: "none",
    color: "var(--text)",
  },
};