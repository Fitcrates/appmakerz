import { createHmac, timingSafeEqual } from 'node:crypto';

// Resend signs webhooks with Svix. Rather than pull in the svix SDK for one
// endpoint, this reimplements the documented scheme: HMAC-SHA256 over
// "<id>.<timestamp>.<body>", keyed by the base64 secret that follows the
// "whsec_" prefix.
export const SVIX_ID_HEADER = 'svix-id';
export const SVIX_TIMESTAMP_HEADER = 'svix-timestamp';
export const SVIX_SIGNATURE_HEADER = 'svix-signature';

const TOLERANCE_SECONDS = 5 * 60;

export function getResendWebhookSecret() {
  const value = process.env.RESEND_INBOUND_SECRET;
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isValidResendSignature(
  body: string,
  headers: {
    id: string | null;
    timestamp: string | null;
    signature: string | null;
  },
  secret: string,
  now: number = Date.now()
): boolean {
  const { id, timestamp, signature } = headers;

  if (!id || !timestamp || !signature) {
    return false;
  }

  // Without this an intercepted request stays valid forever.
  const sentAt = Number.parseInt(timestamp, 10);
  if (!Number.isFinite(sentAt)) {
    return false;
  }
  if (Math.abs(Math.floor(now / 1000) - sentAt) > TOLERANCE_SECONDS) {
    return false;
  }

  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  if (key.length === 0) {
    return false;
  }

  const expected = createHmac('sha256', key)
    .update(`${id}.${timestamp}.${body}`)
    .digest('base64');

  // The header carries a space-separated list so secrets can be rotated without
  // downtime; any one match is enough.
  return signature
    .split(' ')
    .map((entry) => entry.split(',', 2))
    .filter(([version]) => version === 'v1')
    .some(([, candidate]) => Boolean(candidate) && safeEqual(candidate, expected));
}
