export type AiFieldKind = 'string' | 'text' | 'portableText' | 'stringArray' | 'faq'

export interface AiFieldDefinition {
  path: string
  title: string
  kind: AiFieldKind
  group: 'primary' | 'summary' | 'body' | 'seo' | 'taxonomy' | 'faq'
  maxLength?: number
  promptHint?: string
}

export interface AiSchemaDefinition {
  name: string
  title: string
  fields: AiFieldDefinition[]
  presets: Record<string, string[]>
}

export const AI_SCHEMA_REGISTRY: Record<string, AiSchemaDefinition> = {
  post: {
    name: 'post',
    title: 'Blog post',
    fields: [
      { path: 'title.en', title: 'English title', kind: 'string', group: 'primary', maxLength: 120 },
      { path: 'title.pl', title: 'Polish title', kind: 'string', group: 'primary', maxLength: 120 },
      { path: 'excerpt.en', title: 'English excerpt', kind: 'text', group: 'summary', maxLength: 300 },
      { path: 'excerpt.pl', title: 'Polish excerpt', kind: 'text', group: 'summary', maxLength: 300 },
      { path: 'body.en', title: 'English body', kind: 'portableText', group: 'body' },
      { path: 'body.pl', title: 'Polish body', kind: 'portableText', group: 'body' },
      { path: 'faq.en', title: 'English FAQ', kind: 'faq', group: 'faq' },
      { path: 'faq.pl', title: 'Polish FAQ', kind: 'faq', group: 'faq' },
      { path: 'tags', title: 'Tags', kind: 'stringArray', group: 'taxonomy' },
      { path: 'seo.metaTitle.en', title: 'English meta title', kind: 'string', group: 'seo', maxLength: 60 },
      { path: 'seo.metaTitle.pl', title: 'Polish meta title', kind: 'string', group: 'seo', maxLength: 60 },
      { path: 'seo.metaDescription.en', title: 'English meta description', kind: 'text', group: 'seo', maxLength: 160 },
      { path: 'seo.metaDescription.pl', title: 'Polish meta description', kind: 'text', group: 'seo', maxLength: 160 },
      { path: 'seo.keywords', title: 'SEO keywords', kind: 'stringArray', group: 'seo' },
    ],
    presets: {
      document: ['title.en', 'title.pl', 'excerpt.en', 'excerpt.pl', 'body.en', 'body.pl', 'faq.en', 'faq.pl', 'tags', 'seo.metaTitle.en', 'seo.metaTitle.pl', 'seo.metaDescription.en', 'seo.metaDescription.pl', 'seo.keywords'],
      body: ['body.en', 'body.pl'],
      seo: ['seo.metaTitle.en', 'seo.metaTitle.pl', 'seo.metaDescription.en', 'seo.metaDescription.pl', 'seo.keywords'],
      summary: ['title.en', 'title.pl', 'excerpt.en', 'excerpt.pl'],
      faq: ['faq.en', 'faq.pl'],
      taxonomy: ['tags', 'seo.keywords'],
    },
  },
}

export function getAiSchemaDefinition(docType?: string) {
  return docType ? AI_SCHEMA_REGISTRY[docType] : undefined
}

export function getAiSchemaFields(docType?: string) {
  return getAiSchemaDefinition(docType)?.fields || []
}

export function getAiFieldDefinition(docType: string | undefined, path: string | undefined) {
  if (!docType || !path) return undefined
  return getAiSchemaFields(docType).find((field) => field.path === path)
}

export function getAvailableAiSchemaTypes() {
  return Object.keys(AI_SCHEMA_REGISTRY)
}

export function getAiPresetEntries(docType?: string) {
  const definition = getAiSchemaDefinition(docType)
  if (!definition) return []
  return Object.entries(definition.presets).map(([name, fields]) => ({ name, fields }))
}

export function resolveAiFieldPathFromInput(docType: string | undefined, rawPath: unknown[], fieldName?: string) {
  if (!docType) return undefined
  const normalizedPath = rawPath
    .filter((segment) => typeof segment === 'string')
    .filter((segment) => segment !== 'aiContext')
    .join('.')
  const candidates = [normalizedPath, fieldName].filter(Boolean) as string[]
  return candidates.find((path) => Boolean(getAiFieldDefinition(docType, path)))
}

export function resolveAiTargetFields(docType: string | undefined, targetFields?: string[]) {
  const fields = getAiSchemaFields(docType)
  if (!fields.length) return []
  const allowed = new Set(fields.map((field) => field.path))
  const requested = Array.isArray(targetFields) && targetFields.length ? targetFields : getAiSchemaDefinition(docType)?.presets.document || []
  return requested.filter((path) => allowed.has(path))
}
