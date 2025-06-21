export const dynamic = 'force-dynamic';

import { createClient } from "@/utils/supabase/server";
import { getLandingId } from "@/data/getLandingId";
import { getEmployees } from "@/data/employees/getEmployees";
import { EmployeeCard } from "@/components/employees/EmployeeCard";
import { AddEmployeeButton } from "@/components/employees/AddEmployeeButton";
import type { Employee } from "@/interfaces/employees/Employee";

export default async function EmployeesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">
          Error: Debes iniciar sesión para ver esta página.
        </p>
      </div>
    );
  }

  const landingId = await getLandingId();

  if (!landingId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">
          Error: No se pudo cargar la página de empleados. No se encontró el ID
          de la landing page.
        </p>
      </div>
    );
  }

  const employees: Employee[] | null = await getEmployees();

  if (!employees) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl text-red-600">
          Error: No se pudieron cargar los empleados. Inténtalo de nuevo más
          tarde.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold">Empleados</h2>
          <p className="text-muted-foreground">
            Administra los empleados de tu negocio
          </p>
        </div>
        <AddEmployeeButton />
      </div>

      {employees?.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            No hay empleados registrados aún
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {employees?.map((employee) => (
            <EmployeeCard key={employee.id} employee={employee} />
          ))}
        </div>
      )}
    </div>
  );
}
