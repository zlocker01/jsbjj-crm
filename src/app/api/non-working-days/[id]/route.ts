import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getNonWorkingDays } from "@/data/schedule/getNonWorkingDays";
import { deleteNonWorkingDay } from "@/data/schedule/deleteNonWorkingDay";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { message: "El ID proporcionado no es un número válido" },
        { status: 400 },
      );
    }

    const allDays = await getNonWorkingDays();

    const day = allDays.find((d) => Number(d.id) === numericId);
    if (!day) {
      return NextResponse.json(
        { message: "Día no laborable no encontrado" },
        { status: 404 },
      );
    }
    return NextResponse.json({ nonWorkingDay: day });
  } catch (error) {
    console.error(`Error al obtener día no laborable ${params.id}:`, error);
    return NextResponse.json(
      { message: "Error al obtener día no laborable" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  // Para implementar PUT, necesitarías una función `updateNonWorkingDay` en tu capa de datos (src/data/schedule/).
  // Esta función tomaría el `id` y los datos a actualizar.
  console.warn(
    `PUT /api/non-working-days/${params.id} - Funcionalidad no implementada sin una función updateNonWorkingDay en la capa de datos.`,
  );
  return NextResponse.json(
    { message: "Funcionalidad de actualización (PUT) no implementada." },
    { status: 501 },
  ); // 501 Not Implemented

  /* Ejemplo de cómo podría ser si tuvieras updateNonWorkingDay:
  try {
    const { id } = params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json({ message: 'El ID proporcionado no es un número válido' }, { status: 400 });
    }

    const body = await request.json();
    // Asume que body es compatible con lo que espera updateNonWorkingDay, ej: Partial<CreateNonWorkingDayData>
    // const { date, description } = body; 

    // if (!body.date && !body.description) {
    //   return NextResponse.json({ message: 'Se requiere al menos un campo (fecha o descripción) para actualizar' }, { status: 400 });
    // }
    
    // if (body.date && !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    //     return NextResponse.json({ message: 'El formato de fecha debe ser YYYY-MM-DD' }, { status: 400 });
    // }

    // const updatedDay = await updateNonWorkingDay(numericId, body);

    // if (!updatedDay) {
    //   return NextResponse.json({ message: 'Día no laborable no encontrado para actualizar o error al actualizar' }, { status: 404 });
    // }

    // return NextResponse.json({ message: 'Día no laborable actualizado exitosamente', nonWorkingDay: updatedDay });
  } catch (error) {
    console.error(`Error al actualizar día no laborable ${params.id}:`, error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Cuerpo de la solicitud mal formado (JSON inválido)' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Error al actualizar día no laborable' }, { status: 500 });
  }
  */
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const { id } = params;
    const numericId = Number(id);

    if (isNaN(numericId)) {
      return NextResponse.json(
        { message: "El ID proporcionado no es un número válido" },
        { status: 400 },
      );
    }

    const success = await deleteNonWorkingDay(numericId);

    if (!success) {
      const allDays = await getNonWorkingDays(); // Re-check si existe para dar 404
      const dayExists = allDays.some((d) => Number(d.id) === numericId);
      if (!dayExists) {
        return NextResponse.json(
          { message: "Día no laborable no encontrado para eliminar" },
          { status: 404 },
        );
      }
      return NextResponse.json(
        { message: "Error al eliminar el día no laborable" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Día no laborable eliminado exitosamente",
    });
  } catch (error) {
    console.error(`Error al eliminar día no laborable ${params.id}:`, error);
    return NextResponse.json(
      {
        message:
          "Error interno al procesar la eliminación del día no laborable",
      },
      { status: 500 },
    );
  }
}
