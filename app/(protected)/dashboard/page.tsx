"use client";

import Link from "next/link";
import Image from "next/image";

import PageLayout from "../../components/PageLayout";

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
    image: "/images/random.png",
  },
  {
    name: "Secure Links",
    slug: "secret-generator",
    description: "Send a secure link",
    image: "/images/random.png",
  },
  {
    name: "Message Repeater",
    slug: "message-repeater",
    description: "Create reusable templates for messages",
    image: "/images/random.png",
  },
  {
    name: "AI Prompt Library",
    slug: "prompt-library",
    description: "Create a library of AI prompts",
    image: "/images/random.png",
  },
  {
    name: "LinkBridge",
    slug: "link-bridge",
    description: "Share links without overthinking",
    image: "/images/random.png",
  },
];

export default function Home() {
  return (
    <PageLayout>
      <main style={styles.page}>
        {/* HERO */}
        <section style={styles.hero}>
          <div style={styles.heroGlow} />

          <div style={styles.badge}>
            Internal Productivity Suite
          </div>

          <h1 style={styles.title}>
            Your Workspace.
            <br />
            One Dashboard.
          </h1>

          <p style={styles.subtitle}>
            Fast internal tools designed to remove friction,
            automate repetitive work, and help you move faster.
          </p>
        </section>

        {/* GRID */}
        <section style={styles.grid}>
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/apps/${tool.slug}`}
              className="toolCard"
              style={styles.card}
            >
              <div style={styles.cardGlow} />

              <div style={styles.iconWrap}>
                <Image
                  src={tool.image}
                  alt={tool.name}
                  width={58}
                  height={58}
                  style={styles.icon}
                />
              </div>

              <div style={styles.cardContent}>
                <h2 style={styles.cardTitle}>
                  {tool.name}
                </h2>

                <p style={styles.cardDescription}>
                  {tool.description}
                </p>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </PageLayout>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    padding: "4rem 1.5rem",
    background: "var(--bg)",
    color: "var(--text)",
    overflow: "hidden",
  },

  hero: {
    position: "relative",
    maxWidth: "900px",
    margin: "0 auto 4rem",
    textAlign: "center",
  },

  heroGlow: {
    position: "absolute",
    inset: "-120px",
    background: `
      radial-gradient(circle at top, rgba(59,130,246,0.22), transparent 40%),
      radial-gradient(circle at bottom right, rgba(139,92,246,0.16), transparent 40%)
    `,
    zIndex: 0,
    pointerEvents: "none",
  },

  badge: {
    position: "relative",
    zIndex: 1,

    display: "inline-flex",
    alignItems: "center",

    padding: "0.55rem 1rem",

    borderRadius: "999px",

    background: "rgba(37,99,235,0.12)",

    border: "1px solid rgba(59,130,246,0.25)",

    color: "#60a5fa",

    fontWeight: 700,
    fontSize: "0.85rem",

    backdropFilter: "blur(12px)",
  },

  title: {
    position: "relative",
    zIndex: 1,

    marginTop: "1.5rem",

    fontSize: "clamp(3rem, 8vw, 5rem)",

    fontWeight: 800,

    lineHeight: 1,

    letterSpacing: "-0.06em",
  },

  subtitle: {
    position: "relative",
    zIndex: 1,

    marginTop: "1.5rem",

    maxWidth: "700px",

    marginInline: "auto",

    color: "var(--muted)",

    fontSize: "1.1rem",

    lineHeight: 1.8,
  },

  grid: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(280px, 1fr))",

    gap: "1.5rem",

    maxWidth: "1400px",

    margin: "0 auto",
  },

  card: {
    position: "relative",

    overflow: "hidden",

    display: "flex",
    flexDirection: "column",

    gap: "1.5rem",

    padding: "1.75rem",

    borderRadius: "28px",

    textDecoration: "none",

    color: "var(--text)",

    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.06),
        rgba(255,255,255,0.03)
      )
    `,

    border: "1px solid rgba(255,255,255,0.08)",

    backdropFilter: "blur(16px)",

    WebkitBackdropFilter: "blur(16px)",

    boxShadow: `
      0 10px 40px rgba(0,0,0,0.18),
      inset 0 1px 0 rgba(255,255,255,0.04)
    `,

    transition: "all 0.25s ease",

    minHeight: "260px",
  },

  cardGlow: {
    position: "absolute",

    top: "-80px",
    right: "-80px",

    width: "180px",
    height: "180px",

    background:
      "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)",

    pointerEvents: "none",
  },

  iconWrap: {
    width: "82px",
    height: "82px",

    borderRadius: "24px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    background: `
      linear-gradient(
        180deg,
        rgba(59,130,246,0.22),
        rgba(59,130,246,0.08)
      )
    `,

    border: "1px solid rgba(59,130,246,0.25)",

    boxShadow: `
      0 10px 30px rgba(37,99,235,0.28),
      inset 0 1px 0 rgba(255,255,255,0.12)
    `,
  },

  icon: {
    objectFit: "contain",

    filter: `
      drop-shadow(0 8px 16px rgba(59,130,246,0.35))
    `,
  },

  cardContent: {
    display: "flex",
    flexDirection: "column",
    gap: "0.75rem",
  },

  cardTitle: {
    fontSize: "1.3rem",

    fontWeight: 700,

    letterSpacing: "-0.03em",

    margin: 0,
  },

  cardDescription: {
    color: "var(--muted)",

    lineHeight: 1.7,

    fontSize: "0.97rem",

    margin: 0,
  },
};