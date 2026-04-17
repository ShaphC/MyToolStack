// /app/api/random/route.ts

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const length = Number(searchParams.get("length")) || 6;

  const MIN = 4;
  const MAX = 8;

  const safeLength = Math.min(Math.max(length, MIN), MAX);

  const min = Math.pow(10, safeLength - 1);
  const max = Math.pow(10, safeLength) - 1;

  const number = Math.floor(Math.random() * (max - min + 1)) + min;

  return Response.json({ number, length: safeLength });
}