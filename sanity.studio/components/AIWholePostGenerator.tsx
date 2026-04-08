import { useCallback, useState, useEffect, useRef } from 'react'
import { Stack, Button, Spinner, TextArea, Text, Box, Card, Flex, Select } from '@sanity/ui'
import { set, useFormValue, useClient } from 'sanity'

// ─── Provider defaults ────────────────────────────────────────────────────────
const PROVIDER_DEFAULTS: Record<string, string> = {
  openai: 'gpt-4o-mini',
  groq: 'llama3-70b-8192',
  gemini: 'gemini-2.0-flash',
}

// ─── Portable Text normalizer (pure code, no AI) ─────────────────────────────
function ensureBlocks(input: any): any[] {
  const rk = () => Math.random().toString(36).substring(2, 9)

  if (!input) return []

  // AI returned a bare string — wrap it
  if (typeof input === 'string') {
    return [{ _type: 'block', _key: rk(), style: 'normal', markDefs: [],
      children: [{ _type: 'span', _key: rk(), marks: [], text: input }] }]
  }

  if (!Array.isArray(input)) return []

  return input.map(block => {
    if (typeof block === 'string') {
      return { _type: 'block', _key: rk(), style: 'normal', markDefs: [],
        children: [{ _type: 'span', _key: rk(), marks: [], text: block }] }
    }
    const children = Array.isArray(block.children)
      ? block.children.map((c: any) => ({
          _type: 'span', marks: [],
          ...c,
          _key: c._key || rk(),
          text: c.text ?? (typeof c === 'string' ? c : ''),
        }))
      : [{ _type: 'span', _key: rk(), marks: [], text: '' }]

    return {
      markDefs: [],
      ...block,
      _type: 'block',
      _key: block._key || rk(),
      style: block.style || 'normal',
      children,
    }
  })
}

// ─── Extract JSON from AI response (handles markdown code fences) ─────────────
function extractJson(text: string): any {
  let clean = text.trim()
  // Strip ```json ... ``` fences
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/, '').trim()
  }
  const start = clean.indexOf('{')
  const end = clean.lastIndexOf('}')
  if (start !== -1 && end !== -1) {
    return JSON.parse(clean.substring(start, end + 1))
  }
  throw new Error('No JSON object found in AI response')
}

// ─── Main Component ───────────────────────────────────────────────────────────
export const AIWholePostGenerator = (props: any) => {
  const { onChange, value } = props
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [provider, setProvider] = useState<'openai' | 'groq' | 'gemini'>('gemini')
  const [model, setModel] = useState<string>(PROVIDER_DEFAULTS.gemini)
  const [contextData, setContextData] = useState('')

  const client = useClient({ apiVersion: '2023-05-03' })
  const scrollRef = useRef<HTMLDivElement>(null)

  const documentId   = useFormValue(['_id'])   as string | undefined
  const documentType = useFormValue(['_type'])  as string | undefined
  const titleEn      = useFormValue(['title', 'en']) as string | undefined
  const titlePl      = useFormValue(['title', 'pl']) as string | undefined

  // ── Restore saved messages ──────────────────────────────────────────────────
  useEffect(() => {
    if (!value) return
    try { setMessages(JSON.parse(value)) } catch { /* ignore */ }
  }, [value])

  // ── Auto-scroll ─────────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  // ── Reset model when provider changes ───────────────────────────────────────
  const handleProviderChange = (p: 'openai' | 'groq' | 'gemini') => {
    setProvider(p)
    setModel(PROVIDER_DEFAULTS[p])
  }

  // ── Fetch context + reference docs ─────────────────────────────────────────
  useEffect(() => {
    if (!documentType) return
    const fetchContext = async () => {
      try {
        setStatus('Loading context...')
        // Mini-context: all doc titles/slugs
        const allDocs = await client.fetch(
          `*[_type in ["pages","post","project"]]{ _type, "en": title.en, "pl": title.pl, "slug": slug.current, "techs": technologies }`
        )
        const contextLines = allDocs.map((d: any) =>
          `- [${d._type}] ${d.en || d.pl || 'Untitled'} (/slug: ${d.slug || 'none'})${d.techs?.length ? ` techs: ${d.techs.join(', ')}` : ''}`
        ).join('\n')

        // Reference: 2 published docs of same type with body text
        const refs = await client.fetch(
          `*[_type == $t && defined(body.en) && !(_id in path("drafts.**"))][0...2]{
            "en": title.en, "pl": title.pl,
            "exc": excerpt.en, "desc": description.en,
            "body": pt::text(body.en)
          }`,
          { t: documentType }
        )

        let refBlock = ''
        if (refs?.length > 0) {
          refBlock = '\n\n=== EXISTING DOCS AS STYLE REFERENCE ===\n' +
            refs.map((r: any) =>
              `TITLE: ${r.en || r.pl}\nSUMMARY: ${r.exc || r.desc || 'n/a'}\nBODY EXCERPT:\n${r.body?.substring(0, 1200) || 'n/a'}...`
            ).join('\n\n---\n') +
            '\n==================================='
        }

        setContextData(contextLines + refBlock)
        setStatus('')
      } catch (e) {
        console.error('Context fetch failed', e)
        setStatus('')
      }
    }
    fetchContext()
  }, [client, documentType])

  // ── Persist + set messages ──────────────────────────────────────────────────
  const saveMessages = (msgs: any[]) => {
    setMessages(msgs)
    onChange(set(JSON.stringify(msgs)))
  }

  // ── Main send ───────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async () => {
    if (!documentId) { alert('Save the document first so it has an ID.'); return }
    if (!input.trim()) return

    const isProject = documentType === 'project'
    const docTitle  = titleEn || titlePl || 'Untitled'
    const userMsg   = { role: 'user', content: input.trim() }
    const newMsgs   = [...messages, userMsg]
    saveMessages(newMsgs)
    setInput('')
    setLoading(true)
    setStatus('AI is thinking...')

    try {
      const isLocalhost = ['localhost', '127.0.0.1'].includes(window.location.hostname)
      const apiUrl = isLocalhost
        ? 'http://localhost:8888/.netlify/functions/generateContent'
        : 'https://appcrates.pl/.netlify/functions/generateContent'

      // Build history for the AI (clean — no provider-specific metadata)
      const historyForAi = newMsgs.map(m => ({ role: m.role, content: m.content }))

      // ── Detect intent: is the user asking to generate/write content? ──────
      const writeKeywords = /\b(write|generate|create|fill|draft|writ|zrób|napisz|stwórz|uzupełnij)\b/i
      const isWriteRequest = writeKeywords.test(input)

      let assistantReply = ''

      if (isWriteRequest) {
        // ── ONE-SHOT JSON GENERATION ──────────────────────────────────────
        setStatus('Generating full document...')

        const extraSchemaFields = isProject
          ? `  "description": { "en": "...", "pl": "..." },
  "technologies": ["tech1", "tech2"],
  "projectUrl": "https://...", "blogUrl": "https://...", "githubUrl": "https://..."`
          : `  "excerpt": { "en": "...", "pl": "..." },
  "categories": ["Dev"], "tags": ["tag1", "tag2"]`

        const jsonPrompt = `You are an expert SEO copywriter and bilingual (English + Polish) content creator.
Generate a COMPLETE ${isProject ? 'project portfolio entry' : 'blog post'} for: "${docTitle}".

USER REQUEST: ${input}

EXISTING CMS CONTENT (for context, linking suggestions, style reference — DO NOT DUPLICATE):
${contextData}

OUTPUT: Return a single, valid JSON object with ALL fields. Do not include markdown fences or any text outside the JSON.

JSON SCHEMA YOU MUST FOLLOW EXACTLY:
{
  "title": { "en": "Title in English", "pl": "Tytuł po polsku" },
  "slug": { "_type": "slug", "current": "url-friendly-slug" },
${extraSchemaFields},
  "body": {
    "en": [
      { "_type": "block", "style": "h2", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Section Heading" }] },
      { "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Detailed paragraph..." }] }
    ],
    "pl": [
      { "_type": "block", "style": "h2", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Nagłówek sekcji" }] },
      { "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Szczegółowy akapit..." }] }
    ]
  },
  "seo": {
    "metaTitle": { "en": "...", "pl": "..." },
    "metaDescription": { "en": "...", "pl": "..." },
    "keywords": ["keyword1", "keyword2", "keyword3"]
  }
}

REQUIREMENTS:
- body.en AND body.pl MUST each have at least 5-8 blocks (mix h2/h3/normal styles)
- Each section must be 2-4 paragraphs with real, detailed, in-depth content (400-800 words per language)
- excerpt/description must be 1-2 compelling sentences
- slug must be lowercase with hyphens, derived from the English title
- keywords: 5-8 relevant SEO terms
- metaTitle: max 60 chars, metaDescription: max 160 chars
- Return ONLY the JSON object. No explanation, no markdown.`

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: jsonPrompt,
            max_completion_tokens: 4000,
            provider,
            model,
            isJson: false, // we parse manually since response_format:json_object varies by provider
          }),
        })

        const raw = await res.text()
        let data: any
        try { data = JSON.parse(raw) } catch { throw new Error('Server returned invalid response') }
        if (data.error) throw new Error(data.error.message || JSON.stringify(data.error))

        const aiText = data.text || ''
        const generated = extractJson(aiText)

        // ── Code-side normalization (not AI) ─────────────────────────────
        if (generated.body?.en) generated.body.en = ensureBlocks(generated.body.en)
        if (generated.body?.pl) generated.body.pl = ensureBlocks(generated.body.pl)

        // ── Patch to Sanity ──────────────────────────────────────────────
        setStatus('Saving to Sanity...')
        const docIdToPatch = documentId.startsWith('drafts.') ? documentId : `drafts.${documentId}`

        const patchData: any = {}
        if (generated.title)       patchData.title       = generated.title
        if (generated.slug)        patchData.slug         = generated.slug
        if (generated.body)        patchData.body         = generated.body
        if (generated.seo)         patchData.seo          = generated.seo
        if (generated.excerpt)     patchData.excerpt      = generated.excerpt
        if (generated.categories)  patchData.categories   = generated.categories
        if (generated.tags)        patchData.tags         = generated.tags
        if (generated.description) patchData.description  = generated.description
        if (generated.technologies) patchData.technologies = generated.technologies
        if (generated.projectUrl)  patchData.projectUrl   = generated.projectUrl
        if (generated.blogUrl)     patchData.blogUrl      = generated.blogUrl
        if (generated.githubUrl)   patchData.githubUrl    = generated.githubUrl

        await client.patch(docIdToPatch).set(patchData).commit()

        const filled = Object.keys(patchData).join(', ')
        assistantReply = `✅ Done! I filled the following fields: **${filled}**.\n\nThe document has been saved as a draft. Refresh the fields if they don't update immediately. Anything else to adjust?`

      } else {
        // ── CONVERSATIONAL REPLY (no JSON, no patching) ──────────────────
        setStatus('Replying...')

        const systemContent = `You are an expert AI Editor inside Sanity Studio. You help the user plan, discuss, and refine content for a ${isProject ? 'project portfolio' : 'blog post'} titled "${docTitle}". 
Be helpful, concise, and professional. When the user wants content written, remind them to ask you to "write" or "generate" it.
Context of existing CMS documents:\n${contextData}`

        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: [{ role: 'system', content: systemContent }, ...historyForAi],
            max_completion_tokens: 800,
            provider,
            model,
          }),
        })

        const raw = await res.text()
        let data: any
        try { data = JSON.parse(raw) } catch { throw new Error('Server returned invalid response') }
        if (data.error) throw new Error(data.error.message || JSON.stringify(data.error))
        assistantReply = data.text || data.message?.content || 'No response.'
      }

      saveMessages([...newMsgs, { role: 'assistant', content: assistantReply }])

    } catch (err: any) {
      const errMsg = `❌ Error: ${err.message}`
      saveMessages([...newMsgs, { role: 'assistant', content: errMsg }])
    } finally {
      setLoading(false)
      setStatus('')
    }
  }, [messages, input, documentId, documentType, titleEn, titlePl, contextData, provider, model, client, onChange])

  // ─── UI ────────────────────────────────────────────────────────────────────
  return (
    <Stack space={3}>
      <Card border padding={3} radius={2} tone="transparent">
        <Stack space={3}>

          {/* Header */}
          <Flex align="center" justify="space-between" paddingBottom={2}
            style={{ borderBottom: '1px solid var(--card-border-color)' }}>
            <Text weight="semibold" size={2}>🤖 AI Agent Copilot</Text>
            <Flex gap={2} align="center">
              <Box style={{ width: '170px' }}>
                <Select
                  value={provider}
                  onChange={(e: any) => handleProviderChange(e.currentTarget.value)}
                  fontSize={1} padding={2}
                >
                  <option value="gemini">Gemini 2.0 Flash</option>
                  <option value="groq">Groq (Llama 3 70B)</option>
                  <option value="openai">OpenAI (GPT-4o mini)</option>
                </Select>
              </Box>
              {status && (
                <Text size={0} muted style={{ fontStyle: 'italic', whiteSpace: 'nowrap' }}>
                  {status}
                </Text>
              )}
            </Flex>
          </Flex>

          {/* Chat area */}
          <Box ref={scrollRef} style={{ height: '320px', overflowY: 'auto', padding: '8px 0' }}>
            <Stack space={3}>
              {messages.length === 0 && !loading && (
                <Flex justify="center" align="center" style={{ height: '100%', paddingTop: '60px' }}>
                  <Stack space={2} style={{ textAlign: 'center' }}>
                    <Text muted size={2}>💬 Chat with the AI agent</Text>
                    <Text muted size={1}>Ask questions to plan content, or say <em>"write the full post"</em> to auto-fill all fields.</Text>
                  </Stack>
                </Flex>
              )}

              {messages
                .filter(m => m.role === 'user' || m.role === 'assistant')
                .map((m, i) => (
                  <Flex key={i} justify={m.role === 'user' ? 'flex-end' : 'flex-start'}>
                    <Card
                      padding={3} radius={3} shadow={1}
                      style={{
                        maxWidth: '88%',
                        backgroundColor: m.role === 'user'
                          ? 'var(--card-primary-bg-color)'
                          : 'var(--card-bg-color)',
                        color: m.role === 'user'
                          ? 'var(--card-primary-fg-color)'
                          : 'var(--card-fg-color)',
                      }}
                    >
                      <Text size={1} style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5 }}>
                        {m.content}
                      </Text>
                    </Card>
                  </Flex>
                ))}

              {loading && (
                <Flex justify="flex-start">
                  <Card padding={3} radius={3} shadow={1}>
                    <Flex gap={2} align="center">
                      <Spinner size={1} />
                      <Text size={1} muted>{status || 'AI is thinking...'}</Text>
                    </Flex>
                  </Card>
                </Flex>
              )}
            </Stack>
          </Box>

          {/* Input row */}
          <Flex gap={2} align="flex-end">
            <Box flex={1}>
              <TextArea
                value={input}
                onChange={(e: any) => setInput(e.currentTarget.value)}
                placeholder={'Chat, plan, or say "write the full post" to auto-fill all fields…'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
                }}
                disabled={loading}
                rows={2}
              />
            </Box>
            <Button
              text="Send"
              tone="primary"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
            />
          </Flex>

          {/* Clear chat */}
          {messages.length > 0 && (
            <Flex justify="flex-end">
              <Button
                text="Clear chat"
                mode="ghost"
                tone="critical"
                fontSize={1}
                padding={2}
                onClick={() => saveMessages([])}
              />
            </Flex>
          )}

        </Stack>
      </Card>
      <Box display="none">{props.renderDefault(props)}</Box>
    </Stack>
  )
}
