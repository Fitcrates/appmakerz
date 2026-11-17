import pricingConfig from '@/data/pricing-config.json';
import type { PricingConfig, Selection } from './types';

const config = pricingConfig as PricingConfig;

export function normalizeCalculatorPrefill(input: unknown): Selection | undefined {
  if (!input || typeof input !== 'object') return;
  const value = input as Record<string, unknown>;
  if (typeof value.service !== 'string' || !Object.hasOwn(config.services, value.service)) return;
  const service = config.services[value.service];
  const validKey = (key: unknown, options?: object) => typeof key === 'string' && options && Object.hasOwn(options, key) ? key : undefined;

  return {
    service: value.service,
    base: validKey(value.base, service.base),
    cms: validKey(value.cms, service.cms),
    features: Array.isArray(value.features) ? [...new Set(value.features.filter((feature): feature is string => Boolean(validKey(feature, service.features))))] : [],
    deadline: validKey(value.deadline, config.multipliers.deadline[value.service]) ?? 'standard',
  };
}

export function calculatorPrefillFromQuery(query: URLSearchParams) {
  const selection = normalizeCalculatorPrefill({
    service: query.get('service'), base: query.get('base'), cms: query.get('cms'),
    features: query.getAll('feature'), deadline: query.get('deadline'),
  });
  if (!selection) return;
  return { ...selection, deadline: query.has('deadline') ? selection.deadline : undefined };
}
