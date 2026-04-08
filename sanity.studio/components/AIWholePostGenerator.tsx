import { useCallback, useState, useEffect, useRef } from 'react'
import { Stack, Button, Inline, Spinner, TextArea, Text, Box, Card, Flex, Select } from '@sanity/ui'
import { set, useFormValue, useClient } from 'sanity'

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
  
  // Fetch context for AI to know what other posts/schemas exist
  useEffect(() => {
    const fetchContext = async () => {
      try {
        const docs = await client.fetch(`*[_type in ["pages", "post", "project"]]{ _type, "titleEn": title.en, "titlePl": title.pl, "slug": slug.current }`);
        const contextStr = docs.map((d: any) => `- [${d._type}] ${d.titleEn || d.titlePl || 'Untitled'} (slug: /${d.slug || 'none'})`).join('\n');
        setContextData(contextStr);
      } catch (e) {
        console.error("Failed to fetch context", e);
      }
    };
    fetchContext();
  }, [client]);

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
        content: `You are an expert AI Editor inside Sanity Studio helping to write a ${typeLabel}.
The current document title is: ${currentTitleEn || 'none'}

Available context of other documents in the CMS (use this to suggest links, avoid duplicating titles, etc):
${contextData}

You can chat, plan, and discuss with the user.
If the user asks you to write the post, fill out sections, or update any content, you MUST use the 'update_document' tool.
When using the 'update_document' tool, always generate fully formatted Portable Text for the 'body' array (with blocks containing _type='block' and style='normal').
You can update partial fields or all fields at once depending on the user's request.
Document Schema JSON example to guide your tool call:
{
  "title": { "en": "Title", "pl": "Title" },
  "slug": { "_type": "slug", "current": "title" },${extraFieldsPrompt}
  "body": {
    "en": [{ "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "..." }] }],
    "pl": [{ "_type": "block", "style": "normal", "markDefs": [], "children": [{ "_type": "span", "marks": [], "text": "..." }] }]
  },
  "seo": { "metaTitle": {"en": "...", "pl": "..."}, "metaDescription": {"en": "...", "pl": "..."}, "keywords": ["..."] }
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
              }
            }
          }
        }
      ]

      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const apiUrl = isLocalhost 
        ? 'http://localhost:8888/.netlify/functions/generateContent' 
        : 'https://appcrates.pl/.netlify/functions/generateContent';

      const res = await fetch(apiUrl, {
        method: 'POST',
        body: JSON.stringify({ 
          messages: [sysMsg, ...newMsgs],
          tools,
          maxTokens: 3000,
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
          
          // Add keys to any portable text array recursively
          const addKeysToBlocks = (blocks: any[]) => {
            if (!blocks || !Array.isArray(blocks)) return [];
            return blocks.map(block => ({
              ...block,
              _key: Math.random().toString(36).substring(2, 9),
              children: block.children ? block.children.map((child: any) => ({
                ...child,
                _key: Math.random().toString(36).substring(2, 9)
              })) : []
            }));
          };

          if (generatedData.body?.en) generatedData.body.en = addKeysToBlocks(generatedData.body.en);
          if (generatedData.body?.pl) generatedData.body.pl = addKeysToBlocks(generatedData.body.pl);

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
