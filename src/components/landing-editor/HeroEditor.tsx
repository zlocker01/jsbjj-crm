import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface HeroEditorProps {
  content: {
    title: string;
    subtitle: string;
    text: string;
    image: string;
  };
  onChange: (field: string, value: string) => void;
}

export function HeroEditor({ content, onChange }: HeroEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="hero-title">Título Principal</Label>
        <Input
          id="hero-title"
          value={content.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="hero-subtitle">Subtítulo</Label>
        <Input
          id="hero-subtitle"
          value={content.subtitle}
          onChange={(e) => onChange("subtitle", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="hero-text">Texto Descriptivo</Label>
        <Textarea
          id="hero-text"
          value={content.text}
          onChange={(e) => onChange("text", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="hero-image">URL de Imagen de Fondo</Label>
        <Input
          id="hero-image"
          value={content.image}
          onChange={(e) => onChange("image", e.target.value)}
          placeholder="/placeholder.svg"
        />
      </div>
    </div>
  );
}
