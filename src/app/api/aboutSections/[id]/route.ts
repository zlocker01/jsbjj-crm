import { NextResponse } from "next/server";
import { getAboutSection } from "@/data/aboutSections/getAboutSection";
import { updateAboutSection } from "@/data/aboutSections/updateAboutSection";
import { deleteAboutSection } from "@/data/aboutSections/deleteAboutSection";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { data: aboutSection, error } = await getAboutSection(params.id);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    if (!aboutSection) {
      return NextResponse.json(
        { error: "Sección about no encontrada." },
        { status: 404 }
      );
    }
    return NextResponse.json({ aboutSection });
  } catch (error) {
    console.error("Error in GET aboutSection:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const error = await updateAboutSection({ ...body, id: params.id });
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json({
      message: "Sección about actualizada correctamente.",
    });
  } catch (error) {
    console.error("Error in PUT aboutSection:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const error = await deleteAboutSection(params.id);
    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }
    return NextResponse.json({
      message: "Sección about eliminada correctamente.",
    });
  } catch (error) {
    console.error("Error in DELETE aboutSection:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
