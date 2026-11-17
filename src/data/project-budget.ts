import pricingConfig from '@/data/pricing-config.json';
import { calculatePrice } from '@/lib/calculator/calculatePrice';
import type { PricingConfig, Selection } from '@/lib/calculator/types';
import { AI_STARTING_PRICE, SAAS_STARTING_PRICE, WEBSITE_STARTING_PRICE } from '@/lib/pricing';

const config = pricingConfig as PricingConfig;

export const budgetProjects = {
  website: { base: 'custom', options: ['cms', 'blog', 'i18n', 'extra_pages'], servicePath: '/uslugi/professional-website-development' },
  ecommerce: { base: 'medusa_basic', options: ['cms', 'erp_integration', 'custom_checkout', 'multi_region'], servicePath: '/uslugi/e-commerce-shops-medusa-js' },
  marketplace: { base: 'medusa_marketplace', options: ['stripe_connect', 'payouts', 'vendor_dash', 'i18n'], servicePath: '/uslugi/marketplace-multi-vendor-medusa-js' },
  saas: { options: ['user_accounts', 'payments', 'integrations', 'data_management'], servicePath: '/uslugi/custom-web-applications' },
  ai: { options: ['chatbot_rag', 'ai_workflow', 'ai_integration', 'ai_support'], servicePath: '/uslugi/ai-automation-rpa-solutions' },
} as const;

export type BudgetProject = keyof typeof budgetProjects;

/** The calculator selection a budget choice maps to. */
export function budgetSelection(project: BudgetProject, selected: readonly string[]): Selection {
  const definition = budgetProjects[project];
  const hasCms = project === 'website' || project === 'ecommerce';
  return {
    service: project,
    base: 'base' in definition ? definition.base : undefined,
    cms: hasCms ? (selected.includes('cms') ? 'sanity_form' : 'none') : undefined,
    features: definition.options.filter((option) => option !== 'cms' && selected.includes(option)),
    // Lowest multiplier: the summary shows where a budget starts, the
    // calculator then asks about the deadline.
    deadline: 'relaxed',
  };
}

/**
 * Advertised "from" price per project type, or undefined where the scope is
 * quoted individually. Shared by the section, the calculator and structured
 * data so they never disagree.
 */
export function budgetStartingPrice(project: BudgetProject): number | undefined {
  if (project === 'website') return WEBSITE_STARTING_PRICE;
  if (project === 'saas') return SAAS_STARTING_PRICE;
  if (project === 'ai') return AI_STARTING_PRICE;
  const definition = budgetProjects[project];
  if (!('base' in definition)) return undefined;
  return config.services[project]?.base?.[definition.base]?.min;
}

/** Rough range for the chosen scope, or undefined where the calculator has no prices. */
export function budgetEstimate(project: BudgetProject, selected: readonly string[]) {
  const result = calculatePrice(budgetSelection(project, selected));
  return result.max > 0 ? result : undefined;
}

export function budgetCalculatorQuery(project: BudgetProject, selected: readonly string[]) {
  const selection = budgetSelection(project, selected);
  const query = new URLSearchParams({ service: project });
  if (selection.base) query.set('base', selection.base);
  if (selection.cms) query.set('cms', selection.cms);
  for (const feature of selection.features) query.append('feature', feature);
  return query.toString();
}

/** Starting price for a service landing page slug, for its Service schema. */
export function startingPriceForServicePath(path: string) {
  const project = (Object.keys(budgetProjects) as BudgetProject[]).find((key) => budgetProjects[key].servicePath === path);
  return project ? budgetStartingPrice(project) : undefined;
}
