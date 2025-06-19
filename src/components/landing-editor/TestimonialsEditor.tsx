import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";

interface TestimonialItem {
  id: number;
  quote: string;
  author: string;
  image?: string; // Assuming image might be editable
}

interface TestimonialsEditorProps {
  content: {
    title: string;
    description: string;
    items: TestimonialItem[];
  };
  onChange: (content: {
    title: string;
    description: string;
    items: TestimonialItem[];
  }) => void;
}

export function TestimonialsEditor({
  content,
  onChange,
}: TestimonialsEditorProps) {
  const handleTestimonialsChange = (field: string, value: string) => {
    onChange({
      ...content,
      [field]: value,
    });
  };

  const handleTestimonialItemChange = (
    index: number,
    field: keyof TestimonialItem,
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

  const addTestimonial = () => {
    const newItems = [
      ...content.items,
      {
        id: Date.now(), // Simple unique ID
        quote: "Nuevo testimonio...",
        author: "Nombre del Cliente",
        image: "",
      },
    ];
    onChange({
      ...content,
      items: newItems,
    });
  };

  const removeTestimonial = (index: number) => {
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
        <Label htmlFor="testimonials-title">Título de Testimonios</Label>
        <Input
          id="testimonials-title"
          value={content.title}
          onChange={(e) => handleTestimonialsChange("title", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="testimonials-description">
          Descripción de Testimonios
        </Label>
        <Textarea
          id="testimonials-description"
          value={content.description}
          onChange={(e) =>
            handleTestimonialsChange("description", e.target.value)
          }
        />
      </div>

      <h4 className="text-lg font-medium mt-6">Items de Testimonio</h4>
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
              onClick={() => removeTestimonial(index)}
            >
              <Trash className="h-3 w-3" />
            </Button>
            <div>
              <Label htmlFor={`testimonial-item-quote-${index}`}>
                Cita/Testimonio
              </Label>
              <Textarea
                id={`testimonial-item-quote-${index}`}
                value={item.quote}
                onChange={(e) =>
                  handleTestimonialItemChange(index, "quote", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor={`testimonial-item-author-${index}`}>Autor</Label>
              <Input
                id={`testimonial-item-author-${index}`}
                value={item.author}
                onChange={(e) =>
                  handleTestimonialItemChange(index, "author", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor={`testimonial-item-image-${index}`}>
                URL de Imagen (Autor)
              </Label>
              <Input
                id={`testimonial-item-image-${index}`}
                value={item.image ?? ""}
                onChange={(e) =>
                  handleTestimonialItemChange(index, "image", e.target.value)
                }
                placeholder="/placeholder.svg"
              />
            </div>
          </div>
        ))}
      </div>
      <Button onClick={addTestimonial} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Añadir Testimonio
      </Button>
    </div>
  );
}
