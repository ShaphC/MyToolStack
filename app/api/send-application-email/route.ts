import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, name, reason } = body;

    if (!email || !name || !reason) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    await resend.emails.send({
      from: "AppliStack <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL!,
      subject: "New Application Received",
      html: `
        <div style="font-family: Arial; padding: 10px;">
          <h2>New Application</h2>

          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Reason:</strong></p>
          <p>${reason}</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//   const { email, name, status } = await req.json();

//   const subject =
//     status === "approved"
//       ? "Your AppliStack application was approved 🎉"
//       : "Your AppliStack application update";

//   const message =
//     status === "approved"
//       ? `Hey ${name},

// Great news — your application has been approved.

// We’ll be in touch shortly with next steps.

// Welcome aboard 🚀`
//       : `Hey ${name},

// Thanks for applying.

// After reviewing your application, we’ve decided not to move forward at this time.

// We appreciate your interest.`;

//   // Send email using Resend (recommended)
//   const response = await fetch("https://api.resend.com/emails", {
//     method: "POST",
//     headers: {
//       "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       from: "AppliStack <onboarding@yourdomain.com>",
//       to: email,
//       subject,
//       text: message,
//     }),
//   });

//   const data = await response.json();

//   return NextResponse.json({ success: true, data });
// }