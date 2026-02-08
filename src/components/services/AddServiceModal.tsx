'use client';

import type { ChangeEvent } from 'react';
import { useState, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createClient } from '@/utils/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Upload, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ServiceFormData } from '@/schemas/servicesSchemas/serviceSchema';
import {
  serviceFormSchema,
  serviceLevels,
} from '@/schemas/servicesSchemas/serviceSchema';
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

interface AddServiceModalProps {
  landingId: string;
  onServiceAdded?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddServiceModal({
  landingId,
  onServiceAdded,
  open,
  onOpenChange,
}: AddServiceModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceFormSchema),
    defaultValues: {
      title: '',
      description: '',
      image: '',
      level: 'Principiantes',
      benefits: [],
      landing_page_id: landingId,
    },
  });

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

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // Mostrar vista previa
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Subir el archivo a Supabase Storage
    try {
      setIsUploading(true);

      const cleanName = file.name.replace(/\s+/g, '-').toLowerCase();
      const fileName = `landing/${landingId}/services/${Date.now()}-${cleanName}`;

      // Subir el archivo al bucket 'landing-images'
      const { error: uploadError } = await supabase.storage
        .from('landing-images')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obtener la URL pública
      const { data: urlData } = supabase.storage
        .from('landing-images')
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Establecer la URL en el formulario
      form.setValue('image', publicUrl, { shouldValidate: true });

      toast({
        title: 'Imagen cargada',
        description: 'La imagen se ha cargado correctamente.',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error al subir la imagen:', error);
      toast({
        title: 'Error',
        description: 'No se pudo subir la imagen. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    setPreviewUrl(null);
    form.setValue('image', '', { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (!data.image) {
        toast({
          title: 'Error',
          description: 'Por favor, sube una imagen para la clase',
          variant: 'destructive',
        });
        return;
      }

      console.log('Enviando datos:', {
        ...data,
        landing_page_id: landingId,
      });

      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          landing_page_id: landingId,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Error en la respuesta de la API:', responseData);
        throw new Error(responseData.error || 'Error al crear el servicio');
      }

      toast({
        title: '¡Clase creada!',
        description: 'La clase se ha añadido correctamente.',
        variant: 'success',
      });

      // Resetear el formulario
      form.reset({
        title: '',
        description: '',
        image: '',
        level: 'Principiantes',
        benefits: [],
        landing_page_id: landingId,
      });

      setPreviewUrl(null);
      onOpenChange(false);

      // Recargar la página o actualizar la lista de servicios
      onServiceAdded?.();
    } catch (error) {
      console.error('Error al crear la clase:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo crear la clase. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar Nueva Clase</DialogTitle>
        </DialogHeader>

        <div>
          <Form {...form}>
            <form
              id="service-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título de la Clase</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Clase de Boxeo" {...field} />
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
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe la clase"
                        rows={3}
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
                                if (e.key === "Enter" || e.key === ",") {
                                  e.preventDefault();
                                  const value = e.currentTarget.value.trim();
                                  if (handleAddBenefit(value)) {
                                    e.currentTarget.value = "";
                                  }
                                }
                              }}
                              onBlur={(e) => {
                                const value = e.target.value.trim();
                                if (handleAddBenefit(value)) {
                                  e.target.value = "";
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

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Foto de la Clase</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />

                        <div className="mt-2 flex items-center gap-4">
                          {previewUrl || field.value ? (
                            <div className="relative">
                              <img
                                src={previewUrl || field.value}
                                alt="Vista previa"
                                className="h-24 w-24 rounded-md object-cover"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                onClick={removeImage}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={triggerFileInput}
                              disabled={isUploading}
                            >
                              {isUploading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Upload className="mr-2 h-4 w-4" />
                              )}
                              Subir Imagen
                            </Button>
                          )}

                          <div className="text-sm text-muted-foreground">
                            {isUploading
                              ? "Subiendo imagen..."
                              : "Sube una foto de la clase (opcional)"}
                          </div>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DialogFooter className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button type="submit" form="service-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Clase"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
