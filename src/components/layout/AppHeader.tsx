"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { CSSProperties } from "react";

export default function AppHeader() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const headerStyle: CSSProperties = {
    position: "sticky",
    top: 0,
    zIndex: 40,
    width: "100%",
    background:
      "linear-gradient(180deg, #020617 0%, rgba(2,6,23,0.96) 60%, rgba(2,6,23,0.92) 100%)",
    borderBottom: "1px solid rgba(15,23,42,0.85)",
    boxShadow: "0 12px 30px rgba(15,23,42,0.8)",
  };

  const innerStyle: CSSProperties = {
    maxWidth: "1120px",
    margin: "0 auto",
    padding: "10px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    color: "#e5e7eb",
  };

  const brandStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  const logoCircleStyle: CSSProperties = {
    width: 34,
    height: 34,
    borderRadius: "999px",
    background:
      "radial-gradient(circle at 30% 20%, #e0f2fe 0, #0ea5e9 40%, #0369a1 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
    color: "#0f172a",
    boxShadow: "0 8px 20px rgba(15,23,42,0.7)",
  };

  const brandTextTitle: CSSProperties = {
    margin: 0,
    fontSize: 14,
    fontWeight: 600,
    letterSpacing: "-0.02em",
  };

  const brandTextSubtitle: CSSProperties = {
    margin: 0,
    fontSize: 11,
    color: "#9ca3af",
  };

  const navStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  const pillNavStyle: CSSProperties = {
    padding: "6px 16px",
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.5)",
    backgroundColor: "rgba(15,23,42,0.95)",
    color: "#e5e7eb",
    fontSize: 12,
    fontWeight: 500,
    textDecoration: "none",
    boxShadow: "0 8px 18px rgba(15,23,42,0.7)",
  };

  const userAreaStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: 10,
  };

  const userInfoStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 2,
    textAlign: "right",
  };

  const userNameStyle: CSSProperties = {
    margin: 0,
    fontSize: 13,
    fontWeight: 500,
  };

  const userRoleStyle: CSSProperties = {
    margin: 0,
    fontSize: 11,
    color: "#9ca3af",
  };

  const avatarStyle: CSSProperties = {
    width: 32,
    height: 32,
    borderRadius: 999,
    border: "1px solid rgba(148,163,184,0.9)",
    backgroundColor: "#020617",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12,
    fontWeight: 600,
  };

  const actionButtonStyle: CSSProperties = {
    borderRadius: 999,
    padding: "6px 16px",
    border: "none",
    background:
      "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #22c55e 100%)",
    color: "#f9fafb",
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(37,99,235,0.6)",
  };

  const user = session?.user as
    | { name?: string | null; rol?: string | null }
    | undefined;
  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "US";

  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        {/* Marca */}
        <div style={brandStyle}>
          <div style={logoCircleStyle}>GI</div>
          <div>
            <p style={brandTextTitle}>Gestión de incapacidades</p>
            <p style={brandTextSubtitle}>Plataforma interna</p>
          </div>
        </div>

        {/* Navegación central */}
        <nav style={navStyle} aria-label="Principal">
          <Link href="/" style={pillNavStyle}>
            Panel
          </Link>
          <Link href="/incapacidades" style={pillNavStyle}>
            Incapacidades
          </Link>
        </nav>

        {/* Zona de usuario / autenticación */}
        <div style={userAreaStyle}>
          {status === "authenticated" && user ? (
            <>
              <div style={userInfoStyle}>
                <p style={userNameStyle}>{user.name}</p>
                <p style={userRoleStyle}>{user.rol ?? "Usuario"}</p>
              </div>
              <div style={avatarStyle}>{initials}</div>
              <button
                type="button"
                style={actionButtonStyle}
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <button
              type="button"
              style={actionButtonStyle}
              onClick={() => router.push("/login")}
            >
              Ingresar
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
