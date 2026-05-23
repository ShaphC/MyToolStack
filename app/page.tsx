"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import Navbar from "@/app/components/NavBar";
import EmailCapture from "@/app/components/EmailCapture";
import Footer from "@/app/components/Footer";
import Button from "./components/ui/Button";

import { supabase } from "@/app/lib/supabase";

export default function HomePage() {
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [improvements, setImprovements] = useState<any[]>([]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);

    check();

    window.addEventListener("resize", check);

    return () =>
      window.removeEventListener("resize", check);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    setTimeout(() => setMounted(true), 100);
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.replace("#", "");

      setTimeout(() => {
        const el = document.getElementById(id);

        if (el) {
          el.scrollIntoView({
            behavior: "smooth",
          });
        }
      }, 100);
    }
  }, []);

  useEffect(() => {
    fetchImprovements();
  }, []);

  const fetchImprovements = async () => {
    const { data } = await supabase
      .from("improvements")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(3);

    setImprovements(data || []);
  };

  return (
    <main style={styles.page}>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          ...styles.hero,
          opacity: mounted ? 1 : 0,
          transform: mounted
            ? "translateY(0)"
            : "translateY(20px)",
        }}
      >
        <div style={styles.gradientBg} />

        <h1 style={styles.title}>
          Access the tools you wish you had.
        </h1>

        <p style={styles.subtitle}>
          A growing collection of simple tools designed to
          save time, reduce friction, and help you get real
          work done faster.
        </p>

        <p style={styles.proof}>
          Built for freelancers, creators, and operators.
        </p>

        <div style={styles.heroButtons}>
          <Button
            onClick={() => router.push("/login")}
            style={styles.cta}
          >
            Access Your Tools
          </Button>

          <Button
            onClick={() => scrollTo("features")}
            style={styles.secondaryBtn}
          >
            See What's Included
          </Button>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={styles.sectionAlt}>
        <h2>Small problems slow down your day</h2>

        <div style={styles.problemGrid}>
          <div>⚡ Repeating the same tasks</div>
          <div>⚡ Jumping between too many apps</div>
          <div>
            ⚡ Wasting time on unnecessary friction
          </div>
        </div>

        <h3 style={{ marginTop: "2rem" }}>
          SimpleStack gives you tools that remove the
          friction.
        </h3>
      </section>

      <div style={styles.container}>
        {/* BENEFITS */}
        <section
          id="benefits"
          style={styles.section}
        >
          <h2 style={styles.sectionTitle}>
            Why people use SimpleStack
          </h2>

          <p style={styles.sectionSubtitle}>
            Simple tools that remove friction from everyday
            work.
          </p>

          <div
            style={
              isMobile
                ? styles.benefitGridMobile
                : styles.benefitGridDesktop
            }
            className={
              isMobile ? "hide-scrollbar" : ""
            }
          >
            <div style={styles.benefitCard}>
              <div style={styles.benefitCardInner}>
                <div style={styles.benefitIcon}>
                  ⚡
                </div>

                <h3>Move faster</h3>

                <p>
                  Spend less time on repetitive tasks and
                  more time getting meaningful work done.
                </p>
              </div>
            </div>

            <div style={styles.benefitCard}>
              <div style={styles.benefitCardInner}>
                <div style={styles.benefitIcon}>
                  ✨
                </div>

                <h3>Less clutter</h3>

                <p>
                  Clean tools without bloated dashboards,
                  unnecessary setup, or distractions.
                </p>
              </div>
            </div>

            <div style={styles.benefitCard}>
              <div style={styles.benefitCardInner}>
                <div style={styles.benefitIcon}>
                  🎯
                </div>

                <h3>Stay focused</h3>

                <p>
                  Keep your workflow simple so you can focus
                  on what actually matters.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* IMPROVEMENTS */}
        <section
          id="improvements"
          style={styles.section}
        >
          <h2 style={styles.sectionTitle}>
            🚀 Latest Improvements
          </h2>

          <p style={styles.sectionSubtitle}>
            SimpleStack is actively being improved every
            week.
          </p>

          <div style={styles.improvementsFeed}>
            {improvements.map((item, index) => (
              <div
                key={item.id}
                style={{
                  ...styles.improvementItem,
                  borderLeft: `6px solid ${item.color}`,
                  background:
                    index % 2 === 0
                      ? "rgba(255,255,255,0.03)"
                      : "rgba(255,255,255,0.05)",
                }}
              >
                <div style={styles.improvementTop}>
                  <span
                    style={{
                      ...styles.improvementDot,
                      background: item.color,
                    }}
                  />

                  <span style={styles.improvementDate}>
                    {new Date(
                      item.created_at
                    ).toLocaleDateString()}
                  </span>
                </div>

                <div style={styles.improvementText}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <Button
            onClick={async () => {
              const { data } =
                await supabase.auth.getUser();

              if (!data.user) {
                router.push(
                  "/login?redirect=/improvements"
                );

                return;
              }

              router.push("/improvements");
            }}
            style={styles.secondaryBtn}
          >
            View Full Changelog
          </Button>
        </section>

        {/* PRICING */}
        <section
          id="pricing"
          style={styles.section}
        >
          <h2 style={styles.sectionTitle}>
            Simple Pricing
          </h2>

          <div style={styles.pricingGrid}>
            <div style={styles.priceCard}>
              <h3>Free</h3>

              <p style={styles.price}>$0</p>

              <div>
                <div>✔ Core tools</div>
                <div>✔ Local usage</div>
                <div>✔ Free to Use</div>
              </div>

              <p style={styles.mostPopular}>
                For Casual Users
              </p>

              <Button
                onClick={() =>
                  router.push("/login")
                }
                style={styles.cta}
              >
                Try Now
              </Button>
            </div>

            <div style={styles.proCard}>
              <h3>Pro</h3>

              <p style={styles.price}>
                $19.99/mo
              </p>

              <div>
                <div>✔ Premium features</div>
                <div>
                  ✔ Full access to all tools
                </div>
                <div>
                  ✔ Access to future releases
                </div>
              </div>

              <p style={styles.mostPopular}>
                Most Popular
              </p>

              <Button
                onClick={() =>
                  router.push("/upgrade")
                }
                style={styles.cta}
              >
                Upgrade
              </Button>
            </div>
          </div>

          <p style={styles.note}>
            Start free. Upgrade only when you need more.
          </p>

          <p style={styles.trust}>
            Built for freelancers, creators, and operators
            who want to move faster.
          </p>
        </section>

        {/* CTA */}
        <section style={styles.ctaSection}>
          <h2>
            Get access to tools that make work easier
          </h2>

          <Button
            onClick={() => router.push("/login")}
            style={styles.cta}
          >
            Start Using SimpleStack
          </Button>
        </section>

        <Footer />
      </div>

      {/* <EmailCapture /> */}
    </main>
  );
}

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "sans-serif",
    overflowX: "hidden",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 1.5rem",
  },

  hero: {
    position: "relative",
    textAlign: "center",
    padding: "8rem 1.5rem 7rem",
    transition: "all 0.6s ease",
    overflow: "hidden",
  },

  gradientBg: {
    position: "absolute",
    inset: 0,
    background: `
      radial-gradient(circle at top left, rgba(59,130,246,0.22), transparent 35%),
      radial-gradient(circle at top right, rgba(139,92,246,0.18), transparent 35%),
      radial-gradient(circle at bottom center, rgba(236,72,153,0.12), transparent 40%)
    `,
    zIndex: -1,
  },

  title: {
    fontSize: "clamp(3rem, 8vw, 5.5rem)",
    fontWeight: 800,
    letterSpacing: "-0.06em",
    lineHeight: 1,
    maxWidth: "900px",
    margin: "0 auto",
  },

  subtitle: {
    marginTop: "1.75rem",
    fontSize: "1.15rem",
    lineHeight: 1.8,
    color: "var(--muted)",
    maxWidth: "760px",
    marginInline: "auto",
  },

  proof: {
    marginTop: "1.5rem",
    color: "#60a5fa",
    fontWeight: 600,
    letterSpacing: "-0.02em",
  },

  heroButtons: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginTop: "2.5rem",
    flexWrap: "wrap",
  },

  cta: {
    background: "#2563eb",
    color: "#fff",
    padding: "1rem 1.5rem",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.08)",
    cursor: "pointer",
    fontWeight: 700,
    fontSize: "0.95rem",
    boxShadow:
      "0 12px 40px rgba(37,99,235,0.35)",
    transition: "all 0.2s ease",
  },

  secondaryBtn: {
    background: "rgba(255,255,255,0.04)",
    color: "var(--text)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    padding: "1rem 1.5rem",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: 600,
  },

  section: {
    padding: "6rem 0",
  },

  sectionAlt: {
    padding: "6rem 1.5rem",
    background:
      "linear-gradient(to bottom, transparent, rgba(255,255,255,0.02))",
    borderTop:
      "1px solid rgba(255,255,255,0.05)",
    borderBottom:
      "1px solid rgba(255,255,255,0.05)",
    textAlign: "center",
  },

  sectionTitle: {
    fontSize: "2.5rem",
    fontWeight: 800,
    letterSpacing: "-0.04em",
    marginBottom: "1rem",
    textAlign: "center",
  },

  sectionSubtitle: {
    color: "var(--muted)",
    maxWidth: "680px",
    margin: "0 auto 3rem",
    lineHeight: 1.7,
    textAlign: "center",
  },

  problemGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",
    gap: "1.25rem",
    marginTop: "3rem",
    maxWidth: "1100px",
    marginInline: "auto",
  },

  benefitGridDesktop: {
    display: "flex",
    justifyContent: "center",
    alignItems: "stretch",
    gap: "1rem",

    marginTop: "3rem",

    flexWrap: "wrap",

    maxWidth: "1000px",
    marginInline: "auto",
  },

  benefitGridMobile: {
    display: "flex",

    gap: "0.85rem",

    overflowX: "auto",
    overflowY: "hidden",

    paddingBottom: "1rem",
    marginTop: "2rem",

    scrollSnapType: "x mandatory",

    WebkitOverflowScrolling: "touch",

    scrollbarWidth: "none",

    msOverflowStyle: "none",

    paddingInline: "1rem",

    justifyContent: "flex-start",
  },

  benefitCard: {
    flex: "0 0 260px",

    width: "260px",

    scrollSnapAlign: "center",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",

    padding: "1.5rem 1.25rem",

    border: "1px solid var(--border)",

    borderRadius: "22px",

    background: "rgba(255,255,255,0.03)",

    backdropFilter: "blur(10px)",

    boxSizing: "border-box",

    transition: "all 0.2s ease",

    minHeight: "260px",

    justifyContent: "flex-start",
  },

  benefitCardInner: {
    maxWidth: "220px",

    width: "100%",

    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",

    textAlign: "center",

    margin: "0 auto",
  },

    benefitIcon: {
      width: "64px",
      height: "64px",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      fontSize: "1.8rem",

      borderRadius: "18px",

      background: "rgba(37,99,235,0.15)",

      marginBottom: "1.5rem",

      marginInline: "auto",
    },

  improvementsFeed: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxWidth: "850px",
    margin: "3rem auto 2rem",
  },

  improvementItem: {
    background: "rgba(255,255,255,0.03)",
    border:
      "1px solid rgba(255,255,255,0.06)",
    backdropFilter: "blur(12px)",
    padding: "1.25rem",
    borderRadius: "18px",
    transition: "all 0.25s ease",
  },

  improvementTop: {
    display: "flex",
    alignItems: "center",
    gap: "0.6rem",
    marginBottom: "0.75rem",
  },

  improvementDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },

  improvementDate: {
    fontSize: "0.82rem",
    color: "var(--muted)",
  },

  improvementText: {
    lineHeight: 1.7,
    color: "var(--text)",
  },

  pricingGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "2rem",
    marginTop: "3rem",
  },

  priceCard: {
    border:
      "1px solid rgba(255,255,255,0.08)",

    background: "rgba(255,255,255,0.03)",

    backdropFilter: "blur(14px)",

    padding: "2.5rem",

    borderRadius: "28px",

    minHeight: "420px",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  proCard: {
    border:
      "1px solid rgba(59,130,246,0.4)",

    background: `
      linear-gradient(
        180deg,
        rgba(37,99,235,0.12),
        rgba(255,255,255,0.03)
      )
    `,

    backdropFilter: "blur(14px)",

    padding: "2.5rem",

    borderRadius: "28px",

    minHeight: "420px",

    boxShadow:
      "0 20px 60px rgba(37,99,235,0.18)",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },

  price: {
    fontSize: "3rem",
    fontWeight: 800,
    letterSpacing: "-0.05em",
    margin: "1rem 0 1.5rem",
  },

  mostPopular: {
    marginTop: "1.5rem",
    color: "#60a5fa",
    fontWeight: 700,
  },

  note: {
    marginTop: "2rem",
    color: "var(--muted)",
    textAlign: "center",
  },

  trust: {
    marginTop: "1rem",
    color: "var(--muted)",
    textAlign: "center",
  },

  ctaSection: {
    textAlign: "center",
    padding: "8rem 1.5rem",
    position: "relative",
  },
};