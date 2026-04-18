import type { Handler } from '@netlify/functions';
import emailjs from '@emailjs/nodejs';

import {
  getEmailJsConfig,
  getSanityWriteClient,
  getSiteUrl,
  jsonResponse,
  normalizeEmail,
  parseJsonBody,
} from './_shared';

type PublishPayload = {
  _id?: string;
  _type?: string;
  documentId?: string;
  isTest?: boolean;
  ids?: {
    created?: string[];
    updated?: string[];
  };
  document?: {
    _id?: string;
    _type?: string;
  };
  result?: {
    _id?: string;
    _type?: string;
  };
};

type PostRecord = {
  _id: string;
  _type: 'post';
  _rev: string;
  title?: string | { en?: string; pl?: string };
  slug?: string;
  categories?: string[];
  emailsSent?: boolean;
  publishedAt?: string;
  seo?: {
    noIndex?: boolean;
  };
};

type SubscriberRecord = {
  email: string;
  subscribedCategories?: string[];
  unsubscribeToken?: string;
};

const locks = new Map<string, boolean>();
const LOCK_TIMEOUT_MS = 60_000;

function acquireLock(lockId: string) {
  if (locks.get(lockId)) return false;
  locks.set(lockId, true);
  setTimeout(() => locks.delete(lockId), LOCK_TIMEOUT_MS);
  return true;
}

function releaseLock(lockId: string) {
  locks.delete(lockId);
}

function extractPostId(payload: PublishPayload) {
  const candidates = [
    payload._id,
    payload.documentId,
    payload.document?._id,
    payload.result?._id,
    payload.ids?.created?.[0],
    payload.ids?.updated?.[0],
  ];

  const firstCandidate = candidates.find((value): value is string => typeof value === 'string' && value.trim().length > 0);
  return firstCandidate?.trim();
}

function getPostTitle(title: PostRecord['title']) {
  if (typeof title === 'string' && title.trim().length > 0) return title.trim();
  if (title && typeof title === 'object' && typeof title.en === 'string' && title.en.trim().length > 0) {
    return title.en.trim();
  }
  if (title && typeof title === 'object' && typeof title.pl === 'string' && title.pl.trim().length > 0) {
    return title.pl.trim();
  }
  return 'New Blog Post';
}

function shouldSendToSubscriber(post: PostRecord, subscriber: SubscriberRecord) {
  if (!post.categories?.length) return true;
  if (!subscriber.subscribedCategories?.length) return true;
  return post.categories.some((category) => subscriber.subscribedCategories?.includes(category));
}

function buildUnsubscribeUrl(siteUrl: string, subscriber: SubscriberRecord) {
  if (subscriber.unsubscribeToken) {
    return `${siteUrl}/unsubscribe?token=${encodeURIComponent(subscriber.unsubscribeToken)}`;
  }

  return `${siteUrl}/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
}

async function sendNewsletterEmail(subscriber: SubscriberRecord, post: PostRecord) {
  const emailConfig = getEmailJsConfig();
  const siteUrl = getSiteUrl();
  const blogTitle = getPostTitle(post.title);
  const blogUrl = `${siteUrl}/blog/${post.slug}`;

  await emailjs.send(
    emailConfig.serviceId,
    emailConfig.templateId,
    {
      categories: Array.isArray(post.categories) ? post.categories.join(', ') : '',
      blog_title: blogTitle,
      blog_url: blogUrl,
      unsubscribe_url: buildUnsubscribeUrl(siteUrl, subscriber),
      to_email: subscriber.email,
      author_name: 'AppCrates Team',
    },
    {
      publicKey: emailConfig.publicKey,
      privateKey: emailConfig.privateKey,
    }
  );
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return jsonResponse(405, { error: 'Method not allowed.' });
  }

  let lockId = 'post-publish-default';

  try {
    const payload = parseJsonBody<PublishPayload>(event.body);
    const isTestMode = payload.isTest === true;
    const postId = extractPostId(payload);
    lockId = postId || lockId;

    if (!acquireLock(lockId)) {
      return jsonResponse(429, { message: 'This post is already being processed.' });
    }

    if (!isTestMode && payload._type && payload._type !== 'post') {
      return jsonResponse(200, { message: `Ignored payload for type "${payload._type}".` });
    }

    if (!postId) {
      return jsonResponse(isTestMode ? 400 : 200, {
        message: 'No post ID found in webhook payload. Skipping.',
      });
    }

    const client = getSanityWriteClient();
    const publishedId = postId.replace(/^drafts\./, '');
    const draftId = postId.startsWith('drafts.') ? postId : `drafts.${publishedId}`;

    const post = (await client.fetch(
      `*[_type == "post" && _id in [$publishedId, $draftId]][0]{
        _id,
        _type,
        _rev,
        title,
        "slug": slug.current,
        categories,
        emailsSent,
        publishedAt,
        "seo": {
          "noIndex": seo.noIndex
        }
      }`,
      { publishedId, draftId } as Record<string, string>
    )) as PostRecord | null;

    if (!post) {
      return jsonResponse(404, { error: `Post not found for ID ${publishedId}.` });
    }

    if (!isTestMode && post._id.startsWith('drafts.')) {
      return jsonResponse(200, { message: 'Draft change detected. Newsletter skipped.' });
    }

    if (post.seo?.noIndex) {
      return jsonResponse(200, { message: 'Post is marked noindex. Newsletter skipped.' });
    }

    if (!post.slug) {
      return jsonResponse(200, { message: 'Post has no slug yet. Newsletter skipped.' });
    }

    if (!isTestMode && post.emailsSent) {
      return jsonResponse(200, { message: 'Newsletter was already sent for this post.' });
    }

    if (!isTestMode && post.publishedAt && new Date(post.publishedAt).getTime() > Date.now()) {
      return jsonResponse(200, { message: 'Post is scheduled for the future. Newsletter skipped.' });
    }

    const subscribers = (await client.fetch(
      `*[_type == "subscriber" && isActive == true]{
        email,
        subscribedCategories,
        unsubscribeToken
      }`
    )) as SubscriberRecord[];

    const relevantSubscribers = subscribers
      .map((subscriber) => ({
        ...subscriber,
        email: normalizeEmail(subscriber.email),
      }))
      .filter((subscriber) => shouldSendToSubscriber(post, subscriber));

    const failures: Array<{ email: string; message: string }> = [];

    for (const subscriber of relevantSubscribers) {
      try {
        await sendNewsletterEmail(subscriber, post);
        if (!isTestMode) {
          await new Promise((resolve) => setTimeout(resolve, 600));
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown email error.';
        console.error(`Failed to send newsletter to ${subscriber.email}:`, error);
        failures.push({ email: subscriber.email, message });
      }
    }

    if (failures.length > 0) {
      return jsonResponse(500, {
        error: 'Some newsletter emails failed to send.',
        failureCount: failures.length,
        sentCount: relevantSubscribers.length - failures.length,
        failures,
      });
    }

    if (!isTestMode) {
      await client
        .patch(post._id)
        .set({
          emailsSent: true,
          emailsSentAt: new Date().toISOString(),
        })
        .commit();
    }

    return jsonResponse(200, {
      message: relevantSubscribers.length
        ? 'Newsletter emails sent successfully.'
        : 'No active subscribers matched this post.',
      count: relevantSubscribers.length,
      isTestMode,
    });
  } catch (error) {
    console.error('handlePostPublish error:', error);
    return jsonResponse(500, {
      error: error instanceof Error ? error.message : 'Internal server error.',
    });
  } finally {
    releaseLock(lockId);
  }
};
