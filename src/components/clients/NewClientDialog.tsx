"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ClientForm } from "./client-form"; // Asumo que ClientForm está en el mismo directorio o en uno cercano.

interface NewClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: any) => void; // Puedes tipar 'values' de forma más estricta si lo deseas
}

export function NewClientDialog({ open, onOpenChange, onSubmit }: NewClientDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Cliente</DialogTitle>
          <DialogDescription>
            Completa el formulario para añadir un nuevo cliente a tu base de datos.
          </DialogDescription>
        </DialogHeader>
        <ClientForm
          defaultValues={{
            name: "",
            email: "",
            phone: "",
            notes: "",
          }}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
