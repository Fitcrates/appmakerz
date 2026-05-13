import { useEffect, useState } from 'react'
import { Box, Select, Spinner, Text } from '@sanity/ui'
import { getAiApiEndpoint } from './ai-request'

interface AiModel {
  id: string
  label: string
  tier?: string
  contextWindow?: number
}

interface AiModelPickerProps {
  value?: string
  onChange: (modelId: string) => void
}

export function AiModelPicker({ value, onChange }: AiModelPickerProps) {
  const [models, setModels] = useState<AiModel[]>([])
  const [defaultModel, setDefaultModel] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    fetch(getAiApiEndpoint())
      .then((response) => response.json())
      .then((data) => {
        if (!mounted) return
        const availableModels = Array.isArray(data.availableModels) ? data.availableModels : []
        setModels(availableModels)
        setDefaultModel(data.defaultModel || availableModels[0]?.id || '')
        if (!value && (data.defaultModel || availableModels[0]?.id)) onChange(data.defaultModel || availableModels[0].id)
      })
      .catch(() => setModels([]))
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [onChange, value])

  const selectedModel = models.find((model) => model.id === (value || defaultModel))

  if (loading) {
    return <Spinner size={1} />
  }

  if (!models.length) {
    return <Text size={1} muted>Brak dostępnych modeli. Sprawdź klucze API.</Text>
  }

  return (
    <Box>
      <Select value={value || defaultModel} onChange={(event) => onChange(event.currentTarget.value)} fontSize={1} padding={2}>
        {models.map((model) => (
          <option key={model.id} value={model.id}>{model.tier ? `${model.tier} — ` : ''}{model.label}</option>
        ))}
      </Select>
      {selectedModel?.contextWindow ? <Text size={1} muted>Context window: {selectedModel.contextWindow.toLocaleString()} tokens</Text> : null}
    </Box>
  )
}
