import { z } from "zod";

export const galleryItemSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder los 500 caracteres"),
  image: z.string().min(1, "La imagen es requerida"),
  category: z.enum(["Corte", "Barba", "Tratamiento", "Paquete"], {
    errorMap: () => ({ message: "Categoría inválida" }),
  }),
  is_before_after: z.boolean(),
});

export const gallerySchema = z.object({
  items: z
    .array(galleryItemSchema)
    .min(1, "Debe haber al menos una imagen en la galería"),
});
