"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import PageLayout from "@/app/components/PageLayout";

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [users, setUsers] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const [hovered, setHovered] = useState<string | null>(null);

  const [searchUsers, setSearchUsers] = useState("");
  const [searchContacts, setSearchContacts] = useState("");
  const [searchRequests, setSearchRequests] = useState("");

  useEffect(() => {
    checkAdmin();

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  const checkAdmin = async () => {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      router.push("/login");
      return;
    }

    const { data: adminData, error } = await supabase
      .from("admins")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !adminData) {
      router.push("/dashboard");
      return;
    }

    setAuthorized(true);

    await Promise.all([
      fetchUsers(),
      fetchContacts(),
      fetchApplications(),
    ]);

    setLoading(false);
  };

  const fetchUsers = async () => {
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    setUsers(data || []);
  };

  const fetchContacts = async () => {
    const { data } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    setContacts(data || []);
  };

  // ✅ RENAMED: app_requests -> applications
  const fetchApplications = async () => {
    const { data } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    setRequests(data || []);
  };

  const toggleRead = async (
    table: "contact_messages" | "applications",
    id: string,
    current: boolean
  ) => {
    await supabase
      .from(table)
      .update({
        is_read: !current,
      })
      .eq("id", id);

    if (table === "contact_messages") {
      fetchContacts();
    } else {
      fetchApplications();
    }
  };

  if (loading) {
    return (
      <PageLayout>
        <main style={styles.center}>
          <p>Loading dashboard...</p>
        </main>
      </PageLayout>
    );
  }

  if (!authorized) return null;

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(searchUsers.toLowerCase())
  );

  const filteredContacts = contacts.filter((c) =>
    c.email?.toLowerCase().includes(searchContacts.toLowerCase())
  );

  const filteredRequests = requests.filter((r) =>
    r.email?.toLowerCase().includes(searchRequests.toLowerCase())
  );

  return (
    <PageLayout>
      <main style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>
              Manage users, applications, and platform activity.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>{users.length}</div>
            <div style={styles.statLabel}>Total Users</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {users.filter((u) => u.plan === "pro").length}
            </div>
            <div style={styles.statLabel}>Pro Users</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {contacts.filter((c) => !c.is_read).length}
            </div>
            <div style={styles.statLabel}>Unread Contacts</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {requests.filter((r) => !r.is_read).length}
            </div>
            <div style={styles.statLabel}>Unread Applications</div>
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={styles.quickActionsGrid}>
          <div
            onClick={() => router.push("/admin/improvements")}
            style={styles.quickActionCard}
          >
            <div style={styles.quickActionIcon}>🚀</div>
            <div>
              <h3 style={styles.quickActionTitle}>Manage Improvements</h3>
              <p style={styles.quickActionText}>
                Add updates that appear on the homepage changelog.
              </p>
            </div>
          </div>

          <div
            onClick={() => router.push("/admin/tasks")}
            style={styles.quickActionCard}
          >
            <div style={styles.quickActionIcon}>📝</div>
            <div>
              <h3 style={styles.quickActionTitle}>Manage Tasks</h3>
              <p style={styles.quickActionText}>
                Track planned work, priorities, and progress.
              </p>
            </div>
          </div>

          <div
            onClick={() => router.push("/admin/finance")}
            style={styles.quickActionCard}
          >
            <div style={styles.quickActionIcon}>💸</div>
            <div>
              <h3 style={styles.quickActionTitle}>Finance Tracker</h3>
              <p style={styles.quickActionText}>
                Track upcoming payments, due dates, and totals.
              </p>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div
          style={{
            ...styles.dashboardGrid,
            gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.8fr",
          }}
        >
          {/* LEFT */}
          <div style={styles.leftColumn}>
            {/* APPLICATIONS */}
            <div style={styles.card}>
              <div style={styles.sectionHeader}>
                <h2>Applications</h2>
                <div style={styles.badge}>
                  {requests.filter((r) => !r.is_read).length} unread
                </div>
              </div>

              <input
                placeholder="Search applications..."
                value={searchRequests}
                onChange={(e) => setSearchRequests(e.target.value)}
                style={styles.search}
              />

              <div style={styles.list}>
                {filteredRequests.length === 0 ? (
                  <div style={styles.empty}>No applications found.</div>
                ) : (
                  filteredRequests.map((req) => (
                    <div
                      key={req.id}
                      onMouseEnter={() => setHovered(req.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() =>
                        toggleRead("applications", req.id, req.is_read)
                      }
                      style={{
                        ...styles.itemCard,
                        ...(req.is_read ? styles.readCard : styles.unreadCard),
                        ...(hovered === req.id ? styles.hoverCard : {}),
                      }}
                    >
                      {!req.is_read && <div style={styles.unreadDot} />}

                      <div style={styles.userId}>{req.email}</div>

                      <div style={styles.meta}>
                        Name: {req.name}
                      </div>

                      <div style={styles.meta}>
                        Reason: {req.reason}
                      </div>

                      <div style={styles.timestamp}>
                        {new Date(req.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* CONTACTS */}
            <div style={styles.card}>
              <div style={styles.sectionHeader}>
                <h2>Contact Messages</h2>
                <div style={styles.badge}>
                  {contacts.filter((c) => !c.is_read).length} unread
                </div>
              </div>

              <input
                placeholder="Search contacts..."
                value={searchContacts}
                onChange={(e) => setSearchContacts(e.target.value)}
                style={styles.search}
              />

              <div style={styles.list}>
                {filteredContacts.length === 0 ? (
                  <div style={styles.empty}>No contact messages found.</div>
                ) : (
                  filteredContacts.map((msg) => (
                    <div
                      key={msg.id}
                      onMouseEnter={() => setHovered(msg.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() =>
                        toggleRead(
                          "contact_messages",
                          msg.id,
                          msg.is_read
                        )
                      }
                      style={{
                        ...styles.itemCard,
                        ...(msg.is_read ? styles.readCard : styles.unreadCard),
                        ...(hovered === msg.id ? styles.hoverCard : {}),
                      }}
                    >
                      {!msg.is_read && <div style={styles.unreadDot} />}

                      <div style={styles.userId}>{msg.email}</div>
                      <div style={styles.meta}>{msg.subject}</div>
                      <div style={styles.timestamp}>
                        {new Date(msg.created_at).toLocaleString()}
                      </div>
                      <div style={styles.message}>{msg.message}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={styles.rightColumn}>
            <div style={styles.card}>
              <div style={styles.sectionHeader}>
                <h2>Users</h2>
                <div style={styles.badge}>{users.length} total</div>
              </div>

              <input
                placeholder="Search users..."
                value={searchUsers}
                onChange={(e) => setSearchUsers(e.target.value)}
                style={styles.search}
              />

              <div style={styles.list}>
                {filteredUsers.length === 0 ? (
                  <div style={styles.empty}>No users found.</div>
                ) : (
                  filteredUsers.map((user) => (
                    <div key={user.id} style={styles.itemCard}>
                      <div style={styles.userId}>{user.email}</div>
                      <div style={styles.meta}>
                        Plan: {user.plan || "free"}
                      </div>
                      <div style={styles.meta}>
                        Status: {user.status || "active"}
                      </div>
                      <div style={styles.meta}>
                        Admin: {user.is_admin ? "Yes" : "No"}
                      </div>
                      <div style={styles.timestamp}>
                        Joined{" "}
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </PageLayout>
  );
}

const styles: any = {
  center: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "2rem",
  },

  header: {
    marginBottom: "2.5rem",
  },

  title: {
    fontSize: "2.75rem",
    fontWeight: 800,
    letterSpacing: "-0.04em",
  },

  subtitle: {
    color: "var(--muted)",
    marginTop: "0.6rem",
  },

  /* ---------- GLASS CARD BASE ---------- */
  card: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "18px",
    padding: "1.5rem",

    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",

    boxShadow:
      "0 10px 40px rgba(0,0,0,0.25)",

    transition: "all 0.25s ease",
  },

  /* ---------- STATS ---------- */
  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },

  statCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "16px",
    padding: "1.5rem",

    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",

    boxShadow: "0 8px 30px rgba(0,0,0,0.2)",

    transition: "all 0.2s ease",
  },

  statCardHover: {
    transform: "translateY(-4px)",
    boxShadow: "0 18px 50px rgba(37,99,235,0.18)",
  },

  statNumber: {
    fontSize: "2.2rem",
    fontWeight: 800,
    marginBottom: "0.4rem",
    background:
      "linear-gradient(135deg,#60a5fa,#a78bfa)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  statLabel: {
    color: "var(--muted)",
    fontSize: "0.9rem",
  },

  /* ---------- QUICK ACTIONS ---------- */
  quickActionsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },

  quickActionCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",

    padding: "1.25rem",
    borderRadius: "18px",

    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",

    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",

    cursor: "pointer",
    transition: "all 0.25s ease",

    boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
  },

  quickActionCardHover: {
    transform: "translateY(-6px)",
    boxShadow: "0 25px 70px rgba(37,99,235,0.22)",
    border: "1px solid rgba(59,130,246,0.35)",
  },

  /* ---------- ICONS (IMPORTANT) ---------- */
  quickActionIcon: {
    width: "60px",
    height: "60px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "16px",

    background:
      "radial-gradient(circle at top, rgba(59,130,246,0.35), rgba(59,130,246,0.08))",

    fontSize: "1.6rem",

    boxShadow:
      "0 10px 30px rgba(59,130,246,0.25)",

    flexShrink: 0,
  },

  quickActionTitle: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "0.35rem",
  },

  quickActionText: {
    color: "var(--muted)",
    fontSize: "0.92rem",
    lineHeight: 1.5,
  },

  /* ---------- GRID ---------- */
  dashboardGrid: {
    display: "grid",
    gap: "1.5rem",
    alignItems: "start",
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },

  badge: {
    background: "rgba(59,130,246,0.12)",
    color: "#60a5fa",
    padding: "0.4rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },

  search: {
    width: "100%",
    padding: "0.85rem 1rem",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    color: "var(--text)",
    marginBottom: "1rem",
    outline: "none",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    maxHeight: "70vh",
    overflowY: "auto",
    paddingRight: "0.25rem",
  },

  itemCard: {
    position: "relative",

    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "14px",
    padding: "1rem",

    background: "rgba(255,255,255,0.03)",

    transition: "all 0.2s ease",
  },

  hoverCard: {
    transform: "translateY(-4px)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.25)",
    border: "1px solid rgba(59,130,246,0.35)",
  },

  unreadCard: {
    border: "1px solid rgba(59,130,246,0.5)",
    background: "rgba(59,130,246,0.06)",
  },

  readCard: {
    opacity: 0.85,
  },

  unreadDot: {
    position: "absolute",
    top: "12px",
    right: "12px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#60a5fa",
    boxShadow: "0 0 12px rgba(59,130,246,0.6)",
  },

  userId: {
    fontWeight: "bold",
  },

  meta: {
    marginTop: "0.35rem",
    color: "var(--muted)",
    fontSize: "0.9rem",
  },

  timestamp: {
    marginTop: "0.5rem",
    fontSize: "0.78rem",
    color: "var(--muted)",
  },

  message: {
    marginTop: "0.75rem",
    lineHeight: 1.6,
  },

  empty: {
    padding: "2rem",
    textAlign: "center",
    color: "var(--muted)",
  },
};