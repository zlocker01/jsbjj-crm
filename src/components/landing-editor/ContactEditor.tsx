import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactEditorProps {
  content: {
    title: string;
    address: string;
    phone: string;
    email: string;
  };
  onChange: (field: string, value: string) => void;
}

export function ContactEditor({ content, onChange }: ContactEditorProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="contact-title">Título</Label>
        <Input
          id="contact-title"
          value={content.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="contact-address">Dirección</Label>
        <Input
          id="contact-address"
          value={content.address}
          onChange={(e) => onChange("address", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="contact-phone">Teléfono</Label>
        <Input
          id="contact-phone"
          value={content.phone}
          onChange={(e) => onChange("phone", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="contact-email">Email</Label>
        <Input
          id="contact-email"
          type="email"
          value={content.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>
    </div>
  );
}
