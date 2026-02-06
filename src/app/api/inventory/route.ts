import { NextRequest, NextResponse } from "next/server";
import { getInventoryItems } from "@/data/inventory/getInventoryItems";
import {
  createInventoryItem,
  type CreateInventoryItemInput,
} from "@/data/inventory/createInventoryItem";

export const dynamic = "force-dynamic";

export async function GET() {
  const items = await getInventoryItems();

  if (items === null) {
    return NextResponse.json(
      { success: false, error: "Error al obtener inventario" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true, data: items });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<CreateInventoryItemInput>;

    if (!body.name || !body.category || !body.item_type) {
      return NextResponse.json(
        {
          success: false,
          error: "Faltan campos obligatorios (name, category, item_type)",
        },
        { status: 400 },
      );
    }

    const quantity = body.quantity ?? 0;

    const payload: CreateInventoryItemInput = {
      name: body.name,
      category: body.category,
      description: body.description,
      item_type: body.item_type,
      quantity,
      unit: body.unit,
      minimum_stock: body.minimum_stock ?? 0,
      expiration_date: body.expiration_date,
      batch_number: body.batch_number,
      supplier: body.supplier,
      unit_cost: body.unit_cost,
      estimated_price: body.estimated_price,
      location: body.location,
      status: body.status ?? "available",
    };

    const created = await createInventoryItem(payload);

    if (!created) {
      return NextResponse.json(
        { success: false, error: "No se pudo crear el producto" },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, data: created });
  } catch (error) {
    console.error("Error en POST /api/inventory:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al crear producto" },
      { status: 500 },
    );
  }
}

