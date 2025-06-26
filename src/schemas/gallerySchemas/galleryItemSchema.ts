import * as z from "zod";

export const galleryItemFormSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  description: z.string().optional(),
  category: z.enum(["Cabello", "Uñas", "Facial", "Barbería", "Colorimetría", "Tratamientos capilares", "Maquillaje"]),
  is_before_after: z.boolean().default(false),
  image: z.string().min(1, "La imagen es requerida").optional(),
  landing_page_id: z
    .string()
    .min(1, "El ID de la página es requerido")
    .optional(),
});

export type GalleryFormData = z.infer<typeof galleryItemFormSchema>;
