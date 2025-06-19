export interface EmailFormValues {
  recipient_email: string;
  recipient_name: string;
  subject: string;
  body: string;
  scheduled?: boolean;
  scheduled_date?: Date | null;
  scheduled_time?: string;
  template_id_used?: number | null;
}
