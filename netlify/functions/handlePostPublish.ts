import type { Handler } from '@netlify/functions';
import { Resend } from 'resend';
import { getNewsletterTemplate } from '../../src/utils/emailTemplates';
import {
  getSanityWebhookSecret,
  isValidSanitySignature,
  SANITY_SIGNATURE_HEADER_NAME,
} from '../../src/lib/sanityWebhookSignature';
import {
  getSanityWriteClient,
  getSiteUrl,
  jsonResponse,
  normalizeEmail,
  parseJsonBody,
} from './_shared';

// ─── Constants ───────────────────────────────────────────────────────────────

const RESEND_RATE_LIMIT_DELAY_MS = 600; // Resend free tier: ~2 req/s

// ─── Types ───────────────────────────────────────────────────────────────────

type PublishPayload = {
  _id?: string;
  _type?: string;
  documentId?: string;
  isTest?: boolean;
  slug?: string | { current?: string };
  ids?: {
    created?: string[];
    updated?: string[];
  };
  document?: { _id?: string; _type?: string };
  result?: { _id?: string; _type?: string };
};

type PostRecord = {
  _id: string;
  _type: 'post';
  _rev: string;
  title?: string | { en?: string; pl?: string };
  slug?: string;
  categories?: Array<string | { titleEn?: string; titlePl?: string; slug?: string }>;
  emailsSent?: boolean;
  publishedAt?: string;
  seo?: { noIndex?: boolean };
};

type SubscriberRecord = {
  email: string;
  subscribedCategories?: string[];
  unsubscribeToken?: string;
};

type SendResult =
  | { ok: true; email: string }
  | { ok: false; email: string; message: string };

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractPostId(payload: PublishPayload): string | undefined {
  const candidates = [
    payload._id,
    payload.documentId,
    payload.document?._id,
    payload.result?._id,
    payload.ids?.created?.[0],
    payload.ids?.updated?.[0],
  ].filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    .map((v) => v.trim());

  return candidates.find((v) => !v.startsWith('drafts.')) || candidates[0];
}

function getPostTitle(title: PostRecord['title']): string | null {
  if (typeof title === 'string' && title.trim().length > 0) return title.trim();
  if (typeof title === 'object' && title !== null) {
    const resolved = title.en?.trim() || title.pl?.trim();
    if (resolved) return resolved;
  }
  return null; // caller decides what to do with missing title
}

function getSlugValue(slug: PublishPayload['slug']): string | undefined {
  if (typeof slug === 'string' && slug.trim().length > 0) return slug.trim();
  if (slug && typeof slug === 'object' && typeof slug.current === 'string') {
    const current = slug.current.trim();
    return current || undefined;
  }
  return undefined;
}

function shouldSendToSubscriber(post: PostRecord, subscriber: SubscriberRecord): boolean {
  const postCategories = getCategoryTokens(post.categories);
  if (!postCategories.length) return true;
  if (!subscriber.subscribedCategories?.length) return true;

  const subscriberCategories = subscriber.subscribedCategories.map(normalizeCategoryToken);
  return postCategories.some((cat) => subscriberCategories.includes(cat));
}

function normalizeCategoryToken(value: string): string {
  return value.trim().toLowerCase();
}

function getCategoryTokens(categories: PostRecord['categories']): string[] {
  if (!Array.isArray(categories)) return [];

  return categories
    .flatMap((category) => {
      if (typeof category === 'string') return [category];
      if (!category || typeof category !== 'object') return [];
      return [category.titleEn, category.titlePl, category.slug];
    })
    .filter((value): value is string => typeof value === 'string' && value.trim().length > 0)
    .map(normalizeCategoryToken);
}

function getCategoryLabels(categories: PostRecord['categories']): string {
  if (!Array.isArray(categories)) return '';

  return categories
    .map((category) => {
      if (typeof category === 'string') return category;
      return category?.titlePl || category?.titleEn || category?.slug || '';
    })
    .filter(Boolean)
    .join(', ');
}

function buildUnsubscribeUrl(siteUrl: string, subscriber: SubscriberRecord): string {
  const param = subscriber.unsubscribeToken
    ? `token=${encodeURIComponent(subscriber.unsubscribeToken)}`
    : `email=${encodeURIComponent(subscriber.email)}`;
  return `${siteUrl}/unsubscribe?${param}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Email sender ─────────────────────────────────────────────────────────────

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendNewsletterEmail(
  subscriber: SubscriberRecord,
  post: PostRecord,
  postTitle: string,
): Promise<void> {
  const siteUrl = getSiteUrl();
  const blogUrl = `${siteUrl}/blog/${post.slug}`;
  const categoriesStr = getCategoryLabels(post.categories);
  const unsubscribeUrl = buildUnsubscribeUrl(siteUrl, subscriber);

  const htmlContent = getNewsletterTemplate(
    subscriber.email,
    categoriesStr,
    postTitle,
    blogUrl,
    'AppCrates Team',
    unsubscribeUrl,
  );

  const { error } = await resend.emails.send({
    from: 'AppCrates Blog <kontakt@appcrates.pl>',
    to: subscriber.email,
    subject: `Nowy wpis na blogu: ${postTitle}`,
    html: htmlContent,
  });

  if (error) throw new Error(error.message);
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export const handler: Handler = async (event) => {
  try {
  // 1. Method guard
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  const body = event.body ?? '';

  // 2. Webhook signature verification
  const webhookSecret = getSanityWebhookSecret();
  if (webhookSecret) {
    const signature = event.headers[SANITY_SIGNATURE_HEADER_NAME] ?? '';
    const valid = isValidSanitySignature(body, signature, webhookSecret);
    if (!valid) {
      console.warn('Invalid webhook signature — request rejected.');
      return jsonResponse(401, { error: 'Invalid webhook signature.' });
    }
  } else {
    console.warn('SANITY_WEBHOOK_SECRET not set — skipping signature check.');
  }

  // 3. Parse payload
  let payload: PublishPayload;
  try {
    payload = parseJsonBody<PublishPayload>(body);
  } catch {
    return jsonResponse(400, { error: 'Invalid JSON payload.' });
  }

  // 4. Type guard — ignore non-post documents immediately
  //    Return 200 so Sanity does NOT retry for expected non-post events.
  if (payload._type && payload._type !== 'post') {
    return jsonResponse(200, { message: `Ignored payload for type "${payload._type}".` });
  }

  const isTestMode = payload.isTest === true;

  // 5. Resolve post ID
  const postId = extractPostId(payload);
  const payloadSlug = getSlugValue(payload.slug);
  if (!postId && !payloadSlug) {
    return jsonResponse(200, { message: 'No post ID or slug found in webhook payload. Skipping.' });
  }

  if (!isTestMode && postId?.startsWith('drafts.')) {
    return jsonResponse(200, { message: 'Draft change detected. Newsletter skipped.' });
  }

  const client = getSanityWriteClient();
  const publishedId = postId ? postId.replace(/^drafts\./, '') : null;
  // 6. Fetch post from Sanity
  const post = (await client.fetch<PostRecord | null>(
    `*[
      _type == "post" &&
      (
        (defined($publishedId) && _id == $publishedId) ||
        (!defined($publishedId) && slug.current == $slug && !(_id in path("drafts.**")))
      )
    ][0]{
      _id, _type, _rev, title,
      "slug": slug.current,
      categories[]->{
        "titleEn": title.en,
        "titlePl": title.pl,
        "slug": slug.current
      },
      emailsSent,
      publishedAt,
      "seo": { "noIndex": seo.noIndex }
    }`,
    { publishedId, slug: payloadSlug ?? null },
  ));

  if (!post) {
    // 200 — Sanity should not retry for a missing post (it won't appear on retry either)
    return jsonResponse(200, { error: `Post not found for ID "${publishedId || 'n/a'}" or slug "${payloadSlug || 'n/a'}". Skipping.` });
  }

  // 7. Pre-send validations — all return 200 to prevent Sanity retries
  if (post.seo?.noIndex) {
    return jsonResponse(200, { message: 'Post is marked noIndex. Newsletter skipped.' });
  }

  if (!post.slug) {
    return jsonResponse(200, { message: 'Post has no slug. Newsletter skipped.' });
  }

  if (!isTestMode && post.emailsSent) {
    return jsonResponse(200, { message: 'Newsletter already sent for this post.' });
  }

  if (!isTestMode && post.publishedAt && new Date(post.publishedAt).getTime() > Date.now()) {
    return jsonResponse(200, { message: 'Post is scheduled for the future. Newsletter skipped.' });
  }

  // 8. Resolve and validate post title — hard stop if missing
  const postTitle = getPostTitle(post.title);
  if (!postTitle) {
    console.error(`Post "${publishedId}" has no title — newsletter aborted.`);
    return jsonResponse(200, { message: 'Post has no title. Newsletter skipped.' });
  }

  // 9. Fetch and filter subscribers
  const allSubscribers = await client.fetch<SubscriberRecord[]>(
    `*[_type == "subscriber" && isActive == true]{
      email, subscribedCategories, unsubscribeToken
    }`,
  );

  const relevantSubscribers = allSubscribers
    .map((s) => ({ ...s, email: typeof s.email === 'string' ? normalizeEmail(s.email) : '' }))
    .filter((s) => {
      // Validate email format before even trying to send
      if (!s.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) {
        console.warn(`Skipping subscriber with invalid email: "${s.email}"`);
        return false;
      }
      return shouldSendToSubscriber(post, s);
    });

  if (!relevantSubscribers.length) {
    return jsonResponse(200, { message: 'No active subscribers matched this post.', count: 0 });
  }

  // 10. Mark emailsSent BEFORE sending to prevent duplicate sends on Sanity retries
  if (!isTestMode) {
    await client
      .patch(post._id)
      .set({ emailsSent: true, emailsSentAt: new Date().toISOString() })
      .commit();
  }

  // 11. Send emails, collecting results without throwing
  const results: SendResult[] = [];

  for (const subscriber of relevantSubscribers) {
    try {
      await sendNewsletterEmail(subscriber, post, postTitle);
      results.push({ ok: true, email: subscriber.email });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error.';
      console.error(`Failed to send to ${subscriber.email}:`, message);
      results.push({ ok: false, email: subscriber.email, message });
    }

    if (!isTestMode) {
      await delay(RESEND_RATE_LIMIT_DELAY_MS);
    }
  }

  const failures = results.filter((r): r is Extract<SendResult, { ok: false }> => !r.ok);
  const sentCount = results.length - failures.length;

  // 12. Always return 200 — Sanity must NOT retry newsletter sends.
  //     Log failures for observability, but do not re-trigger the whole flow.
  return jsonResponse(200, {
    message: failures.length
      ? 'Newsletter sent with some failures. Check logs.'
      : 'Newsletter emails sent successfully.',
    sentCount,
    failureCount: failures.length,
    isTestMode,
    ...(failures.length > 0 && { failures }),
  });
  } catch (error) {
    console.error('handlePostPublish failed:', error);
    return jsonResponse(500, { error: 'Post publish handler failed.' });
  }
};
