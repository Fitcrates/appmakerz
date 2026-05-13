import { useCallback, useMemo, useState } from 'react'
import { Box, Button, Card, Checkbox, Flex, Select, Spinner, Stack, Text, TextArea } from '@sanity/ui'
import { set, useClient, useFormValue } from 'sanity'
import { callStructuredAi } from './ai-request'
import { getAiPresetEntries, getAiSchemaFields } from './ai-registry'
import { useAiDocumentPreferences } from './AiDocumentPreferences'
import { buildSetPatchFromFieldValues } from './structured-output'

interface AiDocumentAssistantPanelProps {
  onChange: (patch: unknown) => void
  renderDefault: (props: AiDocumentAssistantPanelProps) => React.ReactNode
}

export function AiDocumentAssistantPanel(props: AiDocumentAssistantPanelProps) {
  const client = useClient({ apiVersion: '2023-05-03' })
  const documentValue = useFormValue([]) as Record<string, unknown> | undefined
  const documentId = useFormValue(['_id']) as string | undefined
  const documentType = useFormValue(['_type']) as string | undefined
  const preferences = useAiDocumentPreferences(documentType)
  const fields = getAiSchemaFields(documentType)
  const presets = getAiPresetEntries(documentType)
  const [preset, setPreset] = useState('document')
  const [customFields, setCustomFields] = useState<string[]>([])
  const [instruction, setInstruction] = useState('')
  const [loading, setLoading] = useState(false)
  const [assistantMessage, setAssistantMessage] = useState('')
  const [pendingPatch, setPendingPatch] = useState<Record<string, unknown> | null>(null)

  const targetFields = useMemo(() => {
    if (preset === 'custom') return customFields
    return presets.find((entry) => entry.name === preset)?.fields || []
  }, [customFields, preset, presets])

  const generate = useCallback(async () => {
    if (!documentType || !fields.length) {
      alert('Ta schema nie jest skonfigurowana w AI_SCHEMA_REGISTRY.')
      return
    }
    if (!targetFields.length) {
      alert('Wybierz przynajmniej jedno pole.')
      return
    }

    setLoading(true)
    setPendingPatch(null)
    setAssistantMessage('')
    try {
      const response = await callStructuredAi({
        mode: 'document-chat',
        docType: documentType,
        documentId,
        modelId: preferences.modelId,
        prompt: instruction,
        targetFields,
        currentDocument: documentValue,
      })
      const patch = buildSetPatchFromFieldValues(documentType, response.result?.fieldValues)
      if (!Object.keys(patch).length) throw new Error('AI nie zwróciło żadnych poprawnych pól do zapisania.')
      setPendingPatch(patch)
      setAssistantMessage(response.result?.assistantMessage || response.text || 'Gotowe do zastosowania.')
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown AI error'
      alert(`Asystent AI: ${message}`)
    } finally {
      setLoading(false)
    }
  }, [documentType, documentId, documentValue, fields.length, instruction, preferences.modelId, targetFields])

  const applyPatch = useCallback(async () => {
    if (!pendingPatch || !documentId || !documentType) return
    const draftId = documentId.startsWith('drafts.') ? documentId : `drafts.${documentId}`
    await client.patch(draftId).set(pendingPatch).commit()
    props.onChange(set(documentValue?.aiContext || ''))
    setPendingPatch(null)
    setAssistantMessage('Zastosowano zmiany. Odśwież Studio, jeśli pola nie zaktualizują się od razu.')
  }, [client, documentId, documentType, documentValue, pendingPatch, props])

  const toggleCustomField = (path: string) => {
    setCustomFields((current) => current.includes(path) ? current.filter((item) => item !== path) : [...current, path])
  }

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Card border padding={3} radius={2} tone="transparent">
        <Stack space={4}>
          <Flex align="center" justify="space-between" gap={3}>
            <Stack space={2}>
              <Text weight="semibold" size={2}>Asystent AI</Text>
              <Text size={1} muted>Głównym briefem jest pole „Kontekst i wytyczne AI”. Instrukcja poniżej dotyczy tylko tej jednej operacji.</Text>
            </Stack>
            {loading ? <Spinner size={1} /> : null}
          </Flex>

          <Stack space={2}>
            <Text size={1} weight="semibold">Preset</Text>
            <Select value={preset} onChange={(event) => setPreset(event.currentTarget.value)} disabled={loading}>
              {presets.map((entry) => <option key={entry.name} value={entry.name}>{entry.name}</option>)}
              <option value="custom">custom</option>
            </Select>
          </Stack>

          {preset === 'custom' ? (
            <Card border padding={3} radius={2}>
              <Stack space={2}>
                {fields.map((field) => (
                  <Flex key={field.path} align="center" gap={2}>
                    <Checkbox checked={customFields.includes(field.path)} onChange={() => toggleCustomField(field.path)} />
                    <Text size={1}>{field.title} <Text as="span" muted>({field.path})</Text></Text>
                  </Flex>
                ))}
              </Stack>
            </Card>
          ) : null}

          <Stack space={2}>
            <Text size={1} weight="semibold">Dodatkowa instrukcja</Text>
            <TextArea value={instruction} onChange={(event) => setInstruction(event.currentTarget.value)} rows={3} disabled={loading} placeholder="Np. Napisz post techniczny dla właścicieli małych firm, ton konkretny i praktyczny." />
          </Stack>

          <Flex gap={2}>
            <Button text={loading ? 'Generowanie...' : 'Generuj propozycję'} tone="primary" onClick={generate} disabled={loading || !fields.length} />
            <Button text="Zastosuj zmiany" tone="positive" onClick={applyPatch} disabled={loading || !pendingPatch} />
          </Flex>

          {assistantMessage ? (
            <Card border padding={3} radius={2} tone={pendingPatch ? 'caution' : 'positive'}>
              <Stack space={2}>
                <Text size={1} style={{ whiteSpace: 'pre-wrap' }}>{assistantMessage}</Text>
                {pendingPatch ? <Box><Text size={1} muted>Zmiany nie są zapisane, dopóki nie klikniesz „Zastosuj zmiany”.</Text></Box> : null}
              </Stack>
            </Card>
          ) : null}
        </Stack>
      </Card>
    </Stack>
  )
}
