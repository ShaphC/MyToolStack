import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { id, password } = await req.json();

  const { data, error } = await supabase
    .from("secrets")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Not found" });
  }

  // check expiration
  if (new Date(data.expires_at) < new Date()) {
    return NextResponse.json({ error: "Expired" });
  }

  const valid = await bcrypt.compare(password, data.password_hash);

  if (!valid) {
    return NextResponse.json({ error: "Wrong password" });
  }

  return NextResponse.json({
    content: data.content,
  });
}