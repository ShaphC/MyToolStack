"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/lib/supabase";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      // Supabase automatically reads the hash and sets session
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth error:", error);
        router.replace("/login");
        return;
      }

      if (data.session) {
        // ✅ user is now logged in
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    };

    handleAuth();
  }, [router]);

  return (
    <div style={styles.container}>
      <div style={styles.spinner}></div>
      <p>Confirming your account...</p>
    </div>
  );
}

const styles: any = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #ddd",
    borderTop: "4px solid #1d4ed8",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
};