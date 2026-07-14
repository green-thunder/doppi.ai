import "server-only";

// Optional transactional email via Resend's REST API (no SDK dependency). If
// RESEND_API_KEY isn't set, sending is a no-op and the caller falls back to
// sharing the invite link manually.

type SendResult = { sent: boolean; error?: string };

export async function sendInviteEmail(opts: {
  to: string;
  inviterName: string;
  orgName: string;
  acceptUrl: string;
}): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false };

  const from = process.env.RESEND_FROM || "Do'ppi CRM <onboarding@resend.dev>";
  const html = `
    <div style="font-family:system-ui,sans-serif;max-width:520px;margin:0 auto;padding:24px">
      <h2 style="color:#111">${opts.orgName} — Do'ppi CRM</h2>
      <p>${opts.inviterName} sizni <b>${opts.orgName}</b> jamoasiga taklif qildi.</p>
      <p>${opts.inviterName} invited you to join the <b>${opts.orgName}</b> workspace on Do'ppi CRM.</p>
      <p style="margin:28px 0">
        <a href="${opts.acceptUrl}" style="background:#E6A92C;color:#0A0A0B;padding:12px 22px;border-radius:9999px;text-decoration:none;font-weight:600">
          Taklifni qabul qilish / Accept invitation
        </a>
      </p>
      <p style="color:#666;font-size:13px">Havola 7 kun amal qiladi. / This link expires in 7 days.</p>
      <p style="color:#999;font-size:12px;word-break:break-all">${opts.acceptUrl}</p>
    </div>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: opts.to,
        subject: `${opts.orgName} — Do'ppi CRM taklifi / invitation`,
        html,
      }),
    });
    if (!res.ok) return { sent: false, error: `resend_${res.status}` };
    return { sent: true };
  } catch (e) {
    return { sent: false, error: e instanceof Error ? e.message : "send_failed" };
  }
}
