import Image from "next/image";
import type { AboutSection } from "@/interfaces/aboutSections/AboutSection";
import { useId } from 'react';

export default function About({ data }: { data: AboutSection }) {
  const uniqueId = useId();
  return (
    <section id={uniqueId} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sobre La Rochelle
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            En La Rochelle, nos dedicamos a realzar la belleza natural de cada
            cliente. Nuestro equipo de profesionales certificados combina
            técnicas tradicionales con las últimas tendencias para ofrecerte
            resultados excepcionales.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/placeholder.svg?height=800&width=1200"
              alt="Nuestro salón"
              fill
              className="object-cover"
            />
          </div>
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">{data.title}</h3>
            <p className="text-muted-foreground">{data.description}</p>
            <div className="grid grid-cols-2 gap-4">
              {/* <div className="bg-muted/50 p-4 rounded-lg text-center">
                <h4 className="text-4xl font-bold text-primary">+5000</h4>
                <p className="text-sm text-muted-foreground">
                  Clientes satisfechos
                </p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <h4 className="text-4xl font-bold text-primary">+10</h4>
                <p className="text-sm text-muted-foreground">
                  Profesionales certificados
                </p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <h4 className="text-4xl font-bold text-primary">+20</h4>
                <p className="text-sm text-muted-foreground">
                  Servicios especializados
                </p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <h4 className="text-4xl font-bold text-primary">8</h4>
                <p className="text-sm text-muted-foreground">
                  Años de experiencia
                </p>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
