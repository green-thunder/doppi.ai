import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/crm/db";
import { runAutomations } from "@/lib/crm/data/automations";

// Public endpoint the marketing site's contact form posts to. Each submission
// becomes a WEBSITE-sourced Contact (+ an OPEN Deal in the first pipeline stage)
// inside the Do'ppi.ai org (configurable via LEADS_ORG_SLUG).
const LEADS_ORG_SLUG = process.env.LEADS_ORG_SLUG || "doppi";

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

  const org = await db.organization.findUnique({
    where: { slug: LEADS_ORG_SLUG },
    select: { id: true },
  });
  // If the CRM tenant isn't provisioned, don't break the landing page.
  if (!org) {
    return NextResponse.json({ ok: true, stored: false });
  }

  const [firstName, ...rest] = name.trim().split(/\s+/);
  const lastName = rest.join(" ") || null;

  // Attach to a company (by name) when a business was given.
  let companyId: string | null = null;
  if (business) {
    const existing = await db.company.findFirst({
      where: { orgId: org.id, name: { equals: business, mode: "insensitive" } },
      select: { id: true },
    });
    companyId =
      existing?.id ??
      (await db.company.create({ data: { orgId: org.id, name: business } })).id;
  }

  const contact = await db.contact.create({
    data: {
      orgId: org.id,
      firstName,
      lastName,
      email: email || null,
      phone,
      source: "WEBSITE",
      notes: message || null,
      companyId,
    },
  });

  // Drop an OPEN deal into the first stage so the lead surfaces in the pipeline.
  const firstStage = await db.stage.findFirst({
    where: { orgId: org.id },
    orderBy: { order: "asc" },
    select: { id: true },
  });
  let dealId: string | null = null;
  if (firstStage) {
    const deal = await db.deal.create({
      data: {
        orgId: org.id,
        title: `${business || name} — website lead`,
        amount: 0,
        currency: "UZS",
        status: "OPEN",
        stageId: firstStage.id,
        contactId: contact.id,
        companyId,
      },
    });
    dealId = deal.id;
  }

  await runAutomations(org.id, "WEBSITE_LEAD", {
    contactId: contact.id,
    dealId: dealId ?? undefined,
    companyId: companyId ?? undefined,
  });

  revalidatePath("/crm/contacts");
  revalidatePath("/crm/deals");
  revalidatePath("/crm");

  return NextResponse.json({ ok: true, stored: true });
}
