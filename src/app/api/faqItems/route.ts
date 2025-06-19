import { NextResponse } from "next/server";
import { getFaqItems } from "@/data/faqItems/getFaqItems";
import { createFaqItem } from "@/data/faqItems/createFaqItem";
import { updateFaqItem } from "@/data/faqItems/updateFaqItem";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const landingPageId = url.searchParams.get("landingPageId");

  if (!landingPageId) {
    return NextResponse.json(
      { error: "El parámetro landingPageId es requerido." },
      { status: 400 },
    );
  }

  const faqItems = await getFaqItems(landingPageId);
  if (!faqItems) {
    return NextResponse.json(
      { error: "No se pudieron obtener los FAQ items." },
      { status: 500 },
    );
  }
  return NextResponse.json({ faqItems });
}

export async function POST(req: Request) {
  const body = await req.json();

  const result = await createFaqItem(body);

  if (typeof result === "string") {
    return NextResponse.json({ error: result }, { status: 500 });
  }

  if (!result) {
    return NextResponse.json(
      { error: "No se pudo crear el FAQ item." },
      { status: 500 },
    );
  }

  return NextResponse.json({ faqItem: result });
}
