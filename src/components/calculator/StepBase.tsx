import type { PriceOption } from '@/lib/calculator/types';
import type { PricingCopyOption } from '@/data/pricing-copy';
import StepOption from './StepOption';

type StepBaseProps = {
  options?: Record<string, PriceOption>;
  copy?: Record<string, PricingCopyOption>;
  value?: string;
  onChange: (value: string) => void;
  pricePrefix: string;
  noCost: string;
};

export default function StepBase(props: StepBaseProps) {
  return <StepOption {...props} />;
}
