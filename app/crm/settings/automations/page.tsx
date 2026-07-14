import { Plus, Zap } from "lucide-react";
import type { AutomationAction, AutomationTrigger } from "@prisma/client";
import { requireAdmin } from "@/lib/crm/auth";
import { getT } from "@/lib/crm/i18n-server";
import { listRules } from "@/lib/crm/data/automations";
import { getMemberOptions, getStageOptions } from "@/lib/crm/data/lookups";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import { EmptyState } from "@/components/crm/empty-state";
import { RuleDialog, type RuleValue } from "./rule-dialog";
import { RuleRowActions } from "./rule-row-actions";

type Tr = (uz: string, en: string) => string;

function triggerText(tr: Tr, trigger: AutomationTrigger): string {
  switch (trigger) {
    case "DEAL_STAGE_CHANGED":
      return tr("Bitim bosqichi o'zgarganda", "When a deal stage changes");
    case "DEAL_WON":
      return tr("Bitim yutilganda", "When a deal is won");
    case "DEAL_LOST":
      return tr("Bitim yo'qotilganda", "When a deal is lost");
    case "CONTACT_CREATED":
      return tr("Kontakt yaratilganda", "When a contact is created");
    case "WEBSITE_LEAD":
      return tr("Veb-saytdan lead kelganda", "When a website lead arrives");
  }
}

function actionText(tr: Tr, action: AutomationAction): string {
  switch (action) {
    case "CREATE_TASK":
      return tr("vazifa yaratiladi", "create a task");
    case "ASSIGN_OWNER":
      return tr("egasi tayinlanadi", "assign an owner");
    case "ADD_TAG":
      return tr("teg qo'shiladi", "add a tag");
  }
}

/** Read a string field from a rule's stored JSON config, or undefined. */
function readString(config: unknown, key: string): string | undefined {
  if (!config || typeof config !== "object" || Array.isArray(config)) return undefined;
  const v = (config as Record<string, unknown>)[key];
  return typeof v === "string" && v ? v : undefined;
}

export default async function AutomationsSettingsPage() {
  const user = await requireAdmin();
  const { tr } = await getT();

  const [rules, stageOptions, memberOptions] = await Promise.all([
    listRules(user.orgId),
    getStageOptions(user.orgId),
    getMemberOptions(user.orgId),
  ]);

  const addTrigger = (
    <Button size="sm">
      <Plus className="size-4" />
      {tr("Qoida qo'shish", "Add rule")}
    </Button>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-semibold text-foreground">
            {tr("Avtomatlashtirish qoidalari", "Automation rules")}
          </h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {tr(
              "Hodisa yuz berganda amallarni avtomatik bajaring",
              "Run actions automatically when an event happens",
            )}
          </p>
        </div>
        <RuleDialog
          mode="create"
          stageOptions={stageOptions}
          memberOptions={memberOptions}
          trigger={addTrigger}
        />
      </div>

      {rules.length === 0 ? (
        <Card>
          <EmptyState
            icon={<Zap className="size-5" />}
            title={tr("Hali qoidalar yo'q", "No rules yet")}
            description={tr(
              "Bitim yutilganda vazifa yaratish yoki yangi lead'ga egasini tayinlash kabi qoidalar qo'shing.",
              "Add rules like creating a task when a deal is won, or assigning an owner to new leads.",
            )}
            action={
              <RuleDialog
                mode="create"
                stageOptions={stageOptions}
                memberOptions={memberOptions}
                trigger={addTrigger}
              />
            }
          />
        </Card>
      ) : (
        <Card className="divide-y divide-border">
          {rules.map((rule) => {
            const value: RuleValue = {
              id: rule.id,
              name: rule.name,
              trigger: rule.trigger,
              action: rule.action,
              active: rule.active,
              stageId: readString(rule.triggerConfig, "stageId"),
              subject: readString(rule.actionConfig, "subject"),
              assigneeId: readString(rule.actionConfig, "assigneeId"),
              tag: readString(rule.actionConfig, "tag"),
            };

            return (
              <div
                key={rule.id}
                className="flex items-center justify-between gap-4 px-4 py-3.5"
              >
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium text-foreground">{rule.name}</span>
                    {rule.active ? (
                      <StatusPill tone="green">{tr("Faol", "Active")}</StatusPill>
                    ) : (
                      <StatusPill tone="gray">{tr("O'chirilgan", "Paused")}</StatusPill>
                    )}
                  </div>
                  <span className="truncate text-xs text-muted-foreground">
                    {triggerText(tr, rule.trigger)} → {actionText(tr, rule.action)}
                  </span>
                </div>
                <RuleRowActions
                  rule={value}
                  stageOptions={stageOptions}
                  memberOptions={memberOptions}
                />
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
}
