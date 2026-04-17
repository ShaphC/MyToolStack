import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { content, password, expiresInHours } = await req.json();

  const hash = await bcrypt.hash(password, 10);

  const expires_at = new Date(
    Date.now() + expiresInHours * 60 * 60 * 1000
  );

  const { data, error } = await supabase
    .from("secrets")
    .insert([
      {
        content,
        password_hash: hash,
        expires_at,
      },
    ])
    .select()
    .single();

  if (error) return NextResponse.json({ error });

  return NextResponse.json({
    id: data.id,
  });
}