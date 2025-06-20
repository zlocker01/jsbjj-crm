import { NextResponse } from "next/server";
import { getEmployee } from "@/data/employees/getEmployee";
import { updateEmployee } from "@/data/employees/updateEmployee";
import { deleteEmployee } from "@/data/employees/deleteEmployee";

export async function GET(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const employee = await getEmployee(params.id);
  if (!employee) {
    return NextResponse.json(
      { error: "Empleado no encontrado." },
      { status: 404 },
    );
  }
  return NextResponse.json({ employee });
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const body = await req.json();
    const employeeId = params.id;
    const success = await updateEmployee(employeeId, body);

    if (!success) {
      return NextResponse.json(
        { error: "Error al actualizar el empleado" },
        { status: 400 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Empleado actualizado correctamente",
      id: employeeId,
    });
  } catch (error) {
    console.error("Error en la API:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al actualizar el empleado" },
      { status: 500 },
    );
  }
}

export async function DELETE(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const success = await deleteEmployee(params.id);
  if (!success) {
    return NextResponse.json(
      { error: "Error al eliminar el empleado" },
      { status: 500 },
    );
  }
  return NextResponse.json({
    success: true,
    message: "Empleado eliminado correctamente.",
  });
}
