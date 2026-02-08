'use client';

import React from 'react';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  featureSchema,
  type FeatureFormData,
} from '@/schemas/featureSchemas/featureSchema';

interface FeatureItem {
  title: string;
  description: string;
  price: number;
  duration: number;
  image: string;
}

interface LandingFeaturesEditorProps {
  featuresContent: FeatureItem[];
  onChange: (features: FeatureItem[]) => void;
  handleFileUpload: (file: File, callback: (value: string) => void) => void;
}

export function LandingFeaturesEditor({
  featuresContent,
  onChange,
  handleFileUpload,
}: LandingFeaturesEditorProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FeatureItem>({
    resolver: zodResolver(featureSchema),
    defaultValues: featuresContent?.[0] || {
      title: '',
      description: '',
      price: 0,
      duration: 0,
      image: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: FeatureItem) => {
    try {
      // Update just the first item for now
      const newFeatures = [...(featuresContent || [])];
      if (newFeatures.length > 0) {
        newFeatures[0] = data;
      } else {
        newFeatures.push(data);
      }
      onChange(newFeatures);
      console.log('Formulario enviado:', data);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
    }
  };

  const handleFeatureChange = (index: number, field: string, value: string) => {
    const newFeatures = [...(featuresContent || [])];
    const updatedValue =
      field === 'price' ? Number.parseFloat(value) || 0 : value;
    const finalValue =
      field === 'duration' ? Number.parseInt(value) || 0 : updatedValue;

    newFeatures[index] = {
      ...newFeatures[index],
      [field]: finalValue,
    };
    onChange(newFeatures);
  };

  const addFeature = () => {
    const newFeatures = [
      ...(featuresContent || []),
      {
        title: 'Nueva Clase',
        description: 'Descripción de la nueva clase',
        price: 0.0,
        duration: 60,
        image: '', // Añadido campo de imagen
      },
    ];
    onChange(newFeatures);
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(featuresContent || [])];
    newFeatures.splice(index, 1);
    onChange(newFeatures);
  };

  return (
    <AccordionItem
      value="features"
      className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-sm"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium">
        Sección de Clases
      </AccordionTrigger>
      <AccordionContent className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/30">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {(featuresContent || []).map(
            (feature: FeatureItem, index: number) => (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 p-4 rounded-md space-y-3 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-purple-600 dark:text-purple-400">
                    Servicio {index + 1}
                  </h4>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => removeFeature(index)}
                    className="h-8 w-8 rounded-full hover:bg-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`feature-title-${index}`}
                    className="text-sm font-medium"
                  >
                    Título
                  </Label>
                  <Input
                    id={`feature-title-${index}`}
                    value={feature.title || ''}
                    onChange={(e) =>
                      handleFeatureChange(index, 'title', e.target.value)
                    }
                    className="rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`feature-description-${index}`}
                    className="text-sm font-medium"
                  >
                    Descripción
                  </Label>
                  <Textarea
                    id={`feature-description-${index}`}
                    value={feature.description || ''}
                    onChange={(e) =>
                      handleFeatureChange(index, 'description', e.target.value)
                    }
                    className="rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`feature-price-${index}`}
                      className="text-sm font-medium"
                    >
                      Precio
                    </Label>
                    <Input
                      id={`feature-price-${index}`}
                      type="number"
                      step="0.01"
                      value={feature.price || 0}
                      onChange={(e) =>
                        handleFeatureChange(index, 'price', e.target.value)
                      }
                      className="rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor={`feature-duration-${index}`}
                      className="text-sm font-medium"
                    >
                      Duración (minutos)
                    </Label>
                    <Input
                      id={`feature-duration-${index}`}
                      type="number"
                      step="1"
                      value={feature.duration || 0}
                      onChange={(e) =>
                        handleFeatureChange(index, 'duration', e.target.value)
                      }
                      className="rounded-md border-gray-300 focus:border-purple-500 focus:ring focus:ring-purple-200 focus:ring-opacity-50 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor={`feature-image-${index}`}
                    className="text-sm font-medium"
                  >
                    Imagen del Servicio
                  </Label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <div className="relative w-full sm:w-auto flex-1">
                      <Input
                        id={`feature-image-upload-${index}`}
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleFileUpload(e.target.files[0], (value) =>
                              handleFeatureChange(index, 'image', value),
                            );
                          }
                        }}
                        className="cursor-pointer border border-input bg-background hover:bg-accent hover:text-accent-foreground dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700 rounded-md"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <Upload className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                    {feature.image && (
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border border-gray-300 dark:border-gray-700 shadow-sm">
                        <img
                          src={feature.image || '/placeholder.svg'}
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
              onClick={addFeature}
              className="bg-purple-600 hover:bg-purple-700 text-white font-medium"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Servicio
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={`${isSubmitting ? 'opacity-50' : ''} bg-green-600 hover:bg-green-700 text-white font-medium`}
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar Servicios'}
            </Button>
          </div>
        </form>
      </AccordionContent>
    </AccordionItem>
  );
}
