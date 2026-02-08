import { z } from 'zod';

// Esquema para validación de clientes
export const clientSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  phone: z.string().min(6, { message: 'Número de teléfono inválido' }),
  notes: z.string().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;

// Esquema para validación de citas
export const appointmentSchema = z.object({
  clientId: z.string().min(1, { message: 'Selecciona un alumno' }),
  service: z.string().min(1, { message: 'Selecciona un servicio' }),
  date: z.date({ required_error: 'Selecciona una fecha' }),
  startTime: z.string().min(1, { message: 'Selecciona una hora de inicio' }),
  endTime: z.string().min(1, { message: 'Selecciona una hora de fin' }),
  notes: z.string().optional(),
});

export type AppointmentFormValues = z.infer<typeof appointmentSchema>;

// Esquema para validación de correos
export const emailSchema = z.object({
  recipients: z
    .string()
    .min(1, { message: 'Selecciona al menos un destinatario' }),
  subject: z.string().min(1, { message: 'El asunto es obligatorio' }),
  content: z
    .string()
    .min(10, { message: 'El contenido debe tener al menos 10 caracteres' }),
  scheduled: z.boolean().default(false),
  scheduledDate: z.date().optional().nullable(),
  scheduledTime: z.string().optional().default('09:00'),
});

export type EmailFormValues = z.infer<typeof emailSchema>;

// Esquema para validación de configuración de chatbot
export const chatbotContextSchema = z.object({
  businessName: z
    .string()
    .min(1, { message: 'El nombre del negocio es obligatorio' }),
  businessType: z
    .string()
    .min(1, { message: 'El tipo de negocio es obligatorio' }),
  services: z.string().min(1, { message: 'Los servicios son obligatorios' }),
  openingHours: z
    .string()
    .min(1, { message: 'El horario de atención es obligatorio' }),
  contactInfo: z
    .string()
    .min(1, { message: 'La información de contacto es obligatoria' }),
  faq: z.string().optional(),
});

export type ChatbotContextFormValues = z.infer<typeof chatbotContextSchema>;

// Esquema para validación de reglas de chatbot
export const chatbotRuleSchema = z.object({
  trigger: z.string().min(1, { message: 'La palabra clave es obligatoria' }),
  response: z.string().min(1, { message: 'La respuesta es obligatoria' }),
});

export type ChatbotRuleFormValues = z.infer<typeof chatbotRuleSchema>;

// Esquema para validación de formulario de contacto en landing page
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z.string().email({ message: 'Email inválido' }),
  message: z
    .string()
    .min(10, { message: 'El mensaje debe tener al menos 10 caracteres' }),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
