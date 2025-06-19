import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getGalleryItemById } from "@/data/galleryItems/getGalleryItemById";
import { updateGalleryItem } from "@/data/galleryItems/updateGalleryItem";
import { deleteGalleryItem } from "@/data/galleryItems/deleteGalleryItem";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.pathname.split("/").pop();
  const galleryItem = await getGalleryItemById(Number(id));
  if (!galleryItem) {
    return NextResponse.json(
      { error: "Item de galería no encontrado." },
      { status: 404 },
    );
  }
  return NextResponse.json({ galleryItem });
}

export async function PUT(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const body = await request.json();
    const error = await updateGalleryItem(Number(id), body);
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }
    return NextResponse.json({
      message: "Item de galería actualizado correctamente.",
    });
  } catch (error) {
    console.error("Error en PUT /api/galleryItems/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.pathname.split("/").pop();
    const error = await deleteGalleryItem(Number(id));
    if (error) {
      console.error("Error al eliminar el ítem:", error);
      return NextResponse.json({ error }, { status: 400 });
    }
    return NextResponse.json({
      message: "Item de galería eliminado correctamente.",
    });
  } catch (error) {
    console.error("Error en DELETE /api/galleryItems/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor al eliminar el ítem" },
      { status: 500 },
    );
  }
}
