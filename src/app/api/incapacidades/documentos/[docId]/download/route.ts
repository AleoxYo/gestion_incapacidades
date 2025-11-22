import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { resolve, isAbsolute } from "path";
import { readFile, stat } from "fs/promises";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: { docId: string } }
) {
  const debug = req.nextUrl.searchParams.get("debug") === "1";
  try {
    const docId = Number(params.docId);
    if (Number.isNaN(docId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 });
    }

    const doc = await prisma.documento.findUnique({ where: { id: docId } });
    if (!doc) {
      return NextResponse.json(
        { error: "Documento no encontrado en BD", docId },
        { status: 404 }
      );
    }

    const relPath = doc.path; // p.ej. "uploads/2025/10/abc.pdf"
    const absPath = isAbsolute(relPath)
      ? relPath
      : resolve(process.cwd(), relPath);

    if (debug) {
      // modo diagnóstico: no sirve el archivo, solo muestra info clave
      let size = null;
      try {
        size = (await stat(absPath)).size;
      } catch {}
      return NextResponse.json(
        { ok: true, docId, relPath, absPath, exists: size !== null, size },
        { status: 200 }
      );
    }

    const st = await stat(absPath); // lanza si no existe
    const buf = await readFile(absPath); // lee todo en memoria (suficiente para demo)
    const uint8 = new Uint8Array(buf); // evita problemas de tipos

    return new NextResponse(uint8, {
      headers: {
        "Content-Type": doc.mime || "application/octet-stream",
        "Content-Length": String(st.size),
        "Content-Disposition": `inline; filename="${encodeURIComponent(
          doc.nombreOriginal
        )}"`,
        "Cache-Control": "private, max-age=0, must-revalidate",
      },
    });
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
    return NextResponse.json(
      { error: "Archivo no encontrado o ilegible" },
      { status: 404 }
    );
  }
}
