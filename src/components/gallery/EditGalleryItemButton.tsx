"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Pencil } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import type { GalleryItem } from "@/interfaces/galleryItems/GalleryItem";
import dynamic from "next/dynamic";

const EditGalleryItemModal = dynamic(() => import("./EditGalleryItemModal"), {
  ssr: false,
});

interface EditGalleryItemButtonProps {
  item: GalleryItem;
  onItemUpdated?: () => void;
}

export default function EditGalleryItemButton({
  item,
  onItemUpdated,
}: EditGalleryItemButtonProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleUpdate = async () => {
    if (onItemUpdated) {
      onItemUpdated();
    }
    router.refresh();
  };

  if (!isMounted) {
    return (
      <Button
        variant="default"
        size="icon"
        className="h-9 w-9 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md opacity-0"
        disabled
      >
        <Pencil className="h-3.5 w-3.5" />
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="default"
        size="icon"
        className={`h-9 w-9 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 transition-all duration-200 shadow-sm hover:shadow-md ${
          isLoading
            ? "opacity-70 cursor-wait"
            : "opacity-0 group-hover:opacity-100"
        }`}
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
        disabled={isLoading}
        aria-disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <Pencil className="h-3.5 w-3.5" />
        )}
        <span className="sr-only">Editar</span>
      </Button>

      {isMounted && (
        <EditGalleryItemModal
          item={item}
          isOpen={isEditing}
          onOpenChange={setIsEditing}
          onItemUpdated={handleUpdate}
        />
      )}
    </>
  );
}
