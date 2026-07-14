"use server";

import { revalidatePath } from "next/cache";
import type { ViewEntity } from "@prisma/client";
import { requireUser } from "@/lib/crm/auth";
import { createView, deleteView } from "@/lib/crm/data/saved-views";
import { requiredString } from "@/lib/crm/forms";

const VIEW_ENTITIES: ViewEntity[] = ["CONTACT", "COMPANY", "DEAL", "ACTIVITY"];

function parseEntity(v: string): ViewEntity | null {
  return (VIEW_ENTITIES as string[]).includes(v) ? (v as ViewEntity) : null;
}

/** Fallback to a safe in-app path so revalidatePath never gets a bad value. */
function safePath(v: string): string {
  return v.startsWith("/crm") ? v : "/crm";
}

/**
 * Create a private saved view for the current user from a serialized filter set.
 * Called from the client via useTransition (plain void action).
 */
export async function createSavedViewAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const entity = parseEntity(requiredString(formData.get("entity")));
  const name = requiredString(formData.get("name"));
  const path = safePath(requiredString(formData.get("path")));
  if (!entity || !name) return;

  const filters: Record<string, string> = {};
  const raw = requiredString(formData.get("filters"));
  if (raw) {
    try {
      const parsed: unknown = JSON.parse(raw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [key, value] of Object.entries(parsed as Record<string, unknown>)) {
          if (typeof value === "string" && value) filters[key] = value;
        }
      }
    } catch {
      // Malformed filter payload — save an empty (show-all) view instead of failing.
    }
  }

  await createView(user.orgId, user.id, entity, name, filters);
  revalidatePath(path);
}

export async function deleteSavedViewAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const id = requiredString(formData.get("id"));
  const path = safePath(requiredString(formData.get("path")));
  if (!id) return;

  await deleteView(user.orgId, id);
  revalidatePath(path);
}
