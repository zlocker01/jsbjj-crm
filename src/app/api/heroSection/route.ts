import { NextResponse } from "next/server";
import { getHeroSection } from "@/data/heroSection/getHeroSection";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const landingPageId = searchParams.get("landingPageId");

  if (!landingPageId) {
    return NextResponse.json(
      { error: "Se requiere el parámetro landingPageId" },
      { status: 400 },
    );
  }

  const { data, error } = await getHeroSection(landingPageId);

  if (error) {
    return NextResponse.json(
      { error: "No se pudo obtener la sección hero" },
      { status: 500 },
    );
  }

  return NextResponse.json({ data });
}
