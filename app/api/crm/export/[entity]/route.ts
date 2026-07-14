import { requireUser } from "@/lib/crm/auth";
import { db } from "@/lib/crm/db";
import { fullName } from "@/lib/crm/format";
import { toCsv, type CsvColumn } from "@/lib/crm/csv";

/** ISO string for a date, or "" when absent. */
function isoDate(value: Date | null | undefined): string {
  return value ? value.toISOString() : "";
}

/**
 * GET /api/crm/export/:entity — stream an org-scoped CSV of contacts, companies
 * or deals. The leading UTF-8 BOM makes Excel read Cyrillic content correctly.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ entity: string }> },
) {
  const user = await requireUser();
  const { entity } = await params;

  let rows: Record<string, unknown>[];
  let columns: CsvColumn[];

  if (entity === "contacts") {
    const contacts = await db.contact.findMany({
      where: { orgId: user.orgId },
      include: {
        company: { select: { name: true } },
        owner: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    columns = [
      { key: "firstName", header: "firstName" },
      { key: "lastName", header: "lastName" },
      { key: "email", header: "email" },
      { key: "phone", header: "phone" },
      { key: "position", header: "position" },
      { key: "company", header: "company" },
      { key: "source", header: "source" },
      { key: "tags", header: "tags" },
      { key: "owner", header: "owner" },
      { key: "createdAt", header: "createdAt" },
    ];
    rows = contacts.map((c) => ({
      firstName: c.firstName,
      lastName: c.lastName ?? "",
      email: c.email ?? "",
      phone: c.phone ?? "",
      position: c.position ?? "",
      company: c.company?.name ?? "",
      source: c.source,
      tags: c.tags.join("; "),
      owner: c.owner?.name ?? "",
      createdAt: isoDate(c.createdAt),
    }));
  } else if (entity === "companies") {
    const companies = await db.company.findMany({
      where: { orgId: user.orgId },
      include: { owner: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    columns = [
      { key: "name", header: "name" },
      { key: "website", header: "website" },
      { key: "industry", header: "industry" },
      { key: "phone", header: "phone" },
      { key: "email", header: "email" },
      { key: "address", header: "address" },
      { key: "owner", header: "owner" },
      { key: "createdAt", header: "createdAt" },
    ];
    rows = companies.map((c) => ({
      name: c.name,
      website: c.website ?? "",
      industry: c.industry ?? "",
      phone: c.phone ?? "",
      email: c.email ?? "",
      address: c.address ?? "",
      owner: c.owner?.name ?? "",
      createdAt: isoDate(c.createdAt),
    }));
  } else if (entity === "deals") {
    const deals = await db.deal.findMany({
      where: { orgId: user.orgId },
      include: {
        stage: { select: { name: true } },
        contact: { select: { firstName: true, lastName: true } },
        company: { select: { name: true } },
        owner: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    columns = [
      { key: "title", header: "title" },
      { key: "amount", header: "amount" },
      { key: "currency", header: "currency" },
      { key: "status", header: "status" },
      { key: "stage", header: "stage" },
      { key: "contact", header: "contact" },
      { key: "company", header: "company" },
      { key: "owner", header: "owner" },
      { key: "expectedCloseDate", header: "expectedCloseDate" },
      { key: "createdAt", header: "createdAt" },
    ];
    rows = deals.map((d) => ({
      title: d.title,
      amount: d.amount,
      currency: d.currency,
      status: d.status,
      stage: d.stage.name,
      contact: d.contact ? fullName(d.contact.firstName, d.contact.lastName) : "",
      company: d.company?.name ?? "",
      owner: d.owner?.name ?? "",
      expectedCloseDate: isoDate(d.expectedCloseDate),
      createdAt: isoDate(d.createdAt),
    }));
  } else {
    return new Response("Not found", { status: 404 });
  }

  const csv = toCsv(rows, columns);
  return new Response("﻿" + csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${entity}.csv"`,
    },
  });
}
