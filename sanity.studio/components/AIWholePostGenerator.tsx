import { useCallback, useState, useEffect, useRef } from 'react'
import { Stack, Button, Spinner, TextArea, Text, Box, Card, Flex, Select, TextInput } from '@sanity/ui'
import { set, useFormValue, useClient } from 'sanity'
import {
  rebuildPortableTextFromTranslation,
  serializePortableTextForTranslation,
} from './portableTextAi'

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

// ─── Provider config ──────────────────────────────────────────────────────────
const PROVIDERS: Record<string, { label: string; model: string }> = {
  groq: { label: 'Groq (Llama 3.3)', model: 'llama-3.3-70b-versatile' },
  openai: { label: 'OpenAI', model: 'gpt-5.4-thinking' },
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
  "categories": ["Dev"],
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

const SCHEMA_SERVICE_LANDING = `{
  "title": { "en": "English service title", "pl": "Polski tytuł usługi" },
  "slug": { "_type": "slug", "current": "url-slug-from-english-title" },
  "serviceType": "website-development",
  "city": "Warszawa",
  "isLocalLanding": true,
  "eyebrow": { "en": "Service", "pl": "Usługa" },
  "intro": { "en": "2-3 sentence service intro", "pl": "2-3 zdaniowy intro usługi" },
  "problems": {
    "en": ["Problem 1", "Problem 2", "Problem 3"],
    "pl": ["Problem 1", "Problem 2", "Problem 3"]
  },
  "deliverables": {
    "en": ["Deliverable 1", "Deliverable 2", "Deliverable 3"],
    "pl": ["Element 1", "Element 2", "Element 3"]
  },
  "processSteps": {
    "en": ["Step 1", "Step 2", "Step 3", "Step 4"],
    "pl": ["Krok 1", "Krok 2", "Krok 3", "Krok 4"]
  },
  "faq": {
    "en": [
      { "question": "Question 1", "answer": "Answer 1" },
      { "question": "Question 2", "answer": "Answer 2" }
    ],
    "pl": [
      { "question": "Pytanie 1", "answer": "Odpowiedź 1" },
      { "question": "Pytanie 2", "answer": "Odpowiedź 2" }
    ]
  },
  "content": {
    "en": [
      { "_type": "block", "style": "h2", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Section Heading" }] },
      { "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Detailed section copy..." }] }
    ],
    "pl": [
      { "_type": "block", "style": "h2", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Nagłówek sekcji" }] },
      { "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Szczegółowa treść sekcji..." }] }
    ]
  },
  "ctaLabel": { "en": "Book a free call", "pl": "Umów bezpłatną konsultację" },
  "ctaSecondaryLabel": { "en": "View projects", "pl": "Zobacz realizacje" },
  "stats": {
    "en": [
      { "value": "2-4 weeks", "label": "typical launch timeline" },
      { "value": "100%", "label": "custom implementation" }
    ],
    "pl": [
      { "value": "2-4 tygodnie", "label": "typowy czas wdrożenia" },
      { "value": "100%", "label": "indywidualne wykonanie" }
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

// ── API URL helper ───────────────────────────────────────────────────────────
function getApiUrl() {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname)
  return isLocal
    ? 'http://localhost:8888/api/ai-generate'
    : 'https://appcrates.pl/api/ai-generate'
}

function isPlainObject(value: any) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function mergeGeneratedValue(existing: any, incoming: any): any {
  if (!isPlainObject(existing) || !isPlainObject(incoming)) return incoming
  const merged: Record<string, any> = { ...existing }
  Object.keys(incoming).forEach((key) => {
    merged[key] = mergeGeneratedValue(existing?.[key], incoming[key])
  })
  return merged
}

function uniqueKeys(keys: string[]) {
  return Array.from(new Set(keys))
}

function normalizeForMatch(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function includesAny(text: string, terms: string[]) {
  return terms.some((term) => text.includes(term))
}

function requestWantsFullGeneration(input: string) {
  const normalized = normalizeForMatch(input)
  return includesAny(normalized, [
    'all fields',
    'all',
    'everything',
    'whole document',
    'full document',
    'generate all',
    'complete',
    'calosc',
    'całość',
    'wszystko',
    'pelny',
    'pełny',
    'pelna',
    'pełna',
    'kompletn',
    'cala strone',
    'całą stronę',
  ])
}

function detectLanguageScope(input: string): 'en' | 'pl' | 'both' {
  const normalized = normalizeForMatch(input)
  const asksPolish = includesAny(normalized, ['polish', 'po polsku', 'w jezyku polskim', 'po pol', 'pl '])
  const asksEnglish = includesAny(normalized, ['english', 'po angielsku', 'w jezyku angielskim', 'en '])

  if (asksPolish && !asksEnglish) return 'pl'
  if (asksEnglish && !asksPolish) return 'en'
  return 'both'
}

function detectTargetFields(input: string, documentType?: string): string[] {
  const normalized = normalizeForMatch(input)
  const matched = new Set<string>()

  const detect = (field: string, aliases: string[]) => {
    if (normalized.includes(field.toLowerCase()) || includesAny(normalized, aliases)) {
      matched.add(field)
    }
  }

  // Common fields
  detect('title', ['tytul', 'naglowek', 'headline'])
  detect('slug', ['url', 'adres', 'sluga'])
  detect('seo', [
    'seo',
    'meta',
    'meta title',
    'meta description',
    'keywords',
    'slowa kluczowe',
    'słowa kluczowe',
    'canonical',
    'og image',
  ])
  detect('publishedAt', ['published at', 'publish date', 'data publikacji'])

  if (documentType === 'serviceLanding') {
    detect('serviceType', ['service type', 'typ uslugi', 'typ usługi'])
    detect('city', ['city', 'miasto'])
    detect('isLocalLanding', ['local landing', 'lokalna strona', 'local page'])
    detect('eyebrow', ['eyebrow', 'section label', 'labelka', 'etykieta'])
    detect('intro', ['intro', 'subtitle', 'subheadline', 'wstep', 'wstęp'])
    detect('problems', ['problems', 'pain points', 'problemy'])
    detect('deliverables', ['deliverables', 'what client gets', 'zakres', 'co klient dostaje'])
    detect('processSteps', ['process', 'steps', 'kroki', 'etapy'])
    detect('faq', ['faq', 'pytania', 'questions'])
    detect('content', ['content', 'body', 'rich content', 'tresc', 'treść'])
    detect('ctaLabel', ['cta', 'primary cta', 'button label', 'przycisk glowny', 'przycisk główny'])
    detect('ctaSecondaryLabel', ['secondary cta', 'drugi przycisk', 'outline cta'])
    detect('stats', ['stats', 'numbers', 'kpi', 'statystyki', 'liczby'])
    return Array.from(matched)
  }

  if (documentType === 'project') {
    detect('description', ['description', 'opis'])
    detect('technologies', ['technologies', 'tech stack', 'stack', 'technologie'])
    detect('projectUrl', ['project url', 'demo url', 'link projektu'])
    detect('blogUrl', ['blog url', 'link do bloga'])
    detect('githubUrl', ['github', 'repo'])
    detect('body', ['body', 'content', 'tresc', 'treść'])
    return Array.from(matched)
  }

  // post/pages fallback
  detect('excerpt', ['excerpt', 'summary', 'zajawka', 'streszczenie'])
  detect('categories', ['categories', 'kategorie'])
  detect('tags', ['tags', 'tagi'])
  detect('body', ['body', 'content', 'tresc', 'treść'])

  return Array.from(matched)
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
  const [provider, setProvider] = useState<'openai' | 'groq'>('openai')
  const [model, setModel] = useState<string>(PROVIDERS.openai.model)

  const client = useClient({ apiVersion: '2023-05-03' })
  const scrollRef = useRef<HTMLDivElement>(null)
  const workingDocumentRef = useRef<Record<string, any> | undefined>(undefined)

  const documentValue = useFormValue([]) as Record<string, any> | undefined
  const documentId = useFormValue(['_id']) as string | undefined
  const documentType = useFormValue(['_type']) as string | undefined
  const titleEn = useFormValue(['title', 'en']) as string | undefined
  const titlePl = useFormValue(['title', 'pl']) as string | undefined

  const bodyEnBlocks = useFormValue(['body', 'en']) as any[] | undefined
  const bodyPlBlocks = useFormValue(['body', 'pl']) as any[] | undefined
  const contentEnBlocks = useFormValue(['content', 'en']) as any[] | undefined
  const contentPlBlocks = useFormValue(['content', 'pl']) as any[] | undefined
  const extractText = (blocks: any[]) => Array.isArray(blocks) ? blocks.map((b: any) => b.children?.map((c: any) => c.text).join('')).join('\n') : ''
  const selectedPreset = MODEL_OPTIONS[provider].some((option) => option.value === model)
    ? model
    : '__custom__'

  // ── State: reference content (fetched once) ─────────────────────────────
  const [referenceContent, setReferenceContent] = useState('')

  // ── Restore saved messages ──────────────────────────────────────────────
  useEffect(() => {
    if (!value) return
    try { setMessages(JSON.parse(value)) } catch { }
  }, [value])

  // ── Auto-scroll ─────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    workingDocumentRef.current = documentValue
  }, [documentValue])

  // ── Fetch reference content on mount ────────────────────────────────────
  useEffect(() => {
    if (!documentType) return
    const run = async () => {
      try {
        const allDocs = await client.fetch(
          `*[_type in ["pages","post","project","serviceLanding"]]{ _type, "en": title.en, "pl": title.pl, "slug": slug.current, "techs": technologies }`
        )
        const titles = allDocs.map((d: any) =>
          `- [${d._type}] ${d.en || d.pl || '?'} (/${d.slug || '?'})${d.techs?.length ? ` [${d.techs.join(',')}]` : ''}`
        ).join('\n')

        const refs = await client.fetch(
          `*[_type == $t && defined(coalesce(body.en, content.en)) && !(_id in path("drafts.**"))][0...2]{
            "en": title.en, "pl": title.pl,
            "exc": coalesce(excerpt.en, description.en, intro.en),
            "body": pt::text(coalesce(body.en, content.en)),
            "tags": tags, "techs": technologies,
            "seoTitle": seo.metaTitle.en, "seoDesc": seo.metaDescription.en, "seoKw": seo.keywords
          }`, { t: documentType }
        )

        let refBlock = ''
        if (refs?.length) {
          refBlock = '\n\n=== PUBLISHED REFERENCE EXAMPLES (quality benchmark only — never copy wording or structure too closely) ===\n' +
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
      const slugMatches = userInput.match(/\/?([a-z0-9](?:[a-z0-9-]*[a-z0-9]))/gi)
      if (!slugMatches || slugMatches.length === 0) return ''

      const cleanSlugs = slugMatches
        .map(s => s.replace(/^\//, '').toLowerCase())
        .filter(s => s.includes('-') && s.length > 3)

      if (cleanSlugs.length === 0) return ''

      const docs = await client.fetch(
        `*[slug.current in $slugs]{
          _type, "en": title.en, "pl": title.pl, "slug": slug.current,
          "desc": coalesce(description.en, excerpt.en, intro.en),
          "bodyText": pt::text(coalesce(body.en, content.en)),
          "techs": technologies, "tags": tags,
          "seoTitle": seo.metaTitle.en, "seoDesc": seo.metaDescription.en
        }`,
        { slugs: cleanSlugs }
      )

      if (!docs || docs.length === 0) return ''

      return '\n\n=== LINKED DOCUMENT CONTENT (user referenced these — use as source material, but do not copy it verbatim) ===\n' +
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
  const callAI = async (prompt: string, opts?: { isJson?: boolean; maxTokens?: number; systemPrompt?: string; temperature?: number }) => {
    const apiUrl = getApiUrl()
    const payload = {
      prompt,
      systemPrompt: opts?.systemPrompt,
      max_completion_tokens: opts?.maxTokens || 4000,
      provider,
      model: model.trim() || PROVIDERS[provider].model,
      isJson: opts?.isJson,
      temperature: opts?.temperature,
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
      throw new Error(`Network error after ${elapsed}ms: ${fetchErr.message}. If OpenAI is timing out on a heavy model, try Groq or use a lighter OpenAI model.`)
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
  const translatePortableTextField = async (
    fieldName: 'body' | 'content',
    targetLanguage: 'en' | 'pl',
    systemPrompt: string,
    userRequest: string
  ) => {
    const sourceLanguage = targetLanguage === 'en' ? 'pl' : 'en'
    const sourceDocument = workingDocumentRef.current || documentValue || {}
    const sourceNodes = Array.isArray(sourceDocument?.[fieldName]?.[sourceLanguage])
      ? sourceDocument[fieldName][sourceLanguage]
      : []

    if (!sourceNodes.length) return null

    const translatedText = await callAI(
      `You are a senior bilingual content localizer working inside a Sanity CMS.

TASK:
Translate ${fieldName}.${sourceLanguage} into ${fieldName}.${targetLanguage}.

USER REQUEST:
${userRequest}

CRITICAL RULES:
1. Keep EXACTLY the same node indexes and node order.
2. For "_type":"block", translate each item in "texts" naturally and preserve the same count whenever possible.
3. For "_type":"image", keep the image itself. Translate "alt" and "caption" only if they already exist.
4. For "_type":"code" and any other non-text nodes, keep only the index and "_type". Do not invent translated code.
5. Return ONLY valid JSON in this exact shape:
{ "nodes": [{ "index": 0, "_type": "block", "texts": ["..."] }] }

SOURCE STRUCTURE TO TRANSLATE:
${JSON.stringify(serializePortableTextForTranslation(sourceNodes), null, 2)}`,
      {
        isJson: true,
        maxTokens: 2600,
        systemPrompt,
        temperature: 0.35,
      }
    )

    const translatedData = extractJson(translatedText)
    const translatedNodes = Array.isArray(translatedData?.nodes) ? translatedData.nodes : []

    if (!translatedNodes.length) {
      throw new Error(`AI did not return translated nodes for ${fieldName}.${targetLanguage}.`)
    }

    return {
      [fieldName]: {
        [targetLanguage]: rebuildPortableTextFromTranslation(sourceNodes, translatedNodes),
      },
    }
  }

  const patchDocument = async (generated: any) => {
    const isProject = documentType === 'project'
    const isServiceLanding = documentType === 'serviceLanding'

    if (generated.body?.en) generated.body.en = ensureBlocks(generated.body.en)
    if (generated.body?.pl) generated.body.pl = ensureBlocks(generated.body.pl)
    if (generated.content?.en) generated.content.en = ensureBlocks(generated.content.en)
    if (generated.content?.pl) generated.content.pl = ensureBlocks(generated.content.pl)

    const patch: any = {}
    const sourceDocument = workingDocumentRef.current || documentValue || {}
    const setMergedField = (field: string) => {
      if (generated[field] !== undefined) patch[field] = mergeGeneratedValue(sourceDocument?.[field], generated[field])
    }

    setMergedField('title')
    setMergedField('slug')
    setMergedField('body')
    setMergedField('seo')
    setMergedField('tags')
    if (generated.publishedAt !== undefined) patch.publishedAt = generated.publishedAt

    if (isServiceLanding) {
      if (generated.serviceType !== undefined) patch.serviceType = generated.serviceType
      if (generated.city !== undefined) patch.city = generated.city
      if (generated.isLocalLanding !== undefined) patch.isLocalLanding = generated.isLocalLanding
      setMergedField('eyebrow')
      setMergedField('intro')
      setMergedField('problems')
      setMergedField('deliverables')
      setMergedField('processSteps')
      setMergedField('faq')
      setMergedField('content')
      setMergedField('ctaLabel')
      setMergedField('ctaSecondaryLabel')
      setMergedField('stats')
    } else if (isProject) {
      setMergedField('description')
      setMergedField('technologies')
      setMergedField('projectUrl')
      setMergedField('blogUrl')
      setMergedField('githubUrl')
    } else {
      setMergedField('excerpt')
      setMergedField('categories')
    }

    if (Object.keys(patch).length === 0) return []

    const docId = documentId!.startsWith('drafts.') ? documentId! : `drafts.${documentId}`
    await client.patch(docId).set(patch).commit()
    workingDocumentRef.current = mergeGeneratedValue(sourceDocument, patch)

    return Object.keys(patch)
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SEND MESSAGE
  // ═══════════════════════════════════════════════════════════════════════════
  const sendMessage = useCallback(async () => {
    if (!documentId) { alert('Save the document first.'); return }
    if (!input.trim()) return

    const isProject = documentType === 'project'
    const isServiceLanding = documentType === 'serviceLanding'
    const docTitle = titleEn || titlePl || 'Untitled'
    const schemaJson = isServiceLanding ? SCHEMA_SERVICE_LANDING : (isProject ? SCHEMA_PROJECT : SCHEMA_POST)
    const typeLabel = isServiceLanding ? 'service landing page' : (isProject ? 'project portfolio entry' : 'blog post')
    const systemPrompt = `You are a senior bilingual SEO content strategist and editor working inside a Sanity CMS. Follow the user's latest request exactly. Reference examples are quality benchmarks only and must never be copied. If source material is provided, transform it into a better version that matches the requested style, purpose, and SEO intent. Never leave requested English or Polish fields empty. Return exactly the format requested by the user.`
    const promptBehaviorRules = `NON-NEGOTIABLE RULES:
- Follow the USER REQUEST exactly.
- PUBLISHED REFERENCE EXAMPLES are for quality benchmarking only. Never copy their wording or structure.
- LINKED DOCUMENT CONTENT and CURRENT TEXT IN EDITOR are source material to rewrite, expand, adapt, or translate. Do not echo them verbatim.
- Never copy more than 8 consecutive words from the source material unless it is a required proper noun, brand name, URL, or technical term.
- If the user asks for a rewrite or specific tone, prioritize the requested transformation over preserving the original phrasing.
- Keep the output concrete, useful, SEO-friendly, and complete.`

    const userMsg = { role: 'user', content: input.trim() }
    const newMsgs = [...messages, userMsg]
    saveMessages(newMsgs)
    setInput('')
    setLoading(true)

    try {
      // ── Fetch linked content if user mentioned slugs ───────────────────
      setStatus('Checking for linked content...')
      const linkedContent = await fetchLinkedContent(input)

      const sourceEnBlocks = isServiceLanding ? (contentEnBlocks || []) : (bodyEnBlocks || [])
      const sourcePlBlocks = isServiceLanding ? (contentPlBlocks || []) : (bodyPlBlocks || [])
      const currentBodyEnText = extractText(sourceEnBlocks)
      const currentBodyPlText = extractText(sourcePlBlocks)

      let currentDraftText = ''
      if (currentBodyEnText || currentBodyPlText) {
        currentDraftText = `\n\n=== CURRENT TEXT IN EDITOR (Use this as source material to rewrite, improve, expand, or translate according to the user's prompt. Preserve the facts, but do not copy the wording verbatim.) ===\n`
        if (currentBodyEnText) currentDraftText += `[ENGLISH EDITOR FIELD]:\n${currentBodyEnText}\n`
        if (currentBodyPlText) currentDraftText += `[POLISH EDITOR FIELD]:\n${currentBodyPlText}\n`
        currentDraftText += `========================================================================\n`
      }

      const fullContext = referenceContent + linkedContent + currentDraftText
      const isQuestion = /^\s*(what|how|why|when|who|where|can you|could you|tell me|do you|should|is it|are there|which|jakie|jak|dlaczego|czy|co|kiedy)/i.test(input) || input.trim().endsWith('?')
      const wantsFullGeneration = requestWantsFullGeneration(input)
      const requestedFields = detectTargetFields(input, documentType)
      const languageScope = detectLanguageScope(input)
      const runTargetedUpdate = !isQuestion && !wantsFullGeneration && requestedFields.length > 0

      let reply = ''

      if (isQuestion) {
        // ── CHAT MODE (lightweight, no patching) ─────────────────────────
        setStatus('Thinking...')
        reply = await callAI(
          `You are helping with a ${typeLabel} titled "${docTitle}" inside a Sanity CMS.\n\nCMS Context:\n${fullContext}\n\nConversation so far:\n${newMsgs.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n')}\n\nRespond helpfully and concisely.`,
          { maxTokens: 800, systemPrompt, temperature: 0.5 }
        )
      } else if (runTargetedUpdate) {
        setStatus('Updating requested fields only...')
        const sourceDocument = workingDocumentRef.current || documentValue || {}
        const portableTextField = isServiceLanding ? 'content' : 'body'
        const requestedKeysQueue = [...requestedFields]
        const patchedKeys: string[] = []

        if (
          (languageScope === 'en' || languageScope === 'pl') &&
          requestedKeysQueue.includes(portableTextField)
        ) {
          setStatus(`Translating ${portableTextField}.${languageScope} with preserved structure...`)
          const translatedPortableText = await translatePortableTextField(
            portableTextField as 'body' | 'content',
            languageScope,
            systemPrompt,
            input
          )

          if (translatedPortableText) {
            const translatedKeys = await patchDocument(translatedPortableText)
            patchedKeys.push(...translatedKeys)
            const indexToRemove = requestedKeysQueue.indexOf(portableTextField)
            if (indexToRemove >= 0) requestedKeysQueue.splice(indexToRemove, 1)
          }
        }

        const requestedCurrentValues = requestedKeysQueue.reduce((acc: Record<string, any>, key) => {
          if (sourceDocument[key] !== undefined) acc[key] = sourceDocument[key]
          return acc
        }, {})

        const targetedPrompt = `You are a senior bilingual SEO editor working in a Sanity CMS.
TASK: Update ONLY the requested top-level fields for this ${typeLabel}.

USER REQUEST:
${input}

REQUESTED TOP-LEVEL FIELDS (STRICT ALLOWLIST):
${requestedKeysQueue.join(', ')}

LANGUAGE SCOPE:
${languageScope}
- If scope is "pl": for bilingual objects return only "pl" keys.
- If scope is "en": for bilingual objects return only "en" keys.
- If scope is "both": return both languages where relevant.

CURRENT VALUES OF REQUESTED FIELDS:
${JSON.stringify(requestedCurrentValues, null, 2)}

CMS CONTEXT:
${fullContext.substring(0, 12000)}

RULES:
1. Return ONLY valid JSON object.
2. Include ONLY requested top-level keys from the allowlist.
3. Do NOT include any other top-level keys.
4. Keep correct data shapes for each field.
5. For portable text fields ("content"/"body"), return valid Sanity block arrays.
6. If language scope is "pl" and the "en" value already exists, prefer translating/adapting from English instead of writing unrelated new text.
7. If language scope is "en" and the "pl" value already exists, prefer translating/adapting from Polish instead of writing unrelated new text.
8. If a requested field is unclear, keep it unchanged by omitting it.
9. Do not use markdown fences.`

        let filteredData: Record<string, any> = {}
        if (requestedKeysQueue.length > 0) {
          const targetedText = await callAI(targetedPrompt, {
          isJson: true,
          maxTokens: 2200,
          systemPrompt,
          temperature: 0.55,
        })
          const targetedData = extractJson(targetedText)
          const allowlist = new Set(requestedKeysQueue)
          filteredData = Object.fromEntries(
            Object.entries(targetedData).filter(([key]) => allowlist.has(key))
          )
        }

        if (Object.keys(filteredData).length === 0 && patchedKeys.length === 0) {
          throw new Error('AI did not return any requested fields. Try naming fields explicitly, e.g. "Update only intro and FAQ".')
        }

        if (Object.keys(filteredData).length > 0) {
          const aiPatchedKeys = await patchDocument(filteredData)
          patchedKeys.push(...aiPatchedKeys)
        }

        if (!patchedKeys.length) {
          throw new Error('No changes were applied to the requested fields.')
        }

        reply = `✅ Updated only requested fields: ${patchedKeys.join(', ')}`
        reply = `Updated only requested fields: ${uniqueKeys(patchedKeys).join(', ')}`
      } else {
        // ── GENERATION MODE — produce JSON, parse in code, patch ─────────
        // Netlify Free Tier has a hard 10s timeout. Generating two languages of text 
        // at once takes ~30s on OpenAI, crashing the function.
        // Groq and Gemini are fast enough for single-shot, but OpenAI needs 3 passes.
        const useMultiPass = true
        const filledKeys: string[] = []

        if (useMultiPass) {
          try {
            // ── PASS 1: Metadata ─────────────────────────────────────────────
            setStatus('Step 1/3: Generating metadata...')
            const metaPrompt = `You are an expert bilingual (English + Polish) SEO copywriter.
TASK: Generate METADATA for a ${typeLabel}: "${docTitle}"
USER REQUEST: ${input}
${linkedContent ? `\nSOURCE MATERIAL:\n${linkedContent.substring(0, 2000)}` : ''}
${currentDraftText ? `\nCURRENT DRAFT IN EDITOR:\n${currentDraftText.substring(0, 3000)}\n(Use the above draft to extract metadata accurately while respecting the user's requested rewrite or tone)` : ''}

${promptBehaviorRules}

CRITICAL TRANSLATION RULE:
Ensure the Polish fields use natural, native Polish phrasing without English loan-words.

Return ONLY valid JSON — no markdown, no explanation.
${isServiceLanding ? `{
  "title": { "en": "...", "pl": "..." },
  "slug": { "_type": "slug", "current": "..." },
  "serviceType": "website-development",
  "city": "Optional city",
  "isLocalLanding": true,
  "eyebrow": { "en": "Service", "pl": "Usługa" },
  "intro": { "en": "2-3 sentences", "pl": "2-3 zdania" },
  "ctaLabel": { "en": "...", "pl": "..." },
  "ctaSecondaryLabel": { "en": "...", "pl": "..." },
  "seo": { "metaTitle": { "en": "max 60", "pl": "max 60" }, "metaDescription": { "en": "max 160", "pl": "max 160" }, "keywords": ["kw1","kw2","kw3","kw4","kw5"] }
}` : isProject ? `{
  "title": { "en": "...", "pl": "..." },
  "slug": { "_type": "slug", "current": "..." },
  "description": { "en": "2-3 sentences, max 300 chars", "pl": "2-3 zdania, max 300 znaków" },
  "technologies": ["React", "TypeScript", "Node.js"],
  "projectUrl": "https://example.com",
  "blogUrl": "https://example.com",
  "githubUrl": "https://github.com/example",
  "seo": { "metaTitle": { "en": "max 60", "pl": "max 60" }, "metaDescription": { "en": "max 160", "pl": "max 160" }, "keywords": ["kw1","kw2","kw3","kw4","kw5"] }
}` : `{
  "title": { "en": "...", "pl": "..." },
  "slug": { "_type": "slug", "current": "..." },
  "excerpt": { "en": "2-3 sentences, max 300 chars", "pl": "2-3 zdania, max 300 znaków" },
  "categories": ["Dev"],
  "tags": ["tag1", "tag2", "tag3", "tag4"],
  "seo": { "metaTitle": { "en": "max 60", "pl": "max 60" }, "metaDescription": { "en": "max 160", "pl": "max 160" }, "keywords": ["kw1","kw2","kw3","kw4","kw5"] }
}`}`

            const metaText = await callAI(metaPrompt, { isJson: true, maxTokens: 1000, systemPrompt, temperature: 0.45 })
            const metaData = extractJson(metaText)

            setStatus('Saving metadata...')
            const metaKeys = await patchDocument(metaData)
            filledKeys.push(...metaKeys)

            await new Promise(r => setTimeout(r, 500))

            // ── PASS 2: English Content ─────────────────────────────────────
            setStatus('Step 2/3: Generating English content...')
            const enPrompt = isServiceLanding
              ? `You are an expert conversion copywriter for service landing pages.
Write ENGLISH content fields for a service landing page: "${metaData.title?.en || docTitle}"
USER REQUEST: ${input}
${linkedContent ? `\nSOURCE MATERIAL:\n${linkedContent.substring(0, 3000)}` : ''}
${currentDraftText ? `\nCURRENT DRAFT IN EDITOR:\n${currentDraftText.substring(0, 4000)}\n(Use the above draft as source material, but rewrite it so it actually follows the user's prompt)` : ''}
${promptBehaviorRules}
Return ONLY valid JSON:
{
  "intro": { "en": "..." },
  "problems": { "en": ["...", "...", "..."] },
  "deliverables": { "en": ["...", "...", "..."] },
  "processSteps": { "en": ["...", "...", "...", "..."] },
  "faq": { "en": [{ "question": "...", "answer": "..." }, { "question": "...", "answer": "..." }] },
  "content": { "en": [{ "_type": "block", "style": "h2", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "..." }] }, { "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "..." }] }] },
  "ctaLabel": { "en": "..." },
  "ctaSecondaryLabel": { "en": "..." },
  "stats": { "en": [{ "value": "...", "label": "..." }, { "value": "...", "label": "..." }] }
}
Requirements: content.en should have 6-10 blocks, 500-900 words, mix h2/h3/normal. Do not use markdown fences.`
              : `You are an expert SEO copywriter.
Write the ENGLISH BODY CONTENT for a ${typeLabel}: "${metaData.title?.en || docTitle}"
USER REQUEST: ${input}
${linkedContent ? `\nSOURCE MATERIAL:\n${linkedContent.substring(0, 3000)}` : ''}
${currentDraftText ? `\nCURRENT DRAFT IN EDITOR:\n${currentDraftText.substring(0, 4000)}\n(Use the above draft as source material, but rewrite it so it actually follows the user's prompt)` : ''}
${promptBehaviorRules}
Return ONLY valid JSON:
{"body":{"en":[{"_type":"block","style":"h2","markDefs":[],"children":[{"_type":"span","marks":[],"text":"..."}]},{"_type":"block","style":"normal","markDefs":[],"children":[{"_type":"span","marks":[],"text":"..."}]}]}}
Requirements: 6-10 blocks, 600-1000 words, mix h2/h3/normal. DO NOT USE MARKDOWN FENCES IN THE TEXT.`

            const enText = await callAI(enPrompt, { isJson: true, maxTokens: isServiceLanding ? 3200 : 2400, systemPrompt, temperature: 0.7 })
            const enData = extractJson(enText)
            const enKeys = await patchDocument(enData)
            filledKeys.push(...enKeys)

            await new Promise(r => setTimeout(r, 500))

            // ── PASS 3: Polish Content ──────────────────────────────────────
            setStatus('Step 3/3: Generating Polish content...')
            const englishContentText = isServiceLanding
              ? JSON.stringify({
                  intro: enData.intro?.en,
                  problems: enData.problems?.en,
                  deliverables: enData.deliverables?.en,
                  processSteps: enData.processSteps?.en,
                  faq: enData.faq?.en,
                  content: enData.content?.en,
                  ctaLabel: enData.ctaLabel?.en,
                  ctaSecondaryLabel: enData.ctaSecondaryLabel?.en,
                  stats: enData.stats?.en,
                })
              : (enData.body?.en ? JSON.stringify(enData.body.en) : '')

            const plPrompt = isServiceLanding
              ? `You are an expert Polish SEO copywriter and localizer.

Translate the following English JSON fields into Polish while preserving EXACT structure and order.

SOURCE ENGLISH JSON:
${englishContentText}

CRITICAL RULES:
1. Keep the same keys and same data shapes.
2. Produce natural, native Polish wording.
3. Do not summarize or drop content.
4. Do not use markdown.
5. If the English content reads like a rewrite of source material, produce a natural Polish version of that rewrite instead of copying source wording.

Return ONLY valid JSON:
{
  "intro": { "pl": "..." },
  "problems": { "pl": ["...", "...", "..."] },
  "deliverables": { "pl": ["...", "...", "..."] },
  "processSteps": { "pl": ["...", "...", "...", "..."] },
  "faq": { "pl": [{ "question": "...", "answer": "..." }, { "question": "...", "answer": "..." }] },
  "content": { "pl": [{ "_type": "block", "style": "h2", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "..." }] }] },
  "ctaLabel": { "pl": "..." },
  "ctaSecondaryLabel": { "pl": "..." },
  "stats": { "pl": [{ "value": "...", "label": "..." }, { "value": "...", "label": "..." }] }
}`
              : `You are an expert Polish SEO copywriter and localized translator.

Your task is to translate the following English JSON content into Polish. You MUST maintain the EXACT SAME JSON structure, semantic sequence, and formatting blocks.

SOURCE ENGLISH JSON:
${englishContentText}

CRITICAL TRANSLATION RULES:
1. Translate block by block. The Polish output MUST have the EXACT SAME number of blocks and the EXACT SAME \`style\` attributes as the Source English JSON.
2. Do not summarize, skip, or invent new sections. If the English JSON has 8 blocks, your JSON must have exactly 8 blocks.
3. Do not do a naive 1:1 literal translation. Use native, natural Polish phrasing.
4. Use proper Polish grammar and vocabulary. Do NOT use borrowed English words (loanwords). Adjust the text for a natural, native Polish reading experience.
5. DO NOT USE MARKDOWN.
6. If the English content is a rewrite of source material, keep the rewritten meaning and structure, not the original source wording.

Return ONLY valid JSON representing the translated blocks:
{"body":{"pl":[{"_type":"block","style":"h2","markDefs":[],"children":[{"_type":"span","marks":[],"text":"<translated_heading>"}]},{"_type":"block","style":"normal","markDefs":[],"children":[{"_type":"span","marks":[],"text":"<translated_paragraph>"}]}]}}`

            const plText = await callAI(plPrompt, { isJson: true, maxTokens: 4000, systemPrompt, temperature: 0.4 })
            const plData = extractJson(plText)
            const plKeys = await patchDocument(plData)
            filledKeys.push(...plKeys)

            reply = `✅ Document updated in 3 fast passes!\n\nFilled fields: ${uniqueKeys(filledKeys).join(', ')}\n\nRefresh the page if fields don't update immediately.`
          } catch (err: any) {
            reply = `⚠️ Generation stopped. Saved so far: ${uniqueKeys(filledKeys).join(', ')}. Error: ${err.message}`
            saveMessages([...newMsgs, { role: 'assistant', content: reply }])
            return
          }
        } else {
          // ── SINGLE-SHOT (Groq / Gemini — fast enough) ────────────────────
          setStatus('Generating all fields...')
          const prompt = `You are an expert bilingual (English + Polish) SEO copywriter.

TASK: Generate a COMPLETE ${typeLabel} for: "${docTitle}"

USER INSTRUCTIONS: ${input}

EXISTING CMS CONTENT:
${fullContext}

${promptBehaviorRules}

CRITICAL RULES:
1. Return ONLY valid JSON — no markdown fences, no explanation.
2. Fill EVERY field. No field may be empty or null.
3. ${isServiceLanding ? 'content.en AND content.pl: 6-10 blocks each, 500-900 words, mix h2/h3/normal styles.' : 'body.en AND body.pl: 6-10 blocks each, 700-1000 words, mix h2/h3/normal styles.'}
4. ${isServiceLanding ? 'intro: 2-3 sentences per language.' : 'excerpt/description: 2-3 sentences (max 300 chars per language).'}
5. slug: lowercase-with-hyphens from English title.
6. seo.metaTitle: max 60 chars. seo.metaDescription: max 160 chars.
7. ${isServiceLanding ? 'seo.keywords: 5-8 terms; problems/deliverables/processSteps: concrete and specific.' : 'seo.keywords: 5-8 terms. tags/technologies: 4-8 items.'}
${isServiceLanding ? '8. FAQ must include at least 2 questions per language.' : (isProject ? '8. URLs: use "https://example.com" if unknown.' : '8. categories: ONLY "Dev", "No-code", or "Wellness".')}
9. ${isServiceLanding ? 'Portable text blocks in content.* must use Sanity block format.' : 'Body blocks: { "_type": "block", "style": "...", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "..." }] }'}

JSON SCHEMA:
${schemaJson}`

          const aiText = await callAI(prompt, { isJson: true, maxTokens: 4000, systemPrompt, temperature: 0.65 })
          const generated = extractJson(aiText)

          // ── Parse + Validate (code-side) ─────────────────────────────────
          setStatus('Validating...')

          // ── Validate minimum fields ────────────────────────────────────
          const requiredKeys = isServiceLanding
            ? ['title', 'slug', 'serviceType', 'intro', 'problems', 'deliverables', 'processSteps', 'faq', 'content', 'ctaLabel', 'ctaSecondaryLabel', 'stats', 'seo']
            : isProject
            ? ['title', 'slug', 'description', 'technologies', 'body', 'seo']
            : ['title', 'slug', 'excerpt', 'categories', 'tags', 'body', 'seo']

          const missing = requiredKeys.filter(k => !generated[k])
          if (missing.length > 0) {
            throw new Error(`AI missed fields: ${missing.join(', ')}. Try again.`)
          }

          // ── Patch to Sanity (code-side) ────────────────────────────────
          setStatus('Saving to Sanity...')
          const keys = await patchDocument(generated)
          reply = `✅ Document updated!\n\nFilled fields: ${uniqueKeys(keys).join(', ')}\n\nRefresh if fields don't update immediately.`
        }
      }

      saveMessages([...newMsgs, { role: 'assistant', content: reply }])
    } catch (err: any) {
      saveMessages([...newMsgs, { role: 'assistant', content: `❌ Error: ${err.message}` }])
    } finally {
      setLoading(false)
      setStatus('')
    }
  }, [messages, input, documentId, documentType, titleEn, titlePl, referenceContent, provider, model, client, onChange, bodyEnBlocks, bodyPlBlocks, contentEnBlocks, contentPlBlocks, documentValue])

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
              <Box style={{ width: '145px' }}>
                <Select
                  value={provider}
                  onChange={(e: any) => {
                    const nextProvider = e.currentTarget.value as 'openai' | 'groq'
                    setProvider(nextProvider)
                    setModel(PROVIDERS[nextProvider].model)
                  }}
                  fontSize={1} padding={2}
                >
                  {Object.entries(PROVIDERS).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
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
              <Box style={{ width: '210px' }}>
                <TextInput
                  value={model}
                  onChange={(e: any) => setModel(e.currentTarget.value)}
                  fontSize={1}
                  padding={2}
                  placeholder="Model, np. gpt-5.4-thinking"
                  disabled={loading}
                />
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
                      Name specific fields to update only them (e.g. "update intro and FAQ"). If you ask for full generation, all fields will be regenerated.
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
