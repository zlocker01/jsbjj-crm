"use client";

import { useState } from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { GalleryItem } from "@/interfaces/galleryItems/GalleryItem";

const categories = [
  { id: "all", label: "Todos" },
  { id: "hair", label: "Cabello" },
  { id: "face", label: "Facial" },
  { id: "body", label: "Corporal" },
  { id: "nails", label: "Uñas" },
  { id: "barber", label: "Barbería" },
];

export default function Gallery({ data }: { data: GalleryItem[] }) {
  const [category, setCategory] = useState("all");
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const filteredItems =
    category === "all"
      ? data
      : data.filter((item) => item.category === category);

  // Extraer categorías únicas de los datos
  const uniqueCategories = [
    { id: "all", label: "Todos" },
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
            Explora algunos de nuestros mejores trabajos en estética y barbería en Tlaxcala centro. Cada imagen refleja nuestro compromiso con la calidad, el detalle y la satisfacción de quienes confían en nuestros servicios de belleza, uñas y barbería.
          </p>
        </div>

        <Tabs
          defaultValue="all"
          value={category}
          onValueChange={setCategory}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList>
              {uniqueCategories.map((cat) => (
                <TabsTrigger key={cat.id} value={cat.id}>
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={category} className="mt-0">
            {filteredItems.length > 0 ? (
              <Carousel
                opts={{
                  align: "start",
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
                                <Image
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.title || "Imagen de galería"}
                                  fill
                                  className="object-cover"
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
                            <div className="relative h-[60vh] w-full">
                              <Image
                                src={item.image || "/placeholder.svg"}
                                alt={item.title || "Imagen ampliada"}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <div className="text-center">
                              <h3 className="text-xl font-medium">{item.title}</h3>
                              {item.description && (
                                <p className="text-muted-foreground">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-gold text-black hover:bg-amber-400 border-gold" />
                <CarouselNext className="bg-gold text-black hover:bg-amber-400 border-gold" />
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
