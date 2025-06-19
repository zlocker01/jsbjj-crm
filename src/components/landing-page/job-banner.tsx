"use client";

import type React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { JobBannerSection } from "@/interfaces/jobBannerSections/JobBannerSection";

export default function JobBanner({ data }: { data: JobBannerSection }) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOpen(false);
    toast({
      title: "Solicitud enviada",
      description: "Hemos recibido tu solicitud. Te contactaremos pronto.",
      variant: "success",
    });
  };

  return (
    <section className="py-12 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{data.title}</h2>
        <p className="max-w-2xl mx-auto mb-6">{data.subtitle}</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="lg">
              Envíanos tu CV o portafolio
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Únete a nuestro equipo</DialogTitle>
              <DialogDescription>
                Completa el formulario y adjunta tu CV o portafolio. Revisaremos
                tu información y te contactaremos.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input id="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input id="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Posición de interés</Label>
                <Input id="position" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Experiencia</Label>
                <Textarea id="experience" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cv">CV o Portafolio (PDF, DOC, JPG)</Label>
                <Input
                  id="cv"
                  type="file"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Enviar solicitud</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
