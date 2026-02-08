"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Ana García",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "Excelente servicio. María es una profesional increíble, me encantó mi nuevo look. El ambiente es muy agradable y el personal muy atento.",
    service: "Corte y coloración",
  },
  {
    id: 2,
    name: "Roberto Méndez",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "Primera vez que visito el lugar y quedé muy satisfecho. El masaje fue relajante y el personal muy profesional. Definitivamente regresaré.",
    service: "Masaje relajante",
  },
  {
    id: 3,
    name: "Lucía Fernández",
    image: "/placeholder.svg?height=100&width=100",
    rating: 4,
    text: "Me encantó mi manicure, Laura tiene mucho talento y es muy detallista. El único inconveniente fue que tuve que esperar un poco más de lo programado.",
    service: "Manicure",
  },
  {
    id: 4,
    name: "Daniel Torres",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "La limpieza facial fue increíble, mi piel se ve mucho mejor. Carlos es muy profesional y explica todo el proceso. Recomendado al 100%.",
    service: "Limpieza facial",
  },
  {
    id: 5,
    name: "Sofía Ramírez",
    image: "/placeholder.svg?height=100&width=100",
    rating: 5,
    text: "El tratamiento capilar fue justo lo que necesitaba mi cabello. Ahora luce mucho más saludable y brillante. El personal es muy amable y el lugar muy limpio.",
    service: "Tratamiento capilar",
  },
  {
    id: 6,
    name: "Javier López",
    image: "/placeholder.svg?height=100&width=100",
    rating: 4,
    text: "Buen servicio en general. El corte quedó como lo pedí y el estilista fue muy profesional. El único detalle es que el lugar estaba un poco lleno.",
    service: "Corte de cabello",
  },
];

export default function Testimonials() {
  const [currentPage, setCurrentPage] = useState(0);
  const testimonialsPerPage = 3;
  const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);

  const currentTestimonials = testimonials.slice(
    currentPage * testimonialsPerPage,
    (currentPage + 1) * testimonialsPerPage,
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  return (
    <section id="testimonials" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Lo que dicen nuestros alumnos
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Nos enorgullece la satisfacción de nuestros alumnos. Estas son
            algunas de las opiniones que han compartido sobre su experiencia con
            nosotros.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {currentTestimonials.map((testimonial) => (
            <Card key={testimonial.id} className="h-full flex flex-col">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <img
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{testimonial.name}</h3>
                    <CardDescription>{testimonial.service}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="flex mb-2">
                  {Array.from({ length: 5 }).map((_: unknown, i: number) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < testimonial.rating ? "text-yellow-500 fill-yellow-500" : "text-muted"}`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-center mt-8">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={prevPage}
              disabled={currentPage === 0}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              {currentPage + 1} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={nextPage}
              disabled={currentPage === totalPages - 1}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
