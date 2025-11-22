import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { IncapacidadCreateSchema } from "@/lib/validators/incapacidad";
import type { Incapacidad } from "@prisma/client";

export const runtime = "nodejs";

// DTO estable (fechas a string)
const toDTO = (i: Incapacidad) => ({
  ...i,
  fechaInicio: i.fechaInicio.toISOString().slice(0, 10),
  createdAt: i.createdAt.toISOString(),
  updatedAt: i.updatedAt.toISOString(),
});

export async function GET() {
  try {
    const items = await prisma.incapacidad.findMany({
      orderBy: { id: "desc" },
    });
    return NextResponse.json(items.map(toDTO));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error listando" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const parsed = IncapacidadCreateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const created = await prisma.incapacidad.create({
      data: {
        // MÉDICO (colaborador) y PACIENTE
        colaborador: data.colaborador,
        pacienteNombre: data.pacienteNombre,
        pacienteDocumento: data.pacienteDocumento || null,

        // Datos de la incapacidad
        tipo: data.tipo,
        fechaInicio: data.fechaInicio,
        dias: data.dias,
        entidad: data.entidad && data.entidad.length ? data.entidad : null,
        // estado por defecto: REGISTRADA
      },
    });

    // Bitácora: CREAR
    await prisma.bitacora.create({
      data: {
        incapacidadId: created.id,
        accion: "CREAR",
        detalle: `Creada por UI; tipo=${created.tipo}, dias=${created.dias}`,
      },
    });

    return NextResponse.json(toDTO(created), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error creando" }, { status: 500 });
  }
}
