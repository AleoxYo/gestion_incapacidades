"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";

type Row = {
  id: number;
  incapacidadId: number;
  accion: string;
  detalle: string | null;
  createdAt: string; // ISO string
};

export default function BitacoraList({ id }: { id: number }) {
  const [items, setItems] = useState<Row[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/incapacidades/${id}/bitacora`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text());
      const data: Row[] = await res.json();
      setItems(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const headerRowStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  };

  const headerTitleStyle: CSSProperties = {
    margin: 0,
    fontSize: 12,
    fontWeight: 600,
    color: "#0f172a",
  };

  const updateButtonStyle: CSSProperties = {
    borderRadius: 999,
    padding: "5px 12px",
    border: "1px solid #d1d5db",
    backgroundColor: loading ? "#f9fafb" : "#ffffff",
    fontSize: 11,
    fontWeight: 500,
    cursor: loading ? "default" : "pointer",
    boxShadow: "0 2px 6px rgba(15,23,42,0.08)",
  };

  const itemCardStyle: CSSProperties = {
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "9px 10px",
    display: "grid",
    gap: 4,
    fontSize: 12,
  };

  const actionStyle: CSSProperties = {
    fontWeight: 600,
    color: "#111827",
  };

  const detailStyle: CSSProperties = {
    fontSize: 12,
    color: "#4b5563",
  };

  const dateStyle: CSSProperties = {
    fontSize: 11,
    color: "#6b7280",
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={headerRowStyle}>
        <h4 style={headerTitleStyle}>Movimientos</h4>
        <button onClick={load} disabled={loading} style={updateButtonStyle}>
          {loading ? "Actualizando…" : "Actualizar"}
        </button>
      </div>

      {error && (
        <div
          style={{
            padding: "6px 8px",
            borderRadius: 10,
            border: "1px solid #fecaca",
            backgroundColor: "#fef2f2",
            color: "#b91c1c",
            fontSize: 11,
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
        {items.map((r) => (
          <li key={r.id} style={itemCardStyle}>
            <div style={actionStyle}>{r.accion}</div>
            {r.detalle && <div style={detailStyle}>{r.detalle}</div>}
            <div style={dateStyle}>
              {new Date(r.createdAt).toLocaleString()}
            </div>
          </li>
        ))}

        {items.length === 0 && !loading && (
          <li style={{ fontSize: 12, color: "#6b7280" }}>
            Sin movimientos registrados.
          </li>
        )}
      </ul>
    </div>
  );
}
