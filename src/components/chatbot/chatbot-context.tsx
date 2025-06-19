"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { ChatbotContextFormValues } from "@/schemas/chatbotSchemas/chatbotContextSchema";
import { chatbotContextSchema } from "@/schemas/chatbotSchemas/chatbotContextSchema";

export function ChatbotContext() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<ChatbotContextFormValues>({
    resolver: zodResolver(chatbotContextSchema),
    defaultValues: {
      businessName: "",
      businessType: "",
      services: "",
      openingHours: "",
      contactInfo: "",
      faq: "",
    },
  });

  // Cargar datos al montar el componente
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const res = await fetch("/api/chatbot/context");
        if (!res.ok) {
          throw new Error("Error al obtener el contexto");
        }
        const data = await res.json();
        if (data) {
          form.reset({
            businessName: data.businessName || "",
            businessType: data.businessType || "",
            services: data.services || "",
            openingHours: data.openingHours || "",
            contactInfo: data.contactInfo || "",
            faq: data.faq || "",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo cargar el contexto.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }
    fetchData();
  }, [form, toast]);

  const handleSubmit = async (data: ChatbotContextFormValues) => {
    try {
      const res = await fetch("/api/chatbot/context", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        throw new Error("Error al guardar el contexto");
      }
      toast({
        title: "Contexto guardado",
        description:
          "El chatbot responderá usando la información proporcionada.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo guardar el contexto. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Cargando contexto...</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="businessName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Negocio</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="businessType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Negocio</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Servicios Ofrecidos</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Lista de servicios separados por comas"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="openingHours"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horario de Atención</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Información de Contacto y Ubicación</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="faq"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preguntas Frecuentes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Preguntas y respuestas frecuentes"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button variant="default" type="submit">
          Guardar Contexto
        </Button>
      </form>
    </Form>
  );
}
