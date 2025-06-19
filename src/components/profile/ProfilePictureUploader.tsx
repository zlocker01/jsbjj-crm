"use client";

import { useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/utils/supabase/client";
import { updateUser } from "@/data/users/updateUser";

interface Props {
  avatarUrl: string | null;
  name: string;
  userId: string;
  isEditing: boolean;
  onUploadSuccess: (url: string) => void;
}

export function ProfilePictureUploader({
  avatarUrl,
  name,
  userId,
  isEditing,
  onUploadSuccess,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPreviewUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);

    try {
      const supabase = await createClient();
      const filePath = `/user_${userId}/${file.name}`;

      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        throw error;
      }

      const { data: urlData } = await supabase.storage
        .from("avatars")
        .getPublicUrl(data.path);

      setPreviewUrl(urlData.publicUrl);
      onUploadSuccess(urlData.publicUrl);

      // Actualizar el campo avatar_url en la base de datos
      const { data: updatedUser, error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: urlData.publicUrl })
        .eq("id", userId)
        .select();

      if (updateError) {
        throw updateError;
      }

      console.log("🚀 ~ handleFileChange ~ updatedUser:", updatedUser);

      toast({
        title: "Foto actualizada",
        description: "Tu foto de perfil se ha subido correctamente.",
        variant: "success",
      });
    } catch (error) {
      console.error("Error al subir la foto:", error);
      toast({
        title: "Error",
        description:
          "No se pudo subir tu foto de perfil. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={previewUrl || "/placeholder.svg?height=96&width=96"}
        />
        <AvatarFallback>
          {name.charAt(0).toUpperCase()}
          {name.split(" ")[1]?.charAt(0).toUpperCase() || ""}
        </AvatarFallback>
      </Avatar>
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleFileChange}
      />
      {isEditing && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Cambiar foto
        </Button>
      )}
    </div>
  );
}
