import { z } from "zod";

export const contactSchema = z.object({
  address: z.string().min(1, "La dirección es requerida"),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,6}$/,
      "Formato de teléfono inválido",
    ),
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  facebook: z
    .string()
    .url("URL de Facebook inválida")
    .optional()
    .or(z.literal("")),
  instagram: z
    .string()
    .url("URL de Instagram inválida")
    .optional()
    .or(z.literal("")),
  tik_tok: z
    .string()
    .url("URL de TikTok inválida")
    .optional()
    .or(z.literal("")),
});

export type ContactFormData = z.infer<typeof contactSchema>;
