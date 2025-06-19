import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  price?: number;
  duration?: number;
  image?: string;
}

interface FeaturesEditorProps {
  content: Feature[];
  onChange: (features: Feature[]) => void;
}

export function FeaturesEditor({ content, onChange }: FeaturesEditorProps) {
  const handleFeatureChange = (
    index: number,
    field: keyof Feature,
    value: string | number,
  ) => {
    const newFeatures = [...content];
    newFeatures[index] = {
      ...newFeatures[index],
      [field]: value,
    };
    onChange(newFeatures);
  };

  const addFeature = () => {
    const newFeatures = [
      ...content,
      {
        title: "Nuevo Servicio",
        description: "Descripción del nuevo servicio",
        price: 0.0,
        duration: 60,
        image: "",
      },
    ];
    onChange(newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...content];
    newFeatures.splice(index, 1);
    onChange(newFeatures);
  };

  return (
    <div className="space-y-6">
      {content.map((feature, index) => (
        <div key={index} className="border p-4 rounded-md space-y-4 relative">
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6"
            onClick={() => removeFeature(index)}
          >
            <Trash className="h-3 w-3" />
          </Button>
          <div>
            <Label htmlFor={`feature-title-${index}`}>Título</Label>
            <Input
              id={`feature-title-${index}`}
              value={feature.title}
              onChange={(e) =>
                handleFeatureChange(index, "title", e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor={`feature-description-${index}`}>Descripción</Label>
            <Textarea
              id={`feature-description-${index}`}
              value={feature.description}
              onChange={(e) =>
                handleFeatureChange(index, "description", e.target.value)
              }
            />
          </div>
          <div>
            <Label htmlFor={`feature-price-${index}`}>Precio</Label>
            <Input
              id={`feature-price-${index}`}
              type="number"
              step="0.01"
              value={feature.price ?? 0}
              onChange={(e) =>
                handleFeatureChange(
                  index,
                  "price",
                  Number.parseFloat(e.target.value) || 0,
                )
              }
            />
          </div>
          <div>
            <Label htmlFor={`feature-duration-${index}`}>
              Duración (minutos)
            </Label>
            <Input
              id={`feature-duration-${index}`}
              type="number"
              step="1"
              value={feature.duration ?? 0}
              onChange={(e) =>
                handleFeatureChange(
                  index,
                  "duration",
                  Number.parseInt(e.target.value) || 0,
                )
              }
            />
          </div>
          <div>
            <Label htmlFor={`feature-image-${index}`}>URL de Imagen</Label>
            <Input
              id={`feature-image-${index}`}
              value={feature.image ?? ""}
              onChange={(e) =>
                handleFeatureChange(index, "image", e.target.value)
              }
              placeholder="/placeholder.svg"
            />
          </div>
        </div>
      ))}
      <Button onClick={addFeature} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Añadir Servicio
      </Button>
    </div>
  );
}
