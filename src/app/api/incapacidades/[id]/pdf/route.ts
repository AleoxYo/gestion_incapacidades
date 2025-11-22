import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { prisma } from "@/lib/db";

export const runtime = "nodejs"; // necesario para usar pdfkit

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return new NextResponse("ID inválido", { status: 400 });
  }

  const inc = await prisma.incapacidad.findUnique({
    where: { id },
  });

  if (!inc) {
    return new NextResponse("Incapacidad no encontrada", { status: 404 });
  }

  // ---------- Crear PDF en memoria ----------
  const doc = new PDFDocument({ margin: 50 });
  const chunks: Buffer[] = [];

  doc.on("data", (chunk) => {
    chunks.push(chunk as Buffer);
  });

  const pdfPromise = new Promise<Buffer>((resolve) => {
    doc.on("end", () => {
      resolve(Buffer.concat(chunks));
    });
  });

  // ---------- Estilo base ----------
  const primaryText = "#111827";
  const secondaryText = "#6b7280";
  const lineColor = "#e5e7eb";

  // Título principal
  doc
    .font("Helvetica-Bold")
    .fontSize(20)
    .fillColor(primaryText)
    .text("Reporte de incapacidad", { align: "left" });

  doc.moveDown(0.4);
  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor(secondaryText)
    .text(`ID: #${inc.id}`)
    .text(`Generado: ${new Date().toLocaleString()}`);

  doc.moveDown(1);

  // Sección: Datos del paciente
  drawSectionTitle(doc, "Datos del paciente", lineColor);

  const nombrePaciente = inc.pacienteNombre ?? inc.colaborador;

  doc
    .moveDown(0.4)
    .font("Helvetica")
    .fontSize(11)
    .fillColor(primaryText)
    .text(`Nombre del paciente: ${nombrePaciente}`)
    .moveDown(0.1)
    .text(
      `Documento del paciente: ${
        inc.pacienteDocumento ? inc.pacienteDocumento : "No registrado"
      }`
    )
    .moveDown(0.1)
    .text(`Profesional que emite: ${inc.colaborador}`);

  doc.moveDown(1);

  // Sección: Información de la incapacidad
  drawSectionTitle(doc, "Información de la incapacidad", lineColor);

  doc
    .moveDown(0.4)
    .font("Helvetica")
    .fontSize(11)
    .fillColor(primaryText)
    .text(`Tipo de radicación: ${inc.tipo}`)
    .moveDown(0.1)
    .text(`Entidad: ${inc.entidad ?? "—"}`)
    .moveDown(0.1)
    .text(`Fecha de inicio: ${inc.fechaInicio.toISOString().substring(0, 10)}`)
    .moveDown(0.1)
    .text(`Días de incapacidad: ${inc.dias}`)
    .moveDown(0.1)
    .text(`Estado actual: ${inc.estado}`);

  doc.moveDown(1);

  // Sección: Trazabilidad
  drawSectionTitle(doc, "Trazabilidad del registro", lineColor);

  doc
    .moveDown(0.4)
    .font("Helvetica")
    .fontSize(10)
    .fillColor(secondaryText)
    .text(`Creado: ${inc.createdAt.toLocaleString()}`)
    .moveDown(0.1)
    .text(`Última actualización: ${inc.updatedAt.toLocaleString()}`);

  doc.end();

  const pdfBuffer = await pdfPromise;
  const pdfBytes = new Uint8Array(pdfBuffer); // BodyInit válido

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="incapacidad-${inc.id}.pdf"`,
    },
  });
}

// Utilidad: dibuja título de sección con línea
function drawSectionTitle(
  doc: PDFKit.PDFDocument,
  title: string,
  lineColor: string
) {
  doc.font("Helvetica-Bold").fontSize(13).fillColor("#111827").text(title);

  const y = doc.y + 2;
  doc.moveTo(50, y).lineTo(545, y).lineWidth(0.7).stroke(lineColor);
}
