import { useCallback, useEffect, useMemo, useState } from 'react'

const STORAGE_PREFIX = 'appcrates.ai.preferences.'
const EVENT_NAME = 'appcrates-ai-preferences-change'

interface AiDocumentPreferences {
  modelId?: string
}

function getStorageKey(docType?: string) {
  return `${STORAGE_PREFIX}${docType || 'unknown'}`
}

function readPreferences(docType?: string): AiDocumentPreferences {
  if (typeof window === 'undefined') return {}
  try {
    const raw = window.localStorage.getItem(getStorageKey(docType))
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function writePreferences(docType: string | undefined, preferences: AiDocumentPreferences) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(getStorageKey(docType), JSON.stringify(preferences))
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { docType, preferences } }))
}

export function useAiDocumentPreferences(docType?: string) {
  const [preferences, setPreferences] = useState<AiDocumentPreferences>(() => readPreferences(docType))

  useEffect(() => {
    setPreferences(readPreferences(docType))
  }, [docType])

  useEffect(() => {
    const sync = () => setPreferences(readPreferences(docType))
    window.addEventListener('storage', sync)
    window.addEventListener(EVENT_NAME, sync)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(EVENT_NAME, sync)
    }
  }, [docType])

  const setModelId = useCallback((modelId: string) => {
    const next = { ...readPreferences(docType), modelId }
    writePreferences(docType, next)
    setPreferences(next)
  }, [docType])

  return useMemo(() => ({ ...preferences, setModelId }), [preferences, setModelId])
}
