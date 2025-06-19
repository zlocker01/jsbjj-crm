import { NextResponse } from "next/server";
import { getJobBannerSectionById } from "@/data/jobBannerSections/getJobBannerSectionById";
import { updateJobBannerSection } from "@/data/jobBannerSections/updateJobBannerSection";
import { deleteJobBannerSection } from "@/data/jobBannerSections/deleteJobBannerSection";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { data, error } = await getJobBannerSectionById(Number(params.id));
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json(
      { error: "Sección de banner de trabajo no encontrada." },
      { status: 404 },
    );
  }
  return NextResponse.json({ jobBannerSection: data });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const error = await updateJobBannerSection({
    ...body,
    id: Number(params.id),
  });
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: "Sección de banner de trabajo actualizada correctamente.",
  });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const error = await deleteJobBannerSection(Number(params.id));
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: "Sección de banner de trabajo eliminada correctamente.",
  });
}
