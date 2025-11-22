// src/app/incapacidades/page.tsx
"use client";

import type { CSSProperties } from "react";
import List from "@/components/incapacidades/List";

export default function IncapacidadesPage() {
  const pageStyle: CSSProperties = {
    minHeight: "100vh",
    padding: "24px 16px 32px",
    background:
      "radial-gradient(circle at top left, #1d4ed8 0, transparent 55%), radial-gradient(circle at bottom right, #0ea5e9 0, #020617 55%)",
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    boxSizing: "border-box",
  };

  const shellStyle: CSSProperties = {
    maxWidth: "1120px",
    margin: "0 auto",
  };

  const headerStyle: CSSProperties = {
    marginBottom: "18px",
    color: "#e5e7eb",
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
  };

  const subtitleStyle: CSSProperties = {
    marginTop: "6px",
    marginBottom: 0,
    fontSize: "13px",
    color: "#9ca3af",
  };

  const cardStyle: CSSProperties = {
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "16px 16px 14px",
    boxShadow: "0 16px 40px rgba(15,23,42,0.10)",
    boxSizing: "border-box",
  };

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <header style={headerStyle}>
          <h1 style={titleStyle}>Incapacidades registradas</h1>
          <p style={subtitleStyle}>
            Visualiza todas las incapacidades creadas, actualiza su estado y
            accede a los detalles de cada caso.
          </p>
        </header>

        <section style={cardStyle}>
          <List />
        </section>
      </div>
    </main>
  );
}
