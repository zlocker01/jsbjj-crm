import { NextResponse } from "next/server";
import { getNewsletterSubscriberById } from "@/data/newsletterSubscribers/getNewsletterSubscriberById";
import { updateNewsletterSubscriber } from "@/data/newsletterSubscribers/updateNewsletterSubscriber";
import { deleteNewsletterSubscriber } from "@/data/newsletterSubscribers/deleteNewsletterSubscriber";

export async function GET(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const subscriber = await getNewsletterSubscriberById(Number(params.id));
  if (!subscriber) {
    return NextResponse.json(
      { error: "Suscriptor no encontrado." },
      { status: 404 },
    );
  }
  return NextResponse.json({ subscriber });
}

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const body = await req.json();
  const error = await updateNewsletterSubscriber(Number(params.id), body);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({
    message: "Suscriptor actualizado correctamente.",
  });
}

export async function DELETE(_: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const error = await deleteNewsletterSubscriber(Number(params.id));
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ message: "Suscriptor eliminado correctamente." });
}
