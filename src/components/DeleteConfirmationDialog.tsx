"use client";

import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2 } from "lucide-react";

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onConfirm: () => Promise<void> | void;
  title?: string;
  description?: React.ReactNode;
  itemName?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
}

export function DeleteConfirmationDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  title = "¿Estás seguro?",
  description,
  itemName,
  confirmButtonText = "Sí, eliminar",
  cancelButtonText = "Cancelar",
}: DeleteConfirmationDialogProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const defaultDescription = itemName ? (
    <>
      Esta acción no se puede deshacer. Esto eliminará permanentemente{" "}
      <strong>{itemName}</strong>.
    </>
  ) : (
    "Esta acción no se puede deshacer."
  );

  const finalDescription = description || defaultDescription;

  const handleConfirmClick = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      // El componente padre es responsable de cerrar el diálogo (onOpenChange(false))
      // y mostrar notificaciones toast si es necesario.
    } catch (error) {
      console.error("Error en la confirmación:", error);
      // El componente padre también debería manejar los toasts de error.
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription>{finalDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onOpenChange(false)}
            disabled={isConfirming}
          >
            {cancelButtonText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmClick}
            disabled={isConfirming}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {isConfirming && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {confirmButtonText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
