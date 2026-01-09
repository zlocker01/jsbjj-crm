import { useId } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Clock, Mail, Instagram, Facebook } from 'lucide-react';
import type { ContactSection } from '@/interfaces/contactSections/ContactSection';
import type { Schedule } from '@/interfaces/schedule/Schedule';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface LocationProps {
  data: ContactSection;
  schedules?: Schedule[];
}

export default function Location({ data, schedules }: LocationProps) {
  const id = useId();
  return (
    <section id={id} className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ubicación y Contacto
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Estamos ubicados en una zona céntrica y de fácil acceso. Contáctanos
            para resolver cualquier duda o agendar tu cita.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="h-[400px] rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d941.3541828998782!2d-98.24230133045572!3d19.30771486454816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cfd941b58ee7ff%3A0xdd2c4693b089280b!2sC.%2023%2023%2C%20La%20Loma%20Xicohtencatl%2C%20San%20Isidro%2C%2090062%20Tlaxcala%20de%20Xicoht%C3%A9ncatl%2C%20Tlax.!5e0!3m2!1ses-419!2smx!4v1767839257001!5m2!1ses-419!2smx"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Ubicación de Bella Estética"
            />
          </div>

          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">Dirección</h3>
                </div>
                <p className="text-muted-foreground">{data.address}</p>
              </div>

              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">Teléfono</h3>
                </div>
                <p className="text-muted-foreground mb-2">
                  <a href={data.phone} className="hover:text-primary">
                    {data.phone}
                  </a>
                </p>
              </div>

              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium text-lg">Horario de Atención</h3>
                </div>
                <div className="space-y-2">
                  {(() => {
                    if (!schedules?.length) return null;

                    const formatTime = (
                      timeString: string | null | undefined
                    ): string => {
                      if (!timeString) return '';
                      const [hours, minutes] = timeString.split(':');
                      const date = new Date();
                      date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
                      return format(date, 'h:mma', {
                        locale: es,
                      }).toLowerCase();
                    };

                    const normalizeDay = (day: string): string => {
                      const d = day.toLowerCase().trim();
                      const map: Record<string, string> = {
                        lunes: 'monday',
                        martes: 'tuesday',
                        miércoles: 'wednesday',
                        miercoles: 'wednesday',
                        jueves: 'thursday',
                        viernes: 'friday',
                        sábado: 'saturday',
                        sabado: 'saturday',
                        domingo: 'sunday',
                        monday: 'monday',
                        tuesday: 'tuesday',
                        wednesday: 'wednesday',
                        thursday: 'thursday',
                        friday: 'friday',
                        saturday: 'saturday',
                        sunday: 'sunday',
                      };
                      return map[d] || d;
                    };

                    const dayMap: Record<string, number> = {
                      monday: 1,
                      tuesday: 2,
                      wednesday: 3,
                      thursday: 4,
                      friday: 5,
                      saturday: 6,
                      sunday: 0,
                    };

                    // Agrupar horarios por día
                    const grouped = schedules.reduce((acc, curr) => {
                      const day = normalizeDay(curr.day_of_week);
                      if (!acc[day]) acc[day] = [];
                      acc[day].push(curr);
                      return acc;
                    }, {} as Record<string, typeof schedules>);

                    return Object.entries(grouped)
                      .map(([dayKey, daySchedules]) => {
                        const dayNumber = dayMap[dayKey] ?? 8;
                        // Ordenar lunes(1) a domingo(7)
                        const sortOrder =
                          dayMap[dayKey] === 0 ? 7 : dayMap[dayKey];

                        const dayName = new Intl.DateTimeFormat('es-ES', {
                          weekday: 'long',
                        })
                          .format(new Date(2023, 0, dayNumber + 1))
                          .replace(/^\w/, (c) => c.toUpperCase());

                        return {
                          dayKey,
                          dayName,
                          sortOrder,
                          schedules: daySchedules,
                        };
                      })
                      .sort((a, b) => a.sortOrder - b.sortOrder)
                      .map(({ dayKey, dayName, schedules }) => {
                        const workingSchedules = schedules.filter(
                          (s) => s.is_working_day
                        );

                        let timeContent;
                        if (workingSchedules.length > 0) {
                          // Ordenar por hora de inicio
                          workingSchedules.sort((a, b) =>
                            (a.start_time || '').localeCompare(
                              b.start_time || ''
                            )
                          );

                          timeContent = workingSchedules.map((s, index) => (
                            <span key={index}>
                              {index > 0 && ', '}
                              {formatTime(s.start_time)} -{' '}
                              {formatTime(s.end_time)}
                            </span>
                          ));
                        } else {
                          timeContent = 'Cerrado';
                        }

                        return (
                          <div
                            key={dayKey}
                            className="flex justify-between items-start"
                          >
                            <span className="font-medium">{dayName}</span>
                            <span className="text-foreground text-right">
                              {timeContent}
                            </span>
                          </div>
                        );
                      });
                  })()}
                </div>
              </div>

              <div className="bg-background p-6 rounded-xl shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium">Correo</h3>
                </div>
                <p className="text-muted-foreground">
                  <a
                    href="mailto:info@larochelle.com"
                    className="hover:text-primary"
                  >
                    {data.email}
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm">
              <h3 className="font-medium mb-4">Redes Sociales</h3>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-goldHover"
                  asChild
                >
                  <Link
                    href={`${data.instagram}`}
                    target="_blank"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-goldHover"
                  asChild
                >
                  <Link
                    href={`${data.facebook}`}
                    target="_blank"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="hover:bg-goldHover"
                  asChild
                >
                  <Link
                    href={`${data.tik_tok}`}
                    target="_blank"
                    aria-label="TikTok"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                      className="h-5 w-5"
                    >
                      <title>TikTok</title>
                      <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3z" />
                    </svg>
                  </Link>
                </Button>
              </div>
            </div>

            <Button size="lg" asChild className="w-full">
              <a
                href="https://wa.me/522461003603?text=Hola,%20me%20gustaría%20agendar%20una%20cita"
                target="_blank"
                rel="noopener noreferrer"
              >
                Agendar Cita
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
