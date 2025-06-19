import { z } from "zod";

const promotionItemSchema = z.object({
  id: z.number(),
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder los 500 caracteres"),
  image: z
    .string()
    .min(1, "La imagen es requerida")
    .url("La imagen debe ser una URL válida"),
});

export const promotionsSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: z.string().optional(),
  items: z
    .array(promotionItemSchema)
    .min(1, "Debe agregar al menos una promoción"),
});

export type PromotionsFormData = z.infer<typeof promotionsSchema>;
