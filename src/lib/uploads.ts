import { mkdir, writeFile } from "fs/promises";
import { join, extname } from "path";
import crypto from "crypto";

export type SavedFile = {
  path: string; // ruta relativa desde la raíz del proyecto
  mime: string;
  size: number;
  nombreOriginal: string;
};

const ALLOWED = new Set(["application/pdf", "image/jpeg", "image/png"]);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function saveUpload(file: File): Promise<SavedFile> {
  const mime = file.type || "application/octet-stream";
  if (!ALLOWED.has(mime)) {
    throw new Error("Tipo de archivo no permitido (solo PDF/JPG/PNG).");
  }

  const size = file.size;
  if (size > MAX_BYTES) {
    throw new Error("El archivo excede 5 MB.");
  }

  const nombreOriginal = file.name || "archivo";
  const buf = Buffer.from(await file.arrayBuffer());

  const now = new Date();
  const y = String(now.getFullYear());
  const m = String(now.getMonth() + 1).padStart(2, "0");

  const dir = join(process.cwd(), "uploads", y, m);
  await mkdir(dir, { recursive: true });

  const hash = crypto.createHash("sha1").update(buf).digest("hex").slice(0, 16);
  const ext = extname(nombreOriginal) || "";
  const fname = `${hash}${ext.toLowerCase()}`;

  const absPath = join(dir, fname);
  await writeFile(absPath, buf);

  const relPath = ["uploads", y, m, fname].join("/"); // para servir luego
  return { path: relPath, mime, size, nombreOriginal };
}
