import * as React from "react";
import Link from "next/link";
import { DoppiMark } from "@/components/brand";
import { Card } from "@/components/ui/card";

/** Shared frame for the login / register cards. */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center">
      <Link href="/" className="mb-6 flex items-center gap-2.5">
        <DoppiMark className="h-8 w-11 text-gold-400" />
        <span className="font-display text-xl font-bold tracking-tight text-foreground">
          Do&apos;ppi<span className="text-gold-400"> CRM</span>
        </span>
      </Link>
      <Card className="w-full p-6 sm:p-8">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && <p className="mt-1.5 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {children}
      </Card>
      {footer && <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}

export function AuthError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
      {message}
    </div>
  );
}
