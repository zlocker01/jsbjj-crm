import { NextRequest, NextResponse } from "next/server";
import { getClientById } from "@/data/clients/getClientById";
import { updateClient } from "@/data/clients/updateClient";
import { deleteClient } from "@/data/clients/deleteClient";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const client = await getClientById(params.id);
  if (!client) {
    return NextResponse.json(
      { error: "Cliente no encontrado." },
      { status: 404 },
    );
  }
  return NextResponse.json({ client });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const body = await req.json();
  const error = await updateClient(params.id, body);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ message: "Cliente actualizado correctamente." });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } },
) {
  const error = await deleteClient(params.id);
  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
  return NextResponse.json({ message: "Cliente eliminado correctamente." });
}
