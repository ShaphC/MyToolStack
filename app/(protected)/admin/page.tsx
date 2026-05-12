"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import PageLayout from "@/app/components/PageLayout";

export default function AdminPage() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    const [users, setUsers] = useState<any[]>([]);
    const [contacts, setContacts] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);    
    const [hovered, setHovered] = useState<string | null>(null);

    useEffect(() => {
        checkAdmin();
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

        if (error) {
            console.error(error);
            return;
        }

        if (!adminData) {
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

    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setContacts(data || []);
    };

    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from("app_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
        return;
      }

      setRequests(data || []);
    };

    const fetchUsers = async () => {
        const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

            setUsers(data || []);
            console.log(data);
        };

        if (loading) {
            return (
            <PageLayout>
                <main style={styles.center}>
                <p>Loading...</p>
                </main>
            </PageLayout>
        );
    }

    if (!authorized) return null;

    const toggleRead = async (
      table: "contact_messages" | "app_requests",
      id: string,
      current: boolean
    ) => {
      const { error } = await supabase
        .from(table)
        .update({
          is_read: !current,
        })
        .eq("id", id);

      if (error) {
        console.error(error);
        return;
      }

      // refresh
      if (table === "contact_messages") {
        fetchContacts();
      } else {
        fetchRequests();
      }
    };

return (
  <PageLayout>
    <main style={styles.container}>
      <h1 style={styles.title}>Admin Dashboard</h1>

      <div style={styles.dashboardGrid}>
        
        {/* LEFT COLUMN */}
        <div style={styles.leftColumn}>
          <div style={styles.card}>
            <h2>Users</h2>

            <div style={styles.list}>
              {users.map((user) => (
                <div key={user.id} style={styles.userCard}>
                  <div>
                    <div style={styles.userId}>
                      {user.email}
                    </div>

                    <div style={styles.meta}>
                      Plan: {user.plan || "free"}
                    </div>

                    <div style={styles.meta}>
                      Status: {user.status || "active"}
                    </div>

                    <div style={styles.meta}>
                      Admin: {user.is_admin ? "Yes" : "No"}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div style={styles.rightColumn}>
          
          {/* APP REQUESTS */}
          <div style={styles.card}>
            <h2>App Requests</h2>

            <div style={styles.list}>
              {requests.map((req) => (
                <div
                  key={req.id}
                  onMouseEnter={() => setHovered(req.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() =>
                    toggleRead(
                      "app_requests",
                      req.id,
                      req.is_read
                    )
                  }
                  style={{
                    ...styles.userCard,
                    ...(req.is_read
                      ? styles.readCard
                      : styles.unreadCard),
                    ...(hovered === req.id
                      ? styles.hoverCard
                      : {}),
                  }}
                >
                  <div style={styles.userId}>
                    {req.email}
                  </div>

                  <div style={styles.meta}>
                    {req.title}
                  </div>

                  <div style={styles.message}>
                    {req.request}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CONTACTS */}
          <div style={styles.card}>
            <h2>Contact Messages</h2>

            <div style={styles.list}>
              {contacts.map((msg) => (
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
                    ...styles.userCard,
                    ...(msg.is_read
                      ? styles.readCard
                      : styles.unreadCard),
                    ...(hovered === msg.id
                      ? styles.hoverCard
                      : {}),
                  }}
                >
                  <div style={styles.userId}>
                    {msg.email}
                  </div>

                  <div style={styles.meta}>
                    {msg.subject}
                  </div>

                  <div style={styles.message}>
                    {msg.message}
                  </div>
                </div>
              ))}
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
    maxWidth: "1300px",
    margin: "0 auto",
    padding: "2rem",
  },

  title: {
    fontSize: "2rem",
    fontWeight: "bold",
    marginBottom: "2rem",
  },

  card: {
    border: "2px solid var(--border)",
    borderRadius: "12px",
    padding: "1.5rem",
    background: "var(--card)",
    overflow: "hidden",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
    maxHeight: "70vh",
    overflowY: "auto",
    paddingRight: "0.25rem",
  },

  userCard: {
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "1rem",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: "var(--card)",
  },

  userId: {
    fontWeight: "bold",
    fontSize: "0.9rem",
    wordBreak: "break-all",
  },

  meta: {
    color: "var(--muted)",
    marginTop: "0.25rem",
    fontSize: "0.9rem",
  },

  message: {
    marginTop: "0.75rem",
    lineHeight: 1.5,
    whiteSpace: "pre-wrap",
  },

  dashboardGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: "1.5rem",
    alignItems: "start",
  },

  leftColumn: {
    display: "flex",
    flexDirection: "column",
  },

  rightColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "1.5rem",
  },

  readCard: {
    border: "1px solid var(--border)",
  },

  unreadCard: {
    border: "2px solid #dc2626",
  },

  hoverCard: {
    transform: "translateY(-2px)",
  },
};