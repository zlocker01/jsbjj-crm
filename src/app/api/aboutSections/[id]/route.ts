import { NextResponse } from "next/server";
import { getAboutSection } from "@/data/aboutSections/getAboutSection";
import { updateAboutSection } from "@/data/aboutSections/updateAboutSection";
import { deleteAboutSection } from "@/data/aboutSections/deleteAboutSection";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { data: aboutSection, error } = await getAboutSection(params.id);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  if (!aboutSection) {
    return NextResponse.json(
      { error: "Sección about no encontrada." },
      { status: 404 },
    );
  }
  return NextResponse.json({ aboutSection });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const body = await req.json();
  const error = await updateAboutSection({ ...body, id: params.id });
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: "Sección about actualizada correctamente.",
  });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const error = await deleteAboutSection(params.id);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: "Sección about eliminada correctamente.",
  });
}
