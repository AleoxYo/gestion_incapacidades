import type { Incapacidad } from "@prisma/client";

export type IncapacidadDTO = Omit<
  Incapacidad,
  "fechaInicio" | "createdAt" | "updatedAt"
> & {
  fechaInicio: string; // 'YYYY-MM-DD'
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
};
