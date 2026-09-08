import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import {
  SVIX_ID_HEADER,
  SVIX_SIGNATURE_HEADER,
  SVIX_TIMESTAMP_HEADER,
  getResendWebhookSecret,
  isValidResendSignature,
} from '@/lib/resendWebhookSignature';

// Mail sent to kontakt@appcrates.pl lands in Resend's inbound store, which
// nobody watches. This forwards it to the mailbox that is actually read.
//
// The forwarded message is sent FROM the verified domain, never from the
// original sender — spoofing that address would fail SPF/DKIM and get the
// forward dropped. The original sender goes in Reply-To instead, so replying
// from Gmail reaches the person who wrote in.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const FORWARD_FROM = 'kontakt@appcrates.pl';

function asString(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** Extracts a bare address from "Name <a@b.c>" or a plain address. */
function extractAddress(value: unknown): string {
  const raw = Array.isArray(value) ? asString(value[0]) : asString(value);
  const angled = raw.match(/<([^>]+)>/);
  const candidate = (angled ? angled[1] : raw).trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate) ? candidate : '';
}

/** Header injection guard: display names must not carry quotes or newlines. */
function sanitizeDisplayName(value: string) {
  return value.replace(/[\r\n"<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
}

export async function POST(request: Request) {
  const secret = getResendWebhookSecret();
  if (!secret) {
    console.error('[inbound] RESEND_INBOUND_SECRET is not set; refusing to forward.');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  // Signature is computed over the exact bytes received, so read the raw body
  // before parsing.
  const rawBody = await request.text();

  const valid = isValidResendSignature(
    rawBody,
    {
      id: request.headers.get(SVIX_ID_HEADER),
      timestamp: request.headers.get(SVIX_TIMESTAMP_HEADER),
      signature: request.headers.get(SVIX_SIGNATURE_HEADER),
    },
    secret
  );

  if (!valid) {
    // Without this check the endpoint is an open relay.
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let payload: any;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Malformed payload' }, { status: 400 });
  }

  if (payload?.type !== 'email.received') {
    // Delivery/bounce events share this endpoint; acknowledge and ignore.
    return NextResponse.json({ ignored: payload?.type ?? 'unknown' }, { status: 200 });
  }

  const mailbox = process.env.EMAIL_USER;
  if (!mailbox) {
    console.error('[inbound] EMAIL_USER is not set; nowhere to forward to.');
    return NextResponse.json({ error: 'Not configured' }, { status: 500 });
  }

  const data = payload.data ?? {};

  // Resend's email.received payload is documented loosely and has changed
  // shape before, so the field names below are read defensively. This line
  // makes the actual shape visible in the function log the first time a real
  // message arrives — check it once, then it can go.
  console.log('[inbound] payload fields:', Object.keys(data).join(', '));

  const sender = extractAddress(data.from);
  const senderName = sanitizeDisplayName(
    asString(Array.isArray(data.from) ? data.from[0] : data.from).replace(/<[^>]*>/, '')
  );
  const subject = asString(data.subject) || '(no subject)';
  const html = asString(data.html);
  const text = asString(data.text);

  const label = senderName || sender || 'unknown sender';
  const originalTo = Array.isArray(data.to) ? data.to.join(', ') : asString(data.to);
  const provenance = `Forwarded from ${originalTo || FORWARD_FROM} · original sender: ${sender || 'unknown'}`;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: `${sanitizeDisplayName(label)} via AppCrates <${FORWARD_FROM}>`,
      to: mailbox,
      subject,
      // Only set Reply-To when the address parsed cleanly, so a malformed
      // header cannot redirect replies somewhere unintended.
      ...(sender ? { replyTo: sender } : {}),
      ...(html
        ? { html: `<p style="color:#888;font-size:12px">${provenance}</p><hr>${html}` }
        : { text: `${provenance}\n\n${text}` }),
    });

    if (result.error) {
      console.error('[inbound] Resend rejected the forward:', result.error);
      // 500 so Svix retries rather than dropping the message.
      return NextResponse.json({ error: result.error.message }, { status: 500 });
    }

    return NextResponse.json({ forwarded: true }, { status: 200 });
  } catch (error) {
    console.error('[inbound] Failed to forward:', error);
    return NextResponse.json({ error: 'Forwarding failed' }, { status: 500 });
  }
}
