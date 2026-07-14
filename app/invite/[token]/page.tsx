import type { Metadata } from "next";
import Link from "next/link";
import { AlertCircle } from "lucide-react";
import { getInvitationByToken } from "@/lib/crm/data/invitations";
import { getT } from "@/lib/crm/i18n-server";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AcceptForm } from "./accept-form";

export const metadata: Metadata = { title: "Accept invitation" };

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const { tr } = await getT();
  const invite = await getInvitationByToken(token);

  if (!invite || invite.state !== "pending") {
    const reason =
      invite?.state === "expired"
        ? tr("Bu taklif muddati tugagan.", "This invitation has expired.")
        : invite?.state === "accepted"
          ? tr("Bu taklif allaqachon ishlatilgan.", "This invitation was already used.")
          : tr("Bu taklif yaroqsiz.", "This invitation link is invalid.");

    return (
      <Card className="flex flex-col items-center gap-4 p-8 text-center">
        <span className="grid size-12 place-items-center rounded-2xl border border-border bg-red-500/10 text-red-400">
          <AlertCircle className="size-6" />
        </span>
        <div>
          <h1 className="font-display text-xl font-semibold text-foreground">
            {tr("Taklif ochilmadi", "Can't open invitation")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">{reason}</p>
        </div>
        <Button asChild variant="secondary">
          <Link href="/login">{tr("Kirishga o'tish", "Go to sign in")}</Link>
        </Button>
      </Card>
    );
  }

  return (
    <AcceptForm
      token={token}
      email={invite.email}
      name={invite.name}
      orgName={invite.org.name}
    />
  );
}
