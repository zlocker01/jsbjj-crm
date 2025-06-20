import { NextResponse } from "next/server";
import { getHeroSection } from "@/data/heroSection/getHeroSection";
import { updateHeroSection } from "@/data/heroSection/updateHeroSection";
import { deleteHeroSection } from "@/data/heroSection/deleteHeroSection";
import type { HeroSection } from "@/interfaces/heroSection/Interface";

export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const { data, error } = await getHeroSection(id);

  if (error) {
    return NextResponse.json(
      { error: "No se pudo obtener la sección hero" },
      { status: 500 },
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Sección hero no encontrada" },
      { status: 404 },
    );
  }

  return NextResponse.json({ data: data[0] });
}

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const body: HeroSection = await request.json();
  const error = await updateHeroSection(body);

  if (error) {
    return NextResponse.json(
      { error: "No se pudo actualizar la sección hero" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message: "Sección hero actualizada correctamente",
  });
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  const error = await deleteHeroSection(id);

  if (error) {
    return NextResponse.json(
      { error: "No se pudo eliminar la sección hero" },
      { status: 500 },
    );
  }

  return NextResponse.json({ message: "Sección hero eliminada correctamente" });
}
