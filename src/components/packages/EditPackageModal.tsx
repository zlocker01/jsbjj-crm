'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useToast } from '@/components/ui/use-toast';
import { Loader2, Plus, X, Upload } from 'lucide-react';
import type { Package } from '@/interfaces/packages/Package';
import { packageFormSchema } from '@/schemas/packagesSchemas/packageSchema';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useRouter } from 'next/navigation';

interface EditPackageModalProps {
  pkg: Package;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onPackageUpdated: () => void;
}

export function EditPackageModal({
  pkg,
  isOpen,
  onOpenChange,
  onPackageUpdated,
}: EditPackageModalProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  // Omitimos landing_page_id para edición
  const editPackageSchema = packageFormSchema.omit({ landing_page_id: true });
  type EditPackageFormData = z.infer<typeof editPackageSchema>;

  const form = useForm<EditPackageFormData>({
    resolver: zodResolver(editPackageSchema),
    defaultValues: {
      name: pkg?.name || '',
      price: pkg?.price || 0,
      subtitle: pkg?.subtitle || '',
      image: pkg?.image || '',
      benefits: pkg?.benefits || [],
      restrictions: pkg?.restrictions || [],
    },
  });

  useEffect(() => {
    if (pkg) {
      form.reset({
        name: pkg.name || '',
        price: pkg.price || 0,
        subtitle: pkg.subtitle || '',
        image: pkg.image || '',
        benefits: pkg.benefits || [],
        restrictions: pkg.restrictions || [],
      });
      setPreviewUrl(pkg.image || null);
    }
  }, [pkg, form]);

  const normalizeArray = (items: any): string[] => {
    if (Array.isArray(items)) return items;
    return [];
  };

  const handleAddItem = (
    field: 'benefits' | 'restrictions',
    value: string,
  ): boolean => {
    if (!value.trim()) return false;
    const currentItems = normalizeArray(form.getValues(field));
    if (!currentItems.includes(value.trim())) {
      const newItems = [...currentItems, value.trim()];
      form.setValue(field, newItems, { shouldValidate: true });
      return true;
    }
    return false;
  };

  const handleRemoveItem = (
    field: 'benefits' | 'restrictions',
    index: number,
  ) => {
    const currentItems = [...normalizeArray(form.getValues(field))];
    currentItems.splice(index, 1);
    form.setValue(field, currentItems, { shouldValidate: true });
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
      // Usamos el ID de la landing page para mantener consistencia con services
      const fileName = `landing/${pkg.landing_page_id}/packages/${Date.now()}-${cleanName}`;

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

  const onSubmit = async (data: EditPackageFormData) => {
    try {
      const response = await fetch(`/api/packages/${pkg.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, id: pkg.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el paquete');
      }

      toast({
        title: 'Paquete actualizado',
        description: 'El paquete se ha actualizado correctamente.',
        variant: 'success',
      });

      onPackageUpdated();
      router.refresh();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating package:', error);
      toast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : 'No se pudo actualizar el paquete. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  const ArrayInput = ({
    field,
    label,
    placeholder,
    colorClass = 'text-primary',
  }: {
    field: 'benefits' | 'restrictions';
    label: string;
    placeholder: string;
    colorClass?: string;
  }) => {
    const [inputValue, setInputValue] = useState('');
    const items = normalizeArray(form.watch(field));

    return (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (handleAddItem(field, inputValue)) {
                  setInputValue('');
                }
              }
            }}
          />
          <Button
            type="button"
            variant="secondary"
            onClick={() => {
              if (handleAddItem(field, inputValue)) {
                setInputValue('');
              }
            }}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2 mt-2">
          {items.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-muted p-2 rounded-md text-sm"
            >
              <span className={colorClass}>{item}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive"
                onClick={() => handleRemoveItem(field, index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        <FormMessage />
      </FormItem>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Paquete</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Plan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. Fundamentos, Ilimitado..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen del Paquete</FormLabel>
                  <FormControl>
                    <div className="space-y-4">
                      <div
                        onClick={triggerFileInput}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/50"
                      >
                        {previewUrl ? (
                          <div className="relative w-full aspect-video rounded-md overflow-hidden group">
                            <img
                              src={previewUrl}
                              alt="Vista previa"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-white font-medium">
                                Cambiar imagen
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center space-y-2">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                              <Upload className="h-6 w-6 text-primary" />
                            </div>
                            <p className="text-sm font-medium">
                              Click para subir una imagen
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG o WEBP (max. 2MB)
                            </p>
                          </div>
                        )}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </div>

                      {previewUrl && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="w-full"
                          onClick={removeImage}
                        >
                          <X className="mr-2 h-4 w-4" />
                          Eliminar imagen
                        </Button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej. $1,800 MXN / mes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtítulo Estratégico</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. Ideal para entrenar sin límites"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ArrayInput
              field="benefits"
              label="Beneficios Concretos"
              placeholder="Agregar beneficio..."
            />

            <ArrayInput
              field="restrictions"
              label="Restricciones (Opcional)"
              placeholder="Agregar restricción..."
              colorClass="text-amber-600"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
