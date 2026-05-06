// Type declarations to make TypeScript happy with window.dataLayer / gtag
type GtagCommand = 'event' | 'config' | 'consent' | 'js';

type GtagFunction = (command: GtagCommand, ...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer: Array<Record<string, unknown>>;
    gtag?: GtagFunction;
  }
}

const getPageContext = () => ({
  page_url: window.location.href,
  page_path: window.location.pathname,
});

const ensureDataLayer = () => {
  window.dataLayer = window.dataLayer || [];
  return window.dataLayer;
};

/**
 * Pushes a custom event into the GTM dataLayer.
 * @param eventName The name of the event to track (e.g. 'form_submit')
 * @param eventData Additional tracking metadata (e.g. URL, form name, etc.)
 */
export const pushToDataLayer = (eventName: string, eventData: Record<string, unknown> = {}) => {
  if (typeof window !== 'undefined') {
    ensureDataLayer().push({
      event: eventName,
      ...getPageContext(),
      ...eventData,
    });
  }
};

export const sendGoogleEvent = (eventName: string, eventData: Record<string, unknown> = {}) => {
  if (typeof window === 'undefined') {
    return;
  }

  const payload = {
    ...getPageContext(),
    ...eventData,
  };

  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload);
  }

  pushToDataLayer(eventName, eventData);
};

export const updateAnalyticsConsent = (granted: boolean) => {
  if (typeof window === 'undefined') {
    return;
  }

  const consentState = granted ? 'granted' : 'denied';
  const params = {
    analytics_storage: consentState,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  };

  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', params);
  }

  ensureDataLayer().push({ event: 'consent_update', ...params });
};

/**
 * Pre-defined wrapper for form submissions.
 * @param formName Name/identifier of the submitted form
 */
export const trackFormSubmit = (formName: string) => {
  sendGoogleEvent('form_submit', { form_name: formName });
};

export const trackFormView = (formName: string) => {
  sendGoogleEvent('form_view', { form_name: formName });
};

export const trackFormStart = (formName: string) => {
  sendGoogleEvent('form_start', { form_name: formName });
};

export const trackLeadGenerated = (formName: string) => {
  sendGoogleEvent('generate_lead', { form_name: formName });
};

export const trackCookieConsentDecision = (decision: 'accepted' | 'declined') => {
  sendGoogleEvent('cookie_consent_update', {
    consent_status: decision,
  });
};

/**
 * Pre-defined wrapper for tracking contact link clicks (email/phone).
 * @param contactType 'email' or 'phone'
 * @param contactValue The email address or phone number clicked
 */
export const trackContactClick = (contactType: 'email' | 'phone', contactValue: string) => {
  sendGoogleEvent('contact_click', {
    contact_type: contactType,
    contact_value: contactValue,
  });
};

/**
 * Sends a manual page_view event to gtag for client-side navigation.
 * Required in Next.js App Router when using custom routing (e.g. PrefetchLink)
 * that does not trigger a full page reload.
 */
export const trackPageView = (pathname: string) => {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: pathname,
    page_location: window.location.href,
    page_title: document.title,
    send_to: process.env.NEXT_PUBLIC_GOOGLE_TAG_ID,
  });
};
