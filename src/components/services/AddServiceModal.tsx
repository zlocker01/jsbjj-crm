"use client";

import type { ChangeEvent } from "react";
import { useState, useRef } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Upload, X } from "lucide-react";
import type { ServiceFormData } from "@/schemas/servicesSchemas/serviceSchema";
import {
  serviceFormSchema,
  serviceCategories,
} from "@/schemas/servicesSchemas/serviceSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
      title: "",
      description: "",
      price: 0,
      duration_minutes: 30,
      image: "",
      category: "Barbería",
      landing_page_id: landingId,
    },
  });

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

      const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
      const fileName = `landing/${landingId}/services/${Date.now()}-${cleanName}`;

      // Subir el archivo al bucket 'landing-images'
      const { error: uploadError } = await supabase.storage
        .from("landing-images")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obtener la URL pública
      const { data: urlData } = supabase.storage
        .from("landing-images")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      // Establecer la URL en el formulario
      form.setValue("image", publicUrl, { shouldValidate: true });

      toast({
        title: "Imagen cargada",
        description: "La imagen se ha cargado correctamente.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      toast({
        title: "Error",
        description: "No se pudo subir la imagen. Inténtalo de nuevo.",
        variant: "destructive",
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
    form.setValue("image", "", { shouldValidate: true });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      if (!data.image) {
        toast({
          title: "Error",
          description: "Por favor, sube una imagen para el servicio",
          variant: "destructive",
        });
        return;
      }

      console.log("Enviando datos:", {
        ...data,
        price: Number(data.price),
        duration_minutes: data.duration_minutes,
        landing_page_id: landingId,
      });

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          price: Number(data.price),
          duration_minutes: data.duration_minutes,
          landing_page_id: landingId,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error("Error en la respuesta de la API:", responseData);
        throw new Error(responseData.error || "Error al crear el servicio");
      }

      toast({
        title: "¡Servicio creado!",
        description: "El servicio se ha añadido correctamente.",
        variant: "success",
      });

      // Resetear el formulario
      form.reset({
        title: "",
        description: "",
        price: 0,
        duration_minutes: undefined,
        image: "",
        category: "Barbería",
        landing_page_id: landingId,
      });

      setPreviewUrl(null);
      onOpenChange(false);

      // Recargar la página o actualizar la lista de servicios
      onServiceAdded?.();
    } catch (error) {
      console.error("Error al crear el servicio:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo crear el servicio. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Servicio</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título del Servicio</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Corte de cabello" {...field} />
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
                      placeholder="Describe el servicio a detalle"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseFloat(e.target.value) : "",
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (minutos)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="30"
                        step="15"
                        placeholder="30"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? parseInt(e.target.value) : null,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
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
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen del Servicio</FormLabel>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />

                  {previewUrl ? (
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Vista previa"
                        className="w-full h-48 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full h-8 w-8"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={triggerFileInput}
                    >
                      {isUploading ? (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Loader2 className="h-8 w-8 animate-spin text-primary" />
                          <p className="text-sm text-muted-foreground">
                            Subiendo imagen...
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">
                            Haz clic para subir una imagen
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG, JPEG (máx. 5MB)
                          </p>
                        </div>
                      )}
                    </button>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
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
                  "Guardar Servicio"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
