// Validation for the contact form, shared by the page and /api/contact.

export type ContactMessage = { name: string; email: string; message: string };

export const LIMITS = { name: 120, email: 254, message: 5000 } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns the cleaned message, or an error to show the visitor. */
export function parseContact(input: unknown): { ok: true; value: ContactMessage } | { ok: false; error: string } {
  if (typeof input !== "object" || input === null) return { ok: false, error: "Something went wrong. Try again?" };
  const raw = input as Record<string, unknown>;
  const name = typeof raw.name === "string" ? raw.name.trim() : "";
  const email = typeof raw.email === "string" ? raw.email.trim() : "";
  const message = typeof raw.message === "string" ? raw.message.trim() : "";

  if (!name) return { ok: false, error: "Add your name." };
  if (!EMAIL.test(email)) return { ok: false, error: "That email doesn't look right." };
  if (!message) return { ok: false, error: "Add a message." };
  if (name.length > LIMITS.name || email.length > LIMITS.email || message.length > LIMITS.message) {
    return { ok: false, error: "That's a bit long. Mind trimming it?" };
  }
  // Header injection guard: names and emails go into email headers.
  if (/[\r\n]/.test(name) || /[\r\n]/.test(email)) return { ok: false, error: "That email doesn't look right." };

  return { ok: true, value: { name, email, message } };
}
