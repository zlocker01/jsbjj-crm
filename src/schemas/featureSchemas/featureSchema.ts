import { z } from "zod";

export const featureSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder los 500 caracteres"),
  price: z
    .number()
    .min(0, "El precio no puede ser negativo")
    .max(999999.99, "El precio es demasiado alto"),
  duration: z
    .number()
    .int("La duración debe ser un número entero")
    .min(1, "La duración mínima es 1 minuto")
    .max(480, "La duración máxima es 8 horas (480 minutos)"),
  image: z.string().min(1, "La imagen es requerida"),
});

export type FeatureFormData = z.infer<typeof featureSchema>;
