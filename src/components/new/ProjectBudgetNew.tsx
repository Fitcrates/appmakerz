'use client';

import { useId, useState, type ReactNode } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight, Bot, Check, ChevronDown, Globe2, Layers3, Network, ShoppingBag } from 'lucide-react';
import PrefetchLink from '@/components/next/PrefetchLink';
import BurnSpotlightText from '@/components/new/BurnSpotlightText';
import SpotlightText from '@/components/new/SpotlightText';
import { useLanguage } from '@/context/LanguageContext';
import { budgetCalculatorQuery, budgetEstimate, budgetProjects, budgetStartingPrice, type BudgetProject } from '@/data/project-budget';
import { projectBudgetCopy, type BudgetPrices } from '@/data/project-budget-copy';
import { localizedPath } from '@/lib/i18n-routing';
import { LARGE_PROJECT_BUDGET_EXAMPLE, ONE_PAGE_STARTING_PRICE } from '@/lib/pricing';
import styles from './ProjectBudgetNew.module.css';

const projectIcons = { website: Globe2, ecommerce: ShoppingBag, marketplace: Network, saas: Layers3, ai: Bot };
const projectKeys = Object.keys(budgetProjects) as BudgetProject[];
const emptySelection = Object.fromEntries(projectKeys.map((key) => [key, []])) as unknown as Record<BudgetProject, string[]>;

/**
 * Inline spotlight for every small text in the section. The overlay repeats
 * the text in one style, so mixed styles (a small "od" next to a large amount)
 * get one Spot each. Spans only: most of these sit inside labels and summaries.
 */
function Spot({ className, children, size = 100 }: { className?: string; children: ReactNode; size?: number }) {
  return <SpotlightText as="span" className={className} glowSize={size}>{children}</SpotlightText>;
}

export default function ProjectBudgetNew() {
  const { language } = useLanguage();
  const id = useId();
  const [project, setProject] = useState<BudgetProject>('website');
  // Kept per project type, so switching tabs does not throw away a choice.
  const [selection, setSelection] = useState(emptySelection);
  const t = projectBudgetCopy[language];
  const locale = language === 'pl' ? 'pl-PL' : 'en-GB';
  const money = (amount: number) => new Intl.NumberFormat(locale, {
    style: 'currency', currency: 'PLN', maximumFractionDigits: 0, useGrouping: 'always',
  }).format(amount);
  // "2 900–6 500 zł" reads lighter than "2 900 zł – 6 500 zł".
  const moneyRange = (min: number, max: number) => {
    if (min === max) return money(max);
    const number = new Intl.NumberFormat(locale, { maximumFractionDigits: 0, useGrouping: 'always' });
    const range = `${number.format(min)}–${number.format(max)}`;
    return language === 'pl' ? `${range} zł` : `PLN ${range}`;
  };
  const prices: BudgetPrices = {
    website: money(budgetStartingPrice('website') ?? 0),
    ecommerce: money(budgetStartingPrice('ecommerce') ?? 0),
    marketplace: money(budgetStartingPrice('marketplace') ?? 0),
    saas: money(budgetStartingPrice('saas') ?? 0),
    ai: money(budgetStartingPrice('ai') ?? 0),
    onePage: money(ONE_PAGE_STARTING_PRICE),
    large: money(LARGE_PROJECT_BUDGET_EXAMPLE),
  };
  const toggle = (key: BudgetProject, option: string, checked: boolean) => setSelection((current) => ({
    ...current,
    [key]: checked ? [...current[key], option] : current[key].filter((value) => value !== option),
  }));
  const stepTitle = (number: string, text: string) => (
    <>
      <Spot className={styles.stepNumber}>{number}</Spot>
      <Spot size={120}>{text}</Spot>
    </>
  );

  return (
    <section id="pricing" className={styles.section} aria-labelledby={`${id}-heading`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Spot className={styles.sectionLabel}>{t.label}</Spot>
        <div className={styles.headingRow}>
          {/* BurnSpotlightText takes no id, so the wrapper names the section. */}
          <div id={`${id}-heading`}>
            <BurnSpotlightText
              as="h2"
              className="font-oxanium font-light text-4xl sm:text-5xl/none lg:text-6xl/none leading-[1.15]"
              glowSize={150}
              baseDelay={200}
              charDelay={40}
            >
              {t.heading}
            </BurnSpotlightText>
          </div>
          <SpotlightText as="p" className="text-base sm:text-lg font-light leading-relaxed text-white/70!" glowSize={120}>
            {t.intro(prices)}
          </SpotlightText>
        </div>

        <fieldset className={styles.step}>
          <legend className={styles.stepTitle}>{stepTitle('01', t.choose)}</legend>
          <div className={styles.projects}>
            {projectKeys.map((key) => {
              const Icon = projectIcons[key];
              const starting = budgetStartingPrice(key);
              return (
                <label key={key} className={`${styles.project} ac-rounded`} data-selected={project === key}>
                  <input
                    className="sr-only" type="radio" name={`${id}-project`} value={key} checked={project === key}
                    aria-controls={`${id}-${key}`} onChange={() => setProject(key)}
                  />
                  <Icon className={styles.projectIcon} strokeWidth={1.5} aria-hidden="true" />
                  <Spot className={styles.projectName}>{t.projects[key].label}</Spot>
                  <Spot className={styles.projectSubtitle}>{t.projects[key].subtitle}</Spot>
                  <span className={styles.projectPrice} data-individual={starting === undefined}>
                    <Spot>{starting === undefined ? t.individualValue : `${t.from} ${money(starting)}`}</Spot>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {/* Every panel is in the HTML so search engines and AI crawlers read all
            five scopes; only the chosen one is shown. */}
        {projectKeys.map((key) => {
          const copy = t.projects[key];
          const definition = budgetProjects[key];
          const selected = selection[key];
          const starting = budgetStartingPrice(key);
          const estimate = selected.length ? budgetEstimate(key, selected) : undefined;
          const selectedLabels = definition.options.flatMap((option, index) => selected.includes(option) ? [copy.options[index].title] : []);
          const calculatorHref = `${localizedPath(language, '/kalkulator')}?${budgetCalculatorQuery(key, selected)}`;

          return (
            <div key={key} id={`${id}-${key}`} className={`${styles.panel} ac-card`} hidden={project !== key}>
              <div className={styles.main}>
                <SpotlightText as="h3" className="font-oxanium text-2xl sm:text-3xl font-light leading-tight text-white" glowSize={140}>
                  {copy.title}
                </SpotlightText>
                <SpotlightText as="p" className={styles.description} glowSize={120}>{copy.description}</SpotlightText>
                <PrefetchLink href={localizedPath(language, definition.servicePath)} className={styles.serviceLink}>
                  <Spot>{copy.serviceLink}</Spot><ArrowRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                </PrefetchLink>

                <fieldset className={styles.scope}>
                  <legend className={styles.stepTitle}>{stepTitle('02', t.scope)}</legend>
                  <SpotlightText as="p" className={styles.hint}>{t.scopeHint}</SpotlightText>
                  <div className={styles.options}>
                    {definition.options.map((option, index) => {
                      const checked = selected.includes(option);
                      return (
                        <label key={option} className={`${styles.option} ac-rounded`} data-selected={checked}>
                          <input className="sr-only" type="checkbox" checked={checked} onChange={(event) => toggle(key, option, event.target.checked)} />
                          <span className={styles.checkbox} aria-hidden="true"><Check className="w-3.5 h-3.5" strokeWidth={2.5} /></span>
                          <span className={styles.optionText}>
                            <Spot className={styles.optionTitle}>{copy.options[index].title}</Spot>
                            <Spot className={styles.optionDescription}>{copy.options[index].description}</Spot>
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
              </div>

              <aside className={styles.summary} aria-label={t.summary}>
                {estimate ? (
                  <>
                    <Spot className={styles.eyebrow}>{t.estimate}</Spot>
                    <p className={styles.estimate}><Spot size={140}>{moneyRange(estimate.min, estimate.max)}</Spot></p>
                  </>
                ) : starting !== undefined ? (
                  <>
                    <Spot className={styles.eyebrow}>{t.starting}</Spot>
                    <p className={styles.amount}>
                      <Spot className={styles.amountPrefix}>{t.from}</Spot>{' '}<Spot size={140}>{money(starting)}</Spot>
                    </p>
                  </>
                ) : (
                  <>
                    <Spot className={styles.eyebrow}>{t.individual}</Spot>
                    <p className={styles.individual}><Spot size={140}>{t.individualValue}</Spot></p>
                  </>
                )}
                <Spot className={styles.tax}>{t.tax}</Spot>
                <SpotlightText as="p" className={styles.note}>{copy.note}</SpotlightText>

                <div className={styles.picked}>
                  <Spot className={styles.eyebrow}>{t.summary}</Spot>
                  {selectedLabels.length ? (
                    <ul className={styles.chips}>
                      {selectedLabels.map((label) => <li className={styles.chip} key={label}><Check className="w-3.5 h-3.5" aria-hidden="true" /><Spot>{label}</Spot></li>)}
                    </ul>
                  ) : <SpotlightText as="p" className={styles.empty}>{t.empty}</SpotlightText>}
                </div>

                <div className={styles.actions}>
                  {/* No spotlight here: a teal glow on the teal button would hide the label. */}
                  <PrefetchLink href={calculatorHref} prefetchOnIntent={false} className={styles.primary}>
                    {t.calculator}<ArrowUpRight className="w-4 h-4 shrink-0" aria-hidden="true" />
                  </PrefetchLink>
                  <a href="#contact" className={styles.secondary}><Spot>{t.contact}</Spot><ArrowDown className="w-4 h-4" aria-hidden="true" /></a>
                </div>
                <SpotlightText as="p" className={styles.disclaimer}>{t.disclaimer}</SpotlightText>
              </aside>
            </div>
          );
        })}
        <p className="sr-only" role="status">{t.projects[project].label}. {t.selected(selection[project].length)}</p>

        <div className={styles.footer}>
          <div>
            <SpotlightText as="h3" className={styles.stagesTitle} glowSize={120}>{t.stagesTitle}</SpotlightText>
            <ol className={styles.stages}>
              {t.stages.map((stage, index) => (
                <li key={stage}>
                  <span aria-hidden="true"><Spot className={styles.stageNumber}>{`0${index + 1}`}</Spot></span>
                  <Spot className={styles.stageText}>{stage}</Spot>
                </li>
              ))}
            </ol>
          </div>
          <div className={styles.questions}>
            {t.questions(prices).map((question) => (
              <details key={question.title}>
                <summary><Spot size={120}>{question.title}</Spot><ChevronDown className="w-4 h-4 shrink-0" aria-hidden="true" /></summary>
                <SpotlightText as="p" className={styles.answer} glowSize={120}>{question.answer}</SpotlightText>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
