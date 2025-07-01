import { type NextRequest, NextResponse } from "next/server";
import { getAppointmentById } from "@/data/appointments/getAppointmentById";
import { deleteAppointment } from "@/data/appointments/deleteAppointment";
import { updateAppointment } from "@/data/appointments/updateAppointment";

export async function GET(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const appointment = await getAppointmentById(params.id);
  if (!appointment) {
    return NextResponse.json({ error: "Cita no encontrada." }, { status: 404 });
  }
  return NextResponse.json({ appointment });
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const body = await req.json();
  const updatedAppointment = await updateAppointment(params.id, body);
  if (!updatedAppointment) {
    return NextResponse.json({ error: "Cita no encontrada o no se pudo actualizar." }, { status: 404 });
  }
  return NextResponse.json({
    message: "Cita actualizada correctamente.",
    appointment: updatedAppointment,
  });
}

export async function DELETE(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const error = await deleteAppointment(params.id);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: "Cita eliminada correctamente.",
  });
}
