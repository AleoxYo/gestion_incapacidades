-- CreateTable
CREATE TABLE "Bitacora" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "incapacidadId" INTEGER NOT NULL,
    "accion" TEXT NOT NULL,
    "detalle" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Bitacora_incapacidadId_fkey" FOREIGN KEY ("incapacidadId") REFERENCES "Incapacidad" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Bitacora_incapacidadId_idx" ON "Bitacora"("incapacidadId");
