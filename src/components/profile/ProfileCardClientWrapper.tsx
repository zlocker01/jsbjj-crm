"use client";

import { useState } from "react";
import { Edit, User } from "lucide-react";
import { ProfilePersonalInfo } from "./profilePersonalInfo";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface ProfileCardClientWrapperProps {
  user: {
    id: string | number;
    name: string;
    email: string;
    phone: string;
    avatar_url: string | null;
    role: string | null;
  };
}

export function ProfileCardClientWrapper({
  user,
}: ProfileCardClientWrapperProps) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <Card className="max-w-md w-full">
      {isEditing ? (
        <ProfilePersonalInfo
          user={{
            id: String(user.id),
            name: user.name,
            email: user.email,
            phone: user.phone,
            avatar_url: user.avatar_url,
            role: user.role
          }}
          userId={String(user.id)}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <div className="px-6 pb-6 space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <span className="font-medium">Nombre:</span>
            <span>{user.name || "Anonymous"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Correo:</span>
            <span>{user.email || "No email provided"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Teléfono:</span>
            <span>{user.phone || "Sin número"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Rol:</span>
            <Badge variant="outline">{user.role || "Sin rol"}</Badge>
          </div>
        </div>
      )}
    </Card>
  );
}
