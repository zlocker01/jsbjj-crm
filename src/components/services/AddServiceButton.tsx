"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Importar el modal dinámicamente para evitar problemas de hidratación
const AddServiceModal = dynamic(
  () =>
    import("@/components/services/AddServiceModal").then(
      (mod) => mod.AddServiceModal,
    ),
  {
    ssr: false,
    loading: () => <Button disabled>Cargando...</Button>,
  },
);

interface AddServiceButtonProps {
  landingId: string;
}

export function AddServiceButton({ landingId }: AddServiceButtonProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Solo renderizar en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleServiceAdded = () => {
    // Esta función se llamará cuando se agregue un nuevo servicio
    router.refresh();
    setIsOpen(false);
  };

  // No renderizar nada en el servidor
  if (!isMounted) {
    return <Button disabled>Agregar Servicio</Button>;
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Agregar Servicio</Button>
      {isMounted && (
        <AddServiceModal
          landingId={landingId}
          onServiceAdded={handleServiceAdded}
          open={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </>
  );
}
