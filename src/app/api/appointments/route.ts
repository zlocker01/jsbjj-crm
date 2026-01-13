import { NextRequest, NextResponse } from 'next/server';
import { getAppointments } from '@/data/appointments/getAppointments';
import { createAppointment } from '@/data/appointments/createAppointment';
import { getUserId } from '@/data/getUserIdServer';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const appointments = await getAppointments();

    // Si el usuario está autenticado y es admin o empleado, devolver todos los datos
    if (user) {
      const { data: userData } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (userData?.role === 'admin' || userData?.role === 'empleado') {
        return NextResponse.json({
          success: true,
          data: appointments,
        });
      }
    }

    // Filtrar datos sensibles para proteger la privacidad
    // Solo devolvemos la fecha y hora para calcular disponibilidad
    const publicAppointments = appointments?.map((app) => ({
      start_datetime: app.start_datetime,
      end_datetime: app.end_datetime,
      status: app.status,
    }));

    return NextResponse.json({
      success: true,
      data: publicAppointments,
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch appointments',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { landingPageId, ...appointmentPayload } = await request.json();

    const supabase = await createClient();
    const userId = await getUserId();

    const { data: userData, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', userId)
      .single();

    if (error) throw error;

    // Extraer duración y precio desde service o promotion
    let duration_minutes: number | null = null;
    let price: number | null = null;

    if (appointmentPayload.promotion_id) {
      const { data: promoData, error: promoError } = await supabase
        .from('promotions')
        .select('duration_minutes, discount_price')
        .eq('id', appointmentPayload.promotion_id)
        .single();

      if (promoError) throw promoError;
      duration_minutes = promoData?.duration_minutes;
      price = promoData?.discount_price;
    } else if (appointmentPayload.service_id) {
      const { data: serviceData, error: serviceError } = await supabase
        .from('services')
        .select('duration_minutes, price')
        .eq('id', appointmentPayload.service_id)
        .single();

      if (serviceError) throw serviceError;
      duration_minutes = serviceData?.duration_minutes;
      price = serviceData?.price;
    }

    // Calcular end_datetime
    let end_datetime: string | null = null;
    if (appointmentPayload.start_datetime && duration_minutes !== null) {
      const start = new Date(appointmentPayload.start_datetime);
      const end = new Date(start.getTime() + duration_minutes * 60 * 1000);
      end_datetime = end.toISOString(); // formato compatible con timestamp
    }

    const appointmentData = {
      ...appointmentPayload,
      user_id: userId,
      appointment_source: userData?.role || 'web',
      actual_duration_minutes: duration_minutes,
      price_charged: price,
      end_datetime,
    };

    const appointment = await createAppointment(appointmentData);

    return NextResponse.json(
      {
        success: true,
        data: appointment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating appointment:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create appointment',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
