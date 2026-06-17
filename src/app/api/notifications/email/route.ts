import { NextResponse } from "next/server";

type EmailRequest = {
  to?: string[];
  subject?: string;
  html?: string;
};

export async function POST(request: Request) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "Pactora <onboarding@resend.dev>";

  if (!apiKey) {
    return NextResponse.json({ skipped: true, reason: "RESEND_API_KEY is not configured." });
  }

  const body = (await request.json()) as EmailRequest;
  const recipients = (body.to ?? []).filter(Boolean);

  if (!recipients.length || !body.subject || !body.html) {
    return NextResponse.json({ error: "Missing email recipient, subject, or content." }, { status: 400 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: recipients,
      subject: body.subject,
      html: body.html
    })
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: response.status });
  }

  return NextResponse.json(await response.json());
}
