import { NextResponse } from 'next/server';
import { getPackage } from '@/data/packages/getPackage';
import { updatePackage } from '@/data/packages/updatePackage';
import { deletePackage } from '@/data/packages/deletePackage';

export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const pkg = await getPackage(Number(params.id));
  if (!pkg) {
    return NextResponse.json(
      { error: 'Paquete no encontrado.' },
      { status: 404 },
    );
  }
  return NextResponse.json({ package: pkg });
}

export async function PUT(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const body = await req.json();
    const packageId = Number(params.id);
    const result = await updatePackage(packageId, body);

    // Si result es un string que comienza con 'Error' (o similar), es un mensaje de error
    if (
      typeof result === 'string' &&
      (result.startsWith('Error') ||
        result.startsWith('No') ||
        result.startsWith('ID'))
    ) {
      return NextResponse.json({ error: result }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Paquete actualizado correctamente',
      id: result,
    });
  } catch (error) {
    console.error('Error en la API:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al actualizar el paquete' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _: Request,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  const error = await deletePackage(Number(params.id));
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ message: 'Paquete eliminado correctamente.' });
}
