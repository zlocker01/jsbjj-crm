import { z } from 'zod';

export const serviceCategories = [
  'Prevención y cuidado',
  'Estética dental',
  'Ortodoncia',
  'Rehabilitación y restauración dental',
  'Endodoncia',
  'Periodoncia (encías)',
  'Odontopediatría',
  'Cirugía dental',
  'Urgencias dentales',
] as const;

export const serviceFormSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede tener más de 100 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede tener más de 500 caracteres'),
  price: z
    .number()
    .min(0, 'El precio no puede ser negativo')
    .max(10000, 'El precio no puede ser mayor a 10,000'),
  duration_minutes: z
    .number()
    .min(10, 'La duración debe ser de al menos 10 minutos')
    .max(1440, 'La duración no puede ser mayor a 24 horas')
    .optional()
    .nullable(),
  image: z
    .string()
    .url('La URL de la imagen no es válida')
    .startsWith('http', {
      message: 'La URL debe comenzar con http:// o https://',
    })
    .optional(),
  category: z.enum(serviceCategories, {
    required_error: 'Por favor selecciona una categoría',
  }),
  sessions_count: z.number().min(1, 'Debe haber al menos 1 sesión'),
  target_audience: z.enum(['Niños', 'Adultos', 'Para todos'], {
    required_error: 'Selecciona el público objetivo',
  }),
  landing_page_id: z.string().uuid(),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
