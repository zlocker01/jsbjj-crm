import { NextResponse } from "next/server";
import { getFaqItemById } from "@/data/faqItems/getFaqItemById";
import { updateFaqItem } from "@/data/faqItems/updateFaqItem";
import { deleteFaqItem } from "@/data/faqItems/deleteFaqItem";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const faqItem = await getFaqItemById(Number(params.id));
  if (!faqItem) {
    return NextResponse.json(
      { error: "FAQ item no encontrado." },
      { status: 404 },
    );
  }
  return NextResponse.json({ faqItem });
}

export async function PUT(req: Request, context: { params: any }) {
  const { params } = context;
  const body = await req.json();
  const awaitedParams = await params;
  const updatedFaqItem = await updateFaqItem(Number(awaitedParams.id), body);
  if (!updatedFaqItem) {
    return NextResponse.json(
      { error: "Error al actualizar el FAQ item." },
      { status: 500 },
    );
  }
  return NextResponse.json({ faqItem: updatedFaqItem });
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } },
) {
  const error = await deleteFaqItem(Number(params.id));
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ message: "FAQ item eliminado correctamente." });
}
