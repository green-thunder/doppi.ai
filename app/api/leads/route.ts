import { NextResponse } from "next/server";
import { z } from "zod";

// Public endpoint the marketing site's contact form posts to. Leads used to be
// written straight into the CRM database; the CRM now lives in its own project,
// so this route validates the submission and logs it. Plug an email/Telegram/
// webhook notifier in where the console.info is.
const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(3).max(40),
  email: z.string().trim().max(160).optional().or(z.literal("")),
  business: z.string().trim().max(160).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Validation failed" }, { status: 400 });
  }

  const { name, phone, email, business, message } = parsed.data;

  console.info("[api/leads] new website lead", {
    name,
    phone,
    email: email || null,
    business: business || null,
    message: message || null,
    at: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, stored: false });
}
