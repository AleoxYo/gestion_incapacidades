"use client";

import { useState, type CSSProperties } from "react";
import { getErrorMessage } from "@/lib/utils/errors";

type Props = {
  onCreated?: () => void;
};

export default function Form({ onCreated }: Props) {
  const [form, setForm] = useState({
    colaborador: "",
    pacienteNombre: "",
    pacienteDocumento: "",
    tipo: "EPS",
    fechaInicio: "",
    dias: 1,
    entidad: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/incapacidades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          colaborador: form.colaborador,
          pacienteNombre: form.pacienteNombre,
          pacienteDocumento: form.pacienteDocumento || undefined,
          tipo: form.tipo,
          fechaInicio: form.fechaInicio,
          dias: Number(form.dias),
          entidad: form.entidad || undefined,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Error creando incapacidad");
      }

      // reset formulario
      setForm({
        colaborador: "",
        pacienteNombre: "",
        pacienteDocumento: "",
        tipo: "EPS",
        fechaInicio: "",
        dias: 1,
        entidad: "",
      });

      // disparar eventos externos
      onCreated?.();
      window.dispatchEvent(new CustomEvent("incapacidad:created"));

      // mostrar mensaje de éxito
      setSuccess("Incapacidad creada correctamente.");
      setTimeout(() => setSuccess(null), 4000);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  // -------- Estilos modernos y reutilizables --------
  const formCardStyle: CSSProperties = {
    borderRadius: "18px",
    border: "1px solid #e5e7eb",
    backgroundColor: "#ffffff",
    padding: "18px 18px 16px",
    boxShadow: "0 16px 40px rgba(15,23,42,0.10)",
    maxWidth: "640px",
    width: "100%",
    boxSizing: "border-box",
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  };

  const sectionTitleStyle: CSSProperties = {
    margin: "0 0 10px",
    fontSize: "14px",
    fontWeight: 600,
    color: "#0f172a",
    letterSpacing: "-0.01em",
  };

  const gridStyle: CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px 14px",
  };

  const fullRowStyle: CSSProperties = {
    gridColumn: "1 / -1",
  };

  const fieldWrapperStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  };

  const labelStyle: CSSProperties = {
    fontSize: "12px",
    fontWeight: 600,
    color: "#4b5563",
  };

  const hintStyle: CSSProperties = {
    fontSize: "11px",
    color: "#6b7280",
  };

  const smallHintStyle: CSSProperties = {
    fontSize: "10px",
    color: "#9ca3af",
  };

  const inputStyle: CSSProperties = {
    width: "100%",
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "13px",
    color: "#111827",
    outline: "none",
    boxSizing: "border-box",
    transition: "box-shadow 0.15s ease, border-color 0.15s ease",
  };

  const selectStyle: CSSProperties = {
    ...inputStyle,
    appearance: "none",
    backgroundImage:
      "linear-gradient(45deg, transparent 50%, #9ca3af 50%), linear-gradient(135deg, #9ca3af 50%, transparent 50%)",
    backgroundPosition: "calc(100% - 14px) 50%, calc(100% - 9px) 50%",
    backgroundSize: "6px 6px, 6px 6px",
    backgroundRepeat: "no-repeat",
  };

  const footerStyle: CSSProperties = {
    marginTop: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  };

  const submitButtonStyle: CSSProperties = {
    borderRadius: "999px",
    border: "none",
    padding: "8px 18px",
    background:
      "linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #22c55e 100%)",
    color: "#f9fafb",
    fontSize: "13px",
    fontWeight: 600,
    cursor: loading ? "default" : "pointer",
    opacity: loading ? 0.9 : 1,
    boxShadow: "0 8px 16px rgba(37,99,235,0.35)",
    transition:
      "background 0.18s ease, box-shadow 0.18s ease, transform 0.08s ease",
  };

  const infoTextStyle: CSSProperties = {
    fontSize: "11px",
    color: "#6b7280",
  };

  const errorBoxStyle: CSSProperties = {
    marginTop: "10px",
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

  const successBoxStyle: CSSProperties = {
    marginTop: "10px",
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid #bbf7d0",
    backgroundColor: "#f0fdf4",
    color: "#166534",
    fontSize: "12px",
    display: "flex",
    gap: "6px",
    alignItems: "center",
  };

  function handleFocus(
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    e.currentTarget.style.boxShadow = "0 0 0 2px rgba(59,130,246,0.25)";
    e.currentTarget.style.borderColor = "#3b82f6";
  }

  function handleBlur(
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    e.currentTarget.style.boxShadow = "none";
    e.currentTarget.style.borderColor = "#d1d5db";
  }

  return (
    <form onSubmit={handleSubmit} style={formCardStyle}>
      <h3 style={sectionTitleStyle}>Nueva incapacidad</h3>

      <div style={{ ...gridStyle, marginBottom: 10 }}>
        {/* Colaborador */}
        <div style={fieldWrapperStyle}>
          <label style={labelStyle}>Profesional que emite la incapacidad</label>
          <input
            style={inputStyle}
            placeholder="Nombre del médico o colaborador"
            value={form.colaborador}
            onChange={(e) => setForm({ ...form, colaborador: e.target.value })}
            required
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span style={hintStyle}>
            Nombre del colaborador responsable de radicar el documento.
          </span>
        </div>

        {/* Tipo de trámite */}
        <div style={fieldWrapperStyle}>
          <label style={labelStyle}>Tipo de radicación</label>
          <select
            style={selectStyle}
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            onFocus={handleFocus}
            onBlur={handleBlur}
          >
            <option value="EPS">EPS</option>
            <option value="ARL">ARL</option>
            <option value="PARTICULAR">Particular</option>
          </select>
          <span style={hintStyle}>
            Selecciona si la incapacidad se radica ante EPS, ARL o de forma
            particular.
          </span>
        </div>

        {/* Paciente */}
        <div style={{ ...fieldWrapperStyle, ...fullRowStyle }}>
          <label style={labelStyle}>Paciente</label>
          <input
            style={inputStyle}
            placeholder="Nombre completo del paciente"
            value={form.pacienteNombre}
            onChange={(e) =>
              setForm({ ...form, pacienteNombre: e.target.value })
            }
            required
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Documento paciente */}
        <div style={fieldWrapperStyle}>
          <label style={labelStyle}>Documento del paciente (opcional)</label>
          <input
            style={inputStyle}
            placeholder="Número de documento"
            value={form.pacienteDocumento}
            onChange={(e) =>
              setForm({ ...form, pacienteDocumento: e.target.value })
            }
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Entidad */}
        <div style={fieldWrapperStyle}>
          <label style={labelStyle}>Entidad (opcional)</label>
          <input
            style={inputStyle}
            placeholder="Nombre de EPS / ARL / aseguradora"
            value={form.entidad}
            onChange={(e) => setForm({ ...form, entidad: e.target.value })}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>

        {/* Fecha inicio */}
        <div style={fieldWrapperStyle}>
          <label style={labelStyle}>Fecha de inicio</label>
          <input
            type="date"
            style={inputStyle}
            value={form.fechaInicio}
            onChange={(e) => setForm({ ...form, fechaInicio: e.target.value })}
            required
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <span style={smallHintStyle}>
            Usa el selector de fecha de tu navegador; el formato mostrado
            depende de tu configuración regional.
          </span>
        </div>

        {/* Días */}
        <div style={fieldWrapperStyle}>
          <label style={labelStyle}>Días de incapacidad</label>
          <input
            type="number"
            min={1}
            style={inputStyle}
            value={form.dias}
            onChange={(e) => setForm({ ...form, dias: Number(e.target.value) })}
            required
            placeholder="Número de días"
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        </div>
      </div>

      <div style={footerStyle}>
        <p style={infoTextStyle}>
          Los datos ingresados podrán ser actualizados más adelante durante el
          proceso de revisión.
        </p>
        <button type="submit" disabled={loading} style={submitButtonStyle}>
          {loading ? "Guardando…" : "Crear incapacidad"}
        </button>
      </div>

      {/* Mensaje de éxito */}
      {success && (
        <div style={successBoxStyle}>
          <span>✅</span>
          <span>{success}</span>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div style={errorBoxStyle}>
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}
    </form>
  );
}
