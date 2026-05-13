import { AiContextInput } from '../components/AiContextInput'

export const aiContextField = {
  name: 'aiContext',
  title: 'Kontekst i wytyczne AI',
  type: 'text',
  rows: 6,
  group: 'content',
  description: 'Główne źródło kontekstu dla AI w tym dokumencie: temat, intencja SEO, grupa odbiorców, ton, długość, frazy, ograniczenia i elementy do pominięcia.',
  validation: (Rule: { max: (length: number) => unknown }) => Rule.max(4000),
  components: { input: AiContextInput },
}
