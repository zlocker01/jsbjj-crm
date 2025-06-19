import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getNonWorkingDays } from "@/data/schedule/getNonWorkingDays";
import { createNonWorkingDay } from "@/data/schedule/createNonWorkingDay";
import type { CreateNonWorkingDayData } from "@/data/schedule/nonWorkingDayTypes";

export async function GET(request: NextRequest) {
  try {
    const days = await getNonWorkingDays();
    return NextResponse.json({ nonWorkingDays: days });
  } catch (error) {
    console.error("Error al obtener días no laborables:", error);
    return NextResponse.json(
      { message: "Error al obtener días no laborables desde la base de datos" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateNonWorkingDayData;
    const { date, description } = body;

    if (!date || !description) {
      return NextResponse.json(
        { message: "La fecha y la descripción son obligatorias" },
        { status: 400 },
      );
    }

    // Es buena práctica validar aquí también.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return NextResponse.json(
        { message: "El formato de fecha debe ser YYYY-MM-DD" },
        { status: 400 },
      );
    }

    const newNonWorkingDay = await createNonWorkingDay({ date, description });

    if (!newNonWorkingDay) {
      return NextResponse.json(
        { message: "Error al crear el día no laborable en la base de datos" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message: "Día no laborable creado exitosamente",
        nonWorkingDay: newNonWorkingDay,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error al crear día no laborable:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { message: "Cuerpo de la solicitud mal formado (JSON inválido)" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Error interno al procesar la creación del día no laborable" },
      { status: 500 },
    );
  }
}
