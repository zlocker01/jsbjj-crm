"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface TogglePromotionButtonProps {
  promotionId: number;
  isActive: boolean;
  onPromotionToggled?: (promotionId: number, isActive: boolean) => void;
}

export function TogglePromotionButton({
  promotionId,
  isActive,
  onPromotionToggled = () => {},
}: TogglePromotionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [active, setActive] = useState(isActive);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      const newStatus = !active;
      
      // Only send the active field to avoid issues with other required fields
      const response = await fetch(`/api/promotions/${promotionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al actualizar el estado de la promoción");
      }

      setActive(newStatus);
      toast({
        title: newStatus ? "Promoción activada" : "Promoción desactivada",
        description: newStatus 
          ? "La promoción ahora es visible en la página de inicio." 
          : "La promoción ya no es visible en la página de inicio.",
        variant: "success",
      });
      
      onPromotionToggled(promotionId, newStatus);
    } catch (error) {
      console.error("Error toggling promotion:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cambiar el estado de la promoción",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      disabled={isLoading}
      title={active ? "Desactivar promoción" : "Activar promoción"}
    >
      {active ? (
        <Eye className="h-4 w-4 text-green-400" />
      ) : (
        <EyeOff className="h-4 w-4 text-gray-400" />
      )}
    </Button>
  );
}
