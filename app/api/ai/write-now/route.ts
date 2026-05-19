import { NextResponse } from "next/server";

import { writingPresets } from "@/app/lib/write-now/presets";

export async function POST(
  req: Request
) {
  try {
    const body = await req.json();

    const {
      thoughts,
      preset,
      mode,
      selectedIdea,
    } = body;

    const selectedPreset =
      writingPresets[
        preset as keyof typeof writingPresets
      ];

    if (!selectedPreset) {
      return NextResponse.json(
        {
          error:
            "Invalid preset",
        },
        { status: 400 }
      );
    }

    let prompt = "";

    // IDEA GENERATION

    if (mode === "ideas") {
      prompt = `
You are an elite writing coach.

Analyze the user's thoughts.

Find:
- themes
- tensions
- insights
- interesting angles

Return ONLY valid JSON:

{
  "ideas": [
    "idea 1",
    "idea 2",
    "idea 3"
  ]
}

USER INPUT:
${thoughts}
      `;
    }

    // DRAFT GENERATION

    if (mode === "draft") {
      prompt = `
${selectedPreset.system}

Topic:
${selectedIdea}

User Thoughts:
${thoughts}
      `;
    }

    const response = await fetch(
      "{http://127.0.0.1:3001}/v1/chat",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          message: prompt,
        }),
      }
    );

    const data =
      await response.json();

    return NextResponse.json(
      data
    );
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Something went wrong",
      },
      { status: 500 }
    );
  }
}