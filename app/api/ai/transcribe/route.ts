import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // send to your AI server
    const form = new FormData();
    form.append("file", file);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AI_URL}/v1/transcribe`,
      {
        method: "POST",
        body: form,
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Transcription failed" },
      { status: 500 }
    );
  }
}