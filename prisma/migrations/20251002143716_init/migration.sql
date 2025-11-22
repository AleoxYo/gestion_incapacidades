-- CreateTable
CREATE TABLE "Incapacidad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "colaborador" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "fechaInicio" DATETIME NOT NULL,
    "dias" INTEGER NOT NULL,
    "entidad" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'REGISTRADA',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
