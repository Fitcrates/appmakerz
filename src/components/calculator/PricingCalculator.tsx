'use client';

import { useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Globe, ShoppingCart, Store, Bot, Settings } from 'lucide-react';
import { useCalculator } from '@/lib/calculator/useCalculator';

import { pricingCopy } from '@/data/pricing-copy';
import { useLanguage } from '@/context/LanguageContext';
import { translations } from '@/translations/translations';
import ProgressBar from './ProgressBar';
import ResultDisplay from './ResultDisplay';
import StepBase from './StepBase';
import StepCms from './StepCms';
import StepContact from './StepContact';
import StepDeadline from './StepDeadline';
import StepFeatures from './StepFeatures';
import StepServiceType from './StepServiceType';

function ServiceIcon({ keyName }: { keyName: string }) {
  const icons: Record<string, React.ReactNode> = {
    website: <Globe className="h-4 w-4 text-teal-300/60" />,
    ecommerce: <ShoppingCart className="h-4 w-4 text-teal-300/60" />,
    marketplace: <Store className="h-4 w-4 text-teal-300/60" />,
    ai: <Bot className="h-4 w-4 text-teal-300/60" />,
    saas: <Settings className="h-4 w-4 text-teal-300/60" />,
  };
  return <span aria-hidden="true">{icons[keyName] || null}</span>;
}

export default function PricingCalculator() {
  const { language } = useLanguage();
  const t = translations[language].calculator;
  const optionCopy = pricingCopy[language];
  const calculator = useCalculator(language);
  const {
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
  } = calculator;
  const canGoNext = useMemo(() => {
    if (currentStep === 'service') {
      return Boolean(selection.service);
    }

    if (currentStep === 'features' || currentStep === 'saas_questions') {
      return true;
    }

    if (currentStep === 'base') {
      return Boolean(selection.base);
    }

    if (currentStep === 'cms') {
      return Boolean(selection.cms);
    }

    if (currentStep === 'deadline') {
      return Boolean(selection.deadline);
    }

    return true;
  }, [currentStep, selection]);

  useEffect(() => {
    const rawPrefill = sessionStorage.getItem('calculatorPrefill');

    if (!rawPrefill) {
      return;
    }

    try {
      const parsed = JSON.parse(rawPrefill);
      setPrefill(parsed);
    } catch {
      sessionStorage.removeItem('calculatorPrefill');
      return;
    }

    sessionStorage.removeItem('calculatorPrefill');
  }, [setPrefill]);

  const renderStep = () => {
    if (currentStep === 'service') {
      return <StepServiceType config={config} copy={optionCopy.services} selectedService={selection.service} onSelect={selectService} noPriceHint={t.noPriceHint} />;
    }

    if (currentStep === 'base') {
      return <StepBase options={selectedService?.base} copy={optionCopy.base} value={selection.base} onChange={(base) => updateSelection({ base })} pricePrefix={t.optionPricePrefix} noCost={t.noCost} />;
    }

    if (currentStep === 'cms') {
      return <StepCms options={selectedService?.cms} copy={optionCopy.cms} value={selection.cms} onChange={(cms) => updateSelection({ cms })} pricePrefix={t.optionPricePrefix} noCost={t.noCost} />;
    }

    if (currentStep === 'features' || currentStep === 'saas_questions') {
      return <StepFeatures options={selectedService?.features} copy={optionCopy.features} selected={selection.features} onToggle={toggleFeature} pricePrefix={t.optionPricePrefix} />;
    }

    if (currentStep === 'deadline') {
      return <StepDeadline options={config.multipliers.deadline[selection.service]} copy={optionCopy.deadline} value={selection.deadline} onChange={(deadline) => updateSelection({ deadline })} multiplierLabel={t.multiplier} />;
    }

    return (
      <div className="space-y-8">
        <ResultDisplay price={price} service={selectedService} disclaimer={optionCopy.disclaimer} label={t.result.label} noPriceTitle={t.result.noPriceTitle} />
        <div className="border border-white/10 bg-transparent p-6">
          <h3 className="mb-5 font-oxanium text-2xl font-light text-white">{t.result.formTitle}</h3>
          <StepContact service={selectedService} summary={summary} price={price} language={language} copy={t.form} />
        </div>
      </div>
    );
  };

  return (
    <div className="mx-auto w-full max-w-5xl border border-white/10 bg-indigo-950 p-5 sm:p-8 lg:p-10">
      <ProgressBar current={stepIndex} total={steps.length} label={t.progressLabel} />
      <div className="mt-8 min-h-[520px] sm:min-h-[440px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -28 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.24em] text-teal-300">{t.stepLabel} {stepIndex + 1}</p>
                <h2 className="font-oxanium text-3xl font-light text-white sm:text-4xl">{t.titles[currentStep]}</h2>
              </div>
              {selection.service ? (
                <p className="flex items-center gap-2 text-sm text-white/45">
                  <ServiceIcon keyName={selection.service} />
                  {t.selectedProject}: {optionCopy.services[selection.service]?.label || selectedService?.label}
                </p>
              ) : null}
            </div>
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={stepIndex === 0 ? reset : back} className="rounded-2xl border border-white/10 px-5 py-3 text-white/70 transition-colors hover:border-white/25 hover:text-white">
          {stepIndex === 0 ? t.buttons.clear : t.buttons.back}
        </button>
        {currentStep !== 'result' ? (
          <button type="button" onClick={next} disabled={!canGoNext} className="rounded-2xl bg-teal-300 px-6 py-3 font-medium text-indigo-950 transition-colors hover:bg-teal-200 disabled:cursor-not-allowed disabled:opacity-50">
            {t.buttons.next}
          </button>
        ) : (
          <button type="button" onClick={reset} className="rounded-2xl border border-teal-300/40 px-6 py-3 font-medium text-teal-200 transition-colors hover:bg-teal-300 hover:text-indigo-950">
            {t.buttons.reset}
          </button>
        )}
      </div>
    </div>
  );
}
