import { z } from 'zod';

export const clientSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  email: z
    .string()
    .email({ message: 'Email inválido' })
    .optional()
    .or(z.literal('')),
  phone: z.string().optional().or(z.literal('')),
  registration_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: 'Fecha inválida',
  }),
  status: z.enum([
    'active',
    'pending_payment',
    'suspended',
    'paused',
    'trial',
    'injured',
    'inactive',
  ]),
  package_id: z.string().optional().or(z.literal('')),
  // Campos antiguos mantenidos opcionales por compatibilidad, pero no se usarán en el form principal si se descartan
  birthday: z.string().optional(),
  notes: z.string().optional(),
  client_source_id: z.bigint().optional(),
});

export type ClientFormValues = z.infer<typeof clientSchema>;
