"use client";

import { buttonFX } from "./buttonFX";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  style?: any;
  disabled?: boolean;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  style,
  disabled,
}: Props) {
  const base = {
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.15s ease",
    opacity: disabled ? 0.6 : 1,
    transform: "translateY(0)",
    border: "none",
    fontWeight: 600,
  };

  const variants: any = {
    primary: {
      background: "#1d4ed8",
      color: "#fff",
    },
    secondary: {
      background: "transparent",
      border: "1px solid #1d4ed8",
      color: "#1d4ed8",
    },
    ghost: {
      background: "transparent",
      color: "var(--text)",
    },
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{ ...base, ...variants[variant], ...style }}
      {...buttonFX}
    >
      {children}
    </button>
  );
}