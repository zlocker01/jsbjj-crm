import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash } from "lucide-react";

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqEditorProps {
  content: {
    title: string;
    description: string;
    items: FaqItem[];
  };
  onChange: (content: {
    title: string;
    description: string;
    items: FaqItem[];
  }) => void;
}

export function FaqEditor({ content, onChange }: FaqEditorProps) {
  const handleFaqChange = (field: string, value: string) => {
    onChange({
      ...content,
      [field]: value,
    });
  };

  const handleFaqItemChange = (
    index: number,
    field: keyof FaqItem,
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

  const addFaq = () => {
    const newItems = [
      ...content.items,
      {
        id: Date.now(), // Simple unique ID
        question: "Nueva Pregunta",
        answer: "Respuesta a la nueva pregunta",
      },
    ];
    onChange({
      ...content,
      items: newItems,
    });
  };

  const removeFaq = (index: number) => {
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
        <Label htmlFor="faq-title">Título de Preguntas Frecuentes</Label>
        <Input
          id="faq-title"
          value={content.title}
          onChange={(e) => handleFaqChange("title", e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="faq-description">
          Descripción de Preguntas Frecuentes
        </Label>
        <Textarea
          id="faq-description"
          value={content.description}
          onChange={(e) => handleFaqChange("description", e.target.value)}
        />
      </div>

      <h4 className="text-lg font-medium mt-6">Preguntas y Respuestas</h4>
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
              onClick={() => removeFaq(index)}
            >
              <Trash className="h-3 w-3" />
            </Button>
            <div>
              <Label htmlFor={`faq-item-question-${index}`}>Pregunta</Label>
              <Input
                id={`faq-item-question-${index}`}
                value={item.question}
                onChange={(e) =>
                  handleFaqItemChange(index, "question", e.target.value)
                }
              />
            </div>
            <div>
              <Label htmlFor={`faq-item-answer-${index}`}>Respuesta</Label>
              <Textarea
                id={`faq-item-answer-${index}`}
                value={item.answer}
                onChange={(e) =>
                  handleFaqItemChange(index, "answer", e.target.value)
                }
              />
            </div>
          </div>
        ))}
      </div>
      <Button onClick={addFaq} className="w-full">
        <Plus className="mr-2 h-4 w-4" /> Añadir Pregunta Frecuente
      </Button>
    </div>
  );
}
