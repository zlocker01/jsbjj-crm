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

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido",
  }),
});

export default function NewsletterModal() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  useEffect(() => {
    const hasSeenModal = localStorage.getItem("hasSeenNewsletterModal");

    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setOpen(true);
      }, 15000); // 15 segundos

      return () => clearTimeout(timer);
    }
  }, []);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    localStorage.setItem("hasSeenNewsletterModal", "true");
    setOpen(false);
    toast({
      title: "¡Gracias por suscribirte!",
      description: "Recibirás nuestras promociones y tips de belleza.",
    });
  };

  const handleClose = () => {
    localStorage.setItem("hasSeenNewsletterModal", "true");
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
