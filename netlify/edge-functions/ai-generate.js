const MODEL_CATALOG = [
  { id: 'groq-llama-3.3-70b-versatile', provider: 'groq', providerModel: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', tier: 'fast', contextWindow: 128000, envKey: 'GROQ_API_KEY' },
  { id: 'gpt-5.5-medium', provider: 'openai', providerModel: 'gpt-5.5-medium', label: 'GPT 5.5 Medium', tier: 'quality', contextWindow: 400000, envKey: 'OPENAI_API_KEY' },
  { id: 'gpt-5.4-mini', provider: 'openai', providerModel: 'gpt-5.4-mini', label: 'GPT 5.4 Mini', tier: 'balanced', contextWindow: 200000, envKey: 'OPENAI_API_KEY' },
];

const AI_SCHEMA_REGISTRY = {
  post: {
    title: 'Blog post',
    fields: [
      { path: 'title.en', title: 'English title', kind: 'string', group: 'primary', maxLength: 120 },
      { path: 'title.pl', title: 'Polish title', kind: 'string', group: 'primary', maxLength: 120 },
      { path: 'excerpt.en', title: 'English excerpt', kind: 'text', group: 'summary', maxLength: 300 },
      { path: 'excerpt.pl', title: 'Polish excerpt', kind: 'text', group: 'summary', maxLength: 300 },
      { path: 'body.en', title: 'English body', kind: 'portableText', group: 'body' },
      { path: 'body.pl', title: 'Polish body', kind: 'portableText', group: 'body' },
      { path: 'faq.en', title: 'English FAQ', kind: 'faq', group: 'faq' },
      { path: 'faq.pl', title: 'Polish FAQ', kind: 'faq', group: 'faq' },
      { path: 'tags', title: 'Tags', kind: 'stringArray', group: 'taxonomy' },
      { path: 'seo.metaTitle.en', title: 'English meta title', kind: 'string', group: 'seo', maxLength: 60 },
      { path: 'seo.metaTitle.pl', title: 'Polish meta title', kind: 'string', group: 'seo', maxLength: 60 },
      { path: 'seo.metaDescription.en', title: 'English meta description', kind: 'text', group: 'seo', maxLength: 160 },
      { path: 'seo.metaDescription.pl', title: 'Polish meta description', kind: 'text', group: 'seo', maxLength: 160 },
      { path: 'seo.keywords', title: 'SEO keywords', kind: 'stringArray', group: 'seo' },
    ],
    presets: {
      document: ['title.en', 'title.pl', 'excerpt.en', 'excerpt.pl', 'body.en', 'body.pl', 'faq.en', 'faq.pl', 'tags', 'seo.metaTitle.en', 'seo.metaTitle.pl', 'seo.metaDescription.en', 'seo.metaDescription.pl', 'seo.keywords'],
      body: ['body.en', 'body.pl'],
      seo: ['seo.metaTitle.en', 'seo.metaTitle.pl', 'seo.metaDescription.en', 'seo.metaDescription.pl', 'seo.keywords'],
      summary: ['title.en', 'title.pl', 'excerpt.en', 'excerpt.pl'],
      faq: ['faq.en', 'faq.pl'],
      taxonomy: ['tags', 'seo.keywords'],
    },
  },
};

function getHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };
}

function getAvailableModels() {
  return MODEL_CATALOG.filter((model) => Boolean(Deno.env.get(model.envKey)));
}

function getDefaultModelId() {
  const available = getAvailableModels();
  return available.find((model) => model.provider === 'openai')?.id || available[0]?.id || '';
}

function getModel(modelId) {
  const available = getAvailableModels();
  return available.find((model) => model.id === modelId) || available.find((model) => model.id === getDefaultModelId());
}

function getField(schema, path) {
  return schema?.fields?.find((field) => field.path === path);
}

function resolveTargetFields(schema, targetFields) {
  const allowed = new Set((schema?.fields || []).map((field) => field.path));
  const requested = Array.isArray(targetFields) && targetFields.length ? targetFields : schema?.presets?.document || [];
  return requested.filter((path) => allowed.has(path));
}

function getByPath(value, path) {
  return String(path || '').split('.').reduce((current, segment) => current && current[segment], value);
}

function randomKey() {
  return Math.random().toString(36).substring(2, 9);
}

function blockFromText(text, style = 'normal') {
  return { _type: 'block', _key: randomKey(), style, markDefs: [], children: [{ _type: 'span', _key: randomKey(), marks: [], text }] };
}

function normalizePortableText(value) {
  if (typeof value === 'string') {
    return value.split(/\n\n+/).map((item) => item.trim()).filter(Boolean).map((item) => blockFromText(item));
  }
  if (!Array.isArray(value)) return undefined;
  const blocks = value.map((block) => {
    if (typeof block === 'string') return blockFromText(block);
    if (!block || typeof block !== 'object') return null;
    if (block._type !== 'block') return block;
    const children = Array.isArray(block.children) ? block.children.map((child) => ({ _type: 'span', marks: [], ...child, _key: child?._key || randomKey(), text: String(child?.text || '') })) : [{ _type: 'span', _key: randomKey(), marks: [], text: '' }];
    return { markDefs: [], ...block, _type: 'block', _key: block._key || randomKey(), style: block.style || 'normal', children };
  }).filter(Boolean);
  return blocks.length ? blocks : undefined;
}

function normalizeStringArray(value) {
  const values = Array.isArray(value) ? value : typeof value === 'string' ? value.split(',') : [];
  const cleaned = [...new Set(values.map((item) => String(item || '').trim()).filter(Boolean))];
  return cleaned.length ? cleaned : undefined;
}

function normalizeFaq(value) {
  if (!Array.isArray(value)) return undefined;
  const items = value.map((item) => {
    if (!item || typeof item !== 'object') return null;
    const question = String(item.question || '').trim();
    const answer = String(item.answer || '').trim();
    if (!question || !answer) return null;
    return { _key: item._key || randomKey(), question, answer };
  }).filter(Boolean);
  return items.length ? items : undefined;
}

function normalizeFieldValue(kind, value) {
  if (kind === 'string' || kind === 'text') {
    const text = String(value || '').trim();
    return text || undefined;
  }
  if (kind === 'portableText') return normalizePortableText(value);
  if (kind === 'stringArray') return normalizeStringArray(value);
  if (kind === 'faq') return normalizeFaq(value);
  return undefined;
}

function extractJsonPayload(text) {
  const cleaned = String(text || '').trim().replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();
  try { return JSON.parse(cleaned); } catch (_) {}
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('No JSON object found in AI response.');
  return JSON.parse(cleaned.slice(start, end + 1));
}

async function callProvider(model, messages, options = {}) {
  const endpoint = model.provider === 'groq' ? 'https://api.groq.com/openai/v1/chat/completions' : 'https://api.openai.com/v1/chat/completions';
  const apiKey = Deno.env.get(model.envKey);
  if (!apiKey) throw new Error(`Missing API key for ${model.provider}.`);
  const payload = { model: model.providerModel, messages };
  if (model.provider === 'openai') payload.max_completion_tokens = options.maxTokens || 4000;
  else payload.max_tokens = options.maxTokens || 4000;
  if (typeof options.temperature === 'number') payload.temperature = options.temperature;
  if (options.isJson) payload.response_format = { type: 'json_object' };
  const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` }, body: JSON.stringify(payload) });
  const data = await response.json();
  if (!response.ok || data.error) throw new Error(data.error?.message || JSON.stringify(data.error || data));
  const content = data.choices?.[0]?.message?.content;
  return Array.isArray(content) ? content.map((item) => item?.text || '').join('') : content || '';
}

function buildDocumentPrompt({ schema, currentDocument, resolvedTargetFields, prompt }) {
  const aiContext = String(currentDocument?.aiContext || '').trim();
  const fields = resolvedTargetFields.map((path) => getField(schema, path)).filter(Boolean);
  return `You are a senior bilingual SEO editor working inside Sanity Studio.
Return ONLY valid JSON in this shape:
{
  "assistantMessage": "Short summary of what you updated and why.",
  "resolvedTargetFields": ["field.path"],
  "fieldValues": { "field.path": "value or structured value" }
}

Rules:
- Generate ONLY fields from the target field allowlist.
- Do not include markdown fences or comments.
- string/text values are plain strings.
- stringArray values are arrays of strings.
- portableText values are Sanity Portable Text block arrays.
- faq values are arrays of { "question": string, "answer": string }.
- Do not change slug, IDs, dates, references, workflow/status fields, or fields outside the registry.
- Use aiContext as the main brief. Do not use old documents or random examples as references.

AI CONTEXT:
${aiContext || '(empty)'}

CURRENT DOCUMENT SNAPSHOT:
${JSON.stringify(currentDocument || {}, null, 2).slice(0, 12000)}

TARGET FIELDS:
${fields.map((field) => `- ${field.path}: ${field.title}, kind=${field.kind}${field.maxLength ? `, maxLength=${field.maxLength}` : ''}`).join('\n')}

ADDITIONAL INSTRUCTION:
${prompt || '(none)'}`;
}

export default async function(request) {
  const headers = getHeaders();
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers });
  if (request.method === 'GET') {
    return new Response(JSON.stringify({ availableModels: getAvailableModels().map(({ providerModel, envKey, ...model }) => model), defaultModel: getDefaultModelId() }), { status: 200, headers });
  }
  if (request.method !== 'POST') return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405, headers });

  try {
    const body = await request.json();

    if (body.mode === 'document-chat') {
      const schema = AI_SCHEMA_REGISTRY[body.docType];
      if (!schema) return new Response(JSON.stringify({ error: `AI schema "${body.docType}" is not configured.` }), { status: 400, headers });
      const model = getModel(body.modelId);
      if (!model) return new Response(JSON.stringify({ error: 'No available AI models. Check environment keys.' }), { status: 400, headers });
      const resolvedTargetFields = resolveTargetFields(schema, body.targetFields);
      if (!resolvedTargetFields.length) return new Response(JSON.stringify({ error: 'No valid target fields.' }), { status: 400, headers });
      const userPrompt = buildDocumentPrompt({ schema, currentDocument: body.currentDocument || {}, resolvedTargetFields, prompt: body.prompt });
      const text = await callProvider(model, [{ role: 'system', content: 'Return only strict JSON. Follow the field registry allowlist exactly.' }, { role: 'user', content: userPrompt }], { isJson: true, maxTokens: 4200, temperature: 0.55 });
      const parsed = extractJsonPayload(text);
      const allowed = new Set(resolvedTargetFields);
      const fieldValues = {};
      Object.entries(parsed.fieldValues || {}).forEach(([path, value]) => {
        if (!allowed.has(path)) return;
        const field = getField(schema, path);
        const normalized = normalizeFieldValue(field.kind, value);
        if (normalized !== undefined) fieldValues[path] = normalized;
      });
      return new Response(JSON.stringify({ text, model: model.id, result: { assistantMessage: parsed.assistantMessage || '', resolvedTargetFields, fieldValues } }), { status: 200, headers });
    }

    const provider = body.provider || 'openai';
    const model = provider === 'groq'
      ? { provider: 'groq', providerModel: body.model || 'llama-3.3-70b-versatile', envKey: 'GROQ_API_KEY' }
      : { provider: 'openai', providerModel: body.model || 'gpt-4.1', envKey: 'OPENAI_API_KEY' };
    const messages = body.messages || [{ role: 'system', content: body.systemPrompt || 'You are a senior bilingual SEO copywriter and editor.' }, { role: 'user', content: body.prompt || 'Hello' }];
    const text = await callProvider(model, messages, { isJson: body.isJson, maxTokens: body.max_completion_tokens || 4000, temperature: body.temperature });
    return new Response(JSON.stringify({ text }), { status: 200, headers });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown server error';
    return new Response(JSON.stringify({ error: message }), { status: 400, headers });
  }
}
