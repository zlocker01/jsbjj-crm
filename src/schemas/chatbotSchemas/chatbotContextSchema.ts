import { z } from "zod";

export const chatbotContextSchema = z.object({
  businessName: z
    .string()
    .min(1, { message: "El nombre del negocio es obligatorio" }),
  businessType: z
    .string()
    .min(1, { message: "El tipo de negocio es obligatorio" }),
  services: z.string().min(1, { message: "Los servicios son obligatorios" }),
  openingHours: z
    .string()
    .min(1, { message: "El horario de atención es obligatorio" }),
  contactInfo: z
    .string()
    .min(1, { message: "La información de contacto es obligatoria" }),
  faq: z.string().optional(),
});

export type ChatbotContextFormValues = z.infer<typeof chatbotContextSchema>;
