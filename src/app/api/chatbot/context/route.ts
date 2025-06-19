import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getChatbotContext } from "@/data/chatbot/getChatbotContext";
import { updateChatbotContext } from "@/data/chatbot/updateChatbotContext";

export async function GET() {
  const context = await getChatbotContext();
  return NextResponse.json(context);
}

export async function PUT(request: NextRequest) {
  const data = await request.json();
  const error = await updateChatbotContext(data);
  if (error) {
    return NextResponse.json(
      { error: "No se pudo actualizar el contexto." },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true });
}
