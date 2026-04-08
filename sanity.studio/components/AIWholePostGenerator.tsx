import { useCallback, useState, useEffect, useRef } from 'react'
import { Stack, Button, Inline, Spinner, TextArea, Text, Box, Card, Flex, Select } from '@sanity/ui'
import { set, useFormValue, useClient } from 'sanity'

function ensureBlocks(input: any) {
  if (!input) return [];
  // Fallback: If the AI was lazy and just returned a string instead of a block array
  if (typeof input === 'string') {
    return [{
      _type: 'block',
      _key: Math.random().toString(36).substring(2, 9),
      style: 'normal',
      children: [{ _type: 'span', _key: Math.random().toString(36).substring(2, 9), text: input }]
    }];
  }

  if (!Array.isArray(input)) return [];

  return input.map(block => {
    // If a nested item is mysteriously a string
    if (typeof block === 'string') {
      return {
        _type: 'block',
        _key: Math.random().toString(36).substring(2, 9),
        style: 'normal',
        children: [{ _type: 'span', _key: Math.random().toString(36).substring(2, 9), text: block }]
      };
    }
    return {
      ...block,
      _key: block._key || Math.random().toString(36).substring(2, 9),
      _type: 'block',
      style: block.style || 'normal',
      children: Array.isArray(block.children) ? block.children.map((child: any) => ({
        ...child,
        _key: child._key || Math.random().toString(36).substring(2, 9),
        _type: 'span',
        text: child.text || (typeof child === 'string' ? child : '')
      })) : [{ _type: 'span', _key: Math.random().toString(36).substring(2, 9), text: '' }]
    };
  });
}

export const AIWholePostGenerator = (props: any) => {
  const { onChange, value } = props
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<any[]>([])
  const [provider, setProvider] = useState<'openai' | 'groq' | 'gemini'>('gemini')
  const [model, setModel] = useState<string>('gpt-4o')
  const [contextData, setContextData] = useState<string>('')
  
  const client = useClient({ apiVersion: '2023-05-03' })
  const scrollRef = useRef<HTMLDivElement>(null)

  // Get current document ID and Type
  const documentId = useFormValue(['_id']) as string | undefined
  const documentType = useFormValue(['_type']) as string | undefined
  const currentTitleEn = useFormValue(['title', 'en']) as string | undefined

  // Initialize messages from field value
  useEffect(() => {
    try {
      if (value) {
        setMessages(JSON.parse(value))
      }
    } catch (e) {
      console.error("Failed to parse chat messages", e)
    }
  }, [value])
  
  // Fetch context and references for AI
  useEffect(() => {
    const fetchContext = async () => {
      try {
        // 1. Fetch small contexts of everything
        const allDocs = await client.fetch(`*[_type in ["pages", "post", "project"]]{ 
          _type, "titleEn": title.en, "titlePl": title.pl, "slug": slug.current,
          "techs": technologies
        }`);
        const contextStr = allDocs.map((d: any) => 
          `- [${d._type}] ${d.titleEn || d.titlePl || 'Untitled'} (slug: /${d.slug || 'none'})${d.techs ? ` Techs: ${d.techs.join(', ')}` : ''}`
        ).join('\n');

        // 2. Fetch full examples of the CURRENT document type (Reference Content)
        let referencesStr = '';
        if (documentType) {
          const refs = await client.fetch(`*[_type == $docType && defined(body.en) && !(_id in path("drafts.**"))][0...2]{
            "titleEn": title.en,
            "titlePl": title.pl,
            "descEn": description.en,
            "excerptEn": excerpt.en,
            "bodyEn": pt::text(body.en)
          }`, { docType: documentType });
          
          if (refs && refs.length > 0) {
            referencesStr = '\n\n--- EXISTING REFERENCE EXAMPLES (Match this style, structure, and length) ---\n' + 
              refs.map((r:any) => `Title: ${r.titleEn || r.titlePl}\nSummary: ${r.descEn || r.excerptEn}\nBody Sample (Excerpt): ${r.bodyEn ? r.bodyEn.substring(0, 1500) + '...' : 'No text'}`).join('\n\n') +
              '\n-----------------------------------------';
          }
        }

        setContextData(contextStr + referencesStr);
      } catch (e) {
        console.error("Failed to fetch context", e);
      }
    };
    if (documentType) fetchContext();
  }, [client, documentType]);

  // Auto-scroll chat
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const saveMessages = (newMsgs: any[]) => {
    setMessages(newMsgs)
    onChange(set(JSON.stringify(newMsgs)))
  }

  const sendMessage = useCallback(async () => {
    if (!documentId) {
      alert("Cannot find document ID. Please save the document first if it's new.")
      return
    }

    if (!input.trim()) return

    const isProject = documentType === 'project'
    const userMessage = { role: 'user', content: input }
    const newMsgs = [...messages, userMessage]
    saveMessages(newMsgs)
    setInput('')
    setLoading(true)

    try {
      const typeLabel = isProject ? 'project portfolio item' : 'blog post'
      const extraFieldsPrompt = isProject ? 
        `
  "description": { "en": "English desc", "pl": "Polish desc" },
  "technologies": ["tech1", "tech2"],
  "projectUrl": "https://...", "blogUrl": "https://...", "githubUrl": "https://..."` : 
        `
  "excerpt": { "en": "English excerpt", "pl": "Polish excerpt" },
  "categories": ["Dev"], "tags": ["tag1"]`;

      const sysMsg = { 
        role: "system", 
        content: `You are an expert SEO copywriter and AI Editor inside Sanity Studio helping to write a ${typeLabel}.
The current document title is: ${currentTitleEn || 'none'}

AVAILABLE CONTEXT OF OTHER DOCUMENTS (use this to suggest links, avoid duplicating titles, and learn from existing content):
${contextData}

CONTENT REQUIREMENTS:
- Content MUST be detailed, comprehensive, and in-depth (400-800 words, at least 4-5 substantial paragraphs).
- Use appropriate SEO keywords naturally — NEVER keyword-stuff.
- Include practical advice, expert insights, and storytelling elements.
- Sound authoritative, engaging, and highly professional.
- Unless otherwise told, provide content for ALL required fields (title, slug, body, seo, etc).
- SEO Meta Title should be max 60 chars. SEO Meta Description should be compelling and max 160 chars. Give 5-8 relevant keywords.

PORTABLE TEXT REQUIREMENTS:
- The "body" field MUST be valid Sanity Portable Text (blockContent): an array of block objects.
- Use "style" values like: "normal", "h2", "h3".
- For bullet lists, use blocks with "listItem": "bullet" and matching "level".
- Example valid block: { "_type": "block", "style": "normal", "children": [{ "_type": "span", "marks": [], "text": "Content here." }] }

CRITICAL INSTRUCTION FOR TOOL USAGE:
If the user asks you to write the post, fill out sections, or update any content, YOU MUST USE THE 'update_document' TOOL to physically update the CMS fields! 
Do NOT just output the written text directly in the chat. The chat is for planning, but the actual content MUST be submitted via the 'update_document' tool! You must provide an object that satisfies the entire schema if it is empty!

Document Schema JSON structure to guide your tool call:
{
  "title": { "en": "Title", "pl": "Polish Title" },
  "slug": { "_type": "slug", "current": "title-slug" },${extraFieldsPrompt}
  "body": {
    "en": [{ "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Comprehensive English body..." }] }],
    "pl": [{ "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "Comprehensive Polish body..." }] }]
  },
  "seo": { "metaTitle": {"en": "...", "pl": "..."}, "metaDescription": {"en": "...", "pl": "..."}, "keywords": ["keyword1", "keyword2"] }
}`
      }

      const tools = [
        {
          type: "function",
          function: {
            name: "update_document",
            description: "Updates the fields of the Sanity document securely inline.",
            parameters: {
              type: "object",
              properties: {
                title: { type: "object", description: "{ en: string, pl: string }" },
                slug: { type: "object", description: "{ _type: 'slug', current: 'string' }" },
                body: { type: "object", description: "{ en: [...PortableText...], pl: [...PortableText...] }" },
                ...(isProject ? {
                  description: { type: "object", description: "{ en: string, pl: string }" },
                  technologies: { type: "array", items: { type: "string" } },
                  projectUrl: { type: "string" },
                  blogUrl: { type: "string" },
                  githubUrl: { type: "string" }
                } : {
                  excerpt: { type: "object", description: "{ en: string, pl: string }" },
                  categories: { type: "array", items: { type: "string" } },
                  tags: { type: "array", items: { type: "string" } }
                }),
                seo: { type: "object", description: "Contains metaTitle, metaDescription, and keywords keys." }
              },
              required: [
                "title", "slug", "body", "seo",
                ...(isProject 
                  ? ["description", "technologies", "projectUrl", "blogUrl", "githubUrl"] 
                  : ["excerpt", "categories", "tags"])
              ]
            }
          }
        }
      ]

      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalhost 
        ? 'http://localhost:8888/.netlify/functions/generateContent' 
        : 'https://appcrates.pl/.netlify/functions/generateContent';

      // Clean messages to avoid Groq unsupported properties (like 'annotations' from Gemini/OpenAI history)
      const cleanMessages = [sysMsg, ...newMsgs].map(m => {
        const cleanM: any = { role: m.role, content: m.content || "" };
        if (m.tool_calls) cleanM.tool_calls = m.tool_calls;
        if (m.tool_call_id) cleanM.tool_call_id = m.tool_call_id;
        if (m.name) cleanM.name = m.name;
        return cleanM;
      });

      const res = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ 
          messages: cleanMessages,
          tools,
          max_completion_tokens: 3000,
          provider,
          model
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const textResponse = await res.text();
      let data;
      try {
        data = JSON.parse(textResponse);
      } catch (e) {
        throw new Error(`Server error or timeout. The backend returned HTML:\n${textResponse.slice(0, 100)}...`);
      }

      if (data.error) throw new Error(data.error.message || JSON.stringify(data.error));

      const aiMessage = data.message;
      let nextMsgs = [...newMsgs, aiMessage];

      // Handle tool execution
      if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
        const call = aiMessage.tool_calls[0];
        if (call.function.name === 'update_document') {
          const generatedData = JSON.parse(call.function.arguments);
          
          console.log("TOOL ARGUMENTS JSON:", call.function.arguments);
          alert("Tool Generated Keys: " + Object.keys(generatedData).join(', '));
          
          // Safely add keys and sanitize the portable text blocks purely through UI code
          if (generatedData.body) {
            if (generatedData.body.en) generatedData.body.en = ensureBlocks(generatedData.body.en);
            if (generatedData.body.pl) generatedData.body.pl = ensureBlocks(generatedData.body.pl);
          }

          const docIdToPatch = documentId.startsWith('drafts.') ? documentId : `drafts.${documentId}`;
          await client.patch(docIdToPatch).set(generatedData).commit();

          // Append tool response
          nextMsgs.push({ 
            role: "tool", 
            tool_call_id: call.id, 
            name: "update_document", 
            content: "Success, document patched." 
          });

          // Add a friendly concluding message simulating AI finishing process
          nextMsgs.push({
            role: "assistant",
            content: "I have updated the document with the requested fields. How does it look?"
          });
        }
      }

      saveMessages(nextMsgs)

    } catch (err: any) {
      alert("Failed to generate content: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [messages, input, documentId, documentType, currentTitleEn, contextData, provider, model, client, onChange])

  return (
    <Stack space={3}>
      <Card border padding={3} radius={2} tone="transparent">
        <Stack space={3}>
          <Flex align="center" justify="space-between" paddingBottom={2} style={{ borderBottom: '1px solid var(--card-border-color)' }}>
            <Text weight="semibold" size={2}>🤖 AI Agent Copilot</Text>
            <Flex gap={2}>
              {provider === 'openai' && (
                <Box style={{ width: '130px' }}>
                  <Select value={model} onChange={(e: any) => setModel(e.currentTarget.value as any)} fontSize={1} padding={2}>
                    <option value="gpt-4o-mini">GPT-4o Mini</option>
                    <option value="gpt-4o">GPT-4o</option>
                    <option value="gpt-5.4">GPT-5.4</option>
                  </Select>
                </Box>
              )}
              <Box style={{ width: '160px' }}>
                <Select value={provider} onChange={(e: any) => setProvider(e.currentTarget.value as any)} fontSize={1} padding={2}>
                  <option value="gemini">Gemini (3.1 Pro)</option>
                  <option value="groq">Groq (Llama 3)</option>
                  <option value="openai">OpenAI</option>
                </Select>
              </Box>
            </Flex>
          </Flex>
          
          <Box 
            ref={scrollRef}
            style={{ height: '300px', overflowY: 'auto', padding: '10px 0' }}
          >
            <Stack space={3}>
              {messages.filter(m => m.role === 'user' || (m.role === 'assistant' && m.content)).map((m, i) => (
                <Flex key={i} justify={m.role === 'user' ? 'flex-end' : 'flex-start'}>
                  <Card 
                    padding={3} 
                    radius={3} 
                    shadow={1}
                    style={{ 
                      maxWidth: '85%', 
                      backgroundColor: m.role === 'user' ? 'var(--card-primary-bg-color)' : 'var(--card-bg-color)',
                      color: m.role === 'user' ? 'var(--card-primary-fg-color)' : 'var(--card-fg-color)'
                    }}
                  >
                    <Text size={1} style={{ whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                      {m.content}
                    </Text>
                  </Card>
                </Flex>
              ))}
              {messages.length === 0 && (
                <Flex justify="center" align="center" style={{ height: '100%' }}>
                  <Text muted size={1}>Type a message to start chatting with the AI.</Text>
                </Flex>
              )}
              {loading && (
                <Flex justify="flex-start">
                  <Card padding={3} radius={3} shadow={1}>
                    <Flex gap={2} align="center">
                      <Spinner size={1} />
                      <Text size={1} muted>AI is typing...</Text>
                    </Flex>
                  </Card>
                </Flex>
              )}
            </Stack>
          </Box>

          <Flex gap={2}>
            <Box flex={1}>
              <TextArea
                value={input}
                onChange={(e: any) => setInput(e.currentTarget.value)}
                placeholder="Talk to the agent, e.g., 'Write the body section'"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
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
        </Stack>
      </Card>
      <Box display="none">
        {props.renderDefault(props)}
      </Box>
    </Stack>
  )
}
