"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("analista@example.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session) router.replace("/");
  }, [session, router]);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.ok) router.replace("/");
    else setError("Credenciales inválidas");
  }

  // ---- estilos base (modernos y auto-contenidos) ----
  const pageStyle: CSSProperties = {
    height: "100vh", // antes minHeight
    overflow: "hidden", // oculta scroll vertical
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px", // un poco menos de padding para asegurar que todo quepa
    background:
      "radial-gradient(circle at top left, #1d4ed8 0, transparent 55%), radial-gradient(circle at bottom right, #0ea5e9 0, #020617 55%)",
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  };

  const shellStyle: CSSProperties = {
    width: "100%",
    maxWidth: "880px",
    borderRadius: "24px",
    backgroundColor: "rgba(15,23,42,0.82)",
    padding: "1px",
    boxShadow: "0 22px 60px rgba(15,23,42,0.7), 0 0 0 1px rgba(15,23,42,0.6)",
  };

  const cardStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
    gap: "0",
    borderRadius: "23px",
    overflow: "hidden",
    backgroundColor: "#f9fafb",
  };

  const leftStyle: CSSProperties = {
    background:
      "radial-gradient(circle at top left, #e0f2fe 0, #0ea5e9 35%, #0369a1 100%)",
    color: "#f9fafb",
    padding: "28px 26px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const rightStyle: CSSProperties = {
    padding: "26px 26px 22px",
    backgroundColor: "#ffffff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  };

  const logoCircleStyle: CSSProperties = {
    width: "40px",
    height: "40px",
    borderRadius: "999px",
    backgroundColor: "rgba(248,250,252,0.96)",
    color: "#0369a1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: "16px",
    boxShadow: "0 6px 18px rgba(15,23,42,0.35)",
  };

  const leftTitleStyle: CSSProperties = {
    margin: "16px 0 4px",
    fontSize: "22px",
    fontWeight: 700,
    letterSpacing: "-0.03em",
  };

  const leftTextStyle: CSSProperties = {
    margin: 0,
    fontSize: "13px",
    lineHeight: 1.5,
    opacity: 0.92,
  };

  const leftFooterStyle: CSSProperties = {
    marginTop: "18px",
    fontSize: "11px",
    opacity: 0.75,
  };

  const mainTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  };

  const subtitleStyle: CSSProperties = {
    marginTop: "4px",
    marginBottom: "20px",
    fontSize: "13px",
    color: "#6b7280",
  };

  const labelStyle: CSSProperties = {
    display: "block",
    marginBottom: "4px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#4b5563",
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "9px 11px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
    transition: "box-shadow 0.15s ease, border-color 0.15s ease",
  };

  const inputWrapperStyle: CSSProperties = {
    marginBottom: "12px",
  };

  const buttonStyle: CSSProperties = {
    width: "100%",
    border: "none",
    borderRadius: "999px",
    padding: "10px 14px",
    marginTop: "8px",
    background:
      "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #22c55e 100%)",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 600,
    cursor: loading ? "default" : "pointer",
    opacity: loading ? 0.9 : 1,
    transform: loading ? "translateY(0px)" : "translateY(0px)",
    transition:
      "background 0.18s ease, box-shadow 0.18s ease, transform 0.08s ease",
    boxShadow: "0 10px 20px rgba(37,99,235,0.35)",
  };

  const errorBoxStyle: CSSProperties = {
    marginTop: "6px",
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid #fecaca",
    backgroundColor: "#fef2f2",
    color: "#b91c1c",
    fontSize: "12px",
    display: "flex",
    gap: "6px",
    alignItems: "flex-start",
  };

  const demoBoxStyle: CSSProperties = {
    marginTop: "16px",
    padding: "8px 10px",
    borderRadius: "10px",
    backgroundColor: "#f9fafb",
    fontSize: "11px",
    color: "#4b5563",
    border: "1px dashed #e5e7eb",
  };

  const footerTextStyle: CSSProperties = {
    marginTop: "10px",
    fontSize: "10px",
    color: "#9ca3af",
    textAlign: "right",
  };

  return (
    <div style={pageStyle}>
      <div style={shellStyle}>
        <div style={cardStyle}>
          {/* Lado izquierdo: branding / mensaje */}
          <div style={leftStyle}>
            <div>
              <div style={logoCircleStyle}>GI</div>
              <h2 style={leftTitleStyle}>Gestión de incapacidades</h2>
              <p style={leftTextStyle}>
                Centraliza la radicación, seguimiento y conciliación de
                incapacidades y licencias, con trazabilidad completa.
              </p>
            </div>
            <div style={leftFooterStyle}>
              Acceso restringido a colaboradores autorizados. La actividad puede
              ser monitoreada para fines de seguridad y auditoría.
            </div>
          </div>

          {/* Lado derecho: formulario */}
          <div style={rightStyle}>
            <div>
              <h1 style={mainTitleStyle}>Iniciar sesión</h1>
              <p style={subtitleStyle}>
                Usa tu correo corporativo y contraseña asignada.
              </p>

              <form onSubmit={onSubmit}>
                <div style={inputWrapperStyle}>
                  <label htmlFor="email" style={labelStyle}>
                    Correo electrónico
                  </label>
                  <input
                    id="email"
                    type="email"
                    style={inputStyle}
                    value={email}
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tucorreo@empresa.com"
                    required
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 0 2px rgba(59,130,246,0.25)";
                      e.currentTarget.style.borderColor = "#3b82f6";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "#d1d5db";
                    }}
                  />
                </div>

                <div style={inputWrapperStyle}>
                  <label htmlFor="password" style={labelStyle}>
                    Contraseña
                  </label>
                  <input
                    id="password"
                    type="password"
                    style={inputStyle}
                    value={password}
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    onFocus={(e) => {
                      e.currentTarget.style.boxShadow =
                        "0 0 0 2px rgba(59,130,246,0.25)";
                      e.currentTarget.style.borderColor = "#3b82f6";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                      e.currentTarget.style.borderColor = "#d1d5db";
                    }}
                  />
                </div>

                {error && (
                  <div style={errorBoxStyle}>
                    <span>⚠</span>
                    <span>{error}</span>
                  </div>
                )}

                <button type="submit" disabled={loading} style={buttonStyle}>
                  {loading ? "Ingresando…" : "Entrar"}
                </button>
              </form>

              <div style={demoBoxStyle}>
                <div style={{ fontWeight: 600, marginBottom: 2 }}>
                  Credenciales de prueba
                </div>
                <div>Analista: analista@example.com / demo123</div>
                <div>Colaborador: colaborador@example.com / demo123</div>
              </div>
            </div>

            <div style={footerTextStyle}>
              © {new Date().getFullYear()} Gestión de incapacidades.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
