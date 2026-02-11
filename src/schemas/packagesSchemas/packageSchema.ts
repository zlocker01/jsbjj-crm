import { z } from 'zod';

export const packageFormSchema = z.object({
  name: z.string().min(1, 'El nombre del plan es requerido'),
  price: z.number().min(0, 'El precio debe ser mayor o igual a 0'),
  subtitle: z.string().min(1, 'El subtítulo es requerido'),
  image: z.string().optional(),
  benefits: z.array(z.string()).min(1, 'Debes agregar al menos un beneficio'),
  restrictions: z.array(z.string()).optional(),
  landing_page_id: z.string().uuid(),
});

export type PackageFormData = z.infer<typeof packageFormSchema>;
