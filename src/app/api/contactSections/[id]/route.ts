import { type NextRequest, NextResponse } from "next/server";
import { getContactSectionById } from "@/data/contactSections/getContactSectionById";
import { updateContactSection } from "@/data/contactSections/updateContactSection";
import { deleteContactSection } from "@/data/contactSections/deleteContactSection";

export async function GET(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const contactSection = await getContactSectionById(Number(params.id));
  if (!contactSection) {
    return NextResponse.json(
      { error: "Sección de contacto no encontrada." },
      { status: 404 },
    );
  }
  return NextResponse.json({ contactSection });
}

export async function PUT(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const body = await req.json();
  const error = await updateContactSection(Number(params.id), body);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: "Sección de contacto actualizada correctamente.",
  });
}

export async function DELETE(_: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const error = await deleteContactSection(params.id);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: "Sección de contacto eliminada correctamente.",
  });
}
