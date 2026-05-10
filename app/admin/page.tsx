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

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: authData } = await supabase.auth.getUser();

    const user = authData.user;

    console.log(user)

    if (!user) {
      router.push("/login");
      return;
    }

    // const { data: profile } = await supabase
    //   .from("profiles")
    //   .select("is_admin")
    //   .eq("id", user.id)
    //   .single();

    // if (!profile?.is_admin) {
    //   router.push("/admin");
    //   return;
    // }

    // console.log(profile)

    setAuthorized(true);

    fetchUsers();

    setLoading(false);
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

  return (
    <PageLayout>
      <main style={styles.container}>
        <h1 style={styles.title}>Admin Dashboard</h1>

        <div style={styles.card}>
          <h2>Users</h2>

          <div style={styles.list}>
            {users.map((user) => (
              <div key={user.id} style={styles.userCard}>
                <div>
                  <div style={styles.userId}>
                    {user.id}
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
    maxWidth: "1000px",
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
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    marginTop: "1rem",
  },

  userCard: {
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "1rem",
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
};