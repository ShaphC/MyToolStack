"use client";

import { createContext, useContext, useState } from "react";

type Toast = {
  message: string;
  type?: "success" | "error";
};

const ToastContext = createContext<any>(null);

export function ToastProvider({ children }: any) {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* GLOBAL TOAST UI */}
      {toast && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background:
              toast.type === "success" ? "#16a34a" : "#dc2626",
            color: "#fff",
            padding: "0.75rem 1.2rem",
            borderRadius: "8px",
            fontSize: "0.9rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            zIndex: 9999,
            animation: "fadeIn 0.25s ease",
          }}
        >
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);