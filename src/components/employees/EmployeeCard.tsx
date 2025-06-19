"use client";

import { useState } from "react";
import type { Employee } from "@/interfaces/employees/Employee";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Card } from "../ui/card";
import { DeleteEmployeeButton } from "./DeleteEmployeeButton";
import { EditEmployeeButton } from "./EditEmployeeButton";
import { useToast } from "@/components/ui/use-toast";

interface EmployeeCardProps {
  employee: Employee;
  onEmployeeUpdated?: () => void;
}

export function EmployeeCard({
  employee,
  onEmployeeUpdated,
}: EmployeeCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  // Asegura que skills sea siempre un array de strings
  const skills = (() => {
    const skillsData = employee.skills;

    if (!skillsData) {
      return [];
    }

    if (Array.isArray(skillsData)) {
      // Si ya es un array, limpia y devuelve
      return skillsData.map((skill) => String(skill).trim()).filter(Boolean);
    }

    if (typeof skillsData === "string") {
      try {
        // Intenta parsear como JSON
        const parsed = JSON.parse(skillsData);
        if (Array.isArray(parsed)) {
          return parsed.map((skill) => String(skill).trim()).filter(Boolean);
        }
      } catch (e) {
        // Si falla el parseo JSON, trata como string separado por comas
        // Aquí es donde añadimos la aserción de tipo `as string`
        return (skillsData as string)
          .replace(/[\[\]'"{}]/g, "")
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
      }
    }

    // Retorno por defecto si no es ni array ni string manejable
    return [];
  })();

  const handleEmployeeUpdated = () => {
    onEmployeeUpdated?.();
    window.dispatchEvent(new Event("employeeUpdated"));
  };

  const handleEmployeeDeleted = (deletedEmployeeId: string) => {
    window.dispatchEvent(new Event("employeeUpdated"));
    toast({
      title: "Empleado eliminado",
      description: "El empleado ha sido eliminado correctamente",
      variant: "success",
    });
    router.refresh();
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg w-full max-w-sm flex flex-col h-full">
      <div className="relative pt-8 px-8 flex justify-center">
        <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-white shadow-lg group">
          {employee.image ? (
            <img
              src={employee.image}
              alt={employee.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <span className="text-muted-foreground text-sm">Sin imagen</span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pt-16 flex-1 flex flex-col items-center text-center">
        <div className="mb-4">
          <div className="flex justify-between items-start gap-2">
            <h2 className="text-xl font-bold text-foreground">
              {employee.name}
            </h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
              {employee.position}
            </span>
          </div>
        </div>

        <div className="space-y-4 flex-1">
          {employee.experience && (
            <div className="space-y-1">
              <h4 className="text-sm font-semibold text-foreground">
                Experiencia
              </h4>
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {employee.experience}
              </p>
            </div>
          )}

          {skills.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-foreground">
                Habilidades
              </h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill: string, index: number) => (
                  <Badge
                    key={index}
                    variant="gold"
                    className="px-2.5 py-1 text-xs font-medium"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t flex items-center justify-between gap-3">
          <EditEmployeeButton
            employee={employee}
            onEmployeeUpdated={handleEmployeeUpdated}
          />
          <DeleteEmployeeButton
            employeeId={employee.id!}
            onEmployeeDeleted={handleEmployeeDeleted}
          />
        </div>
      </div>
    </Card>
  );
}
