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
        id="home"
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

          {/* UPDATED CTA TEXT ONLY */}
          <Button
            onClick={() => scrollTo("access-model")}
            style={styles.secondaryBtn}
          >
            What’s Required for Access
          </Button>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={styles.sectionAlt}>
        <h2>Small problems slow down your day</h2>

        <div style={styles.problemGrid}>
          <div>⚡ Repeating the same tasks</div>
          <div>⚡ Jumping between too many apps</div>
          <div>⚡ Wasting time on unnecessary friction</div>
        </div>

        <h3 style={{ marginTop: "2rem" }}>
          AppliStack gives you tools that remove the friction.
        </h3>
      </section>

      <div style={styles.container}>
        {/* BENEFITS */}
        <section id="benefits" style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Why people use AppliStack
          </h2>

          <p style={styles.sectionSubtitle}>
            Simple tools that remove friction from everyday work.
          </p>

          <div style={styles.benefitsGrid}>
            <div style={styles.benefitModernCard}>
              <div style={styles.benefitGlow} />
              <div style={styles.benefitModernIcon}>⚡</div>
              <div>
                <h3 style={styles.benefitModernTitle}>
                  Move faster
                </h3>
                <p style={styles.benefitModernText}>
                  Spend less time repeating tasks and more time doing meaningful work.
                </p>
              </div>
            </div>

            <div style={styles.benefitModernCard}>
              <div style={styles.benefitGlow} />
              <div style={styles.benefitModernIcon}>✨</div>
              <div>
                <h3 style={styles.benefitModernTitle}>
                  Less clutter
                </h3>
                <p style={styles.benefitModernText}>
                  Clean tools without bloated dashboards or setup friction.
                </p>
              </div>
            </div>

            <div style={styles.benefitModernCard}>
              <div style={styles.benefitGlow} />
              <div style={styles.benefitModernIcon}>🎯</div>
              <div>
                <h3 style={styles.benefitModernTitle}>
                  Stay focused
                </h3>
                <p style={styles.benefitModernText}>
                  Focus on what matters instead of tool overload.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* IMPROVEMENTS */}
        <section id="updates" style={styles.section}>
          <h2 style={styles.sectionTitle}>
            🚀 Latest Updates
          </h2>

          <p style={styles.sectionSubtitle}>
            AppliStack is actively being improved every week.
          </p>

          <div style={styles.improvementsFeedModern}>
            {improvements.map((item) => (
              <div
                key={item.id}
                style={{
                  ...styles.improvementModernStackCard,
                  borderLeft: `6px solid ${item.color}`,
                }}
              >
                <div style={styles.improvementTopModern}>
                  <span
                    style={{
                      ...styles.improvementDotModern,
                      background: item.color,
                    }}
                  />
                  <span style={styles.improvementDateModern}>
                    {new Date(item.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div style={styles.improvementTextModern}>
                  {item.text}
                </div>
              </div>
            ))}
          </div>

          <div style={styles.changelogButtonWrap}>
            <Button
              onClick={async () => {
                const { data } =
                  await supabase.auth.getUser();

                if (!data.user) {
                  router.push("/login?redirect=/improvements");
                  return;
                }

                router.push("/improvements");
              }}
              style={styles.secondaryBtn}
            >
              View Full Changelog
            </Button>
          </div>
        </section>

        {/* =======================
            REPLACED PRICING SECTION
           ======================= */}
        <section id="access-model" style={styles.section}>
          <h2 style={styles.sectionTitle}>
            Access Model
          </h2>

          <p style={styles.note}>
            Applications help us keep the platform focused on serious users.
          </p>

          <div style={styles.pricingGrid}>
            {/* LEFT CARD (reused priceCard style) */}
            <div style={styles.priceCard}>
              <h3>Step 1</h3>

              <p style={styles.price}>Apply</p>

              <div style={styles.featureList}>
                <div>✔ Core Tools</div>
                <div>✔ Continuous updates</div>
                <div>✔ Early Access Improvements</div>
              </div>

              <p style={styles.mostPopular}>
                Application Required
              </p>

              <Button
                onClick={() => router.push("/signup")}
                style={styles.cta}
              >
                Start Application
              </Button>
            </div>

            {/* RIGHT CARD (reused proCard style) */}
            <div style={styles.proCard}>
              <div style={styles.proBadge}>
                APPROVAL REQUIRED
              </div>

              <h3>Step 2</h3>

              <p style={styles.price}>Get Access</p>

              <div style={styles.featureList}>
                <div>✔ Approved users get instant access</div>
                <div>✔ Full tool suite unlocked</div>
                <div>✔ Future updates included</div>
              </div>

              <p style={styles.mostPopular}>
                Not automatic
              </p>

              <Button
                onClick={() => router.push("/signup")}
                style={styles.cta}
              >
                Apply Now
              </Button>
            </div>
          </div>

          <p style={styles.trust}>
            Built for freelancers, creators, and operators who want to move faster.
          </p>
        </section>

        {/* CTA */}
        <section style={styles.ctaSection}>
          <div style={styles.ctaGlow} />

          <h2 style={styles.ctaTitle}>
            Get access to tools that make work easier
          </h2>

          <p style={styles.ctaText}>
            From day one, managing workflows, repetitive tasks, and scattered tools can slow everything down.
          </p>

          <p style={styles.ctaHighlight}>
            No pricing. Just access through application.
          </p>

          <Button
            onClick={() => router.push("/signup")}
            style={styles.cta}
          >
            Request Access
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

    paddingTop: "90px",
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

benefitsGrid: {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(280px, 1fr))",
  gap: "1.5rem",
  maxWidth: "1200px",
  margin: "3rem auto 0",
},

benefitModernCard: {
  position: "relative",

  overflow: "hidden",

  display: "flex",
  flexDirection: "column",

  gap: "1.5rem",

  padding: "2rem",

  borderRadius: "28px",

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

  minHeight: "280px",
},

benefitGlow: {
  position: "absolute",

  top: "-80px",
  right: "-80px",

  width: "180px",
  height: "180px",

  background:
    "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)",

  pointerEvents: "none",
},

benefitModernIcon: {
  width: "82px",
  height: "82px",

  borderRadius: "24px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",

  fontSize: "2rem",

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

benefitContent: {
  display: "flex",
  flexDirection: "column",
  gap: "0.85rem",
},

benefitModernTitle: {
  fontSize: "1.35rem",
  fontWeight: 700,
  letterSpacing: "-0.03em",
  margin: 0,
},

benefitModernText: {
  color: "var(--muted)",
  lineHeight: 1.8,
  fontSize: "0.98rem",
  margin: 0,
},

improvementsFeedModern: {
  display: "flex",
  flexDirection: "column",
  gap: "1.25rem",
  maxWidth: "850px",
  margin: "3rem auto 2rem",
},

improvementModernStackCard: {
  position: "relative",
  overflow: "hidden",

  padding: "1.75rem",

  borderRadius: "24px",

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
    0 10px 35px rgba(0,0,0,0.18),
    inset 0 1px 0 rgba(255,255,255,0.04)
  `,

  transition: "all 0.25s ease",
},

improvementGlow: {
  position: "absolute",
  top: "-80px",
  right: "-80px",
  width: "180px",
  height: "180px",
  background:
    "radial-gradient(circle, rgba(59,130,246,0.18), transparent 70%)",
  pointerEvents: "none",
},

improvementTopModern: {
  display: "flex",
  alignItems: "center",
  gap: "0.75rem",
  marginBottom: "0.75rem",
},

improvementDotModern: {
  width: "10px",
  height: "10px",
  borderRadius: "50%",
},

improvementDateModern: {
  fontSize: "0.85rem",
  color: "var(--muted)",
  fontWeight: 600,
},

improvementTextModern: {
  fontSize: "1rem",
  lineHeight: 1.8,
  color: "var(--text)",
  letterSpacing: "-0.01em",
},

  pricingGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit,minmax(320px,1fr))",
    gap: "2rem",
    marginTop: "3rem",
  },

  priceCard: {
    position: "relative",

    overflow: "hidden",

    border:
      "1px solid rgba(255,255,255,0.08)",

    background: `
      linear-gradient(
        180deg,
        rgba(255,255,255,0.06),
        rgba(255,255,255,0.03)
      )
    `,

    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",

    padding: "2.5rem",

    borderRadius: "30px",

    minHeight: "440px",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    boxShadow: `
      0 10px 40px rgba(0,0,0,0.18),
      inset 0 1px 0 rgba(255,255,255,0.04)
    `,

    transition: "all 0.25s ease",
  },

  proCard: {
    position: "relative",

    overflow: "hidden",

    border:
      "1px solid rgba(59,130,246,0.35)",

    background: `
      linear-gradient(
        180deg,
        rgba(37,99,235,0.16),
        rgba(255,255,255,0.04)
      )
    `,

    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",

    padding: "2.5rem",

    borderRadius: "30px",

    minHeight: "440px",

    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",

    boxShadow: `
      0 20px 60px rgba(37,99,235,0.22),
      inset 0 1px 0 rgba(255,255,255,0.06)
    `,

    transform: "translateY(-8px)",

    transition: "all 0.25s ease",
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

  changelogButtonWrap: {
    display: "flex",
    justifyContent: "center",
    marginTop: "2rem",
  },

  ctaSection: {
    position: "relative",
    overflow: "hidden",

    textAlign: "center",

    padding: "8rem 1.5rem",

    borderTop: "1px solid rgba(255,255,255,0.06)",
  },

  ctaGlow: {
    position: "absolute",

    inset: 0,

    background: `
      radial-gradient(
        circle at top,
        rgba(59,130,246,0.18),
        transparent 40%
      ),
      radial-gradient(
        circle at bottom,
        rgba(139,92,246,0.12),
        transparent 40%
      )
    `,

    pointerEvents: "none",
  },

  ctaTitle: {
    position: "relative",

    fontSize: "clamp(2.5rem, 6vw, 4rem)",

    fontWeight: 800,

    letterSpacing: "-0.05em",

    maxWidth: "800px",

    margin: "0 auto",
  },

  ctaText: {
    position: "relative",

    marginTop: "1.75rem",

    maxWidth: "760px",

    marginInline: "auto",

    color: "var(--muted)",

    lineHeight: 1.9,

    fontSize: "1.08rem",
  },

  ctaHighlight: {
    position: "relative",

    marginTop: "1.5rem",

    color: "#60a5fa",

    fontWeight: 700,

    fontSize: "1rem",
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

  featureList: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1.5rem",
    color: "var(--muted)",
    lineHeight: 1.6,
  },

  proBadge: {
    alignSelf: "flex-start",

    padding: "0.45rem 0.8rem",

    borderRadius: "999px",

    background: "rgba(37,99,235,0.18)",

    border: "1px solid rgba(59,130,246,0.3)",

    color: "#60a5fa",

    fontSize: "0.75rem",

    fontWeight: 800,

    letterSpacing: "0.05em",

    marginBottom: "1.25rem",
  },
};