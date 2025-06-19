"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Key, LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function ProfileSecurity() {
  const { toast } = useToast();
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");
  const [deleteComment, setDeleteComment] = useState("");
  const [deactivateInstead, setDeactivateInstead] = useState(false);

  const router = useRouter();

  const handlePasswordChange = async () => {
    // Aquí iría la lógica real para cambiar la contraseña
    console.log("Changing password");
  };

  const handleDeleteAccount = () => {
    // Aquí iría la lógica real para eliminar o desactivar la cuenta
    console.log("Deleting/Deactivating account:", {
      deleteReason,
      deleteComment,
      deactivateInstead,
    });
    if (deactivateInstead) {
      toast({
        title: "Cuenta desactivada",
        description:
          "Tu cuenta ha sido desactivada temporalmente. Puedes reactivarla iniciando sesión en cualquier momento.",
      });
    } else {
      toast({
        title: "Cuenta eliminada",
        description: "Tu cuenta ha sido eliminada permanentemente.",
        variant: "destructive",
      });
    }
    setIsDeleteDialogOpen(false);
  };

  const handleLogout = async () => {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error(error);
    } else {
      router.push("/");
    }
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente. Redirigiendo...",
      variant: "success",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="flex items-center">
            <Key className="mr-2 h-5 w-5 text-primary" />
            Seguridad
          </CardTitle>
          <CardDescription>Gestiona la seguridad de tu cuenta</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <Dialog
            open={isChangingPassword}
            onOpenChange={setIsChangingPassword}
          >
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                Cambiar contraseña
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cambiar contraseña</DialogTitle>
                <DialogDescription>
                  Introduce tu contraseña actual y la nueva contraseña.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <Input id="current-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input id="new-password" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">
                    Confirmar nueva contraseña
                  </Label>
                  <Input id="confirm-password" type="password" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsChangingPassword(false)}
                >
                  Cancelar
                </Button>
                <Button onClick={handlePasswordChange}>
                  Cambiar contraseña
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="destructive"
            className="w-full"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Eliminar cuenta
          </Button>

          <Button
            variant="outline"
            className="w-full mt-2"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>

          {/* Diálogo de cuestionario para eliminación de cuenta */}
          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Eliminar cuenta</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará
                  permanentemente tu cuenta y todos tus datos.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="delete-reason">
                    Motivo de la eliminación de la cuenta
                  </Label>
                  <Select onValueChange={setDeleteReason}>
                    <SelectTrigger id="delete-reason">
                      <SelectValue placeholder="Selecciona un motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no-understand">
                        No entiendo cómo usar la app
                      </SelectItem>
                      <SelectItem value="no-interest">
                        No tengo más interés en el servicio
                      </SelectItem>
                      <SelectItem value="technical-issues">
                        Problemas técnicos o errores
                      </SelectItem>
                      <SelectItem value="expensive">
                        Es muy caro para mí
                      </SelectItem>
                      <SelectItem value="other">Otra razón</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {deleteReason === "other" && (
                  <div className="space-y-2">
                    <Label htmlFor="delete-reason-other">
                      Especifica el motivo
                    </Label>
                    <Input
                      id="delete-reason-other"
                      placeholder="Escribe el motivo aquí"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="delete-comment">
                    ¿Te gustaría dejar un comentario? (opcional)
                  </Label>
                  <Textarea
                    id="delete-comment"
                    placeholder="Tu opinión nos ayuda a mejorar"
                    value={deleteComment}
                    onChange={(e) => setDeleteComment(e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="deactivate"
                    checked={deactivateInstead}
                    onCheckedChange={setDeactivateInstead}
                  />
                  <Label htmlFor="deactivate">
                    Desactivar cuenta en vez de eliminar
                  </Label>
                </div>

                <div className="text-sm text-muted-foreground">
                  {deactivateInstead ? (
                    <p>
                      Al desactivar tu cuenta, tus datos se conservarán y podrás
                      reactivarla en cualquier momento iniciando sesión
                      nuevamente.
                    </p>
                  ) : (
                    <p>
                      Al eliminar tu cuenta, todos tus datos serán borrados
                      permanentemente y no podrás recuperarlos.
                    </p>
                  )}
                </div>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="sm:flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  className="sm:flex-1"
                >
                  {deactivateInstead ? "Desactivar cuenta" : "Eliminar cuenta"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
