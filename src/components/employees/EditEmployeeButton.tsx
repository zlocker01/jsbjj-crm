"use client";

import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { EditEmployeeModal } from "./EditEmployeeModal";
import type { Employee } from "@/interfaces/employees/Employee";

interface EditEmployeeButtonProps {
  employee: Employee;
  onEmployeeUpdated?: () => void;
}

export function EditEmployeeButton({
  employee,
  onEmployeeUpdated,
}: EditEmployeeButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-10 w-10 p-0"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <EditEmployeeModal
        employee={employee}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onEmployeeUpdated={onEmployeeUpdated}
      />
    </>
  );
}
