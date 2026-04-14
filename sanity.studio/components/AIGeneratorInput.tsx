import { useCallback, useState } from 'react'
import { Stack, Button, Inline, Spinner, Select, Box, TextInput } from '@sanity/ui'
import { set, unset, useFormValue } from 'sanity'

const MODEL_OPTIONS: Record<string, Array<{ label: string; value: string }>> = {
  openai: [
    { label: 'GPT-5.4 Thinking', value: 'gpt-5.4-thinking' },
    { label: 'GPT-5.4', value: 'gpt-5.4' },
    { label: 'GPT-4.1', value: 'gpt-4.1' },
    { label: 'GPT-4.1 Mini', value: 'gpt-4.1-mini' },
    { label: 'GPT-4o', value: 'gpt-4o' },
    { label: 'GPT-4o Mini', value: 'gpt-4o-mini' },
  ],
  groq: [
    { label: 'Llama 3.3 70B', value: 'llama-3.3-70b-versatile' },
    { label: 'Llama 3.1 8B Instant', value: 'llama-3.1-8b-instant' },
  ],
}

// ─── Provider defaults ────────────────────────────────────────────────────────
const PROVIDER_DEFAULTS: Record<string, string> = {
  groq: 'llama-3.3-70b-versatile',
  openai: 'gpt-5.4-thinking',
}

export const AIGeneratorInput = (props: any) => {
  const { onChange, schemaType } = props
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<'openai' | 'groq'>('openai')
  const [model, setModel] = useState<string>(PROVIDER_DEFAULTS.openai)

  const documentType = useFormValue(['_type']) as string | undefined
  const titleEn = useFormValue(['title', 'en']) as string | undefined
  const titlePl = useFormValue(['title', 'pl']) as string | undefined

  const handleProviderChange = (p: 'openai' | 'groq') => {
    setProvider(p)
    setModel(PROVIDER_DEFAULTS[p])
  }

  const selectedPreset = MODEL_OPTIONS[provider].some((option) => option.value === model)
    ? model
    : '__custom__'

  const generate = useCallback(async () => {
    setLoading(true)
    try {
      const isPolish = props.path.includes('pl')
      const languageMatch = isPolish ? 'Polish' : 'English'
      const fieldTitle = schemaType?.title || props.path?.[props.path.length - 1] || 'content field'
      const titleToUse = isPolish
        ? (titlePl || titleEn || 'the topic')
        : (titleEn || titlePl || 'the topic')
      const existingValue = typeof props.value === 'string' ? props.value.trim() : ''

      const contentTypeLabel = documentType === 'project'
        ? 'project case study'
        : documentType === 'serviceLanding'
          ? 'service landing page'
        : 'blog post'
      const defaultPrompt = `Write a short and compelling text in ${languageMatch} for a ${contentTypeLabel} titled "${titleToUse}".`
      let promptTemplate = schemaType.options?.aiPrompt || defaultPrompt

      const prompt = promptTemplate
        .replace(/{{title}}/g, titleToUse)
        .replace(/{{language}}/g, languageMatch)

      const finalPrompt = `${prompt}

Document type: ${contentTypeLabel}
Target field: ${fieldTitle}
Language: ${languageMatch}
${existingValue ? `Existing field value to improve or rewrite:\n${existingValue}\nRewrite it to be stronger and more useful. Do not copy it verbatim.\n` : ''}
Return ONLY the final field value in ${languageMatch}. No labels, no quotes, no markdown.`

      const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
      const apiUrl = isLocalhost
        ? 'http://localhost:8888/api/ai-generate'
        : 'https://appcrates.pl/api/ai-generate'

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: finalPrompt,
          systemPrompt: 'You are a senior bilingual SEO editor working inside a Sanity CMS. Follow the requested field instruction exactly. If source text is provided, improve or rewrite it without copying it verbatim. Return only plain text for the target field.',
          max_completion_tokens: 300,
          provider,
          model: model.trim() || PROVIDER_DEFAULTS[provider],
          temperature: 0.7,
        }),
      })

      const data = await res.json()
      if (data.error) throw new Error(data.error)
      onChange(data.text ? set(data.text.trim()) : unset())
    } catch (err: any) {
      alert('Failed to generate content: ' + err.message)
    } finally {
      setLoading(false)
    }
  }, [onChange, titleEn, titlePl, schemaType.options, props.path, provider, model, documentType])

  return (
    <Stack space={3}>
      {props.renderDefault(props)}
      <Inline space={2} paddingBottom={2}>
        <Button
          onClick={generate}
          disabled={loading || (!titleEn && !titlePl)}
          tone="primary"
          mode="ghost"
          text={loading ? 'Generating...' : '✨ Generate'}
          icon={loading ? Spinner : undefined}
          style={{ cursor: loading ? 'wait' : 'pointer' }}
        />
        <Box style={{ width: '155px' }}>
          <Select
            value={provider}
            onChange={(e: any) => handleProviderChange(e.currentTarget.value)}
            fontSize={1}
            padding={2}
          >
            <option value="groq">Groq (Llama 3.3)</option>
            <option value="openai">OpenAI</option>
          </Select>
        </Box>
        <Box style={{ width: '180px' }}>
          <Select
            value={selectedPreset}
            onChange={(e: any) => {
              const nextValue = e.currentTarget.value
              if (nextValue !== '__custom__') setModel(nextValue)
            }}
            fontSize={1}
            padding={2}
            disabled={loading}
          >
            {MODEL_OPTIONS[provider].map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
            <option value="__custom__">Custom model ID</option>
          </Select>
        </Box>
        <Box flex={1}>
          <TextInput
            value={model}
            onChange={(e: any) => setModel(e.currentTarget.value)}
            fontSize={1}
            padding={2}
            placeholder="Model, np. gpt-5.4-thinking"
            disabled={loading}
          />
        </Box>
      </Inline>
    </Stack>
  )
}
