"use client";

import { Button } from "@/components/ui/button";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

// Importar el modal dinámicamente para evitar problemas de hidratación
const AddEmployeeModal = dynamic(
  () =>
    import("@/components/employees/AddEmployeeModal").then(
      (mod) => mod.AddEmployeeModal,
    ),
  {
    ssr: false,
    loading: () => <Button disabled>Cargando...</Button>,
  },
);

interface AddEmployeeButtonProps {}

export function AddEmployeeButton() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Solo renderizar en el cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleEmployeeAdded = () => {
    // Esta función se llamará cuando se agregue un nuevo empleado
    router.refresh();
    setIsOpen(false);
  };

  // No renderizar nada en el servidor
  if (!isMounted) {
    return <Button disabled>Agregar Empleado</Button>;
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Agregar Empleado</Button>
      {isMounted && (
        <AddEmployeeModal
          onEmployeeAdded={handleEmployeeAdded}
          open={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </>
  );
}
