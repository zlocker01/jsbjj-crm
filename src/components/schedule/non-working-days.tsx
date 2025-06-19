"use client";

import { useState, useEffect } from "react"; // Añadido useEffect
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format, isValid, parse } from "date-fns";
import { es } from "date-fns/locale";
import { Plus, Trash } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import type { NonWorkingDay } from "@/interfaces/schedule/NonWorkingDays";
import { NonWorkingDaysSkeleton } from "@/components/skeletons/schedule/non-working-days-skeleton";

export function NonWorkingDays(/* { days: initialDays, onChange } */) {
  const [days, setDays] = useState<NonWorkingDay[]>([]);
  const [newDate, setNewDate] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchNonWorkingDays = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/non-working-days");
        if (!response.ok) {
          throw new Error("Error al obtener los días no laborables");
        }
        const data = await response.json();
        setDays(data.nonWorkingDays || []);
      } catch (error) {
        console.error("Error fetching non-working days:", error);
        toast({
          title: "Error de Carga",
          description:
            "No se pudieron cargar los días no laborables desde el servidor.",
          variant: "destructive",
        });
        setDays([]); // Asegurar que days sea un array vacío en caso de error
      } finally {
        setIsLoading(false);
      }
    };

    fetchNonWorkingDays();
  }, [toast]); // toast se añade como dependencia si se usa dentro del efecto, aunque aquí no es estrictamente necesario

  const handleAddDay = async () => {
    if (!newDate || !newDescription) {
      toast({
        title: "Campos incompletos",
        description:
          "Por favor, completa todos los campos para añadir un día no laborable.",
        variant: "destructive",
      });
      return;
    }

    const parsedDate = parse(newDate, "yyyy-MM-dd", new Date());
    if (!isValid(parsedDate)) {
      toast({
        title: "Fecha inválida",
        description: "Por favor, selecciona una fecha válida.",
        variant: "destructive",
      });
      return;
    }

    const formattedDate = format(parsedDate, "yyyy-MM-dd");

    try {
      const response = await fetch("/api/non-working-days", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          date: formattedDate,
          description: newDescription,
        }),
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error al añadir el día no laborable." }));
        throw new Error(
          errorData.message || "Error al añadir el día no laborable.",
        );
      }

      const result = await response.json();
      const newDayFromServer = result.nonWorkingDay;

      setDays([...days, newDayFromServer]);
      // if (onChange) onChange([...days, newDayFromServer]); // Si necesitas notificar al padre

      toast({
        title: "Día no laborable añadido",
        description: `Has añadido ${formatDisplayDate(newDayFromServer.date)} como día no laborable.`,
        variant: "success",
      });

      setNewDate("");
      setNewDescription("");
    } catch (error: any) {
      console.error("Error adding non-working day:", error);
      toast({
        title: "Error al Añadir",
        description:
          error.message ||
          "No se pudo guardar el día no laborable en el servidor.",
        variant: "destructive",
      });
    }
  };

  const handleRemoveDay = async (idToRemove: string) => {
    const dayToRemove = days.find((day) => String(day.id) === idToRemove);
    if (!dayToRemove) {
      return;
    }

    try {
      const response = await fetch(`/api/non-working-days/${idToRemove}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ message: "Error al eliminar el día no laborable." }));
        throw new Error(
          errorData.message || "Error al eliminar el día no laborable.",
        );
      }

      const newDaysList = days.filter((day) => String(day.id) !== idToRemove);
      setDays(newDaysList);
      // if (onChange) onChange(newDaysList); // Si necesitas notificar al padre

      toast({
        title: "Día no laborable eliminado",
        description: `Has eliminado ${formatDisplayDate(dayToRemove.date)} de los días no laborables.`,
        variant: "success",
      });
    } catch (error: any) {
      console.error("Error removing non-working day:", error);
      toast({
        title: "Error al Eliminar",
        description:
          error.message ||
          "No se pudo eliminar el día no laborable del servidor.",
        variant: "destructive",
      });
    }
  };

  const formatDisplayDate = (dateString: string) => {
    const date = parse(dateString, "yyyy-MM-dd", new Date());
    return format(date, "d 'de' MMMM, yyyy", { locale: es });
  };

  if (isLoading) {
    return <NonWorkingDaysSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="new-date">Fecha</Label>
          <Input
            id="new-date"
            type="date"
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="new-description">Descripción</Label>
          <div className="flex gap-2">
            <Input
              id="new-description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Ej: Día festivo, Vacaciones, etc."
            />
            <Button onClick={handleAddDay} size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {days.length > 0 ? (
        <div className="overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {/* Asegúrate de que no haya espacios antes del primer TableHead */}
                <TableHead>Fecha</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="w-[100px]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {days.map((day) => (
                <TableRow key={day.id}>
                  {/* Asegúrate de que no haya espacios antes del primer TableCell */}
                  <TableCell>{formatDisplayDate(day.date)}</TableCell>
                  <TableCell>{day.description}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDay(String(day.id))}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground">
          No hay días no laborables configurados
        </div>
      )}
    </div>
  );
}
