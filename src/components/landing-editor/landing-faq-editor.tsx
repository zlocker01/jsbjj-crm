"use client";

import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Trash2 } from "lucide-react";

const faqSchema = z.object({
  question: z.string().min(1, "La pregunta es obligatoria"),
  answer: z.string().min(1, "La respuesta es obligatoria"),
});

const editFaqSchema = z.object({
  id: z.number().min(1, "El ID es obligatorio para editar"),
  question: z.string().min(1, "La pregunta es obligatoria"),
  answer: z.string().min(1, "La respuesta es obligatoria"),
});

type FAQ = z.infer<typeof faqSchema> & { id?: number };
type EditFAQ = z.infer<typeof editFaqSchema>;

interface LandingFaqEditorProps {
  faqContent: FAQ[];
  onChange: (faqs: FAQ[]) => void;
  landing_id: string;
}

export function LandingFaqEditor({
  faqContent,
  onChange,
  landing_id,
}: LandingFaqEditorProps) {
  const [faqs, setFaqs] = useState<FAQ[]>(
    Array.isArray(faqContent) ? faqContent : [],
  );
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  const {
    register: registerAddForm,
    handleSubmit: handleAddSubmit,
    formState: { errors: addFormErrors },
    reset: resetAddForm,
  } = useForm<FAQ>({
    resolver: zodResolver(faqSchema),
  });

  const {
    register: registerEditForm,
    handleSubmit: handleEditSubmit,
    formState: { errors: editFormErrors },
    reset: resetEditForm,
    setValue: setEditFormValue,
  } = useForm<EditFAQ>({
    resolver: zodResolver(editFaqSchema),
  });

  const { toast } = useToast();

  const handleAddFaq = async (data: FAQ) => {
    try {
      const response = await fetch("/api/faqItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, landing_page_id: landing_id }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el FAQ item.");
      }

      const newFaq = await response.json();
      const updatedFaqs = [...faqs, newFaq.faqItem];
      setFaqs(updatedFaqs);
      onChange(updatedFaqs);
      resetAddForm();
      toast({
        title: "Éxito",
        description: "FAQ item creado correctamente.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Hubo un problema al crear el FAQ item.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateFaq = async (data: EditFAQ) => {
    try {
      const response = await fetch(`/api/faqItems/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar el FAQ item.");
      }

      const updatedFaq = await response.json();
      const updatedFaqs = faqs.map((faq) =>
        faq.id === updatedFaq.faqItem.id ? updatedFaq.faqItem : faq,
      );
      setFaqs(updatedFaqs);
      onChange(updatedFaqs);
      setEditingFaq(null); // Close edit dialog
      toast({
        title: "Éxito",
        description: "FAQ item actualizado correctamente.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Hubo un problema al actualizar el FAQ item.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFaq = async (id: string) => {
    try {
      const response = await fetch(`/api/faqItems/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("No se pudo eliminar el FAQ item.");
      }

      const updatedFaqs = faqs.filter((faq) => Number(faq.id) !== Number(id));
      setFaqs(updatedFaqs);
      onChange(updatedFaqs);
      toast({
        title: "Éxito",
        description: "FAQ item eliminado correctamente.",
        variant: "success",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.message || "Hubo un problema al eliminar el FAQ item.",
        variant: "destructive",
      });
    }
  };

  const onEditClick = (faq: FAQ) => {
    setEditingFaq(faq);
    setEditFormValue("question", faq.question);
    setEditFormValue("answer", faq.answer);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4">
      <h2 className="text-2xl font-bold text-center">Preguntas Frecuentes</h2>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={faq.id || `new-faq-${index}`}
            className="bg-gray-50 dark:bg-gray-700/30"
            value={`item-${faq.id || `new-faq-${index}`}`}
          >
            <AccordionTrigger className="">{faq.question}</AccordionTrigger>
            <AccordionContent className="flex flex-col items-center gap-2">
              <p>{faq.answer}</p>
              <div className="flex gap-2 w-full">
                {faq.id && (
                  <Button size="sm" onClick={() => onEditClick(faq)}>
                    Editar
                  </Button>
                )}
                {faq.id && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveFaq(String(faq.id))}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="gold" className="w-full">
            Añadir nueva pregunta +
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Añadir Pregunta Frecuente</DialogTitle>
            <DialogDescription>
              Introduce la nueva pregunta y su respuesta.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit(handleAddFaq)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="question">Pregunta</Label>
              <Input
                id="question"
                {...registerAddForm("question")}
                className={addFormErrors.question ? "border-red-500" : ""}
              />
              {addFormErrors.question && (
                <p className="text-sm text-red-600">
                  {addFormErrors.question.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Respuesta</Label>
              <Textarea
                id="answer"
                {...registerAddForm("answer")}
                className={addFormErrors.answer ? "border-red-500" : ""}
              />
              {addFormErrors.answer && (
                <p className="text-sm text-red-600">
                  {addFormErrors.answer.message}
                </p>
              )}
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="gold">Agregar</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit FAQ Dialog */}
      <Dialog
        open={!!editingFaq}
        onOpenChange={(open: boolean) => !open && setEditingFaq(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Pregunta Frecuente</DialogTitle>
            <DialogDescription>
              Edita la pregunta y su respuesta.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={handleEditSubmit(handleUpdateFaq)}
            className="space-y-4"
          >
            <input type="hidden" {...registerEditForm("id")} />
            <div className="space-y-2">
              <Label htmlFor="edit-question">Pregunta</Label>
              <Input
                id="edit-question"
                {...registerEditForm("question")}
                className={editFormErrors.question ? "border-red-500" : ""}
              />
              {editFormErrors.question && (
                <p className="text-sm text-red-600">
                  {editFormErrors.question.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-answer">Respuesta</Label>
              <Textarea
                id="edit-answer"
                {...registerEditForm("answer")}
                className={editFormErrors.answer ? "border-red-500" : ""}
              />
              {editFormErrors.answer && (
                <p className="text-sm text-red-600">
                  {editFormErrors.answer.message}
                </p>
              )}
            </div>
            <div className="flex justify-center">
              <Button type="submit">Guardar Cambios</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
