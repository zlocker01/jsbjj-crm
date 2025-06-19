"use client";

import { useState } from "react";
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
  }),
  stylist: z.string({
    required_error: "Por favor selecciona un estilista",
  }),
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

const services = [
  { id: "haircut", name: "Corte de cabello", price: 300 },
  { id: "coloring", name: "Tinte y mechas", price: 800 },
  { id: "facial", name: "Limpieza facial", price: 600 },
  { id: "massage", name: "Masaje relajante", price: 700 },
  { id: "manicure", name: "Manicure y pedicure", price: 400 },
  { id: "treatment", name: "Tratamiento capilar", price: 500 },
];

const stylists = [
  { id: "maria", name: "María Rodríguez" },
  { id: "carlos", name: "Carlos Gómez" },
  { id: "laura", name: "Laura Sánchez" },
  { id: "javier", name: "Javier Méndez" },
];

const timeSlots = [
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export default function Booking() {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notes: "",
    },
    mode: "onChange", // Validar al cambiar los campos
  });

  const watchService = form.watch("service");
  const watchPaymentMethod = form.watch("paymentMethod");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
    // Avanzar al paso de confirmación
    setStep(3);
    toast({
      title: "¡Cita agendada con éxito!",
      description: `Te esperamos el ${format(values.date, "PPP", { locale: es })} a las ${values.time}`,
    });
  };

  const getServicePrice = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId);
    return service ? service.price : 0;
  };

  const handleContinueToStep2 = async () => {
    // Validar todos los campos del paso 1
    const result = await form.trigger(
      ["service", "stylist", "date", "time", "name", "email", "phone"],
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
                        <FormItem>
                          <FormLabel>Servicio</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedService(value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un servicio" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {services.map((service) => (
                                <SelectItem key={service.id} value={service.id}>
                                  {service.name} - ${service.price}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="stylist"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Estilista</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona un estilista" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {stylists.map((stylist) => (
                                <SelectItem key={stylist.id} value={stylist.id}>
                                  {stylist.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
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
                                  onSelect={field.onChange}
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
                              <SelectContent>
                                {timeSlots.map((time) => (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                ))}
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
                      Con:{" "}
                      {
                        stylists.find((s) => s.id === form.getValues("stylist"))
                          ?.name
                      }
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
