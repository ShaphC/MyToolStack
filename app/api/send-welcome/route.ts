import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    await resend.emails.send({
      from: "Your App <onboarding@resend.dev>",
      to: email,
      subject: "Welcome 🎉",
      html: `
        <h1>Welcome to your tools</h1>
        <p>You now have access to all your apps.</p>
      `,
    });

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error });
  }
}