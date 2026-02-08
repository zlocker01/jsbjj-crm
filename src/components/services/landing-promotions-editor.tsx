'use client';

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, Trash, Upload } from 'lucide-react';
import React, { useId } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { promotionItemSchema } from '@/schemas/promotionSchemas/promotionSchema';

interface PromotionItem {
  id?: string | number; // id can be string from DB or number for new items
  title: string;
  description: string;
  image: string;
}

interface PromotionsFormData {
  items: PromotionItem[];
  title?: string;
  description?: string;
}

interface LandingPromotionsEditorProps {
  promotionsContent: {
    items: PromotionItem[];
    title?: string;
    description?: string;
  };
  onChange: (promotions: {
    items: PromotionItem[];
    title?: string;
    description?: string;
  }) => void;
  handleFileUpload: (file: File, callback: (value: string) => void) => void;
}

export function LandingPromotionsEditor({
  promotionsContent,
  onChange,
  handleFileUpload,
}: LandingPromotionsEditorProps) {
  const baseId = useId();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<PromotionsFormData>({
    resolver: zodResolver(promotionItemSchema) as any,
    defaultValues: promotionsContent,
    mode: 'onBlur',
  });

  const onSubmit = async (data: PromotionsFormData) => {
    try {
      onChange(data);
      console.log('Formulario enviado:', data);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  const handlePromotionsChange = (field: string, value: string) => {
    onChange({
      ...promotionsContent,
      [field]: value,
    });
  };

  const handlePromotionItemChange = (
    index: number,
    field: string,
    value: string,
  ) => {
    const newItems = [...(promotionsContent?.items || [])];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    onChange({
      ...promotionsContent,
      items: newItems,
    });
  };

  const addPromotion = () => {
    const newItems = [
      ...(promotionsContent?.items || []),
      {
        id: Date.now(),
        title: 'Nueva Promoción',
        description: 'Descripción de la promoción',
        image: '',
      },
    ];
    onChange({
      ...promotionsContent,
      items: newItems,
    });
  };

  const removePromotion = (index: number) => {
    const newItems = [...(promotionsContent?.items || [])];
    newItems.splice(index, 1);
    onChange({
      ...promotionsContent,
      items: newItems,
    });
  };

  return (
    <AccordionItem
      value="promotions"
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
        Sección de Promociones
      </AccordionTrigger>
      <AccordionContent className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label
              htmlFor={`${baseId}-promotions-title`}
              className="text-sm font-medium"
            >
              Título
            </Label>
            <Input
              id={`${baseId}-promotions-title`}
              value={promotionsContent?.title || ''}
              onChange={(e) => handlePromotionsChange('title', e.target.value)}
              className="rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            />
          </div>
          <div className="space-y-2">
            <Label
              htmlFor={`${baseId}-promotions-description`}
              className="text-sm font-medium"
            >
              Descripción
            </Label>
            <Textarea
              id={`${baseId}-promotions-description`}
              value={promotionsContent?.description || ''}
              onChange={(e) =>
                handlePromotionsChange('description', e.target.value)
              }
              className="rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
            />
          </div>
          {(promotionsContent?.items || []).map(
            (item: PromotionItem, index: number) => (
              <div
                key={item.id || index}
                className="border border-gray-200 dark:border-gray-700 p-4 rounded-md space-y-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-purple-600 dark:text-purple-400">
                    Promoción {index + 1}
                  </h4>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removePromotion(index)}
                    className="h-8 w-8 rounded-full hover:bg-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor={`${baseId}-promotion-item-title-${index}`}
                    className="text-sm font-medium"
                  >
                    Título
                  </Label>
                  <Input
                    id={`${baseId}-promotion-item-title-${index}`}
                    value={item.title || ''}
                    onChange={(e) =>
                      handlePromotionItemChange(index, 'title', e.target.value)
                    }
                    className="rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`${baseId}-promotion-item-description-${index}`}
                    className="text-sm font-medium"
                  >
                    Descripción
                  </Label>
                  <Textarea
                    id={`${baseId}-promotion-item-description-${index}`}
                    value={item.description || ''}
                    onChange={(e) =>
                      handlePromotionItemChange(
                        index,
                        'description',
                        e.target.value,
                      )
                    }
                    className="rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`${baseId}-promotion-item-image-${index}`}
                    className="text-sm font-medium"
                  >
                    Imagen de la Promoción
                  </Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="relative w-full sm:w-auto flex-1">
                      <Input
                        id={`${baseId}-promotion-item-image-upload-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0], (value) =>
                              handlePromotionItemChange(index, 'image', value),
                            );
                          }
                        }}
                        className="cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 rounded-md"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Upload className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    {item.image && (
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-300 dark:border-gray-700 shadow-sm">
                        <img
                          src={item.image || '/placeholder.svg'}
                          alt="Vista previa"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
          <div className="mt-4 flex justify-end space-x-2">
            <Button
              type="button"
              onClick={addPromotion}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Promoción
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`${
                isSubmitting ? 'opacity-50' : ''
              } bg-green-600 hover:bg-green-700 text-white font-medium`}
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar Promociones'}
            </Button>
          </div>
        </form>
      </AccordionContent>
    </AccordionItem>
  );
}
