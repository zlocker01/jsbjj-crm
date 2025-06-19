import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category?: string; // Assuming category might be editable
}

interface GalleryEditorProps {
  content: {
    title: string;
    description: string;
    items: GalleryItem[];
  };
  onChange: (content: {
    title: string;
    description: string;
    items: GalleryItem[];
  }) => void;
}

export function GalleryEditor({ content, onChange }: GalleryEditorProps) {
  const handleGalleryChange = (field: string, value: string) => {
    onChange({
      ...content,
      [field]: value,
    });
  };

  const handleGalleryItemChange = (
    index: number,
    field: keyof GalleryItem,
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

  const addGalleryItem = () => {
    const newItems = [
      ...content.items,
      {
        id: Date.now(), // Simple unique ID
        title: "Nueva Imagen",
        description: "Descripción de la imagen",
        image: "",
        category: "",
      },
    ];
    onChange({
      ...content,
      items: newItems,
    });
  };

  const removeGalleryItem = (index: number) => {
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
        <Label htmlFor="gallery-title">Título de la Galería</Label>
        <Input
          id="gallery-title"
          value={content.title}
          onChange={(e) => handleGalleryChange("title", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="gallery-description">Descripción de la Galería</Label>
        <Textarea
          id="gallery-description"
          value={content.description}
          onChange={(e) => handleGalleryChange("description", e.target.value)}
        />
      </div>

      <h4 className="text-lg font-medium mt-6">Imágenes de la Galería</h4>
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
              onClick={() => removeGalleryItem(index)}
            >
              <Trash className="h-3 w-3" />
            </Button>
            <div>
              <Label htmlFor={`gallery-item-title-${index}`}>Título</Label>
              <Input
                id={`gallery-item-title-${index}`}
                value={item.title}
                onChange={(e) =>
                  handleGalleryItemChange(index, "title", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor={`gallery-item-description-${index}`}>
                Descripción
              </Label>
              <Textarea
                id={`gallery-item-description-${index}`}
                value={item.description}
                onChange={(e) =>
                  handleGalleryItemChange(index, "description", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor={`gallery-item-image-${index}`}>
                URL de Imagen
              </Label>
              <Input
                id={`gallery-item-image-${index}`}
                value={item.image}
                onChange={(e) =>
                  handleGalleryItemChange(index, "image", e.target.value)
                }
                placeholder="/placeholder.svg"
              />
            </div>
            <div>
              <Label htmlFor={`gallery-item-category-${index}`}>
                Categoría (Opcional)
              </Label>
              <Input
                id={`gallery-item-category-${index}`}
                value={item.category ?? ""}
                onChange={(e) =>
                  handleGalleryItemChange(index, "category", e.target.value)
                }
                placeholder="Ej: hair, face, nails"
              />
            </div>
          </div>
        ))}
      </div>
      <Button onClick={addGalleryItem} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Añadir Imagen
      </Button>
    </div>
  );
}
