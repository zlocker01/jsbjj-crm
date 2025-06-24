"use client";

import { useState } from "react";
import Image from "next/image";
import useSWR from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import {
  Scissors,
  Sparkles,
  Droplet,
  Brush,
  CalendarPlus,
  Clock,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import type { Service } from "@/interfaces/services/Service";

const serviceCategories = [
  { id: "all", label: "Todos" },
  { id: "Cabello", label: "Cabello", icon: <Scissors className="h-4 w-4" /> },
  { id: "Facial", label: "Facial", icon: <Sparkles className="h-4 w-4" /> },
  { id: "Corporal", label: "Corporal", icon: <Droplet className="h-4 w-4" /> },
  { id: "Uñas", label: "Uñas", icon: <Brush className="h-4 w-4" /> },
  { id: "Barbería", label: "Barbería", icon: <Scissors className="h-4 w-4" /> },
];

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch services");
    }
    return res.json();
  });

export default function Services({ landingId }: { landingId: string }) {
  const [category, setCategory] = useState("all");

  const { data, error, isLoading } = useSWR<{ services: Service[] }>(
    `/api/services?landingPageId=${landingId}`,
    fetcher,
  );

  const filteredServices =
    category === "all"
      ? data?.services || []
      : data?.services.filter((service) => service.category === category) || [];

  if (isLoading) {
    return (
      <section id="services" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4">Cargando servicios...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      // eslint-disable-next-line biomelint/nursery/useUniqueElementIds
      <section id="services" className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <p className="mt-4 text-destructive">
            Error al cargar los servicios. Intente nuevamente.
          </p>
        </div>
      </section>
    );
  }

  return (
    // eslint-disable-next-line biomelint/nursery/useUniqueElementIds
    <section id="services" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Ofrecemos una amplia gama de servicios de estética para realzar tu
            belleza natural. Todos nuestros tratamientos son realizados por
            profesionales certificados.
          </p>
        </div>

        <Tabs
          defaultValue="all"
          value={category}
          onValueChange={setCategory}
          className="w-full"
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {serviceCategories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="flex items-center gap-2"
                >
                  {cat.icon}
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={category} className="mt-0">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay servicios disponibles en esta categoría.
                </p>
              </div>
            ) : (
              <Carousel
                opts={{
                  align: "start",
                  loop: filteredServices.length > 3, // Loop only if there are enough items
                }}
                className="w-full max-w-sm md:max-w-xl lg:max-w-4xl mx-auto"
              >
                <CarouselContent>
                  {filteredServices.map((service) => (
                    <CarouselItem
                      key={service.id}
                      className="md:basis-1/2 lg:basis-1/3"
                    >
                      <div className="p-1 h-full">
                        <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col h-full">
                          <div className="relative h-48 w-full">
                            <Image
                              src={service.image || "/placeholder.svg"}
                              alt={service.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <CardHeader>
                            <CardTitle>{service.title}</CardTitle>
                            <CardDescription>
                              {service.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2 flex-grow">
                            <p className="text-xl font-bold text-primary">
                              ${service.price.toFixed(2)}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              <span>{service.duration_minutes} minutos</span>
                            </div>
                            <Badge variant="outline" className="capitalize">
                              {service.category.toLowerCase()}
                            </Badge>
                          </CardContent>
                          <CardFooter>
                            <Button asChild className="w-full">
                              <Link
                                href="#booking"
                                className="flex items-center gap-2"
                              >
                                <CalendarPlus className="h-4 w-4" />
                                Agendar
                              </Link>
                            </Button>
                          </CardFooter>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="bg-gold text-black hover:bg-amber-400 border-gold absolute left-2 top-1/2 -translate-y-1/2 !-left-auto !-right-auto !-translate-x-0 z-10 flex" />
                <CarouselNext className="bg-gold text-black hover:bg-amber-400 border-gold absolute right-2 top-1/2 -translate-y-1/2 !-left-auto !-right-auto !translate-x-0 z-10 flex" />
              </Carousel>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
