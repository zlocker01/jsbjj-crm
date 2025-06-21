"use client";

import type { ChangeEvent } from "react";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
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
import type { EmployeeFormData } from "@/schemas/employeeSchemas/employeeSchema";
import { employeeFormSchema } from "@/schemas/employeeSchemas/employeeSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Badge } from "@/components/ui/badge";

interface AddEmployeeModalProps {
  onEmployeeAdded?: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddEmployeeModal({
  onEmployeeAdded,
  open,
  onOpenChange,
}: AddEmployeeModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const supabase = createClient();

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      name: "",
      position: "",
      experience: "",
      skills: [],
      image: "",
    },
  });

  // Función para normalizar los skills (convertir a array si es string)
  const normalizeSkills = (skills: any): string[] => {
    if (Array.isArray(skills)) {
      return skills;
    }
    if (typeof skills === "string") {
      return skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [];
  };

  // Función para manejar la adición de habilidades
  const handleAddSkill = (value: string): boolean => {
    if (!value.trim()) {
      return false;
    }

    const currentSkills = normalizeSkills(form.getValues("skills"));
    if (!currentSkills.includes(value.trim())) {
      const newSkills = [...currentSkills, value.trim()];
      form.setValue("skills", newSkills, { shouldValidate: true });
      return true;
    }
    return false;
  };

  // Función para manejar la eliminación de habilidades
  const handleRemoveSkill = (index: number) => {
    const currentSkills = [...normalizeSkills(form.getValues("skills"))];
    currentSkills.splice(index, 1);
    form.setValue("skills", currentSkills, { shouldValidate: true });
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

      const cleanName = file.name.replace(/\s+/g, "-").toLowerCase();
      const fileName = `${Date.now()}-${cleanName}`;

      // Subir el archivo al bucket 'employees-images'
      const { error: uploadError } = await supabase.storage
        .from("employees-images")
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      // Obtener la URL pública
      const { data: urlData } = supabase.storage
        .from("employees-images")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

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
  };

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al crear el empleado");
      }

      const result = await response.json();

      toast({
        title: "¡Éxito!",
        description: "Empleado creado correctamente",
        variant: "success",
      });

      onEmployeeAdded?.();
      onOpenChange(false);
      form.reset();
      setPreviewUrl(null);
    } catch (error) {
      console.error("Error al crear el empleado:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Error al crear el empleado",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Agregar Nuevo Empleado</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del empleado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Puesto</FormLabel>
                    <FormControl>
                      <Input placeholder="Puesto del empleado" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Experiencia</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe la experiencia del empleado"
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
              name="skills"
              render={({ field }) => {
                const skillsArray = normalizeSkills(field.value);

                return (
                  <FormItem>
                    <FormLabel>Habilidades</FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            placeholder="Escribe una habilidad y presiona Enter o coma"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === ",") {
                                e.preventDefault();
                                const value = e.currentTarget.value.trim();
                                if (handleAddSkill(value)) {
                                  e.currentTarget.value = "";
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value.trim();
                              if (handleAddSkill(value)) {
                                e.target.value = "";
                              }
                            }}
                          />
                          <span className="absolute right-3 top-2 text-sm text-muted-foreground">
                            Enter o ,
                          </span>
                        </div>

                        {skillsArray.length > 0 && (
                          <div className="rounded-md border p-3">
                            <div className="flex flex-wrap gap-2">
                              {skillsArray.map((skill, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="flex items-center gap-1 py-1"
                                >
                                  {skill}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(index)}
                                    className="ml-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                                    aria-label={`Eliminar ${skill}`}
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
                  <FormLabel>Foto del Empleado</FormLabel>
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
                            : "Sube una foto del empleado (opcional)"}
                        </div>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  "Guardar Empleado"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
