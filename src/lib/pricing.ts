import pricingConfig from '@/data/pricing-config.json';

export const WEBSITE_STARTING_PRICE = pricingConfig.services.website.base.custom.min;
// An example of a large project's scale, not a ceiling or a package price.
export const SAAS_STARTING_PRICE = 15_000;
export const AI_STARTING_PRICE = 4_000;
// Floor for calculator estimates, so a narrow selection never shows less than
// the advertised starting price.
export const SERVICE_MINIMUM_BUDGET: Partial<Record<string, number>> = {
  website: WEBSITE_STARTING_PRICE,
  ai: AI_STARTING_PRICE,
};
export const LARGE_PROJECT_BUDGET_EXAMPLE = 500_000;
// The most basic generated one-page site with no extra features. Mentioned in
// the pricing FAQ for accuracy; the headline starting price stays the custom
// website above.
export const ONE_PAGE_STARTING_PRICE = 500;
