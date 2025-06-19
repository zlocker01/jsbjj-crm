import { type NextRequest, NextResponse } from "next/server";
import { getAppointmentById } from "@/data/appointments/getAppointmentById";
import { deleteAppointment } from "@/data/appointments/deleteAppointment";
import { updateAppointment } from "@/data/appointments/updateAppointment";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const appointment = await getAppointmentById(params.id);
  if (!appointment) {
    return NextResponse.json({ error: "Cita no encontrada." }, { status: 404 });
  }
  return NextResponse.json({ appointment });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const error = await updateAppointment(params.id, body);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: "Cita actualizada correctamente.",
  });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const error = await deleteAppointment(params.id);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: "Cita eliminada correctamente.",
  });
}
