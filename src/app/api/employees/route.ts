import { NextResponse } from "next/server";
import { getEmployees } from "@/data/employees/getEmployees";
import { createEmployee } from "@/data/employees/createEmployee";

export async function GET(req: Request) {
  const employees = await getEmployees();
  if (!employees) {
    return NextResponse.json(
      { error: "No se pudieron obtener los empleados." },
      { status: 500 },
    );
  }
  return NextResponse.json({ employees });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const employeeId = await createEmployee(body);
    if (!employeeId) {
      return NextResponse.json(
        { error: "No se pudo crear el empleado." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Empleado creado correctamente.",
      id: employeeId,
    });
  } catch (error) {
    console.error("Error in POST /api/employees:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la solicitud." },
      { status: 500 },
    );
  }
}
