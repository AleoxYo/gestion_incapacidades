import { z } from "zod";

export const TiposEnum = z.enum(["EPS", "ARL", "PARTICULAR"]);
export const EstadosEnum = z.enum([
  "REGISTRADA",
  "EN_REVISION",
  "APROBADA",
  "RECHAZADA",
]);

/**
 * Esquema para crear una Incapacidad.
 * Requerimos tanto el nombre del MÉDICO (colaborador) como del PACIENTE.
 */
export const IncapacidadCreateSchema = z.object({
  colaborador: z.string().min(2, "Nombre del médico (colaborador) requerido"),
  pacienteNombre: z.string().min(2, "Nombre del paciente requerido"),
  pacienteDocumento: z.string().optional().or(z.literal("")),
  tipo: TiposEnum,
  fechaInicio: z.coerce.date(), // acepta "YYYY-MM-DD"
  dias: z.coerce.number().int().min(1),
  entidad: z.string().optional().or(z.literal("")),
});

export type IncapacidadCreateInput = z.infer<typeof IncapacidadCreateSchema>;

/**
 * Esquema minimal para actualizar estado u otros campos simples después.
 * (Puedes ampliarlo cuando agregues más ediciones desde UI.)
 */
export const IncapacidadUpdateSchema = z.object({
  estado: z
    .enum(["REGISTRADA", "EN_REVISION", "APROBADA", "RECHAZADA"])
    .optional(),
  colaborador: z.string().min(2).optional(),
  pacienteNombre: z.string().min(2).optional(),
  pacienteDocumento: z.string().optional(),
  entidad: z.string().optional(),
  tipo: TiposEnum.optional(),
  fechaInicio: z.coerce.date().optional(),
  dias: z.coerce.number().int().min(1).optional(),
});

export type IncapacidadUpdateInput = z.infer<typeof IncapacidadUpdateSchema>;
