"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@/interfaces/landingPages/Category";
import { serviceCategories } from "@/schemas/promotionSchemas/promotionSchema";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Importar el modal dinámicamente para evitar problemas de hidratación
const AddPromotionModal = dynamic(
  () =>
    import("@/components/promotions/AddPromotionModal").then(
      (mod) => mod.AddPromotionModal,
    ),
  {
    ssr: false,
    loading: () => <Button disabled>Cargando...</Button>,
  },
);

interface AddPromotionButtonProps {
  landingId: string;
}

export function AddPromotionButton({ landingId }: AddPromotionButtonProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  // Convert readonly array to mutable Category array
const categoriesList: Category[] = [...serviceCategories];

  // Solo renderizar en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePromotionAdded = () => {
    // Esta función se llamará cuando se agregue una nueva promoción
    router.refresh();
    setIsOpen(false);
  };

  // No renderizar nada en el servidor
  if (!isMounted) {
    return <Button disabled>Agregar Promoción</Button>;
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Agregar Promoción</Button>
      {isMounted && (
        <AddPromotionModal
        landingId={landingId}
        onPromotionAdded={handlePromotionAdded}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onClose={() => setIsOpen(false)}
        categories={categoriesList}
      />
      )}
    </>
  );
}
