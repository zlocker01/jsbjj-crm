import { z } from "zod";

export const contactSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  address: z.string().min(1, "La dirección es requerida"),
  phone: z
    .string()
    .min(1, "El teléfono es requerido")
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,3}[-\s.]?[0-9]{4,6}$/,
      "Formato de teléfono inválido",
    ),
  email: z.string().min(1, "El email es requerido").email("Email inválido"),
  facebook: z.string().url("URL de Facebook inválida").optional().nullable(),
  instagram: z.string().url("URL de Instagram inválida").optional().nullable(),
  twitter: z.string().url("URL de Twitter inválida").optional().nullable(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
