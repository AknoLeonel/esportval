import { NextResponse } from "next/server";
import { contactSchema, fieldErrors } from "@/lib/contact-schema";
import { reportError, trackEvent } from "@/lib/observability";

const MAX_BODY_BYTES = 10_000;
const WEBHOOK_TIMEOUT_MS = 8_000;

/**
 * Recebe a inscrição e repassa para CONTACT_WEBHOOK_URL (Zapier, Make, Slack, planilha, CRM…).
 * Sem webhook configurado devolvemos 503 em vez de "fingir" que o lead foi guardado.
 */
export async function POST(request: Request) {
  const declared = Number(request.headers.get("content-length") ?? 0);
  if (declared > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, code: "too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, code: "invalid_json" }, { status: 400 });
  }

  // Honeypot preenchido = robô. Responde sucesso para não dar pista, mas descarta.
  if (typeof body === "object" && body !== null && "website" in body && body.website) {
    return NextResponse.json({ ok: true });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, errors: fieldErrors(parsed.error) }, { status: 422 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    reportError(new Error("CONTACT_WEBHOOK_URL não configurada: inscrição não pôde ser entregue"), {
      route: "/api/contato",
    });
    return NextResponse.json({ ok: false, code: "not_configured" }, { status: 503 });
  }

  const { website: _honeypot, consent: _consent, ...lead } = parsed.data;
  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: `Nova inscrição Esportval: ${lead.name} (${lead.category}) — ${lead.email} / ${lead.phone}`,
        lead,
        receivedAt: new Date().toISOString(),
      }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`Webhook respondeu HTTP ${response.status}`);
  } catch (failure) {
    reportError(failure, { route: "/api/contato", stage: "webhook" });
    return NextResponse.json({ ok: false, code: "delivery_failed" }, { status: 502 });
  }

  trackEvent("contact_delivered", { category: lead.category });
  return NextResponse.json({ ok: true });
}
