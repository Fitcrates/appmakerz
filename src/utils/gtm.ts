// Type declarations to make TypeScript happy with window.dataLayer
declare global {
  interface Window {
    dataLayer: any[];
  }
}

/**
 * Pushes a custom event into the GTM dataLayer.
 * @param eventName The name of the event to track (e.g. 'form_submit')
 * @param eventData Additional tracking metadata (e.g. URL, form name, etc.)
 */
export const pushToDataLayer = (eventName: string, eventData: Record<string, any> = {}) => {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    
    window.dataLayer.push({
      event: eventName,
      // Automatically include the current page URL for context
      page_url: window.location.href,
      page_path: window.location.pathname,
      ...eventData,
    });
  }
};

/**
 * Pre-defined wrapper for form submissions.
 * @param formName Name/identifier of the submitted form
 */
export const trackFormSubmit = (formName: string) => {
  pushToDataLayer('form_submit', { form_name: formName });
};

/**
 * Pre-defined wrapper for tracking contact link clicks (email/phone).
 * @param contactType 'email' or 'phone'
 * @param contactValue The email address or phone number clicked
 */
export const trackContactClick = (contactType: 'email' | 'phone', contactValue: string) => {
  pushToDataLayer('contact_click', {
    contact_type: contactType,
    contact_value: contactValue
  });
};
