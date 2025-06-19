"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarPlus, Loader2, AlertCircle, Clock } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch promotions");
    }
    return res.json();
  });

export default function Promotions({ landingId }: { landingId: string }) {
  const [isMounted, setIsMounted] = useState(false);
  const { data, error, isLoading } = useSWR<{ promotions: any[] }>(
    `/api/promotions?landingPageId=${landingId}`,
    fetcher,
  );

  const promotions = data?.promotions || [];

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (isLoading) {
    return (
      <section
        id="promotions"
        className="py-16 md:py-24 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/20"
      >
        <div className="container mx-auto px-4 text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
          <p className="mt-4">Cargando promociones...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="promotions"
        className="py-16 md:py-24 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/20"
      >
        <div className="container mx-auto px-4 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <p className="mt-4 text-destructive">
            Error al cargar las promociones. Intente nuevamente.
          </p>
        </div>
      </section>
    );
  }

  if (promotions.length === 0) {
    return null;
  }

  return (
    <section
      id="promotions"
      className="py-16 md:py-24 bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-950/10 dark:to-purple-950/20"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Promociones Especiales
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Aprovecha nuestras promociones por tiempo limitado. ¡No dejes pasar
            estas increíbles ofertas!
          </p>
        </div>

        {isMounted && (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-1">
              {promotions.map((promo) => (
                <CarouselItem
                  key={promo.id}
                  className="pl-4 md:basis-1/2 lg:basis-1/3"
                >
                  <div className="p-1">
                    <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 w-full">
                        <Image
                          src={promo.image || "/placeholder.svg"}
                          alt={promo.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge variant="destructive" className="px-3 py-1">
                            {Math.round(
                              ((parseFloat(promo.price) -
                                parseFloat(promo.discount_price)) /
                                parseFloat(promo.price)) *
                                100,
                            )}
                            % OFF
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4 flex-grow">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold line-clamp-2">
                            {promo.title}
                          </h3>
                          {promo.category && (
                            <Badge
                              variant="secondary"
                              className="ml-2 whitespace-nowrap"
                            >
                              {promo.category}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {promo.description}
                        </p>
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold">
                            {promo.discount_price}
                          </span>
                          <span className="text-sm text-muted-foreground line-through">
                            {promo.price}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {promo.duration_minutes && (
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              <span>{promo.duration_minutes} minutos</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <CalendarPlus className="h-3 w-3 mr-1" />
                            <span>
                              Válido hasta{" "}
                              {new Date(promo.valid_until).toLocaleDateString(
                                "es-ES",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button className="w-full" asChild>
                          <Link href="#contact">Reservar ahora</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0 -translate-x-4" />
            <CarouselNext className="right-0 translate-x-4" />
          </Carousel>
        )}
      </div>
    </section>
  );
}
