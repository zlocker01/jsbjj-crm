"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ProfilePersonalInfoSchema } from "@/schemas/profileSchemas/profilePersonalInfoSchema";
import { profilePersonalInfoSchema } from "@/schemas/profileSchemas/profilePersonalInfoSchema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";

interface Props {
  name: string;
  phone: string;
  email: string;
  onSave: (name: string, phone: string) => Promise<void>;
}

export function ProfileInfoEditor({ name, phone, email, onSave }: Props) {
  const { toast } = useToast();

  const form = useForm<ProfilePersonalInfoSchema>({
    resolver: zodResolver(profilePersonalInfoSchema),
    defaultValues: {
      name: name || "",
      phone: phone || "",
      email: email || "",
    },
    mode: "onChange",
  });

  const handleSubmit = async (data: ProfilePersonalInfoSchema) => {
    try {
      await onSave(data.name, data.phone || "");
      toast({
        title: "Formulario válido",
        description: "La información se ha guardado correctamente.",
        variant: "success",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "No se pudo guardar la información.",
        variant: "destructive",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Teléfono</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo electrónico</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting}>
          Guardar cambios
        </Button>
      </form>
    </Form>
  );
}
