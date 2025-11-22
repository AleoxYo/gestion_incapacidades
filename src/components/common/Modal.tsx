"use client";

import { useEffect, type CSSProperties, type ReactNode } from "react";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export default function Modal({ open, title, onClose, children }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background:
      "radial-gradient(circle at top left, rgba(15,23,42,0.72) 0, rgba(15,23,42,0.90) 40%, rgba(15,23,42,0.96) 100%)",
    display: "grid",
    placeItems: "center",
    zIndex: 50,
    padding: "16px",
    boxSizing: "border-box",
  };

  const dialogStyle: CSSProperties = {
    width: "min(720px, 92vw)",
    maxHeight: "86vh",
    borderRadius: 20,
    backgroundColor: "#f9fafb",
    border: "1px solid rgba(148,163,184,0.4)",
    boxShadow: "0 26px 60px rgba(15,23,42,0.85), 0 0 0 1px rgba(15,23,42,0.4)",
    overflow: "hidden",
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: "flex",
    flexDirection: "column",
  };

  const headerStyle: CSSProperties = {
    padding: "12px 16px 10px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    background:
      "linear-gradient(135deg, #0f172a 0%, #020617 40%, #0f172a 100%)",
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    color: "#e5e7eb",
    letterSpacing: "-0.01em",
  };

  const closeButtonStyle: CSSProperties = {
    borderRadius: 999,
    padding: "4px 10px",
    border: "1px solid rgba(148,163,184,0.7)",
    backgroundColor: "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
  };

  const bodyStyle: CSSProperties = {
    padding: "14px 16px 14px",
    overflow: "auto",
  };

  return (
    <div aria-modal="true" role="dialog" onClick={onClose} style={overlayStyle}>
      <div onClick={(e) => e.stopPropagation()} style={dialogStyle}>
        <div style={headerStyle}>
          <h3 style={titleStyle}>{title ?? "Detalle"}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            style={closeButtonStyle}
          >
            ✕
          </button>
        </div>
        <div style={bodyStyle}>{children}</div>
      </div>
    </div>
  );
}
