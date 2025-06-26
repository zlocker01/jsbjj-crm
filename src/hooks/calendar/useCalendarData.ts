import useSWR from "swr";
import type { Appointment } from "@/interfaces/appointments/Appointment";
import type { Client } from "@/interfaces/client/Client";
import type { Promotion } from "@/interfaces/promotions/Promotion";
import type { Service } from "@/interfaces/services/Service";

interface CalendarData {
  appointments: Appointment[];
  clients: Client[];
  services: Service[];
  promotions: Promotion[];
}

const fetchCalendarData = async ([_, landingPageId]: [
  string,
  string,
]): Promise<CalendarData> => {
  try {
    const [
      appointmentsResponse,
      clientsResponse,
      servicesResponse,
      promotionsResponse,
    ] = await Promise.all([
      fetch(`/api/appointments`).then((res) => res.json()),
      fetch(`/api/clients`).then((res) => res.json()),
      fetch(`/api/services?landingPageId=${landingPageId}`).then((res) =>
        res.json(),
      ),
      fetch(`/api/promotions?landingPageId=${landingPageId}`).then((res) =>
        res.json(),
      ),
    ]);

    const appointments = Array.isArray(appointmentsResponse?.data)
      ? appointmentsResponse.data
      : [];

    const clients = Array.isArray(clientsResponse?.clients)
      ? clientsResponse.clients
      : [];

    const services = Array.isArray(servicesResponse?.services)
      ? servicesResponse.services
      : [];

    const promotions = Array.isArray(promotionsResponse?.promotions)
      ? promotionsResponse.promotions
      : [];

    return {
      appointments,
      clients,
      services,
      promotions,
    };
  } catch (error) {
    console.error("[useCalendarData] Error:", error);
    return {
      appointments: [],
      clients: [],
      services: [],
      promotions: [],
    };
  }
};

export const useCalendarData = (landingPageId: string) => {
  const { data, error, isLoading } = useSWR(
    ["calendar-data", landingPageId],
    fetchCalendarData,
  );

  return {
    appointments: data?.appointments || [],
    clients: data?.clients || [],
    services: data?.services || [],
    promotions: data?.promotions || [],
    isLoading,
    error: error?.message || null,
  };
};
