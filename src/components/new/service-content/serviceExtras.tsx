import type { Language } from '@/lib/language';
import AiWorkflowDiagram from './AiWorkflowDiagram';
import SaasProof from './SaasProof';
import type { SectionExtra } from './ServiceContentSections';

// Page-specific additions to the Sanity copy, matched by section heading in
// either language. Keys of these pages are random, so the heading is the only
// stable handle; a heading that no longer matches simply drops the extra
// ("inside") or moves it to the end of the copy ("before").
export function getServiceExtras(slug: string, language: Language): SectionExtra[] {
  switch (slug) {
    case 'ai-automation-rpa-solutions':
      return [{ match: /workflow-first/i, place: 'inside', node: <AiWorkflowDiagram language={language} /> }];
    case 'custom-web-applications':
      return [{ match: /rosną razem|grows with your business/i, place: 'before', node: <SaasProof language={language} /> }];
    default:
      return [];
  }
}
