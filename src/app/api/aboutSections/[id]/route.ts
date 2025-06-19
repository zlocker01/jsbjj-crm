import { NextRequest, NextResponse } from "next/server";
import { getAboutSection } from "@/data/aboutSections/getAboutSection";
import { updateAboutSection } from "@/data/aboutSections/updateAboutSection";
import { deleteAboutSection } from "@/data/aboutSections/deleteAboutSection";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
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
  req: NextRequest,
  { params }: RouteParams
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
  _request: NextRequest,
  { params }: RouteParams
) {
  const error = await deleteAboutSection(params.id);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: "Sección about eliminada correctamente.",
  });
}
