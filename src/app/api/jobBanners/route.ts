import { NextResponse } from "next/server";
import { getJobBannerSections } from "@/data/jobBannerSections/getJobBannerSections";
import { createJobBannerSection } from "@/data/jobBannerSections/createJobBannerSection";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const landingPageId = searchParams.get("landingPageId");

  if (!landingPageId) {
    return NextResponse.json(
      { error: "ID de página de aterrizaje requerido." },
      { status: 400 },
    );
  }

  const { data, error } = await getJobBannerSections(landingPageId);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ jobBannerSections: data });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { data, error } = await createJobBannerSection(body);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: "Sección de banner de trabajo creada correctamente.",
    data,
  });
}
