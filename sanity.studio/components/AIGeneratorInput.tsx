import { useCallback, useState } from 'react'
import { Button, Spinner, Stack } from '@sanity/ui'
import { set, useFormValue } from 'sanity'
import { callStructuredAi, resolveAiTargetFieldPath } from './ai-request'
import { getAiFieldDefinition } from './ai-registry'
import { useAiDocumentPreferences } from './AiDocumentPreferences'

interface AIGeneratorInputProps {
  onChange: (patch: unknown) => void
  renderDefault: (props: AIGeneratorInputProps) => React.ReactNode
  path?: unknown
  schemaType?: { name?: string; title?: string }
}

export const AIGeneratorInput = (props: AIGeneratorInputProps) => {
  const { onChange, schemaType } = props
  const [loading, setLoading] = useState(false)
  const documentType = useFormValue(['_type']) as string | undefined
  const currentDocument = useFormValue([]) as Record<string, unknown> | undefined
  const preferences = useAiDocumentPreferences(documentType)
  const targetFieldPath = resolveAiTargetFieldPath(documentType, props.path, schemaType?.name)
  const fieldDefinition = getAiFieldDefinition(documentType, targetFieldPath)

  const generate = useCallback(async () => {
    if (!documentType || !targetFieldPath) {
      alert('To pole nie jest skonfigurowane w AI_SCHEMA_REGISTRY.')
      return
    }

    setLoading(true)
    try {
      const response = await callStructuredAi({
        mode: 'document-chat',
        docType: documentType,
        modelId: preferences.modelId,
        prompt: `Generate only the field "${fieldDefinition?.title || targetFieldPath}".`,
        targetFields: [targetFieldPath],
        currentDocument,
      })
      const value = response.result?.fieldValues?.[targetFieldPath]
      if (value === undefined || value === null) throw new Error('AI did not return a value for this field.')
      onChange(set(value))
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown AI error'
      alert(`Failed to generate content: ${message}`)
    } finally {
      setLoading(false)
    }
  }, [currentDocument, documentType, fieldDefinition?.title, onChange, preferences.modelId, targetFieldPath])

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Button
        onClick={generate}
        disabled={loading || !targetFieldPath}
        tone="primary"
        mode="ghost"
        text={loading ? 'Generowanie...' : '✨ Generuj pole'}
        icon={loading ? Spinner : undefined}
        style={{ cursor: loading ? 'wait' : 'pointer' }}
      />
    </Stack>
  )
}
