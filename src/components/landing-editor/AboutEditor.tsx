import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface AboutEditorProps {
  content: {
    title: string;
    description: string;
    image: string;
  };
  onChange: (field: string, value: string) => void;
}

export function AboutEditor({ content, onChange }: AboutEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="about-title">Título</Label>
        <Input
          id="about-title"
          value={content.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="about-description">Descripción</Label>
        <Textarea
          id="about-description"
          value={content.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="about-image">URL de Imagen</Label>
        <Input
          id="about-image"
          value={content.image}
          onChange={(e) => onChange("image", e.target.value)}
          placeholder="/placeholder.svg"
        />
      </div>
    </div>
  );
}
