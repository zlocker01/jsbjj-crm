"use client";

import React, { useEffect, useState, useId } from "react";
import { useForm } from "react-hook-form";
import { toast } from "../ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { HeroFormData } from "@/schemas/heroSchemas/heroSchema";
import { heroSchema } from "@/schemas/heroSchemas/heroSchema";
import { zodResolver } from "@hookform/resolvers/zod";

interface LandingHeroTextEditorProps {
  landing_id: string;
  onChange: (field: "title" | "subtitle" | "text", value: string) => void;
}

export function LandingHeroTextEditor({
  landing_id,
  onChange,
}: LandingHeroTextEditorProps) {
  const [isLoading, setIsLoading] = useState(false);
  const id = useId();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
  });

  useEffect(() => {
    const fetchHeroSection = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/heroSection/${landing_id}`);
        if (!res.ok) {
          throw new Error("No se pudo obtener la sección hero");
        }

        const responseData = await res.json();

        // Verificar si responseData.data existe
        if (!responseData || !responseData.data) {
          console.error("Estructura de datos inválida:", responseData);
          throw new Error("Datos inválidos recibidos");
        }

        const heroData = responseData.data;
        reset(heroData);
      } catch (error) {
        console.error("Error al obtener la sección hero:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los textos",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (landing_id) {
      fetchHeroSection();
    }
  }, [landing_id, reset]);

  const onSubmitText = async (data: HeroFormData) => {
    try {
      if (!landing_id) {
        toast({
          title: "Error",
          description: "No se encontró el landing_id.",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/heroSection/${landing_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: data.id, // Añadir el ID del registro
          title: data.title,
          subtitle: data.subtitle,
          text: data.text,
          landing_page_id: landing_id, // Asegurar que se envía el landing_page_id
          user_id: data.user_id, // Incluir el user_id si está disponible en data
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar los textos");
      }

      await response.json();

      (["title", "subtitle", "text"] as const).forEach((field) =>
        onChange(field, data[field]),
      );

      toast({
        title: "Éxito",
        description: "Textos actualizados correctamente",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar los textos",
        variant: "destructive",
      });
      console.error("Error al actualizar los textos:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitText)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${id}-hero-title`}>Título</Label>
        <Input
          id={`${id}-hero-title`}
          {...register("title")}
          disabled={isLoading}
          className={`rounded-md border ${
            errors.title ? "border-red-500" : "border-gray-300"
          } dark:bg-gray-800 dark:text-gray-200`}
        />
        {errors.title && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${id}-hero-subtitle`}>Subtítulo</Label>
        <Input
          id={`${id}-hero-subtitle`}
          {...register("subtitle")}
          disabled={isLoading}
          className="rounded-md border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
        />
        {errors.subtitle && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.subtitle.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${id}-hero-text`}>Texto Descriptivo</Label>
        <Textarea
          id={`${id}-hero-text`}
          {...register("text")}
          disabled={isLoading}
          className="rounded-md border-gray-300 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
        />
        {errors.text && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.text.message}
          </p>
        )}
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={`${
            isSubmitting || isLoading ? "opacity-50" : ""
          } bg-green-600 hover:bg-green-700 text-white font-medium`}
        >
          {isSubmitting
            ? "Actualizando Textos..."
            : isLoading
              ? "Cargando..."
              : "Actualizar Textos"}
        </Button>
      </div>
    </form>
  );
}
