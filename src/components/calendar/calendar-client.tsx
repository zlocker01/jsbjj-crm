import { AppointmentCalendar } from "./AppointmentCalendar";
import { AppointmentDetails } from "./AppointmentDetails";
import { AppointmentForm } from "./AppointmentForm";

interface CalendarClientProps {
  view: "month" | "week" | "day";
  selectedDate: Date;
  selectedAppointment: any;
  isCreating: boolean;
  isEditing: boolean;
  clients: any[];
  services: any[];
  promotions: any[];
  appointments: any[];
  onViewChange: (view: "month" | "week" | "day") => void;
  onDateChange: (date: Date) => void;
  onAppointmentSelect: (appointment: any) => void;
  onCreateAppointment: () => void;
  onEditAppointment: (appointment: any) => void;
  onCancelEdit: () => void;
  onAppointmentSubmit: (data: any) => Promise<void>;
}

export function CalendarClient({
  view,
  selectedDate,
  selectedAppointment,
  isCreating,
  isEditing,
  clients,
  services,
  promotions,
  appointments,
  onViewChange,
  onDateChange,
  onAppointmentSelect,
  onCreateAppointment,
  onEditAppointment,
  onCancelEdit,
  onAppointmentSubmit,
}: CalendarClientProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* ... UI del encabezado ... */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 order-2 lg:order-1">
          <AppointmentCalendar
            view={view}
            appointments={appointments}
            isLoading={false}
            error={null}
            onViewChange={onViewChange}
            onDateChange={onDateChange}
            onAppointmentSelect={onAppointmentSelect}
          />
        </div>
        <div className="w-full lg:w-96 order-1 lg:order-2">
          {isCreating || isEditing ? (
            <AppointmentForm
              appointment={isEditing ? selectedAppointment : undefined}
              clients={clients}
              services={services}
              promotions={promotions}
              onSubmit={onAppointmentSubmit}
              onCancel={onCancelEdit}
            />
          ) : (
            <AppointmentDetails
              appointment={selectedAppointment}
              onEdit={onEditAppointment}
              onCreateNew={onCreateAppointment}
              onClose={onCancelEdit}
            />
          )}
        </div>
      </div>
    </div>
  );
}
