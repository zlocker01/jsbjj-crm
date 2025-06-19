"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import type { Promotion } from "@/interfaces/promotions/Promotion";
import { EditPromotionModal } from "./EditPromotionModal";

interface EditPromotionButtonProps {
  promotion: Promotion;
  onPromotionUpdated?: () => void;
}

export function EditPromotionButton({
  promotion,
  onPromotionUpdated = () => {},
}: EditPromotionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="icon" onClick={() => setIsOpen(true)}>
        <Pencil className="h-4 w-4" />
        <span className="sr-only">Editar promoción</span>
      </Button>

      <EditPromotionModal
        promotion={promotion}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onPromotionUpdated={onPromotionUpdated}
      />
    </>
  );
}
