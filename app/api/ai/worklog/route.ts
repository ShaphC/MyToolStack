import { NextRequest } from "next/server";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AI_URL}/v1/chat`,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          message: `
You are an AI work documentation assistant.

Convert the user's raw notes into structured JSON.

Rules:
- Improve clarity
- Make writing professional
- Extract locations
- Extract equipment
- Extract tasks
- Extract clients

Return ONLY valid JSON.

{
  "refinedText": "",
  "locations": [],
  "equipment": [],
  "clients": [],
  "tasks": []
}

USER INPUT:
${body.message}
          `,
        }),
      }
    );

    const data =
      await response.json();

    return Response.json(data);
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        error: "Failed",
      },
      {
        status: 500,
      }
    );
  }
}