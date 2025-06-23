import { NextResponse } from "next/server";
import { getNewsletterSubscribers } from "@/data/newsletterSubscribers/getNewsletterSubscribers";
import { createNewsletterSubscriber } from "@/data/newsletterSubscribers/createNewsletterSubscriber";
import * as z from "zod";
import { newsLetterFormSchema } from "@/schemas/newsLetterSchemas/newsLetterFormSchema";

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
  try {
    const body = await req.json();
    
    // Validamos que el email sea válido
    const validationResult = newsLetterFormSchema.safeParse({ email: body.email });
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Email inválido" },
        { status: 400 }
      );
    }
    
    const values = { email: body.email };
    const source = body.source || "web";
    
    const subscriber = await createNewsletterSubscriber(values, source);
    
    if (!subscriber) {
      return NextResponse.json(
        { error: "No se pudo crear el suscriptor." },
        { status: 500 },
      );
    }
    
    return NextResponse.json({ 
      message: "Suscriptor creado correctamente.",
      subscriber 
    });
  } catch (error) {
    console.error("Error al crear suscriptor:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
