import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY
);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const result = await resend.emails.send({
      from: "AppliStack <onboarding@resend.dev>",
      to: email,
      subject: "Welcome 🎉",
      html: `
        <h1>Welcome to AppliStack</h1>
        <p>Thanks for joining.</p>
      `,
    });

    console.log(result);

    return Response.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      { error },
      { status: 500 }
    );
  }
}