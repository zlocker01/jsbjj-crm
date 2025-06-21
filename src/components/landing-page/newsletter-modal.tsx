"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/utils/supabase/client";

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido",
  }),
});

export default function NewsletterModal({ landingId }: { landingId: string }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    if (!landingId) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 15000); // 15 segundos

      return () => clearTimeout(timer);
    }
  }, [landingId]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const supabase = await createClient();

      const { data, error } = await supabase.from("newsletter_subscribers").insert([
        {
          email: values.email,
          landing_page_id: landingId,
          subscribed_at: new Date().toISOString(), // Formato ISO para fechas en DB
          is_subscribed: true,
          source: "web",
        },
      ]);

      if (error) {
        toast({
          title: "Error",
          description: "Hubo un error al suscribirte al newsletter.",
          variant: "destructive",
        });
        return;
      }

      localStorage.setItem("hasSeenNewsletterModal", "true");
      setOpen(false);
      toast({
        title: "¡Gracias por suscribirte!",
        description: "Recibirás nuestras promociones y tips de belleza.",
        variant: "success",
      });
    } catch (e) {
      toast({
        title: "Error inesperado",
        description: "No pudimos procesar tu solicitud. Inténtalo más tarde.",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            ¡Recibe tips de belleza y promociones exclusivas!
          </DialogTitle>
          <DialogDescription className="text-center">
            Suscríbete a nuestro newsletter y obtén un 10% de descuento en tu
            próxima visita.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="flex-1">
                Suscribirme
              </Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                No, gracias
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
