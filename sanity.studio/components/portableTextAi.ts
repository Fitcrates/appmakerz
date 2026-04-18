function randomKey() {
  return Math.random().toString(36).substring(2, 9)
}

function stripCodeFence(text: string) {
  const trimmed = (text || '').trim()
  if (!trimmed.startsWith('```')) return trimmed
  return trimmed
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim()
}

function findBalancedJsonSlice(text: string, openChar: '{' | '[', closeChar: '}' | ']') {
  const start = text.indexOf(openChar)
  if (start === -1) return null

  let depth = 0
  let inString = false
  let escaped = false

  for (let index = start; index < text.length; index += 1) {
    const char = text[index]

    if (inString) {
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === '"') {
        inString = false
      }
      continue
    }

    if (char === '"') {
      inString = true
      continue
    }

    if (char === openChar) depth += 1
    if (char === closeChar) depth -= 1

    if (depth === 0) {
      return text.slice(start, index + 1)
    }
  }

  return null
}

function formatJsonError(error: any) {
  const message = error instanceof Error ? error.message : 'Invalid JSON response.'
  return message.replace(/^JSON\.parse:\s*/i, '')
}

export function extractJsonObject(text: string): any {
  const cleaned = stripCodeFence(text)
  try {
    const parsed = JSON.parse(cleaned)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed
  } catch {
    // Fallback below.
  }

  const candidate = findBalancedJsonSlice(cleaned, '{', '}')
  if (!candidate) throw new Error('No JSON object found in AI response.')

  try {
    return JSON.parse(candidate)
  } catch (error) {
    throw new Error(formatJsonError(error))
  }
}

export function extractJsonArray(text: string): any[] {
  const cleaned = stripCodeFence(text)
  try {
    const parsed = JSON.parse(cleaned)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // Fallback below.
  }

  const candidate = findBalancedJsonSlice(cleaned, '[', ']')
  if (!candidate) throw new Error('No JSON array found in AI response.')

  try {
    const parsed = JSON.parse(candidate)
    if (!Array.isArray(parsed)) throw new Error('AI response did not return a JSON array.')
    return parsed
  } catch (error) {
    throw new Error(formatJsonError(error))
  }
}

export function ensureBlocks(input: any): any[] {
  const mkBlock = (text: string, style = 'normal') => ({
    _type: 'block',
    _key: randomKey(),
    style,
    markDefs: [],
    children: [{ _type: 'span', _key: randomKey(), marks: [], text }],
  })

  if (!input) return []
  if (typeof input === 'string') {
    return input.split(/\n\n+/).filter(Boolean).map((paragraph) => {
      const trimmed = paragraph.trim()
      if (trimmed.startsWith('### ')) return mkBlock(trimmed.replace(/^### /, ''), 'h3')
      if (trimmed.startsWith('## ')) return mkBlock(trimmed.replace(/^## /, ''), 'h2')
      if (trimmed.startsWith('# ')) return mkBlock(trimmed.replace(/^# /, ''), 'h1')
      return mkBlock(trimmed)
    })
  }
  if (!Array.isArray(input)) return []

  return input.map((node) => {
    if (typeof node === 'string') return mkBlock(node)
    if (node?._type !== 'block') return node

    const children = Array.isArray(node.children)
      ? node.children.map((child: any) => ({
          _type: 'span',
          marks: [],
          ...child,
          _key: child?._key || randomKey(),
          text: child?.text ?? '',
        }))
      : [{ _type: 'span', _key: randomKey(), marks: [], text: '' }]

    return {
      markDefs: [],
      ...node,
      _type: 'block',
      _key: node?._key || randomKey(),
      style: node?.style || 'normal',
      children,
    }
  })
}

export function isPortableTextInput(path: any[], schemaType: any) {
  const fieldName = path?.[path.length - 2]
  const language = path?.[path.length - 1]
  const hasPortableTextBlocks = Array.isArray(schemaType?.of) && schemaType.of.some((item: any) => item?.type === 'block')

  return hasPortableTextBlocks && (fieldName === 'body' || fieldName === 'content') && (language === 'en' || language === 'pl')
}

export function serializePortableTextForTranslation(nodes: any[]): any[] {
  if (!Array.isArray(nodes)) return []

  return nodes.map((node: any, index: number) => {
    if (node?._type === 'block') {
      return {
        index,
        _type: 'block',
        style: node?.style || 'normal',
        texts: Array.isArray(node?.children)
          ? node.children.map((child: any) => (typeof child?.text === 'string' ? child.text : ''))
          : [],
      }
    }

    if (node?._type === 'image') {
      return {
        index,
        _type: 'image',
        alt: typeof node?.alt === 'string' ? node.alt : '',
        caption: typeof node?.caption === 'string' ? node.caption : '',
      }
    }

    return {
      index,
      _type: node?._type || 'unknown',
      preserve: true,
    }
  })
}

export function rebuildPortableTextFromTranslation(sourceNodes: any[], translatedNodes: any[]): any[] {
  if (!Array.isArray(sourceNodes)) return []
  if (!Array.isArray(translatedNodes) || translatedNodes.length === 0) return sourceNodes

  const translatedByIndex = new Map<number, any>()
  translatedNodes.forEach((node: any) => {
    if (typeof node?.index === 'number') translatedByIndex.set(node.index, node)
  })

  return sourceNodes.map((sourceNode: any, index: number) => {
    const translatedNode = translatedByIndex.get(index)
    if (!translatedNode) return sourceNode

    if (sourceNode?._type === 'block') {
      const sourceChildren = Array.isArray(sourceNode.children) ? sourceNode.children : []
      const translatedTexts = Array.isArray(translatedNode.texts)
        ? translatedNode.texts.filter((text: any) => typeof text === 'string')
        : []
      const fallbackText = translatedTexts.join(' ').trim()

      return {
        ...sourceNode,
        children: sourceChildren.map((child: any, childIndex: number) => {
          if (typeof child?.text !== 'string') return child
          const nextText = translatedTexts[childIndex]
          return {
            ...child,
            text: typeof nextText === 'string'
              ? nextText
              : childIndex === 0 && fallbackText
                ? fallbackText
                : child.text,
          }
        }),
      }
    }

    if (sourceNode?._type === 'image') {
      return {
        ...sourceNode,
        ...(typeof translatedNode.alt === 'string' ? { alt: translatedNode.alt } : {}),
        ...(typeof translatedNode.caption === 'string' ? { caption: translatedNode.caption } : {}),
      }
    }

    return sourceNode
  })
}
