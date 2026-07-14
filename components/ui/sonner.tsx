"use client";

import { Toaster as Sonner } from "sonner";

/** Brand-styled toast host. Mounted once in the CRM layout. */
export function Toaster() {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        classNames: {
          toast:
            "!bg-card !border !border-border !text-foreground !rounded-xl !shadow-card !font-sans",
          title: "!font-medium",
          description: "!text-muted-foreground",
          actionButton: "!bg-gold-500 !text-[#0A0A0B] !rounded-lg",
          cancelButton: "!bg-muted !text-foreground !rounded-lg",
          error: "!text-red-400",
          success: "!text-emerald-400",
        },
      }}
    />
  );
}

export { toast } from "sonner";
