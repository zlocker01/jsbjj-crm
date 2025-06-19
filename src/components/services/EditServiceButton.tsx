"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Service } from "@/interfaces/services/Service";
import { EditServiceModal } from "./EditServiceModal";

interface EditServiceButtonProps {
  service: Service;
  onServiceUpdated?: () => void;
}

export function EditServiceButton({
  service,
  onServiceUpdated = () => {},
}: EditServiceButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => setIsOpen(true)}
      >
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Editar servicio</span>
      </Button>

      <EditServiceModal
        service={service}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onServiceUpdated={onServiceUpdated}
      />
    </>
  );
}
