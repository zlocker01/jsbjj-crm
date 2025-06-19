import { NextResponse } from "next/server";
import { getAboutSections } from "@/data/aboutSections/getAboutSections";
import { createAboutSection } from "@/data/aboutSections/createAboutSection";

export async function GET() {
  const aboutSections = await getAboutSections();
  if (!aboutSections) {
    return NextResponse.json(
      { error: "No se pudieron obtener las secciones about." },
      { status: 500 },
    );
  }
  return NextResponse.json({ aboutSections });
}

export async function POST(req: Request) {
  const body = await req.json();
  const error = await createAboutSection(body);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ message: "Sección about creada correctamente." });
}
