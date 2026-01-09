import type { AboutSection } from '@/interfaces/aboutSections/AboutSection';
import AboutCarousel from './AboutCarousel';

export default function About({ data }: { data: AboutSection }) {
  return (
    <section id="about" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          {/* images carusel */}
          <AboutCarousel />
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">{data.title}</h2>
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
                */}
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <h4 className="text-4xl font-bold text-primary">+10</h4>
                <p className="text-sm text-muted-foreground">
                  Servicios especializados
                </p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg text-center">
                <h4 className="text-4xl font-bold text-primary">8</h4>
                <p className="text-sm text-muted-foreground">
                  Años de experiencia
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
