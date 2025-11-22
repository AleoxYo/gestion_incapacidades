import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { Incapacidad } from "@prisma/client";
import { IncapacidadUpdateSchema } from "@/lib/validators/incapacidad";

export const runtime = "nodejs";

const toDTO = (i: Incapacidad) => ({
  ...i,
  fechaInicio: i.fechaInicio.toISOString().slice(0, 10),
  createdAt: i.createdAt.toISOString(),
  updatedAt: i.updatedAt.toISOString(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id))
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const item = await prisma.incapacidad.findUnique({ where: { id } });
  if (!item)
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  return NextResponse.json(toDTO(item));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id))
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });

    const body = await req.json();
    const parsed = IncapacidadUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    // Lee antes para bitácora
    const before = await prisma.incapacidad.findUnique({ where: { id } });
    if (!before)
      return NextResponse.json({ error: "No encontrado" }, { status: 404 });

    const updated = await prisma.incapacidad.update({
      where: { id },
      data: {
        ...("estado" in data ? { estado: data.estado } : {}),
        ...("colaborador" in data ? { colaborador: data.colaborador } : {}),
        ...("pacienteNombre" in data
          ? { pacienteNombre: data.pacienteNombre }
          : {}),
        ...("pacienteDocumento" in data
          ? { pacienteDocumento: data.pacienteDocumento ?? null }
          : {}),
        ...("entidad" in data ? { entidad: data.entidad ?? null } : {}),
        ...("tipo" in data ? { tipo: data.tipo } : {}),
        ...("fechaInicio" in data ? { fechaInicio: data.fechaInicio } : {}),
        ...("dias" in data ? { dias: data.dias } : {}),
      },
    });

    // Bitácora
    const acciones: string[] = [];
    if (data.estado && data.estado !== before.estado) {
      acciones.push(`Estado: ${before.estado} -> ${data.estado}`);
      await prisma.bitacora.create({
        data: {
          incapacidadId: id,
          accion: "CAMBIAR_ESTADO",
          detalle: acciones.at(-1) || undefined,
        },
      });
    } else {
      const campos = Object.keys(data).join(", ");
      await prisma.bitacora.create({
        data: {
          incapacidadId: id,
          accion: "ACTUALIZAR",
          detalle: `Campos: ${campos}`,
        },
      });
    }

    return NextResponse.json(toDTO(updated));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error actualizando" }, { status: 500 });
  }
}
