import pricingConfig from '@/data/pricing-config.json';
import { pricingCopy } from '@/data/pricing-copy';
import type { Language } from '@/lib/language';
import type { PriceResult, PricingConfig, Selection } from './types';

const config = pricingConfig as PricingConfig;

function roundToHundreds(value: number) {
  return Math.round(value / 100) * 100;
}

export function calculatePrice(selection: Selection): PriceResult {
  const service = config.services[selection.service];

  if (!service || service.noPrice) {
    return { min: 0, max: 0 };
  }

  let min = 0;
  let max = 0;

  if (selection.base && service.base?.[selection.base]) {
    min += service.base[selection.base].min;
    max += service.base[selection.base].max;
  }

  if (selection.cms && service.cms?.[selection.cms]) {
    min += service.cms[selection.cms].min;
    max += service.cms[selection.cms].max;
  }

  for (const feature of selection.features) {
    const option = service.features?.[feature];

    if (option) {
      min += option.min;
      max += option.max;
    }
  }

  const serviceMultipliers = config.multipliers.deadline[selection.service];
  const multiplier = serviceMultipliers?.[selection.deadline]?.value ?? 1;

  return {
    min: roundToHundreds(min * multiplier),
    max: roundToHundreds(max * multiplier),
  };
}

export function getQuoteSelectionSummary(selection: Selection, language: Language = 'pl') {
  const service = config.services[selection.service];
  const copy = pricingCopy[language];

  return {
    serviceLabel: copy.services[selection.service]?.label || service?.label || selection.service,
    baseLabel: selection.base ? copy.base[selection.base]?.label || service?.base?.[selection.base]?.label : undefined,
    cmsLabel: selection.cms ? copy.cms[selection.cms]?.label || service?.cms?.[selection.cms]?.label : undefined,
    featuresLabels: selection.features.map((feature) => copy.features[feature]?.label || service?.features?.[feature]?.label || feature),
    deadlineLabel: selection.deadline ? copy.deadline[selection.deadline]?.label || config.multipliers.deadline[selection.service]?.[selection.deadline]?.label : undefined,
  };
}
