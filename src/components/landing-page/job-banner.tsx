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
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import type { JobBannerSection } from "@/interfaces/jobBannerSections/JobBannerSection";
import { Loader2 } from "lucide-react";

export default function JobBanner({ data }: { data: JobBannerSection }) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const cvFile = formData.get("cv") as File;

    if (cvFile && cvFile.size === 0) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un archivo para tu CV.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/job-application", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al enviar la solicitud.");
      }

      setOpen(false);
      toast({
        title: "¡Solicitud enviada!",
        description: "Hemos recibido tu solicitud. Te contactaremos pronto.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo enviar tu solicitud. Inténtalo de nuevo.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-gradient-to-r from-amber-400 to-yellow-500 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">{data.title}</h2>
        <p className="max-w-2xl mx-auto mb-6">{data.subtitle}</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary" size="lg">
              Envíanos tu CV o portafolio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Únete a nuestro equipo</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Mensaje (Opcional)</Label>
                <Textarea id="message" name="message" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cv">Adjunta tu CV (PDF, DOCX)</Label>
                <Input id="cv" name="cv" type="file" required accept=".pdf,.doc,.docx" />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Enviando...</>
                  ) : (
                    "Enviar Solicitud"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
