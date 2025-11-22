-- CreateTable
CREATE TABLE "Documento" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "incapacidadId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'OTRO',
    "nombreOriginal" TEXT NOT NULL,
    "mime" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "path" TEXT NOT NULL,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Documento_incapacidadId_fkey" FOREIGN KEY ("incapacidadId") REFERENCES "Incapacidad" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Documento_incapacidadId_idx" ON "Documento"("incapacidadId");
