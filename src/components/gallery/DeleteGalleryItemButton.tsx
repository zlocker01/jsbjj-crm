"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { DeleteDialog } from "@/components/ui/DeleteDialog";

export default function DeleteGalleryItemButton({
  itemId,
  imageUrl,
  itemTitle = "este ítem",
}: {
  itemId: number;
  imageUrl: string;
  itemTitle?: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);

      // 1. Primero eliminamos el ítem usando la API de Next.js
      const response = await fetch(`/api/galleryItems/${itemId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al eliminar el ítem");
      }

      router.refresh();

      toast({
        title: "Eliminado",
        description: "El ítem se ha eliminado correctamente",
        variant: "success",
      });
    } catch (error) {
      console.error("Error al eliminar el ítem:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "No se pudo eliminar el ítem",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        size="icon"
        className={`opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 ${
          isDeleting ? "cursor-wait" : "cursor-pointer"
        }`}
        onClick={() => setIsDialogOpen(true)}
        disabled={isDeleting}
        aria-disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>

      {isDialogOpen && (
        <DeleteDialog
          onDelete={handleDelete}
          buttonText=""
          title={`¿Eliminar ${itemTitle}?`}
          description={`Esta acción eliminará permanentemente ${itemTitle} de la galería.`}
          cancelText="Cancelar"
          confirmText="Eliminar"
          variant="destructive"
        />
      )}
    </>
  );
}
