"use client";

import { useState, type CSSProperties } from "react";

type DocTipo = "CERTIFICADO" | "EPICRISIS" | "OTRO";

type Props = { id: number; onUploaded?: () => void };

export default function UploadBox({ id, onUploaded }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [tipo, setTipo] = useState<DocTipo>("OTRO");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      setErr("Selecciona un archivo");
      return;
    }
    setErr(null);
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("tipo", tipo);
      const res = await fetch(`/api/incapacidades/${id}/documentos`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(await res.text());
      setFile(null);
      onUploaded?.();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Error subiendo");
    } finally {
      setLoading(false);
    }
  }

  function handleTipoChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setTipo(e.target.value as DocTipo);
  }

  const formWrapperStyle: CSSProperties = {
    marginTop: 6,
    marginBottom: 4,
  };

  const formStyle: CSSProperties = {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    alignItems: "center",
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  };

  const labelStyle: CSSProperties = {
    fontSize: 12,
    fontWeight: 600,
    color: "#4b5563",
    marginRight: 4,
  };

  const selectStyle: CSSProperties = {
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid #d1d5db",
    fontSize: 12,
    backgroundColor: "#f9fafb",
    appearance: "none",
    backgroundImage:
      "linear-gradient(45deg, transparent 50%, #9ca3af 50%), linear-gradient(135deg, #9ca3af 50%, transparent 50%)",
    backgroundPosition: "calc(100% - 13px) 50%, calc(100% - 8px) 50%",
    backgroundSize: "6px 6px, 6px 6px",
    backgroundRepeat: "no-repeat",
  };

  const fileInputStyle: CSSProperties = {
    fontSize: 11,
  };

  const buttonStyle: CSSProperties = {
    borderRadius: 999,
    padding: "6px 14px",
    border: "none",
    background:
      "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #22c55e 100%)",
    color: "#f9fafb",
    fontSize: 12,
    fontWeight: 600,
    cursor: loading ? "default" : "pointer",
    opacity: loading ? 0.9 : 1,
    boxShadow: "0 6px 14px rgba(37,99,235,0.35)",
  };

  const errorStyle: CSSProperties = {
    fontSize: 11,
    color: "#b91c1c",
  };

  const hintStyle: CSSProperties = {
    fontSize: 11,
    color: "#6b7280",
    marginTop: 2,
  };

  const fileNameStyle: CSSProperties = {
    fontSize: 11,
    color: "#4b5563",
    marginTop: 4,
  };

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#0f172a" }}>
        Adjuntar documento
      </div>
      <p style={hintStyle}>
        Formatos permitidos: PDF, JPG, PNG. Máximo un archivo por carga.
      </p>
      <div style={formWrapperStyle}>
        <form onSubmit={onSubmit} style={formStyle}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={labelStyle}>Tipo:</span>
            <select
              value={tipo}
              onChange={handleTipoChange}
              style={selectStyle}
            >
              <option value="CERTIFICADO">CERTIFICADO</option>
              <option value="EPICRISIS">EPICRISIS</option>
              <option value="OTRO">OTRO</option>
            </select>
          </div>

          <input
            type="file"
            accept=".pdf,image/jpeg,image/png"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            style={fileInputStyle}
          />

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? "Subiendo…" : "Adjuntar"}
          </button>

          {err && <span style={errorStyle}>&nbsp;⚠ {err}</span>}
        </form>
        {file && (
          <div style={fileNameStyle}>
            Archivo seleccionado: <strong>{file.name}</strong>
          </div>
        )}
      </div>
    </div>
  );
}
