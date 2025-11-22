"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import { jsPDF } from "jspdf";
import { getErrorMessage } from "@/lib/utils/errors";
import BitacoraList from "./BitacoraList";
import UploadBox from "./UploadBox";
import DocsList from "./DocsList";

type Estado = "REGISTRADA" | "EN_REVISION" | "APROBADA" | "RECHAZADA";
type Tipo = "EPS" | "ARL" | "PARTICULAR";

export type IncapacidadDTO = {
  id: number;
  colaborador: string;
  pacienteNombre?: string | null;
  pacienteDocumento?: string | null;
  tipo: Tipo;
  fechaInicio: string;
  dias: number;
  entidad: string | null;
  estado: Estado;
  createdAt: string;
  updatedAt: string;
};

export default function Detail({ id }: { id: number }) {
  const [item, setItem] = useState<IncapacidadDTO | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/incapacidades/${id}`, {
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text());
      const data: IncapacidadDTO = await res.json();
      setItem(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <div>Cargando…</div>;
  if (error)
    return (
      <div
        style={{
          padding: "8px 10px",
          borderRadius: 10,
          border: "1px solid #fecaca",
          backgroundColor: "#fef2f2",
          color: "#b91c1c",
          fontSize: 12,
        }}
      >
        ⚠ {error}
      </div>
    );
  if (!item) return <div>No encontrado</div>;

  const nombrePaciente = item.pacienteNombre ?? item.colaborador;

  const estadoColor: Record<Estado, string> = {
    REGISTRADA: "#0284c7",
    EN_REVISION: "#f59e0b",
    APROBADA: "#16a34a",
    RECHAZADA: "#b91c1c",
  };

  const tipoTexto: Record<Tipo, string> = {
    EPS: "EPS",
    ARL: "ARL",
    PARTICULAR: "Particular",
  };

  // ---------- estilos base ----------
  const containerStyle: CSSProperties = {
    display: "grid",
    gap: 18,
    fontFamily:
      '"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    fontSize: 13,
    color: "#111827",
  };

  const headerRowStyle: CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
  };

  const patientNameStyle: CSSProperties = {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#0f172a",
    letterSpacing: "-0.02em",
  };

  const patientSubStyle: CSSProperties = {
    margin: "4px 0 0",
    fontSize: 12,
    color: "#6b7280",
  };

  const actionsWrapperStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 8,
  };

  const pillsColumnStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 6,
  };

  const estadoPillStyle: CSSProperties = {
    borderRadius: 999,
    padding: "5px 12px",
    fontSize: 11,
    fontWeight: 600,
    color: "#f9fafb",
  };

  const tipoPillStyle: CSSProperties = {
    borderRadius: 999,
    padding: "4px 11px",
    fontSize: 11,
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    color: "#4b5563",
  };

  const pdfButtonStyle: CSSProperties = {
    borderRadius: 999,
    padding: "6px 14px",
    border: "none",
    background:
      "linear-gradient(135deg, #4b5563 0%, #1f2937 50%, #020617 100%)",
    color: "#f9fafb",
    fontSize: 11,
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 6px 14px rgba(15,23,42,0.4)",
  };

  const pdfErrorStyle: CSSProperties = {
    marginTop: 4,
    fontSize: 11,
    color: "#b91c1c",
    textAlign: "right",
  };

  const sectionCardStyle: CSSProperties = {
    borderRadius: 16,
    border: "1px solid #e5e7eb",
    backgroundColor: "#f9fafb",
    padding: "12px 14px",
  };

  const sectionTitleStyle: CSSProperties = {
    margin: "0 0 6px",
    fontSize: 13,
    fontWeight: 600,
    color: "#0f172a",
  };

  const sectionSubtitleStyle: CSSProperties = {
    margin: 0,
    fontSize: 11,
    color: "#6b7280",
  };

  const metaGridStyle: CSSProperties = {
    marginTop: 10,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "8px 22px",
    fontSize: 12,
  };

  const metaLabelStyle: CSSProperties = {
    fontWeight: 600,
    color: "#374151",
  };

  const blockSeparatorStyle: CSSProperties = {
    height: 1,
    backgroundColor: "#e5e7eb",
    margin: "2px 0 6px",
  };

  // ---------- exportar PDF en el navegador con jsPDF ----------
  async function handleExportPdf() {
    if (!item) return;

    try {
      setPdfError(null);
      setDownloading(true);

      const doc = new jsPDF();

      // Margen izquierdo base
      const marginLeft = 14;
      let y = 18;

      // Título
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.setTextColor(17, 24, 39); // #111827
      doc.text("Reporte de incapacidad", marginLeft, y);

      y += 8;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128); // #6b7280
      doc.text(`ID: #${item.id}`, marginLeft, y);
      y += 5;
      doc.text(`Generado: ${new Date().toLocaleString()}`, marginLeft, y);

      // Sección: Datos del paciente
      y += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 24, 39);
      doc.text("Datos del paciente", marginLeft, y);

      y += 3;
      doc.setDrawColor(229, 231, 235); // línea gris clara
      doc.line(marginLeft, y, 196 - marginLeft, y);

      y += 7;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(31, 41, 55); // #1f2937
      doc.text(`Nombre del paciente: ${nombrePaciente}`, marginLeft, y);
      y += 6;
      doc.text(
        `Documento del paciente: ${item.pacienteDocumento ?? "No registrado"}`,
        marginLeft,
        y
      );
      y += 6;
      doc.text(`Profesional que emite: ${item.colaborador}`, marginLeft, y);

      // Sección: Información de la incapacidad
      y += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 24, 39);
      doc.text("Información de la incapacidad", marginLeft, y);

      y += 3;
      doc.setDrawColor(229, 231, 235);
      doc.line(marginLeft, y, 196 - marginLeft, y);

      y += 7;
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(31, 41, 55);
      doc.text(`Tipo de radicación: ${tipoTexto[item.tipo]}`, marginLeft, y);
      y += 6;
      doc.text(`Entidad: ${item.entidad ?? "—"}`, marginLeft, y);
      y += 6;
      doc.text(`Fecha de inicio: ${item.fechaInicio}`, marginLeft, y);
      y += 6;
      doc.text(`Días de incapacidad: ${item.dias}`, marginLeft, y);
      y += 6;
      doc.text(`Estado actual: ${item.estado}`, marginLeft, y);

      // Sección: Trazabilidad
      y += 10;
      doc.setFontSize(12);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(17, 24, 39);
      doc.text("Trazabilidad del registro", marginLeft, y);

      y += 3;
      doc.setDrawColor(229, 231, 235);
      doc.line(marginLeft, y, 196 - marginLeft, y);

      y += 7;
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(107, 114, 128);
      doc.text(
        `Creado: ${new Date(item.createdAt).toLocaleString()}`,
        marginLeft,
        y
      );
      y += 5;
      doc.text(
        `Última actualización: ${new Date(item.updatedAt).toLocaleString()}`,
        marginLeft,
        y
      );

      // Guardar PDF (dispara descarga)
      doc.save(`incapacidad-${item.id}.pdf`);
    } catch (e) {
      console.error(e);
      setPdfError(
        e instanceof Error ? e.message : "Ocurrió un error al generar el PDF."
      );
    } finally {
      setDownloading(false);
    }
  }

  // ---------- render ----------
  return (
    <div style={containerStyle}>
      {/* Encabezado principal */}
      <div style={headerRowStyle}>
        <div>
          <h2 style={patientNameStyle}>{nombrePaciente}</h2>
          <p style={patientSubStyle}>Emitida por: {item.colaborador}</p>
        </div>

        <div style={actionsWrapperStyle}>
          <div style={pillsColumnStyle}>
            <span
              style={{
                ...estadoPillStyle,
                backgroundColor: estadoColor[item.estado],
              }}
            >
              {item.estado.replace("_", " ")}
            </span>
            <span style={tipoPillStyle}>
              {tipoTexto[item.tipo]} · {item.dias} día(s)
            </span>
          </div>

          <button
            type="button"
            onClick={handleExportPdf}
            style={{
              ...pdfButtonStyle,
              opacity: downloading ? 0.8 : 1,
              cursor: downloading ? "default" : "pointer",
            }}
            disabled={downloading}
          >
            {downloading ? "Generando…" : "Exportar PDF"}
          </button>
          {pdfError && <div style={pdfErrorStyle}>⚠ {pdfError}</div>}
        </div>
      </div>

      {/* Información del caso */}
      <section style={sectionCardStyle}>
        <h3 style={sectionTitleStyle}>Información de la incapacidad</h3>
        <p style={sectionSubtitleStyle}>
          Datos básicos del paciente y del episodio de incapacidad.
        </p>
        <div style={blockSeparatorStyle} />
        <div style={metaGridStyle}>
          {item.pacienteDocumento && (
            <div>
              <span style={metaLabelStyle}>Documento paciente: </span>
              <span>{item.pacienteDocumento}</span>
            </div>
          )}

          <div>
            <span style={metaLabelStyle}>Entidad: </span>
            <span>{item.entidad ?? "—"}</span>
          </div>

          <div>
            <span style={metaLabelStyle}>Fecha de inicio: </span>
            <span>{item.fechaInicio}</span>
          </div>

          <div>
            <span style={metaLabelStyle}>Duración: </span>
            <span>{item.dias} día(s)</span>
          </div>

          <div>
            <span style={metaLabelStyle}>Creado: </span>
            <span>{new Date(item.createdAt).toLocaleString()}</span>
          </div>

          <div>
            <span style={metaLabelStyle}>Actualizado: </span>
            <span>{new Date(item.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </section>

      {/* Documentos */}
      <section style={sectionCardStyle}>
        <h3 style={sectionTitleStyle}>Documentos asociados</h3>
        <p style={sectionSubtitleStyle}>
          Adjunta certificados, epicrisis u otros soportes relacionados con esta
          incapacidad.
        </p>
        <div style={blockSeparatorStyle} />
        <div style={{ display: "grid", gap: 12, marginTop: 6 }}>
          <UploadBox id={item.id} />
          <DocsList id={item.id} />
        </div>
      </section>

      {/* Bitácora */}
      <section style={sectionCardStyle}>
        <h3 style={sectionTitleStyle}>Bitácora de movimientos</h3>
        <p style={sectionSubtitleStyle}>
          Registra los cambios de estado y acciones relevantes sobre la
          incapacidad.
        </p>
        <div style={blockSeparatorStyle} />
        <div style={{ marginTop: 6 }}>
          <BitacoraList id={item.id} />
        </div>
      </section>
    </div>
  );
}
