import { useCallback, useState } from 'react'
import { Stack, Button, Inline, Spinner, Select, Box } from '@sanity/ui'
import { set, unset, useFormValue } from 'sanity'

// ─── Provider defaults ────────────────────────────────────────────────────────
const PROVIDER_DEFAULTS: Record<string, string> = {
  gemini: 'gemini-2.0-flash',
  groq: 'llama-3.3-70b-versatile',
  openai: 'gpt-4o-mini',
}

export const AIGeneratorInput = (props: any) => {
  const { onChange, schemaType } = props
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<'openai' | 'groq' | 'gemini'>('gemini')
  const [model, setModel] = useState<string>(PROVIDER_DEFAULTS.gemini)

  const titleEn = useFormValue(['title', 'en']) as string | undefined
  const titlePl = useFormValue(['title', 'pl']) as string | undefined

  const handleProviderChange = (p: 'openai' | 'groq' | 'gemini') => {
    setProvider(p)
    setModel(PROVIDER_DEFAULTS[p])
  }

  const generate = useCallback(async () => {
    setLoading(true)
    try {
      const isPolish = props.path.includes('pl')
      const languageMatch = isPolish ? 'Polish' : 'English'
      const titleToUse = isPolish
        ? (titlePl || titleEn || 'the topic')
        : (titleEn || titlePl || 'the topic')

      const defaultPrompt = `Write a short and compelling text in ${languageMatch} for a blog post titled "${titleToUse}".`
      let promptTemplate = schemaType.options?.aiPrompt || defaultPrompt

      const prompt = promptTemplate
        .replace(/{{title}}/g, titleToUse)
        .replace(/{{language}}/g, languageMatch)

      const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
      const apiUrl = isLocalhost
        ? 'http://localhost:8888/api/ai-generate'
        : 'https://appcrates.pl/api/ai-generate'

      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          max_completion_tokens: 300,
          provider,
          model,
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
  }, [onChange, titleEn, titlePl, schemaType.options, props.path, provider, model])

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
        <Box style={{ width: '165px' }}>
          <Select
            value={provider}
            onChange={(e: any) => handleProviderChange(e.currentTarget.value)}
            fontSize={1}
            padding={2}
          >
            <option value="gemini">Gemini 2.0 Flash</option>
            <option value="groq">Groq (Llama 3.3)</option>
            <option value="openai">OpenAI (GPT-4o mini)</option>
          </Select>
        </Box>
      </Inline>
    </Stack>
  )
}
