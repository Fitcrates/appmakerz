'use client';

import { useMemo, useState } from 'react';
import pricingConfig from '@/data/pricing-config.json';
import type { Language } from '@/lib/language';
import { calculatePrice, getQuoteSelectionSummary } from './calculatePrice';
import type { CalculatorStep, PricingConfig, Selection } from './types';

const config = pricingConfig as PricingConfig;

const initialSelection: Selection = {
  service: '',
  features: [],
  deadline: 'standard',
};

function getFlowSteps(selection: Selection): CalculatorStep[] {
  const service = config.services[selection.service];

  if (!service) {
    return ['service'];
  }

  return ['service', ...service.steps, 'result'];
}

function getFirstKey(record?: Record<string, unknown>) {
  return record ? Object.keys(record)[0] : undefined;
}

export function useCalculator(language: Language = 'pl') {
  const [selection, setSelection] = useState<Selection>(initialSelection);
  const [stepIndex, setStepIndex] = useState(0);
  const steps = useMemo(() => getFlowSteps(selection), [selection]);
  const currentStep = steps[stepIndex] || 'service';
  const selectedService = selection.service ? config.services[selection.service] : undefined;
  const price = useMemo(() => calculatePrice(selection), [selection]);
  const summary = useMemo(() => getQuoteSelectionSummary(selection, language), [language, selection]);

  const selectService = (serviceKey: string) => {
    const service = config.services[serviceKey];

    setSelection({
      service: serviceKey,
      base: getFirstKey(service.base),
      cms: getFirstKey(service.cms),
      features: [],
      deadline: 'standard',
    });
    setStepIndex(1);
  };

  const updateSelection = (partial: Partial<Selection>) => {
    setSelection((current) => ({ ...current, ...partial }));
  };

  const toggleFeature = (featureKey: string) => {
    setSelection((current) => ({
      ...current,
      features: current.features.includes(featureKey)
        ? current.features.filter((feature) => feature !== featureKey)
        : [...current.features, featureKey],
    }));
  };

  const next = () => setStepIndex((current) => Math.min(current + 1, steps.length - 1));
  const back = () => setStepIndex((current) => Math.max(current - 1, 0));
  const reset = () => {
    setSelection(initialSelection);
    setStepIndex(0);
  };
  const setPrefill = (prefill: Partial<Selection>) => {
    const newSelection: Selection = {
      service: typeof prefill.service === 'string' ? prefill.service : '',
      base: typeof prefill.base === 'string' ? prefill.base : undefined,
      cms: typeof prefill.cms === 'string' ? prefill.cms : undefined,
      features: Array.isArray(prefill.features) ? prefill.features.filter((feature): feature is string => typeof feature === 'string') : [],
      deadline: typeof prefill.deadline === 'string' ? prefill.deadline : 'standard',
    };
    setSelection(newSelection);

    const flowSteps = getFlowSteps(newSelection);
    let targetStep = 0;

    for (let i = 0; i < flowSteps.length; i++) {
      const step = flowSteps[i];
      if (step === 'service') {
        targetStep = i;
        continue;
      }
      if (step === 'base' && newSelection.base) {
        targetStep = i + 1;
        continue;
      }
      if (step === 'cms' && newSelection.cms) {
        targetStep = i + 1;
        continue;
      }
      if ((step === 'features' || step === 'saas_questions') && newSelection.features.length > 0) {
        targetStep = i + 1;
        continue;
      }
      if (step === 'deadline' && newSelection.deadline) {
        targetStep = i + 1;
        continue;
      }
      // This step is not pre-filled; land here
      targetStep = i;
      break;
    }

    setStepIndex(Math.min(targetStep, flowSteps.length - 1));
  };

  return {
    config,
    selection,
    selectedService,
    steps,
    currentStep,
    stepIndex,
    price,
    summary,
    selectService,
    updateSelection,
    toggleFeature,
    next,
    back,
    reset,
    setPrefill,
  };
}
