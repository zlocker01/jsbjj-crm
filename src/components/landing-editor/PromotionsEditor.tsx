import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";

interface PromotionItem {
  id: number;
  title: string;
  description: string;
  image: string;
  price?: string; // Assuming price might be string like "$800"
  discountPrice?: string; // Assuming discountPrice might be string
  validUntil?: string; // Assuming validUntil might be string
}

interface PromotionsEditorProps {
  content: {
    title: string;
    description: string;
    items: PromotionItem[];
  };
  onChange: (content: {
    title: string;
    description: string;
    items: PromotionItem[];
  }) => void;
}

export function PromotionsEditor({ content, onChange }: PromotionsEditorProps) {
  const handlePromotionsChange = (field: string, value: string) => {
    onChange({
      ...content,
      [field]: value,
    });
  };

  const handlePromotionItemChange = (
    index: number,
    field: keyof PromotionItem,
    value: string,
  ) => {
    const newItems = [...content.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    onChange({
      ...content,
      items: newItems,
    });
  };

  const addPromotion = () => {
    const newItems = [
      ...content.items,
      {
        id: Date.now(), // Simple unique ID
        title: "Nueva Promoción",
        description: "Descripción de la promoción",
        image: "",
        price: "",
        discountPrice: "",
        validUntil: "",
      },
    ];
    onChange({
      ...content,
      items: newItems,
    });
  };

  const removePromotion = (index: number) => {
    const newItems = [...content.items];
    newItems.splice(index, 1);
    onChange({
      ...content,
      items: newItems,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="promotions-title">Título de Promociones</Label>
        <Input
          id="promotions-title"
          value={content.title}
          onChange={(e) => handlePromotionsChange("title", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="promotions-description">
          Descripción de Promociones
        </Label>
        <Textarea
          id="promotions-description"
          value={content.description}
          onChange={(e) =>
            handlePromotionsChange("description", e.target.value)
          }
        />
      </div>

      <h4 className="text-lg font-medium mt-6">Items de Promoción</h4>
      <div className="space-y-4">
        {content.items.map((item, index) => (
          <div
            key={item.id}
            className="border p-4 rounded-md space-y-4 relative"
          >
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => removePromotion(index)}
            >
              <Trash className="h-3 w-3" />
            </Button>
            <div>
              <Label htmlFor={`promotion-item-title-${index}`}>Título</Label>
              <Input
                id={`promotion-item-title-${index}`}
                value={item.title}
                onChange={(e) =>
                  handlePromotionItemChange(index, "title", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor={`promotion-item-description-${index}`}>
                Descripción
              </Label>
              <Textarea
                id={`promotion-item-description-${index}`}
                value={item.description}
                onChange={(e) =>
                  handlePromotionItemChange(
                    index,
                    "description",
                    e.target.value,
                  )
                }
              />
            </div>
            <div>
              <Label htmlFor={`promotion-item-image-${index}`}>
                URL de Imagen
              </Label>
              <Input
                id={`promotion-item-image-${index}`}
                value={item.image}
                onChange={(e) =>
                  handlePromotionItemChange(index, "image", e.target.value)
                }
                placeholder="/placeholder.svg"
              />
            </div>
            <div>
              <Label htmlFor={`promotion-item-price-${index}`}>
                Precio Original
              </Label>
              <Input
                id={`promotion-item-price-${index}`}
                value={item.price ?? ""}
                onChange={(e) =>
                  handlePromotionItemChange(index, "price", e.target.value)
                }
                placeholder="$800"
              />
            </div>
            <div>
              <Label htmlFor={`promotion-item-discount-price-${index}`}>
                Precio con Descuento
              </Label>
              <Input
                id={`promotion-item-discount-price-${index}`}
                value={item.discountPrice ?? ""}
                onChange={(e) =>
                  handlePromotionItemChange(
                    index,
                    "discountPrice",
                    e.target.value,
                  )
                }
                placeholder="$640"
              />
            </div>
            <div>
              <Label htmlFor={`promotion-item-valid-until-${index}`}>
                Válido Hasta
              </Label>
              <Input
                id={`promotion-item-valid-until-${index}`}
                value={item.validUntil ?? ""}
                onChange={(e) =>
                  handlePromotionItemChange(index, "validUntil", e.target.value)
                }
                placeholder="31 de Mayo, 2023"
              />
            </div>
          </div>
        ))}
      </div>
      <Button onClick={addPromotion} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Añadir Promoción
      </Button>
    </div>
  );
}
