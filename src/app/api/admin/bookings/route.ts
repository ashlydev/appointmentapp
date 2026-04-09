import { NextResponse } from "next/server";

import { getSupabaseServerClient } from "@/lib/supabase-server";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch admin bookings from Supabase", error);
      return NextResponse.json(
        { error: "Failed to fetch bookings." },
        { status: 500 },
      );
    }

    return NextResponse.json({ bookings: data ?? [] }, { status: 200 });
  } catch (error) {
    console.error("Unexpected admin bookings fetch error", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
