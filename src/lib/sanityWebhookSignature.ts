import { createHmac, timingSafeEqual } from 'node:crypto';

export const SANITY_SIGNATURE_HEADER_NAME = 'sanity-webhook-signature';

const SIGNATURE_HEADER_REGEX = /^t=(\d+)[, ]+v1=([^, ]+)$/;
const MINIMUM_TIMESTAMP = 1609459200000;
const WEBHOOK_SECRET_ENV_NAMES = [
  'SANITY_WEBHOOK_SECRET',
  'SANITY_REVALIDATE_SECRET',
  'SANITY_WEBHOOK_SIGNING_SECRET',
];

export function getSanityWebhookSecret() {
  for (const name of WEBHOOK_SECRET_ENV_NAMES) {
    const value = process.env[name];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }

  return undefined;
}

function base64UrlDigest(value: Buffer) {
  return value
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function safeStringEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

export function isValidSanitySignature(
  body: string,
  signatureHeader: string | null | undefined,
  secret: string | null | undefined,
) {
  if (!body || !signatureHeader || !secret) return false;

  const [, timestampValue, receivedSignature] = signatureHeader.trim().match(SIGNATURE_HEADER_REGEX) || [];
  const timestamp = Number(timestampValue);

  if (!timestampValue || !receivedSignature || !Number.isFinite(timestamp) || timestamp < MINIMUM_TIMESTAMP) {
    return false;
  }

  const payload = `${timestamp}.${body}`;
  const digest = createHmac('sha256', secret).update(payload).digest();
  const expectedBase64Url = base64UrlDigest(digest);
  const expectedHex = digest.toString('hex');

  return (
    safeStringEqual(receivedSignature, expectedBase64Url) ||
    safeStringEqual(receivedSignature, expectedHex)
  );
}
