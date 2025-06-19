"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "../ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { getUserId } from "@/data/getUserIdClient";
import type { LandingHeroEditorProps } from "@/interfaces/heroSection/LandingHeroEditorProps";

export function LandingHeroImageEditor({
  landing_id,
  heroSectionId,
  onChange,
}: LandingHeroEditorProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile || !landing_id) {
      toast({
        title: "Error",
        description: "Debes seleccionar una imagen válida.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsUploading(true);

      const cleanName = selectedFile.name.replace(/\s+/g, "-").toLowerCase();
      const fileName = `landing/${landing_id}/hero/${Date.now()}-${cleanName}`;

      const supabase = await createClient();
      const userId = await getUserId();

      if (!userId) {
        console.error("No se pudo obtener el ID del usuario.");
        return;
      }

      const { error: uploadError } = await supabase.storage
        .from("landing-images")
        .upload(fileName, selectedFile);

      if (uploadError) {
        toast({
          title: "Error",
          description: "Error al subir la imagen",
          variant: "destructive",
        });
        console.error(uploadError);
        return;
      }

      const { data: urlData } = await supabase.storage
        .from("landing-images")
        .getPublicUrl(fileName);

      const publicUrl = urlData.publicUrl;

      const response = await fetch(`/api/heroSection/${landing_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: heroSectionId, //! temporal id para deespues obtenerlo directo
          image: publicUrl,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar la imagen en la base de datos");
      }

      toast({
        title: "Éxito",
        description: "Imagen actualizada correctamente",
        variant: "success",
      });

      onChange("image", publicUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al actualizar la imagen",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 border-t pt-4 border-gray-200 dark:border-gray-700"
    >
      <div className="space-y-2">
        <Label htmlFor="hero-image">Imagen de Fondo</Label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <div className="relative w-full sm:w-auto flex-1">
            <Input
              id="hero-image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="cursor-pointer border border-input dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 rounded-md"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <Upload className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          {previewUrl && (
            <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-300 dark:border-gray-700 shadow-sm">
              <img
                src={previewUrl}
                alt="Vista previa"
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button
          type="submit"
          disabled={isUploading}
          className={`${
            isUploading ? "opacity-50" : ""
          } bg-green-600 hover:bg-green-700 text-white font-medium`}
        >
          {isUploading ? "Subiendo Imagen..." : "Actualizar Imagen"}
        </Button>
      </div>
    </form>
  );
}
