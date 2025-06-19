import { NextResponse } from "next/server";
import { getServices } from "@/data/services/getServices";
import { createService } from "@/data/services/createService";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const landingPageId = url.searchParams.get("landingPageId");

  if (!landingPageId) {
    return NextResponse.json(
      { error: "El parámetro landingPageId es requerido." },
      { status: 400 },
    );
  }

  const services = await getServices(landingPageId);
  if (!services) {
    return NextResponse.json(
      { error: "No se pudieron obtener los servicios." },
      { status: 500 },
    );
  }
  return NextResponse.json({ services });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.landing_page_id) {
      return NextResponse.json(
        { error: "El campo landing_page_id es requerido." },
        { status: 400 },
      );
    }

    const success = await createService(body);
    if (!success) {
      return NextResponse.json(
        { error: "No se pudo crear el servicio." },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Servicio creado correctamente.",
    });
  } catch (error) {
    console.error("Error in POST /api/services:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar la solicitud." },
      { status: 500 },
    );
  }
}
