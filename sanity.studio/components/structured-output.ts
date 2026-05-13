import { getAiFieldDefinition } from './ai-registry'
import { ensureBlocks, extractJsonObject } from './portableTextAi'

function randomKey() {
  return Math.random().toString(36).substring(2, 9)
}

export function extractJsonPayload(text: string) {
  return extractJsonObject(text)
}

export function normalizeStringArrayValue(value: unknown) {
  const values = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : []
  return Array.from(new Set(values.map((item) => String(item || '').trim()).filter(Boolean)))
}

export function normalizeFaqItems(value: unknown) {
  if (!Array.isArray(value)) return []
  return value
    .map((item) => {
      if (!item || typeof item !== 'object') return null
      const record = item as Record<string, unknown>
      const question = String(record.question || '').trim()
      const answer = typeof record.answer === 'string' ? record.answer.trim() : record.answer
      if (!question || !answer) return null
      return {
        _key: String(record._key || randomKey()),
        question,
        answer: typeof answer === 'string' ? answer : JSON.stringify(answer),
      }
    })
    .filter(Boolean)
}

export function normalizeFieldValue(kind: string, value: unknown) {
  if (kind === 'string' || kind === 'text') {
    const text = String(value || '').trim()
    return text || undefined
  }
  if (kind === 'portableText') {
    const blocks = ensureBlocks(value)
    return blocks.length ? blocks : undefined
  }
  if (kind === 'stringArray') {
    const values = normalizeStringArrayValue(value)
    return values.length ? values : undefined
  }
  if (kind === 'faq') {
    const items = normalizeFaqItems(value)
    return items.length ? items : undefined
  }
  return undefined
}

export function normalizeFieldValues(docType: string | undefined, fieldValues: Record<string, unknown> | undefined) {
  if (!docType || !fieldValues) return {}
  return Object.entries(fieldValues).reduce<Record<string, unknown>>((acc, [path, value]) => {
    const field = getAiFieldDefinition(docType, path)
    if (!field) return acc
    const normalized = normalizeFieldValue(field.kind, value)
    if (normalized !== undefined) acc[path] = normalized
    return acc
  }, {})
}

export function setDeepValue(target: Record<string, unknown>, path: string, value: unknown) {
  const segments = path.split('.')
  let current: Record<string, unknown> = target
  segments.forEach((segment, index) => {
    if (index === segments.length - 1) {
      current[segment] = value
      return
    }
    if (!current[segment] || typeof current[segment] !== 'object' || Array.isArray(current[segment])) {
      current[segment] = {}
    }
    current = current[segment] as Record<string, unknown>
  })
}

export function buildSetPatchFromFieldValues(docType: string | undefined, fieldValues: Record<string, unknown> | undefined) {
  const normalized = normalizeFieldValues(docType, fieldValues)
  return Object.entries(normalized).reduce<Record<string, unknown>>((patch, [path, value]) => {
    patch[path] = value
    return patch
  }, {})
}
