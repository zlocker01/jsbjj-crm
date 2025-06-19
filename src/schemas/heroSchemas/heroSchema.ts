import { z } from "zod";

export const heroSchema = z.object({
  id: z.number().optional(),
  title: z
    .string()
    .min(1, "El título es requerido")
    .max(100, "El título no puede exceder los 100 caracteres"),
  subtitle: z
    .string()
    .min(1, "El subtítulo es requerido")
    .max(200, "El subtítulo no puede exceder los 200 caracteres"),
  text: z
    .string()
    .min(1, "El texto descriptivo es requerido")
    .max(500, "El texto descriptivo no puede exceder los 500 caracteres"),
  user_id: z.string().optional(),
});

export type HeroFormData = z.infer<typeof heroSchema>;
