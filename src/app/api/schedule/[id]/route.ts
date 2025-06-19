import { NextResponse } from "next/server";
import type { UpdateScheduleData } from "@/data/schedule/updateSchedule";
import { updateSchedule } from "@/data/schedule/updateSchedule";
import type { Schedule } from "@/interfaces/schedule/Schedule";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const scheduleId = BigInt(params.id);
    const body = (await req.json()) as UpdateScheduleData;

    const updatedSchedule: Schedule | undefined = await updateSchedule(
      scheduleId,
      body,
    );

    if (!updatedSchedule) {
      return NextResponse.json(
        { error: "No se pudo actualizar el horario o no se encontró." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Horario actualizado correctamente.",
      schedule: updatedSchedule,
    });
  } catch (error) {
    console.error("Error en PUT /api/schedule/[id]:", error);
    let errorMessage = "Error interno del servidor.";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    if (error instanceof SyntaxError) {
      errorMessage = "Cuerpo de la solicitud mal formado.";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    if (
      error instanceof TypeError &&
      error.message.includes("Cannot convert")
    ) {
      errorMessage = "El ID proporcionado no es un número válido.";
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
