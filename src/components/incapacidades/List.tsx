"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ESTADOS } from "@/config/constants";
import Modal from "@/components/common/Modal";
import Detail from "@/components/incapacidades/Detail";

type Estado = "REGISTRADA" | "EN_REVISION" | "APROBADA" | "RECHAZADA";
type Tipo = "EPS" | "ARL" | "PARTICULAR";

type Incapacidad = {
  id: number;
  pacienteNombre?: string | null;
  pacienteDocumento?: string | null;
  colaborador: string;
  tipo: Tipo;
  fechaInicio: string;
  dias: number;
  entidad: string | null;
  estado: Estado;
  createdAt: string;
  updatedAt: string;
};

export default function List() {
  const [items, setItems] = useState<Incapacidad[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [openId, setOpenId] = useState<number | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/incapacidades", { cache: "no-store" });
      if (!res.ok) throw new Error("Error cargando");
      const data: Incapacidad[] = await res.json();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  async function changeEstado(id: number, estado: Estado) {
    try {
      const res = await fetch(`/api/incapacidades/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  useEffect(() => {
    load();
    const onCreated = () => load();
    window.addEventListener("incapacidad:created", onCreated);
    return () => window.removeEventListener("incapacidad:created", onCreated);
  }, []);

  const headerRowStyle: CSSProperties = {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: 4,
  };

  const updateButtonStyle: CSSProperties = {
    borderRadius: 999,
    padding: "6px 14px",
    border: "1px solid #d1d5db",
    backgroundColor: loading ? "#f9fafb" : "#ffffff",
    color: "#111827",
    fontSize: 12,
    fontWeight: 500,
    cursor: loading ? "default" : "pointer",
    boxShadow: "0 2px 6px rgba(15,23,42,0.08)",
    transition:
      "background-color 0.12s ease, box-shadow 0.12s ease, transform 0.08s ease",
  };

  const cardStyle: CSSProperties = {
    borderRadius: 14,
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "10px 12px",
    display: "grid",
    gap: 6,
    fontSize: 12,
    boxShadow: "0 10px 26px rgba(15,23,42,0.06)",
  };

  const metaTextStyle: CSSProperties = {
    fontSize: 11,
    color: "#6b7280",
  };

  const lineTextStyle: CSSProperties = {
    fontSize: 12,
    color: "#374151",
  };

  const selectStyle: CSSProperties = {
    padding: "5px 9px",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    fontSize: 11,
    backgroundColor: "#ffffff",
    cursor: "pointer",
  };

  const verButtonStyle: CSSProperties = {
    borderRadius: 999,
    padding: "6px 14px",
    border: "none",
    background:
      "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #22c55e 100%)",
    color: "#f9fafb",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(37,99,235,0.35)",
    transition: "box-shadow 0.12s ease, transform 0.08s ease, filter 0.1s ease",
  };

  const estadoColor: Record<Estado, string> = {
    REGISTRADA: "#0284c7",
    EN_REVISION: "#f59e0b",
    APROBADA: "#16a34a",
    RECHAZADA: "#b91c1c",
  };

  return (
    <section style={{ display: "grid", gap: 8 }}>
      {/* Solo botón actualizar, sin repetir títulos */}
      <div style={headerRowStyle}>
        <button
          onClick={load}
          disabled={loading}
          style={updateButtonStyle}
          onMouseEnter={(e) => {
            if (loading) return;
            e.currentTarget.style.boxShadow = "0 4px 10px rgba(15,23,42,0.18)";
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 2px 6px rgba(15,23,42,0.08)";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          {loading ? "Actualizando…" : "Actualizar"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "7px 9px",
            borderRadius: 10,
            border: "1px solid #fecaca",
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            fontSize: 12,
          }}
        >
          ⚠ {error}
        </div>
      )}

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "grid",
          gap: 8,
        }}
      >
        {items.map((it) => {
          const nombrePaciente = it.pacienteNombre ?? it.colaborador;
          return (
            <li key={it.id} style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <div>
                  <div style={metaTextStyle}>#{it.id}</div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "#0f172a",
                    }}
                  >
                    {nombrePaciente}
                  </div>
                  <div style={metaTextStyle}>
                    {it.tipo} · {it.fechaInicio} · {it.dias} día(s)
                  </div>
                </div>

                <span
                  style={{
                    borderRadius: 999,
                    padding: "4px 10px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#f9fafb",
                    backgroundColor: estadoColor[it.estado],
                    alignSelf: "flex-start",
                    textTransform: "capitalize",
                  }}
                >
                  {it.estado.replace("_", " ")}
                </span>
              </div>

              <div style={lineTextStyle}>
                <span style={{ fontWeight: 600 }}>Médico (colaborador): </span>
                {it.colaborador}
                {it.pacienteDocumento && (
                  <>
                    {" · "}
                    <span style={{ fontWeight: 600 }}>Doc. paciente: </span>
                    {it.pacienteDocumento}
                  </>
                )}
              </div>

              <div style={lineTextStyle}>
                <span style={{ fontWeight: 600 }}>Entidad: </span>
                {it.entidad ?? "—"}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "center",
                  marginTop: 4,
                }}
              >
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 12 }}>Estado:</span>
                  <select
                    value={it.estado}
                    onChange={(e) =>
                      changeEstado(it.id, e.target.value as Estado)
                    }
                    style={selectStyle}
                  >
                    {ESTADOS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  style={verButtonStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-1px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 20px rgba(37,99,235,0.45)";
                    e.currentTarget.style.filter = "brightness(1.03)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 14px rgba(37,99,235,0.35)";
                    e.currentTarget.style.filter = "brightness(1)";
                  }}
                  onClick={() => setOpenId(it.id)}
                >
                  Ver detalle
                </button>
              </div>
            </li>
          );
        })}

        {items.length === 0 && !loading && (
          <li
            style={{
              fontSize: 12,
              color: "#6b7280",
              padding: "2px 2px 0",
            }}
          >
            No hay registros.
          </li>
        )}
      </ul>

      <Modal
        open={openId !== null}
        onClose={() => setOpenId(null)}
        title={openId ? `Incapacidad #${openId}` : undefined}
      >
        {openId !== null && <Detail id={openId} />}
      </Modal>
    </section>
  );
}
