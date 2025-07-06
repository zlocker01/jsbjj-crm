import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { HeroSection } from "@/interfaces/heroSection/Interface";
import { useId } from 'react';
import GraduationCarousel from "./graduationCarousel";

export default function Hero({ data }: { data: HeroSection }) {
  const heroId = useId();
  return (
    <section id={heroId} className="relative overflow-hidden mt-20">
      <div className="absolute inset-0 bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/30 -z-10" />
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block text-primary">{data.title}</span>
              <span className="block mt-2">{data.subtitle}</span>

            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0">
              {data.text}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              {/* promotions button for graduation session */}
              <Button size="lg" asChild>
                <Link href="#promotions">Ver Promociones de Graduación</Link>
              </Button>
              {/* <Button size="lg" asChild>
                <Link href="#booking">Agenda tu cita</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#services">Ver servicios</Link>
              </Button> */}
            </div>
          </div>
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden">
            {/* <img
              src={data.image}
              alt={data.title}
              className="w-full h-full object-cover"
            /> */}
            <GraduationCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}
