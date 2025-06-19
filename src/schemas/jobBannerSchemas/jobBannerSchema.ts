import { z } from "zod";

export const jobBannerSchema = z.object({
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),

  subtitle: z
    .string()
    .min(1, "El subtítulo es requerido")
    .max(500, "El subtítulo no puede exceder los 500 caracteres"),
});

export type JobBannerFormData = z.infer<typeof jobBannerSchema>;
