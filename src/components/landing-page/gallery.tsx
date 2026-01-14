'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import type { GalleryItem } from '@/interfaces/galleryItems/GalleryItem';

const categories = [
  { id: 'all', label: 'Todos' },
  { id: 'orthodontics', label: 'Ortodoncia' },
  { id: 'endodontics', label: 'Endodoncia' },
  { id: 'periodontics', label: 'Periodoncia' },
  { id: 'pediatric', label: 'Odontopediatría' },
  { id: 'implants', label: 'Implantes' },
  { id: 'esthetic', label: 'Estética Dental' },
  { id: 'whitening', label: 'Blanqueamiento' },
  { id: 'surgery', label: 'Cirugía' },
  { id: 'prosthesis', label: 'Prótesis' },
  { id: 'general', label: 'General' },
];

export default function Gallery({ data }: { data: GalleryItem[] }) {
  const [category, setCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredItems =
    category === 'all'
      ? data
      : data.filter((item) => item.category === category);

  // Extraer categorías únicas de los datos
  const uniqueCategories = [
    { id: 'all', label: 'Todos' },
    ...Array.from(new Set(data.map((item) => item.category)))
      .filter((cat) => cat) // Filtrar valores nulos o undefined
      .map((cat) => ({
        id: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1), // Capitalizar primera letra
      })),
  ];

  return (
    <section id="gallery" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nuestra Galería
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explora algunos de nuestros mejores trabajos odontológicos. Cada
            imagen refleja nuestro compromiso con la salud bucal, la estética y
            la satisfacción de nuestros pacientes.
          </p>
        </div>

        <Tabs
          defaultValue="all"
          value={category}
          onValueChange={setCategory}
          className="w-full"
        >
          <div className="flex justify-center my-8">
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full max-w-3xl">
              {uniqueCategories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="flex flex-col items-center justify-center py-2 px-1 text-xs sm:text-sm bg-gold hover:bg-goldHover rounded-2xl"
                >
                  <span>{cat.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={category} className="mt-12 md:mt-6">
            {filteredItems.length > 0 ? (
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {filteredItems.map((item) => (
                    <CarouselItem
                      key={item.id}
                      className="md:basis-1/2 lg:basis-1/4"
                    >
                      <div className="p-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-all">
                              <div className="relative h-64 w-full">
                                <img
                                  src={item.image || '/placeholder.svg'}
                                  alt={item.title || 'Imagen de galería'}
                                  className="absolute inset-0 h-full w-full object-cover"
                                />
                                {item.is_before_after && (
                                  <Badge className="absolute top-2 right-2 bg-primary">
                                    Antes/Después
                                  </Badge>
                                )}
                              </div>
                              <CardContent className="p-4">
                                <h3 className="font-medium">{item.title}</h3>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {item.description}
                                  </p>
                                )}
                              </CardContent>
                            </Card>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader className="text-center">
                              <DialogTitle>
                                {item.title || 'Imagen de galería'}
                              </DialogTitle>
                              {item.description && (
                                <DialogDescription>
                                  {item.description}
                                </DialogDescription>
                              )}
                            </DialogHeader>
                            <div className="relative h-[60vh] w-full">
                              <img
                                src={item.image || '/placeholder.svg'}
                                alt={item.title || 'Imagen ampliada'}
                                className="absolute inset-0 h-full w-full object-contain"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-gold text-black hover:bg-amber-400 border-gold absolute left-2 top-1/2 -translate-y-1/2 !-left-auto !-right-auto !-translate-x-0 z-10" />
                <CarouselNext className="bg-gold text-black hover:bg-amber-400 border-gold absolute right-2 top-1/2 -translate-y-1/2 !-left-auto !-right-auto !translate-x-0 z-10" />
              </Carousel>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay elementos para mostrar en esta categoría.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
