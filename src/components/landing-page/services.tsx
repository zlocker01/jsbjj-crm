'use client';

import { useState } from 'react';
import useSWR from 'swr';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import {
  Scissors,
  Sparkles,
  Droplet,
  Brush,
  CalendarPlus,
  Clock,
  Loader2,
  AlertCircle,
  EyeClosed,
  Layers,
  Users,
  ShieldCheck,
  Activity,
  Baby,
  HeartPulse,
  Siren,
  Stethoscope,
  Smile,
} from 'lucide-react';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import type { Service } from '@/interfaces/services/Service';

const ToothIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M7 2c-2.76 0-5 2.24-5 5 0 2.2 1.5 4.08 3.5 4.74.5 1.76.5 4.26.5 6.26 0 2.2 1.8 4 4 4s2-.5 2-2c0-1 1-1 1 0s-.2 2 2 2 2.2-1.8 2.2-4c0-2 0-4.5.5-6.26C19.5 11.08 21 9.2 21 7c0-2.76-2.24-5-5-5-1.5 0-2.83.67-3.79 1.73-.24.26-.6.26-.84 0C10.43 2.67 9.1 2 7.6 2h-.6z" />
  </svg>
);

const serviceCategories = [
  { id: 'all', label: 'Todos' },
  { 
    id: 'Prevención y cuidado', 
    label: 'Prevención', 
    icon: <ShieldCheck className="h-4 w-4" /> 
  },
  { 
    id: 'Estética dental', 
    label: 'Estética', 
    icon: <Sparkles className="h-4 w-4" /> 
  },
  { 
    id: 'Ortodoncia', 
    label: 'Ortodoncia', 
    icon: <Smile className="h-4 w-4" /> 
  },
  { 
    id: 'Rehabilitación y restauración dental', 
    label: 'Rehabilitación', 
    icon: <Stethoscope className="h-4 w-4" /> 
  },
  { 
    id: 'Endodoncia', 
    label: 'Endodoncia', 
    icon: <Activity className="h-4 w-4" /> 
  },
  { 
    id: 'Periodoncia (encías)', 
    label: 'Periodoncia', 
    icon: <HeartPulse className="h-4 w-4" /> 
  },
  { 
    id: 'Odontopediatría', 
    label: 'Odontopediatría', 
    icon: <Baby className="h-4 w-4" /> 
  },
  { 
    id: 'Cirugía dental', 
    label: 'Cirugía', 
    icon: <Scissors className="h-4 w-4" /> 
  },
  { 
    id: 'Urgencias dentales', 
    label: 'Urgencias', 
    icon: <Siren className="h-4 w-4" /> 
  },
];

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch services');
    }
    return res.json();
  });

export default function Services({ landingId }: { landingId: string }) {
  const [category, setCategory] = useState('all');

  const { data, error, isLoading } = useSWR<{ services: Service[] }>(
    `/api/services?landingPageId=${landingId}`,
    fetcher
  );

  const filteredServices =
    category === 'all'
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
          <div className="flex justify-center mb-28 md:mb-14">
            <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-full max-w-3xl">
              {serviceCategories.map((cat) => (
                <TabsTrigger
                  key={cat.id}
                  value={cat.id}
                  className="flex flex-col items-center justify-center py-2 px-1 text-xs sm:text-sm"
                >
                  {cat.icon}
                  <span className="mt-1">{cat.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value={category} className="mt-6">
            {filteredServices.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay servicios disponibles en esta categoría.
                </p>
              </div>
            ) : (
              <Carousel
                opts={{
                  align: 'start',
                  loop: filteredServices.length > 3, // Loop only if there are enough items
                }}
                className="w-full max-w-sm md:max-w-xl lg:max-w-6xl mx-auto"
              >
                <CarouselContent>
                  {filteredServices.map((service) => {
                    return (
                      <CarouselItem
                        key={service.id}
                        className="md:basis-1/2 lg:basis-1/3 mt-10"
                      >
                        <div className="p-1 h-full">
                          <div className="p-1 min-h-96">
                            <Card className="overflow-hidden transition-all hover:shadow-lg flex flex-col relative h-[500px] gap-3">
                              {/* Imagen de fondo */}
                              <img
                                src={service.image || '/placeholder.svg'}
                                alt={service.title}
                                className="object-cover absolute inset-0 z-0 w-full h-full"
                                loading="lazy"
                              />
                              {/* Overlay de gradiente para legibilidad */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/35 to-transparent z-10" />
                              
                              {/* Category Badge */}
                              <div className="absolute top-4 right-4 z-20">
                                <Badge 
                                  variant="secondary" 
                                  className="text-sm px-3 py-1 bg-primary/90 text-primary-foreground hover:bg-primary/100 border-none capitalize"
                                >
                                  {service.category.toLowerCase()}
                                </Badge>
                              </div>

                              {/* Contenido encima de la imagen */}
                              <div className="relative z-20 flex flex-col h-full justify-end p-6">
                                <div className="space-y-2">
                                  <CardHeader className="p-0">
                                    <CardTitle className="text-white drop-shadow-lg font-bold text-lg md:text-xl lg:text-2xl">
                                      {service.title}
                                    </CardTitle>
                                    <CardDescription className="text-white/90 drop-shadow-md mb-2">
                                      {service.description}
                                    </CardDescription>
                                  </CardHeader>
                                  <CardContent className="space-y-2 p-0">
                                    <p className="text-xl font-bold text-primary drop-shadow-md">
                                      ${service.price.toFixed(2)}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm text-white/80 drop-shadow-sm">
                                      <Clock className="h-4 w-4" />
                                      <span>
                                        {service.duration_minutes} minutos
                                      </span>
                                    </div>
                                    <Badge
                                      variant="gold"
                                      className="capitalize"
                                    >
                                      {service.category.toLowerCase()}
                                    </Badge>
                                  </CardContent>
                                  <CardFooter className="p-0 pt-4">
                                    <Button asChild className="w-full">
                                      <a
                                        href="https://wa.me/522461003603?text=Hola,%20me%20gustaría%20agendar%20una%20cita"
                                        className="flex items-center gap-2"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        <CalendarPlus className="h-4 w-4" />
                                        <span>Agendar Cita</span>
                                      </a>
                                    </Button>
                                  </CardFooter>
                                </div>
                              </div>
                            </Card>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className="left-0 -translate-x-4" />
                <CarouselNext className="right-0 translate-x-4" />
              </Carousel>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
