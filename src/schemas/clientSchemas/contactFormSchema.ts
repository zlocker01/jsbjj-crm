import { z } from "zod";

// Esquema para validación de formulario de contacto en landing page
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  message: z
    .string()
    .min(10, { message: "El mensaje debe tener al menos 10 caracteres" }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
