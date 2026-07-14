"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Bookmark, X } from "lucide-react";
import type { ViewEntity } from "@prisma/client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/crm/field";
import { toast } from "@/components/ui/sonner";
import { useCrmI18n } from "@/lib/crm/i18n-provider";
import type { Option } from "@/lib/crm/types";
import { cn } from "@/lib/utils";
import { createSavedViewAction, deleteSavedViewAction } from "@/app/crm/saved-view-actions";

export type FilterConfig = {
  key: string;
  label: string;
  options: Option[];
};

export type SavedViewChip = {
  id: string;
  name: string;
  filters: Record<string, string>;
};

const selectClass =
  "h-9 rounded-lg border border-border bg-card px-3 pr-8 text-sm text-foreground transition-colors focus-visible:outline-none focus-visible:border-gold-500/60 focus-visible:ring-2 focus-visible:ring-gold-500/20 cursor-pointer disabled:opacity-50";

/**
 * URL-query-driven filter bar for a list page. Each dropdown writes its value to
 * a query-string key (mirroring SearchInput), so server components read the
 * filters from `searchParams`. Also renders saved-view chips (apply / delete)
 * and a "Save view" dialog that persists the current filter set.
 */
export function FilterBar({
  entity,
  filters,
  views,
}: {
  entity: ViewEntity;
  filters: FilterConfig[];
  views: SavedViewChip[];
}) {
  const { t } = useCrmI18n();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = React.useTransition();

  const managedKeys = React.useMemo(() => filters.map((f) => f.key), [filters]);

  // The filter values currently active in the URL (only keys this bar owns).
  const active = React.useMemo(() => {
    const out: Record<string, string> = {};
    for (const key of managedKeys) {
      const v = searchParams.get(key);
      if (v) out[key] = v;
    }
    return out;
  }, [managedKeys, searchParams]);

  const hasActive = Object.keys(active).length > 0;

  const setParam = React.useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(Array.from(searchParams.entries()));
      if (value) params.set(key, value);
      else params.delete(key);
      params.delete("page");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router, searchParams],
  );

  const clearAll = React.useCallback(() => {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    for (const key of managedKeys) params.delete(key);
    params.delete("page");
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }, [managedKeys, pathname, router, searchParams]);

  const applyView = React.useCallback(
    (view: SavedViewChip) => {
      const qs = new URLSearchParams(view.filters).toString();
      router.push(qs ? `${pathname}?${qs}` : pathname);
    },
    [pathname, router],
  );

  const deleteView = React.useCallback(
    (id: string) => {
      const fd = new FormData();
      fd.set("id", id);
      fd.set("path", pathname);
      startTransition(async () => {
        await deleteSavedViewAction(fd);
      });
    },
    [pathname],
  );

  const isViewActive = React.useCallback(
    (view: SavedViewChip) => {
      const keys = new Set([...Object.keys(view.filters), ...Object.keys(active)]);
      for (const key of keys) {
        if ((view.filters[key] ?? "") !== (active[key] ?? "")) return false;
      }
      return keys.size > 0;
    },
    [active],
  );

  if (filters.length === 0 && views.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <select
            key={f.key}
            aria-label={f.label}
            value={active[f.key] ?? ""}
            onChange={(e) => setParam(f.key, e.target.value)}
            className={cn(selectClass, active[f.key] && "border-gold-500/60 text-foreground")}
          >
            <option value="">{f.label}</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}

        {hasActive && (
          <>
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
            >
              <X className="size-4" />
              {t.action.clear}
            </button>
            <SaveViewDialog
              entity={entity}
              filters={active}
              path={pathname}
            />
          </>
        )}
      </div>

      {views.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {views.map((view) => {
            const activeChip = isViewActive(view);
            return (
              <span
                key={view.id}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full border py-1 pl-3 pr-1 text-sm transition-colors",
                  activeChip
                    ? "border-gold-500/60 bg-gold-500/15 text-gold-300"
                    : "border-border bg-card text-muted-foreground hover:text-foreground",
                )}
              >
                <button
                  type="button"
                  onClick={() => applyView(view)}
                  className="font-medium"
                >
                  {view.name}
                </button>
                <button
                  type="button"
                  onClick={() => deleteView(view.id)}
                  disabled={pending}
                  aria-label={t.action.delete}
                  className="rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-foreground/[0.1] hover:text-foreground disabled:opacity-40"
                >
                  <X className="size-3.5" />
                </button>
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SaveViewDialog({
  entity,
  filters,
  path,
}: {
  entity: ViewEntity;
  filters: Record<string, string>;
  path: string;
}) {
  const { t, tr } = useCrmI18n();
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [pending, startTransition] = React.useTransition();

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const fd = new FormData();
    fd.set("entity", entity);
    fd.set("name", trimmed);
    fd.set("filters", JSON.stringify(filters));
    fd.set("path", path);
    startTransition(async () => {
      await createSavedViewAction(fd);
      toast.success(t.toast.saved);
      setName("");
      setOpen(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="secondary" size="sm">
          <Bookmark className="size-4" />
          {tr("Ko'rinishni saqlash", "Save view")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{tr("Ko'rinishni saqlash", "Save view")}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Field label={t.common.name} htmlFor="saved-view-name">
            <Input
              id="saved-view-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder={tr("Masalan: Mening ro'yxatim", "e.g. My list")}
              autoFocus
            />
          </Field>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                {t.action.cancel}
              </Button>
            </DialogClose>
            <Button type="button" onClick={submit} disabled={pending || !name.trim()}>
              {pending ? t.common.saving : t.action.save}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
