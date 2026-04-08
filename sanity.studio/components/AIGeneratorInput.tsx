import { useCallback, useState } from 'react'
import { Stack, Button, Inline, Spinner, Select, Box } from '@sanity/ui'
import { set, unset, useFormValue } from 'sanity'

export const AIGeneratorInput = (props: any) => {
  const { onChange, schemaType } = props
  const [loading, setLoading] = useState(false)
  const [provider, setProvider] = useState<'openai' | 'groq' | 'gemini'>('gemini')
  const [model, setModel] = useState<string>('gpt-4o')

  // Get current document title using Sanity's useFormValue hook
  const titleEn = useFormValue(['title', 'en']) as string | undefined
  const titlePl = useFormValue(['title', 'pl']) as string | undefined

  const generate = useCallback(async () => {
    setLoading(true)
    try {
      // Determine what language we are currently editing based on Sanity's field path
      const isPolish = props.path.includes('pl');
      const languageMatch = isPolish ? 'Polish' : 'English';
      const titleToUse = isPolish ? (titlePl || titleEn || 'the topic') : (titleEn || titlePl || 'the topic');
      
      const defaultPrompt = `Write a short and compelling text in ${languageMatch} for a blog post titled "${titleToUse}".`;
      let promptTemplate = schemaType.options?.aiPrompt || defaultPrompt;

      const prompt = promptTemplate
        .replace(/{{title}}/g, titleToUse)
        .replace(/{{language}}/g, languageMatch);

      // Local development vs Production domain handling
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalhost 
        ? 'http://localhost:8888/.netlify/functions/generateContent' // Dev url where Netlify CLI serves functions
        : 'https://appcrates.pl/.netlify/functions/generateContent';

      const res = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ prompt, max_completion_tokens: 300, provider, model }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Mutate the field with the generated result
      onChange(data.text ? set(data.text.trim()) : unset());
    } catch (err: any) {
      alert("Failed to generate content: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [onChange, titleEn, titlePl, schemaType.options, props.path]);

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
        <Box style={{ width: '150px' }}>
          <Select value={provider} onChange={(e: any) => setProvider(e.currentTarget.value as any)} fontSize={1} padding={2}>
            <option value="gemini">Gemini (3.1 Pro)</option>
            <option value="groq">Groq (Llama 3)</option>
            <option value="openai">OpenAI</option>
          </Select>
        </Box>
        {provider === 'openai' && (
          <Box style={{ width: '150px' }}>
            <Select value={model} onChange={(e: any) => setModel(e.currentTarget.value)} fontSize={1} padding={2}>
              <option value="gpt-4o-mini">GPT-4o Mini</option>
              <option value="gpt-4o">GPT-4o</option>
              <option value="gpt-5.4">GPT-5.4</option>
            </Select>
          </Box>
        )}
      </Inline>
    </Stack>
  )
}
