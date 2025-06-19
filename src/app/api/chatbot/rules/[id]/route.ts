import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { deleteChatbotRule } from "@/data/chatbot/deleteChatbotRule";
import { updateChatbotRule } from "@/data/chatbot/updateChatbotRule";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const error = await deleteChatbotRule(Number(params.id));
  if (error) {
    return NextResponse.json(
      { error: "No se pudo eliminar la regla." },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const data = await request.json();
  const error = await updateChatbotRule({ ...data, id: Number(params.id) });
  if (error) {
    return NextResponse.json(
      { error: "No se pudo actualizar la regla." },
      { status: 500 },
    );
  }
  return NextResponse.json({ success: true });
}
