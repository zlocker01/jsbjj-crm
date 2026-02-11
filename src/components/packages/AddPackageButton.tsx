"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Importar el modal dinámicamente para evitar problemas de hidratación
const AddPackageModal = dynamic(
  () =>
    import("@/components/packages/AddPackageModal").then(
      (mod) => mod.AddPackageModal,
    ),
  {
    ssr: false,
    loading: () => <Button disabled>Cargando...</Button>,
  },
);

interface AddPackageButtonProps {
  landingId: string;
}

export function AddPackageButton({ landingId }: AddPackageButtonProps) {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Solo renderizar en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePackageAdded = () => {
    router.refresh();
    setIsOpen(false);
  };

  // No renderizar nada en el servidor
  if (!isMounted) {
    return <Button disabled>Agregar Paquete</Button>;
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Agregar Paquete</Button>
      {isMounted && (
        <AddPackageModal
          landingId={landingId}
          onPackageAdded={handlePackageAdded}
          open={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </>
  );
}
