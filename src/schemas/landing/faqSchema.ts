import { z } from "zod";

const faqItemSchema = z.object({
  id: z.number(),
  question: z
    .string()
    .min(1, "La pregunta es requerida")
    .max(200, "La pregunta no puede exceder los 200 caracteres"),
  answer: z
    .string()
    .min(1, "La respuesta es requerida")
    .max(1000, "La respuesta no puede exceder los 1000 caracteres"),
});

export const faqSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: z.string().optional(),
  items: z
    .array(faqItemSchema)
    .min(1, "Debe agregar al menos una pregunta frecuente"),
});

export type FaqFormData = z.infer<typeof faqSchema>;
