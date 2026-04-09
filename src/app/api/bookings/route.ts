import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

type BookingRequestBody = {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  service?: string;
  appointment_date?: string;
  appointment_time?: string;
  notes?: string;
};

function getTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let payload: BookingRequestBody;

  try {
    payload = (await request.json()) as BookingRequestBody;
  } catch (error) {
    console.error("Invalid booking request body", error);
    return NextResponse.json(
      { success: false, error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  const booking = {
    customer_name: getTrimmedString(payload.customer_name),
    customer_email: getTrimmedString(payload.customer_email),
    customer_phone: getTrimmedString(payload.customer_phone),
    service: getTrimmedString(payload.service),
    appointment_date: getTrimmedString(payload.appointment_date),
    appointment_time: getTrimmedString(payload.appointment_time),
    notes: getTrimmedString(payload.notes),
  };

  const missingFields = [
    ["customer_name", booking.customer_name],
    ["service", booking.service],
    ["appointment_date", booking.appointment_date],
    ["appointment_time", booking.appointment_time],
  ]
    .filter(([, value]) => !value)
    .map(([field]) => field);

  if (missingFields.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: `Missing required fields: ${missingFields.join(", ")}`,
      },
      { status: 400 },
    );
  }

  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("bookings")
      .insert({
        customer_name: booking.customer_name,
        customer_email: booking.customer_email || null,
        customer_phone: booking.customer_phone || null,
        service: booking.service,
        appointment_date: booking.appointment_date,
        appointment_time: booking.appointment_time,
        notes: booking.notes || null,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Failed to create booking in Supabase", {
        error,
        booking: {
          customer_name: booking.customer_name,
          service: booking.service,
          appointment_date: booking.appointment_date,
          appointment_time: booking.appointment_time,
        },
      });

      return NextResponse.json(
        { success: false, error: "Failed to create booking." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, booking: data }, { status: 201 });
  } catch (error) {
    console.error("Unexpected booking creation error", error);
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 },
    );
  }
}
