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
import type { JobBannerFormData } from "@/schemas/jobBannerSchemas/jobBannerSchema";
import { jobBannerSchema } from "@/schemas/jobBannerSchemas/jobBannerSchema";
import { toast } from "../ui/use-toast";
import type { JobBannerSection } from "@/interfaces/jobBannerSections/JobBannerSection";

interface LandingJobBannerEditorProps {
  jobBannerContent: Partial<JobBannerSection>;
  landing_id: string;
}

export function LandingJobBannerEditor({
  jobBannerContent,
  landing_id,
}: LandingJobBannerEditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JobBannerFormData>({
    resolver: zodResolver(jobBannerSchema),
    defaultValues: {
      title: jobBannerContent.title || "",
      subtitle: jobBannerContent.subtitle || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: JobBannerFormData) => {
    try {
      if (!jobBannerContent.id) {
        throw new Error("ID de la sección no encontrado");
      }

      const updateData: Partial<JobBannerSection> = {
        ...data,
        id: jobBannerContent.id,
        landing_page_id: landing_id,
      };

      const response = await fetch(`/api/jobBanners/${jobBannerContent.id}`, {
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
        description: "Sección de empleo actualizada correctamente",
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
      value="job-banner"
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
    >
      <AccordionTrigger className="dark:text-white border px-4 py-3 bg-gold dark:bg-black dark:hover:bg-goldHover transition-colors font-medium">
        Sección de Empleo
      </AccordionTrigger>
      <AccordionContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30"
        >
          <div className="space-y-2">
            <Label htmlFor="job-banner-title" className="text-sm font-medium">
              Título
            </Label>
            <Input
              id="job-banner-title"
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
            <Label
              htmlFor="job-banner-subtitle"
              className="text-sm font-medium"
            >
              Subtítulo
            </Label>
            <Textarea
              id="job-banner-subtitle"
              {...register("subtitle")}
              className={`rounded-md border ${
                errors.subtitle ? "border-red-500" : "border-gray-300"
              } focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
            />
            {errors.subtitle && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {errors.subtitle.message}
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
