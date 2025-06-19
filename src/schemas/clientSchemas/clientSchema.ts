import { z } from "zod";

export const clientSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),
  email: z.string().email({ message: "Email inválido" }).optional(),
  phone: z
    .string()
    .min(6, { message: "Número de teléfono inválido" })
    .optional(),
  notes: z.string().optional(),
  client_source_id: z.bigint().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
