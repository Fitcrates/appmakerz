import { Card, Stack, Text } from '@sanity/ui'
import type { ReactNode } from 'react'
import { useFormValue } from 'sanity'
import { AiModelPicker } from './AiModelPicker'
import { useAiDocumentPreferences } from './AiDocumentPreferences'

interface AiContextInputProps {
  renderDefault: (props: AiContextInputProps) => ReactNode
}

export function AiContextInput(props: AiContextInputProps) {
  const docType = useFormValue(['_type']) as string | undefined
  const preferences = useAiDocumentPreferences(docType)

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Card border padding={3} radius={2} tone="primary">
        <Stack space={3}>
          <Text size={1} weight="semibold">Model AI dla całej schemy</Text>
          <AiModelPicker value={preferences.modelId} onChange={preferences.setModelId} />
          <Text size={1} muted>Ten model jest używany przez przyciski przy polach i przez Asystenta AI. Brief jest zapisywany w polu dokumentu, nie w localStorage.</Text>
        </Stack>
      </Card>
    </Stack>
  )
}
