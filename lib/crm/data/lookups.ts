import "server-only";
import { db } from "../db";
import { fullName } from "../format";
import type { Option } from "../types";

/** Active members of an org (for assignment pickers). */
export async function getMembers(orgId: string) {
  return db.user.findMany({
    where: { orgId, active: true },
    select: { id: true, name: true, email: true, role: true, avatarColor: true },
    orderBy: { name: "asc" },
  });
}

export async function getMemberOptions(orgId: string): Promise<Option[]> {
  const members = await getMembers(orgId);
  return members.map((m) => ({ value: m.id, label: m.name }));
}

export async function getCompanyOptions(orgId: string): Promise<Option[]> {
  const rows = await db.company.findMany({
    where: { orgId },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
  return rows.map((c) => ({ value: c.id, label: c.name }));
}

export async function getContactOptions(orgId: string): Promise<Option[]> {
  const rows = await db.contact.findMany({
    where: { orgId },
    select: { id: true, firstName: true, lastName: true },
    orderBy: [{ firstName: "asc" }, { lastName: "asc" }],
  });
  return rows.map((c) => ({ value: c.id, label: fullName(c.firstName, c.lastName) }));
}

/** Pipeline stages ordered by column position. */
export async function getStages(orgId: string) {
  return db.stage.findMany({ where: { orgId }, orderBy: { order: "asc" } });
}

export async function getStageOptions(orgId: string): Promise<Option[]> {
  const stages = await getStages(orgId);
  return stages.map((s) => ({ value: s.id, label: s.name }));
}
