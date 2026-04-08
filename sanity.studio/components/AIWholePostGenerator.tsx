import { useCallback, useState, useEffect, useRef } from 'react'
import { Stack, Button, Spinner, TextArea, Text, Box, Card, Flex, Select } from '@sanity/ui'
import { set, useFormValue, useClient } from 'sanity'

// ─── Provider config ──────────────────────────────────────────────────────────
const PROVIDERS: Record<string, { label: string; model: string }> = {
  gemini: { label: 'Gemini 2.0 Flash', model: 'gemini-2.0-flash' },
  groq: { label: 'Groq (Llama 3.3)', model: 'llama-3.3-70b-versatile' },
  openai: { label: 'OpenAI (GPT-4o mini)', model: 'gpt-4o-mini' },
}

// ─── Portable Text Normalizer ─────────────────────────────────────────────────
// Converts whatever the AI returns into valid Sanity blockContent.
// Handles: string, string[], object[], mixed arrays.
function ensureBlocks(input: any): any[] {
  const rk = () => Math.random().toString(36).substring(2, 9)

  const mkBlock = (text: string, style = 'normal') => ({
    _type: 'block', _key: rk(), style, markDefs: [],
    children: [{ _type: 'span', _key: rk(), marks: [], text }],
  })

  if (!input) return []
  if (typeof input === 'string') {
    // Split by double-newline into paragraphs
    return input.split(/\n\n+/).filter(Boolean).map(p => {
      const trimmed = p.trim()
      if (trimmed.startsWith('### ')) return mkBlock(trimmed.replace(/^### /, ''), 'h3')
      if (trimmed.startsWith('## ')) return mkBlock(trimmed.replace(/^## /, ''), 'h2')
      if (trimmed.startsWith('# ')) return mkBlock(trimmed.replace(/^# /, ''), 'h1')
      return mkBlock(trimmed)
    })
  }
  if (!Array.isArray(input)) return []

  return input.map(block => {
    if (typeof block === 'string') return mkBlock(block)
    const children = Array.isArray(block.children)
      ? block.children.map((c: any) => ({
        _type: 'span', marks: [], ...c,
        _key: c._key || rk(),
        text: c.text ?? '',
      }))
      : [{ _type: 'span', _key: rk(), marks: [], text: '' }]

    return {
      markDefs: [], ...block,
      _type: 'block',
      _key: block._key || rk(),
      style: block.style || 'normal',
      children,
    }
  })
}

// ─── JSON extractor ───────────────────────────────────────────────────────────
function extractJson(text: string): any {
  let s = text.trim()
  if (s.startsWith('```')) s = s.replace(/^```(?:json)?\s*/m, '').replace(/\s*```\s*$/, '').trim()
  const i = s.indexOf('{'), j = s.lastIndexOf('}')
  if (i === -1 || j === -1) throw new Error('No JSON found in AI response')
  return JSON.parse(s.substring(i, j + 1))
}

// ─── Schema definitions (machine-readable for the AI prompt) ──────────────────
const SCHEMA_POST = `{
  "title": { "en": "English title", "pl": "Polish title" },
  "slug": { "_type": "slug", "current": "url-slug-from-english-title" },
  "excerpt": { "en": "Engaging 2-3 sentence summary in English (max 300 chars)", "pl": "Angażujące 2-3 zdaniowe podsumowanie po polsku (max 300 znaków)" },
  "categories": ["Dev"],  // allowed values: "Dev", "No-code", "Wellness"
  "tags": ["tag1", "tag2", "tag3"],
  "body": {
    "en": [
      { "_type": "block", "style": "h2", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Section Heading" }] },
      { "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Detailed paragraph text..." }] },
      { "_type": "block", "style": "h3", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Sub section" }] },
      { "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "More detailed content..." }] }
    ],
    "pl": [
      { "_type": "block", "style": "h2", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Nagłówek sekcji" }] },
      { "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Szczegółowy tekst akapitu..." }] }
    ]
  },
  "seo": {
    "metaTitle": { "en": "SEO Title (max 60 chars)", "pl": "Tytuł SEO (max 60 znaków)" },
    "metaDescription": { "en": "Compelling meta description (max 160 chars)", "pl": "Przekonujący opis meta (max 160 znaków)" },
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  }
}`

const SCHEMA_PROJECT = `{
  "title": { "en": "English title", "pl": "Polish title" },
  "slug": { "_type": "slug", "current": "url-slug-from-english-title" },
  "description": { "en": "Short project description in English (max 300 chars)", "pl": "Krótki opis projektu po polsku (max 300 znaków)" },
  "technologies": ["React", "TypeScript", "Node.js"],
  "projectUrl": "https://example.com",
  "blogUrl": "https://example.com/blog/related-post",
  "githubUrl": "https://github.com/user/repo",
  "body": {
    "en": [
      { "_type": "block", "style": "h2", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Project Overview" }] },
      { "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Detailed paragraph about the project..." }] },
      { "_type": "block", "style": "h2", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Technical Architecture" }] },
      { "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "More technical details..." }] }
    ],
    "pl": [
      { "_type": "block", "style": "h2", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Przegląd projektu" }] },
      { "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Szczegółowy akapit o projekcie..." }] }
    ]
  },
  "seo": {
    "metaTitle": { "en": "SEO Title (max 60 chars)", "pl": "Tytuł SEO (max 60 znaków)" },
    "metaDescription": { "en": "Compelling meta description (max 160 chars)", "pl": "Przekonujący opis meta (max 160 znaków)" },
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  }
}`

// ─── API URL helper ───────────────────────────────────────────────────────────
function getApiUrl() {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  // In production: use Edge Function (/api/ai-generate) which has 50s timeout
  // Locally: use regular function via netlify dev
  return isLocal
    ? 'http://localhost:8888/.netlify/functions/generateContent'
    : 'https://appcrates.pl/api/ai-generate'
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export const AIWholePostGenerator = (props: any) => {
  const { onChange, value } = props
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [provider, setProvider] = useState<'openai' | 'groq' | 'gemini'>('gemini')

  const client = useClient({ apiVersion: '2023-05-03' })
  const scrollRef = useRef<HTMLDivElement>(null)

  const documentId = useFormValue(['_id']) as string | undefined
  const documentType = useFormValue(['_type']) as string | undefined
  const titleEn = useFormValue(['title', 'en']) as string | undefined
  const titlePl = useFormValue(['title', 'pl']) as string | undefined

  // ── State: reference content (fetched once) ─────────────────────────────
  const [referenceContent, setReferenceContent] = useState('')

  // ── Restore saved messages ──────────────────────────────────────────────
  useEffect(() => {
    if (!value) return
    try { setMessages(JSON.parse(value)) } catch { /* ignore */ }
  }, [value])

  // ── Auto-scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  // ── Fetch reference content on mount ────────────────────────────────────
  useEffect(() => {
    if (!documentType) return
    const run = async () => {
      try {
        // All doc titles for linking context
        const allDocs = await client.fetch(
          `*[_type in ["pages","post","project"]]{ _type, "en": title.en, "pl": title.pl, "slug": slug.current, "techs": technologies }`
        )
        const titles = allDocs.map((d: any) =>
          `- [${d._type}] ${d.en || d.pl || '?'} (/${d.slug || '?'})${d.techs?.length ? ` [${d.techs.join(',')}]` : ''}`
        ).join('\n')

        // 2 published reference docs of same type
        const refs = await client.fetch(
          `*[_type == $t && defined(body.en) && !(_id in path("drafts.**"))][0...2]{
            "en": title.en, "pl": title.pl,
            "exc": coalesce(excerpt.en, description.en),
            "body": pt::text(body.en),
            "tags": tags, "techs": technologies,
            "seoTitle": seo.metaTitle.en, "seoDesc": seo.metaDescription.en, "seoKw": seo.keywords
          }`, { t: documentType }
        )

        let refBlock = ''
        if (refs?.length) {
          refBlock = '\n\n=== PUBLISHED REFERENCE EXAMPLES (match this quality, length, and structure) ===\n' +
            refs.map((r: any, i: number) =>
              `--- Example ${i + 1} ---\nTitle: ${r.en || r.pl}\nSummary: ${r.exc || 'n/a'}\nTags: ${r.tags?.join(', ') || r.techs?.join(', ') || 'n/a'}\nSEO Title: ${r.seoTitle || 'n/a'}\nSEO Desc: ${r.seoDesc || 'n/a'}\nSEO Keywords: ${r.seoKw?.join(', ') || 'n/a'}\nBody (first 1200 chars):\n${r.body?.substring(0, 1200) || 'n/a'}...`
            ).join('\n\n') +
            '\n==============================================='
        }

        setReferenceContent(titles + refBlock)
      } catch (e) {
        console.error('Reference fetch failed', e)
      }
    }
    run()
  }, [client, documentType])

  // ── Save messages ───────────────────────────────────────────────────────
  const saveMessages = (msgs: any[]) => {
    setMessages(msgs)
    onChange(set(JSON.stringify(msgs)))
  }

  // ── Fetch linked content by slug ────────────────────────────────────────
  // Detects slug mentions in user input (e.g. "glow-and-serenity" or "/glow-and-serenity")
  // and fetches the full document body text from Sanity
  const fetchLinkedContent = async (userInput: string): Promise<string> => {
    try {
      // Extract potential slugs: words with hyphens that look like slugs
      const slugMatches = userInput.match(/\/?([a-z0-9](?:[a-z0-9-]*[a-z0-9]))/gi)
      if (!slugMatches || slugMatches.length === 0) return ''

      const cleanSlugs = slugMatches
        .map(s => s.replace(/^\//, '').toLowerCase())
        .filter(s => s.includes('-') && s.length > 3) // only slug-like strings

      if (cleanSlugs.length === 0) return ''

      // Query Sanity for documents matching these slugs
      const docs = await client.fetch(
        `*[slug.current in $slugs]{
          _type, "en": title.en, "pl": title.pl, "slug": slug.current,
          "desc": coalesce(description.en, excerpt.en),
          "bodyText": pt::text(body.en),
          "techs": technologies, "tags": tags,
          "seoTitle": seo.metaTitle.en, "seoDesc": seo.metaDescription.en
        }`,
        { slugs: cleanSlugs }
      )

      if (!docs || docs.length === 0) return ''

      return '\n\n=== LINKED DOCUMENT CONTENT (user referenced these — use as source material) ===\n' +
        docs.map((d: any) =>
          `TYPE: ${d._type}\nTITLE: ${d.en || d.pl}\nSLUG: /${d.slug}\nDESCRIPTION: ${d.desc || 'n/a'}\nTECHNOLOGIES: ${d.techs?.join(', ') || d.tags?.join(', ') || 'n/a'}\nSEO: ${d.seoTitle || ''} — ${d.seoDesc || ''}\n\nFULL BODY CONTENT:\n${d.bodyText || 'No body content'}`
        ).join('\n\n---\n') +
        '\n======================================================'
    } catch (e) {
      console.error('Linked content fetch failed', e)
      return ''
    }
  }

  // ── Call AI backend ─────────────────────────────────────────────────────
  const callAI = async (prompt: string, opts?: { isJson?: boolean; maxTokens?: number }) => {
    const apiUrl = getApiUrl()
    const payload = {
      prompt,
      max_completion_tokens: opts?.maxTokens || 4000,
      provider,
      model: PROVIDERS[provider].model,
      isJson: opts?.isJson && provider !== 'gemini',
    }

    console.log(`[AI DEBUG] ──────────────────────────────────────`)
    console.log(`[AI DEBUG] Provider: ${provider}, Model: ${payload.model}`)
    console.log(`[AI DEBUG] URL: ${apiUrl}`)
    console.log(`[AI DEBUG] Tokens: ${payload.max_completion_tokens}, JSON mode: ${payload.isJson}`)
    console.log(`[AI DEBUG] Prompt length: ${prompt.length} chars`)

    const startTime = Date.now()

    let res: Response
    try {
      res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } catch (fetchErr: any) {
      const elapsed = Date.now() - startTime
      console.error(`[AI DEBUG] ❌ FETCH FAILED after ${elapsed}ms:`, fetchErr.message)
      console.error(`[AI DEBUG] This is likely a Netlify timeout (10s free tier limit) or network error.`)
      throw new Error(`Network error after ${elapsed}ms: ${fetchErr.message}. If using OpenAI, try Groq or Gemini (they're faster and avoid Netlify's 10s timeout).`)
    }

    const elapsed = Date.now() - startTime
    console.log(`[AI DEBUG] Response received in ${elapsed}ms`)
    console.log(`[AI DEBUG] Status: ${res.status} ${res.statusText}`)
    console.log(`[AI DEBUG] Content-Type: ${res.headers.get('content-type')}`)

    const raw = await res.text()
    console.log(`[AI DEBUG] Response body length: ${raw.length} chars`)
    console.log(`[AI DEBUG] Response preview: ${raw.substring(0, 300)}...`)

    if (!res.ok) {
      console.error(`[AI DEBUG] ❌ HTTP ${res.status}:`, raw.substring(0, 500))
      throw new Error(`HTTP ${res.status} from ${provider} after ${elapsed}ms: ${raw.substring(0, 200)}`)
    }

    let data: any
    try {
      data = JSON.parse(raw)
    } catch {
      console.error(`[AI DEBUG] ❌ Failed to parse JSON response`)
      throw new Error(`Server returned non-JSON after ${elapsed}ms:\n${raw.substring(0, 300)}`)
    }

    if (data.error) {
      const errMsg = typeof data.error === 'string' ? data.error : data.error.message || JSON.stringify(data.error)
      console.error(`[AI DEBUG] ❌ API error:`, errMsg)
      throw new Error(errMsg)
    }

    console.log(`[AI DEBUG] ✅ Success! Response text length: ${(data.text || '').length} chars`)
    console.log(`[AI DEBUG] ──────────────────────────────────────`)
    return data.text || ''
  }

  // ── Patch document in Sanity ────────────────────────────────────────────
  const patchDocument = async (generated: any) => {
    const isProject = documentType === 'project'

    // Normalize portable text blocks (pure code — no AI involved)
    if (generated.body?.en) generated.body.en = ensureBlocks(generated.body.en)
    if (generated.body?.pl) generated.body.pl = ensureBlocks(generated.body.pl)

    // Build patch object — only include fields that the AI actually returned
    const patch: any = {}
    if (generated.title) patch.title = generated.title
    if (generated.slug) patch.slug = generated.slug
    if (generated.body) patch.body = generated.body
    if (generated.seo) patch.seo = generated.seo
    if (generated.tags) patch.tags = generated.tags
    if (generated.publishedAt) patch.publishedAt = generated.publishedAt

    if (isProject) {
      if (generated.description) patch.description = generated.description
      if (generated.technologies) patch.technologies = generated.technologies
      if (generated.projectUrl) patch.projectUrl = generated.projectUrl
      if (generated.blogUrl) patch.blogUrl = generated.blogUrl
      if (generated.githubUrl) patch.githubUrl = generated.githubUrl
    } else {
      if (generated.excerpt) patch.excerpt = generated.excerpt
      if (generated.categories) patch.categories = generated.categories
    }

    const docId = documentId!.startsWith('drafts.') ? documentId! : `drafts.${documentId}`
    await client.patch(docId).set(patch).commit()

    return Object.keys(patch)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SEND MESSAGE
  // ═══════════════════════════════════════════════════════════════════════════
  const sendMessage = useCallback(async () => {
    if (!documentId) { alert('Save the document first.'); return }
    if (!input.trim()) return

    const isProject = documentType === 'project'
    const docTitle = titleEn || titlePl || 'Untitled'
    const schemaJson = isProject ? SCHEMA_PROJECT : SCHEMA_POST
    const typeLabel = isProject ? 'project portfolio entry' : 'blog post'

    const userMsg = { role: 'user', content: input.trim() }
    const newMsgs = [...messages, userMsg]
    saveMessages(newMsgs)
    setInput('')
    setLoading(true)

    try {
      // ── Fetch linked content if user mentioned slugs ───────────────────
      setStatus('Checking for linked content...')
      const linkedContent = await fetchLinkedContent(input)
      const fullContext = referenceContent + linkedContent

      // ── Is this a question / chat, or a generation request? ────────────
      const isQuestion = /^\s*(what|how|why|when|who|where|can you|could you|tell me|do you|should|is it|are there|which|jakie|jak|dlaczego|czy|co|kiedy)/i.test(input) || input.trim().endsWith('?')

      let reply = ''

      if (isQuestion) {
        // ── CHAT MODE (lightweight, no patching) ─────────────────────────
        setStatus('Thinking...')
        reply = await callAI(
          `You are an expert AI content editor helping with a ${typeLabel} titled "${docTitle}" inside a Sanity CMS.\n\nCMS Context:\n${fullContext}\n\nConversation so far:\n${newMsgs.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}\n\nRespond helpfully and concisely.`,
          { maxTokens: 800 }
        )
      } else {
        // ── GENERATION MODE — produce JSON, parse in code, patch ─────────
        // Uses Edge Function with 50s timeout, so single-shot works for all providers.
        setStatus('Generating all fields...')
        const prompt = `You are an expert bilingual (English + Polish) SEO copywriter.

TASK: Generate a COMPLETE ${typeLabel} for: "${docTitle}"

USER INSTRUCTIONS: ${input}

EXISTING CMS CONTENT (avoid duplicating, suggest internal links):
${fullContext}

CRITICAL RULES:
1. Return ONLY valid JSON — no markdown fences, no explanation.
2. Fill EVERY field. No field may be empty or null.
3. body.en AND body.pl: 6-10 blocks each, 700-1000 words, mix h2/h3/normal styles.
4. excerpt/description: 2-3 sentences (max 300 chars per language).
5. slug: lowercase-with-hyphens from English title.
6. seo.metaTitle: max 60 chars. seo.metaDescription: max 160 chars.
7. seo.keywords: 5-8 terms. tags/technologies: 4-8 items.
${isProject ? '8. URLs: use "https://example.com" if unknown.' : '8. categories: ONLY "Dev", "No-code", or "Wellness".'}
9. Body blocks: { "_type": "block", "style": "...", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "..." }] }

JSON SCHEMA:
${schemaJson}`

        const aiText = await callAI(prompt, { isJson: true, maxTokens: 4000 })
        const generated = extractJson(aiText)

        // ── Parse + Validate (code-side) ─────────────────────────────────
        setStatus('Validating...')

        // ── Validate minimum fields ────────────────────────────────────
        const requiredKeys = isProject
          ? ['title', 'slug', 'description', 'technologies', 'body', 'seo']
          : ['title', 'slug', 'excerpt', 'categories', 'tags', 'body', 'seo']

        const missing = requiredKeys.filter(k => !generated[k])
        if (missing.length > 0) {
          throw new Error(`AI missed fields: ${missing.join(', ')}. Try again.`)
        }

        // ── Patch to Sanity (code-side) ────────────────────────────────
        setStatus('Saving to Sanity...')
        const keys = await patchDocument(generated)
        reply = `✅ Document updated!\n\nFilled fields: ${keys.join(', ')}\n\nRefresh if fields don't update immediately.`
      }

      saveMessages([...newMsgs, { role: 'assistant', content: reply }])

    } catch (err: any) {
      saveMessages([...newMsgs, { role: 'assistant', content: `❌ Error: ${err.message}` }])
    } finally {
      setLoading(false)
      setStatus('')
    }
  }, [messages, input, documentId, documentType, titleEn, titlePl, referenceContent, provider, client, onChange])

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════
  return (
    <Stack space={3}>
      <Card border padding={3} radius={2} tone="transparent">
        <Stack space={3}>

          {/* ── Header ─────────────────────────────────────────────────────── */}
          <Flex align="center" justify="space-between" paddingBottom={2}
            style={{ borderBottom: '1px solid var(--card-border-color)' }}>
            <Text weight="semibold" size={2}>🤖 AI Agent Copilot</Text>
            <Flex gap={2} align="center">
              <Box style={{ width: '175px' }}>
                <Select
                  value={provider}
                  onChange={(e: any) => setProvider(e.currentTarget.value)}
                  fontSize={1} padding={2}
                >
                  {Object.entries(PROVIDERS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </Select>
              </Box>
              {status && (
                <Flex gap={1} align="center">
                  <Spinner size={0} />
                  <Text size={0} muted style={{ fontStyle: 'italic', whiteSpace: 'nowrap' }}>{status}</Text>
                </Flex>
              )}
            </Flex>
          </Flex>

          {/* ── Chat messages ───────────────────────────────────────────────── */}
          <Box ref={scrollRef} style={{ height: '320px', overflowY: 'auto', padding: '8px 0' }}>
            <Stack space={3}>
              {messages.length === 0 && !loading && (
                <Flex justify="center" align="center" style={{ paddingTop: '40px' }}>
                  <Stack space={2} style={{ textAlign: 'center', maxWidth: '85%' }}>
                    <Text muted size={2}>💬 AI Content Agent</Text>
                    <Text muted size={1}>
                      Type any request to auto-fill ALL fields (title, body EN+PL, SEO, tags, etc).
                    </Text>
                    <Text muted size={1}>
                      End your message with <strong>?</strong> to chat/discuss without generating.
                    </Text>
                  </Stack>
                </Flex>
              )}

              {messages
                .filter(m => m.role === 'user' || m.role === 'assistant')
                .map((m, i) => (
                  <Flex key={i} justify={m.role === 'user' ? 'flex-end' : 'flex-start'}>
                    <Card padding={3} radius={3} shadow={1}
                      style={{
                        maxWidth: '88%',
                        backgroundColor: m.role === 'user'
                          ? 'var(--card-primary-bg-color)' : 'var(--card-bg-color)',
                        color: m.role === 'user'
                          ? 'var(--card-primary-fg-color)' : 'var(--card-fg-color)',
                      }}>
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
                      <Text size={1} muted>{status || 'AI is working...'}</Text>
                    </Flex>
                  </Card>
                </Flex>
              )}
            </Stack>
          </Box>

          {/* ── Input ──────────────────────────────────────────────────────── */}
          <Flex gap={2} align="flex-end">
            <Box flex={1}>
              <TextArea
                value={input}
                onChange={(e: any) => setInput(e.currentTarget.value)}
                placeholder={'Describe what to generate, e.g. "Write a post about React Server Components"'}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() }
                }}
                disabled={loading}
                rows={2}
              />
            </Box>
            <Button text="Send" tone="primary" onClick={sendMessage} disabled={loading || !input.trim()} />
          </Flex>

          {messages.length > 0 && (
            <Flex justify="flex-end">
              <Button text="Clear chat" mode="ghost" tone="critical" fontSize={1} padding={2}
                onClick={() => saveMessages([])} />
            </Flex>
          )}

        </Stack>
      </Card>
      <Box display="none">{props.renderDefault(props)}</Box>
    </Stack>
  )
}
