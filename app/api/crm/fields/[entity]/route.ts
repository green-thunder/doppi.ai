import type { CustomEntity } from "@prisma/client";
import { getCurrentUser } from "@/lib/crm/auth";
import { listFields } from "@/lib/crm/data/custom-fields";

/** Map the URL segment to its Prisma CustomEntity. */
const ENTITY_MAP: Record<string, CustomEntity> = {
  contact: "CONTACT",
  company: "COMPANY",
  deal: "DEAL",
};

/**
 * GET /api/crm/fields/:entity — the org's custom field definitions for one
 * entity (contact|company|deal). Consumed by the form dialogs to render their
 * custom inputs. Org-scoped via the session user.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ entity: string }> },
) {
  const user = await getCurrentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { entity } = await params;
  const mapped = ENTITY_MAP[entity];
  if (!mapped) return new Response("Not found", { status: 404 });

  const defs = await listFields(user.orgId, mapped);
  return Response.json(defs);
}
