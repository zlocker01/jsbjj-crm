'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Service } from '@/interfaces/services/Service';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { serviceLevels } from '@/schemas/servicesSchemas/serviceSchema';

export const serviceFormSchema = z.object({
  title: z.string().min(1, 'El título es requerido'),
  description: z.string().optional(),
  level: z.enum(serviceLevels, {
    required_error: 'Por favor selecciona un nivel',
  }),
  benefits: z
    .array(z.string())
    .max(3, 'No puedes agregar más de 3 beneficios')
    .optional(),
});

type ServiceFormData = z.infer<typeof serviceFormSchema>;

interface EditServiceModalProps {
  service: Service;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onServiceUpdated: () => void;
}

export function EditServiceModal({
  service,
  isOpen,
  onOpenChange,
  onServiceUpdated,
}: EditServiceModalProps) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: service?.title || '',
      description: service?.description || '',
      level: (service?.level as any) || 'Principiantes',
      benefits: service?.benefits || [],
    },
  });

  useEffect(() => {
    // Reset form when service changes
    form.reset({
      title: service.title,
      description: service.description || '',
      level: (service.level as any) || 'Principiantes',
      benefits: service.benefits || [],
    });
  }, [service, form]);

  const normalizeBenefits = (benefits: any): string[] => {
    if (Array.isArray(benefits)) {
      return benefits;
    }
    if (typeof benefits === 'string') {
      return benefits
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  const handleAddBenefit = (value: string): boolean => {
    if (!value.trim()) {
      return false;
    }

    const currentBenefits = normalizeBenefits(form.getValues('benefits'));
    if (currentBenefits.length >= 3) {
      toast({
        title: 'Límite alcanzado',
        description: 'Máximo 3 beneficios permitidos',
        variant: 'destructive',
      });
      return false;
    }

    if (!currentBenefits.includes(value.trim())) {
      const newBenefits = [...currentBenefits, value.trim()];
      form.setValue('benefits', newBenefits, { shouldValidate: true });
      return true;
    }
    return false;
  };

  const handleRemoveBenefit = (index: number) => {
    const currentBenefits = [...normalizeBenefits(form.getValues('benefits'))];
    currentBenefits.splice(index, 1);
    form.setValue('benefits', currentBenefits, { shouldValidate: true });
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      const response = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          level: data.level,
          benefits: data.benefits,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar la clase');
      }

      toast({
        title: '¡Éxito!',
        description: 'La clase se ha actualizado correctamente.',
        variant: 'success',
      });

      onServiceUpdated();
      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error('Error updating service:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar el servicio',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Clase</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título de la Clase</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Título de la clase"
                      {...field}
                      className={
                        form.formState.errors.title ? 'border-red-500' : ''
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción de la clase"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un nivel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="benefits"
              render={({ field }) => {
                const benefitsArray = normalizeBenefits(field.value);

                return (
                  <FormItem>
                    <FormLabel>Beneficios (Máximo 3)</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            placeholder="Escribe un beneficio y presiona Enter o coma"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                const value = e.currentTarget.value.trim();
                                if (handleAddBenefit(value)) {
                                  e.currentTarget.value = '';
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value.trim();
                              if (handleAddBenefit(value)) {
                                e.target.value = '';
                              }
                            }}
                            disabled={benefitsArray.length >= 3}
                          />
                          <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                            Enter o ,
                          </span>
                        </div>

                        {benefitsArray.length > 0 && (
                          <div className="rounded-md border p-3">
                            <div className="flex flex-wrap gap-2">
                              {benefitsArray.map((benefit, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="flex items-center gap-1 py-1"
                                >
                                  {benefit}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveBenefit(index)}
                                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                    aria-label={`Eliminar ${benefit}`}
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={form.formState.isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  'Actualizar Clase'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
