import { NextResponse } from 'next/server';
import { createPackage } from '@/data/packages/createPackage';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();

    if (!body.landing_page_id) {
      return NextResponse.json(
        { error: 'El campo landing_page_id es requerido.' },
        { status: 400 },
      );
    }

    // Sanitizar datos
    const packageData = {
      name: body.name,
      price: body.price,
      subtitle: body.subtitle,
      image: body.image,
      benefits: body.benefits,
      restrictions: body.restrictions,
      landing_page_id: body.landing_page_id,
      user_id: user.id,
    };

    const id = await createPackage(packageData);
    if (!id) {
      return NextResponse.json(
        { error: 'No se pudo crear el paquete.' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: 'Paquete creado correctamente.',
      id,
    });
  } catch (error) {
    console.error('Error in POST /api/packages:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor al procesar la solicitud.' },
      { status: 500 },
    );
  }
}
