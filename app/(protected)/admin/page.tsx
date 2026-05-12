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
      fetchRequests(),
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

  const fetchRequests = async () => {
    const { data } = await supabase
      .from("app_requests")
      .select("*")
      .order("created_at", { ascending: false });

    setRequests(data || []);
  };

  const toggleRead = async (
    table: "contact_messages" | "app_requests",
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
      fetchRequests();
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
            <h1 style={styles.title}>
              Admin Dashboard
            </h1>

            <p style={styles.subtitle}>
              Manage users, requests, and platform activity.
            </p>
          </div>
        </div>

        {/* STATS */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {users.length}
            </div>

            <div style={styles.statLabel}>
              Total Users
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {users.filter((u) => u.plan === "pro").length}
            </div>

            <div style={styles.statLabel}>
              Pro Users
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {contacts.filter((c) => !c.is_read).length}
            </div>

            <div style={styles.statLabel}>
              Unread Contacts
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statNumber}>
              {requests.filter((r) => !r.is_read).length}
            </div>

            <div style={styles.statLabel}>
              Unread Requests
            </div>
          </div>
        </div>


        {/* QUICK ACTIONS */}
        <div style={styles.quickActionsGrid}>
          
          {/* IMPROVEMENTS */}
          <div
            onClick={() => router.push("/admin/improvements")}
            style={styles.quickActionCard}
          >
            <div style={styles.quickActionIcon}>🚀</div>

            <div>
              <h3 style={styles.quickActionTitle}>
                Manage Improvements
              </h3>

              <p style={styles.quickActionText}>
                Add updates that appear on the homepage changelog.
              </p>
            </div>
          </div>

          {/* TASKS */}
          <div
            onClick={() => router.push("/admin/tasks")}
            style={styles.quickActionCard}
          >
            <div style={styles.quickActionIcon}>📝</div>

            <div>
              <h3 style={styles.quickActionTitle}>
                Manage Tasks
              </h3>

              <p style={styles.quickActionText}>
                Track planned work, priorities, and progress.
              </p>
            </div>
          </div>

        </div>

        {/* GRID */}
        <div
          style={{
            ...styles.dashboardGrid,
            gridTemplateColumns: isMobile
              ? "1fr"
              : "1.2fr 0.8fr",
          }}
        >
          {/* LEFT */}
          <div style={styles.leftColumn}>
            {/* REQUESTS */}
            <div style={styles.card}>
              <div style={styles.sectionHeader}>
                <h2>App Requests</h2>

                <div style={styles.badge}>
                  {
                    requests.filter((r) => !r.is_read)
                      .length
                  }{" "}
                  unread
                </div>
              </div>

              <input
                placeholder="Search requests..."
                value={searchRequests}
                onChange={(e) =>
                  setSearchRequests(e.target.value)
                }
                style={styles.search}
              />

              <div style={styles.list}>
                {filteredRequests.length === 0 ? (
                  <div style={styles.empty}>
                    No requests found.
                  </div>
                ) : (
                  filteredRequests.map((req) => (
                    <div
                      key={req.id}
                      onMouseEnter={() =>
                        setHovered(req.id)
                      }
                      onMouseLeave={() =>
                        setHovered(null)
                      }
                      onClick={() =>
                        toggleRead(
                          "app_requests",
                          req.id,
                          req.is_read
                        )
                      }
                      style={{
                        ...styles.itemCard,
                        ...(req.is_read
                          ? styles.readCard
                          : styles.unreadCard),
                        ...(hovered === req.id
                          ? styles.hoverCard
                          : {}),
                      }}
                    >
                      {!req.is_read && (
                        <div style={styles.unreadDot} />
                      )}

                      <div style={styles.userId}>
                        {req.email}
                      </div>

                      <div style={styles.meta}>
                        {req.title}
                      </div>

                      <div style={styles.timestamp}>
                        {new Date(
                          req.created_at
                        ).toLocaleString()}
                      </div>

                      <div style={styles.message}>
                        {req.request}
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
                  {
                    contacts.filter((c) => !c.is_read)
                      .length
                  }{" "}
                  unread
                </div>
              </div>

              <input
                placeholder="Search contacts..."
                value={searchContacts}
                onChange={(e) =>
                  setSearchContacts(e.target.value)
                }
                style={styles.search}
              />

              <div style={styles.list}>
                {filteredContacts.length === 0 ? (
                  <div style={styles.empty}>
                    No contact messages found.
                  </div>
                ) : (
                  filteredContacts.map((msg) => (
                    <div
                      key={msg.id}
                      onMouseEnter={() =>
                        setHovered(msg.id)
                      }
                      onMouseLeave={() =>
                        setHovered(null)
                      }
                      onClick={() =>
                        toggleRead(
                          "contact_messages",
                          msg.id,
                          msg.is_read
                        )
                      }
                      style={{
                        ...styles.itemCard,
                        ...(msg.is_read
                          ? styles.readCard
                          : styles.unreadCard),
                        ...(hovered === msg.id
                          ? styles.hoverCard
                          : {}),
                      }}
                    >
                      {!msg.is_read && (
                        <div style={styles.unreadDot} />
                      )}

                      <div style={styles.userId}>
                        {msg.email}
                      </div>

                      <div style={styles.meta}>
                        {msg.subject}
                      </div>

                      <div style={styles.timestamp}>
                        {new Date(
                          msg.created_at
                        ).toLocaleString()}
                      </div>

                      <div style={styles.message}>
                        {msg.message}
                      </div>
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

                <div style={styles.badge}>
                  {users.length} total
                </div>
              </div>

              <input
                placeholder="Search users..."
                value={searchUsers}
                onChange={(e) =>
                  setSearchUsers(e.target.value)
                }
                style={styles.search}
              />

              <div style={styles.list}>
                {filteredUsers.length === 0 ? (
                  <div style={styles.empty}>
                    No users found.
                  </div>
                ) : (
                  filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      style={styles.itemCard}
                    >
                      <div style={styles.userId}>
                        {user.email}
                      </div>

                      <div style={styles.meta}>
                        Plan: {user.plan || "free"}
                      </div>

                      <div style={styles.meta}>
                        Status:{" "}
                        {user.status || "active"}
                      </div>

                      <div style={styles.meta}>
                        Admin:{" "}
                        {user.is_admin
                          ? "Yes"
                          : "No"}
                      </div>

                      <div style={styles.timestamp}>
                        Joined{" "}
                        {new Date(
                          user.created_at
                        ).toLocaleDateString()}
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
    marginBottom: "2rem",
  },

  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
  },

  subtitle: {
    color: "var(--muted)",
    marginTop: "0.5rem",
  },

  statsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },

  statCard: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "14px",
    padding: "1.5rem",
  },

  statNumber: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "0.5rem",
  },

  statLabel: {
    color: "var(--muted)",
  },

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

  card: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "16px",
    padding: "1.5rem",
  },

  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "1rem",
  },

  badge: {
    background: "rgba(37,99,235,0.12)",
    color: "#2563eb",
    padding: "0.4rem 0.75rem",
    borderRadius: "999px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },

  search: {
    width: "100%",
    padding: "0.8rem 1rem",
    borderRadius: "10px",
    border: "1px solid var(--border)",
    background: "var(--bg)",
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
    border: "1px solid var(--border)",
    borderRadius: "12px",
    padding: "1rem",
    background: "var(--bg)",
    transition: "all 0.2s ease",
  },

  unreadCard: {
    border: "1px solid #2563eb",
    background: "rgba(37,99,235,0.06)",
  },

  readCard: {
    opacity: 0.9,
  },

  hoverCard: {
    transform: "translateY(-3px)",
    boxShadow:
      "0 10px 25px rgba(0,0,0,0.12)",
  },

  unreadDot: {
    position: "absolute",
    top: "14px",
    right: "14px",
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: "#2563eb",
  },

  userId: {
    fontWeight: "bold",
    fontSize: "1rem",
    wordBreak: "break-all",
  },

  meta: {
    marginTop: "0.35rem",
    color: "var(--muted)",
    fontSize: "0.92rem",
  },

  timestamp: {
    marginTop: "0.5rem",
    fontSize: "0.8rem",
    color: "var(--muted)",
  },

  message: {
    marginTop: "0.85rem",
    lineHeight: 1.6,
    whiteSpace: "pre-wrap",
  },

  empty: {
    padding: "2rem",
    textAlign: "center",
    color: "var(--muted)",
  },

  quickActionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
  },

  quickActionCard: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",

    padding: "1.25rem",
    borderRadius: "16px",

    border: "1px solid var(--border)",
    background: "var(--card)",

    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  quickActionIcon: {
    width: "56px",
    height: "56px",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: "14px",

    background: "rgba(37,99,235,0.1)",
    fontSize: "1.5rem",

    flexShrink: 0,
  },

  quickActionTitle: {
    fontSize: "1rem",
    fontWeight: "bold",
    marginBottom: "0.35rem",
  },

  quickActionText: {
    color: "var(--muted)",
    lineHeight: 1.5,
    fontSize: "0.92rem",
  },
};