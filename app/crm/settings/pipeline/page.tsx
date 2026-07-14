import { Plus } from "lucide-react";
import { requireAdmin } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { listStages } from "@/lib/crm/data/stages";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { StageDialog } from "../stage-dialog";
import { StageRowActions } from "../stage-row-actions";

export default async function PipelineSettingsPage() {
  const user = await requireAdmin();
  const { tr } = await getT();
  const stages = await listStages(user.orgId);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-foreground">
            {tr("Voronka bosqichlari", "Pipeline stages")}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {tr(
              "Bitimlar shu bosqichlar bo'ylab harakatlanadi",
              "Deals move through these stages",
            )}
          </p>
        </div>
        <StageDialog
          mode="create"
          trigger={
            <Button size="sm">
              <Plus className="size-4" />
              {tr("Bosqich qo'shish", "Add stage")}
            </Button>
          }
        />
      </div>

      <Card className="divide-y divide-border">
        {stages.map((stage, i) => (
          <div key={stage.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
            <div className="flex min-w-0 items-center gap-3">
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: stage.color }}
              />
              <span className="truncate font-medium text-foreground">{stage.name}</span>
              {stage.isWon && <StatusPill tone="green">{tr("G'alaba", "Won")}</StatusPill>}
              {stage.isLost && <StatusPill tone="red">{tr("Yo'qotish", "Lost")}</StatusPill>}
              <span className="text-xs text-muted-foreground">
                {tr(`${stage._count.deals} ta bitim`, `${stage._count.deals} deals`)}
              </span>
            </div>
            <StageRowActions
              stage={{
                id: stage.id,
                name: stage.name,
                color: stage.color,
                isWon: stage.isWon,
                isLost: stage.isLost,
                dealCount: stage._count.deals,
              }}
              isFirst={i === 0}
              isLast={i === stages.length - 1}
            />
          </div>
        ))}
      </Card>
    </div>
  );
}
