export type EmailStatus =
  | "pending"
  | "processing"
  | "sent"
  | "delivered"
  | "failed"
  | "bounced"
  | "scheduled";

export interface Email {
  id: bigint;
  user_id: string; // uuid
  recipient_email: string;
  recipient_name: string;
  subject: string;
  body: string;
  sent_at?: Date | string | null;
  status: EmailStatus;
  template_id_used?: string | null;
  scheduled: boolean;
  scheduled_date?: Date | string | null;
  scheduled_time?: string | null;
}
