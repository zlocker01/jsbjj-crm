"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Loader2, Upload, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { promotionItemSchema, serviceCategories } from "@/schemas/promotionSchemas/promotionSchema";
import type { Promotion } from "@/interfaces/promotions/Promotion";
import type { Category } from "@/interfaces/landingPages/Category";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { createPromotion as addPromotion } from "@/data/promotions/createPromotion";
import { updatePromotion } from "@/data/promotions/updatePromotion";

export type PromotionFormData = z.infer<typeof promotionItemSchema>;

interface AddPromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  promotion?: Promotion;
  categories: Category[];
  landingId?: string; 
  onPromotionAdded?: () => void; 
  onOpenChange?: (open: boolean) => void; 
}

export function AddPromotionModal({
  isOpen,
  onClose,
  promotion,
  categories,
  landingId,
  onPromotionAdded,
  onOpenChange,
}: AddPromotionModalProps) {
  const isEditing = !!promotion;
  const { toast } = useToast();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<PromotionFormData>({
    resolver: zodResolver(promotionItemSchema),
    defaultValues: isEditing
      ? {
          title: promotion.title,
          description: promotion.description,
          price: promotion.price,
          discount_price: promotion.discount_price,
          duration_minutes: promotion.duration_minutes,
          category: promotion.category as Category,
          valid_until: new Date(promotion.valid_until).toISOString(),
          image: promotion.image,
        }
      : {
          title: "",
          description: "",
          price: 0,
          discount_price: 0,
          duration_minutes: 30,
          category: "Facial", 
          valid_until: new Date().toISOString(),
          image: "",
        },
  });

  const price = form.watch("price") || 0;
  const discountPrice = form.watch("discount_price") || 0;

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    
    setIsUploading(true);
    try {
      // Aquí simularemos la carga de la imagen
      // En un caso real, aquí harías la llamada a tu API para subir la archivo
      
      // Simulamos un retraso para la carga
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // En un caso real, tu API devolvería la URL de la imagen subida
      // Por ahora, usamos la URL del preview como si fuera la URL final
      const imageUrl = previewUrl;
      
      form.setValue("image", imageUrl || "", { shouldValidate: true });
      toast({
        title: "Imagen subida",
        description: "La imagen se ha subido correctamente.",
        variant: "success",
      });
      
      return imageUrl;
    } catch (error) {
      setPreviewUrl(null);
      form.setValue("image", "", { shouldValidate: true });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast({
        title: "Error de carga",
        description: `Error al subir la imagen: ${error instanceof Error ? error.message : "Error desconocido"}`,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      form.setValue("image", "", { shouldValidate: true });
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);

    // En lugar de usar startUpload, usamos nuestra función personalizada
    await handleFileUpload(file);
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

  const onSubmit = async (data: PromotionFormData) => {
    try {
      if (!data.image) {
        toast({
          title: "Error de validación",
          description: "Por favor, sube una imagen para la promoción.",
          variant: "destructive",
        });
        return;
      }

      const promotionData = {
        title: data.title,
        description: data.description,
        price: Number(data.price),
        discount_price: Number(data.discount_price),
        duration_minutes: Number(data.duration_minutes),
        category: data.category,
        valid_until: new Date(data.valid_until).toISOString(),
        image: data.image,
        business_id: 1, 
      };

      if (isEditing && promotion) {
        await updatePromotion(promotion.id, promotionData);
        toast({
          title: "Promoción actualizada",
          description: "La promoción se ha actualizado con éxito.",
          variant: "success",
        });
      } else {
        await addPromotion(promotionData);
        toast({
          title: "Promoción añadida",
          description: "La promoción se ha añadido con éxito.",
          variant: "success",
        });
      }

      if (onPromotionAdded) {
        onPromotionAdded();
      }

      form.reset({
        title: "",
        description: "",
        price: 0,
        discount_price: 0,
        duration_minutes: 30,
        category: "Facial", 
        valid_until: new Date().toISOString(),
        image: "",
      });
      setPreviewUrl(null);
      onClose();
    } catch (error) {
      toast({
        title: "Error al guardar",
        description: error instanceof Error ? error.message : "No se pudo guardar la promoción.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (promotion) {
      form.reset({
        title: promotion.title,
        description: promotion.description,
        price: promotion.price,
        discount_price: promotion.discount_price,
        duration_minutes: promotion.duration_minutes,
        category: promotion.category as Category,
        valid_until: new Date(promotion.valid_until).toISOString(),
        image: promotion.image,
      });
      setPreviewUrl(promotion.image || null);
    } else {
      form.reset({
        title: "",
        description: "",
        price: 0,
        discount_price: 0,
        duration_minutes: 30,
        category: "Facial", 
        valid_until: new Date().toISOString(),
        image: "",
      });
      setPreviewUrl(null);
    }
  }, [promotion, form]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange || onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Promoción" : "Añadir Nueva Promoción"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Edita los detalles de la promoción."
              : "Añade una nueva promoción a tu lista."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ej. Corte de Verano"
                      {...field}
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
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe la promoción"
                      {...field}
                      value={field.value ?? ""}
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
                    <FormLabel>Precio Original</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value ?? 0}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="discount_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio con Descuento</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        value={field.value ?? 0}
                      />
                    </FormControl>
                    <FormMessage />
                    {price > 0 && discountPrice > 0 && discountPrice < price && (
                      <p className="text-sm text-green-600 mt-1">
                        Descuento:{" "}
                        {Math.round(((price - discountPrice) / price) * 100)}%
                      </p>
                    )}
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="duration_minutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duración (minutos)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="15"
                        placeholder="30"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || null)}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
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
            </div>

            <FormField
              control={form.control}
              name="valid_until"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Vencimiento</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? (
                            format(new Date(field.value), "PPP")
                          ) : (
                            <span>Elige una fecha</span>
                          )}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) =>
                          field.onChange(date?.toISOString())
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Imagen</FormLabel>
                  <FormControl>
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      {previewUrl ? (
                        <div className="relative mt-2 w-full h-48">
                          <Image
                            src={previewUrl}
                            alt="Vista previa"
                            layout="fill"
                            objectFit="cover"
                            className="rounded-md"
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
                          className="mt-2 w-full border-2 border-dashed rounded-md p-8 text-center cursor-pointer hover:bg-accent/50 transition-colors flex flex-col items-center justify-center space-y-2 min-h-[12rem]"
                          onClick={triggerFileInput}
                        >
                          {isUploading ? (
                            <>
                              <Loader2 className="h-8 w-8 animate-spin text-primary" />
                              <p className="text-sm text-muted-foreground">
                                Subiendo imagen...
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-muted-foreground" />
                              <p className="text-sm text-muted-foreground">
                                Haz clic para subir una imagen
                              </p>
                              <p className="text-xs text-muted-foreground">
                                PNG, JPG, JPEG (máx. 5MB)
                              </p>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isUploading || form.formState.isSubmitting}>
                {isUploading
                  ? "Subiendo imagen..."
                  : form.formState.isSubmitting
                  ? "Guardando..."
                  : isEditing
                  ? "Guardar Cambios"
                  : "Añadir Promoción"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}