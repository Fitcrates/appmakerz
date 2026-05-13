import { getAiFieldDefinition, resolveAiFieldPathFromInput } from './ai-registry'

export interface AiStructuredRequest {
  mode: 'document-chat'
  docType: string
  documentId?: string
  modelId?: string
  prompt?: string
  messages?: Array<{ role: string; content: string }>
  targetFields?: string[]
  currentDocument?: Record<string, unknown>
}

export interface AiStructuredResponse {
  text: string
  model?: string
  usage?: unknown
  result?: {
    assistantMessage?: string
    fieldValues?: Record<string, unknown>
    resolvedTargetFields?: string[]
  }
}

export function getAiApiEndpoint() {
  if (typeof window !== 'undefined' && ['localhost', '127.0.0.1'].includes(window.location.hostname)) {
    return 'http://localhost:8888/api/ai-generate'
  }
  return 'https://appcrates.pl/api/ai-generate'
}

export async function callStructuredAi(request: AiStructuredRequest): Promise<AiStructuredResponse> {
  const response = await fetch(getAiApiEndpoint(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  })
  const data = await response.json()
  if (!response.ok || data.error) throw new Error(data.error || `AI request failed with ${response.status}`)
  return data
}

export function resolveAiTargetFieldPath(docType: string | undefined, rawPath: unknown, fieldName?: string) {
  const pathArray = Array.isArray(rawPath) ? rawPath : []
  const resolved = resolveAiFieldPathFromInput(docType, pathArray, fieldName)
  if (!resolved || !getAiFieldDefinition(docType, resolved)) return undefined
  return resolved
}
