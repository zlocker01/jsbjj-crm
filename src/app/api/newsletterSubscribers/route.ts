import { NextResponse } from "next/server";
import { getNewsletterSubscribers } from "@/data/newsletterSubscribers/getNewsletterSubscribers";
import { createNewsletterSubscriber } from "@/data/newsletterSubscribers/createNewsletterSubscriber";

export async function GET() {
  const subscribers = await getNewsletterSubscribers();
  if (!subscribers) {
    return NextResponse.json(
      { error: "No se pudieron obtener los suscriptores." },
      { status: 500 },
    );
  }
  return NextResponse.json({ subscribers });
}

export async function POST(req: Request) {
  const body = await req.json();
  const success = await createNewsletterSubscriber(body);
  if (!success) {
    return NextResponse.json(
      { error: "No se pudo crear el suscriptor." },
      { status: 500 },
    );
  }
  return NextResponse.json({ message: "Suscriptor creado correctamente." });
}
