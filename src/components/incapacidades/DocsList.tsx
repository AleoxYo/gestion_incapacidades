"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";

type Doc = {
  id: number;
  incapacidadId: number;
  tipo: "CERTIFICADO" | "EPICRISIS" | "OTRO";
  nombreOriginal: string;
  mime: string;
  size: number;
  path: string;
  uploadedAt: string;
};

export default function DocsList({ id }: { id: number }) {
  const [items, setItems] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/incapacidades/${id}/documentos`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text());
      const data: Doc[] = await res.json();
      setItems(data);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error cargando documentos");
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

  const listItemStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    alignItems: "flex-start",
    borderRadius: 12,
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "10px 11px",
    fontSize: 12,
  };

  const docMetaStyle: CSSProperties = {
    fontSize: 11,
    color: "#6b7280",
  };

  const openLinkStyle: CSSProperties = {
    alignSelf: "center",
    borderRadius: 999,
    padding: "6px 14px",
    border: "none",
    background:
      "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #22c55e 100%)",
    color: "#f9fafb",
    fontSize: 11,
    fontWeight: 600,
    textDecoration: "none",
    boxShadow: "0 6px 14px rgba(37,99,235,0.35)",
    whiteSpace: "nowrap",
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={headerRowStyle}>
        <h4 style={headerTitleStyle}>Documentos adjuntos</h4>
        <button onClick={load} disabled={loading} style={updateButtonStyle}>
          {loading ? "Actualizando…" : "Actualizar"}
        </button>
      </div>

      {err && (
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
          ⚠ {err}
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
        {items.map((d) => (
          <li key={d.id} style={listItemStyle}>
            <div>
              <div style={{ fontWeight: 600 }}>
                {d.tipo} — {d.nombreOriginal}
              </div>
              <div style={docMetaStyle}>
                {d.mime} · {(d.size / 1024).toFixed(1)} KB ·{" "}
                {new Date(d.uploadedAt).toLocaleString()}
              </div>
            </div>
            <a
              href={`/api/documentos/${d.id}/download`}
              target="_blank"
              rel="noreferrer"
              style={openLinkStyle}
            >
              Abrir
            </a>
          </li>
        ))}

        {items.length === 0 && !loading && (
          <li style={{ fontSize: 12, color: "#6b7280" }}>
            Sin documentos adjuntos.
          </li>
        )}
      </ul>
    </div>
  );
}
