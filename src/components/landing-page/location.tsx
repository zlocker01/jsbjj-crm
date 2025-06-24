import { useId } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Clock, Mail, Instagram, Facebook } from "lucide-react";
import type { ContactSection } from "@/interfaces/contactSections/ContactSection";
import type { Schedule } from "@/interfaces/schedule/Schedule";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3765.028462151418!2d-98.23600822282489!3d19.32457119755882!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85cfd92ff33d1219%3A0x87e7da066c69b985!2sGuillermo%20Valle%2066%2C%20Centro%2C%2090000%20Tlaxcala%20de%20Xicoht%C3%A9ncatl%2C%20Tlax.!5e0!3m2!1ses-419!2smx!4v1749530941591!5m2!1ses-419!2smx"
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
                  {schedules
                    ?.map((schedule) => {
                      type DayKey =
                        | "monday"
                        | "tuesday"
                        | "wednesday"
                        | "thursday"
                        | "friday"
                        | "saturday"
                        | "sunday";

                      const dayMap: Record<DayKey, number> = {
                        monday: 1,
                        tuesday: 2,
                        wednesday: 3,
                        thursday: 4,
                        friday: 5,
                        saturday: 6,
                        sunday: 0,
                      };

                      const dayKey =
                        schedule.day_of_week.toLowerCase() as DayKey;
                      const dayOrder =
                        dayMap[dayKey] === 0 ? 7 : dayMap[dayKey];
                      const dayNumber = dayMap[dayKey] ?? 8;

                      const dayName = new Intl.DateTimeFormat("es-ES", {
                        weekday: "long",
                      })
                        .format(new Date(2023, 0, dayNumber + 1))
                        .replace(/^\w/, (c) => c.toUpperCase());

                      return {
                        ...schedule,
                        dayNumber: dayOrder,
                        dayName,
                      };
                    })
                    .sort((a, b) => a.dayNumber - b.dayNumber)
                    .map((schedule) => {
                      const formatTime = (
                        timeString: string | null | undefined,
                      ): string => {
                        if (!timeString) {
                          return "";
                        }
                        const [hours, minutes] = timeString.split(":");
                        const date = new Date();
                        date.setHours(
                          parseInt(hours, 10),
                          parseInt(minutes, 10),
                        );
                        return format(date, "h:mma", {
                          locale: es,
                        }).toLowerCase();
                      };

                      return (
                        <div
                          key={schedule.day_of_week}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium">
                            {schedule.dayName}
                          </span>
                          <span className="text-foreground">
                            {schedule.is_working_day
                              ? `${formatTime(schedule.start_time)} - ${formatTime(schedule.end_time)}`
                              : "Cerrado"}
                          </span>
                        </div>
                      );
                    })}
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
                    info@larochelle.com
                  </a>
                </p>
              </div>
            </div>

            <div className="bg-background p-6 rounded-xl shadow-sm">
              <h3 className="font-medium mb-4">Redes Sociales</h3>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" asChild>
                  <Link
                    href={`${data.instagram}`}
                    target="_blank"
                    aria-label="Instagram"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
                  <Link
                    href={`${data.facebook}`}
                    target="_blank"
                    aria-label="Facebook"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="outline" size="icon" asChild>
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
              <Link href="#booking">Agendar Cita</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
