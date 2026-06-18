import { NextResponse } from "next/server";

type DemoRequest = {
  fullName?: string;
  email?: string;
  company?: string;
  phone?: string;
  role?: string;
  projectCategory?: string;
  projectValue?: string;
  message?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function POST(request: Request) {
  const body = (await request.json()) as DemoRequest;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL ?? "Pactora <onboarding@resend.dev>";
  const to = process.env.DEMO_REQUEST_EMAIL ?? process.env.RESEND_FROM_EMAIL;

  if (!body.email || !body.fullName) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  if (!apiKey || !to) {
    return NextResponse.json({ skipped: true, reason: "Demo request saved locally. Email notifications are not configured yet." });
  }

  const rows = [
    ["Name", body.fullName],
    ["Email", body.email],
    ["Company", body.company],
    ["Phone", body.phone],
    ["Role", body.role],
    ["Project category", body.projectCategory],
    ["Expected project value", body.projectValue],
    ["Notes", body.message]
  ];

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to: [to],
      subject: `New Pactora demo request from ${body.fullName}`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;line-height:1.6;color:#081A33">
          <p style="font-size:12px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;color:#635BFF">Pactora demo request</p>
          <h1 style="font-size:24px;margin:0 0 12px">New demo call request</h1>
          <table style="border-collapse:collapse;width:100%;max-width:640px">
            ${rows
              .map(([label, value]) => `
                <tr>
                  <td style="border:1px solid #E2E8F0;padding:10px;font-weight:800;background:#F7F8FC">${label}</td>
                  <td style="border:1px solid #E2E8F0;padding:10px">${escapeHtml(String(value ?? "Not provided"))}</td>
                </tr>
              `)
              .join("")}
          </table>
        </div>
      `
    })
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json({ error }, { status: response.status });
  }

  return NextResponse.json({ ok: true });
}
