import { parseContact } from "../../lib/contact";

// Sends the portfolio contact form to Andrea's inbox through Resend.
// Env (Vercel, server-only):
//   RESEND_API_KEY  required
//   CONTACT_TO      defaults to info@andreaberrocal.com
//   CONTACT_FROM    defaults to "Portfolio <contact@andreaberrocal.com>";
//                   the domain must be verified in Resend.

const TO = process.env.CONTACT_TO ?? "info@andreaberrocal.com";
const FROM = process.env.CONTACT_FROM ?? "Portfolio <contact@andreaberrocal.com>";

function json(body: unknown, status: number) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  // Only accept posts from this site's own page.
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host || new URL(origin).host !== host) return json({ error: "Not allowed." }, 403);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Something went wrong. Try again?" }, 400);
  }

  // Honeypot: a hidden field people never fill in. Bots do; pretend it worked.
  if (typeof body === "object" && body !== null && (body as Record<string, unknown>).website) {
    return json({ ok: true }, 200);
  }

  const parsed = parseContact(body);
  if (!parsed.ok) return json({ error: parsed.error }, 400);
  const { name, email, message } = parsed.value;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("[contact] RESEND_API_KEY is not set");
    return json({ error: "The form isn't working right now." }, 503);
  }

  let res: Response;
  try {
    res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: FROM,
        to: [TO],
        reply_to: email,
        subject: `Portfolio message from ${name}`,
        text: `${message}\n\n${name}\n${email}`,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    console.error("[contact] Resend unreachable", error instanceof Error ? error.name : "unknown");
    return json({ error: "The form isn't working right now." }, 502);
  }

  if (!res.ok) {
    // Log Resend's reason (e.g. unverified domain), never the visitor's message.
    console.error("[contact] Resend failed", res.status, (await res.text()).slice(0, 300));
    return json({ error: "The form isn't working right now." }, 502);
  }
  return json({ ok: true }, 200);
}
