import { NextResponse } from "next/server";
import { writingPresets } from "@/app/lib/write-now/presets";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      mode,
      thoughts,
      preset,
      selectedIdea,
      draft,
    } = body;

    const selectedPreset =
      preset &&
      writingPresets[
        preset as keyof typeof writingPresets
      ];

    let prompt = "";

    // -------------------------
    // MODE 1: IDEAS
    // -------------------------
    if (mode === "ideas") {
      prompt = `
You are a world-class writing coach.

Analyze the user's thoughts.

Return 3 high-quality writing directions.

Focus on:
- emotional tension
- interesting angles
- storytelling hooks
- contrarian insights

Return ONLY valid JSON:

{
  "ideas": [
    "idea 1",
    "idea 2",
    "idea 3"
  ]
}

USER THOUGHTS:
${thoughts}
      `;
    }

    // -------------------------
    // MODE 2: DRAFT
    // -------------------------
    if (mode === "draft") {
      prompt = `
${selectedPreset?.system || ""}

Write a full piece using this idea:

${selectedIdea}

User thoughts:
${thoughts}
      `;
    }

    // -------------------------
    // MODE 3: REWRITE
    // -------------------------
    if (mode === "rewrite") {
      prompt = `
You are a professional editor.

Rewrite the following text according to these rules:

${selectedPreset?.system || ""}

TEXT:
${draft}

Make it clearer, stronger, and more structured.
      `;
    }

    // -------------------------
    // MODE 4: EXPAND
    // -------------------------
    if (mode === "expand") {
      prompt = `
You are a writing assistant.

Expand this writing into a more detailed version.

Keep the same voice and structure.

TEXT:
${draft}
      `;
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AI_URL}/v1/chat`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: prompt,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Write-Now failed" },
      { status: 500 }
    );
  }
}