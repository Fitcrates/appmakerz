/**
 * Shared building blocks for project page sections.
 *
 * Localization lives INSIDE each field ({ en, pl }) instead of splitting the
 * whole array into `sections { en: [], pl: [] }`. The layout is authored once
 * and cannot drift between languages - only the copy is per-language.
 */

type RuleLike = any;

interface LocalizedOptions {
  description?: string;
  rows?: number;
  required?: boolean;
  max?: number;
}

export function localizedString(name: string, title: string, options: LocalizedOptions = {}) {
  const validation = (Rule: RuleLike) => {
    let rule = Rule;
    if (options.required) rule = rule.required();
    if (options.max) rule = rule.max(options.max).warning('Keep it short - long labels break the layout');
    return rule;
  };

  return {
    name,
    title,
    type: 'object',
    description: options.description,
    options: { columns: 2 },
    fields: [
      { name: 'en', title: 'English', type: 'string', validation },
      { name: 'pl', title: 'Polish', type: 'string', validation },
    ],
  };
}

export function localizedText(name: string, title: string, options: LocalizedOptions = {}) {
  return {
    name,
    title,
    type: 'object',
    description: options.description,
    fields: [
      { name: 'en', title: 'English', type: 'text', rows: options.rows || 3 },
      { name: 'pl', title: 'Polish', type: 'text', rows: options.rows || 3 },
    ],
  };
}

/**
 * Portable Text with the full block palette (images, galleries, tables, code).
 * Same `of` definition the legacy `body` field uses, so old content can be
 * moved into a rich text section without losing anything.
 */
const richTextBlocks = [
  {
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'H2', value: 'h2' },
      { title: 'H3', value: 'h3' },
      { title: 'H4', value: 'h4' },
      { title: 'Quote', value: 'blockquote' },
    ],
    marks: {
      decorators: [
        { title: 'Strong', value: 'strong' },
        { title: 'Emphasis', value: 'em' },
        { title: 'Code', value: 'code' },
      ],
      annotations: [
        {
          title: 'URL',
          name: 'link',
          type: 'object',
          fields: [{ title: 'URL', name: 'href', type: 'url' }],
        },
      ],
    },
  },
  { type: 'gallery' },
  { type: 'blogTable' },
  {
    type: 'image',
    options: { hotspot: true },
    fields: [
      {
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
        validation: (Rule: RuleLike) => Rule.required().warning('Add alt text for accessibility and image search.'),
      },
      { name: 'caption', title: 'Caption', type: 'string' },
    ],
  },
  {
    title: 'Code Block',
    type: 'code',
    options: {
      language: 'typescript',
      languageAlternatives: [
        { title: 'TypeScript', value: 'typescript' },
        { title: 'Javascript', value: 'javascript' },
        { title: 'TSX', value: 'tsx' },
        { title: 'JSX', value: 'jsx' },
        { title: 'HTML', value: 'html' },
        { title: 'CSS', value: 'css' },
        { title: 'Python', value: 'python' },
        { title: 'PHP', value: 'php' },
        { title: 'JSON', value: 'json' },
        { title: 'Bash', value: 'bash' },
        { title: 'SQL', value: 'sql' },
      ],
    },
  },
];

export function localizedRichText(name: string, title: string, options: LocalizedOptions = {}) {
  return {
    name,
    title,
    type: 'object',
    description: options.description,
    fields: [
      { name: 'en', title: 'English Content', type: 'array', of: richTextBlocks },
      { name: 'pl', title: 'Polish Content', type: 'array', of: richTextBlocks },
    ],
  };
}

export function imageField(name = 'image', title = 'Image') {
  return {
    name,
    title,
    type: 'image',
    options: { hotspot: true },
    fields: [
      {
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
        validation: (Rule: RuleLike) => Rule.required().warning('Add alt text for accessibility and image search.'),
      },
      { name: 'caption', title: 'Caption', type: 'string' },
    ],
  };
}

/**
 * Layout controls every section shares. Kept in a collapsed "Layout" fieldset
 * so the editing surface stays about the copy, not about the knobs.
 */
export const layoutFieldset = {
  name: 'layout',
  title: 'Layout',
  options: { collapsible: true, collapsed: true },
};

export function layoutFields(defaults: { width?: string; tone?: string } = {}) {
  return [
    {
      name: 'width',
      title: 'Width',
      type: 'string',
      fieldset: 'layout',
      description: 'Narrow keeps the comfortable reading measure. Wide and Full break the rhythm on purpose.',
      options: {
        list: [
          { title: 'Narrow (reading measure)', value: 'narrow' },
          { title: 'Wide', value: 'wide' },
          { title: 'Full bleed', value: 'full' },
        ],
        layout: 'radio',
      },
      initialValue: defaults.width || 'narrow',
    },
    {
      name: 'tone',
      title: 'Background',
      type: 'string',
      fieldset: 'layout',
      description: 'Alternate Panel every few sections so the page reads as blocks instead of one long column.',
      options: {
        list: [
          { title: 'Plain', value: 'plain' },
          { title: 'Panel (subtle lift)', value: 'panel' },
          { title: 'Accent (teal wash)', value: 'accent' },
        ],
        layout: 'radio',
      },
      initialValue: defaults.tone || 'plain',
    },
    {
      name: 'anchor',
      title: 'Anchor ID',
      type: 'string',
      fieldset: 'layout',
      description: 'Optional. Used for the deep link and the in-page navigation. Generated from the heading when empty.',
      validation: (Rule: RuleLike) =>
        Rule.regex(/^[a-z0-9-]+$/, { name: 'lowercase-dashes' }).warning('Use lowercase letters, numbers and dashes only'),
    },
    {
      name: 'hideFromToc',
      title: 'Hide from in-page navigation',
      type: 'boolean',
      fieldset: 'layout',
      initialValue: false,
    },
  ];
}

/** Heading + eyebrow that most sections open with. Both optional. */
export function headingFields() {
  return [
    localizedString('eyebrow', 'Section Label (Eyebrow)', {
      max: 40,
      description: 'Small uppercase label above the heading',
    }),
    localizedString('heading', 'Heading', { max: 90 }),
  ];
}

export function sectionPreview(subtitle: string) {
  return {
    select: { heading: 'heading.pl', headingEn: 'heading.en', eyebrow: 'eyebrow.pl' },
    prepare(selection: any) {
      return {
        title: selection.heading || selection.headingEn || selection.eyebrow || subtitle,
        subtitle,
      };
    },
  };
}
