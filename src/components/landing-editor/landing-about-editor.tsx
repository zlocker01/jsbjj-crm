"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { AboutFormData } from "@/schemas/aboutSchemas/aboutSchema";
import { aboutSchema } from "@/schemas/aboutSchemas/aboutSchema";
import { toast } from "../ui/use-toast";
import type { AboutSection } from "@/interfaces/aboutSections/AboutSection";

interface LandingAboutEditorProps {
  aboutContent: Partial<AboutSection>;
  landing_id: string;
}

export function LandingAboutEditor({
  aboutContent,
  landing_id,
}: LandingAboutEditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      title: aboutContent.title || "",
      description: aboutContent.description || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: AboutFormData) => {
    try {
      if (!aboutContent.id) {
        throw new Error("ID de la sección no encontrado");
      }

      const updateData: Partial<AboutSection> = {
        ...data,
        id: aboutContent.id,
        landing_page_id: landing_id,
      };

      const response = await fetch(`/api/aboutSections/${aboutContent.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la sección");
      }
      toast({
        title: "Éxito",
        description: "Sección about actualizada correctamente",
        variant: "success",
      });
    } catch (error) {
      console.error("Error completo:", error);
      toast({
        title: "Error",
        description: "Error al enviar el formulario",
        variant: "destructive",
      });
    }
  };

  return (
    <AccordionItem
      value="about"
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
        Sección Sobre Nosotros
      </AccordionTrigger>
      <AccordionContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30"
        >
          <div className="space-y-2">
            <Label htmlFor="about-title" className="text-sm font-medium">
              Título
            </Label>
            <Input
              id="about-title"
              {...register("title")}
              className={`rounded-md border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
            />
            {errors.title && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="about-description" className="text-sm font-medium">
              Descripción
            </Label>
            <Textarea
              id="about-description"
              {...register("description")}
              className={`rounded-md border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
            />
            {errors.description && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? "opacity-50" : ""
              } bg-green-600 hover:bg-green-700 text-white font-medium`}
            >
              {isSubmitting ? "Actualizando..." : "Actualizar Sección"}
            </Button>
          </div>
        </form>
      </AccordionContent>
    </AccordionItem>
  );
}
