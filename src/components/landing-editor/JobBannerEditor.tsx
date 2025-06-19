import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface JobBannerEditorProps {
  content: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  onChange: (field: string, value: string) => void;
}

export function JobBannerEditor({ content, onChange }: JobBannerEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="job-banner-title">Título</Label>
        <Input
          id="job-banner-title"
          value={content.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="job-banner-subtitle">Subtítulo</Label>
        <Textarea
          id="job-banner-subtitle"
          value={content.subtitle}
          onChange={(e) => onChange("subtitle", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="job-banner-button-text">Texto del Botón</Label>
        <Input
          id="job-banner-button-text"
          value={content.buttonText}
          onChange={(e) => onChange("buttonText", e.target.value)}
        />
      </div>
    </div>
  );
}
