export type CalculatorStep = 'service' | 'base' | 'cms' | 'features' | 'deadline' | 'saas_questions' | 'result';

export type PriceOption = {
  label: string;
  description?: string;
  min: number;
  max: number;
};

export type DeadlineOption = {
  label: string;
  value: number;
};

export type ServiceConfig = {
  label: string;
  steps: CalculatorStep[];
  noPrice?: boolean;
  ctaLabel?: string;
  base?: Record<string, PriceOption>;
  cms?: Record<string, PriceOption>;
  features?: Record<string, PriceOption>;
};

export type PricingConfig = {
  services: Record<string, ServiceConfig>;
  multipliers: {
    deadline: Record<string, Record<string, DeadlineOption>>;
  };
  disclaimer: string;
};

export type Selection = {
  service: string;
  base?: string;
  cms?: string;
  features: string[];
  deadline: string;
};

export type PriceResult = {
  min: number;
  max: number;
};

export type QuoteSelectionSummary = {
  serviceLabel: string;
  baseLabel?: string;
  cmsLabel?: string;
  featuresLabels: string[];
  deadlineLabel?: string;
};
