"use client";

import { useState } from "react";
import { Edit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ProfilePictureUploader } from "./ProfilePictureUploader";
import { ProfileInfoEditor } from "./ProfileInfoEditor";
import { updateUser } from "@/data/users/updateUser";
import { Badge } from "../ui/badge";

interface ProfilePersonalInfoProps {
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar_url: string | null;
    role: string | null;
  };
  userId: string;
  onCancel?: () => void;
}

export function ProfilePersonalInfo({
  user,
  userId,
  onCancel,
}: ProfilePersonalInfoProps) {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(user);

  const handleSave = async (name: string, phone: string) => {
    try {
      const updatedUser = await updateUser(userId, { name, phone });
      if (updatedUser) {
        setProfile((prev) => ({ ...prev, name, phone }));
        setIsEditing(false);
        toast({
          title: "Perfil actualizado",
          description: "Tu información personal se ha guardado correctamente.",
          variant: "success",
        });
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar tu información personal.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center">
            <User className="mr-2 h-5 w-5 text-primary" />
            Información Personal
          </CardTitle>
          <CardDescription>Gestiona tu información de perfil</CardDescription>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsEditing(!isEditing)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        <ProfilePictureUploader
          avatarUrl={user.avatar_url}
          name={user.name}
          userId={user.id}
          isEditing={isEditing}
          onUploadSuccess={(url) => {
            setProfile((prev) => ({ ...prev, avatar_url: url }));
          }}
        />

        {isEditing ? (
          <ProfileInfoEditor
            name={profile.name}
            phone={profile.phone}
            email={profile.email}
            onSave={handleSave}
          />
        ) : (
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span className="font-medium">Nombre:</span>
              <span>{profile.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Correo:</span>
              <span>{profile.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Teléfono:</span>
              <span>{profile.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Rol:</span>
              <Badge variant="default">{profile.role}</Badge>
            </div>
          </div>
        )}
      </CardContent>

      {isEditing && (
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancelar
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
