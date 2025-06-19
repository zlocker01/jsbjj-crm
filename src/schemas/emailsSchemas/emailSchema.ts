import { z } from "zod";

export const emailSchema = z.object({
  recipients: z
    .string()
    .min(1, { message: "Selecciona al menos un destinatario" }),
  subject: z.string().min(1, { message: "El asunto es obligatorio" }),
  content: z
    .string()
    .min(10, { message: "El contenido debe tener al menos 10 caracteres" }),
  scheduled: z.boolean().default(false),
  scheduledDate: z.date().optional().nullable(),
  scheduledTime: z.string().optional().default("09:00"),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
