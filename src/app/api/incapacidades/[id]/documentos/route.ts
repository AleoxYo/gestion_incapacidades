import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { saveUpload } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const inc = await prisma.incapacidad.findUnique({ where: { id } });
    if (!inc)
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const form = await req.formData();
    const file = form.get("file");
    const tipo = String(form.get("tipo") || "OTRO") as any;

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "Archivo requerido: file" },
        { status: 400 }
      );
    }

    const saved = await saveUpload(file);

    const doc = await prisma.documento.create({
      data: {
        incapacidadId: id,
        tipo,
        nombreOriginal: saved.nombreOriginal,
        mime: saved.mime,
        size: saved.size,
        path: saved.path,
      },
    });

    // (Opcional) Bitácora
    await prisma.bitacora.create({
      data: {
        incapacidadId: id,
        accion: "ADJUNTAR",
        detalle: `Documento ${saved.nombreOriginal} (${
          saved.mime
        }, ${Math.round(saved.size / 1024)} KB)`,
      },
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error subiendo" },
      { status: 400 }
    );
  }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id))
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const rows = await prisma.documento.findMany({
    where: { incapacidadId: id },
    orderBy: { id: "desc" },
  });

  // Normaliza fechas
  const out = rows.map((r) => ({
    ...r,
    uploadedAt: r.uploadedAt.toISOString(),
  }));
  return NextResponse.json(out);
}
