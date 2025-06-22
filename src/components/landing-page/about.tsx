import Image from "next/image";
import type { AboutSection } from "@/interfaces/aboutSections/AboutSection";
import AboutCarousel from "./AboutCarousel";

export default function About({ data }: { data: AboutSection }) {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Sobre La Rochelle
          </h2>
          <p className="text-muted-foreground max-w-3xl mx-auto text-left">
            En La Rochelle, realzamos tu belleza natural con técnicas de vanguardia y atención personalizada. Somos un centro de estética en Tlaxcala centro que fusiona tradición y tendencia en cada servicio. Nuestro equipo de especialistas ofrece lo mejor en tratamientos de belleza, manicura y pedicura, uñas acrílicas y de gel, así como un área exclusiva de barbería en Tlaxcala con cortes masculinos, afeitado con navaja y arreglo de barba profesional.
            Ya sea que busques un salón de belleza cerca de ti o una clínica de belleza en Tlaxcala, La Rochelle es tu lugar.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* images carusel */}
          <AboutCarousel />
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">{data.title}</h3>
            <p className="text-muted-foreground">{data.description}</p>
            <div className="grid grid-cols-2 gap-4">
              {/* <div className="bg-muted/50 p-4 rounded-lg text-center">
                <h4 className="text-4xl font-bold text-primary">+5000</h4>
                <p className="text-sm text-muted-foreground">
                  Clientes satisfechos
                </p>
              </div> */}
              {/* <div className="bg-muted/50 p-4 rounded-lg text-center">
                <h4 className="text-4xl font-bold text-primary">+3</h4>
                <p className="text-sm text-muted-foreground">
                  Profesionales certificados
                </p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <h4 className="text-4xl font-bold text-primary">+10</h4>
                <p className="text-sm text-muted-foreground">
                  Servicios especializados
                </p>
              </div> */}
              {/* <div className="bg-muted/50 p-4 rounded-lg text-center">
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
