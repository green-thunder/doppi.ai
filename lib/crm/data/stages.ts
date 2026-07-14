import "server-only";
import { z } from "zod";
import { db } from "../db";

export const stageSchema = z.object({
  name: z.string().trim().min(1, "Nom majburiy / Name required").max(60),
  color: z.string().trim().min(1).max(20).catch("#E6A92C"),
  isWon: z.boolean().catch(false),
  isLost: z.boolean().catch(false),
});

export type StageInput = z.infer<typeof stageSchema>;

/** Thrown by deleteStage when the stage still has deals attached. */
export class StageHasDealsError extends Error {
  constructor() {
    super("STAGE_HAS_DEALS");
    this.name = "StageHasDealsError";
  }
}

/** Pipeline stages ordered by column position, each with its deal count. */
export async function listStages(orgId: string) {
  return db.stage.findMany({
    where: { orgId },
    orderBy: { order: "asc" },
    include: { _count: { select: { deals: true } } },
  });
}

export async function getStage(orgId: string, id: string) {
  return db.stage.findFirst({ where: { id, orgId } });
}

export async function createStage(orgId: string, input: StageInput) {
  const last = await db.stage.findFirst({
    where: { orgId },
    orderBy: { order: "desc" },
    select: { order: true },
  });
  const nextOrder = (last?.order ?? -1) + 1;
  return db.stage.create({
    data: {
      orgId,
      name: input.name,
      color: input.color,
      isWon: input.isWon,
      isLost: input.isLost,
      order: nextOrder,
    },
  });
}

export async function updateStage(orgId: string, id: string, input: StageInput) {
  const result = await db.stage.updateMany({
    where: { id, orgId },
    data: {
      name: input.name,
      color: input.color,
      isWon: input.isWon,
      isLost: input.isLost,
    },
  });
  return result.count > 0;
}

/**
 * Delete a stage. Refuses (throws {@link StageHasDealsError}) when the stage
 * still has deals — the caller surfaces a friendly message. Returns whether a
 * row was actually deleted.
 */
export async function deleteStage(orgId: string, id: string): Promise<boolean> {
  const stage = await db.stage.findFirst({
    where: { id, orgId },
    select: { id: true, _count: { select: { deals: true } } },
  });
  if (!stage) return false;
  if (stage._count.deals > 0) throw new StageHasDealsError();

  const result = await db.stage.deleteMany({ where: { id, orgId } });
  return result.count > 0;
}

/**
 * Move a stage up or down by swapping its `order` with the adjacent stage.
 * No-op (returns false) when already at the boundary. Wrapped in a transaction
 * so the two rows never collide on the same order.
 */
export async function moveStage(
  orgId: string,
  id: string,
  dir: "up" | "down",
): Promise<boolean> {
  const current = await db.stage.findFirst({
    where: { id, orgId },
    select: { id: true, order: true },
  });
  if (!current) return false;

  const neighbor = await db.stage.findFirst({
    where:
      dir === "up"
        ? { orgId, order: { lt: current.order } }
        : { orgId, order: { gt: current.order } },
    orderBy: { order: dir === "up" ? "desc" : "asc" },
    select: { id: true, order: true },
  });
  if (!neighbor) return false;

  await db.$transaction([
    db.stage.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    db.stage.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);
  return true;
}
