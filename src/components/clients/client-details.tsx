"use client";

import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Mail,
  Phone,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Pencil,
  Trash,
} from "lucide-react";
import { ClientForm } from "@/components/clients/client-form";
import { formatDate } from "@/lib/date-utils";
import type { ClientFormValues } from "@/schemas/clientSchemas/clientSchema";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import type { Client } from "@/interfaces/client/Client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

// Hook para obtener las citas reales del cliente
import { useEffect } from "react";

function useClientAppointments(clientId: string) {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clientId) return;
    setLoading(true);
    setError(null);
    fetch(`/api/clients/${clientId}/appointments`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Error al obtener citas");
        const data = await res.json();
        setAppointments(data.appointments || []);
      })
      .catch((err) => {
        setError(err.message || "Error desconocido");
        setAppointments([]);
      })
      .finally(() => setLoading(false));
  }, [clientId]);

  return { appointments, loading, error };
}


interface ClientDetailsProps {
  client: Client;
  onDeleteSuccess?: (clientId: Client["id"]) => void;
}

export function ClientDetails({ client, onDeleteSuccess }: ClientDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("info");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
        <User className="h-12 w-12 mb-4 opacity-20" />
        <p>Selecciona un cliente para ver sus detalles</p>
      </div>
    );
  }

  const { appointments: clientAppointments, loading: loadingAppointments, error: errorAppointments } = useClientAppointments(client.id);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = async (data: ClientFormValues) => {
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Error al actualizar el cliente");
      }
      setIsEditing(false);
      toast({
        title: "Cliente actualizado",
        description:
          "La información del cliente ha sido actualizada correctamente.",
        variant: "success",
      });
      // Consider re-fetching or updating client data in parent state if needed
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo actualizar el cliente.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClient = async () => {
    // Added
    try {
      const response = await fetch(`/api/clients/${client.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error al eliminar el cliente" }));
        throw new Error(errorData.message || "Error al eliminar el cliente");
      }
      toast({
        title: "Cliente eliminado",
        description: `El cliente ${client.name} ha sido eliminado correctamente.`,
        variant: "success",
      });
      setIsDeleteDialogOpen(false);
      if (onDeleteSuccess) {
        onDeleteSuccess(client.id);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el cliente.",
        variant: "destructive",
      });
      setIsDeleteDialogOpen(false);
    }
  };

  const handleViewAppointments = () => {
    setActiveTab("appointments");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Confirmada":
        return (
          <Badge
            variant="confirmada"
            className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
          >
            <CheckCircle className="mr-1 h-3 w-3" /> Completada
          </Badge>
        );
      case "En Proceso":
        return (
          <Badge
            variant="proceso"
            className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
          >
            <Clock className="mr-1 h-3 w-3" /> En Proceso
          </Badge>
        );
      case "Cancelada":
        return (
          <Badge
            variant="cancelada"
            className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
          >
            <XCircle className="mr-1 h-3 w-3" /> Cancelada
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            <AlertCircle className="mr-1 h-3 w-3" /> Desconocido
          </Badge>
        );
    }
  };

  if (isEditing) {
    return (
      <ClientForm
        defaultValues={{
          // Asegúrate que estos campos coincidan con tu ClientFormValues y clientSchema
          name: client.name,
          email: client.email ?? "",
          phone: client.phone ?? "",
          notes: client.notes || "",
          birthday: client.birthday || "",
          // Si ClientForm espera is_active y client_source_id, debes pasarlos aquí también
          // is_active: client.is_active,
          // client_source_id: client.client_source_id,
        }}
        onSubmit={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src="/app/avatar.png"
            alt={client.name}
            className="object-cover"
          />
          <AvatarFallback>{client.name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-medium">{client.name}</h3>
          <p className="text-sm text-muted-foreground">
            Cliente desde{" "}
            {client.registration_date &&
            !isNaN(new Date(client.registration_date).getTime())
              ? formatDate(client.registration_date)
              : "Fecha desconocida"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="appointments">Citas</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-4 pt-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{client.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{client.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>
                Última visita:{" "}
                {client.last_visit_date &&
                !isNaN(new Date(client.last_visit_date).getTime())
                  ? formatDate(client.last_visit_date)
                  : "Sin registro"}
              </span>
            </div>
          </div>

          <div className="pt-2">
            <h4 className="text-sm font-medium mb-2">Notas</h4>
            <p className="text-sm text-muted-foreground">
              {client.notes || "No hay notas disponibles para este cliente."}
            </p>
          </div>
        </TabsContent>
        <TabsContent value="history" className="pt-4">

          {/* ... Contenido del historial ... */}
        </TabsContent>
        <TabsContent value="appointments" className="pt-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Citas del cliente</h4>
            {clientAppointments.length > 0 ? (
              <div className="space-y-3">
                {clientAppointments.map((appointment) => (
                  <Card key={appointment.id} className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{appointment.service}</h5>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.date).toLocaleString("es-ES", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <div>{getStatusBadge(appointment.status)}</div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Este cliente no tiene citas registradas.
              </p>
            )}
            <Button size="sm" className="w-full mt-2">
              <Plus className="mr-2 h-4 w-4" />
              Agendar nueva cita
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex flex-col gap-2 pt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleEdit} className="flex-1">
            <Pencil className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="flex-1">
                <Trash className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará
                  permanentemente al cliente &quot;{client.name}&quot; de tus
                  registros.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteClient}>
                  Sí, eliminar cliente
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </div>
  );
}
