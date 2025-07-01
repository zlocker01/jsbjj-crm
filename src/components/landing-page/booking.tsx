"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CalendarIcon, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  service: z.string({
    required_error: "Por favor selecciona un servicio",
  }).or(
    z.literal("")
  ),
  promotion: z.string({
    required_error: "Por favor selecciona una promoción",
  }).or(
    z.literal("")
  ),
  // stylist: z.string({
  //   required_error: "Por favor selecciona un estilista",
  // }),
  date: z.date({
    required_error: "Por favor selecciona una fecha",
  }),
  time: z.string({
    required_error: "Por favor selecciona una hora",
  }),
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  email: z.string().email({
    message: "Por favor ingresa un correo electrónico válido",
  }),
  phone: z.string().min(10, {
    message: "Por favor ingresa un número de teléfono válido",
  }),
  notes: z.string().optional(),
  paymentMethod: z.enum(["card", "cash"], {
    required_error: "Por favor selecciona un método de pago",
  }),
});

export default function Booking({landingId = ""}: {landingId?: string}) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [promotions, setPromotions] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoadingTimeSlots, setIsLoadingTimeSlots] = useState(false);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [isLoadingPromotions, setIsLoadingPromotions] = useState(true);
  const { toast } = useToast();
  // const [stylists, setStylists] = useState<any[]>([]); // No implementado

  // Cargar servicios, promociones y citas al montar
  React.useEffect(() => {
    console.log('LandingId recibido en component:', landingId);
    if (!landingId) {
      console.warn('landingId no proporcionado o inválido. Algunos datos no estarán disponibles.');
      setIsLoadingServices(false);
      setIsLoadingPromotions(false);
      return;
    }
    
    const fetchData = async () => {
      try {
        setIsLoadingServices(true);
        // Cargar servicios
        try {
          console.log('Solicitando servicios con landingId:', landingId);
          const resServices = await fetch(`/api/services?landingPageId=${landingId}`);
          console.log('Respuesta de API servicios:', resServices.status, resServices.statusText);
          
          if (!resServices.ok) {
            const errorText = await resServices.text();
            console.error('Error al cargar servicios:', errorText);
            toast({ title: "Error cargando servicios", variant: "destructive" });
          } else {
            const dataServices = await resServices.json();
            console.log('Servicios recibidos (datos brutos):', dataServices);
            if (dataServices && Array.isArray(dataServices.services)) {
              console.log('Número de servicios encontrados:', dataServices.services.length);
              setServices(dataServices.services);
            } else {
              console.warn('La estructura de datos de servicios no es la esperada:', dataServices);
            }
          }
        } catch (serviceErr) {
          console.error('Excepción al cargar servicios:', serviceErr);
        }
        setIsLoadingServices(false);

        setIsLoadingPromotions(true);
        // Cargar promociones
        try {
          console.log('Solicitando promociones con landingId:', landingId);
          const resPromotions = await fetch(`/api/promotions?landingPageId=${landingId}`);
          console.log('Respuesta de API promociones:', resPromotions.status, resPromotions.statusText);
          
          if (!resPromotions.ok) {
            const errorText = await resPromotions.text();
            console.error('Error al cargar promociones:', errorText);
            toast({ title: "Error cargando promociones", variant: "destructive" });
          } else {
            const dataPromotions = await resPromotions.json();
            console.log('Promociones recibidas (datos brutos):', dataPromotions);
            if (dataPromotions && Array.isArray(dataPromotions.promotions)) {
              console.log('Número de promociones encontradas:', dataPromotions.promotions.length);
              setPromotions(dataPromotions.promotions);
            } else {
              console.warn('La estructura de datos de promociones no es la esperada:', dataPromotions);
              console.log('Usando datos de prueba para promociones');
            }
          }
        } catch (promoErr) {
          console.error('Excepción al cargar promociones:', promoErr);
        }
        setIsLoadingPromotions(false);

        // Cargar todas las citas existentes
        try {
          const resAppointments = await fetch(`/api/appointments`);
          if (!resAppointments.ok) {
            console.error('Error al cargar citas:', await resAppointments.text());
            toast({ title: "Error cargando citas", variant: "destructive" });
          } else {
            const dataAppointments = await resAppointments.json();
            console.log('Citas recibidas:', dataAppointments);
            setAppointments(dataAppointments.data || []);
          }
        } catch (err) {
          console.error('Error general:', err);
          toast({ title: "Error cargando datos necesarios", variant: "destructive" });
        }
      } catch (err) {
        console.error('Error general:', err);
        toast({ title: "Error cargando datos necesarios", variant: "destructive" });
        setIsLoadingServices(false);
        setIsLoadingPromotions(false);
      }
    };
    fetchData();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      service: "",
      promotion: "",
      notes: "",
    },
    mode: "onChange", // Validar al cambiar los campos
  });

  const watchService = form.watch("service");
  const watchPromotion = form.watch("promotion");
  const watchPaymentMethod = form.watch("paymentMethod");

  // Generar timeSlots disponibles cuando cambie la fecha seleccionada
  React.useEffect(() => {
    const selectedDate = form.watch("date");
    if (selectedDate) {
      generateAvailableTimeSlots(selectedDate);
    }
  }, [form.watch("date"), appointments]);

  // Función para generar horarios disponibles basados en fecha seleccionada
  const generateAvailableTimeSlots = (selectedDate: Date) => {
    setIsLoadingTimeSlots(true);
    
    // Definir horario de apertura (9am) y cierre (7pm)
    const openingHour = 9;
    const closingHour = 19;
    
    // Duración promedio de cada servicio en minutos (puede ajustarse según tus necesidades)
    const appointmentDuration = 60;
    
    // Generar todos los posibles slots de tiempo por hora
    const allPossibleSlots: string[] = [];
    for (let hour = openingHour; hour < closingHour; hour++) {
      allPossibleSlots.push(`${hour}:00`);
      // También podríamos agregar slots cada media hora
      if (hour < closingHour - 1) {
        allPossibleSlots.push(`${hour}:30`);
      }
    }
    
    // Filtrar horarios ya ocupados para la fecha seleccionada
    const selectedDateStr = format(selectedDate, "yyyy-MM-dd");
    const bookedAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return format(appointmentDate, "yyyy-MM-dd") === selectedDateStr;
    });
    
    // Extraer horas reservadas
    const bookedTimes = bookedAppointments.map(appointment => {
      // Asumiendo que appointment.time está en formato "HH:mm"
      return appointment.time;
    });
    
    // Filtrar slots disponibles
    const availableSlots = allPossibleSlots.filter(slot => !bookedTimes.includes(slot));
    
    // Actualizar estado con slots disponibles
    setAvailableTimeSlots(availableSlots);
    setIsLoadingTimeSlots(false);
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Avanzar al paso de confirmación
    setStep(3);
    toast({
      title: "¡Cita agendada con éxito!",
      description: `Te esperamos el ${format(values.date, "PPP", { locale: es })} a las ${values.time}`,
      variant: "success",
    });
  };

  const getServicePrice = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    return service ? service.price : 0;
  };

  const handleContinueToStep2 = async () => {
    // Validar todos los campos del paso 1
    const result = await form.trigger(
      ["service", /* "stylist", */ "date", "time", "name", "email", "phone"],
      {
        shouldFocus: true,
      },
    );

    if (result) {
      setStep(2);
    } else {
      // Mostrar mensaje de error
      toast({
        title: "Por favor completa todos los campos",
        description:
          "Todos los campos son obligatorios excepto las notas adicionales.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="booking" className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Agenda tu Cita
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Reserva tu cita en pocos pasos. Selecciona el servicio, profesional,
            fecha y hora que prefieras.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                  step >= 1 ? "bg-primary" : "bg-muted",
                )}
              >
                1
              </div>
              <div className="ml-2">
                <p className="font-medium">Detalles</p>
              </div>
            </div>
            <div className="h-0.5 w-16 bg-muted flex-grow mx-4" />
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                  step >= 2 ? "bg-primary" : "bg-muted",
                )}
              >
                2
              </div>
              <div className="ml-2">
                <p className="font-medium">Pago</p>
              </div>
            </div>
            <div className="h-0.5 w-16 bg-muted flex-grow mx-4" />
            <div className="flex items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold",
                  step >= 3 ? "bg-primary" : "bg-muted",
                )}
              >
                3
              </div>
              <div className="ml-2">
                <p className="font-medium">Confirmación</p>
              </div>
            </div>
          </div>

          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle>Detalles de la cita</CardTitle>
                <CardDescription>
                  Selecciona el servicio, profesional, fecha y hora
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-6">
                    <FormField
                      control={form.control}
                      name="service"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-white">
                            Servicio
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                // Si selecciona un servicio, resetear promoción
                                if (value) form.setValue("promotion", "");
                              }}
                              value={field.value}
                              disabled={isLoadingServices}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un servicio" />
                              </SelectTrigger>
                              <SelectContent>
                                {isLoadingServices ? (
                                  <SelectItem value="loading" disabled>
                                    Cargando servicios...
                                  </SelectItem>
                                ) : services.length === 0 ? (
                                  <SelectItem value="no-services" disabled>
                                    No hay servicios disponibles
                                  </SelectItem>
                                ) : (
                                  services.map((service) => (
                                    <SelectItem
                                      key={service.id}
                                      value={service.id.toString()}
                                    >
                                      {service.title} - {service.price}€
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Promociones */}
                    <FormField
                      control={form.control}
                      name="promotion"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-white">
                            Promoción
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                // Si selecciona una promoción, resetear servicio
                                if (value) form.setValue("service", "");
                              }}
                              value={field.value}
                              disabled={isLoadingPromotions}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona una promoción" />
                              </SelectTrigger>
                              <SelectContent>
                                {isLoadingPromotions ? (
                                  <SelectItem value="loading" disabled>
                                    Cargando promociones...
                                  </SelectItem>
                                ) : promotions.length === 0 ? (
                                  <SelectItem value="no-promotions" disabled>
                                    No hay promociones disponibles
                                  </SelectItem>
                                ) : (
                                  promotions.map((promotion) => (
                                    <SelectItem
                                      key={promotion.id}
                                      value={promotion.id.toString()}
                                    >
                                      {promotion.title} - {promotion.discount_price || promotion.price}€
                                    </SelectItem>
                                  ))
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Fecha</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: es })
                                    ) : (
                                      <span>Selecciona una fecha</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={(date) => {
                                    field.onChange(date);
                                    // Resetear el horario seleccionado cuando se cambia la fecha
                                    form.setValue("time", "");
                                  }}
                                  disabled={(date) =>
                                    date < new Date() || date.getDay() === 0
                                  }
                                  locale={es}
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="time"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hora</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecciona una hora" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-[300px] overflow-auto">
                                {isLoadingTimeSlots ? (
                                  <div className="p-2 text-center text-sm text-muted-foreground">
                                    Cargando horarios disponibles...
                                  </div>
                                ) : availableTimeSlots.length > 0 ? (
                                  <>
                                    {/* Agrupar por mañana y tarde */}
                                    <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                                      Mañana
                                    </div>
                                    {availableTimeSlots
                                      .filter((time) => {
                                        const hour = parseInt(time.split(":")[0]);
                                        return hour < 12;
                                      })
                                      .map((time) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                    <div className="px-2 py-1.5 mt-2 text-xs font-medium text-muted-foreground">
                                      Tarde
                                    </div>
                                    {availableTimeSlots
                                      .filter((time) => {
                                        const hour = parseInt(time.split(":")[0]);
                                        return hour >= 12;
                                      })
                                      .map((time) => (
                                        <SelectItem key={time} value={time}>
                                          {time}
                                        </SelectItem>
                                      ))}
                                  </>
                                ) : (
                                  <div className="p-2 text-center text-sm text-muted-foreground">
                                    No hay horarios disponibles para esta fecha. Por favor selecciona otra fecha.
                                  </div>
                                )}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre completo</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Correo electrónico</FormLabel>
                            <FormControl>
                              <Input placeholder="tu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Teléfono</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Tu número de teléfono"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notas adicionales (opcional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Cualquier información adicional que debamos saber"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleContinueToStep2}>
                  Continuar
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Método de pago</CardTitle>
                <CardDescription>
                  Selecciona cómo deseas pagar tu cita
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">
                            {services.find((s) => s.id === watchService)?.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {form.getValues("date") &&
                              format(form.getValues("date"), "PPP", {
                                locale: es,
                              })}{" "}
                            a las {form.getValues("time")}
                          </p>
                        </div>
                        <p className="font-bold">
                          ${getServicePrice(watchService)}
                        </p>
                      </div>

                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="space-y-3">
                            <FormLabel>Método de pago</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                value={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="card" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Tarjeta de crédito/débito
                                  </FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="cash" />
                                  </FormControl>
                                  <FormLabel className="font-normal">
                                    Efectivo (pago en el local)
                                  </FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchPaymentMethod === "card" && (
                        <div className="space-y-4 p-4 border rounded-lg">
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <FormLabel htmlFor="cardNumber">
                                Número de tarjeta
                              </FormLabel>
                              <Input
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <FormLabel htmlFor="expiry">
                                  Fecha de expiración
                                </FormLabel>
                                <Input id="expiry" placeholder="MM/AA" />
                              </div>
                              <div>
                                <FormLabel htmlFor="cvc">CVC</FormLabel>
                                <Input id="cvc" placeholder="123" />
                              </div>
                            </div>
                            <div>
                              <FormLabel htmlFor="nameOnCard">
                                Nombre en la tarjeta
                              </FormLabel>
                              <Input
                                id="nameOnCard"
                                placeholder="Nombre como aparece en la tarjeta"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between pt-4 border-t">
                      <p className="font-medium">Total a pagar:</p>
                      <p className="font-bold text-xl">
                        ${getServicePrice(watchService)}
                      </p>
                    </div>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Regresar
                </Button>
                <Button
                  onClick={async () => {
                    const isValid = await form.trigger("paymentMethod");
                    if (isValid) {
                      form.handleSubmit(onSubmit)();
                    } else {
                      toast({
                        title: "Por favor selecciona un método de pago",
                        variant: "destructive",
                      });
                    }
                  }}
                >
                  Confirmar cita
                </Button>
              </CardFooter>
            </Card>
          )}

          {step === 3 && (
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <CardTitle className="text-2xl">¡Cita confirmada!</CardTitle>
                <CardDescription>
                  Gracias por agendar tu cita con nosotros
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium">
                      {
                        services.find((s) => s.id === form.getValues("service"))
                          ?.name
                      }
                    </p>
                    <p className="text-muted-foreground">
                      {form.getValues("date") &&
                        format(form.getValues("date"), "PPP", {
                          locale: es,
                        })}{" "}
                      a las {form.getValues("time")}
                    </p>
                    <p className="text-muted-foreground">
                      {/* Con:{" "}
                      {
                        stylists.find((s) => s.id === form.getValues("stylist"))
                          ?.name
                      } */}
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Método de pago:{" "}
                      {form.getValues("paymentMethod") === "card"
                        ? "Tarjeta"
                        : "Efectivo (pago en el local)"}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">
                      Hemos enviado un correo de confirmación a{" "}
                      {form.getValues("email")} con los detalles de tu cita.
                    </p>
                    <p className="text-muted-foreground mt-2">
                      Te recordaremos tu cita un día antes por correo
                      electrónico y mensaje de texto.
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="justify-center">
                <Button
                  onClick={() => {
                    form.reset();
                    setStep(1);
                  }}
                >
                  Agendar otra cita
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
