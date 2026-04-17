"use client";

import { useRouter } from "next/navigation";

export default function Footer() {
  const router = useRouter();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.grid}>
          {/* LOGO */}
          <div>
            <h4
              style={styles.logo}
              onClick={() => router.push("/")}
            >
              ⚡ SimpleStack
            </h4>
            {/* <p>Build your own internal tools faster.</p> */}
          </div>

          {/* PRODUCT */}
          <div>
            <h4>Product</h4>
            <p >Features</p>
            <p>Pricing</p>
          </div>

          {/* TOOLS */}
          <div>
            <h4>Tools</h4>
            <p>Time Tracker</p>
            <p>Message Repeater</p>
            <p>Secure Link</p>
          </div>

          {/* ACCOUNT */}
          <div>
            <h4>Account</h4>
            <p onClick={() => router.push("/login")} style={styles.link}>
              Login
            </p>
            <p onClick={() => router.push("/signup")} style={styles.link}>
              Sign Up
            </p>
          </div>
        </div>

        <p style={styles.copy}>
          © {new Date().getFullYear()} SimpleStack. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

const styles: any = {
  footer: {
    borderTop: "1px solid #e5e7eb",
    marginTop: "3rem",
    padding: "3rem 2rem",
    background: "#ffffff",
    color: "#000000",
  },

  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "2rem",
    marginBottom: "2rem",
  },

  logo: {
    cursor: "pointer",
    fontWeight: "bold",
  },

  link: {
    cursor: "pointer",
    textDecoration: "underline",
  },

  copy: {
    textAlign: "center",
    color: "#6b7280",
  },
};