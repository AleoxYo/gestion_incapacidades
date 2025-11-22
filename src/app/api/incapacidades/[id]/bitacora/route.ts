import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (Number.isNaN(id))
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });

  const rows = await prisma.bitacora.findMany({
    where: { incapacidadId: id },
    orderBy: { id: "desc" },
  });

  // Normaliza fechas a ISO string para evitar hydration mismatch
  const out = rows.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return NextResponse.json(out);
}
