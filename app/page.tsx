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
        return () => window.removeEventListener("resize", check);
    }, []);

    const scrollTo = (id: string) => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        setTimeout(() => setMounted(true), 100);
    }, []);

    useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.replace("#", "");
            
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
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
        .order("created_at", { ascending: false })
        .limit(3);

      setImprovements(data || []);
    };

  return (
    <main style={styles.page}>
      {/* NAV */}
      <Navbar />

      {/* HERO */}
      <section
        style={{
          ...styles.hero,
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
        }}
      >
        <div style={styles.gradientBg} />

        <h1 style={styles.title}>
          Access the tools you wish you had.
        </h1>

        <p style={styles.subtitle}>
          A growing collection of simple tools designed to save time,
          reduce friction, and help you get real work done faster.
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
          <div>⚡ Wasting time on unnecessary friction</div>
        </div>

        <h3 style={{ marginTop: "2rem" }}>
          SimpleStack gives you tools that remove the friction.
        </h3>
      </section>
      <div style={styles.container}>
      {/* TOOLS */}
      <section id="features" style={styles.section}>
        <h2 style={styles.sectionTitle}>
          Designed for speed and simplicity
        </h2>

        <p style={styles.sectionSubtitle}>
          Tools should help you move faster — not create more work.
        </p>

        <div
          style={
            isMobile
              ? styles.featureGridMobile
              : styles.featureGridDesktop
          }
        >
          <div style={styles.featureCard}>
            <img
              src="/images/workflow.png"
              style={styles.featureImage}
            />

            <h3>Reduce repetitive work</h3>

            <p>
              Handle common tasks faster with tools designed
              to eliminate busywork.
            </p>
          </div>

          <div style={styles.featureCard}>
            <img
              src="/images/simple.png"
              style={styles.featureImage}
            />

            <h3>Simple by default</h3>

            <p>
              No bloated dashboards or complicated setup.
              Just tools that work immediately.
            </p>
          </div>

          <div style={styles.featureCard}>
            <img
              src="/images/focus.png"
              style={styles.featureImage}
            />

            <h3>Stay focused</h3>

            <p>
              Spend less time managing systems and more time
              doing meaningful work.
            </p>
          </div>
        </div>
      </section>

      {/* IMPROVEMENTS */}
      <section id="improvements" style={styles.section}>
        <h2 style={styles.sectionTitle}>
          🚀 Latest Improvements
        </h2>

        <p style={styles.sectionSubtitle}>
          SimpleStack is actively being improved every week.
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
                  {new Date(item.created_at).toLocaleDateString()}
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
            const { data } = await supabase.auth.getUser();

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
      </section>

      {/* PRICING */}
      <section id="pricing" style={styles.section}>
        <h2 style={styles.sectionTitle}>Simple Pricing</h2>

        <div style={styles.pricingGrid}>
          <div style={styles.priceCard}>
            <h3>Free</h3>
            <p style={styles.price}>$0</p>
            <div>
              <div>✔ Core tools</div>
              <div>✔ Local usage</div>
              <div>✔ Free to Use</div>
            </div>

            <p style={styles.mostPopular}>For Casual Users</p>

            <Button 
                onClick={() => router.push("/login")}
                style={styles.cta}
            >
                Try Now
            </Button>
          </div>

          <div style={styles.proCard}>
            <h3>Pro</h3>
            <p style={styles.price}>$19.99/mo</p>

            <div>
              <div>✔ Premium features</div>
              <div>✔ Full access to all tools</div>
              <div>✔ Access to future releases</div>
            </div>

            <p style={styles.mostPopular}>Most Popular</p>

            <Button
                onClick={() => router.push("/upgrade")}
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
          Built for freelancers, creators, and operators who want to move faster.
        </p>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <h2>Get access to tools that make work easier</h2>

        <Button
          onClick={() => router.push("/login")}
          style={styles.cta}
        >
          Start Using SimpleStack
        </Button>
      </section>

      {/* FOOTER */}
      <Footer />
      </div>
      <EmailCapture/>
    </main>
  );
}

/* ---------- TOOL CARD ---------- */

function ToolCard({ title, desc, route }: any) {
  const router = useRouter();

  return (
    <div
      style={styles.card}
      onClick={() => router.push(route)}
      onMouseEnter={(e: any) => {
        e.currentTarget.style.transform = "scale(1.03)";
        e.currentTarget.style.boxShadow =
          "0 10px 30px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e: any) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div style={styles.imagePlaceholder}>Preview</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </div>
  );
}

/* ---------- STYLES ---------- */

const styles: any = {
  page: {
    minHeight: "100vh",
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily: "sans-serif",
  },

  nav: {
    position: "sticky",
    top: 0,
    backdropFilter: "blur(10px)",
    background: "rgba(255,255,255,0.8)",
    zIndex: 10,
    display: "flex",
    justifyContent: "space-between",
    padding: "1rem 2rem",
    borderBottom: "1px solid #e5e7eb",
  },

  container: {
    background: "var(--bg)",
    color: "var(--text)",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 2rem",
  },

  logo: { fontWeight: "bold" },

  navLinks: { display: "flex", gap: "1.5rem" },

  auth: { display: "flex", gap: "0.5rem" },

  login: {
    border: "1px solid #1d4ed8",
    background: "transparent",
    padding: "0.4rem 0.8rem",
  },

  signup: {
    background: "#1d4ed8",
    color: "#fff",
    padding: "0.4rem 0.8rem",
    border: "none",
  },

  hero: {
    position: "relative",
    textAlign: "center",
    padding: "6rem 2rem",
    transition: "all 0.6s ease",
  },

  gradientBg: {
    position: "absolute",
    inset: 0,
    background:
      "radial-gradient(circle at top, rgba(29,78,216,0.15), transparent 70%)",
    zIndex: -1,
  },

  title: { fontSize: "3rem", marginBottom: "1rem" },

  subtitle: {
    color: "var(--muted)",
    maxWidth: "600px",
    margin: "0 auto 1rem",
  },

  proof: {
    color: "var(--muted)",
    marginBottom: "2rem",
  },

  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "1rem",
  },

  cta: {
    background: "#1d4ed8",
    color: "#fff",
    padding: "0.8rem 1.4rem",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },

  secondaryBtn: {
    border: "1px solid #1d4ed8",
    padding: "0.8rem 1.4rem",
    borderRadius: "8px",
    background: "transparent",
    color: "var(--text)",
  },

  section: {
    padding: "4rem 2rem",
    textAlign: "center",
  },

  sectionAlt: {
    padding: "4rem 2rem",
    background: "var(--sectionAlt)",
    textAlign: "center",
  },

  problemGrid: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    marginTop: "1.5rem",
    flexWrap: "wrap",
  },

  sectionTitle: { fontSize: "1.8rem" },

  gridDesktop: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
      gap: "1.5rem",
      marginTop: "2rem",
  },

  gridMobile: {
      display: "flex",
      gap: "1rem",
      overflowX: "auto",
      paddingBottom: "1rem",
      marginTop: "2rem",
      scrollSnapType: "x mandatory",
  },

  card: {
      flex: "0 0 260px",
      scrollSnapAlign: "start",
      background: "var(--card)",
      border: "2px solid var(--border)",
      borderRadius: "12px",
      padding: "1rem",
      cursor: "pointer",
  },

  imagePlaceholder: {
    height: "120px",
    background: "#f3f4f6",
    borderRadius: "8px",
    marginBottom: "0.75rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  pricingGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "2rem",
    marginTop: "2rem",
  },

  priceCard: {
    border: "1px solid #1d4ed8",
    padding: "2rem",
    borderRadius: "12px",
    minHeight: "260px",
  },

  proCard: {
    border: "2px solid #1d4ed8",
    padding: "2rem",
    borderRadius: "12px",
    minHeight: "260px",
    boxShadow: "0 10px 30px rgba(29,78,216,0.15)",
  },

  price: {
    fontSize: "2rem",
    fontWeight: "bold",
  },

  mostPopular: {
    marginTop: "1rem",
    color: "#1d4ed8",
    fontWeight: "bold",
  },

  note: {
    marginTop: "1rem",
    color: "#6b7280",
  },

  trust: {
    marginTop: "1rem",
    color: "#6b7280",
  },

  ctaSection: {
    textAlign: "center",
    padding: "5rem 2rem",
  },

  footer: {
    borderTop: "1px solid #e5e7eb",
    padding: "3rem 2rem",
    marginTop: "2rem",
  },

  footerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "2rem",
    marginBottom: "2rem",
  },

  link: {
    cursor: "pointer",
    textDecoration: "underline",
  },

  copy: {
    textAlign: "center",
    color: "#6b7280",
  },

  sectionSubtitle: {
    color: "var(--muted)",
    marginBottom: "2rem",
  },

  improvementsFeed: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "2rem",
    marginBottom: "2rem",
    maxWidth: "800px",
    marginInline: "auto",
  },

  improvementItem: {
    padding: "1rem",
    borderRadius: "12px",
    textAlign: "left",
    transition: "all 0.2s ease",
  },

  improvementTop: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "0.5rem",
  },

  improvementDot: {
    width: "10px",
    height: "10px",
    borderRadius: "50%",
  },

  improvementDate: {
    fontSize: "0.8rem",
    color: "var(--muted)",
  },

  improvementText: {
    lineHeight: 1.5,
  },

  contactSection: {
    padding: "5rem 2rem",
    textAlign: "center",
    borderTop: "1px solid var(--border)",
  },

  contactText: {
    color: "var(--muted)",
    marginTop: "1rem",
    marginBottom: "2rem",
  },

  featureGridDesktop: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "1.5rem",
    marginTop: "3rem",
  },

  featureGridMobile: {
    display: "flex",
    gap: "1rem",
    overflowX: "auto",
    paddingBottom: "1rem",
    marginTop: "3rem",
    scrollSnapType: "x mandatory",
  },

  featureCard: {
    flex: "0 0 280px",
    scrollSnapAlign: "start",

    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "1rem",
    background: "var(--card)",
    textAlign: "left",
  },

  featureImage: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "1rem",
  },
};