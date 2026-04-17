// Type declarations to make TypeScript happy with window.dataLayer / gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
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
export const pushToDataLayer = (eventName: string, eventData: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    ensureDataLayer().push({
      event: eventName,
      ...getPageContext(),
      ...eventData,
    });
  }
};

export const sendGoogleEvent = (eventName: string, eventData: Record<string, any> = {}) => {
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

  ensureDataLayer().push(['consent', 'update', params]);
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
