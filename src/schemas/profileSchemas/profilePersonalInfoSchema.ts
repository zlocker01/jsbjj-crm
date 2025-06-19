import { z } from "zod";

export const profilePersonalInfoSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  email: z
    .string()
    .email("Correo electrónico inválido")
    .min(1, "El correo electrónico es requerido"),
  phone: z.string().optional(),
});

export type ProfilePersonalInfoSchema = z.infer<
  typeof profilePersonalInfoSchema
>;
