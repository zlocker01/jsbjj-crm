"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ContactFormData } from "@/schemas/contactSchemas/contactSchema";
import { contactSchema } from "@/schemas/contactSchemas/contactSchema";
import { toast } from "../ui/use-toast";
import type { ContactSection } from "@/interfaces/contactSections/ContactSection";

interface LandingContactEditorProps {
  contactContent: Partial<ContactSection>;
  landing_id: string;
}

export function LandingContactEditor({
  contactContent,
  landing_id,
}: LandingContactEditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      address: contactContent.address || "",
      phone: contactContent.phone || "",
      email: contactContent.email || "",
      facebook: contactContent.facebook || "",
      instagram: contactContent.instagram || "",
      tik_tok: contactContent.tik_tok || "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      if (!contactContent.id) {
        throw new Error("ID de la sección no encontrado");
      }

      const updateData: Partial<ContactSection> = {
        ...data,
        id: contactContent.id,
        landing_page_id: landing_id,
      };

      console.log("Sending update data:", updateData);

      const response = await fetch(
        `/api/contactSections/${contactContent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar la sección");
      }

      const responseData = await response.json();
      console.log("Response data:", responseData);

      toast({
        title: "Éxito",
        description: "Sección de contacto actualizada correctamente",
        variant: "success",
      });
    } catch (error) {
      console.error("Error completo:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al enviar el formulario",
        variant: "destructive",
      });
    }
  };

  return (
    <AccordionItem
      value="contact"
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
        Sección de Contacto
      </AccordionTrigger>
      <AccordionContent>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30"
        >
          <div className="space-y-2">
            <Label htmlFor="contact-address" className="text-sm font-medium">
              Dirección
            </Label>
            <Input
              id="contact-address"
              {...register("address")}
              className={`rounded-md border ${errors.address ? "border-red-500" : "border-gray-300"} focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
            />
            {errors.address && (
              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                {errors.address.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-phone" className="text-sm font-medium">
                Teléfono
              </Label>
              <Input
                id="contact-phone"
                {...register("phone")}
                className={`rounded-md border ${errors.phone ? "border-red-500" : "border-gray-300"} focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
              />
              {errors.phone && (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="contact-email"
                type="email"
                {...register("email")}
                className={`rounded-md border ${errors.email ? "border-red-500" : "border-gray-300"} focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
              />
              {errors.email && (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contact-facebook" className="text-sm font-medium">
                Facebook
              </Label>
              <Input
                id="contact-facebook"
                {...register("facebook")}
                placeholder="https://facebook.com/tuempresa"
                className={`rounded-md border ${errors.facebook ? "border-red-500" : "border-gray-300"} focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
              />
              {errors.facebook && (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {errors.facebook.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="contact-instagram"
                className="text-sm font-medium"
              >
                Instagram
              </Label>
              <Input
                id="contact-instagram"
                {...register("instagram")}
                placeholder="https://instagram.com/tuempresa"
                className={`rounded-md border ${errors.instagram ? "border-red-500" : "border-gray-300"} focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
              />
              {errors.instagram && (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {errors.instagram.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-tiktok" className="text-sm font-medium">
                TikTok
              </Label>
              <Input
                id="contact-tiktok"
                {...register("tik_tok")}
                placeholder="https://tiktok.com/@tuempresa"
                className={`rounded-md border ${errors.tik_tok ? "border-red-500" : "border-gray-300"} focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200`}
              />
              {errors.tik_tok && (
                <p className="text-sm font-medium text-red-600 dark:text-red-400">
                  {errors.tik_tok.message}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`${isSubmitting ? "opacity-50" : ""} bg-green-600 hover:bg-green-700 text-white font-medium`}
            >
              {isSubmitting ? "Actualizando..." : "Actualizar Sección"}
            </Button>
          </div>
        </form>
      </AccordionContent>
    </AccordionItem>
  );
}
