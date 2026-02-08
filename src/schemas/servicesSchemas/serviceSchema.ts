import { z } from 'zod';

export const serviceLevels = [
  'Principiantes',
  'Avanzado',
  'Niños',
  'Mujeres',
  'Mixto',
  'Competencia',
] as const;

export const getLevelBadgeColor = (level: string) => {
  switch (level) {
    case 'Principiantes':
      return 'bg-green-500 hover:bg-green-600 text-white border-green-600';
    case 'Avanzado':
      return 'bg-purple-600 hover:bg-purple-700 text-white border-purple-700';
    case 'Niños':
      return 'bg-blue-400 hover:bg-blue-500 text-white border-blue-500';
    case 'Mujeres':
      return 'bg-pink-500 hover:bg-pink-600 text-white border-pink-600';
    case 'Mixto':
      return 'bg-orange-500 hover:bg-orange-600 text-white border-orange-600';
    case 'Competencia':
      return 'bg-red-600 hover:bg-red-700 text-white border-red-700';
    default:
      return 'bg-primary/90 hover:bg-primary text-primary-foreground';
  }
};

export const serviceFormSchema = z.object({
  title: z
    .string()
    .min(3, 'El título debe tener al menos 3 caracteres')
    .max(100, 'El título no puede tener más de 100 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede tener más de 500 caracteres'),
  level: z.enum(serviceLevels, {
    required_error: 'Por favor selecciona un nivel',
  }),
  benefits: z
    .array(z.string())
    .max(3, 'No puedes agregar más de 3 beneficios')
    .optional(),
  image: z
    .string()
    .url('La URL de la imagen no es válida')
    .startsWith('http', {
      message: 'La URL debe comenzar con http:// o https://',
    })
    .optional(),
  landing_page_id: z.string().uuid(),
});

export type ServiceFormData = z.infer<typeof serviceFormSchema>;
