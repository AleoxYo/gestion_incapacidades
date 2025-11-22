"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import Form from "@/components/incapacidades/Form";

export default function HomePage() {
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
    textAlign: "center",
  };

  const titleStyle: CSSProperties = {
    margin: 0,
    fontSize: "24px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
  };

  const subtitleStyle: CSSProperties = {
    marginTop: "6px",
    marginBottom: 0,
    fontSize: "13px",
    color: "#9ca3af",
  };

  const contentWrapperStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  };

  const footerBarStyle: CSSProperties = {
    width: "100%",
    maxWidth: 640, // mismo ancho que la tarjeta del Form
    display: "flex",
    justifyContent: "flex-end",
  };

  const linkButtonStyle: CSSProperties = {
    borderRadius: 999,
    padding: "7px 18px",
    border: "1px solid rgba(191,219,254,0.9)",
    backgroundColor: "rgba(15,23,42,0.9)",
    color: "#e5e7eb",
    fontSize: 12,
    fontWeight: 500,
    textDecoration: "none",
    boxShadow: "0 8px 18px rgba(15,23,42,0.7)",
  };

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        {/* Encabezado centrado */}
        <header style={headerStyle}>
          <h1 style={titleStyle}>Panel de gestión de incapacidades</h1>
          <p style={subtitleStyle}>
            Crea nuevas incapacidades y registra la información básica del caso.
          </p>
        </header>

        {/* Contenido centrado */}
        <section style={contentWrapperStyle}>
          {/* El formulario ya trae su propia tarjeta y se auto-centra por ancho */}
          <Form />

          {/* Botón alineado al ancho del formulario */}
          <div style={footerBarStyle}>
            <Link href="/incapacidades" style={linkButtonStyle}>
              Ver incapacidades registradas
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
