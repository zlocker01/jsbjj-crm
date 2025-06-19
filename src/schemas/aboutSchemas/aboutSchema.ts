import { z } from "zod";

export const aboutSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(1000, "La descripción no puede exceder los 1000 caracteres"),
});

export type AboutFormData = z.infer<typeof aboutSchema>;
