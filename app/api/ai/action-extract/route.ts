import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const file = formData.get("file");

    if (!file) {
      return NextResponse.json(
        {
          error: "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    const aiRes = await fetch(
      `${process.env.NEXT_PUBLIC_AI_URL}/v1/action-extract`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
        },
        body: formData,
      }
    );

    const data = await aiRes.json();

    if (!aiRes.ok) {
      return NextResponse.json(
        {
          error:
            data.error ||
            "Action extraction failed",
        },
        {
          status: aiRes.status,
        }
      );
    }

    return NextResponse.json({
      transcript:
        data.transcript || "",
      tasks:
        Array.isArray(data.tasks)
          ? data.tasks
          : [],
    });
  } catch (error) {
    console.error(
      "Action Extract API Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error",
      },
      {
        status: 500,
      }
    );
  }
}