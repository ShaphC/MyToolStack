import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { name, email, reason } = body;

    const { error } = await supabase
      .from("applications")
      .insert([
        {
          name,
          email,
          reason,
        },
      ]);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}